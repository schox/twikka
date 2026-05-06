import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalMutation,
  mutation,
  query,
  type QueryCtx,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireIdentity, requireUser } from "./lib/auth";

// Shape returned to clients. Carries the resolved avatar URL +
// stable cacheKey (r2Key) so the Flutter side can render with
// CachedNetworkImage and stay warm across signed-URL rotations.
type PersonaWithAvatar = Doc<"coach_personas"> & {
  avatarUrl: string | null;
  avatarCacheKey: string | null;
};

async function _attachAvatar(
  ctx: QueryCtx,
  persona: Doc<"coach_personas">,
): Promise<PersonaWithAvatar> {
  // Annotated to break TypeScript's circular inference through
  // internal.media._resolveMediaUrl, mirroring users:current.
  const photo: {
    url: string;
    r2Key: string;
    mimeType: string;
    sizeBytes: number;
  } | null = persona.avatarMediaId
    ? await ctx.runQuery(internal.media._resolveMediaUrl, {
        mediaId: persona.avatarMediaId,
      })
    : null;
  return {
    ...persona,
    avatarUrl: photo?.url ?? null,
    avatarCacheKey: photo?.r2Key ?? null,
  };
}

export const listActive = query({
  args: {},
  handler: async (ctx): Promise<PersonaWithAvatar[]> => {
    const personas = await ctx.db
      .query("coach_personas")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
    return Promise.all(personas.map((p) => _attachAvatar(ctx, p)));
  },
});

/// The persona the current user is assigned to, or null if they haven't
/// picked yet. Drives the router's onboarding redirect (no assignment →
/// /onboarding/coach) and the chat header.
///
/// Throws on missing identity rather than returning null — otherwise the
/// router can't distinguish "JWT expired mid-session" from "user has no
/// coach", and would falsely redirect to /onboarding/coach when auth is
/// merely stale. The Flutter subscription wrapper retries on error, so
/// the stream recovers once auth is refreshed.
export const currentForUser = query({
  args: {},
  handler: async (ctx): Promise<PersonaWithAvatar | null> => {
    const identity = await requireIdentity(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;
    const assignment = await ctx.db
      .query("coachAssignment")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!assignment) return null;
    const persona = await ctx.db.get(assignment.coachPersonaId);
    if (!persona) return null;
    return _attachAvatar(ctx, persona);
  },
});

/// Assign or change the user's coach. Idempotent — first call inserts,
/// subsequent calls patch the existing assignment. Audited.
export const assignCoach = mutation({
  args: { coachPersonaId: v.id("coach_personas") },
  handler: async (ctx, { coachPersonaId }) => {
    const { user } = await requireUser(ctx);

    const persona = await ctx.db.get(coachPersonaId);
    if (!persona) throw new Error("Unknown coach persona");
    if (!persona.active) throw new Error("Coach persona is not active");

    const now = Date.now();
    const existing = await ctx.db
      .query("coachAssignment")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    let action: "users.assignCoach" | "users.changeCoach";
    let before: { coachPersonaId: string } | undefined;

    if (existing) {
      if (existing.coachPersonaId === coachPersonaId) {
        // Idempotent no-op — same coach.
        return existing._id;
      }
      action = "users.changeCoach";
      before = { coachPersonaId: existing.coachPersonaId };
      await ctx.db.patch(existing._id, {
        coachPersonaId,
        assignedAt: now,
      });
    } else {
      action = "users.assignCoach";
      await ctx.db.insert("coachAssignment", {
        userId: user._id,
        organisationId: user.organisationId,
        coachPersonaId,
        assignedAt: now,
      });
    }

    await ctx.runMutation(internal.audit.recordAudit, {
      action,
      actorUserId: user._id,
      actorLabel: "flutter:assignCoach",
      organisationId: user.organisationId,
      subjectType: "coachAssignment",
      subjectId: user._id,
      before,
      after: { coachPersonaId, slug: persona.slug },
    });

    return existing?._id;
  },
});

/// Operator-only: registers an already-uploaded R2 object as the
/// coach_avatar for one persona. Idempotent — re-running with the
/// same slug + r2Key is safe; running with a new r2Key marks the
/// previous media row orphaned and points the persona at the new one.
///
/// Run after uploading bytes to R2 (via wrangler / dashboard / SDK).
/// Invoked from the CLI: `npx convex run coachPersonas:registerAvatarMedia
/// '{"slug":"priya","r2Key":"coaches/v1/priya.webp","mimeType":"image/webp","sizeBytes":21596}'`
///
/// Not auth-checked because it's an internalMutation — callable only
/// via the Convex dashboard / `npx convex run`, not from the client.
export const registerAvatarMedia = internalMutation({
  args: {
    slug: v.string(),
    r2Key: v.string(),
    mimeType: v.string(),
    sizeBytes: v.number(),
  },
  handler: async (
    ctx,
    { slug, r2Key, mimeType, sizeBytes },
  ): Promise<Id<"media">> => {
    const persona = await ctx.db
      .query("coach_personas")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!persona) throw new Error(`No coach_persona with slug "${slug}"`);

    const now = Date.now();
    const previous = persona.avatarMediaId
      ? await ctx.db.get(persona.avatarMediaId)
      : null;
    if (previous && previous.r2Key === r2Key && previous.status === "active") {
      // Already wired to this exact key — nothing to do.
      return previous._id;
    }

    const mediaId = await ctx.db.insert("media", {
      kind: "coach_avatar",
      r2Key,
      mimeType,
      sizeBytes,
      status: "active",
      createdAt: now,
    });

    if (previous && previous.status !== "orphaned") {
      await ctx.db.patch(previous._id, { status: "orphaned" });
    }

    await ctx.db.patch(persona._id, {
      avatarMediaId: mediaId,
      updatedAt: now,
    });

    return mediaId;
  },
});
