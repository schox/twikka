import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("system_config").first();
  },
});

export const setAvailability = mutation({
  args: {
    available: v.boolean(),
    unavailableReason: v.optional(v.string()),
    estimatedBackOnline: v.optional(v.number()),
    actorLabel: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.query("system_config").first();
    if (!doc) throw new Error("system_config singleton is missing");

    const before = {
      available: doc.available,
      unavailableReason: doc.unavailableReason,
      estimatedBackOnline: doc.estimatedBackOnline,
    };
    const after = {
      available: args.available,
      unavailableReason: args.unavailableReason,
      estimatedBackOnline: args.estimatedBackOnline,
    };

    await ctx.db.patch(doc._id, {
      ...after,
      updatedBy: args.actorLabel,
      updatedAt: Date.now(),
    });

    await ctx.runMutation(internal.audit.recordAudit, {
      action: "system_config.setAvailability",
      actorLabel: args.actorLabel,
      subjectType: "system_config",
      subjectId: doc._id,
      before,
      after,
    });
  },
});
