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
    // B1: city + timezone parked here pending Phase C's user_profile_slots
    // table. When that lands these get migrated into slot rows with the
    // standard state machine; until then they're plain optional fields.
    cityId: v.optional(v.id("cities")),
    timezone: v.optional(v.string()),
    // tester gate. New users default false (set in users.ts upsert).
    // When true, the Settings hub reveals the Debug entry so we can
    // browse seed data, flip kill switches, etc. Operator-flippable
    // from the Convex dashboard.
    tester: v.optional(v.boolean()),
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

  // CoPA-derived activity taxonomy. Each row is a single activity kind
  // (e.g. "Running, general"), tagged with classification flags, an
  // optional set of HealthWorkoutActivityType strings (the unified
  // Apple HK + Health Connect enum exposed by the `health` Flutter
  // package), and learned aliases. The classifier in Phase B3 resolves
  // user phrasings + device-reported workouts to rows here.
  activity_kinds: defineTable({
    copaCode: v.optional(v.number()), // null for platform-only synthetics
    name: v.string(),
    mets: v.optional(v.number()), // METs as reported by CoPA
    headingId: v.optional(v.number()), // CoPA heading FK; null for synthetics
    headingName: v.string(),
    coaClass: v.union(
      v.literal("adult"),
      v.literal("older_adult"),
      v.literal("wheelchair"),
    ),

    // Classification flags — derived from heading defaults at seed time;
    // refined per-row by the curation pass.
    isCardio: v.boolean(),
    isStrength: v.boolean(),
    isMobility: v.boolean(),
    isBalance: v.boolean(),
    isMental: v.boolean(),

    // HealthWorkoutActivityType strings from the `health` package
    // (unified Apple HK + Health Connect enum). Multiple platform types
    // may map to the same activity kind (e.g. RUNNING + RUNNING_TREADMILL
    // both point at "Running, general").
    platformTypes: v.array(v.string()),

    // Free-text aliases the user / coach has used for this activity.
    // Empty at seed; populated by user_activity_aliases at the user
    // layer, plus a small global lift list per row.
    aliases: v.array(v.string()),

    // "copa" — lifted from the CoPA dump
    // "platform_only" — created from a HealthWorkoutActivityType that
    //                   has no clean CoPA equivalent
    // "manual" — created post-seed by the operator
    source: v.union(
      v.literal("copa"),
      v.literal("platform_only"),
      v.literal("manual"),
    ),
    needsReview: v.boolean(),

    // Embedding of "name + headingName + aliases joined", produced by
    // the embedding model named in system_config.models.embedding (1536
    // dims for text-embedding-3-small). Phase B3's classifier hits
    // `by_embedding` for the similarity step (cosine over the activity
    // taxonomy). Optional because the backfill is async and brand-new
    // synthetic rows may not have an embedding yet.
    embedding: v.optional(v.array(v.float64())),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_copa", ["copaCode"])
    .index("by_heading", ["headingId"])
    .index("by_class", ["coaClass"])
    .searchIndex("by_name", {
      searchField: "name",
      filterFields: ["coaClass"],
    })
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["coaClass"],
    }),

  // Per-user phrasings learned from chat. "the lawn" → mowing,
  // "morning loop" → walking, etc. Resolved at the alias step before
  // we touch embeddings or LLMs.
  user_activity_aliases: defineTable({
    userId: v.id("users"),
    organisationId: v.id("organisations"),
    phrase: v.string(), // exact lowercase phrase as the user said it
    activityKindId: v.id("activity_kinds"),
    learnedFromMessageId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_phrase", ["userId", "phrase"])
    .index("by_user", ["userId"])
    .index("by_kind", ["activityKindId"]),

  // GeoNames cities export (~140k rows). The full-text search index
  // matches on name + asciiname + alternatenames + country_code so
  // common synonyms ("NYC" → "New York") and accented variants resolve.
  // alternatenames is an array of strings (we split the GeoNames
  // comma-delimited field at ingest time).
  cities: defineTable({
    geonameid: v.number(),
    name: v.string(),
    asciiname: v.string(),
    alternatenames: v.array(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    countryCode: v.string(),
    timezone: v.string(),
    // searchHaystack concatenates the human-resolvable strings into a
    // single field that the search index targets — keeps the index
    // simple at 140k rows and avoids array-search semantics.
    searchHaystack: v.string(),
  })
    .index("by_geonameid", ["geonameid"])
    .searchIndex("by_haystack", {
      searchField: "searchHaystack",
      filterFields: ["countryCode"],
    }),
});
