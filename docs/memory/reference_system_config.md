# System config singleton — `system_config`

**Status:** Foundational reference. Lands in code in Phase A.
**Purpose:** A single Convex row that holds operational state we need to be able to change without a code deploy. Read everywhere via the live-globals pattern; never cached in client state.

---

## Why a singleton

Some pieces of state are global, operator-controlled, and need to flip in real time across every connected device:

- The kill switch (we need to take the app offline now)
- The minimum app version (we need to force-update)
- LLM model selection (we want to try a cheaper model without re-deploying)
- Operational flags (pause the GHL sync; disable proactive coach messages)
- Soft cost budgets

A singleton row plus a Convex live query gives us this for free. Operator changes a value in the dashboard or via an admin mutation; every connected device sees the change within ~100ms via the live-global pattern.

---

## Schema

Defined in `convex/schema.ts`:

```typescript
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
    classifier: v.string(),    // small/fast model for activity classification, signal extraction, etc.
    general: v.string(),       // default coach turn model
    deep: v.string(),          // for harder reasoning (rare; reflection cards, multi-fact synthesis)
    extractor: v.string(),     // background extraction job
    embedding: v.string(),     // vector embeddings for knowledge_fact + activity_kinds aliases
  }),

  flags: v.object({
    enableProactiveCoachMessages: v.boolean(),
    enableBackgroundFactExtraction: v.boolean(),
    enablePushNotifications: v.boolean(),
    pauseGoHighLevelSync: v.boolean(),
  }),

  costBudgets: v.optional(v.object({
    perUserDailyUsdSoft: v.number(),
    perOrgDailyUsdSoft: v.number(),
    platformDailyUsdSoft: v.number(),
  })),

  updatedBy: v.string(),
  updatedAt: v.number(),
  notes: v.optional(v.string()),
}),
```

There is exactly one row. Insert at deployment time; mutate via admin actions only.

---

## Read pattern

**Server side**, every Convex action/query that depends on a config value reads it inline:

```typescript
const config = await ctx.db.query("system_config").first();
const model = config?.models.general ?? "anthropic/claude-sonnet-4.6";
```

Don't cache; Convex's per-request consistency means the read is cheap and always current.

**Client side**, expose via a Riverpod live-global per `docs/memory/reference_live_globals.md`:

```dart
@riverpod
Stream<SystemConfig?> systemConfig(SystemConfigRef ref) {
  return ref.watch(convexClientProvider).watchQuery(api.systemConfig.get);
}
```

The router watches it. Hard takeovers (`/offline`, `/update-required`) flow from this provider.

---

## Write pattern

Admin-only. Mutations live in `convex/systemConfig.ts`. Each mutation:

1. Reads the current value (for `before` snapshot)
2. Patches the singleton
3. Writes an `audit_log` row with actor, before, after

Example:

```typescript
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

    const before = { /* snapshot */ };
    const after = { /* new values */ };

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
```

Same shape for `setModels`, `setFlags`, `setCostBudgets`, `setMinAppVersion`. Never expose a single uber-mutation that takes the whole document — each operational concern gets its own audited mutation.

---

## Discipline

- **Singleton invariant.** There is one row. Migrations and seed scripts insert exactly one; code that reads it can `.first()` safely.
- **Live-watched, not polled.** The Flutter app watches a Convex live query. Setting `available: false` in the dashboard transitions every connected device to `/offline` within ~100ms.
- **Operator changes are audited.** Every mutation writes an `audit_log` row. The `actorLabel` is the operator's name/email/role for ops-traceability.
- **Distinct from feature flags.** `system_config` is global operational state. Feature flags (Phase F, separate `feature_flags` table) do per-user/org/cohort gradual rollouts. Don't conflate them.
- **No code paths that ignore it.** Every screen/action must respect the kill switch and version gates. Easiest enforcement: gates are router-level, so individual screens don't need to check.

---

## Operational flags reference

| Flag | Default | Effect |
|---|---|---|
| `enableProactiveCoachMessages` | `true` | Master switch for the proactive pipeline. Off = coach only responds to user-initiated turns. |
| `enableBackgroundFactExtraction` | `true` | Background extractor runs after each coach response. Off = facts only captured at turn time. |
| `enablePushNotifications` | `true` | OneSignal sends. Off = in-app messages still written, no push. |
| `pauseGoHighLevelSync` | `false` | Marketing CRM sync. On = lifecycle events not forwarded. |

Add to this list when new ops-level controls are needed. Each new flag needs:
- A default
- A documented effect
- A mutation to flip it
- An `audit_log` action name

---

## Related docs

- `docs/memory/reference_live_globals.md` — how the client watches it
- `docs/memory/reference_external_call_audit.md` — where the soft budget knobs are evaluated
- `docs/04-build-plan.md` Phase A — when this lands
