import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const recordCall = internalMutation({
  args: {
    kind: v.union(
      v.literal("llm"),
      v.literal("embedding"),
      v.literal("email"),
      v.literal("push"),
      v.literal("storage"),
      v.literal("search"),
      v.literal("billing"),
      v.literal("crm"),
      v.literal("other"),
    ),
    provider: v.string(),
    model: v.optional(v.string()),
    purpose: v.string(),
    userId: v.optional(v.id("users")),
    organisationId: v.optional(v.id("organisations")),
    agentPersonaId: v.optional(v.id("coach_personas")),
    threadId: v.optional(v.string()),
    messageId: v.optional(v.string()),
    parentCallId: v.optional(v.id("external_call")),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    cachedTokens: v.optional(v.number()),
    costUsd: v.number(),
    reportedCostUsd: v.optional(v.number()),
    costDetail: v.optional(v.any()),
    state: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("timeout"),
    ),
    latencyMs: v.number(),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    providerRequestId: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"external_call">> => {
    if (args.providerRequestId) {
      const existing = await ctx.db
        .query("external_call")
        .withIndex("by_request", (q) =>
          q.eq("providerRequestId", args.providerRequestId),
        )
        .first();
      if (existing) return existing._id;
    }
    return await ctx.db.insert("external_call", args);
  },
});

export const recordAudit = internalMutation({
  args: {
    action: v.string(),
    actorUserId: v.optional(v.id("users")),
    actorLabel: v.optional(v.string()),
    organisationId: v.optional(v.id("organisations")),
    subjectType: v.optional(v.string()),
    subjectId: v.optional(v.string()),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<Id<"audit_log">> => {
    return await ctx.db.insert("audit_log", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const priceForModel = internalQuery({
  args: { modelSlug: v.string(), at: v.number() },
  handler: async (ctx, { modelSlug, at }) => {
    const candidates = await ctx.db
      .query("model_pricing")
      .withIndex("by_model", (q) => q.eq("modelSlug", modelSlug))
      .collect();
    const applicable = candidates
      .filter((p) => p.effectiveFrom <= at && (p.effectiveTo === undefined || p.effectiveTo > at))
      .sort((a, b) => b.effectiveFrom - a.effectiveFrom);
    return applicable[0] ?? null;
  },
});
