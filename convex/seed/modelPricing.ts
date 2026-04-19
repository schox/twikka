import { internalMutation } from "../_generated/server";

type PriceSeed = {
  modelSlug: string;
  provider: string;
  inputCostPer1kUsd: number;
  outputCostPer1kUsd: number;
  cachedInputCostPer1kUsd?: number;
  embeddingCostPer1kUsd?: number;
};

const SEEDS: PriceSeed[] = [
  {
    modelSlug: "anthropic/claude-haiku-4.5",
    provider: "openrouter",
    inputCostPer1kUsd: 0.001,
    outputCostPer1kUsd: 0.005,
    cachedInputCostPer1kUsd: 0.0001,
  },
  {
    modelSlug: "anthropic/claude-sonnet-4.6",
    provider: "openrouter",
    inputCostPer1kUsd: 0.003,
    outputCostPer1kUsd: 0.015,
    cachedInputCostPer1kUsd: 0.0003,
  },
  {
    modelSlug: "anthropic/claude-opus-4.7",
    provider: "openrouter",
    inputCostPer1kUsd: 0.015,
    outputCostPer1kUsd: 0.075,
    cachedInputCostPer1kUsd: 0.0015,
  },
  {
    modelSlug: "openai/text-embedding-3-small",
    provider: "openrouter",
    inputCostPer1kUsd: 0.00002,
    outputCostPer1kUsd: 0,
    embeddingCostPer1kUsd: 0.00002,
  },
];

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const inserted: string[] = [];

    for (const s of SEEDS) {
      const existingRows = await ctx.db
        .query("model_pricing")
        .withIndex("by_model", (q) => q.eq("modelSlug", s.modelSlug))
        .collect();
      const hasOpenEntry = existingRows.some((r) => r.effectiveTo === undefined);
      if (hasOpenEntry) continue;

      await ctx.db.insert("model_pricing", {
        ...s,
        effectiveFrom: now,
      });
      inserted.push(s.modelSlug);
    }

    return { inserted };
  },
});
