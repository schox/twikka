# Live globals — Convex + Riverpod discipline

**Status:** Foundational reference. Lands in code in Phase A.
**Purpose:** Define the small set of global state slots that the UI must always read live, the providers that expose them, and the discipline rules that keep us out of trouble.

---

## Core idea

Convex's reactive queries emit on every relevant write. Riverpod stream providers turn those emissions into rebuilds. Wired correctly, the UI is push-driven from the server with no polling, no manual refresh, no "the user has to log out and back in for this to take effect."

This is one of the main reasons we picked Convex. Don't undermine it by `read`ing where you should `watch`.

---

## The globals

These are the state slots every screen depends on. Each is a Riverpod stream provider backed by a Convex live query.

| Provider | Source query | What it returns |
|---|---|---|
| `systemConfigProvider` | `api.systemConfig.get` | Singleton row from `system_config` (kill switch, min app version, models, flags, budgets) |
| `currentUserProvider` | `api.users.currentUser` | The authenticated user's row, including `lifecycleStage` |
| `currentSubscriptionProvider` | `api.billing.currentSubscription` | The active `subscriptions` row for the user (provider, tier, status, period end) |
| `currentCoachProvider` | `api.coach.currentAssignment` | The user's current `coach_personas` row joined via `coachAssignment` |
| `currentCoachStateProvider` | `api.coach.currentState` | The user's `user_coach_state` row (mode, streak, recent suggestions, signal sparseness) |
| `currentProfileSlotsProvider` | `api.profile.slots` | All `user_profile_slots` for the user, keyed by slot |
| `unreadCountsProvider` | `api.threads.unreadCounts` | Counts per surface (coach, people, invites) |
| `activeThreadProvider` (scoped) | `api.threads.byId` | The currently-open thread, if any |
| `presenceProvider` (v2 social) | `api.presence.connections` | Online/typing state for connected members |

Each provider is exposed via Riverpod codegen (`@riverpod`) under `lib/data/providers/`.

---

## Router integration

The `appRouterProvider` watches:

- `systemConfigProvider` → drives `/offline` and `/update-required` redirects
- `currentUserProvider` → drives `/welcome` (signed out), `/account-pending-deletion`, the lapse banner
- `currentSubscriptionProvider` → contributes to lapse-banner state

The router does not poll. State flips on the server propagate as redirects without any client trigger.

---

## Discipline

**Watch, don't read.** When a value can change during a session and the UI needs to reflect that, use `ref.watch(provider)`. `ref.read(provider)` is for one-shot lookups in event handlers (e.g. on button tap, read the current value to act on it). Never read in `build()`.

**Never cache a global in widget state.** A `StatefulWidget` with `_currentUser = ref.read(currentUserProvider)` in `initState` is a bug. The widget will not update when the value changes. Use `ref.watch` in the build method.

**Don't rebuild the world on every tick.** Riverpod's `select` is your friend. If a screen only cares about `lifecycleStage`, use `ref.watch(currentUserProvider.select((u) => u.lifecycleStage))`. Avoids needless rebuilds when an unrelated field changes.

**Server is the source of truth.** Optimistic updates are allowed (and encouraged for purchase flows where webhook latency is visible), but the optimistic value is replaced as soon as the live query emits the real one. Don't keep a separate "I think the value is X" cached value alongside the live query.

**No polling.** If you find yourself writing `Timer.periodic`, the design is wrong. Convex emits when the underlying data changes; that's the trigger.

**No manual refresh buttons** for things that should be live. Pull-to-refresh on the Journal screen is fine because the user might want to force a Health platform sync. Pull-to-refresh on the Coach screen is wrong because the chat is already live.

---

## Three categories of gating state

These all flow from live globals; be deliberate about which kind a given condition is.

**1. Hard takeover (route-level redirect).** The user can't use the app at all in this state. Implemented as router redirects driven by live-watched globals.

| Condition | Live source | Route |
|---|---|---|
| Kill switch on | `systemConfig.available == false` | `/offline` |
| App too old | `appVersion < systemConfig.minAppVersion` | `/update-required` |
| Account deletion pending | `currentUser.lifecycleStage == "deletion_requested"` | `/account-pending-deletion` |
| Signed out | `currentUser == null` | `/welcome` |

**2. Soft state (banner + write-only block).** The user can still navigate, read past chat, see their journal, edit profile, manage subscription, export data, delete account. They just can't write new content. Implemented as a persistent banner mounted in `AppShell` body plus every interactive widget watching `subscriptionStateProvider` and disabling write actions when it reports a write-blocking state. Coach turns pause; no new LLM calls. Banner has a single primary CTA to resolve.

| Condition | Live source |
|---|---|
| Subscription lapsed | `currentUser.lifecycleStage == "lapsed"` |
| Payment failed past grace | `currentUser.lifecycleStage == "payment_failed"` and `currentSubscription.inGrace == false` |
| Trial ended (no payment method) | edge case; treated like `lapsed` |

**3. Per-action gates.** Single buttons or widgets disabled because the user lacks entitlement (a premium feature on standard tier, etc.). Implemented inline at the button via `ref.watch(currentSubscriptionProvider).select((s) => s.tier)`.

---

## Optimistic updates

Allowed in two situations:

**Purchase flow.** After `RevenueCatUI.presentPaywall()` returns success, extract entitlements from the returned `CustomerInfo` and seed the Convex query cache. Avoids the webhook-latency window where the UI would show "not subscribed."

**Local-only state in flight.** A user-sent chat message can render as "sending" before the Convex mutation acks. The live query replaces it with the canonical row when ready.

Outside these two: don't.

---

## Provider conventions

- File path: `lib/data/providers/<name>_providers.dart` for cross-feature globals; `lib/features/<feature>/providers/` for feature-scoped state.
- Naming: `<thing>Provider` for synchronous values, `<thing>Provider` for async too — use the `AsyncValue` shape.
- Generated code is committed (per Flutter convention; see `docs/01-architecture-patterns.md`).

---

## Related docs

- `docs/01-architecture-patterns.md` — overall stack, where live globals fit
- `docs/memory/reference_system_config.md` — the singleton most globals depend on
- `docs/04-build-plan.md` Phase A — when this lands
