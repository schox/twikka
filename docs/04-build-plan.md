# Twikka — Build Plan

**Status:** Active. The plan we work to. Updated as decisions evolve.
**Origin:** Distilled from `docs/twikka_v1_prd.md` + design discussion 2026-04-18; revised through the architectural decisions on memory / audit / system config / live globals / gating states; updated 2026-04-26 with audit-driven decisions on avatars (monogram-now / HeyGen-Phase-D), `/docs/memory/` governance, safety calibration deferred to pre-Phase-C, Phase E pricing kickoff, and W-22 trigger spec; refreshed 2026-05-02 to capture Phase B completion + post-Phase-B polish wave + the auth-robustness pass.
**How to use:** Each phase below is a self-contained, demoable chunk. We complete one, ship-or-show, then move on. Decisions deferred *into* a phase are listed at the start of that phase so we don't pre-litigate them.

> **Working principle:** every phase ends in a state the user can run on the iOS simulator and click through. No "scaffolding completed but nothing visibly different" milestones. If a phase's only output is back-end, we add a debug screen that proves it works.

---

## Schema status (vs docs)

The PRD §16 and the coach interaction design §Data Structures describe the full data model across v1 to v4. The actual `convex/schema.ts` lands those tables phase by phase. This table tracks the gap so a reader can see what is real vs what is doc-only at any moment.

| Table | Doc | Schema | Lands in |
|---|---|---|---|
| `organisations` | PRD §16.2 | ✓ | Phase A |
| `users` | PRD §16.2 | ✓ | Phase A |
| `memberships` | PRD §16.2 | ✓ | Phase A |
| `coach_personas` | PRD §16.2 | ✓ | Phase A |
| `coachAssignment` | PRD §16.2 | ✓ | Phase A |
| `system_config` | `docs/memory/reference_system_config.md` | ✓ | Phase A |
| `external_call` | `docs/memory/reference_external_call_audit.md` | ✓ | Phase A |
| `model_pricing` | `docs/memory/reference_external_call_audit.md` | ✓ | Phase A |
| `audit_log` | PRD §16.2 | ✓ | Phase A |
| `activity_kinds` | PRD §9.2 | ✓ | Phase B |
| `user_activity_aliases` | PRD §9.2 | ✓ | Phase B |
| `activities` | PRD §9.4 | ✓ | Phase B |
| `daily_summaries` | not in PRD | ✓ | Phase B (added; idempotent step-count rollup per user/source/date) |
| `cities` | PRD §16.2 (implied) | ✓ | Phase B |
| `media` | not in PRD | ✓ | post-Phase-B polish (R2-backed user photos + future coach avatars) |
| `knowledge_fact` | Interaction design §2 | — | Phase C |
| `user_profile_slots` | Interaction design §6 (also PRD §8.1) | — | Phase C |
| `user_goals` | Interaction design §3 | — | Phase C |
| `user_signals` | Interaction design §5 | — | Phase C |
| `user_coach_state` | Interaction design §6 | — | Phase C |
| `coach_triggers` | Interaction design §7 | — | Phase C |
| `threads` | PRD §16.2, interaction design § Thread model | — | Phase C |
| `messages` | PRD §16.2 | — | Phase C |
| `device_connections` | PRD §16.2 | — | **deferred** — B's health integration uses the `health` plugin directly with `users.healthSource`; revisit if multi-device or richer connection state is needed |
| `subscriptions` | PRD §16.2 | — | Phase E |
| `wiki_*` (5 tables) | `docs/twikka-wiki-design.md` | — | Phase C (basic) / wiki sprint (full) |
| `connections` | PRD §16.3 | — | Phase G (built, flagged off) |
| `groups` | PRD §16.3 | — | Phase G |
| `invites` | PRD §16.3 | — | Phase G |
| `practitioners` | PRD §16.4 | — | Phase H (stub) |
| `client_affiliations` | PRD §16.4 | — | Phase H (stub) |
| `enterprise_integrations` | PRD §16.5 | — | Phase H (stub) |
| `enterprise_cohorts` | PRD §16.5 | — | Phase H (stub) |
| `feature_flags` | PRD §23 | — | Phase F |

Update this table as phases ship. The intent is that "✓" matches what's in `convex/schema.ts` at the head of `main`. If the table is out of date, fix it in the same commit as the schema change.

---

## Where we are now

Head: `19b26e1` on `main`. Stage 0 + all of Phase A + all of Phase B have shipped, plus a deliberate post-Phase-B polish wave (CI/CD lanes, env-var codegen, theme variants, R2 photo upload + avatar system, and an end-to-end auth-robustness pass).

**Phase A — complete.**

- **Stage 0** — Adaptive shell (`NavigationBar` <600px / `NavigationRail` ≥600px), four tabs (Coach / Progress / Social / Settings), Margaret-flavoured fake chat, Settings hub + 5 subroutes, Warm Light theme, Fraunces + Plus Jakarta Sans.
- **A1** — Convex spine: schema for `organisations` / `users` / `memberships` / `coach_personas` / `coachAssignment` / `system_config` / `external_call` / `model_pricing` / `audit_log`. Audit + `recordedCall` helpers, `system_config` and `model_pricing` seeds.
- **A2** — Live-globals plumbing: `convex_flutter` client, `systemConfigProvider`, router watches → kill-switch flips redirect to `/offline` within ~100ms. `system_config.setAvailability` mutation tested end-to-end.
- **A3.1** — Real Clerk auth via `clerk_auth 0.0.14-beta`. `ClerkService` (DefaultPersistor + path_provider), `ClerkAuth` Riverpod notifier replacing FakeAuth. Convex token binding via `setAuthWithRefresh`.
- **A3.2** — Clerk webhook → Convex provisioning. `convex/http.ts` with svix-verified `/clerk-webhook` endpoint dispatching `user.created` / `user.updated` / `user.deleted` to internal `users` mutations. `ensureFromIdentity` self-upsert as a webhook-race / pre-existing-user fallback. `currentUserProvider` live query rendered in Settings → Debug.
- **A3.3** — Single morphing auth screen (email → probe → name-if-new → code → in). `convex/auth.ts` `probeEmail` action wraps Clerk Backend API. HttpService shim strips `strategy` from POST `/v1/client/sign_ups` so Clerk's auto-prepare is suppressed and signup sends one email instead of two. Inline error surfacing via `AuthResult` records.
- **A3.4** — Six coach personas seeded into `coach_personas`. Coach picker shown after first OTP for new users; Settings → Coach for repeat use. AI disclosure copy in welcome subtitle, coach-selection screen, chat header. Avatars are placeholder monograms (`AbstractAvatar`) — `coach_personas.avatarRefs` stays optional so Phase D's HeyGen swap-in is a pure data fill.

