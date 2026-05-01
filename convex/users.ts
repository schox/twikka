import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { requireIdentity } from "./lib/auth";

type CurrentUserResult =
  | (Doc<"users"> & {
      city: {
        _id: Id<"cities">;
        name: string;
        asciiname: string;
        countryCode: string;
        timezone: string;
      } | null;
      photoUrl: string | null;
    })
  | null;

// Creates the organisations + users + memberships + audit trio for a brand-new
// Clerk identity, or returns the existing user row if one already exists for
// this clerkId. Idempotent on clerkId.
async function _upsert(
  ctx: MutationCtx,
  args: {
    clerkId: string;
    email: string;
    displayName?: string;
    actorLabel: string;
  },
): Promise<Id<"users">> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
    .first();

  const now = Date.now();

  if (existing) {
    const before = {
      email: existing.email,
      displayName: existing.displayName,
    };
    const after = { email: args.email, displayName: args.displayName };
    const changed = before.email !== after.email ||
      before.displayName !== after.displayName;
    if (changed) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        displayName: args.displayName,
        updatedAt: now,
      });
      await ctx.runMutation(internal.audit.recordAudit, {
        action: "users.updateFromClerk",
        actorUserId: existing._id,
        actorLabel: args.actorLabel,
        organisationId: existing.organisationId,
        subjectType: "users",
        subjectId: existing._id,
        before,
        after,
      });
    }
    return existing._id;
  }

  const orgName = args.displayName?.trim().length
    ? args.displayName.trim()
    : args.email;

  const organisationId = await ctx.db.insert("organisations", {
    name: orgName,
    kind: "individual",
    createdAt: now,
  });

  const userId = await ctx.db.insert("users", {
    clerkId: args.clerkId,
    organisationId,
    email: args.email,
    displayName: args.displayName,
    lifecycleStage: "active_trial",
    suspended: false,
    tester: false,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("memberships", {
    userId,
    organisationId,
    role: "owner",
    createdAt: now,
  });

  await ctx.runMutation(internal.audit.recordAudit, {
    action: "users.createFromClerk",
    actorUserId: userId,
    actorLabel: args.actorLabel,
    organisationId,
    subjectType: "users",
    subjectId: userId,
    after: {
      email: args.email,
      displayName: args.displayName,
      organisationId,
    },
  });

  return userId;
}

// Invoked by the Clerk webhook on user.created / user.updated.
export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    actorLabel: v.string(),
  },
  handler: async (ctx, args) => _upsert(ctx, args),
});

// Invoked by the Clerk webhook on user.deleted. Soft-delete: we set
// lifecycleStage rather than nuking the row so downstream tables
// (threads, activities, audit_log) remain scoped to a resolvable userId.
export const markDeletedFromClerk = internalMutation({
  args: { clerkId: v.string(), actorLabel: v.string() },
  handler: async (ctx, { clerkId, actorLabel }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
      .first();
    if (!user) return;

    const before = {
      lifecycleStage: user.lifecycleStage,
      deletionRequestedAt: user.deletionRequestedAt,
    };
    const now = Date.now();
    await ctx.db.patch(user._id, {
      lifecycleStage: "deleted",
      deletionRequestedAt: now,
      updatedAt: now,
    });

    await ctx.runMutation(internal.audit.recordAudit, {
      action: "users.deleteFromClerk",
      actorUserId: user._id,
      actorLabel,
      organisationId: user.organisationId,
      subjectType: "users",
      subjectId: user._id,
      before,
      after: {
        lifecycleStage: "deleted",
        deletionRequestedAt: now,
      },
    });
  },
});

// Public mutation the app calls right after it receives a Clerk session, so a
// users row exists even if the webhook hasn't arrived yet (race on fresh
// signup) or never fires (pre-existing Clerk accounts from before the webhook
// was wired). Idempotent — no-ops if the row already matches.
export const ensureFromIdentity = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const email = identity.email;
    if (!email) {
      // The Clerk session token does not carry `email` unless the Sessions
      // page in the Clerk dashboard is configured to inject it. Without it
      // the upsert would violate the users schema. Skip silently — the
      // webhook is the primary provisioning path and already has the email.
      // Look up the existing row (if any) so the caller can resolve it.
      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
        .first();
      return existing?._id ?? null;
    }

    return _upsert(ctx, {
      clerkId: identity.subject,
      email,
      displayName: identity.givenName ?? identity.name,
      actorLabel: "flutter:ensureFromIdentity",
    });
  },
});

// Dev-only knob for flipping the tester flag on a specific user.
// Public so we can flip it via `npx convex run` / MCP without
// dashboard access. This is acceptable because tester just gates the
// in-app Debug entry — no privilege escalation. Will be locked behind
// an admin role once we have one.
export const setTesterByEmail = mutation({
  args: { email: v.string(), value: v.boolean() },
  handler: async (ctx, { email, value }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (!user) throw new Error(`No user with email ${email}`);
    await ctx.db.patch(user._id, { tester: value, updatedAt: Date.now() });
    return { ok: true };
  },
});

// Live query the app subscribes to for the current user's row. Embeds
// the current city (if any) and the resolved profile photo URL so
// Settings → Profile and the various avatar surfaces render without
// extra join requests.
//
// Throws on missing identity rather than returning null. Returning null
// would conflate "JWT expired" with "no user row", which surfaces as a
// stale/empty Profile while the subscription is silently broken.
export const current = query({
  args: {},
  handler: async (ctx): Promise<CurrentUserResult> => {
    const identity = await requireIdentity(ctx);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;
    const city = user.cityId ? await ctx.db.get(user.cityId) : null;
    // Annotated to break TypeScript's circular inference through
    // `internal.media._resolveMediaUrl` — without this, both `current`
    // and its handler infer as `any`, since the api.d.ts type graph
    // refers back into this file.
    const photo: { url: string; mimeType: string; sizeBytes: number } | null =
      user.photoMediaId
        ? await ctx.runQuery(internal.media._resolveMediaUrl, {
            mediaId: user.photoMediaId,
          })
        : null;
    return {
      ...user,
      city: city
        ? {
            _id: city._id,
            name: city.name,
            asciiname: city.asciiname,
            countryCode: city.countryCode,
            timezone: city.timezone,
          }
        : null,
      photoUrl: photo?.url ?? null,
    };
  },
});
