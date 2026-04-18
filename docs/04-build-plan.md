# Twikka — Build Plan

**Status:** Active. The plan we work to. Updated as decisions evolve.
**Origin:** Distilled from `Twikka_v1_prd.md` + design discussion 2026-04-18, revised after the architectural decisions on memory, audit, system config, live globals, and gating states.
**How to use:** Each phase below is a self-contained, demoable chunk. We complete one, ship-or-show, then move on. Decisions deferred *into* a phase are listed at the start of that phase so we don't pre-litigate them.

> **Working principle:** every phase ends in a state the user can run on the iOS simulator and click through. No "scaffolding completed but nothing visibly different" milestones. If a phase's only output is back-end, we add a debug screen that proves it works.

---

## Where we are now (Stage 0 — already shipped)

`67c36dd` on `main`. The app shell:

- Welcome / Login / Signup / OTP screens (fake auth, `shared_preferences`-backed)
- Adaptive shell — `NavigationBar` <600px, `NavigationRail` ≥600px
- Four tabs: **Coach / Progress / Social / Settings** with bell on each header
- Coach screen: Margaret avatar header, cream/terracotta bubbles, fake initial messages, ActivityAck card, Suggestion + CheckIn + Milestone widgets, typing indicator, calm composer with terracotta send
- Progress screen: hero "47 days", soft area chart, milestone cards, "What you've tried" list
- Social screen: inbox shell with invite, coach pinned, DMs, groups (no thread navigation)
- Settings hub + 5 subroutes (Profile, Preferences, Subscription, About, Debug)
- Theme: Warm Light only, Fraunces + Plus Jakarta Sans via `google_fonts`
- Reference docs (architecture, old DB schema, old app, this plan)

**What it ISN'T:** no real auth, no Convex, no real activity capture, no real coach, no real notifications, no payments, no dark mode wired to a switcher, no v2 social, single coach (Margaret), single screen of fake chat. Those are everything below.

---

## Phase A — Real auth + data spine + safety gates

**Why first:** every other phase depends on a real `userId`. The longer we run on fake state, the more code we touch when we wire in the truth. Doing this early means subsequent phases write against the real Convex/Clerk surface from the start. We also land the operational safety gates here so they're battle-tested before there's anything to lose.

### Sub-goals

**Auth (Clerk):**
- Real Clerk-backed sign-up and sign-in (email + 6-digit code, no passwords)
- Single morphing auth screen replaces the current 4-screen flow: email entry → backend probe → adds name field if new → code field → in
- Coach picker shown after the first OTP for first-time users; reachable from Settings → Coach for repeat use
- Six coach personas added in seed per `docs/twikka_coach_personas.md` (operative lineup: **Priya / Fiona / Margaret / Ben / Rob / Tom** — supplants the PRD's "Dave 60s M" with "Rob 45s M" for a cleaner 1F+1M-per-age-band matrix)
- **Explicit AI disclosure copy** lands in three surfaces: welcome screen subtitle ("Coaches are AI personas trained by our expert team"), coach-selection screen line above the cards, small "AI coach" text under the coach name in the chat header. Settings → About gets the longer plain-language explanation in Phase D. See `memory/reference_coach_character_system.md`.

**Convex tables (the spine):**
- `organisations`, `users`, `memberships` — multi-tenant from day one. Every queryable entity scoped by `organisationId`. Personal users get a single-person org.
- `coach_personas`, `coachAssignment` — six personas seeded; `coachAssignment` records the user's current pick
- `threads`, `messages` — Convex Agent component tables (real chat in Phase C)
- `system_config` — singleton: kill switch, `unavailableReason`, `estimatedBackOnline`, `minAppVersion`, `updateLinks.{ios,android}`, `models.{classifier,general,deep,extractor,embedding}`, operational flags, soft cost budgets. Schema in `memory/reference_system_config.md`.
- `external_call` — every paid/measurable third-party call writes a row synchronously. Schema in `memory/reference_external_call_audit.md`. Helpers (`recordedCall(...)`) ready for Phases B/C/E to wrap their integrations as one-liners.
- `model_pricing` — history-tracked `(modelSlug, effectiveFrom)` price table the audit helper consults for cost computation
- `audit_log` — sensitive-action log (consent changes, profile edits, deletion request); helpers wired in this phase, used continuously thereafter

**Live-global providers (the runtime spine):**
- `convex_flutter` (or `flutter_convex`) for live queries
- Riverpod providers backed by Convex live queries: `systemConfigProvider`, `currentUserProvider`, `currentCoachProvider`, `subscriptionStateProvider` (placeholder until E)
- `appRouterProvider` watches all of the above so server-driven state changes flow to the UI without polling. See `memory/reference_live_globals.md` for the discipline.

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

- Clerk Flutter integration approach — official SDK if it exists, otherwise wrap their REST + WebView for OAuth callbacks
- Whether to use Clerk's default email verification or hand off to Postmark from day one (recommend Clerk's for Phase A simplicity; switch in E for branding consistency)
- Convex deployment workflow — we have a dev project; do we set up staging now or later?

