# Twikka v1 PRD and Technical Specification

**Product**: Twikka mobile application (and companion surfaces)
**Owner**: Novansa OÜ
**Status**: Build specification — complete UI, staged deployment
**Document version**: 1.0, April 2026

---

## Preface

This document specifies the complete Twikka product across its planned evolution (v1 through v4), as a single coherent UI and data model. The build strategy is **"build all, deploy staged"**: the full UI is implemented up front so UX can be validated end-to-end, with later-version features concealed behind feature flags until their release. This lets design and architecture decisions that affect multiple versions be made once, correctly, rather than discovered during later phases.

The current scope for the first public release is v1. Features flagged for v2, v3, or v4 are spec'd in the same detail so the code paths, data models, and UI surfaces are in place from the start.

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Vision, principles, non-negotiables](#2-vision-principles-non-negotiables)
3. [User segments and personas](#3-user-segments-and-personas)
4. [Product roadmap and version gating](#4-product-roadmap-and-version-gating)
5. [Information architecture](#5-information-architecture)
6. [Widget catalogue](#6-widget-catalogue)
7. [Onboarding and account lifecycle](#7-onboarding-and-account-lifecycle)
8. [The coach system](#8-the-coach-system)
9. [Device health integration](#9-device-health-integration)
10. [Social layer](#10-social-layer)
11. [Affiliate channel](#11-affiliate-channel)
12. [Enterprise channel](#12-enterprise-channel)
13. [Premium features](#13-premium-features)
14. [Gamification approach](#14-gamification-approach)
15. [Notifications and lifecycle communications](#15-notifications-and-lifecycle-communications)
16. [Data model](#16-data-model)
17. [Authentication and identity](#17-authentication-and-identity)
18. [Subscription and billing](#18-subscription-and-billing)
19. [Email](#19-email)
20. [Theming, accessibility, internationalisation](#20-theming-accessibility-internationalisation)
21. [Performance, offline, error handling](#21-performance-offline-error-handling)
22. [Privacy, security, compliance](#22-privacy-security-compliance)
23. [Feature flags and progressive reveal](#23-feature-flags-and-progressive-reveal)
24. [Fake data appendix](#24-fake-data-appendix)
25. [Out of scope and open questions](#25-out-of-scope-and-open-questions)

---

## 1. Executive summary

Twikka is a behavioural support product for adults who want to become reliably physically active after prior failed attempts. At its heart is an adaptive AI coach that meets users where they are, captures most activity automatically from device health data, and builds warm accountability through optional social and practitioner relationships. The product's job is to help users build enough consistency and self-belief to no longer need it.

The target user is older (40s through 70s), scam-aware, low in tech confidence, and carries real failure history around exercise. They are not served by the existing fitness app category, which is designed for already-active people who want to optimise performance. Twikka's positioning is explicit: "backed by science, not shame. Designed for people, not athletes."

Key design commitments:

- **Chat-first**: the primary interface is a conversation with a chosen AI coach. Dashboards are secondary.
- **Never-lost progress**: no streaks, no reset counters, no shame mechanics.
- **Consent-first social and practitioner sharing**: three distinct privacy models (individual, affiliate-shared, enterprise-aggregated), each enforced at the database layer.
- **Paid only, with a long free trial**: no ads, no bots, no data brokers.
- **Build complete UI, stage deployment**: the full product is built from the start, with later features feature-flagged until their release wave.

The stack: Flutter (mobile), Convex (reactive backend, agent orchestration, multi-tenancy), Clerk (auth), Cloudflare R2 (object storage), OneSignal (push), Postmark (transactional email), GoHighLevel (marketing lifecycle), Paddle (subscription billing).

---

## 2. Vision, principles, non-negotiables

### 2.1 Vision

Twikka is the product that helps sedentary adults rebuild belief in their own capacity to move. It does this by providing a patient, knowledgeable, non-judgemental AI coach who knows them, remembers them, supports them through lapses without drama, and — critically — accepts that the user's job is to live their life, not to perform for an app.

### 2.2 Principles

These principles are the constitution of the product. Every design decision should be checked against them. If a proposed feature or pattern conflicts with a principle, the feature is wrong, not the principle.

**Support without noise.** The product must feel available, warm, personalised, periodic, and rewarding — but never overwhelming. Notifications ask, they do not tell. Suggestions are offered, not imposed. Nothing nags.

**Showing up beats optimising.** Any movement above zero is a victory. Consistency compounds. The biggest health benefits happen well before the textbook thresholds. This belief shapes copy, UI, badges, goals, notifications, and social features.

**The user is always right to rest.** Rest days are a first-class object, not the absence of effort. A declined suggestion is a neutral event. A week away is not a failure.

**Memory, not measurement.** The app's data model is confidence, participation, consistency, small wins, and shared context — not sets, reps, or minutes.

**Hidden complexity.** The product may be sophisticated inside. The user must experience it as simple.

**Australian English, warm and human.** All copy in the product is in warm, plain Australian English. No motivational-speaker voice. No clinical voice. Think of a supportive GP you've known for years.

**Trust through paid, ad-free design.** Twikka is paid. This keeps advertisers out, keeps bots out of the social layer, funds quality, and changes the relationship with the user.

### 2.3 Non-negotiables

Things that will never appear in Twikka:

- Streaks that reset on a missed day
- Leaderboards against strangers, at any tier
- Shame-based reinforcement (guilt trips, "you missed X", red warning states)
- Red/green dichotomies for activity days
- Goal-completion percentages or "rings to close"
- Performance comparisons with other users that are not explicitly and mutually opted into
- Persistent UI elements that tell the user they are behind or deficient
- Forms at onboarding
- A "log activity" button as a primary action
- Ads, sponsored content, or paid placement
- Dark patterns in trial-to-paid conversion
- Collection of data not required for the product's function

Things that must always be present:

- A way to delete all personal data and close the account, in the app, at any time
- Plain-language explanation of what any third party (affiliate, employer) can and cannot see
- A clear privacy statement at every consent moment, in the language of the user, not the lawyer
- An in-app way to change or cancel the subscription
- Accessibility of core flows at typography sizes up to 150% of baseline

---

## 3. User segments and personas

### 3.1 End user (B2C)

The primary user. Paying individually or via an affiliate/employer (but their experience is the same at the app level).

**Typical profile**

- Age 40s through 70s, with significant representation 55+
- Mixed gender, slightly more female in early adopters
- Moderate to low tech confidence; comfortable with messaging apps, cautious about new apps
- Has tried to become active multiple times; carries emotional weight from past failures
- Often sedentary due to life circumstances (sedentary job, caring responsibilities, injury history, menopause, weight gain, post-COVID deconditioning)
- Values privacy; scam-aware; suspicious of data-hungry apps
- Socially under-connected, often by circumstance rather than preference

**Three representative personas**

*Margaret, 58.* Former teacher, recently retired. Knees are stiff, mornings are slow. Walked regularly in her 40s, stopped during a difficult decade. Wants to feel steady in her body again. Will not go to a gym. Hates being measured.

*David, 64.* Semi-retired tradesman. GP has told him to move more, specifically for cardiovascular reasons. Has tried MyFitnessPal, found it patronising. Prefers understatement; will be put off by anything that feels like it's trying to motivate him.

*Priya, 43.* Working mother of two. Full-time job, kids in primary school. Knows she should be moving more, has no time, has tried early-morning routines that lasted three days. Wants something that fits her life, not something that demands a new life.

### 3.2 Accountability partner / friend

A user who has been invited into another user's social circle. Still a normal Twikka user in every respect. No different entitlements, just connections.

### 3.3 Affiliate practitioner (v3)

A health practitioner or coach who refers and supports clients through Twikka. Types include physiotherapists, exercise physiologists, podiatrists, dietitians, GPs, practice nurses, personal trainers, and health coaches.

Operates via a **practitioner web application**, not the mobile app. Has their own authentication, their own dashboard, and their own subscription. Never sees client data without client consent.

### 3.4 Enterprise administrator (v4)

A person at an employing organisation (HR director, WHS officer, wellbeing lead) who manages their organisation's Twikka deployment. Operates via a **separate enterprise web application**. Sees only cohort-level aggregated metrics; never sees individual employee data.

### 3.5 Novansa staff (internal)

Internal admin roles for support, content management, and operations. Access is audited, scoped by capability, and never includes the ability to read individual user chat content without explicit user-granted support sessions.

---
## 4. Product roadmap and version gating

Every feature in this document carries a version tag (v1, v2, v3, v4). The implementation strategy is to build all of them during the current engineering phase, shipping v1 only, with later versions behind feature flags. The architectural, data model, and UI implications are solved once, and later releases are primarily a matter of revealing what already exists and tuning it with real usage data.

### 4.1 v1 — the core loop (target: ship first)

The minimum viable Twikka, executed to high standard.

- Flutter mobile app with dramatically updated UI
- Chat-first interface with adaptive AI coach
- Six selectable coaches (male/female × 30s/45s/60s age bands)
- Conversational onboarding: coach selection is the only required step
- Age and gender captured conversationally through widgets early in the first chat
- Apple Health and Google Fit integration for automatic activity capture
- Complete v1 widget catalogue rendered in the chat
- Secondary progress/journal surface
- Settings, account management, data export, account deletion
- Clerk-based signup (name + email + verification code) and login (email magic link)
- Paddle-based subscription with long free trial
- OneSignal for notifications; Postmark for transactional email; GoHighLevel sync for marketing
- Multi-tenant data model, role model, audit logging — all operational from v1 even though only B2C is live

### 4.2 v2 — social and premium

Expanding the product once the core loop is proven.

- Full social layer: DMs, groups, accountability pairs, invites, member profiles, safety surfaces
- Voice coaching as a premium tier feature
- Occasional video moments (Tavus or equivalent) at meaningful milestones
- Richer gamification mechanics drawn from v1 usage patterns
- Tiered pricing introduced (standard vs premium)

### 4.3 v3 — affiliates

Opening the practitioner channel.

- Practitioner web application (separate from the mobile app)
- Affiliate sign-up, onboarding, dashboard, billing
- Client invitation codes and co-branded mobile onboarding
- Three affiliate modes: observer, contributor, participant
- Client-controlled, granular, revocable consent for what the affiliate sees
- AI coach awareness of the affiliate relationship and respect for practitioner constraints
- Commercial: per-active-client monthly fee plus ongoing revenue share; wholesale model for larger practices
- Light white-labelling for top-tier affiliates

### 4.4 v4 — enterprise

Opening the employer channel.

- Enterprise web application for administrators
- Aggregate cohort metrics with minimum-cohort-size enforcement
- HR data correlation capability (absenteeism, injury claims, engagement survey)
- SSO (SAML, OIDC)
- SOC 2 Type II certification
- Enterprise contracts, annual billing, invoicing
- Regional data residency options as commercially required

### 4.5 Build-all-deploy-staged

Every feature below the v1 line is implemented in code during the current engineering phase. Feature flags gate exposure. This means:

- The affiliate web app exists as a build target from day one, even if only Novansa staff can access it
- The enterprise web app exists as a build target from day one
- All social widgets are implemented, even if only DM-to-accountability-partner is exposed in v1
- Voice coaching scaffolding is in place, even if only text is publicly available
- The data model supports every relationship type from day one

This approach front-loads design and architecture work but produces three large benefits: (1) decisions that span versions are made with full context, (2) later releases require flag flips rather than new development, and (3) the UX of the complete product can be validated now rather than discovered later.

---

## 5. Information architecture

### 5.1 Top-level structure (mobile)

The mobile app is structured around four primary surfaces. Navigation pattern depends on device size:

- **Phone**: bottom nav, four items
- **Tablet and larger**: persistent side nav with the same items
- **Folding/adaptive**: side nav when unfolded, bottom nav when folded

Primary surfaces:

| Surface | v1 | v2+ | Description |
|---|---|---|---|
| **Coach** | ✓ | ✓ | The chat with the AI coach. The app's centre. |
| **Messages** | partial | ✓ | Tabbed inbox. Coach tab + People tab. In v1, only the People tab's minimal scope (accountability partner DM) is exposed. |
| **Journal** | ✓ | ✓ | Secondary progress/reflection surface. Warm, never-lost framing. |
| **Settings** | ✓ | ✓ | Account, subscription, integrations, theme, privacy, help. |

The Coach surface is always the default landing. A user opening the app with an unread coach message lands in the coach chat with the message visible.

### 5.2 Coach surface

A single persistent chat with the chosen coach.

**Anatomy (top to bottom):**
- Header: coach avatar (small), coach name, quiet status line ("Usually replies in the morning" or "Here whenever you are")
- Optional "three weeks since we last chatted" type breadcrumb when returning from a gap
- Scrollable message area
- Message composer at the bottom ("Write to your coach…")

**Widget rendering:** messages and widgets appear inline as a unified stream. See §6 for the full catalogue.

**Message entry:** text, with a planned v2 extension to voice input.

### 5.3 Messages surface

Tabbed inbox. Two tabs in v2+: **Coach** and **People**. Both appear in v1 but Coach tab redirects to the Coach surface (since that's the canonical home), and the People tab is either hidden or shows only accountability-partner conversations.

**Anatomy:**
- Tab selector (Coach | People [count])
- Optional invites strip (collapsible; dismissed invites hide until new activity)
- Conversation list: name, last message snippet, timestamp, unread count
- Floating "new message" action (compose button)

**Conversation list item states:**
- Normal
- Unread (subtle dot or count)
- Invite pending (special treatment — see §10)
- Muted (subdued)

### 5.4 Journal surface

A single scrollable page. Not interactive in v1 beyond expanding/collapsing sections.

**Anatomy (top to bottom):**
- Header: "Your Journal — How it's going"
- Hero number: "You've been active on X days since you started with Twikka" with clarifying text ("This number only goes up. Quiet days don't take anything away.")
- Rolling pace chart: last 90 days, soft area visualisation, no red/green
- Milestone cards: days active, activities tried, most consistent month
- "What you've tried" activity breakdown with counts
- Longer-term view toggle (year to date, since start)

No goals, no targets, no percentages, no calories, no streaks.

### 5.5 Settings surface

Standard settings tree.

**Top-level sections:**
- Account (name, email, subscription, delete account)
- Coach (change coach, notification preferences for coach messages)
- Health (Apple Health / Google Fit connection, what data is read)
- Notifications (push, email, frequency, quiet hours)
- Privacy (what's shared with whom, data export, data deletion, consent history)
- Theme (theme picker, light/dark/system, text size)
- Help (FAQ, contact support, about Twikka)
- Debug (only visible in debug builds)

### 5.6 Cross-cutting screens

Screens accessible from multiple surfaces.

- **Coach profile / change coach flow**: from Settings or from a "…" menu on the coach chat
- **Invite review (takeover)**: from Messages when tapping a pending invite
- **Member profile**: from Messages, from a group, from a shared reference
- **Group info**: from inside a group chat via the header
- **Media viewer**: from any chat when tapping an image
- **Subscription management**: from Settings → Account

### 5.7 Onboarding flow

A minimal linear flow. See §7 for detail.

1. Welcome screen
2. Signup form (name, email)
3. Email verification (6-digit code)
4. Coach selection
5. Land in Coach chat, where the selected coach introduces themselves

No questions about goals, habits, activity history, preferences, or intentions. Those emerge through conversation.

### 5.8 Practitioner web app (v3)

A separate web application accessed at a distinct domain (e.g. `practitioner.twikka.com`). Not the mobile app.

**Primary surfaces:**
- Dashboard (list of active clients, flags, upcoming appointments)
- Client detail (progress view, coach conversation summaries if consented, notes)
- Constraint management (practitioner inputs that constrain the AI coach)
- Invite codes and onboarding links
- Billing and subscription
- Settings (practice info, co-branding, team members)

Responsive web design, not a separate mobile app.

### 5.9 Enterprise web app (v4)

A separate web application, separate domain (e.g. `admin.twikka.com` or `enterprise.twikka.com`).

**Primary surfaces:**
- Cohort overview (participation, aggregate trends)
- Metrics detail (trend analysis, segment comparison, all with minimum-cohort enforcement)
- HR data integration (optional; requires data upload or API connection)
- User management (invitations, deprovisioning, SSO configuration)
- Billing and contracts
- Settings (organisation info, minimum cohort size if configurable, data sharing preferences)
- Compliance (SOC 2 evidence, DPA, subprocessor list)

---
## 6. Widget catalogue

Widgets are the atomic units of the Twikka chat experience. Every entry in the conversation timeline is a widget, from a plain coach message to an interactive suggestion card. This section defines every widget in the product across all four versions.

### 6.1 Design principles for widgets

- **One-pattern rule**: offer-style cards (suggestion, check-in, plan, group, accountability) share a single visual shape so users learn it once.
- **Self-contained**: each widget renders from its props; state changes come through callbacks.
- **Interaction feedback as conversation**: when a user interacts with a widget, the result can become a conversation turn that the coach sees on its next response.
- **Lifecycle-aware**: widgets have states (live, responded, expired, read-only). The visual treatment reflects the state.
- **Composable with reactivity**: widgets that reflect live data subscribe to Convex queries and update without full-message replacement.

### 6.2 Widget schema

Every widget has a shared envelope:

```
Widget {
  id: string                  // unique within conversation
  type: WidgetType            // see catalogue below
  author: "coach" | "user" | "system" | "practitioner" | "partner"
  authorRef: UserId | null    // when author is practitioner or partner
  createdAt: timestamp
  payload: object             // type-specific shape
  state: WidgetState          // see below
  version: int                // for schema evolution
}
```

Widget states:

- `live` — the widget is interactive
- `responded` — the user has acted on it; it becomes read-only with the response shown
- `dismissed` — the user declined or ignored; it stays in the thread, visibly quieter
- `expired` — the offer is past its window; read-only, subdued
- `superseded` — a later widget has replaced it (e.g. plan revised); keeps history

### 6.3 The v1 widget catalogue

Each widget below is numbered for reference. All are implemented in v1 unless otherwise noted.

---

**W-01 · Chat message (coach)**

Standard conversational reply from the AI coach. Warm, brief, Australian English.

- Visual: soft cream bubble, one pinched corner (reads as speech), aligned left with coach's small avatar.
- Payload: `{ text: string, hasMarkdown: bool }`
- Interactions: long-press for copy/share/report.
- Notes: supports minimal markdown (bold, italics, line breaks). No links rendered as buttons; URL auto-linking only.

---

**W-02 · Chat message (user)**

User's own typed message.

- Visual: muted accent tint bubble, aligned right. No avatar.
- Payload: `{ text: string }`
- Interactions: long-press for copy/edit/delete. Edit window: 5 minutes after send.
- Notes: no attachments in the coach chat (photos can be shared in member-to-member DMs in v2).

---

**W-03 · System notice**

Factual, non-conversational event marker.

- Visual: centred small text, no bubble, muted grey.
- Payload: `{ text: string, icon?: string }`
- Examples: "Apple Health connected." / "You switched coaches to Maya." / "Three weeks since we last chatted."
- Interactions: none.

---

**W-04 · Activity acknowledgement**

The coach noticed an activity via device data and reflects it back.

- Visual: labelled sub-bubble ("FROM APPLE HEALTH" or "FROM GOOGLE FIT" tag above), then coach message.
- Payload: `{ source: "apple_health" | "google_fit", activity: string, durationMin: number, distanceKm?: number, timeOfDay: string, coachComment: string }`
- Interactions: tap activity detail to see more; can respond conversationally ("it was lovely actually").
- Notes: coach never makes the detail the point; the coach comment is the point.

---

**W-05 · Activity suggestion**

Gentle offer from the coach to try something.

- Visual: offer-style card (shared pattern). Title, one-line description, three actions: Accept, Maybe later, Not today.
- Payload: `{ suggestion: string, activityType: string, durationMin?: number, timeWindow?: string, rationale?: string }`
- Interactions: accept → responded state, coach acknowledges; maybe later → snoozed and resurfaces later; not today → dismissed with zero friction.
- Notes: "Not today" must never have a follow-up question or guilt treatment.

---

**W-06 · Check-in prompt**

Coach asks how the user is or how something went.

- Visual: offer-style card with question prominent, optional quick-reply pills (e.g. Feeling flat / Okay / Good / Great), plus "Write a bit more" option.
- Payload: `{ question: string, responseType: "mood" | "openText" | "scale1to5" | "multiSelect", options?: string[] }`
- Interactions: pill tap → response state; longer reply opens composer pre-filled.
- Notes: only one check-in prompt active at a time in a thread. If user ignores, it quietly expires after a reasonable window and the coach doesn't repeat it mechanically.

---

**W-07 · Trajectory snapshot**

Coach posts a small summary of recent progress.

- Visual: card with warm directional language headline, small soft visualisation (dots for days active, gentle area sparkline, or similar), no numbers that can go down.
- Payload: `{ headline: string, period: string, daysActive: number, trendDirection: "up" | "steady" | "down-but-quiet", subtleVisual: object }`
- Interactions: tap to expand into Journal view.
- Notes: the "down-but-quiet" trend direction uses different copy (reflective, not concerning): "Quieter this month than last. That's alright too."

---

**W-08 · Milestone celebration**

Coach acknowledges a real milestone.

- Visual: a dignified version of the offer-card shape, with a larger number or phrase; no confetti, no trophies.
- Payload: `{ milestone: string, number?: number, unit?: string, context: string }`
- Examples: "You've been active on 30 different days since you started." / "You've tried 6 different activities."
- Interactions: tap to expand with more detail; long-press to save to Journal highlights.
- Notes: the coach's message is what celebrates; the card shows the fact.

---

**W-09 · Educational tile**

Short contextual information, surfaced because relevant.

- Visual: card with headline, 1-2 sentence summary, optional small image, "read more" expansion.
- Payload: `{ title: string, summary: string, bodyMarkdown: string, category: string, imageRef?: string }`
- Interactions: tap to expand inline; can save to a "saved" list in Journal.
- Notes: must feel like part of the conversation, not an ad. The coach's accompanying message provides context ("You asked about walking and knees the other day; this came to mind…").

---

**W-10 · Group or event suggestion**

A relevant real-world group or event.

- Visual: offer-style card. Name, location, brief description, "Tell me more" and "Not interested" actions.
- Payload: `{ groupOrEventId: string, name: string, location: string, description: string, logistics: string }`
- Interactions: expand for details, join/RSVP (if supported), save for later, dismiss.
- Notes: v1 surfaces coach-suggested external groups (walking groups, parkrun). Full v2 includes in-Twikka groups.

---

**W-11 · Accountability prompt**

Offer from the coach to help connect the user with an accountability partner.

- Visual: offer-style card. "Want some company on this?" headline, explanation, actions: "Yes, find someone" / "I'll think about it" / "Not for me".
- Payload: `{ kind: "solo_seeking" | "pair_opportunity" | "group_match", context: string }`
- Interactions: trigger matching flow (v2) or in v1, show "We'll have this working soon; we'll let you know."
- Notes: v1 stub renders but has limited flow. Full implementation in v2.

---

**W-12 · Plan or goal card**

A lightweight negotiated goal or weekly intention.

- Visual: larger card. Title ("This week's intention"), body, editable fields. Actions: Save, Tweak, Dismiss.
- Payload: `{ intention: string, targetPeriod: string, cadence?: string, notes?: string }`
- Interactions: edit via conversational prompt ("make it smaller" produces a new proposal), save to attach to timeline, dismiss with no consequence.
- Notes: plans never fail. A plan that didn't come together quietly expires without comment unless the user raises it.

---

**W-13 · Reflection card**

Coach-authored reflection at natural moments.

- Visual: taller card with a soft top accent, longer prose, optional small visualisation.
- Payload: `{ period: string, headline: string, reflectionMarkdown: string, observations: string[], savedHighlights?: object[] }`
- Interactions: expand/collapse, save to Journal highlights, respond conversationally.
- Notes: surfaces on end of week (gentle), return from a gap, after meaningful milestones. Never automated on a fixed schedule; the coach decides when.

---

**W-14 · Summary card**

Terminal marker of a completed exchange.

- Visual: smaller card, neutral tone, read-only styling.
- Payload: `{ summary: string, relatedWidgets: string[], outcome: string }`
- Interactions: tap to see the related thread highlighted.
- Notes: used rarely. Most exchanges don't need explicit summaries; the chat itself is the record.

---

**W-15 · Age capture widget** (first conversation)

Coach-posted widget to capture age, rendered as a chat card.

- Visual: offer-style card. Question ("Can I ask your age? Helps me tailor what I suggest."), input for year of birth or age, plus "rather not say" option.
- Payload: `{ prompt: string, captureMode: "year_of_birth" | "age_integer", optional: true }`
- Interactions: pill selector for year of birth (recent common decades), or numeric input, or decline.
- Notes: if declined, the coach acknowledges and moves on. Can be asked again later if the user's responses suggest it'd help.

---

**W-16 · Gender capture widget** (first conversation)

Coach-posted widget to capture gender.

- Visual: offer-style card with question and four pill options: Male, Female, Other, Prefer not to say.
- Payload: `{ prompt: string, options: string[] }`
- Interactions: single-select pill.
- Notes: captured early because it shapes language register and content relevance. Never surfaced except to the coach's internal context.

---

**W-17 · Health connection widget**

Prompts the user to connect Apple Health or Google Fit.

- Visual: offer-style card with platform icon, plain-language explanation, and primary action ("Connect Apple Health").
- Payload: `{ platform: "apple_health" | "google_fit", permissionsRequested: string[], rationale: string }`
- Interactions: primary action triggers OS permission sheet. Returns to chat with acknowledgement widget (W-04 precursor) or system notice.
- Notes: plain-language explanation of what Twikka reads and does not read.

---

**W-18 · Notifications permission widget**

Prompts the user to allow push notifications.

- Visual: offer-style card, "So I can check in when you want me to — not when I want to." Primary action, secondary "Maybe later".
- Payload: `{ rationale: string, preferenceOptions: object }`
- Interactions: primary action triggers OS permission sheet.
- Notes: framed explicitly as user-controlled: "You'll tell me when to check in."

---

**W-19 · Subscription prompt** (when trial ends or post-trial)

Gentle, non-blocking reminder near trial end; blocking at trial end.

- Visual: offer-style card for soft reminders; full-screen takeover at the trial-end moment.
- Payload: `{ kind: "soft_reminder" | "trial_end" | "payment_required", daysRemaining?: number, plan: string, price: string }`
- Interactions: open billing flow, remind later (for soft reminders), cancel gracefully.
- Notes: never a dark pattern. Cancellation is always equally prominent as continuation.

---

**W-20 · Data export confirmation**

Confirms an export is ready.

- Visual: system-notice style with a download link.
- Payload: `{ exportId: string, downloadUrl: string, expiresAt: timestamp, summary: string }`
- Interactions: tap to download; open in share sheet.
- Notes: exports include chat, activity data, and profile. Retained by signed URL for a limited period (e.g. 72 hours).

---

**W-21 · Coach handover**

Appears when switching coaches. The outgoing coach says goodbye; the incoming coach introduces themselves.

- Visual: two bubble-pair: farewell, then a system notice "You switched coaches to Maya", then introduction.
- Payload: `{ fromCoachId: string, toCoachId: string, handoverContextSummary: string }`
- Interactions: normal chat continues.
- Notes: handover context is summarised from the neutral agent memory. See §8.

---

### 6.4 Additional widgets (v2+)

**W-30 · Voice message (coach)** [v2]

Coach's voice response as a playable audio bubble.

- Payload: `{ audioRef: string, duration: number, transcriptText: string }`
- Interactions: play/pause, scrub, optional transcript view.
- Notes: full transcript always available for accessibility.

---

**W-31 · Voice message (user)** [v2]

User-sent voice input.

- Payload: `{ audioRef: string, duration: number, transcriptText: string }`
- Interactions: same as W-30.

---

**W-32 · Video moment** [v2]

Short coach video (Tavus or equivalent) for milestone or welcome moments.

- Visual: video player card, portrait aspect.
- Payload: `{ videoRef: string, duration: number, transcriptText: string, context: string }`
- Interactions: play controls, save.
- Notes: used sparingly — onboarding welcome, major milestones, weekly reflections (premium only).

---

**W-33 · Direct message (social)** [v2]

Member-to-member message in a DM thread.

- Visual: cream-on-cream bubble pair, as established in design review.
- Payload: `{ text: string, repliedTo?: string }`

---

**W-34 · Photo attachment** [v2]

Image shared in a DM.

- Visual: rounded image thumbnail inline; tap for media viewer.
- Payload: `{ imageRef: string, caption?: string, width: number, height: number }`
- Interactions: tap to expand, long-press for save/report.
- Notes: R2-backed; signed URLs; server-side thumbnail generation.

---

**W-35 · Shared activity card** [v2]

When a user shares an activity into a DM or group.

- Visual: card showing activity type, distance, duration, simple route or shape illustration.
- Payload: `{ activityId: string, sharedBy: string, caption?: string }`
- Interactions: tap for detail; react; comment inline.

---

**W-36 · Reaction** [v2]

Quick reaction to any message (emoji-like but a fixed small set).

- Visual: small pill attached to the reacted message.
- Payload: `{ messageId: string, reaction: "heart" | "thumbs_up" | "celebrate", userId: string }`
- Notes: fixed vocabulary. No arbitrary emoji. Keeps aesthetic coherent.

---

**W-37 · Typing indicator** [v2]

Shown briefly when another participant is composing.

- Visual: three-dot animation in the style of the coach indicator.
- Notes: reactive via Convex presence.

---

**W-38 · Invite received** [v2]

Incoming connect request, rendered in the Messages surface.

- Three sub-treatments matching mockups: locked thread, takeover sheet, quiet notice.
- Payload: `{ fromUserId: string, introText: string, mutuals: object[], crossedPaths: string }`
- Interactions: Accept / Not now / Block & report.
- Notes: see §10.

---

**W-39 · Invite sent (outgoing waiting)** [v2]

Your outgoing invite in the waiting state.

- Visual: chat with only your intro message and a waiting card. Composer replaced with "Waiting for X to accept" and Cancel.
- Payload: `{ toUserId: string, introText: string, sentAt: timestamp }`

---

**W-40 · Group message (member)** [v2]

Member message in a group thread.

- Visual: standard bubble with sender label.
- Payload: `{ text: string, sender: UserId }`

---

**W-41 · Group message (coach, in group)** [v2]

Coach message inside a coach-facilitated group.

- Visual: bubble with "COACH" ribbon, slightly distinct treatment.
- Payload: `{ text: string }`

---

**W-42 · Group milestone** [v2]

Collective milestone for a coach-facilitated cohort.

- Visual: card posted by the coach.
- Payload: `{ groupId: string, milestone: string, context: string }`

---

**W-43 · Practitioner message** [v3]

A message from the user's affiliate practitioner, appearing in the coach chat, clearly distinguished as practitioner-authored.

- Visual: distinct treatment with practitioner's name and practice badge; coloured edge accent to distinguish from AI coach.
- Payload: `{ text: string, practitionerId: string, practiceName: string }`
- Interactions: reply opens a practitioner-specific sub-thread.

---

**W-44 · Practitioner-set constraint acknowledgement** [v3]

System-notice style confirmation when a practitioner has adjusted what the coach does.

- Visual: system notice.
- Payload: `{ constraint: string, practitionerName: string }`
- Examples: "Sarah (your physio) asked me to skip running suggestions for the next 4 weeks."

---

**W-45 · Appointment reminder** [v3]

Upcoming appointment with the affiliate practitioner.

- Visual: offer-style card.
- Payload: `{ practitionerName: string, appointmentDateTime: timestamp, location: string, notes: string }`

---

**W-46 · Workplace challenge invitation** [v4]

Optional, opt-in challenge within an employer cohort (team-based, no individual scoreboards).

- Visual: offer-style card. "Your workplace is trying this together."
- Payload: `{ challengeId: string, orgId: string, theme: string, period: string, optInCopy: string }`
- Notes: participation is optional and private unless the user opts in.

---

### 6.5 Widget composition rules

- At most one active offer-style widget (suggestion, check-in, plan) in the chat at any time. Older ones auto-expire without nagging.
- System notices can be collapsed ("3 system updates" one-liner) if many accumulate in short succession.
- Widgets referenced by other widgets (e.g. a milestone that mentions an earlier activity) can link visually, but don't require scrolling to understand.
- Widgets should degrade gracefully: an older client that doesn't understand a newer widget type renders a fallback text message with a "your app is out of date" hint.

---
## 7. Onboarding and account lifecycle

### 7.1 Signup

Mandatory fields: **name, email**. That's it. No date of birth, no gender, no goals, no intentions.

**Flow:**

1. User taps "Get started" on the welcome screen.
2. Presented with a form: Name, Email. Copy: "We'll send you a code to confirm your email. No passwords to remember."
3. User submits. A 6-digit code is emailed via Postmark.
4. Code entry screen. Resend available after 30 seconds.
5. On verification, the user lands in coach selection (§7.3).

**Edge cases:**

- Email already registered → "It looks like you've already got an account. Tap here to sign in." (Sends a login magic link to that email.)
- Code expires after 15 minutes → clear re-request flow.
- Rate limiting → after 5 failed code attempts, the user is locked out for 30 minutes; support contact path visible.

### 7.2 Login

Email-only. No passwords, ever.

**Flow:**

1. User taps "Sign in".
2. Enters email.
3. Receives a magic link via email (valid for 15 minutes, single use) and/or a 6-digit code.
4. Taps link or enters code.
5. Lands on the Coach surface.

Clerk handles the identity primitives. Twikka's UI wraps Clerk flows with consistent branding.

### 7.3 Onboarding

One step: **coach selection**. Then into the Coach chat.

**Coach selection screen** (after email verification):

- Header: "Who would you like to hear from?"
- Subcopy: "Pick someone whose voice you'd welcome in your ear. There's no wrong answer."
- Six coach cards, each with:
  - Illustrated portrait
  - Name and short descriptor (e.g. "Patient and reflective. Retired GP, mid-50s.")
  - A sample quote in their voice
- Footer: "You can change coaches any time."

User taps a coach → brief confirmation → lands in Coach chat with an introductory message from the chosen coach.

No other onboarding questions. No goals. No activity baseline. No preferences. The chat does the rest, on the user's timetable.

### 7.4 First conversation structure

The coach's first-conversation behaviour follows a pattern, though the wording is persona-specific.

**Turn 1 (immediately on landing):** warm introduction, explicit no-pressure framing, an open question about how the user is today.

Example (Margaret): *"Hey. I'm Margaret. Really glad you're here. No agenda today — just want to say hi. How are you, generally?"*

**Turn 2-3 (user responds):** the coach responds conversationally. Does not launch into questions.

**Turn 4+ (opportunistic capture):** when the moment is right, the coach asks about age (W-15) and, separately, gender (W-16). Never both in the same message. Both can be declined.

**First few days:** the coach offers the health-connection prompt (W-17) and the notification prompt (W-18) at appropriate moments — not in the first two minutes, but within the first few sessions.

**Throughout the first week or two:** the coach gradually builds context by asking or by reflecting on what the user has shared. No survey. The user's profile emerges organically.

### 7.5 Account lifecycle states

| State | Meaning | Available actions |
|---|---|---|
| `active_trial` | In free trial, subscription not yet charged | Full app access |
| `active_paying` | Paid subscription in good standing | Full app access |
| `payment_failed` | Billing failed, in grace period | Full access + gentle reminder |
| `cancelled_trial` | User cancelled during trial | Full access until trial end, then limited |
| `cancelled_paying` | User cancelled; access until period end | Full access until period end |
| `lapsed` | Subscription ended, not renewed | Read-only access for 30 days (can see past chat, journal); no new coach interactions |
| `dormant` | Lapsed more than 30 days | Account preserved, login still works; resubscribe to reactivate |
| `deletion_requested` | User requested account deletion | 30-day soft delete; reversible |
| `deleted` | Fully deleted | Data purged from systems |

### 7.6 Data export and deletion

Accessible from Settings → Privacy.

- **Export**: generates a portable archive (JSON + CSV + HTML of the chat log). Delivered via signed R2 URL in email and as a W-20 widget. Includes: profile, settings, device activity history, chat, journal data.
- **Delete**: soft delete (30 days reversible) followed by hard delete. Copy clearly explains what happens, when, and what's recoverable.

### 7.7 Free trial mechanics

- Default trial: **60 days**. Long enough to experience real consistency before payment.
- No credit card required upfront in v1 — reduces acquisition friction for this audience. Paddle flow kicks in near trial end.
- Trial countdown is not displayed prominently. Users don't need to watch a clock.
- Soft reminder at 14 days before end, at 7 days, at 2 days. Blocking prompt at trial end if no payment method present.
- Users who cancel during trial retain access until the trial naturally ends.

---

## 8. The coach system

The coach is the centre of the product. Its architecture is built around a clear separation: the **agent** (a stable, model-agnostic LLM-driven system that holds the user's memory and orchestrates tool use) and the **persona** (a swappable layer that determines how the agent speaks, sounds, and presents).

### 8.1 Agent architecture

**Core responsibilities:**

- Maintain long-term, structured memory about the user
- Select appropriate tools on each turn (activity capture, widget rendering, information lookup, social facilitation)
- Manage conversation flow within the principles of the product
- Adapt behaviour to the user's current mode (see §8.4)
- Respect constraints from practitioners (v3) and defaults from the user (quiet hours, notification preferences)

**Implementation:**

The agent is built on the Convex Agent component, which handles threading, message persistence, and tool-calling patterns. The LLM provider is abstracted; v1 likely uses Claude Sonnet or a similar model, but the architecture is provider-agnostic. Model selection is evaluated ongoing.

**Memory model:**

Memory is stored in structured form, not as raw conversation history (though conversation history is retained separately). Structured memory fields include:

- `profile`: age (if given), gender (if given), location (if volunteered), family context (if mentioned)
- `activity_context`: what activities the user has tried, baseline capacity, known constraints (injuries, conditions mentioned)
- `emotional_context`: recurring themes, sensitive topics to avoid, things the user responds well to
- `preferences`: time of day preferences, notification preferences, coach style preferences
- `relationships`: mentioned partners, family members, friends, pets (for natural reference)
- `milestones`: significant moments, breakthroughs, setbacks, returns after lapses
- `constraints`: practitioner-set constraints (v3), user-set constraints ("don't suggest running")

Memory is written in third-person factual form so it remains neutral across persona switches:
- ✓ "User mentioned knee stiffness in mornings (Week 2)."
- ✗ "I talked to her about her knee stiffness."

### 8.2 Persona layer

A persona is a set of attributes that shape how the agent expresses itself in a given user's chat.

**Persona attributes:**

- `name`
- `visualRef` (illustrated portrait)
- `ageBand`: "30s" | "45s" | "60s"
- `genderPresentation`: "male" | "female"
- `voiceSample` (v2)
- `voiceRef` (v2, TTS voice identifier)
- `backstory`: one-paragraph fictional background for internal use (informs tone but not surfaced)
- `styleDescriptors`: array of personality descriptors ("patient", "reflective", "dry-humoured", "gentle", "unhurried")
- `introSample`: the quote shown on the selection screen
- `promptStyleNotes`: coach-specific style guidance injected into the system prompt

### 8.3 The six v1 coaches

Launch set:

| ID | Name | Age band | Gender | Style |
|---|---|---|---|---|
| `coach_margaret` | Margaret | 60s | Female | Patient and reflective. Retired GP. |
| `coach_dave` | Dave | 60s | Male | Dry-humoured and steady. Former tradesman. |
| `coach_priya` | Priya | 30s | Female | Gentle and curious. Yoga teacher. |
| `coach_tom` | Tom | 60s | Male | Quiet and unhurried. Retired. |
| `coach_ben` | Ben | 30s | Male | Warm and practical. Personal trainer turned health coach. |
| `coach_fiona` | Fiona | 45s | Female | Kind and direct. GP. |

(Names, ages, and styles are provisional and can be tuned during content development. The matrix of 6 = 2 genders × 3 age bands is the commitment.)

Each coach ships with:

- Illustrated portrait (custom illustration, consistent style across all six)
- Voice sample (v2) — distinct Australian voices
- A set of sample lines in their voice, used in testing and in onboarding
- A prompt style guide that shapes the agent's language when this persona is active

### 8.4 Adaptive coach mode

The coach's behaviour adapts to the user's current state, inferred from recent activity, engagement patterns, and conversational signals. Three modes:

**Recovery mode**: early days with a new user, or after a lapse of 7+ days. Low pressure, warm, proactive but gentle. Proactive messages are rare and simple ("Hey, just saying hi"). Never asks for commitments the user hasn't offered. Never references missed activity.

**Momentum mode**: user is engaging consistently, trajectory is positive. More engaged, can suggest stretches, can celebrate more visibly, can introduce social features (W-11), can gently propose small progressions.

**Flow mode**: user is clearly self-directed, engaged daily or near-daily without coach prompting. Coach becomes more responsive, less proactive. Steps back. Shorter messages. More silence.

**Mode transitions:**

Inferred from signals, not user-selected. Signals:

- Days since last session
- Days with any captured activity in the last 7/14/28 days
- Conversation engagement (length, tone, responsiveness)
- Widget response rates
- Recent life events mentioned (illness, travel, difficult times)

Mode changes should be invisible to the user. The coach's behaviour shifts; no "you're now in Recovery mode" notification.

**Escalation and de-escalation:**

- Recovery → Momentum: only after sustained positive engagement (at least 10+ days in the mode, recent activity, responsive conversation).
- Momentum → Flow: after ~30 days of user-driven engagement.
- Any mode → Recovery: triggered immediately by signals of struggle (disengagement, negative emotional content, gap).

Mode is stored in the user's profile and visible to the agent on every turn.

### 8.5 Coach switching

Accessible at any time from Settings.

**Flow:**

1. Settings → Coach → Change coach.
2. User sees the same coach selection screen as onboarding, with the current coach highlighted.
3. User selects new coach.
4. Confirmation: "You'll meet [new name] in a moment. [current name] will hand over what you've shared. You can switch back whenever you like."
5. Back to Coach chat.
6. **Current coach farewell message** appears (from the outgoing persona): brief, warm, natural.
7. **System notice**: "You switched coaches to [new name]."
8. **New coach introduction**: acknowledges they've inherited context without making the user re-explain anything.

**What carries over:** all structured memory. The new persona reads the same memory store. Tone and framing differ.

**What doesn't:** the raw conversation history from previous coaches is retained for export/review but the new coach doesn't quote it. They speak fresh.

### 8.6 Coach persona evolution over time

Within a single coach, the tone can deepen gradually with familiarity. After ~30 days of engagement, the coach's prompts subtly shift to reference shared history more naturally ("You mentioned last month that…"). After a long gap, the coach's tone resets slightly to something more formal to match the social cooling.

This is implemented through prompt parameters that depend on relationship duration and recent engagement — not through separate coach variants.

### 8.7 Tool access

The coach has access to a set of tools it can invoke on each turn. The tool schema drives widget rendering.

**v1 tools:**

- `render_activity_acknowledgement` — shows W-04
- `render_suggestion` — shows W-05
- `render_check_in` — shows W-06
- `render_trajectory_snapshot` — shows W-07
- `render_milestone` — shows W-08
- `render_educational_tile` — shows W-09
- `render_group_suggestion` — shows W-10
- `render_accountability_prompt` — shows W-11
- `render_plan` — shows W-12
- `render_reflection` — shows W-13
- `render_summary` — shows W-14
- `request_age` — shows W-15
- `request_gender` — shows W-16
- `request_health_connection` — shows W-17
- `request_notifications_permission` — shows W-18
- `get_recent_activity` — reads device-sourced activity
- `get_user_profile` — reads structured memory
- `write_user_memory` — updates structured memory
- `search_content_library` — finds educational content
- `schedule_proactive_checkin` — arranges a future check-in
- `flag_for_human_review` — rare, for safety escalation

**v2+ tools:**

- `suggest_accountability_partner` — matches users (W-11 follow-up)
- `send_voice_response` — returns audio (W-30)
- `render_video_moment` — Tavus video (W-32)
- `respect_practitioner_constraint` (v3) — reads constraints set by affiliate

### 8.8 Safety and escalation

The coach is not a crisis service. Safety behaviour:

- If a user expresses suicidal ideation, self-harm intention, or acute mental health crisis: the coach responds with warmth and concern, provides crisis resources (Lifeline 13 11 14 for Australian users; equivalents for other regions), does not attempt to provide therapy, and flags for human review.
- If a user describes an acute medical symptom (chest pain, severe injury, signs of stroke): the coach strongly encourages contacting emergency services or a medical practitioner, and logs a flag.
- If a user describes signs of disordered eating or exercise obsession: the coach does not enable, carefully redirects, and flags for human review.
- Escalation flags go to a Novansa-internal review queue, not to an external service. A human reviews within a committed SLA (target: 24 hours, immediate for acute flags).

The coach also has guardrails:

- Will not provide specific medical advice
- Will not recommend specific supplements, medications, or treatments
- Will not give clinical diagnoses
- Will not provide dietary prescriptions beyond general healthy-eating framing
- Will not engage in debates about contested health topics (vaccines, fad diets, ideology)

When asked things outside its scope, the coach suggests a human practitioner and offers practical context.

---

## 9. Device health integration

### 9.1 Supported platforms

**v1:**
- Apple Health (iOS) via HealthKit
- Google Fit / Health Connect (Android)

**v2+:**
- Potential integrations with Garmin Connect, Fitbit, Samsung Health for users whose data lives there. Decided based on request volume.

### 9.2 Canonical activity taxonomy

Twikka's internal taxonomy is small, opinionated, and behavioural rather than athletic.

**v1 canonical activities:**

| ID | Label | Notes |
|---|---|---|
| `walk` | Walk | Includes leisurely, brisk, and treadmill |
| `hike` | Hike | Outdoor walking on trails |
| `run` | Run | Any running or jogging |
| `cycle` | Cycle | Outdoor or indoor bike |
| `swim` | Swim | Pool or open water |
| `strength` | Strength training | Weights, resistance |
| `yoga` | Yoga | Includes stretching, pilates |
| `dance` | Dance | Any dance activity |
| `garden` | Gardening | Counted as activity |
| `household` | Active housework | Vigorous cleaning, DIY |
| `sport` | Sport | Racquet sports, team sports |
| `water` | Water sports | Paddling, surfing, kayaking |
| `other` | Other activity | Fallback category |

The taxonomy explicitly includes gardening and housework because, for the target user, these are meaningful. Most fitness apps exclude them. Twikka validates them.

### 9.3 Mapping tables

Each platform's activity enum is mapped to the Twikka taxonomy.

**Apple Health (HKWorkoutActivityType):**

- `.walking` → `walk`
- `.hiking` → `hike`
- `.running` → `run`
- `.cycling` → `cycle`
- `.swimming` → `swim`
- `.traditionalStrengthTraining`, `.functionalStrengthTraining` → `strength`
- `.yoga`, `.pilates`, `.flexibility` → `yoga`
- `.dance`, `.socialDance` → `dance`
- (Many more mapped; full table in appendix)
- Unknown types → `other` with a note for the coach to ask

**Google Fit / Health Connect:**

- Similar mapping table.
- "Walking" → `walk`, "Aerobics" → `other` (coach asks), etc.

When the platform returns `other`, the coach may follow up conversationally: "You did something active for 25 minutes around 3pm. What were you up to?"

### 9.4 Data captured per activity

From the platforms:
- Activity type (mapped)
- Start time, end time
- Duration (minutes)
- Distance (km) if applicable
- Energy burned (if available; not surfaced prominently)
- Source device / app name

**Not captured:**
- Heart rate detail (available if needed for context, never surfaced)
- GPS traces (not needed for the product)
- Step counts as a primary metric (available; used only as a supplementary signal)
- Weight, BMI, blood pressure
- Menstrual cycle, reproductive health, nutrition data

### 9.5 Sync strategy

- **On app open**: reconcile last 7 days of platform data.
- **Background fetch**: once per day where supported (iOS background app refresh, Android WorkManager).
- **Explicit refresh**: pull-to-refresh on Journal surface.
- **On permission grant**: initial pull of last 30 days.

Sync is idempotent. Duplicate writes are avoided by platform activity ID.

### 9.6 Privacy

- User explicitly grants per-data-type permission via the OS.
- Twikka only requests the minimum necessary permissions.
- Permission can be revoked at any time; the app degrades gracefully.
- Health data is stored only in Twikka's backend database (Convex), never exported to third parties without explicit user action.

### 9.7 Handling gaps and user-entered activity

If the platform shows no activity for a period but the user mentions they did something, the coach can capture it via conversation. A lightweight `manual_log` flow is available but is explicitly **not** presented as a primary path. The coach logs it on behalf of the user from their description.

---
## 10. Social layer

The social layer is built in full for v1 (all screens present in code), but only a narrow slice is exposed in the first release.

### 10.1 v1 exposed scope

- Accountability partner DM (1:1 only, invite-based)
- Coach-facilitated cohort (single group type, pre-curated by Novansa)
- Member profile and safety surfaces
- Invite flows (all three variants)

### 10.2 v2 exposed scope

Everything in the mockups:

- Full DMs between any connected members
- Groups (member-created and coach-facilitated)
- "Nearby at a parkrun" discovery
- Open channels (anyone-can-join curated channels)
- Reactions, photos, voice messages in DMs
- Invite-by-phone-contacts
- Member-created group creation

### 10.3 Social primitives

**Connection**: a mutual relationship between two users. Established through invitation, accepted bilaterally. Carries metadata ("how you know them") that is editable by either party.

**Accountability pair**: a special type of connection that includes opted-in lightweight visibility (e.g. "I was active today" yes/no signals, encouraging reactions).

**Group**: a room with members, a name, and (optionally) a facilitating coach. Types:
- `coach_cohort`: coach-facilitated, time-bound (e.g. "Couch-to-5k — March cohort")
- `peer_group`: member-created, up to N members, no coach
- `open_channel`: anyone-can-join curated by Novansa (e.g. "Rest-day appreciators")

**Invite**: a pending request from one user to another to form a connection or join a group. States: `pending`, `accepted`, `declined`, `blocked`.

### 10.4 Connection lifecycle

1. User A sends invite to User B with an intro message.
2. B receives invite (W-38). B's view of the thread is locked until acceptance.
3. B accepts (→ connection formed, chat opens) or declines (→ invite removed; A sees "declined" on their side only if they check).
4. B blocks & reports → connection prevented, A cannot invite again; A does not know the block occurred (silent block).

### 10.5 Three invite surface variants

Per the design review:

- **Quiet notice** (W-38 variant): inbox strip, default, non-interruptive.
- **Locked thread**: when the user taps the quiet notice or a deep link, the thread opens in locked state — composer replaced with Accept / Not now / Block.
- **Takeover sheet**: for higher-weight or unknown-sender invites, a dedicated screen with full context, mutuals, and the intro message.

Which variant to show is determined by:
- First-time invite from an unknown user → takeover sheet
- Invite from someone with shared context (mutual connection, shared group) → locked thread
- Additional invites while others are pending → quiet notice

### 10.6 Safety surfaces

- **Mute**: silences notifications from a connection without telling them.
- **Block**: prevents further interaction. The blocked user sees no visible difference; their messages simply appear not delivered.
- **Report**: triggers a Novansa-internal safety review with the reported content attached. A lightweight reason-code picker ("spam", "harassment", "inappropriate content", "other") speeds the flow.

Safety actions are always one tap from any conversation surface (via the … menu or the member profile).

### 10.7 Nearby discovery (v2)

Users can opt into "Nearby" for shared activities like parkrun, with coarse geographic proximity matching. Privacy: never shares precise location; only shows users who have also opted in and who share a defined meetup point (e.g. a specific parkrun event).

### 10.8 Coach-facilitated cohorts

Novansa creates and manages cohort groups. Examples:
- "Couch-to-5k — March cohort"
- "Walking together — beginners"
- "Moving more with arthritis"

Each cohort has an assigned coach (one of the six, or a dedicated cohort persona in v2+). The coach posts gently, participants support each other, milestones are collective. The coach's messages in group appear with a quiet "COACH" ribbon.

---

## 11. Affiliate channel (v3)

The affiliate channel opens Twikka to health practitioners and coaches. It consists of:

- A **practitioner web application** (separate from the mobile app)
- A **co-branded mobile experience** for clients invited by an affiliate
- **Three participation modes** for the affiliate
- **Granular consent** controlled entirely by the client

### 11.1 Affiliate roles

| Role | Capabilities |
|---|---|
| `affiliate_owner` | Founder/owner of a practice. Full access, billing, team management. |
| `affiliate_practitioner` | Practitioner user. Sees their own clients. Can set constraints and notes. |
| `affiliate_admin` | Support role (reception, practice manager). Limited data access; can generate invite codes. |

### 11.2 Practitioner web app structure

- **Dashboard**: clients list, alerts, upcoming appointments, recent activity
- **Client detail**: per-client view (scoped by consent)
- **Constraints & notes**: per-client practitioner inputs
- **Invite management**: generate codes, track invited clients, copy share text
- **Team**: add/remove practitioners, manage roles
- **Billing**: subscription, per-client fees, revenue share summary
- **Branding**: practice name, logo, display name for clients
- **Settings**: account, notifications, preferences

Responsive web, not a native mobile app (practitioners typically work at a desk).

### 11.3 Affiliate modes

As established in earlier design work:

- **Observer**: sees dashboards; no app-side interaction.
- **Contributor**: sets constraints and context notes the AI coach respects.
- **Participant**: can send messages that appear in the client's chat, clearly from the practitioner.

Mode is per-practitioner, and can be changed per-client.

### 11.4 Consent model

Client controls, always. At sign-up via an affiliate code, the client is presented with a clear, plain-language consent screen:

> "[Practice name] will be part of your Twikka experience. Here's what you're sharing with them — tap any toggle to adjust. You can change this any time."

Toggles:

- Activity data (default: on)
- Mood check-in responses (default: on)
- Coach conversation summaries (default: off; explicit opt-in)
- Full coach conversation content (not available; only summaries)
- Any specific topics the client wants excluded (free text notes)

The client's view of what the affiliate can see is surfaced in Settings → Privacy at all times, with a live visualisation ("Here's exactly what Sarah at [practice] sees right now").

### 11.5 AI coach awareness

The coach agent is passed the affiliate context on every turn:

- Practitioner name and practice name
- Practitioner mode
- Client-consented data sharing scope
- Active constraints
- Upcoming appointments

The coach uses this to:
- Refer to the practitioner naturally ("your physio Sarah")
- Respect constraints absolutely
- Avoid suggesting anything the practitioner has excluded
- Remind the client about upcoming appointments
- Flag clinical questions back to the practitioner rather than answering them itself

### 11.6 Commercial model

- **Free sign-up** for practitioners.
- **Per-active-client monthly fee** paid by the practice (e.g. $5/month per connected client).
- **Ongoing revenue share** on subscribing clients (~20-30% for the duration of the subscription).
- **Wholesale tier** for larger practices: flat monthly rate that includes N clients with bundle discount.
- **White-label premium** (v3.5): a light white-label variant for bigger affiliates, additional monthly fee.

Paddle handles billing. Rev share paid monthly or quarterly.

### 11.7 Co-branding surface

Affiliate-sourced clients see:

- Affiliate name and logo on the welcome screen
- "In partnership with [Practice]" persistent badge on the coach chat header
- Practice mentioned naturally by the coach
- Branded welcome email in the onboarding sequence
- Option to see the practitioner's contact details (clinic phone, appointment booking link)

Standard Twikka branding remains primary; practitioner branding is secondary but present.

### 11.8 Onboarding an affiliate client

1. Practitioner gives client an invite code or link.
2. Client opens app (or is directed to app store).
3. Sign-up flow with invite code pre-filled.
4. Consent screen (see 11.4) shown before anything else.
5. Coach selection.
6. Land in chat; coach introduces themselves and acknowledges the practitioner partnership.

The client can always switch to un-affiliated mode if they wish — it simply disconnects the affiliate relationship without losing their Twikka data.

---

## 12. Enterprise channel (v4)

The enterprise channel extends Twikka to employer organisations. It consists of:

- An **enterprise web application** for administrators
- A **workspace context** inside the end-user mobile app (the employee experience is otherwise identical)
- Strict **aggregate-only** data exposure to employers
- **SSO, SOC 2, and enterprise contracting**

### 12.1 Enterprise roles

| Role | Capabilities |
|---|---|
| `enterprise_owner` | Organisation super-admin. Billing, contracts, team management, SSO config. |
| `enterprise_admin` | Admin with full dashboard access. |
| `enterprise_viewer` | Read-only dashboard access. |
| `enterprise_billing` | Billing-only access. |

### 12.2 Enterprise web app structure

- **Cohort overview**: headline metrics (participation, trend direction, cohort wellbeing indicator)
- **Metrics detail**: deeper analysis with segment filters (e.g. by location, department — always cohort-sized)
- **HR data integration**: upload or connect absenteeism, injury, engagement data for correlation analysis
- **User management**: invitation flows, deprovisioning, SSO configuration, bulk operations
- **Billing and contracts**: subscription, renewal, DPA, regional data residency
- **Compliance**: SOC 2 evidence portal, subprocessor list, audit log export
- **Settings**: organisation info, branding (if applicable), minimum cohort size configuration (above platform minimum)

### 12.3 Aggregate-only exposure

Every metric shown to an enterprise admin is computed with minimum cohort enforcement:

- Minimum 10 employees in any visible slice (platform default; can be raised per customer)
- Any slice that would reveal an individual is suppressed with "Not enough data to show this slice."
- Small-cohort slices are rolled up to higher levels automatically.

No admin can ever see:
- Individual employee names tied to usage
- Individual activity
- Individual chat content
- Individual wellbeing responses
- Who opted in vs who didn't

### 12.4 Data residency

For EU customers, data stays in EU-resident Convex regions. For AU customers, same. Regional options are part of the enterprise commercial arrangement.

### 12.5 SSO

SAML 2.0 and OIDC supported via Clerk. Standard identity providers (Okta, Azure AD / Entra, Google Workspace) integrated via Clerk's existing support.

### 12.6 Commercial model

- **Per-seat annual licensing** paid by the employer.
- **Minimum seat commitment** (e.g. 50 seats).
- **Tier based on seat count** with volume discounts.
- **Optional professional services** for data integration, onboarding, change management.
- **Multi-year contracts** with discount.

### 12.7 Employee experience under enterprise

Employees sign up via an invite from their employer (email link with SSO) and use the same mobile app. At signup they see a **transparency notice**:

> "[Employer] is funding your Twikka subscription. They will never see your personal activity, your chats, or anything that identifies you. They'll only see aggregated statistics across groups of at least 10 people."

This notice is always accessible from Settings → Privacy. Employees can also leave the workspace and continue using Twikka as a personal subscriber if they prefer.

### 12.8 HR data correlation

Employers can optionally provide HR data (absenteeism, injury claims, engagement surveys) for correlation analysis. This data:

- Is uploaded or API-connected by the employer
- Is never joined to individual Twikka users at the data level — correlations are computed at the cohort level only
- Produces outputs like "Cohort with 40% Twikka participation had 12% lower absenteeism than the non-participating cohort over the same period."

This is the feature that turns Twikka from a wellbeing benefit into a measurable, case-study-producing intervention.

---
## 13. Premium features (v2)

### 13.1 Tier structure

- **Standard**: full text coach experience, all v2 social features, device integration, journal, all non-premium widgets. This is the baseline subscription.
- **Premium**: adds voice coaching (W-30, W-31), occasional video moments (W-32), richer analytics in the Journal, and priority support.

### 13.2 Voice coaching

- User can tap a mic button in the coach composer to speak.
- Coach responds in voice (optionally with text transcript displayed).
- Same persona attributes extended with a voice identifier (distinct Australian voices per persona).
- Implemented via a realtime TTS provider (vendor TBD based on quality at launch time).
- Transcripts always saved; always accessible for accessibility.

### 13.3 Video moments

- Tavus-style avatar video of the selected coach, used sparingly:
  - Onboarding welcome (first time a Premium user meets their coach)
  - Meaningful milestones (e.g. 6-month anniversary)
  - Weekly reflections (premium-only, opt-in)
- Always short (30-60 seconds).
- Always supplemented by text transcript.
- Never attempts photorealism; clearly stylised.

### 13.4 Premium pricing

Pricing to be set near v2 launch. Target a moderate premium over standard (e.g. 1.5-2x standard). Paddle handles tiering.

---

## 14. Gamification approach

Gamification in Twikka is deliberately different from fitness-app norms.

### 14.1 What's in

- **Trajectory language**: "Active on 18 of the last 30 days, up from 4 last month." Directional, forgiving.
- **Never-lost milestones**: total days, total activities tried, months active. Numbers that can slow but not decrease.
- **Celebratory moments in chat**: the coach notices and reflects; no badge cabinet.
- **Opt-in short challenges**: between user and coach (private) or accountability pair (mutually opted in).
- **Activity variety recognition**: "You've tried 6 different activities since you started."
- **Collection mechanics, sparingly**: "You've been active in every season since joining."
- **Seasonal gentle prompts**: "Autumn's a good time for shorter walks if you fancy it." No pressure.

### 14.2 What's banned

- Streaks
- Leaderboards against strangers
- Points or virtual currency
- Badges or trophies as primary rewards
- Completion percentages
- Red days / green days
- "You missed your X" messaging
- Competitive cohort rankings
- Before/after body image framing
- Weight loss targeting
- Calorie balance framing

### 14.3 Team-based gamification (v4, enterprise only)

In enterprise contexts only, team-based collective challenges can exist:

- "Your team moved 12,000 minutes this month." Group-level, no individual breakdowns visible to anyone.
- Opt-in at both employer and user level.
- Never compares to other teams in the same org unless both opt in.

Individual competitive leaderboards remain banned, even in enterprise.

### 14.4 The test

For any proposed gamification element, the test is: imagine a user who has had a difficult week and has skipped everything, opening the app on Sunday evening. Does the element make them feel worse, or does it meet them gently?

If worse: out. No exceptions.

---

## 15. Notifications and lifecycle communications

### 15.1 Philosophy

Notifications in Twikka are **invitations**, not **instructions**. Copy is:

- ✓ "How are you today?"
- ✓ "Good to see you back."
- ✓ "A short message from Margaret, if you've got a minute."
- ✗ "You missed your workout."
- ✗ "Time to log your activity."
- ✗ "You haven't opened the app in 3 days."
- ✗ "Your streak is about to break."

### 15.2 Push notification categories

| Category | Description | Default |
|---|---|---|
| `coach_check_in` | Proactive coach message | On |
| `coach_response` | Response to user-initiated thread | On |
| `partner_activity` | Accountability partner activity / message (v2) | On |
| `group_activity` | Group chat message (v2) | On, mutable |
| `invite_received` | Incoming connect request (v2) | On |
| `subscription_reminder` | Trial ending, payment needed | On |
| `system` | Account, security | On |
| `practitioner_message` (v3) | From affiliate practitioner | On |

All categories individually controllable in Settings → Notifications.

### 15.3 Frequency adaptation

The coach's proactive check-in frequency adapts to user mode:

- **Recovery mode**: rare (every few days to weekly), very gentle tone
- **Momentum mode**: moderate (every 2-3 days), warm and engaged
- **Flow mode**: minimal (weekly or less), responsive rather than proactive

Users can override with their own frequency preferences.

### 15.4 Quiet hours

Default quiet hours: 9pm to 7am local time. No push notifications during this window.

Configurable per-user. Notifications during quiet hours accumulate as a single summary in the morning.

### 15.5 Transactional email (Postmark)

Sent for:

- Email verification code (signup)
- Magic link / login code
- Subscription receipts and changes
- Payment failure notices
- Trial-ending reminders
- Account deletion confirmation
- Data export delivery
- Password-less auth recovery

Branded consistently with the app. Concise. Useful.

### 15.6 Marketing email (GoHighLevel)

Separate from transactional email. Driven by GoHighLevel.

- Welcome sequence (first 2-4 weeks)
- Re-engagement for lapsed users (tastefully)
- Feature announcements (new coaches, new features — rare)
- Product stories and user stories (with permission)

New users are synced to GoHighLevel at signup via an event webhook. Sync carries only the marketing-relevant fields: name, email, lifecycle stage, subscription state. Never chat content, activity data, or health information.

Users can unsubscribe from marketing without affecting transactional email.

---

## 16. Data model

Convex is the primary database. Tables are outlined here conceptually. Actual schema lives in code.

### 16.1 Tenancy model

Every queryable entity is scoped by `organisationId`. B2C users belong to their own single-person organisation by default. B2B users belong to their employer's org. Queries always filter by org at the Convex query layer.

### 16.2 Core tables (v1)

```
organisations
  _id
  name
  kind: "individual" | "affiliate" | "enterprise"
  createdAt
  settings: { minCohortSize?, brandingRef?, ... }

users
  _id
  clerkId              // Clerk identity
  email
  name
  organisationId
  primaryCoachId       // active persona
  createdAt
  lifecycleStage       // from account lifecycle table (§7.5)
  currentMode          // "recovery" | "momentum" | "flow"

memberships
  _id
  userId
  organisationId
  role                 // "member", "admin", "affiliate_practitioner", "enterprise_admin", etc.
  createdAt
  revokedAt?

user_memory
  _id
  userId
  profile: { ageBand?, gender?, ... }
  activityContext: object
  emotionalContext: object
  preferences: object
  relationships: array
  milestones: array
  constraints: array
  updatedAt

threads
  _id
  userId
  threadType           // "coach", "dm", "group", "invite_pending"
  coachId?             // for coach threads
  groupId?             // for group threads
  createdAt

messages                       // includes all widgets
  _id
  threadId
  type                         // WidgetType
  author                       // "coach", "user", "system", "partner", "practitioner"
  authorRef?                   // userId or practitionerId
  payload                      // widget-specific
  state                        // widget state
  createdAt
  editedAt?

activities
  _id
  userId
  source                       // "apple_health", "google_fit", "manual"
  platformActivityId?          // for idempotency
  canonicalType                // from taxonomy
  startTime
  endTime
  durationMin
  distanceKm?
  rawData                      // original platform record
  capturedAt

device_connections
  _id
  userId
  platform                     // "apple_health", "google_fit"
  connectedAt
  lastSyncAt
  permissions                  // granted data types

subscriptions
  _id
  userId
  organisationId
  paddleSubscriptionId
  tier                         // "standard", "premium"
  status
  trialEndsAt?
  currentPeriodEnd
  cancelledAt?

audit_log
  _id
  actorUserId
  action
  entityType
  entityId
  at
  detail
```

### 16.3 Social tables (v2)

```
connections
  _id
  aUserId
  bUserId
  status                       // "pending", "active", "blocked"
  establishedAt
  relationshipContext          // "how you know them"

groups
  _id
  organisationId
  name
  groupType                    // "coach_cohort", "peer_group", "open_channel"
  coachId?
  createdAt
  memberIds

invites
  _id
  fromUserId
  toUserId
  kind                         // "connect", "group_invite"
  groupId?
  introText
  state
  createdAt
  resolvedAt?
```

### 16.4 Affiliate tables (v3)

```
practitioners
  _id
  userId                       // linked Twikka user record for the practitioner
  organisationId               // the affiliate org
  mode                         // "observer", "contributor", "participant"

client_affiliations
  _id
  clientUserId
  practitionerId
  consentedSharingScope        // { activity, mood, summaries, constraints }
  constraints                  // practitioner-set context
  establishedAt
  revokedAt?
```

### 16.5 Enterprise tables (v4)

```
enterprise_integrations
  _id
  organisationId
  provider                     // "absence", "injury", "engagement_survey"
  dataRef                      // R2 upload or API connection
  uploadedAt
  cohortSummaries              // computed aggregates, never per-user

enterprise_cohorts
  _id
  organisationId
  name
  filterRules                  // e.g. by department, location — always size-checked
  minSize                      // defaults to org default
```

### 16.6 Query-layer access control

Every Convex query that touches user data enforces:

1. Authentication via Clerk (the caller has a valid session).
2. Authorisation: the caller's `userId` has a membership in the target `organisationId`.
3. Role: the caller's role permits the operation.
4. Additional scoping: e.g. affiliate queries further filtered by `client_affiliations` where consent is active; enterprise queries constrained by `minSize`.

No UI-only access control. UI-level checks are cosmetic; data layer is the gate.

### 16.7 Audit logging

Every write to sensitive data (profile changes, consent changes, practitioner actions on client records, admin actions in enterprise) writes to `audit_log` with actor, action, entity, timestamp, and detail.

Audit log is read-only to admins, queryable for support but not deletable by users (retained per policy).

---
## 17. Authentication and identity

Clerk is the identity provider across Novansa's product portfolio and handles Twikka's authentication.

### 17.1 Flows

- **Signup**: email-and-code. Clerk handles the email verification via its own send or via our Postmark integration (preferred, for consistency of transactional email).
- **Login**: email-only, magic link or code.
- **Enterprise SSO (v4)**: SAML 2.0 and OIDC via Clerk enterprise features.
- **Practitioner SSO (v3)**: same mechanisms, gated per-organisation.
- **Session management**: long-lived sessions on mobile with automatic refresh; explicit logout available; sessions revocable from Settings.

### 17.2 Organisation model

Clerk's organisation model aligns with Convex's `organisations` table:

- Individual users: personal organisation on signup.
- Affiliate users: organisation represents the practice.
- Enterprise users: organisation represents the employer.

Users can belong to multiple organisations in principle (e.g. a user who is both personally subscribed and also covered by their employer). UX handles this with a workspace switcher in Settings.

### 17.3 Role mapping

Clerk organisation roles map to Twikka's membership roles:

- `admin` (in Clerk) → `enterprise_admin` or `affiliate_owner` (Twikka), based on org kind
- `member` (in Clerk) → `member` (Twikka, default user)
- Custom roles for `affiliate_practitioner`, `enterprise_viewer`, etc.

### 17.4 Identity security

- No passwords, anywhere.
- Magic links expire in 15 minutes, single-use.
- 6-digit codes expire in 15 minutes, rate-limited.
- Session tokens stored in secure platform stores (iOS Keychain, Android Keystore).
- Biometric re-auth optional (user-controllable from Settings) for app re-open.

---

## 18. Subscription and billing

Paddle handles all subscription billing as merchant of record.

### 18.1 v1 tier structure

- **Free trial**: 60 days. No card required at signup.
- **Standard**: $AUD X/month or $AUD Y/year (pricing TBD near launch; target ~$10-15/month).

### 18.2 v2+ tier structure

- **Standard**: unchanged.
- **Premium**: adds voice + video moments, richer analytics.

### 18.3 Trial mechanics

- User signs up → `lifecycleStage = active_trial`.
- Trial end date computed at signup.
- At 14 days before end: soft W-19 reminder.
- At 7 days before end: second W-19 reminder.
- At 2 days before end: third W-19 reminder, now prompting card capture.
- At trial end with no card: blocking W-19 takeover. User cannot dismiss but can cancel gracefully.
- If user cancels: retains access until trial end; `lifecycleStage = cancelled_trial`.

### 18.4 Payment failure

- Paddle handles retries according to its standard cadence.
- During grace period: `lifecycleStage = payment_failed`. App access continues, gentle in-app reminder.
- After grace exhausted: `lifecycleStage = lapsed`. Read-only access for 30 days. Account preserved; user can reactivate.

### 18.5 Cancellation

- Always available in Settings → Account → Subscription.
- Equally prominent to continuation actions.
- No dark patterns, no "are you really sure" chains.
- On cancellation: retains access until period end; `lifecycleStage = cancelled_paying`.

### 18.6 Enterprise billing (v4)

- Annual contracts, invoicing.
- Paddle handles alongside consumer flows.
- Multi-year options with discounting.

### 18.7 Affiliate billing (v3)

- Per-active-client monthly billing to practice (via Paddle).
- Revenue share paid out monthly or quarterly, depending on affiliate preference.
- Transparent reporting in the practitioner web app.

---

## 19. Email

Two strictly separated email systems.

### 19.1 Transactional (Postmark)

- Email verification code
- Magic link / login code
- Subscription receipts
- Payment failure notices
- Trial end reminder
- Account deletion confirmation
- Data export delivery
- Security notifications (new device sign-in, session revoked)

**Style**: concise, functional, branded. Plain text where possible; HTML sparingly.

### 19.2 Marketing (GoHighLevel)

- Welcome sequence (first 4 weeks, 3-5 emails, warm and supportive)
- Re-engagement for lapsed users
- Occasional feature announcements
- User stories (with explicit permission)
- Referral prompts (after sustained positive engagement)

**Sync mechanism**: Convex → GoHighLevel via webhook or scheduled job. Fields synced:

- `email`, `name`
- `lifecycleStage` (translates to GHL contact stage)
- `subscriptionTier`
- `createdAt`, `trialEndsAt`, `subscriptionEndsAt`
- `lifecycleTags` (e.g. `active_30d`, `lapsed_30d`, `high_engagement`)

Never synced:

- Chat content (any kind)
- Health or activity data
- Coach persona or internal memory
- Social connections or social activity

Unsubscribe from marketing is always honoured; transactional email continues.

---

## 20. Theming, accessibility, internationalisation

### 20.1 Theming architecture

Multi-theme support from day one. A theme is a structured object:

```
Theme {
  id: string
  name: string
  mode: "light" | "dark" | "system"
  palette: {
    background, surface, primary, primaryMuted,
    accent, accentMuted, text, textMuted, textFaint,
    bubbleCoach, bubbleUser, bubbleSystem, ...
  }
  typography: {
    displayFont, bodyFont, monoFont, sizes, weights, lineHeights
  }
  widgetStyles: {
    cardRadius, cardShadow, bubbleRadius, pinchedCorner,
    ...
  }
  motion: {
    durations, easings
  }
}
```

### 20.2 Shipping themes (v1)

- **Warm light (default)**: cream background, soft near-black text, subtle terracotta accent.
- **Warm dark**: deep warm near-black background, cream text, muted terracotta accent.
- (Additional themes can be added post-launch.)

### 20.3 Accessibility requirements

- **Type scaling**: all type scales from system settings up to 150% of baseline without layout break.
- **Contrast**: WCAG 2.2 AA minimum across the whole product; AAA for body text where possible.
- **Screen readers**: every interactive element labelled; chat bubbles read as "coach said" / "you said" etc.
- **Reduced motion**: honours OS setting; no essential information conveyed by motion alone.
- **Colour**: no information conveyed by colour alone.
- **Touch targets**: minimum 44x44 dp.
- **Voice-over sensible reading order**: messages read in chronological order; widgets read with their type ("suggestion card: would you like to try a 10 minute walk").

### 20.4 Internationalisation

**v1 ships English (Australian) only.** Locale strings are externalised from day one in preparation for future locales.

Likely future locales:

- English (UK, US, NZ) — variants
- English (simplified) — lighter reading level for accessibility
- Spanish (neutral) and Portuguese (Brazilian) — consistent with Couple Tools localisation strategy
- Other as demand emerges

The coach's voice doesn't translate cleanly; future locales will require tuned persona prompts per language rather than machine translation.

### 20.5 Text size

User-configurable beyond OS setting, in Settings → Theme → Text size:

- Smaller, Default, Larger, Largest

Default favours "Larger" for this audience, checked against OS dynamic type preferences.

---

## 21. Performance, offline, error handling

### 21.1 Performance targets

- Cold start to chat visible: < 2 seconds on modern devices, < 4 seconds on 3-year-old devices.
- Message send to appear in UI: < 200ms.
- Widget render: < 100ms.
- Chat scroll: 60fps on modern devices, not worse than 30fps on older devices.

### 21.2 Offline behaviour

Convex is reactive-online-first. Offline behaviour:

- Recent chat history is cached locally (last N days).
- User-sent messages queue when offline and send on reconnect.
- Device-sourced activity captured offline (by the OS health platform) syncs when online.
- Journal surface shows cached data with a "last updated" indicator.
- Coach cannot respond offline; a polite system notice indicates offline state and promises a response on reconnect.

### 21.3 Error handling

- Network errors: polite, never alarmist. "Having trouble connecting — we'll sort this out in a moment."
- Server errors: logged, reported via Sentry or equivalent, surfaced to user only when action-blocking.
- Validation errors: inline and specific.
- Coach errors (model failure, tool failure): graceful fallback to a simple acknowledgement and retry behind the scenes.

### 21.4 Battery and network discipline

- Background sync is opportunistic and batched.
- Realtime subscriptions close when the app is backgrounded.
- No aggressive polling.
- Device health reconciliation throttled to reasonable intervals (once on foreground, once per day background).

---

## 22. Privacy, security, compliance

### 22.1 Data classification

| Class | Examples | Handling |
|---|---|---|
| Identity | name, email | Minimum, needed for account |
| Health | activity data, duration, type | Encrypted, access-controlled, never shared to third parties |
| Sensitive content | chat messages, mood | Highest protection; never shared to third parties in individual form |
| Derived | trends, milestones | Computed; same protection as source |
| Subscription | billing status | Necessary for service |

### 22.2 Principles

- **Minimum collection**: only what the product requires.
- **Access by query layer**: no UI-only gates.
- **Consent for every sharing relationship**: individual, affiliate, enterprise.
- **Revocability**: any consent can be revoked without penalty.
- **Transparency**: what's shared with whom, visible in-app.
- **Portability**: export available at any time.
- **Deletion**: soft delete with 30-day reversal, then hard delete.

### 22.3 Legal framework

- **Governing entity**: Novansa OÜ, Estonia.
- **Governing law**: Estonian law, GDPR.
- **Additional**: Australian Privacy Act acknowledgement for Australian users.
- **Documents**: Terms, Privacy Policy, DPA (for B2B), SCCs where applicable.

### 22.4 Subprocessors

Disclosed at all times:

- Convex (backend, database)
- Clerk (authentication)
- Cloudflare R2 (object storage)
- OneSignal (push notifications)
- Postmark (transactional email)
- GoHighLevel (marketing email)
- Paddle (payment processing)
- Apple (HealthKit data access, in-app)
- Google (Fit / Health Connect data access, in-app)
- LLM provider (for coach inference; vendor current)
- Sentry or equivalent (error monitoring)
- Tavus (video moments, v2+ Premium only)

### 22.5 SOC 2 readiness (v4 prerequisite, foundational from v1)

From v1:

- Documented security practices (security.md in repo, evolving)
- Access control at database layer
- Named production accounts, MFA, no shared credentials
- Centralised logging and monitoring
- Incident response plan
- Data retention / deletion policy
- Encryption in transit (TLS) and at rest (Convex's default + R2's default)
- Vendor assessment record (per subprocessor)

SOC 2 Type II audit pursued when v4 enterprise pipeline justifies cost.

### 22.6 AI-specific risk

- User content is not used to train foundation models.
- LLM provider agreements prohibit training on Twikka customer data (or we use providers where this is default).
- Prompt injection resistance: user content is structurally separated from system instructions in every prompt.
- Sensitive output filtering: the coach will not echo or discuss user-provided sensitive identifiers, credentials, or third-party personal data.

---

## 23. Feature flags and progressive reveal

### 23.1 Flag system

Convex-backed flag system. A flag is:

```
FeatureFlag {
  key: string
  defaultEnabled: boolean
  overrides: {
    byUserId: map<userId, bool>,
    byOrgId: map<orgId, bool>,
    byCohort: string[], // named cohorts
    byPercentage: number, // 0-100 gradual rollout
    byEnvironment: "dev" | "staging" | "prod"
  }
  description: string
  plannedRevealDate?: timestamp
}
```

### 23.2 Flag categories

- **Version gates**: `v2_social`, `v2_voice`, `v2_video`, `v3_affiliates`, `v4_enterprise` — master switches for version features.
- **Feature sub-gates**: `v2_nearby_discovery`, `v3_practitioner_constraints`, etc. — finer-grained control.
- **Experiment flags**: for A/B tests.
- **Operational flags**: `emergency_disable_coach_proactive`, `emergency_reduce_notifications` — ops levers.

### 23.3 Hidden-build discipline

During v1 build:

- Every later-version feature is behind a flag defaulting to `false` in production.
- Default `true` in dev environment so engineers can exercise the full product.
- All code paths must tolerate the flag being either way at any time.
- UI elements gated by flags are not just hidden — they're absent from the built navigation tree in the off state.

### 23.4 Reveal process

When revealing a feature:

1. Enable flag in staging; QA full flow.
2. Gradual rollout via `byPercentage`.
3. Monitor telemetry and support channels.
4. Full enablement.
5. Flag remains in place for 60 days post-reveal in case of rollback need.
6. Flag deleted once considered stable.

---

## 24. Fake data appendix

For the prototype build, use the following sample data.

### 24.1 Sample users

- **Margaret Chen**, 62, female, retired teacher, Perth. Lives alone. Morning walker. Mode: momentum.
- **David O'Donnell**, 58, male, semi-retired. Cycled in his 30s, stopped. Mode: recovery (early).
- **Priya Nair**, 44, female, working mother. Limited time. Mode: flow (consistent 15 min sessions at lunch).
- **Tom Fletcher**, 71, male, retired. Widower. Walks with a dog. Mode: momentum.
- **Sue Abramovich**, 49, female, accountant. Perimenopausal. Stop-start history. Mode: recovery.

### 24.2 Sample coach personas (for testing)

Each persona has 10-20 sample chat turns in their voice, covering:
- Greeting for a new user
- Response to a captured walk
- Response to a skipped day
- Response to a user mentioning feeling low
- Response to a user mentioning a win
- Suggestion of a small activity
- Accepting a "not today" response gracefully
- Returning the user after a gap
- Celebrating a milestone

### 24.3 Sample conversation

(Included for prototype seeding — 40-60 turns of Margaret ↔ Sue across two weeks. Captures the pacing, the silence between sessions, the device-sourced activity acknowledgements, and a dip-and-return.)

### 24.4 Sample activities

A 60-day history of mixed device-sourced activities for each sample user, including gaps, variety, and realistic inconsistency.

### 24.5 Sample social graph (v2 testing)

- Margaret ↔ Sue (accountability pair, mutuals)
- Tom in "Walking Wednesdays" group (coach-facilitated)
- David in "Back to Cycling — over 50s" group

### 24.6 Sample affiliate (v3 testing)

- Affiliate: **Fremantle Physiotherapy**, practice of 3 physios.
- Clients: 15 invited, 10 active.
- Sample constraints: "Avoid running suggestions for [client] for 6 weeks post-op."

### 24.7 Sample enterprise (v4 testing)

- Organisation: **Cares Communities** (real partner, test data).
- 300 employees, 180 active.
- Mock HR data for correlation testing.

---

## 25. Out of scope and open questions

### 25.1 Explicitly out of scope for v1

- Voice coaching
- Video coach moments
- Social beyond 1:1 accountability + cohort groups
- Member-created groups
- Nearby discovery
- Affiliate channel
- Enterprise channel
- Native tablet layout (responsive is acceptable v1; dedicated tablet layouts v2+)
- Smartwatch companion apps
- Third-party integrations beyond Apple Health / Google Fit
- Food / nutrition tracking, at any tier, any version
- Sleep tracking as a primary metric (signal may be used quietly for coach context)
- Weight tracking
- Menstrual cycle tracking
- Multiple simultaneous coach conversations
- User-authored content (blogs, posts, stories)
- Public profiles
- Sharing to external social networks

### 25.2 Deferred decisions

- **Coach persona set**: six is committed; final names, illustrated portraits, and voice casting are v1 content work and not UI-spec.
- **Pricing specifics**: committed to "paid with long trial"; exact monthly/annual prices set closer to launch.
- **Illustration style for coach portraits**: to be developed as a brand exercise. Should be cohesive, warm, unmistakably not AI-generated-photoreal.
- **LLM provider**: model-agnostic architecture; specific provider chosen near launch based on quality/cost/privacy terms.
- **Voice provider (v2)**: to be selected; must support distinct Australian voices.
- **Video provider (v2)**: Tavus is the working assumption, but alternatives assessed at implementation time.

### 25.3 Open questions

- Should v1 include a lightweight manual-log path for users who explicitly want to track, or rely entirely on coach-captured conversational logging?
- Should coach selection allow for an "I'll decide later" option, or is commitment at onboarding important enough to require a choice?
- Should we capture ethnicity conversationally in the early weeks for content relevance, given it's a category of stated sensitivity? (Leaning toward "no, not now".)
- What's the right cadence for reflection cards (W-13) — weekly, event-driven only, or a mix?
- Should trial length vary by acquisition channel (shorter for affiliate-sourced clients, for example)?
- Do we need a "pair with partner" flow in v1 that is distinct from accountability-partner (for spouses specifically, given the Couple Tools product adjacency)?

These are questions to revisit during the build, not blockers.

---

## Appendix A: Screen inventory checklist

To support the "build all" commitment, here's a complete screen list.

### Mobile app (Flutter)

**Shell and navigation**
- Splash
- Welcome / landing
- Bottom nav / side nav
- Settings root

**Authentication**
- Signup (name + email)
- Email verification code entry
- Login (email)
- Magic link / code entry
- Session expired / re-auth

**Onboarding**
- Coach selection
- Coach selection confirmation
- First chat landing

**Coach surface**
- Coach chat (main)
- Coach profile (read-only view of current coach)
- Change coach flow

**Messages surface (full v2 UI, v1 shows limited scope)**
- Messages inbox (tabbed: Coach | People)
- Invite review (takeover)
- Invite received (locked thread)
- Invite quiet notice
- New message entry
- Create group
- DM thread (cream-on-cream)
- Group thread
- Group info / settings
- Member profile
- Block & report flow
- Media viewer

**Journal**
- Journal main
- Period selectors (week, month, year, all)
- Milestone detail
- Saved highlights

**Settings**
- Settings root
- Account
- Subscription
- Change coach
- Health connections
- Notifications
- Privacy
- Theme picker
- Text size
- Data export
- Delete account
- Help
- About
- Debug (debug builds only)

**Consent and legal**
- Consent moments (at relationship changes)
- Privacy policy viewer
- Terms of service viewer

**Widgets as screens**
- All 21 v1 widgets + v2-v4 widgets (rendered within chat surfaces)
- Widget gallery screen (debug only, showing every widget in every state)

### Practitioner web app (v3)

- Sign-up / sign-in
- Dashboard
- Client list
- Client detail
- Constraint editor
- Invite code management
- Team management
- Branding settings
- Billing
- Reports
- Support

### Enterprise web app (v4)

- Sign-up / sign-in (SSO)
- Dashboard
- Cohort metrics
- HR data upload / integration
- User management
- SSO configuration
- Billing and contracts
- Compliance portal
- Settings

---

## Appendix B: Glossary

- **Coach**: the AI persona the user interacts with. Not a human.
- **Persona**: the swappable layer that shapes how the agent presents. Six v1 personas.
- **Agent**: the underlying LLM-driven system that holds memory and orchestrates tools.
- **Widget**: any item in the chat timeline, including messages.
- **Mode**: coach behaviour state (recovery, momentum, flow).
- **Affiliate**: a health practitioner or practice that refers clients.
- **Enterprise**: an employer purchasing for a workforce.
- **Cohort**: a group of users, used in enterprise aggregate metrics and in coach-facilitated groups.
- **Trajectory**: the product's preferred framing for progress over time — directional, never-lost.
- **Never-lost**: a property of milestones and metrics such that they cannot decrease.

---

## Appendix C: Build sequencing suggestion

A suggested order for implementation, given the "build all" commitment:

1. Theme system and widget library (visual foundation)
2. Auth and account shell (Clerk + Convex)
3. Coach agent foundation (Convex Agent component, memory model, persona layer)
4. Chat surface with core widgets (W-01 through W-09, W-13, W-14)
5. Onboarding (coach selection, first-conversation flow, age/gender capture W-15/16)
6. Health integration (W-17, W-04 acknowledgements, taxonomy mapping)
7. Journal surface
8. Settings and privacy controls
9. Notifications (OneSignal integration, frequency adaptation)
10. Subscription flows (Paddle, trial mechanics, W-19)
11. Marketing sync (GoHighLevel)
12. Coach switching (W-21)
13. Safety and escalation logic
14. v2 social (all screens, flagged off)
15. v2 voice and video (flagged off)
16. v3 practitioner web app (flagged off)
17. v4 enterprise web app (flagged off)
18. Feature flag control surface (admin only)
19. Fake data seeding for testing
20. QA and polish

This is the engineering sequence for parallel-built-but-staged-deploy. Each numbered item produces a shippable, testable slice.

---

*End of document.*
