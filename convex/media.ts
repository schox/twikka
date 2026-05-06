import { v } from "convex/values";
import {
  mutation,
  query,
  internalQuery,
} from "./_generated/server";
import { r2 } from "./r2";
import { requireUser } from "./lib/auth";

const kindValidator = v.union(
  v.literal("user_photo"),
  v.literal("coach_avatar"),
  v.literal("attachment"),
  v.literal("source_document"),
);

// Default signed-URL TTL for read access. 24h is comfortably longer
// than a typical session — the cached_network_image cache stays warm
// without re-fetching across screen visits, and the user record's
// reactive subscription refreshes the URL whenever the underlying
// `media` row changes anyway.
const DOWNLOAD_TTL_SECONDS = 60 * 60 * 24;

// ── Public API ──────────────────────────────────────────────────────

/**
 * Step 1 of the upload flow. The client tells us *what* it wants to
 * upload (kind + mime + size); we generate an R2 object key, get a
 * signed PUT URL from R2, and pre-allocate a `media` row in `pending`
 * status. The client then PUTs the bytes directly to the URL and
 * calls [finalizeUpload] with the returned mediaId.
 *
 * `sizeBytes` here is what the client *says* it'll upload — we don't
 * trust it for billing or quota; it's just a hint.
 */
export const generateUploadUrl = mutation({
  args: {
    kind: kindValidator,
    mimeType: v.string(),
    sizeBytes: v.number(),
  },
  handler: async (ctx, { kind, mimeType, sizeBytes }) => {
    const { user } = await requireUser(ctx);

    const { key, url } = await r2.generateUploadUrl();
    const mediaId = await ctx.db.insert("media", {
      userId: user._id,
      organisationId: user.organisationId,
      kind,
      r2Key: key,
      mimeType,
      sizeBytes,
      status: "pending",
      createdAt: Date.now(),
    });

    return { uploadUrl: url, mediaId, r2Key: key };
  },
});

/**
 * Step 2 of the upload flow. After the client's PUT to R2 returns
 * 200, it calls this to flip the `media` row from `pending` to
 * `active`. For `user_photo`, the previous active photo (if any) is
 * marked `orphaned` and the user's `photoMediaId` is patched to the
 * new row. Idempotent — re-calling with an already-active row is a
 * no-op.
 */
export const finalizeUpload = mutation({
  args: { mediaId: v.id("media") },
  handler: async (ctx, { mediaId }) => {
    const { user } = await requireUser(ctx);
    const media = await ctx.db.get(mediaId);
    if (!media) throw new Error("Media not found");
    if (media.userId !== user._id) throw new Error("Not your upload");
    if (media.status === "active") return; // idempotent
    if (media.status === "orphaned") {
      throw new Error("Media has been superseded");
    }

    if (media.kind === "user_photo") {
      const previousActive = await ctx.db
        .query("media")
        .withIndex("by_user_kind", (q) =>
          q.eq("userId", user._id).eq("kind", "user_photo"),
        )
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();
      for (const old of previousActive) {
        await ctx.db.patch(old._id, { status: "orphaned" });
      }
      await ctx.db.patch(user._id, {
        photoMediaId: mediaId,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.patch(mediaId, { status: "active" });
  },
});

/**
 * Discard a still-pending upload (the client cancelled, or the PUT
 * failed). Owner-checked, idempotent. Does NOT touch active media —
 * use a separate flow when we want active-photo deletion.
 */
export const cancelUpload = mutation({
  args: { mediaId: v.id("media") },
  handler: async (ctx, { mediaId }) => {
    const { user } = await requireUser(ctx);
    const media = await ctx.db.get(mediaId);
    if (!media) return;
    if (media.userId !== user._id) throw new Error("Not your upload");
    if (media.status !== "pending") return;
    await ctx.db.delete(mediaId);
  },
});

/**
 * Resolve a media row to a signed download URL. Owner-checked — only
 * the uploader can fetch (extend later for shared groups / coach
 * avatars when those land).
 */
export const getDownloadUrl = query({
  args: { mediaId: v.id("media") },
  handler: async (ctx, { mediaId }) => {
    const { user } = await requireUser(ctx);
    const media = await ctx.db.get(mediaId);
    if (!media) return null;
    if (media.userId !== user._id) return null;
    if (media.status !== "active") return null;
    return await r2.getUrl(media.r2Key, { expiresIn: DOWNLOAD_TTL_SECONDS });
  },
});

// ── Internal helpers ────────────────────────────────────────────────

/**
 * Look up a media row + signed URL by id, with no auth check. Used
 * by queries that have already verified the caller (e.g.
 * `users:current`) or by queries serving public-by-design content
 * (`coachPersonas:listActive`). Returns null if missing or not active.
 *
 * Returns r2Key alongside url because the signed URL rotates on every
 * call (different signature each time) but r2Key is stable per image —
 * the client uses r2Key as CachedNetworkImage's cacheKey so the local
 * cache stays warm across URL rotations.
 */
export const _resolveMediaUrl = internalQuery({
  args: { mediaId: v.id("media") },
  handler: async (ctx, { mediaId }) => {
    const media = await ctx.db.get(mediaId);
    if (!media || media.status !== "active") return null;
    const url = await r2.getUrl(media.r2Key, {
      expiresIn: DOWNLOAD_TTL_SECONDS,
    });
    return {
      url,
      r2Key: media.r2Key,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
    };
  },
});