### Effort

Medium-large. Multi-day. The Clerk integration and the live-globals plumbing are the two surprises to budget for.

---

## Phase B — Activities + cities (data foundation)

**Why second:** activities are a first-class concept that touches the schema, the agent's tools, the Journal screen, and the Health plugin. Cities likewise underpin location for v1 (manual selection) and v2+ (events, nearby). Both are pure data with light UI; do them before the agent so the agent has real data to talk about.

### Sub-goals

- `activity_types` taxonomy seeded with the 13 canonical types from PRD §9.2 + cardio/strength/mobility flags + Apple/Google identifier mappings
- `activities` table for instance log (source, canonicalType, durationMin, startTime, etc.) with `platformActivityId` for dedupe
- `activity_aliases` per-user table for the learning classifier
- Two-level classifier as a Convex action: dictionary lookup → LLM fallback → cache result as alias. LLM fallback wrapped with `recordedCall(...)` so cost shows up in `external_call` from day one.
- Apple Health (HealthKit) + Android Health Connect integration via the `health` Flutter package
- `cities` table seeded with full ~140k GeoNames dump (one-shot seed script). Includes `alternatenames` (synonyms) so the search index matches "NYC" to "New York" and so on.
- Convex search index on city `name`, `asciiname`, `alternatenames`, `country_code`
- Settings → Profile → City type-ahead picker
- Time zone auto-detected on city pick, user-overridable

### What gets built

- Convex schema additions: `activity_types`, `activities`, `activity_aliases`, `cities`
- `convex/seed/cities.ts` — pulls GeoNames dump, transforms, ingests in batched mutations
- `convex/seed/activityTypes.ts` — the canonical taxonomy
- `convex/agents/classifyActivity.ts` — two-level classifier action; reads `system_config.models.classifier` for which model to use
- Flutter: `lib/src/features/health/` with `HealthService` wrapping the `health` package
- Flutter: city picker widget + provider
- Debug screen showing recent captured activities (proves Health is wired)

### Demoable state

