import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

// Shared validators.
const sourceValidator = v.union(
  v.literal("apple_hk"),
  v.literal("health_connect"),
  v.literal("manual"),
);

const incomingActivity = v.object({
  source: sourceValidator,
  externalId: v.optional(v.string()),
  platformType: v.optional(v.string()),
  startTime: v.number(),
  endTime: v.number(),
  durationMin: v.number(),
  distanceMeters: v.optional(v.number()),
  caloriesKcal: v.optional(v.number()),
  metsEstimate: v.optional(v.number()),
  userNote: v.optional(v.string()),
});

// ── Helpers ────────────────────────────────────────────────────────────

async function findKindByPlatformType(
  ctx: { db: { query: typeof internalQuery extends never ? never : ReturnType<typeof internalMutation>["_typeguard"] } | any },
  platformType: string,
): Promise<Id<"activity_kinds"> | null> {
  // Linear scan, but most cases short-circuit early because we paginate.
  // platformTypes is an array of HealthWorkoutActivityType strings on
  // each row; we need to find one that includes this string.
  let cursor: string | null = null;
  for (let i = 0; i < 20; i++) {
    const r = await ctx.db
      .query("activity_kinds")
      .paginate({ numItems: 200, cursor });
    for (const row of r.page) {
      if (row.platformTypes.includes(platformType)) {
        return row._id as Id<"activity_kinds">;
      }
    }
    if (r.isDone) break;
    cursor = r.continueCursor;
  }
  return null;
}

// ── Internal queries / mutations the actions / Flutter use ─────────────

export const userByClerk = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

export const findKindForPlatformType = internalQuery({
  args: { platformType: v.string() },
  handler: async (ctx, { platformType }) => {
    return await findKindByPlatformType(ctx, platformType);
  },
});

export const upsertOne = internalMutation({
  args: {
    userId: v.id("users"),
    organisationId: v.id("organisations"),
    activity: incomingActivity,
    activityKindId: v.optional(v.id("activity_kinds")),
  },
  handler: async (ctx, { userId, organisationId, activity, activityKindId }) => {
    const now = Date.now();
    let existing: Doc<"activities"> | null = null;
    if (activity.externalId) {
      existing = await ctx.db
        .query("activities")
        .withIndex("by_user_source_external", (q) =>
          q
            .eq("userId", userId)
            .eq("source", activity.source)
            .eq("externalId", activity.externalId),
        )
        .first();
    }

    if (existing) {
      // Idempotent — patch only fields that have changed.
      const patch: Partial<Doc<"activities">> = {};
      if (existing.startTime !== activity.startTime)
        patch.startTime = activity.startTime;
      if (existing.endTime !== activity.endTime)
        patch.endTime = activity.endTime;
      if (existing.durationMin !== activity.durationMin)
        patch.durationMin = activity.durationMin;
      if (
        activity.distanceMeters !== undefined &&
        existing.distanceMeters !== activity.distanceMeters
      ) {
        patch.distanceMeters = activity.distanceMeters;
      }
      if (
        activity.caloriesKcal !== undefined &&
        existing.caloriesKcal !== activity.caloriesKcal
      ) {
        patch.caloriesKcal = activity.caloriesKcal;
      }
      if (activityKindId && existing.activityKindId !== activityKindId) {
        patch.activityKindId = activityKindId;
        patch.needsReview = false;
      }
      if (Object.keys(patch).length > 0) {
        patch.updatedAt = now;
        await ctx.db.patch(existing._id, patch);
        return { status: "updated" as const, id: existing._id };
      }
      return { status: "skipped" as const, id: existing._id };
    }

    const id = await ctx.db.insert("activities", {
      userId,
      organisationId,
      source: activity.source,
      externalId: activity.externalId,
      activityKindId,
      platformType: activity.platformType,
      startTime: activity.startTime,
      endTime: activity.endTime,
      durationMin: activity.durationMin,
      distanceMeters: activity.distanceMeters,
      caloriesKcal: activity.caloriesKcal,
      metsEstimate: activity.metsEstimate,
      userNote: activity.userNote,
      acknowledged: false,
      needsReview: activityKindId ? false : true,
      createdAt: now,
      updatedAt: now,
    });
    return { status: "inserted" as const, id };
  },
});

export const setHealthSource = internalMutation({
  args: {
    userId: v.id("users"),
    source: v.optional(sourceValidator),
    lastSyncAt: v.optional(v.number()),
  },
  handler: async (ctx, { userId, source, lastSyncAt }) => {
    await ctx.db.patch(userId, {
      healthSource: source,
      lastHealthSyncAt: lastSyncAt,
      updatedAt: Date.now(),
    });
  },
});

// ── Public surface ─────────────────────────────────────────────────────

