# External call audit — `external_call`

**Status:** Foundational reference. Lives in code from Phase A.
**Purpose:** Every outbound call to a paid or measurable third party writes a row to `external_call` synchronously after the call returns. Lets us slice spend by user / persona / cohort / time period without retroactive plumbing.

---

## Why

We need to know, at any time:
- What did this user cost us last month?
- Which persona burns the most tokens?
- Which model is slowest, which is cheapest?
- Are we within soft cost budgets?
- Did anyone exceed a single-call cost threshold?

Reconstructing this after the fact from provider dashboards is painful and lossy. Recording it inline at call site, with full attribution, makes every analytics question a Convex query.

---

## What gets recorded

Every paid or rate-limited third-party call:

| Kind | Examples |
|---|---|
| `llm` | Coach turn generation (OpenRouter), classifier, extractor |
| `embedding` | Knowledge fact / activity alias embeddings |
| `email` | Postmark transactional sends |
| `push` | OneSignal push delivery |
| `storage` | R2 PUT / GET (if billable) |
| `search` | Any external search API |
| `billing` | Paddle / RevenueCat API calls if/when we make outbound calls |
| `crm` | GoHighLevel sync sends |
| `other` | Fallback |

What we do **not** record:
- Convex query/mutation costs (covered by Convex's own usage panel)
- Anything internal to the deployment

---

## Schema

Defined in `convex/schema.ts`. Reproduced here for reference:

```typescript
external_call: defineTable({
  kind: v.union(
    v.literal("llm"), v.literal("embedding"), v.literal("email"),
    v.literal("push"), v.literal("storage"), v.literal("search"),
    v.literal("billing"), v.literal("crm"), v.literal("other"),
  ),
  provider: v.string(),                    // "openrouter", "postmark", "onesignal", ...
  model: v.optional(v.string()),           // for llm/embedding kinds
  purpose: v.string(),                     // free-text label, e.g. "coach.turn", "alias.classify"

  // Attribution
  userId: v.optional(v.id("users")),
  organisationId: v.optional(v.id("organisations")),
  agentPersonaId: v.optional(v.id("coach_personas")),
  threadId: v.optional(v.string()),
  messageId: v.optional(v.string()),
  parentCallId: v.optional(v.id("external_call")),  // chain calls in a single user-facing operation

  // Tokens (for llm/embedding)
  inputTokens: v.optional(v.number()),
  outputTokens: v.optional(v.number()),
  cachedTokens: v.optional(v.number()),

  // Cost
  costUsd: v.number(),                     // computed from model_pricing
  reportedCostUsd: v.optional(v.number()), // provider-reported, when available
  costDetail: v.optional(v.any()),         // raw breakdown if provider supplies

  // Outcome
  state: v.union(v.literal("success"), v.literal("failed"), v.literal("timeout")),
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
```

---

## Helper — `recordedCall`

Lives at `convex/lib/recordedCall.ts`. Wrap every outbound call:

```typescript
import { recordedCall } from "../lib/recordedCall";

const result = await recordedCall(
  ctx,
  {
    kind: "llm",
    provider: "openrouter",
    model: "anthropic/claude-sonnet-4.6",
    purpose: "coach.turn",
    userId,
    organisationId,
    agentPersonaId,
    threadId,
    messageId,
  },
  async () => {
    const response = await callOpenRouter({ ... });
    return {
      result: response.text,
      inputTokens: response.usage.input,
      outputTokens: response.usage.output,
      cachedTokens: response.usage.cached,
      providerRequestId: response.id,
    };
  },
);
```

The helper:
- Times the call (`latencyMs`)
- Computes `costUsd` from `model_pricing` (looked up by `model` and `startedAt`)
- Writes the audit row regardless of success / failure / timeout
- Re-throws on failure so the calling action can handle as it wishes

---

## Cost computation

Costs come from the `model_pricing` table:

```typescript
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
```

History-tracked: when a provider changes pricing, set `effectiveTo` on the old row and insert a new one. Cost computation uses the row valid at `startedAt`, not at query time, so historical analyses stay accurate.

---

## Discipline

- **Synchronous record after the call returns.** Never fire-and-forget. The audit row exists or the call didn't happen — we don't lose accounting.
- **Never log full prompts or response bodies** in `external_call`. Prompts/responses live in `messages` for LLM turns, and most other call kinds are unsensitive but not interesting to record verbatim.
- **Always pass attribution.** `userId`, `organisationId`, persona/thread/message where applicable. Empty attribution makes a row useless for analytics.
- **`parentCallId` for chained calls.** A single user-facing operation that triggers an extraction (Haiku) followed by a turn generation (Sonnet) writes two rows; the extraction row's `parentCallId` points at the turn row (or vice versa, by convention). Lets us reconstruct true cost-per-turn.
- **`purpose` is your friend.** Use a stable string per call site (`"coach.turn"`, `"coach.extraction"`, `"alias.classify"`, `"alias.embed"`). Future you will thank you when slicing analytics.

---

## Soft cost budgets

`system_config.costBudgets` carries `perUserDailyUsdSoft`, `perOrgDailyUsdSoft`, `platformDailyUsdSoft`. Soft means the budgets do not gate calls in v1 — they exist to be queried and alerted on. A scheduled action (Phase E onward) can sum recent `external_call` rows by user/org/platform and surface anything above threshold to operators.

Hard gating (refuse to call if over budget) is deferred until we have enough usage to know a sensible limit.

---

## Related docs

- `docs/04-build-plan.md` Phase A — table lands here, helpers ready for Phase B/C/E to wrap their integrations
- `docs/memory/reference_system_config.md` — where the soft budget knobs live
