import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib/auth";

const sourceValidator = v.union(
  v.literal("apple_hk"),
  v.literal("health_connect"),
  v.literal("manual"),
);

const summaryEntry = v.object({
  date: v.string(), // YYYY-MM-DD
  stepCount: v.number(),
});

// Idempotent per (userId, source, date). Re-syncing an overlapping
// window patches the row in place; new days get inserted.
export const upsertBatch = mutation({
  args: {
    source: sourceValidator,
    entries: v.array(summaryEntry),
  },
  handler: async (ctx, { source, entries }) => {
    const { user } = await requireUser(ctx);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const now = Date.now();
    for (const entry of entries) {
      const existing = await ctx.db
        .query("daily_summaries")
        .withIndex("by_user_source_date", (q) =>
          q.eq("userId", user._id).eq("source", source).eq("date", entry.date),
        )
        .first();
      if (existing) {
        if (existing.stepCount === entry.stepCount) {
          skipped++;
          continue;
        }
        await ctx.db.patch(existing._id, {
          stepCount: entry.stepCount,
          updatedAt: now,
        });
        updated++;
      } else {
        await ctx.db.insert("daily_summaries", {
          userId: user._id,
          organisationId: user.organisationId,
          date: entry.date,
          source,
          stepCount: entry.stepCount,
          createdAt: now,
          updatedAt: now,
        });
        inserted++;
      }
    }
    return { inserted, updated, skipped };
  },
});

// Last N days of summaries for the current user, latest first. Used by
// Settings → Debug to verify daily totals.
export const recent = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, { days }) => {
    const { user } = await requireUser(ctx);

    const cap = Math.min(Math.max(days ?? 14, 1), 90);
    const rows = await ctx.db
      .query("daily_summaries")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(cap * 3); // overfetch — multiple sources per date
    return rows.map((r) => ({
      _id: r._id,
      date: r.date,
      source: r.source,
      stepCount: r.stepCount,
    }));
  },
});
