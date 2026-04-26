import { v } from "convex/values";
import { action, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";

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

// One-page stat snapshot — Convex caps a query at 16MB per call, and
// 1334 rows of activity_kinds blow that on a `.collect()`. The action
// `debugStats` below loops this through pages for an exact total.
export const debugStatsPaged = internalQuery({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    pageSize: v.number(),
  },
  handler: async (ctx, { cursor, pageSize }) => {
    const r = await ctx.db
      .query("activity_kinds")
      .paginate({ numItems: pageSize, cursor: cursor ?? null });
    let copa = 0;
    let synthetic = 0;
    let withPlatform = 0;
    let needsReview = 0;
    for (const row of r.page) {
      if (row.source === "copa") copa++;
      if (row.source === "platform_only") synthetic++;
      if (row.platformTypes.length > 0) withPlatform++;
      if (row.needsReview) needsReview++;
    }
    return {
      pageLen: r.page.length,
      copa,
      synthetic,
      withPlatform,
      needsReview,
      isDone: r.isDone,
      continueCursor: r.continueCursor,
    };
  },
});

export const debugStats = action({
  args: {},
  handler: async (ctx) => {
    let cursor: string | null = null;
    let total = 0;
    let copa = 0;
    let synthetic = 0;
    let withPlatform = 0;
    let needsReview = 0;
    for (let i = 0; i < 50; i++) {
      const page: {
        pageLen: number;
        copa: number;
        synthetic: number;
        withPlatform: number;
        needsReview: number;
        isDone: boolean;
        continueCursor: string;
      } = await ctx.runQuery(internal.activityKinds.debugStatsPaged, {
        cursor,
        pageSize: 200,
      });
      total += page.pageLen;
      copa += page.copa;
      synthetic += page.synthetic;
      withPlatform += page.withPlatform;
      needsReview += page.needsReview;
      if (page.isDone) break;
      cursor = page.continueCursor;
    }
    return { total, copa, synthetic, withPlatform, needsReview };
  },
});