**Phase B — complete.**

- **B1** — `cities` table seeded with the full ~140k GeoNames dump (one-shot ingest). Convex search index on `name` / `asciiname` / `alternatenames` / `country_code`. Settings → Profile city picker with type-ahead. Time zone auto-derived on pick, user-overridable.
- **B2** — `activity_kinds` (CoPA + Apple HK + Health Connect reconciliation), `user_activity_aliases`. Tester gate (`users.tester`) reveals Settings → Debug. Debug viewer renders the resolved activity feed.
- **B3** — Activity classifier action implementing the 5-step PRD §9.2 resolver (user-alias → global-alias → embedding → ambiguous → new-with-`needsReview`). OpenRouter wrapper module with `recordedCall` cost auditing. Embedding backfill action against the `by_embedding` vector index. Models pinned in `system_config.models.{classifier,embedding,extractor,general,deep}`.
- **B4** — Apple HealthKit + Android Health Connect via the `health` package. `daily_summaries` step-count rollup (idempotent per user/source/date). iPad-friendly responsive layout. Bundle ID swapped to `com.novansa.twka` (final).

**Post-Phase-B polish (between B and C):**

- **CI/CD scaffold** — `ci-cd/` with Fastlane (`Fastfile`, `Appfile`, `ExportOptions.plist`) + `deploy-{ios,android,all}.sh` mirroring the couple-tools pattern. Setup notes in `ci-cd/docs/twikka-setup.md`. Not yet wired through to a green device build (next session).
- **Envied** — `String.fromEnvironment` replaced with `envied`-codegen'd const accessors so env-var names live in one place.
- **Theme variants** — Pluggable variant system; Classic + Warm Coach themes ship; full audit purge of inline theme data.
- **R2 + avatars** — Three-shape `AbstractAvatar` system; user profile photo upload via `@convex-dev/r2`; `media` table for current photo + orphan-on-replace.
- **Auth robustness** (this session) — `_NotifyingAuth` exposes Clerk's `update()` as a stream so cold-start hydration races don't strand the user on AuthScreen. App-resume rebinds the Convex auth handle so JWTs that expire during suspend get refreshed before the next query. `convexSubscribe` auto-retries on error with exponential backoff. Server-side queries throw on missing identity (centralized in `convex/lib/auth.ts`) so the Flutter retry actually has something to react to. TS strict pass + `convex/tsconfig.json` so `convex codegen --typecheck` actually runs `tsc`.

**What's still fake or unbuilt:** chat under Margaret is still seeded (no real LLM, no memory) — that's Phase C, the next phase. No real notifications (E), no payments (E), no dark-mode switcher (F), no v2 social (G).

---

## Phase A — Real auth + data spine + safety gates

**Why first:** every other phase depends on a real `userId`. The longer we run on fake state, the more code we touch when we wire in the truth. Doing this early means subsequent phases write against the real Convex/Clerk surface from the start. We also land the operational safety gates here so they're battle-tested before there's anything to lose.

### Sub-goals

**Auth (Clerk):**
- Real Clerk-backed sign-up and sign-in (email + 6-digit code, no passwords)
- Single morphing auth screen replaces the current 4-screen flow: email entry → backend probe → adds name field if new → code field → in
- Coach picker shown after the first OTP for first-time users; reachable from Settings → Coach for repeat use
- Six coach personas added in seed per `docs/twikka_coach_personas.md`: **Priya / Ben / Fiona / Rob / Margaret / Tom** (matches PRD §8.3). HeyGen portraits are deferred to Phase D — Phase A seeds with `coach_personas.avatarRefs: null` and the picker / chat header / Settings render via `AbstractAvatar` (initials + per-coach palette). Schema makes `avatarRefs` optional so Phase D's swap-in is a pure data fill, not a schema migration.
- **Explicit AI disclosure copy** lands in three surfaces: welcome screen subtitle ("Coaches are AI personas trained by our expert team"), coach-selection screen line above the cards, small "AI coach" text under the coach name in the chat header. Settings → About gets the longer plain-language explanation in Phase D. See `docs/memory/reference_coach_character_system.md`.

**Convex tables (the spine):**
- `organisations`, `users`, `memberships` — multi-tenant from day one. Every queryable entity scoped by `organisationId`. Personal users get a single-person org.
- `coach_personas`, `coachAssignment` — six personas seeded; `coachAssignment` records the user's current pick
- `threads`, `messages` — Convex Agent component tables (real chat in Phase C)
- `system_config` — singleton: kill switch, `unavailableReason`, `estimatedBackOnline`, `minAppVersion`, `updateLinks.{ios,android}`, `models.{classifier,general,deep,extractor,embedding}`, operational flags, soft cost budgets. Schema in `docs/memory/reference_system_config.md`.
- `external_call` — every paid/measurable third-party call writes a row synchronously. Schema in `docs/memory/reference_external_call_audit.md`. Helpers (`recordedCall(...)`) ready for Phases B/C/E to wrap their integrations as one-liners.
- `model_pricing` — history-tracked `(modelSlug, effectiveFrom)` price table the audit helper consults for cost computation
- `audit_log` — sensitive-action log (consent changes, profile edits, deletion request); helpers wired in this phase, used continuously thereafter

**Live-global providers (the runtime spine):**
- `convex_flutter` (or `flutter_convex`) for live queries
- Riverpod providers backed by Convex live queries: `systemConfigProvider`, `currentUserProvider`, `currentCoachProvider`, `subscriptionStateProvider` (placeholder until E)
- `appRouterProvider` watches all of the above so server-driven state changes flow to the UI without polling. See `docs/memory/reference_live_globals.md` for the discipline.

**Safety gates (router-watched):**
- **`/offline` takeover** — shown when `system_config.available = false`. Warm copy, "back online at X" if `estimatedBackOnline` is set, polling-free (live query reverts the redirect when the operator flips it).
- **`/update-required`** — shown when the installed app version (via `package_info_plus`) is `< system_config.minAppVersion`. Single primary action: open the right store link from `system_config.updateLinks.{ios|android}`. No "later" / "skip" — this gate is intentionally hard.
- Both are screens to *route to* (full takeover), distinct from the soft "lapsed subscription" banner that arrives in Phase E.

