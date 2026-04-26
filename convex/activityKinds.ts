import { v } from "convex/values";
import { query } from "./_generated/server";

// Debug-screen browser. Returns up to `limit` activity_kinds rows,
// optionally filtered. The search index is keyed off `name` so a
// non-empty `q` runs that path; otherwise we just collect.
export const debugList = query({
  args: {
    q: v.optional(v.string()),
    filter: v.optional(
      v.union(
        v.literal("all"),
        v.literal("synthetic"),
        v.literal("withPlatform"),
        v.literal("needsReview"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { q, filter, limit }) => {
    const cap = Math.min(Math.max(limit ?? 50, 1), 200);
    const trimmed = q?.trim() ?? "";

    let rows;
    if (trimmed.length > 0) {
      rows = await ctx.db
        .query("activity_kinds")
        .withSearchIndex("by_name", (b) => b.search("name", trimmed))
        .take(cap * 2); // overfetch to allow filter trimming
    } else {
      rows = await ctx.db.query("activity_kinds").take(cap * 4);
    }

    const f = filter ?? "all";
    const filtered = rows.filter((r) => {
      if (f === "synthetic") return r.source === "platform_only";
      if (f === "withPlatform") return r.platformTypes.length > 0;
      if (f === "needsReview") return r.needsReview;
      return true;
    });
    return filtered.slice(0, cap);
  },
});

// Aggregate stats for the debug header — total rows, per-source counts,
// per-flag counts. Cheap because we collect all rows in one pass.
export const debugStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("activity_kinds").collect();
    let copa = 0;
    let synthetic = 0;
    let withPlatform = 0;
    let needsReview = 0;
    for (const r of all) {
      if (r.source === "copa") copa++;
      if (r.source === "platform_only") synthetic++;
      if (r.platformTypes.length > 0) withPlatform++;
      if (r.needsReview) needsReview++;
    }
    return { total: all.length, copa, synthetic, withPlatform, needsReview };
  },
});
