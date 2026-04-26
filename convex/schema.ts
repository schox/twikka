import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organisations: defineTable({
    name: v.string(),
    kind: v.union(
      v.literal("individual"),
      v.literal("affiliate"),
      v.literal("enterprise"),
    ),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  }).index("by_kind", ["kind"]),

  users: defineTable({
    clerkId: v.string(),
    organisationId: v.id("organisations"),
    email: v.string(),
    displayName: v.optional(v.string()),
    lifecycleStage: v.union(
      v.literal("active_trial"),
      v.literal("active_paying"),
      v.literal("payment_failed"),
      v.literal("cancelled_trial"),     // cancelled during trial; access until trial end
      v.literal("cancelled_paying"),    // cancelled during paid period; access until period end
      v.literal("lapsed"),              // no active subscription; 30-day read-only window (any cause)
      v.literal("dormant"),             // past 30-day lapse window; account preserved
      v.literal("deletion_requested"),  // 30-day soft delete
      v.literal("deleted"),
    ),
    suspended: v.boolean(),
    deletionRequestedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_org", ["organisationId"]),

  memberships: defineTable({
    userId: v.id("users"),
    organisationId: v.id("organisations"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member"),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["organisationId"])
    .index("by_user_org", ["userId", "organisationId"]),

  coach_personas: defineTable({
    slug: v.string(),
    name: v.string(),
    ageBand: v.union(
      v.literal("30s"),
      v.literal("45s"),
      v.literal("60s"),
      v.literal("70s"),
    ),
    genderPresentation: v.union(v.literal("female"), v.literal("male")),
    shortDescriptor: v.string(),
    introSample: v.string(),

    // null until Phase D fills these via the Midjourney → HeyGen → R2
    // pipeline. UI falls back to AbstractAvatar (monogram + per-coach
    // palette) while null.
    avatarRefs: v.optional(
      v.object({
        hero: v.string(),
        profile: v.string(),
        chat: v.string(),
        message: v.string(),
        tiny: v.string(),
      }),
    ),
    heyGenAvatarId: v.optional(v.string()),
    voiceId: v.optional(v.string()),

    styleDescriptors: v.array(v.string()),
    sampleLines: v.array(v.string()),
    wouldSayExamples: v.array(v.string()),
    wouldntSayExamples: v.array(v.string()),
    aiDisclosureLine: v.string(),
    affiliateSuggestionLine: v.string(),
    disclosureLine: v.optional(v.string()),

    // Per-category calibrated safety responses, authored before Phase C.
    // Categories per docs/05-coach-interaction-design.md § Safety guardrails.
    // Severity-1 (acute physical, emotional acute) is identical across
    // coaches and lives in code; this map carries Severity-2 calibration
    // (clinical-edge, emotional chronic, disordered patterns). null until
    // authored — assembly logic falls back to a neutral template.
    safetyResponses: v.optional(
      v.object({
        clinicalEdge: v.string(),
        emotionalChronic: v.string(),
        disorderedPatterns: v.string(),
      }),
    ),

    modelOverride: v.optional(v.string()),
    active: v.boolean(),

    promptVersion: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["active"]),

  coachAssignment: defineTable({
    userId: v.id("users"),
    organisationId: v.id("organisations"),
    coachPersonaId: v.id("coach_personas"),
    assignedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["organisationId"]),

  system_config: defineTable({
    available: v.boolean(),
    unavailableReason: v.optional(v.string()),
    estimatedBackOnline: v.optional(v.number()),
    minAppVersion: v.string(),
    updateLinks: v.object({
      ios: v.string(),
      android: v.string(),
    }),

    models: v.object({
      classifier: v.string(),
      general: v.string(),
      deep: v.string(),
      extractor: v.string(),
      embedding: v.string(),
    }),

    flags: v.object({
      enableProactiveCoachMessages: v.boolean(),
      enableBackgroundFactExtraction: v.boolean(),
      enablePushNotifications: v.boolean(),
      pauseGoHighLevelSync: v.boolean(),
    }),

    costBudgets: v.optional(
      v.object({
        perUserDailyUsdSoft: v.number(),
        perOrgDailyUsdSoft: v.number(),
        platformDailyUsdSoft: v.number(),
      }),
    ),

    updatedBy: v.string(),
    updatedAt: v.number(),
    notes: v.optional(v.string()),
  }),

  external_call: defineTable({
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
  })
    .index("by_user_time", ["userId", "startedAt"])
    .index("by_org_time", ["organisationId", "startedAt"])
    .index("by_persona_time", ["agentPersonaId", "startedAt"])
    .index("by_thread", ["threadId"])
    .index("by_provider_time", ["provider", "startedAt"])
    .index("by_kind_time", ["kind", "startedAt"])
    .index("by_request", ["providerRequestId"]),

  model_pricing: defineTable({
    modelSlug: v.string(),
    provider: v.string(),
    inputCostPer1kUsd: v.number(),
    outputCostPer1kUsd: v.number(),
    cachedInputCostPer1kUsd: v.optional(v.number()),
    embeddingCostPer1kUsd: v.optional(v.number()),
    effectiveFrom: v.number(),
    effectiveTo: v.optional(v.number()),
  }).index("by_model", ["modelSlug", "effectiveFrom"]),

  audit_log: defineTable({
    action: v.string(),
    actorUserId: v.optional(v.id("users")),
    actorLabel: v.optional(v.string()),
    organisationId: v.optional(v.id("organisations")),
    subjectType: v.optional(v.string()),
    subjectId: v.optional(v.string()),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_actor_time", ["actorUserId", "createdAt"])
    .index("by_org_time", ["organisationId", "createdAt"])
    .index("by_subject", ["subjectType", "subjectId"])
    .index("by_action_time", ["action", "createdAt"]),
});