User connects Apple Health from Settings → Health, walks around (or nudges activity in the simulator's debug menu), opens Twikka, sees their activities show up in a debug list. User picks "Glasgow, Southside" from the city search. Coach can call `classifyActivity("did the lawn this arvo")` → returns `{ canonicalType: 'garden', cardio: false, strength: false, durationMin: null, timeOfDay: 'afternoon' }`, and the LLM call shows up in the audit log with cost.

### Open decisions during phase

- Which classifier model — small/fast (Haiku-tier) makes the most sense; pin in `system_config.models.classifier`
- iOS Health permissions copy — needs explicit, plain-language framing
- Health Connect (Android) vs Google Fit — Health Connect is the going-forward path; commit and don't dual-target

### Effort

Medium. The 140k city ingest is mostly a script; Health plugin has surface area but is well-documented.

---

## Phase C — Memory + agent (the coach comes alive)

**Why third:** the coach is the product. Once Phases A+B are done we have real users, real activities, and the data spine the coach needs. Now we wire the brain.

> **Optional split if velocity demands.** C1 = memory tables + slot state machine + write tools (agent still stubbed); C2 = Convex Agent + LLM + RAG + the coach is real. Each ships independently.

### Sub-goals

**Memory (three layers):**
- `knowledge_fact` table with vector embeddings (Convex vector search), three scopes (`agent`, `platform`, `user`). Includes `createdAt`, `lastConfirmedAt`, `occurredAt?`, `expiresAt?`, `sourceMessageId?`, `lastAccessed`, `accessCount`, `confidence`. Recency-decay reranker on retrieval.
- `user_profile_slots` table with state machine per slot (`unknown` / `asked_pending` / `declined` / `provided` / `inferred`). Slots: `dateOfBirth`, `gender`, `cityId`, `timeZone`, `primaryMotivation`, `healthConnection`, `pushPermission`, `preferredCheckInTime`. All editable from Settings → Profile.
- Transcripts (existing `messages`) retained forever — the coach doesn't load them wholesale, but the user can.

**Agent:**
- Convex Agent component integrated; persona layer separated from agent (per PRD §8.1–8.2)
- All LLM calls routed through OpenRouter as a single gateway. Model selection comes from `system_config.models` (operator-editable, no code deploy needed). Per-persona overrides allowed via `coach_personas.modelOverride` for personas where a specific model matters.
- Every LLM call wrapped with `recordedCall(...)` → `external_call` audit row with token counts, USD cost, latency, parent attribution (user, persona, thread, message)
- Six coach personas with prompt-style guidance + sample lines per `docs/twikka_coach_personas.md` (the operative source — supplants PRD §8.3). Each persona prompt includes:
  - The persona's would / wouldn't say lists (compressed to directives)
  - 6–10 canonical sample lines as calibration
  - The "are you AI?" sample response in their voice (hard guardrail — never deflect or deny)
  - Mode-specific (recovery / momentum / flow) overlays
  - User-memory injection
- Adaptive coach mode (recovery / momentum / flow), inferred and stored on user
- Coach tools: `write_user_memory`, `log_activity`, `classify_activity`, `get_recent_activity`, `get_user_profile`, `render_*` for each widget type, `schedule_proactive_checkin`, `flag_for_human_review`
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

### Effort

Large. The biggest single phase.

---

## Phase D — Widget catalogue + settings expansion

**Why now:** the coach is alive but only knows W-01 through W-08 + W-37. PRD specifies 21 widgets for v1, plus a much richer settings tree. With real data behind it, we can fill these in concretely (a `render_milestone` tool actually pulls real numbers, not fake "30 days").

### Sub-goals

- All 21 v1 widgets implemented + visually polished:
  - Already done: W-01 (coach text), W-02 (user text), W-03 (system notice), W-04 (activity ack), W-05 (suggestion), W-06 (check-in), W-08 (milestone), W-37 (typing)
  - Add: W-07 (trajectory snapshot inline), W-09 (educational tile), W-10 (group/event suggestion), W-11 (accountability prompt — v1 stub), W-12 (plan/goal card), W-13 (reflection card), W-14 (summary card), W-15 (age capture), W-16 (gender capture), W-17 (health connection), W-18 (notifications permission), W-19 (subscription prompt), W-20 (data export), W-21 (coach handover)
  - Build but flag off (revealed in v3): W-22 (affiliate suggestion — coach-surfaced cross-sell to a real human practitioner; built into the catalogue now so v3 reveal is a flag flip, not new development. Per-persona sample lines already in the persona doc. See `memory/reference_coach_character_system.md` for tone discipline + frequency cap.)
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

> **Optional split if velocity demands.** E1 = notifications + email (OneSignal + Postmark + GoHighLevel). E2 = payments + storage + read-only enforcement (Paddle + R2 + subscription lifecycle).

### Sub-goals

**Notifications:**
- OneSignal push notifications, with category preferences honoured, quiet hours, frequency adaptation hooked to coach mode. Each send wrapped with `recordedCall(...)`.

**Email:**
- Postmark transactional: verification codes, magic links, receipts, payment failure, trial reminders, deletion confirm, export delivery. Each send audited.
- GoHighLevel marketing sync: webhook on user lifecycle events (signup, mode change, lapse, return). Each sync audited. Pauseable via `system_config.flags.pauseGoHighLevelSync`.

**Payments:**
- Paddle subscription: 60-day trial (no card upfront), tier structure (standard only in v1)
- W-19 reminders at 14 / 7 / 2 days before trial end (soft); blocking takeover at trial end if no card
- In-app cancellation, equally prominent to continuation
- Lifecycle state transitions written to `users.lifecycleStage` via Paddle webhooks

**Storage:**
- Cloudflare R2 via Convex `@convex-dev/r2` component
- v1 use: signed URLs for data exports (W-20). Photo attachments deferred to v2.

**Subscription enforcement (the soft gating):**
- `subscriptionStateProvider` is now backed by real `users.lifecycleStage` from Paddle webhooks
- When `lifecycleStage` transitions to `lapsed` (or `payment_failed` past grace), the app does **not** redirect — it shows a persistent banner and disables write actions:
  - Banner across all screens: "Your subscription has lapsed. Resubscribe to keep chatting with [Coach]." with a single "Resubscribe" CTA → Settings → Subscription
  - Composer disabled with greyed placeholder ("Resubscribe to send messages")
  - Suggestion / check-in / plan card actions disabled
  - All read paths still work — past chat, journal, settings, profile editing, data export, account deletion
  - Coach turns paused (no new LLM calls)
- This is a **soft state**, distinct from the hard takeovers of `/offline` and `/update-required`. The user can still use the app, just can't write new things.
- When user resubscribes, banner clears and write actions resume — instantly, via the live-globals pattern.

### What gets built

- `convex/notifications/onesignal.ts` — send, preferences, segmentation
- `convex/email/postmark.ts` — templated send for each transactional type
- `convex/email/highlevel.ts` — webhook sync
- `convex/billing/paddle.ts` — webhook handlers, subscription state machine, lifecycle transitions
- `convex/storage/r2.ts` — using the official Convex R2 component
- Flutter: notification permission flow, settings UI for preferences
- Flutter: subscription screen with Paddle's mobile checkout (web view OR native IAP — open decision)
- Flutter: persistent `SubscriptionLapseBanner` widget mounted in `AppShell` body, visible whenever `subscriptionStateProvider` reports a write-blocking state
- iOS / Android: app capabilities for push, notification service extension for rich notifications

### Demoable state

New user signs up, gets a Postmark email with their code. Tries the app for a few days, gets push notifications honouring quiet hours. Lifecycle event syncs to GoHighLevel. Trial countdown tracked silently. At day 50, soft W-19 reminder. At day 60 with no card, blocking W-19. User adds card via Paddle, subscribed. Cancels in app, retains access until period end. After period end, banner appears + composer disabled + writes blocked but the app stays usable. User taps banner, resubscribes, banner vanishes, writes resume — all live.

### Open decisions during phase

- v1 pricing (PRD §25.2 says "set near launch"; we need a number for the demo even if it changes)
- Paddle checkout in-app web view vs Apple/Google IAP wrapped — Apple's 30% vs Paddle's lower fee + the IAP-mandated rules for digital goods
- OneSignal app IDs per environment (dev / prod)

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
- **Locale-elastic layouts** — every control with text (button, chip, list tile, header, tab label, snackbar) must tolerate string-length variance from day one. Concrete rules: (1) no fixed-width buttons that fit only the English label, (2) headers + titles must wrap or auto-shrink rather than truncate, (3) bottom nav labels need room for ~1.5× the English length (German, French) and conversely cope with very short ideographic labels (Japanese, Chinese), (4) form-field labels never sit *inside* the field if they could overflow — float labels above. We're shipping en-AU only in v1, but every UI decision should be reviewable later under a German + Japanese smoke test. Full roadmap in `memory/reference_locales.md`.

### Audit + observability
- **External call audit** — every outbound call to a paid or measurable third party (LLM via OpenRouter, embedding generation, Postmark email, OneSignal push, R2 storage, anything else we add) writes an `external_call` row synchronously after the call returns. Lets us slice spend by user / agent / persona / cohort / time period without retroactive plumbing. Schema lands in Phase A so the helpers exist before any real call fires — every integration is a one-liner wrap (`recordedCall(ctx, {kind, provider, ...}, async () => …)`). Never log full prompts or response bodies (those live in `messages` for LLM, or are unsensitive for service calls). Schema + rules in `memory/reference_external_call_audit.md`.

### Reactivity + gating states
- **Live-global reactivity** — Convex's reactive queries pair with Riverpod stream providers to give the app push-based, always-current globals. Every state the UI must react to instantly — `system_config`, `currentUser` (lifecycle stage, subscription tier, profile slots, current coach), the active thread, unread counts — is exposed as a Riverpod provider backed by a Convex live query. The router itself watches these. Discipline: never `read` a global where you should `watch` it. Schema for the globals + the discipline rules in `memory/reference_live_globals.md`.

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
- **Video coach moments** (v2 Premium; **HeyGen** is the working assumption now, not Tavus — chosen so the same avatar pipeline supports rendered moments today and live streaming avatars in a future tier; PRD §13.3 to be updated)
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
| **0** | Shell, theme, fake auth | done | What we have |
| **A** | Real auth + Convex spine + safety gates + onboarding | medium-large | Sign up for real, pick coach, kill-switch & update-required gates work live |
| **B** | Activities + cities + Health plugin | medium | Activities flow in, city pickable |
| **C** | Memory + agent (Margaret comes alive) | large | Coach is real, remembers you, every turn cost-audited |
| **D** | Widget catalogue + settings expansion | medium-large | Full v1 UI surface, widgets respect simulated read-only state |
| **E** | OneSignal + Postmark + GHL + Paddle + R2 + lapse-as-banner | large | Production plumbing; subscription lapse cleanly blocks writes via banner |
| **F** | Themes + a11y + i18n + flags | medium | Polish + dark mode + flag system |
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
- `Twikka_v1_prd.md` — the full v1–v4 PRD (source of truth)
- `memory/reference_external_call_audit.md` — `external_call` schema + helper pattern
- `memory/reference_system_config.md` — `system_config` singleton schema + read/write pattern
- `memory/reference_live_globals.md` — Convex+Riverpod live-globals discipline + provider list
- `memory/reference_locales.md` — locale roadmap + locale-elastic layout rules
- `memory/reference_coach_character_system.md` — index to `docs/twikka_coach_personas.md` + `docs/twikka_coach_image_prompts.md`, plus AI disclosure rules, avatar strategy across phases, v3 affiliate cross-sell W-22
