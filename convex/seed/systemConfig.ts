import { internalMutation } from "../_generated/server";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("system_config").first();
    if (existing) {
      return { status: "already-present" as const, id: existing._id };
    }
    const id = await ctx.db.insert("system_config", {
      available: true,
      minAppVersion: "1.0.0",
      updateLinks: {
        ios: "https://apps.apple.com/app/id0000000000",
        android: "https://play.google.com/store/apps/details?id=com.novansa.twikka",
      },
      models: {
        classifier: "anthropic/claude-haiku-4.5",
        general: "anthropic/claude-sonnet-4.6",
        deep: "anthropic/claude-opus-4.7",
        extractor: "anthropic/claude-haiku-4.5",
        embedding: "openai/text-embedding-3-small",
      },
      flags: {
        enableProactiveCoachMessages: true,
        enableBackgroundFactExtraction: true,
        enablePushNotifications: true,
        pauseGoHighLevelSync: false,
      },
      costBudgets: {
        perUserDailyUsdSoft: 0.5,
        perOrgDailyUsdSoft: 50.0,
        platformDailyUsdSoft: 500.0,
      },
      updatedBy: "seed",
      updatedAt: Date.now(),
    });
    return { status: "created" as const, id };
  },
});
