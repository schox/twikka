import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { recordedEmbeddingBatch } from "../lib/openrouter";
import type { Id } from "../_generated/dataModel";

// Embed each activity_kinds row's "name · headingName · aliases" into
// the by_embedding vector index. Idempotent: rows that already have an
// embedding are skipped.

const BATCH_SIZE = 100; // OpenRouter accepts arrays — one HTTP call per batch.

function inputFor(row: {
  name: string;
  headingName: string;
  aliases: string[];
}): string {
  const parts = [row.name, row.headingName];
  if (row.aliases.length > 0) parts.push(row.aliases.join(", "));
  return parts.join(" · ");
}

// Paginated read — Convex doesn't support "where embedding is null"
// without a dedicated index, and collect()ing 1334 rows blows the
// per-function byte limit. We page through and let the caller filter.
export const pageUnembedded = internalQuery({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    pageSize: v.number(),
  },
  handler: async (ctx, { cursor, pageSize }) => {
    const result = await ctx.db
      .query("activity_kinds")
      .paginate({ numItems: pageSize, cursor: cursor ?? null });
    return {
      isDone: result.isDone,
      continueCursor: result.continueCursor,
      rows: result.page
        .filter((r) => r.embedding === undefined)
        .map((r) => ({
          _id: r._id,
          name: r.name,
          headingName: r.headingName,
          aliases: r.aliases,
        })),
    };
  },
});

export const writeEmbeddings = internalMutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("activity_kinds"),
        embedding: v.array(v.float64()),
      }),
    ),
  },
  handler: async (ctx, { items }) => {
    const now = Date.now();
    for (const item of items) {
      await ctx.db.patch(item.id, {
        embedding: item.embedding,
        updatedAt: now,
      });
    }
  },
});

export const fetchSystemConfig = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("system_config").first();
  },
});

// Cheap debug query — paginate page by page just counting embedded /
// unembedded without returning rows. Useful to verify backfill state.
export const countEmbeddedPaged = internalQuery({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    pageSize: v.number(),
  },
  handler: async (ctx, { cursor, pageSize }) => {
    const r = await ctx.db
      .query("activity_kinds")
      .paginate({ numItems: pageSize, cursor: cursor ?? null });
    let embedded = 0;
    let unembedded = 0;
    for (const row of r.page) {
      if (row.embedding === undefined) unembedded++;
      else embedded++;
    }
    return {
      pageLen: r.page.length,
      embedded,
      unembedded,
      isDone: r.isDone,
      continueCursor: r.continueCursor,
    };
  },
});

export const countEmbedded = action({
  args: {},
  handler: async (ctx): Promise<{
    totalEmbedded: number;
    totalUnembedded: number;
    pages: number;
  }> => {
    let cursor: string | null = null;
    let totalEmbedded = 0;
    let totalUnembedded = 0;
    let pages = 0;
    while (pages < 50) {
      // Annotated to break circular type inference through `internal`.
      const page: {
        pageLen: number;
        embedded: number;
        unembedded: number;
        isDone: boolean;
        continueCursor: string;
      } = await ctx.runQuery(
        internal.seed.activityKindEmbeddings.countEmbeddedPaged,
        { cursor, pageSize: 200 },
      );
      totalEmbedded += page.embedded;
      totalUnembedded += page.unembedded;
      pages += 1;
      if (page.isDone) break;
      cursor = page.continueCursor;
    }
    return { totalEmbedded, totalUnembedded, pages };
  },
});

// Public action so we can kick it off via `npx convex run` or MCP. Loops
// over unembedded rows until none are left or the action's wall-clock
// gets uncomfortable. For 1334 rows at batch=100 it takes ~14 iterations.
export const backfill = action({
  args: { maxBatches: v.optional(v.number()) },
  handler: async (
    ctx,
    { maxBatches },
  ): Promise<{ totalEmbedded: number; batches: number; isDone: boolean }> => {
    const cap = maxBatches ?? 30;
    const cfg = await ctx.runQuery(internal.seed.activityKindEmbeddings.fetchSystemConfig, {});
    if (!cfg) throw new Error("system_config singleton missing");
    const model = cfg.models.embedding;

    let totalEmbedded = 0;
    let batches = 0;
    let cursor: string | null = null;
    let isDone = false;
    while (!isDone && batches < cap) {
      // Annotated to break circular type inference through `internal`.
      const page: {
        isDone: boolean;
        continueCursor: string;
        rows: Array<{
          _id: Id<"activity_kinds">;
          name: string;
          headingName: string;
          aliases: string[];
        }>;
      } = await ctx.runQuery(
        internal.seed.activityKindEmbeddings.pageUnembedded,
        { cursor, pageSize: BATCH_SIZE },
      );
      cursor = page.continueCursor;
      isDone = page.isDone;
      if (page.rows.length === 0) {
        // No unembedded rows in this page; advance the cursor.
        continue;
      }

      const inputs = page.rows.map(inputFor);
      const { embeddings } = await recordedEmbeddingBatch(ctx, {
        model,
        inputs,
        purpose: "activity_kinds.backfill",
      });
      if (embeddings.length !== page.rows.length) {
        throw new Error(
          `OpenRouter returned ${embeddings.length} embeddings for ${page.rows.length} inputs`,
        );
      }

      const items = page.rows.map((r, i) => ({
        id: r._id as Id<"activity_kinds">,
        embedding: embeddings[i],
      }));
      await ctx.runMutation(
        internal.seed.activityKindEmbeddings.writeEmbeddings,
        { items },
      );
      totalEmbedded += page.rows.length;
      batches += 1;
    }
    return { totalEmbedded, batches, isDone };
  },
});