**Replace fake plumbing:**
- `FakeAuth` notifier becomes `ClerkAuth` notifier (same Riverpod shape, real backing — screens unchanged)
- Settings → Debug → "Reset auth" still works for testing

### Demoable state

A new user signs up with Clerk for real, gets an email code (Clerk default sender for now; Postmark in Phase E), enters it, picks a coach, lands in the chat. Chat content is still placeholder. The operator can flip `system_config.available = false` in the Convex dashboard and watch every connected device transition to the offline screen within ~100ms. Bumping `minAppVersion` similarly forces the update screen.

### Open decisions during phase

- ~~Clerk Flutter integration approach~~ → resolved A3.1: `clerk_auth 0.0.14-beta` (official, dart-only).
- ~~Email verification provider~~ → resolved: Clerk's default through Phase A; Postmark in Phase E.
- ~~Doubled-email signup quirk~~ → resolved A3.3: HttpService shim strips `strategy` from create-signup so Clerk doesn't auto-prepare. One email per signup.
- ~~Coach avatars block A3.4~~ → resolved: monogram placeholders ship in A3.4; HeyGen photos slot in during Phase D as a data-only swap.
- Convex deployment workflow — we have a dev project; do we set up staging now or later? **Still open.**

### Effort

Medium-large. Multi-day. **Status:** complete (A1 → A3.4 shipped; auth robustness re-hardened in the post-B polish wave).

---

## Phase B — Activities + cities (data foundation)

**Why second:** activities are a first-class concept that touches the schema, the agent's tools, the Journal screen, and the Health plugin. Cities likewise underpin location for v1 (manual selection) and v2+ (events, nearby). Both are pure data with light UI; do them before the agent so the agent has real data to talk about.

### Sub-goals