// Batched ingest from Flutter. Returns counts so the client can render
// a sync summary. Each row is dedupe-keyed by externalId; rows without
// one are always inserted (manual entries).
export const upsertBatch = mutation({
  args: {
    activities: v.array(incomingActivity),
    advanceLastSyncTo: v.optional(v.number()),
    setSource: v.optional(sourceValidator),
  },
  handler: async (ctx, { activities, advanceLastSyncTo, setSource }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("upsertBatch called without auth");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("No users row");

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const activity of activities) {
      let kindId: Id<"activity_kinds"> | undefined;
      if (activity.platformType) {
        const found = await findKindByPlatformType(ctx, activity.platformType);
        if (found) kindId = found;
      }
      const result: { status: "inserted" | "updated" | "skipped" } =
        await ctx.runMutation(internal.activities.upsertOne, {
          userId: user._id,
          organisationId: user.organisationId,
          activity,
          activityKindId: kindId,
        });
      if (result.status === "inserted") inserted++;
      else if (result.status === "updated") updated++;
      else skipped++;
    }

    if (advanceLastSyncTo !== undefined || setSource !== undefined) {
      const patch: { healthSource?: typeof setSource; lastHealthSyncAt?: number; updatedAt: number } =
        { updatedAt: Date.now() };
      if (setSource !== undefined) patch.healthSource = setSource;
      if (advanceLastSyncTo !== undefined) {
        patch.lastHealthSyncAt = Math.max(
          user.lastHealthSyncAt ?? 0,
          advanceLastSyncTo,
        );
      }
      await ctx.db.patch(user._id, patch);
    }

    return { inserted, updated, skipped };
  },
});

// Disconnect a source. Optionally wipes all activities tagged with it
// so the user gets a clean slate when they reconnect (or never do).
export const disconnectSource = mutation({
  args: {
    source: sourceValidator,
    deleteActivities: v.boolean(),
  },
  handler: async (ctx, { source, deleteActivities }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("disconnectSource called without auth");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("No users row");

    let deleted = 0;
    if (deleteActivities) {
      const rows = await ctx.db
        .query("activities")
        .withIndex("by_user_source", (q) =>
          q.eq("userId", user._id).eq("source", source),
        )
        .collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
        deleted++;
      }
    }

    if (user.healthSource === source) {
      await ctx.db.patch(user._id, {
        healthSource: undefined,
        lastHealthSyncAt: undefined,
        updatedAt: Date.now(),
      });
    }

    await ctx.runMutation(internal.audit.recordAudit, {
      action: "activities.disconnectSource",
      actorUserId: user._id,
      actorLabel: "flutter:disconnectSource",
      organisationId: user.organisationId,
      subjectType: "users",
      subjectId: user._id,
      after: { source, deletedActivities: deleted, wipe: deleteActivities },
    });

    return { deleted };
  },
});

// Recent activities for the debug feed (and Phase C's coach context).
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return [];

    const rows = await ctx.db
      .query("activities")
      .withIndex("by_user_time", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(Math.min(Math.max(limit ?? 25, 1), 100));

    // Resolve kind names for display.
    const kindIds = Array.from(
      new Set(
        rows
          .map((r) => r.activityKindId)
          .filter((id): id is Id<"activity_kinds"> => id !== undefined),
      ),
    );
    const kinds = await Promise.all(kindIds.map((id) => ctx.db.get(id)));
    const kindMap = new Map(
      kinds
        .filter((k): k is Doc<"activity_kinds"> => k !== null)
        .map((k) => [k._id, { name: k.name, headingName: k.headingName }]),
    );

    return rows.map((r) => ({
      _id: r._id,
      source: r.source,
      platformType: r.platformType,
      startTime: r.startTime,
      endTime: r.endTime,
      durationMin: r.durationMin,
      distanceMeters: r.distanceMeters,
      caloriesKcal: r.caloriesKcal,
      acknowledged: r.acknowledged,
      needsReview: r.needsReview,
      activityKindId: r.activityKindId,
      activityKindName: r.activityKindId
        ? kindMap.get(r.activityKindId)?.name ?? "(unresolved)"
        : null,
      activityKindHeading: r.activityKindId
        ? kindMap.get(r.activityKindId)?.headingName ?? null
        : null,
    }));
  },
});

// Counts grouped by source for Settings → Health.
export const countsBySource = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        apple_hk: 0,
        health_connect: 0,
        manual: 0,
        healthSource: null,
        lastHealthSyncAt: null,
      };
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) {
      return {
        apple_hk: 0,
        health_connect: 0,
        manual: 0,
        healthSource: null,
        lastHealthSyncAt: null,
      };
    }

    async function countFor(
      source: "apple_hk" | "health_connect" | "manual",
    ): Promise<number> {
      const rows = await ctx.db
        .query("activities")
        .withIndex("by_user_source", (q) =>
          q.eq("userId", user!._id).eq("source", source),
        )
        .take(2000);
      return rows.length;
    }

    return {
      apple_hk: await countFor("apple_hk"),
      health_connect: await countFor("health_connect"),
      manual: await countFor("manual"),
      healthSource: user.healthSource ?? null,
      lastHealthSyncAt: user.lastHealthSyncAt ?? null,
    };
  },
});