- `activity_kinds` table per PRD §9.2 — seeded from the existing CoPA tables (activity / class / heading) carried over from the old DB. Each row carries CoPA code + METs, five classification flags (`isCardio`, `isStrength`, `isMobility`, `isBalance`, `isMental`), `appleHkTypes[]`, `healthConnectTypes[]`, `aliases[]`, `source`, `needsReview`
- Seed reconciliation: union the CoPA seed with Apple `HKWorkoutActivityType` and Health Connect `ExerciseType` enums; populate platform-mapping arrays where they overlap; create new entries with `source: apple_seed` / `health_connect_seed` for platform values not in CoPA
- `user_activity_aliases` per-user table for personal phrasings the coach has learned (see PRD §9.2 resolution flow)
- `activities` instance table per PRD §9.4 — `source`, `externalId`, `activityKindId`, timing, metadata, `metsEstimate`, acknowledgement state
- Activity classifier as a Convex action implementing the 5-step resolution flow in PRD §9.2: user-alias → global-alias → embedding → ambiguous-coach-asks → new-kind-with-needs-review. LLM and embedding calls wrapped with `recordedCall(...)` so cost shows up in `external_call`
- Apple Health (HealthKit) + Android Health Connect integration via the [`health`](https://pub.dev/packages/health) Flutter package. Health Connect is the Android path; Google Fit is not targeted
- `cities` table seeded with full ~140k GeoNames dump (one-shot seed script). Includes `alternatenames` (synonyms) so the search index matches "NYC" to "New York" and so on.
- Convex search index on city `name`, `asciiname`, `alternatenames`, `country_code`
- Settings → Profile → City type-ahead picker
- Time zone auto-detected on city pick, user-overridable

### What gets built

- Convex schema additions: `activity_kinds`, `user_activity_aliases`, `activities`, `cities`
- `convex/seed/cities.ts` — pulls GeoNames dump, transforms, ingests in batched mutations
- `convex/seed/activityKinds.ts` — CoPA import + Apple/Health Connect reconciliation
- `convex/agents/classifyActivity.ts` — five-step resolver action; reads `system_config.models.classifier` for the LLM model and `system_config.models.embedding` for the alias embedding model
- Flutter: `lib/src/features/health/` with `HealthService` wrapping the `health` package
- Flutter: city picker widget + provider
- Debug screen showing recent captured activities + their resolved `activity_kinds` row + classification flags (proves Health and the classifier are wired)

### Demoable state

User connects Apple Health from Settings → Health, walks around (or nudges activity in the simulator's debug menu), opens Twikka, sees their activities show up in a debug list correctly mapped to `activity_kinds` rows. User picks "Glasgow, Southside" from the city search. Coach can call `classifyActivity("did the lawn this arvo")` → returns `{ activityKindId, displayName: "Gardening (general)", isCardio: true, isStrength: true, isMobility: false, isBalance: false, isMental: false, copaMets: 4.0, durationMin: null, timeOfDay: 'afternoon' }`, writes a `user_activity_aliases` row mapping "the lawn" to the gardening kind, and the LLM/embedding calls show up in the audit log with cost. A platform sync arriving with an unfamiliar HK enum value creates a new `activity_kinds` row with `needsReview: true` and is usable immediately.

### Open decisions during phase

- Which classifier model — small/fast (Haiku-tier) makes the most sense; pin in `system_config.models.classifier`
- Embedding model for alias matching — Voyage 3 vs OpenAI text-embedding-3-small; pin in `system_config.models.embedding`
- iOS Health permissions copy — needs explicit, plain-language framing
- Confidence thresholds for the resolver's silent / ambiguous / new-kind branches (PRD §9.2 suggests ≈0.85 and ≈0.65; calibrate during build)

### Effort

Medium. The 140k city ingest is mostly a script; Health plugin has surface area but is well-documented. **Status:** complete (B1 → B4 shipped). `device_connections` deferred — the `health` plugin + `users.healthSource` + `daily_summaries` covers v1 needs without a separate connections table.

---

## Phase C — Memory + agent (the coach comes alive)

**Why third:** the coach is the product. Once Phases A+B are done we have real users, real activities, and the data spine the coach needs. Now we wire the brain.

> **Optional split if velocity demands.** C1 = memory tables + slot state machine + write tools (agent still stubbed); C2 = Convex Agent + LLM + RAG + the coach is real. Each ships independently.

### Sub-goals

**Memory (three layers):**
- `knowledge_fact` table with vector embeddings (Convex vector search), three scopes (`agent`, `platform`, `user`). Includes `createdAt`, `lastConfirmedAt`, `occurredAt?`, `expiresAt?`, `sourceMessageId?`, `lastAccessed`, `accessCount`, `confidence`. Recency-decay reranker on retrieval.
- `user_profile_slots` table with state machine per slot (`unknown` / `asked_pending` / `declined` / `provided` / `inferred`). Slots: `dateOfBirth`, `gender`, `cityId`, `timeZone`, `primaryMotivation`, `healthConnection`, `pushPermission`, `preferredCheckInTime`. All editable from Settings → Profile.
- Transcripts (existing `messages`) retained forever — the coach doesn't load them wholesale, but the user can.

**Audit-table split (canon):**
- `external_call` — cost / latency / tokens per third-party call. **No PII, no transcript content.** One row per call via `recordedCall(...)`.
- `coach_interactions` — per-turn analytics: query, response, classification, mode, signals extracted. Used for tuning, never billed-by-volume. Sits alongside `messages` (raw chat) — `messages` is what the user sees, `coach_interactions` is what we analyse.
- `messages` — Convex Agent's chat history surface; user-readable transcript.
- `audit_log` — sensitive-action provenance only (consent changes, profile edits, deletion request, role changes). Not chat-related.

**Agent:**
- Convex Agent component integrated; persona layer separated from agent (per PRD §8.1–8.2)
- All LLM calls routed through OpenRouter as a single gateway. Model selection comes from `system_config.models` (operator-editable, no code deploy needed). Per-persona overrides allowed via `coach_personas.modelOverride` for personas where a specific model matters.
- Every LLM call wrapped with `recordedCall(...)` → `external_call` audit row with token counts, USD cost, latency, parent attribution (user, persona, thread, message)
- Six coach personas with prompt-style guidance + sample lines per `docs/twikka_coach_personas.md` (the operative source — supplants PRD §8.3). Each persona prompt includes:
  - The persona's would / wouldn't say lists (compressed to directives)
  - 6–10 canonical sample lines as calibration
  - The "are you AI?" sample response in their voice (hard guardrail — never deflect or deny)
  - Mode-specific (flow / momentum / recovery / returning) overlays
  - User-memory injection
- **Safety responses (calibrated before C ships):** five hard-guardrail categories per `docs/05-coach-interaction-design.md` § Safety guardrails — acute physical, emotional acute, clinical-edge, emotional chronic, disordered patterns. Severity-1 (acute physical, emotional acute) is **identical across all six coaches** — directive over warmth, no persona-flavoured tags ("call 000 right now", not "I'd ring 000, love"). Severity-2 (clinical-edge, emotional chronic, disordered patterns) per-coach calibrated within a shared structural template. Lines authored in `docs/twikka_coach_personas.md` § Safety responses; assembly logic falls back to a neutral template when a persona's `safetyResponses[category]` is null. **Phase A seeds with `safetyResponses: null`** — visible gap until Phase C.
- **W-22 (affiliate cross-sell, v3+) trigger spec:** the agent surfaces W-22 on **either** signal — (a) it just declined a clinical-edge question, **or** (b) the user explicitly asked for deeper accountability or for someone in person. A small classifier action against the recent turn picks the trigger; both paths are valid. Frequency-capped to ≤1 surface per user per ~3 weeks. Built and seeded in Phase D, flagged off until v3 (Phase H reveal).
- Adaptive coach mode (flow / momentum / recovery / returning), inferred from activity recency/frequency and stored on `user_coach_state`. Mode-computation rules canon in `docs/05-coach-interaction-design.md` (§Mode Computation)
- Coach tools: `write_knowledge_fact`, `update_profile_slot`, `log_activity`, `classify_activity`, `get_recent_activity`, `get_user_profile`, `render_*` for each widget type, `schedule_proactive_checkin`, `flag_for_human_review`
- RAG retrieval per turn: vector search across applicable scopes, top-N injected into system prompt
- Background fact extractor: scheduled Convex action that processes recent transcript chunks and proposes lower-confidence facts
- Profile-slot reading in agent prompt so coach knows what to ask (and what to never ask again)

### What gets built

- Convex schema: `knowledge_fact`, `user_profile_slots`, indexed for vector + scope filtering
- `convex/agent/` — Agent component config, system prompt assembly, persona injection, mode logic, tool definitions
- `convex/agent/memory.ts` — write/read helpers with the recency-decay reranker
- `convex/agent/factExtractor.ts` — scheduled background extractor
- `convex/seed/coaches.ts` — six personas with their prompt-style notes
- `convex/seed/platformKnowledge.ts` — initial small RAG corpus (50–100 chunks for v1; admin web UI deferred)
- Flutter: nothing visible changes (the agent works behind existing UI), except the chat now has a real LLM, real memory, and real responses
- Debug screen: "what does the coach know about me?" showing profile slots + recent facts + provenance pointers

### Demoable state

User chats with Margaret. Margaret remembers things across sessions ("how did that walk you mentioned yesterday end up?"). Margaret asks for age via W-15 widget if the slot is `unknown`, respects a decline (slot → `declined`, never asks again). User edits their age in Settings → Profile → slot transitions to `provided` → next turn Margaret references it correctly. User says "I'm cooked, knee playing up", coach captures `{kind:constraint, predicate:has_injury, object:knee, active:true}` and never suggests a run for the rest of the conversation. Audit log shows every turn's cost in USD.

### Open decisions during phase

- LLM provider for the coach (Claude Sonnet 4.6 is the working assumption per PRD; Opus for `deep`; Haiku for `classifier` and `extractor`). Set in `system_config.models`.
- Embedding model (Voyage 3 vs OpenAI text-embedding-3-small — small + cheap is fine for v1 corpus size)
- Mode-transition tuning — start with simple time + activity heuristics, adjust with usage

### Phase C tuning items (refinements, not blockers)

These are documented as "gaps" / "outstanding" in `docs/05-coach-interaction-design.md`. They sharpen behaviour but do not block the C scaffold from shipping. Tune with real usage data after C lands; do not pre-litigate.

- Knowledge / persona synthesis style guide (§GAP 3)
- Long-term relationship arc (week-1 → month-1 → year-1 voice + context shifts) (§GAP 4)
- Coach switching rules — when allowed, what carries over, what resets (§GAP 5)
- Activity-suggestion logic — what cues a suggestion, what blocks one (§GAP 6)
- Mode-boundary heuristics for users in irregular schedules (shift workers, frequent travellers)
- Re-engagement tone after long absence (>30 days)
- Coach-led reflection cadence calibration

### Effort

Large. The biggest single phase.

---

## Phase D — Widget catalogue + settings expansion

**Why now:** the coach is alive but only knows W-01 through W-08 + W-37. PRD specifies 21 widgets for v1, plus a much richer settings tree. With real data behind it, we can fill these in concretely (a `render_milestone` tool actually pulls real numbers, not fake "30 days").

### Sub-goals

- **Avatar swap-in (data fill, no schema change):** generate Midjourney portraits per `docs/twikka_coach_image_prompts.md`, run through HeyGen Photo Avatar pipeline, upload size variants to R2, populate `coach_personas.avatarRefs.{hero,profile,chat,message,tiny}` per coach + `heyGenAvatarId` + `voiceId`. Coach picker / chat header / Settings → Coach automatically use the photos in place of monograms (the `AbstractAvatar` widget already falls back gracefully).
- All 21 v1 widgets implemented + visually polished:
  - Already done: W-01 (coach text), W-02 (user text), W-03 (system notice), W-04 (activity ack), W-05 (suggestion), W-06 (check-in), W-08 (milestone), W-37 (typing)
  - Add: W-07 (trajectory snapshot inline), W-09 (educational tile), W-10 (group/event suggestion), W-11 (accountability prompt — v1 stub), W-12 (plan/goal card), W-13 (reflection card), W-14 (summary card), W-15 (age capture), W-16 (gender capture), W-17 (health connection), W-18 (notifications permission), W-19 (subscription prompt), W-20 (data export), W-21 (coach handover)
  - Build but flag off (revealed in v3): W-22 (affiliate suggestion — coach-surfaced cross-sell to a real human practitioner; built into the catalogue now so v3 reveal is a flag flip, not new development. Per-persona sample lines already in the persona doc. See `docs/memory/reference_coach_character_system.md` for tone discipline + frequency cap.)
- Every interactive widget watches `subscriptionStateProvider` and disables write actions when in read-only mode (Phase E delivers the actual lapse → read-only transition; widgets are wired to respect it from this phase so no second pass is needed)
- Widget gallery screen (debug only) showing every widget in every state
- Full settings tree per PRD §5.5:
  - Account (name, email, subscription, delete account, export)
  - Coach (change coach, coach notification prefs)
  - Health (Apple Health / Health Connect, what data is read, disconnect)
  - Notifications (push categories, email, frequency, quiet hours)
  - Privacy (what's shared with whom, data export, deletion, consent history)
  - Theme (light/dark/system, text size — wires the theme system from Phase F)
  - Help (FAQ, contact support, about Twikka)
  - Debug (debug builds only — flag overrides, kill-switch simulator, fact viewer, audit log viewer)
- Account lifecycle states wired (`active_trial` / `active_paying` / `payment_failed` / `cancelled_*` / `lapsed` / `dormant` / `deletion_requested` / `deleted`) — most are placeholders until Phase E

### What gets built

- 13 new widget Flutter components (data + presentation)
- Each widget's coach tool wired in `convex/agent/`
- Widget gallery screen behind `--dart-define=DEBUG=true` or Settings → Debug
- Settings tree: ~12 new sub-screens, each thin
- Profile editor that reads + writes `user_profile_slots` directly
- Consent history viewer (Privacy)
- Data export trigger (creates a Convex action; payload generation deferred to Phase E once R2 is wired)

### Demoable state

Coach uses any of the 21 widgets in conversation, all rendering correctly. Widget gallery screen lets us review every widget in every state without stage-managing chat. Settings is a real, full tree the user can navigate through; many leaves work for real (theme, profile, consent), a few are "this works after Phase E" (subscription, data export delivery). All widgets respect a debug-toggled "subscription lapsed" simulation by greying out their write actions.

### Open decisions during phase

- W-13 reflection card cadence — weekly, event-driven only, or mix? (PRD §25.3)
- W-12 plan card edit affordance — full inline edit or "tweak via chat" only?
- Whether to ship a manual-log path in v1 (PRD §25.3)

### Effort

Medium-large. Mostly mechanical Flutter work but a lot of surface area.

---

## Phase E — External integrations + subscription enforcement

**Why next:** the app is functionally complete after Phase D for a single ungated user. To ship, we need notifications, transactional email, marketing email, payment, file storage for exports, and the actual subscription-state enforcement that Phase D's widgets are already prepared for.

> **Optional split if velocity demands.** E1 = notifications + email (OneSignal + Postmark + GoHighLevel). E2 = payments + storage + read-only enforcement (RevenueCat + Apple/Google IAP + R2 + subscription lifecycle). Paddle scaffolding is part of E2 too but only exercised by v3/v4.

### Sub-goals

**Notifications:**
- OneSignal push notifications, with category preferences honoured, quiet hours, frequency adaptation hooked to coach mode. Each send wrapped with `recordedCall(...)`.

**Email:**
- Postmark transactional: verification codes, magic links, receipts, payment failure, trial reminders, deletion confirm, export delivery. Each send audited.
- GoHighLevel marketing sync: webhook on user lifecycle events (signup, mode change, lapse, return). Each sync audited. Pauseable via `system_config.flags.pauseGoHighLevelSync`.

**Payments:**
- Mobile B2C subscription via RevenueCat over Apple App Store IAP and Google Play Billing (the stores are merchants of record). RevenueCat handles cross-platform identity, receipt validation, restore purchases, introductory-offer trial mechanics.
- Approximately 60-day introductory-offer trial configured in App Store Connect and Play Console; payment method is registered with the store but not charged until trial end.
- W-19 reminders at 14 / 7 / 2 days before trial end (soft). At trial end the store charges automatically unless cancelled — no separate "card capture" step.
- In-app cancellation deep-links to the platform's subscription management screen (Apple's rules require this). The cancel CTA is equally prominent to continuation.
- Subscription state transitions written to the Convex `subscriptions` table via RevenueCat webhook into a Convex HTTP action. `users.lifecycleStage` is derived from the active subscription row.
- Paddle scaffolding for v3 (affiliate per-active-client billing) and v4 (enterprise annual contracts) added as part of E2 but not exercised by the v1 mobile app. Paddle webhook handlers fire into the same Convex `subscriptions` table with `provider: "paddle"`.

**Storage:**
- Cloudflare R2 via Convex `@convex-dev/r2` component
- v1 use: signed URLs for data exports (W-20). Photo attachments deferred to v2.

**Subscription enforcement (the soft gating):**
- `subscriptionStateProvider` is now backed by the real Convex `subscriptions` table populated by RevenueCat (mobile) and Paddle (web/B2B) webhooks
- When `lifecycleStage` transitions to `lapsed` (or `payment_failed` past grace), the app does **not** redirect — it shows a persistent banner and disables write actions:
  - Banner across all screens: "Your subscription has lapsed. Resubscribe to keep chatting with [Coach]." with a single "Resubscribe" CTA → Settings → Subscription
  - Composer disabled with greyed placeholder ("Resubscribe to send messages")
  - Suggestion / check-in / plan card actions disabled
  - All read paths still work — past chat, journal, settings, profile editing, data export, account deletion
  - Coach turns paused (no new LLM calls)
- This is a **soft state**, distinct from the hard takeovers of `/offline` and `/update-required`. The user can still use the app, just can't write new things.
- When the user resubscribes (re-purchase via the store), banner clears and write actions resume — instantly, via the live-globals pattern.

### What gets built

- `convex/notifications/onesignal.ts` — send, preferences, segmentation
- `convex/email/postmark.ts` — templated send for each transactional type
- `convex/email/highlevel.ts` — webhook sync
- `convex/billing/revenuecat.ts` — webhook handler for RevenueCat events; writes to `subscriptions` with `provider: "apple_iap"` or `"google_play"`; derives `users.lifecycleStage`
- `convex/billing/paddle.ts` — webhook handler for Paddle events (v3/v4 use); writes to `subscriptions` with `provider: "paddle"`
- `convex/billing/lifecycle.ts` — shared lifecycle-state machine consumed by both providers
- `convex/storage/r2.ts` — using the official Convex R2 component
- Flutter: `lib/src/core/services/revenuecat_service.dart` (singleton, init in Phase 2 of bootstrap, `ensureIdentified` on Clerk sign-in success — pattern from couple-tools)
- Flutter: paywall via `RevenueCatUI.presentPaywall()` from `purchases_ui_flutter`
- Flutter: notification permission flow, settings UI for preferences
- Flutter: persistent `SubscriptionLapseBanner` widget mounted in `AppShell` body, visible whenever `subscriptionStateProvider` reports a write-blocking state
- Flutter: Settings → Subscription screen that deep-links to the platform's subscription management for cancellation
- iOS / Android: app capabilities for push, notification service extension for rich notifications, IAP entitlements

### Demoable state

New user signs up, gets a Postmark email with their code. Tries the app for a few days, gets push notifications honouring quiet hours. Lifecycle event syncs to GoHighLevel. Trial countdown tracked silently against RevenueCat's introductory-offer state. At day 50, soft W-19 reminder. At day 60, the store charges automatically; subscription transitions to `active_paying`. User cancels via Settings → Subscription which deep-links to the App Store / Play subscription management screen, retains access until period end. After period end, lapse banner appears + composer disabled + writes blocked but the app stays usable. User re-subscribes via the store, RevenueCat webhook fires, banner vanishes, writes resume — all live.

### Open decisions during phase

- **v1 pricing — set at Phase E kickoff, not mid-phase.** PRD §25.2 defers the final number to "near launch", but a concrete placeholder (e.g. one IAP product per platform) is required *before* the IAP plumbing is built so paywall + receipt validation + restore can be exercised end-to-end. First task of Phase E: agree placeholder, register the IAP products, surface via RevenueCat offerings.
- Whether to wire Paddle scaffolding now (recommended: yes, even though v1 doesn't exercise it, so Phase H stub work is just data-table additions)
- OneSignal app IDs per environment (dev / prod)
- RevenueCat project / API key strategy across dev and prod environments

### Effort

Large. Each vendor has its quirks; together they're a chunky phase.

---

## Phase F — Themes, accessibility, i18n, feature flags

**Why now:** with v1 functionally complete (Phases A–E), this is the polish phase before ship. Each item is required by PRD non-negotiables (§2.3) or accessibility commitments (§20).

### Sub-goals

- Restructure theme as a proper structured `AppTheme` object (PRD §20.1) so multiple themes can ship
- Ship Warm Light (default) + Warm Dark
- Settings → Theme picker with instant switch (couple-tools style)
- Type scaling honoured up to 150% (PRD §20.3) — verify and fix any layout breaks
- WCAG 2.2 AA contrast pass on every screen
- Screen reader labels on every interactive element; bubbles read as "coach said" / "you said"
- Reduced motion honoured (no information-bearing motion)
- ARB string extraction across the app — en-AU only ships, but every visible string is externalised
- Convex-backed feature flag system: `feature_flags` table, Riverpod wrapper for client-side reads, admin tooling (script-level for now) for flips. **Distinct from `system_config`** — flags do per-user/org/cohort gradual rollouts; system_config does global operational state.

### Planned locale roadmap (post-v1, prioritised by demand)

- English variants: en-AU (v1), en-GB, en-US, en-NZ — same ARB tree with per-region overrides for spelling and idiom
- Spanish (neutral)
- Portuguese (Brazilian)
- French
- German
- Italian
- Japanese
- Korean
- Simplified Chinese

Each non-English locale will require a per-language pass on coach-persona prompts (PRD §20.4 — the coach voice doesn't translate cleanly via MT).

### What gets built

- `lib/src/core/theme/themes.dart` — structured `AppTheme` registry, Warm Light + Warm Dark
- `lib/src/core/theme/theme_picker.dart` — preview + switch UI
- Accessibility audit pass: every screen at 100%, 130%, 150% type
- `lib/l10n/app_en_AU.arb` — every visible string externalised
- `convex/featureFlags/` — schema + helpers + admin script
- `lib/src/core/feature_flags/` — Riverpod provider, debug toggles in Debug settings

### Demoable state

Toggle dark mode in settings, the whole app re-themes instantly. Crank type to 150%, app still works (chat may scroll a bit more, but no truncation or overlap). VoiceOver reads the Coach screen sensibly. Feature flag override in Debug flips a v2 social UI element on/off.

### Open decisions during phase

- Whether to use `flex_color_scheme` (less code, more constraint) or hand-rolled (more code, full freedom). Recommend hand-rolled given how specific the warm palette is.

### Effort

Medium. Theming is the biggest piece; everything else is per-screen sweeps.

---

## Phase G — v2 social scaffolding (built, flagged off)

**Why before ship:** PRD's "build all, deploy staged" commitment. v2 social is the first thing to reveal post-v1. We design and build the full UI now while the design is fresh and decisions are coherent. Per our discussion: **mode A** (full UI built and runnable in dev, hidden via flag in prod).

### Sub-goals

- Complete v2 social UI (per PRD §10.2 + design package):
  - Full DM threads (cream-on-cream + per-member tint variants)
  - Group threads (coach-cohort, peer, open channels)
  - Invite flows: locked thread, takeover sheet, quiet notice (all three variants)
  - Member profiles with safety actions (mute, block, report)
  - Group info / members / leave / mute
  - Block & report sheet (3-stage)
  - New message / find people
  - Media viewer
- Reactions, photo attachments (R2-backed), URL previews, voice notes UI shells, file cards, location cards
- All data tables for v2 (`connections`, `groups`, `invites`) added to Convex schema with scope-enforcing helpers
- Feature flag `v2_social` defaults `false` in prod, `true` in dev

### What gets built

- Flutter screens for all of the above (the design package's `social-screens.jsx` translates fairly directly)
- Convex schema additions
- Voice note UI shells (recording + waveform; actual audio playback hooked when v2 voice coaching ships)
- Photo upload + R2 thumbnail generation

### Demoable state

Engineer flips `v2_social=true` in Debug. Social tab transforms from the v1 inbox shell to the full inbox + thread navigation. Two seeded fake users can DM each other. A coach-facilitated cohort renders correctly. Invite flows demonstrable end-to-end. Flip the flag back, social returns to v1 shell. No v2 UI visible in a production-flagged build.

### Open decisions during phase

- v1 exposed scope (PRD §10.1 says accountability-partner DM + coach cohort + invites only). Confirm at the time we flip flags.
- Whether to build "nearby at parkrun" discovery now or defer.

### Effort

Large. Could be deferred entirely if scope pressure mounts (per build-all-deploy-staged: "everything is built but only some is shipped").

---

## Phase H — Stub structures for v3 / v4

**Why:** PRD commits to data model supporting affiliates from day one even though v3 is later. This phase is small but structural.

### Sub-goals

- `apps/practitioner/` and `apps/enterprise/` directories created with READMEs explaining the future plan
- v3 data tables added to Convex schema (`practitioners`, `client_affiliations`) with helpers — never populated in v1, but the slots exist
- v4 enterprise tables (`enterprise_integrations`, `enterprise_cohorts`) added similarly
- `knowledge_fact` already supports practitioner constraints via `kind: 'constraint', source: 'practitioner'` — no schema change needed
- `audit_log` table (already populated from Phase A onwards) gets v3/v4 helpers for affiliate and enterprise actions

### Effort

Small.

---

## Phase I — Release prep

**Why:** ship.

### Sub-goals

- Manual QA pass on the golden paths: signup, coach selection, daily chat, activity capture, mode transitions, lifecycle states (including the lapse banner round-trip), payment, cancellation, deletion, export
- Accessibility audit (third-party or detailed self-audit, screen reader, dynamic type, contrast)
- Security review (per our `/security-review` skill convention) on the pending changes
- Privacy policy + terms of service (drafted with legal counsel, hosted at twikka.com)
- App Store + Play Store metadata: descriptions, screenshots, privacy nutrition labels (Apple) + data safety form (Google)
- Beta cohort: select ~50 users (probably from waitlist + couple-tools community), 4-week soft beta
- Crash + error monitoring (Sentry per PRD §22.4)
- Deletion / export flow tested end-to-end

### What gets built

- `docs/security.md` per PRD §22.5
- `docs/privacy.md` + hosted version
- Sentry + crash reporting integration
- Beta TestFlight + Play Console internal track distribution
- Customer support address + canned-response library

### Effort

Medium, mostly non-code.

---

## Cross-cutting principles (apply throughout)

These aren't phases — they apply to every phase:

### Voice + content
- **Australian English, warm voice** — every string we add
- **Never-rescinded** — no streaks, no red/green, no missed-X language anywhere; vet every screen against PRD §2.3

### Layout + i18n
- **Locale-elastic layouts** — every control with text (button, chip, list tile, header, tab label, snackbar) must tolerate string-length variance from day one. Concrete rules: (1) no fixed-width buttons that fit only the English label, (2) headers + titles must wrap or auto-shrink rather than truncate, (3) bottom nav labels need room for ~1.5× the English length (German, French) and conversely cope with very short ideographic labels (Japanese, Chinese), (4) form-field labels never sit *inside* the field if they could overflow — float labels above. We're shipping en-AU only in v1, but every UI decision should be reviewable later under a German + Japanese smoke test. Full roadmap in `docs/memory/reference_locales.md`.

### Audit + observability
- **External call audit** — every outbound call to a paid or measurable third party (LLM via OpenRouter, embedding generation, Postmark email, OneSignal push, R2 storage, anything else we add) writes an `external_call` row synchronously after the call returns. Lets us slice spend by user / agent / persona / cohort / time period without retroactive plumbing. Schema lands in Phase A so the helpers exist before any real call fires — every integration is a one-liner wrap (`recordedCall(ctx, {kind, provider, ...}, async () => …)`). Never log full prompts or response bodies (those live in `messages` for LLM, or are unsensitive for service calls). Schema + rules in `docs/memory/reference_external_call_audit.md`.

### Reactivity + gating states
- **Live-global reactivity** — Convex's reactive queries pair with Riverpod stream providers to give the app push-based, always-current globals. Every state the UI must react to instantly — `system_config`, `currentUser` (lifecycle stage, subscription tier, profile slots, current coach), the active thread, unread counts — is exposed as a Riverpod provider backed by a Convex live query. The router itself watches these. Discipline: never `read` a global where you should `watch` it. Schema for the globals + the discipline rules in `docs/memory/reference_live_globals.md`.

- **Three categories of gating state.** Be deliberate about which a given condition is:
  1. **Hard takeover (route-level redirect)** — the user can't use the app at all in this state. Examples: kill switch (`/offline`), version too old (`/update-required`), account deletion in progress (`/account-pending-deletion`), signed out (`/welcome`). Implemented as router redirects driven by live-watched globals.
  2. **Soft state (banner + write-only block)** — the user can still navigate, read past chat, see their journal, edit profile, manage subscription, export data, delete account. They just can't write new content. Examples: subscription lapsed, payment failed past grace period, trial ended without card. Implemented as a persistent banner mounted in `AppShell` body + every interactive widget watching `subscriptionStateProvider` and disabling write actions when it reports a write-blocking state. Coach turns pause; no new LLM calls. Banner has a single primary CTA to resolve.
  3. **Per-action gates** — single buttons or widgets disabled because the user lacks entitlement (premium feature on standard tier, etc.). Implemented inline at the button.
  
  All three flow from the same live-globals primitive — no polling, no "remember to refresh after webhook".

### Architecture + delivery
- **Scope-enforced data access** — every Convex helper validates `organisationId` and ownership; no UI-only gates
- **Generated `.g.dart` committed** — per Flutter convention
- **No Claude attribution** in commits, per user prefs
- **Pedantic docs** — when something non-obvious lands, add or update a doc rather than relying on memory
- **Operational reference patterns live in `/docs/memory/`** (in git, reviewable in PRs). Five files today: `system_config`, `external_call` audit, `live_globals`, `locales`, `coach_character_system`. Claude's auto-memory mirrors these as thin pointers; in-tree files win on divergence. New operational patterns go in `/docs/memory/` first, with a one-line pointer added to auto-memory afterwards.
- **Tests** — start with: integration tests for the auth flow + coach turn (Phase A/C), unit tests for the activity classifier (Phase B), schema migration sanity checks. Don't aim for 100% — aim for the load-bearing seams.
- **Git hygiene** — small commits within each phase; phase boundaries get a tag (`v0.A`, `v0.B`, …) for easy rollback

---

## Order rationale (why this sequence)

A → B → C → D → E → F → G → H → I.

- **A first** because every other phase needs real auth/users + the audit + system_config + safety-gate plumbing
- **B before C** because the agent (C) needs real activities and locations to be useful
- **C before D** because most v1 widgets either depend on the coach (suggestion, milestone, reflection) or capture data the coach reads (age, gender, health connection)
- **D before E** because external integrations are easier to test against complete UI surfaces; D's widgets are pre-wired to respect the read-only state E delivers
- **E before F** because polish on a feature-incomplete product wastes effort
- **F before G** because v2 social inherits the theme system + flag system from F
- **G before H** because v2 social proves the flag system end-to-end, and v3/v4 then plug into the same scope-enforcement patterns
- **I last**

---

## What's deliberately **not** in this plan (deferred to later)

- **Voice coaching** (v2 Premium feature; PRD §13.2)
- **Video coach moments** (v2 Premium; **HeyGen** is the chosen provider, with the same avatar pipeline supporting rendered moments today and live streaming avatars in a future tier; aligned with PRD §13.3)
- **Personalised videos** (v2/v3 Premium — HeyGen API → R2 → push, "Margaret's weekly reflection just for you")
- **Live video calls with the user's coach** (v3+, very premium — HeyGen Streaming Avatars or equivalent)
- **Practitioner web app** (v3 build phase)
- **Enterprise web app** (v4 build phase)
- **Smartwatch companion**
- **Garmin / Fitbit integrations** (PRD §9.1 — assess based on demand)
- **Native tablet layouts** (responsive in v1 acceptable per PRD §25.1)
- **Public profiles, sharing to external networks, user-authored blogs** — explicitly out (§25.1)
- **Food / nutrition / weight / sleep / menstrual tracking** — explicitly out

---

## Effort summary

| Phase | Scope | Est. | Demoable end state |
|---|---|---|---|
| **0** | Shell, theme, fake auth | done | The pre-Phase-A scaffold |
| **A** | Real auth + Convex spine + safety gates + onboarding | medium-large; **done** | Sign up for real, pick coach, kill-switch & update-required gates work live |
| **B** | Activities + cities + Health plugin | medium; **done** | Activities flow in from HK / Health Connect, city pickable, classifier resolves phrases with cost auditing |
| *(polish)* | CI/CD scaffold, envied, theme variants, R2 photo upload, auth robustness | small-medium each; **done** | Shippable infra; not a phase, but worth tracking |
| **C** | Memory + agent (Margaret comes alive) | large; **next** | Coach is real, remembers you, every turn cost-audited |
| **D** | Widget catalogue + settings expansion | medium-large | Full v1 UI surface, widgets respect simulated read-only state |
| **E** | OneSignal + Postmark + GHL + Paddle (R2 already in) + lapse-as-banner | large | Production plumbing; subscription lapse cleanly blocks writes via banner |
| **F** | Themes (variant system already in) + a11y + i18n + flags | medium | Polish + dark mode + flag system |
| **G** | v2 social scaffolding (flagged off) | large | Future-proof, ready to reveal |
| **H** | Stub v3/v4 structures | small | Schema slots exist |
| **I** | Release prep | medium (non-code) | Submitted to stores |

This will evolve as we go. Phases will overlap when they share vendor surface area. We'll add sub-phases when one proves big enough to warrant it.

---

## Reference docs

The plan composes against these — read them per phase:

- `01-architecture-patterns.md` — overall stack, layout conventions
- `02-old-database-schema.md` — old Supabase Twikka schema, lifted patterns + lessons
- `03-old-app-reference.md` — old Flutter app, lifted icons + theme + structure
- `05-coach-interaction-design.md` — Phase C spec: data structures, reactive + proactive pipelines, mode computation, signal extraction, safety guardrails
- `docs/twikka_v1_prd.md` — the full v1–v4 PRD (source of truth)
- `docs/twikka_coach_personas.md` — six personas with voice + sample lines + safety responses
- `docs/twikka_coach_image_prompts.md` — Midjourney v7 prompt library + HeyGen workflow
- `docs/twikka-wiki-design.md` — knowledge wiki + RAG schema + audit process
- `docs/memory/reference_external_call_audit.md` — `external_call` schema + helper pattern
- `docs/memory/reference_system_config.md` — `system_config` singleton schema + read/write pattern
- `docs/memory/reference_live_globals.md` — Convex+Riverpod live-globals discipline + provider list
- `docs/memory/reference_locales.md` — locale roadmap + locale-elastic layout rules
- `docs/memory/reference_coach_character_system.md` — index to `docs/twikka_coach_personas.md` + `docs/twikka_coach_image_prompts.md`, plus AI disclosure rules, avatar strategy across phases, v3 affiliate cross-sell W-22
