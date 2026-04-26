# Twikka — Coach Interaction Design

**Status:** Foundational reference. Written 2026-04-25.
**Purpose:** Define the data structures and interaction pipeline that govern how the coach operates. This document sits alongside `twikka-wiki-design.md` (knowledge architecture) and `twikka_coach_personas.md` (voice and personality). Together they form the complete coaching system spec.

**Design principle:** The raw conversation history is always preserved and is the source of truth. It almost never enters the prompt directly. Extraction jobs progressively distil it into structured memory, and that structured memory is what the coach actually works from. Speed, relevance, and cost are all served by this separation.

---

## Overview: What the Coach Needs to Know

For any given conversation turn, the coach needs access to six distinct categories of information:

| Category | Source | Always in prompt? |
|---|---|---|
| Who this person is | `knowledge_fact` (user scope) | Yes |
| What they're trying to do | `user_goals` | Yes |
| Where they're at right now | `user_coach_state` | Yes |
| How they've been feeling | `user_signals` (summarised) | Yes |
| What we've been talking about | Recent `messages` | Yes (last N turns) |
| What the evidence says | Wiki / RAG | Only for knowledge questions |

The full conversation history and raw activity data are stored in Convex but almost never injected into a prompt. They feed the extraction jobs that keep the structured layers current.

---

## Data Structures

### 1. Raw conversation history — `messages` (Convex Agent tables)

Already defined in the build plan. Every message, timestamped, never pruned.

Key fields relevant to this design:
- `thread_id`, `user_id`, `coach_id`
- `role`: `user | assistant`
- `content`: full message text
- `created_at`

Used for: audit, extraction jobs, "what did we talk about on this date" lookups. Not injected wholesale into prompts.

---

### 2. Knowledge fact — `knowledge_fact`

Vector-indexed structured facts, one row per discrete thing the coach knows. Three scopes share the same primitive:

- `agent` — coach-internal calibration content (rare; never tied to a user)
- `platform` — the wiki and other shared knowledge, indexed for retrieval (see `twikka-wiki-design.md`)
- `user` — facts about a specific user, distilled from conversation

Per-fact rows give us provenance, recency tracking, status transitions, and easy upserts. Embeddings make semantic retrieval one query.

```typescript
{
  _id: Id<"knowledge_fact">,

  scope: "agent" | "platform" | "user",
  organisation_id: Id<"organisations"> | null,  // null for agent/platform
  user_id: Id<"users"> | null,                  // null for agent/platform; set for user-scope

  category: "fact" | "preference" | "barrier" | "opinion" | "relationship",
  key: string,                          // short slug: "bad_left_knee", "works_night_shifts",
                                        // "hates_gym", "dog_named_charlie", "daughter_emma"
                                        // unique per (user_id, key) for user-scope rows
  value: string,                        // natural language: "Has had left knee pain since 2024,
                                        // avoids high-impact activities"
  confidence: "high" | "medium" | "low",
  status: "active" | "superseded" | "resolved",
                                        // "resolved" for barriers that have been overcome;
                                        // "superseded" when a newer fact replaces this one

  embedding: number[],                  // vector for semantic retrieval; recency-decay reranker on top

  source_message_ids: Id<"messages">[],  // provenance for user-scope rows; empty for agent/platform
  last_used_at: number | null,          // when this fact was last included in a prompt
  access_count: number,                 // ditto, for retrieval ranking

  created_at: number,
  updated_at: number,
}
```

**Categories** (apply to user-scope; platform/agent scopes use a separate type taxonomy described in `twikka-wiki-design.md`):

- `fact` — objective: age, location, occupation, injury history, health conditions
- `preference` — what they like / dislike: "prefers morning activity", "enjoys walking with partner"
- `barrier` — constraints: "no gym access", "shift worker", "lower back pain flares with running"
- `opinion` — how they think: "sceptical of structured programs", "motivated by streaks", "dislikes being told what to do"
- `relationship` — people and animals in their life that the coach can reference: partner's name, kids, dog

**Notes:**
- `key` is unique per user for user-scope rows. Upserting on `(user_id, key)` prevents duplicates
- `last_used_at` is updated each time a fact is included in a prompt, enabling future pruning of stale facts
- `status: resolved` should be used, not deletion — history matters for the audit trail
- Retrieval per turn: embedding search across scopes the agent has access to (always `user` for the current user, always `platform`, optionally `agent`), top-N reranked by recency-decay × confidence

---

### 3. User goals — `user_goals`

What the user has said they want to achieve. Separate from memory because goals have a lifecycle.

```typescript
{
  _id: Id<"user_goals">,
  organisation_id: Id<"organisations">,
  user_id: Id<"users">,

  type: "frequency" | "event" | "general",
                                        // frequency: "walk 3x per week"
                                        // event: "do a 5K by October"
                                        // general: "get a bit fitter", "lose some weight"
  description: string,                  // natural language, as expressed by the user
  target: {                             // structured where parseable; null for general goals
    frequency?: number,
    unit?: "day" | "week" | "month",
    activity_type?: string,
    event_date?: number,
    event_description?: string,
  } | null,
  status: "active" | "achieved" | "abandoned" | "paused",
  source_message_ids: Id<"messages">[],
  coach_last_referenced_at: number | null,  // rate-limits how often the coach surfaces this goal
  created_at: number,
  updated_at: number,
}
```

**Notes:**
- `coach_last_referenced_at` prevents the coach from referencing a goal every single session. A goal should surface naturally and occasionally, not become a nagging fixture.
- Goals should not be deleted when abandoned — they inform the coach's understanding of what the user has tried and moved on from.

---

### 4. Activities — `activities` and `activity_kinds`

Twikka does not use a small fixed list of activity types. The catalogue is the **Compendium of Physical Activities (CoPA)**, ~1,300 entries seeded on day one, extended by Apple `HKWorkoutActivityType` and Health Connect `ExerciseType`, and grown by classifier-inferred rows from user free-text. Full taxonomy spec lives in PRD §9.2.

**`activity_kinds`** — the catalogue. One row per kind:

```typescript
{
  _id: Id<"activity_kinds">,
  slug: string,                         // "walking_brisk"
  display_name: string,                 // "Brisk walking"

  // CoPA backbone
  copa_code: string | null,
  copa_mets: number | null,             // internal energy proxy; never user-surfaced
  copa_major_heading: string | null,    // "walking"
  copa_class: string | null,

  // Five classification flags — all that apply
  is_cardio: boolean,
  is_strength: boolean,
  is_mobility: boolean,
  is_balance: boolean,
  is_mental: boolean,

  // Platform mappings
  apple_hk_types: string[],             // ["walking"]
  health_connect_types: string[],       // ["WALKING"]

  // Aliases (en-AU for v1; per-locale later)
  aliases: string[],

  // Provenance and review
  source: "copa_seed" | "apple_seed" | "health_connect_seed" | "classifier_inferred",
  needs_review: boolean,
  reviewed_at: number | null,
  reviewed_by: Id<"users"> | null,

  created_at: number,
  updated_at: number,
}
```

**`user_activity_aliases`** — per-user phrasings the coach has learned:

```typescript
{
  _id: Id<"user_activity_aliases">,
  user_id: Id<"users">,
  activity_kind_id: Id<"activity_kinds">,
  alias: string,                        // user's exact phrasing, lowercased
  captured_at: number,
  source_message_id: Id<"messages"> | null,
  confirmed_by_user: boolean,           // true if coach asked and user said yes
}
```

**`activities`** — the instance log. Every activity, whether detected automatically or reported in conversation:

```typescript
{
  _id: Id<"activities">,
  organisation_id: Id<"organisations">,
  user_id: Id<"users">,

  source: "apple_health" | "health_connect" | "reported" | "coach_inferred",
  external_id: string | null,           // Apple HealthKit / Health Connect source ID for dedupe

  activity_kind_id: Id<"activity_kinds">,

  started_at: number,
  ended_at: number | null,
  duration_minutes: number | null,

  metadata: {
    distance_km?: number,
    steps?: number,
    avg_heart_rate?: number,
    perceived_effort?: number,          // 1–10 RPE, user-reported
    notes?: string,                     // anything extra the user said about it
    calories?: number,                  // stored if platform provides; never surfaced
    elevation_m?: number,
  },

  mets_estimate: number | null,         // copa_mets × (duration_minutes / 60); internal only

  acknowledged_by_coach: boolean,       // has the coach responded to this activity?
  acknowledgement_message_id: Id<"messages"> | null,

  created_at: number,
}
```

**Notes:**
- `acknowledged_by_coach` is the flag that drives the proactive pipeline. Health sync creates an activity record; the trigger evaluator checks for unacknowledged activities.
- `source: coach_inferred` covers cases where the user says "I went for a walk yesterday" in chat and no health data exists — the extraction job creates the record.
- Deduplication between platform sources and `reported` is handled at write time by checking for an existing record within ±30 minutes for the same user and `activity_kind_id`.
- The classifier resolution flow that turns user free-text into an `activity_kind_id` is specified in PRD §9.2 (5-step resolver: user-alias → global-alias → embedding → ambiguous-coach-asks → new-kind-with-needs-review).

---

### 5. User signals — `user_signals`

Time-series records of how the user is feeling. Unlike `knowledge_fact`, these are not durable facts about the person — they are data points that only become meaningful in aggregate. A single "tired today" entry is noise. Twenty-two "tired" entries in thirty days is a pattern worth acting on.

```typescript
{
  _id: Id<"user_signals">,
  organisation_id: Id<"organisations">,
  user_id: Id<"users">,

  signal_type: "energy" | "mood" | "stress" | "sleep_quality" |
               "motivation" | "soreness" | "general_wellbeing",

  value_numeric: number | null,         // 1–5 scale, normalised at write time
                                        // 1 = very low/poor, 5 = very high/excellent
  value_label: string | null,           // "low" | "medium" | "high"
  value_raw: string | null,             // exact phrase from user or health source:
                                        // "exhausted", "feeling great", "a bit stiff"

  source: "reported" | "apple_health" | "explicit_checkin",
                                        // reported: extracted from conversation
                                        // apple_health: derived from HRV, sleep, resting HR
                                        // explicit_checkin: user responded to a direct prompt

  source_message_id: Id<"messages"> | null,

  recorded_at: number,                  // when the signal applies — may differ from created_at
                                        // e.g. user says "I was exhausted on Sunday" on Tuesday
  created_at: number,

  context_note: string | null,          // any reason given: "bad night's sleep",
                                        // "stressful week at work", "post long run"
}
```

**Why `value_raw` matters:** "a bit tired" and "completely wiped out" both normalise to low energy, but they are not the same thing. The raw phrase is preserved alongside the normalised value for nuance and future analysis.

**Why `recorded_at` ≠ `created_at`:** Users often report signals in retrospect ("I was exhausted yesterday", "my sleep has been terrible all week"). The signal should be anchored to when it applied, not when it was captured.

**Apple Health derived signals:**

| HealthKit metric | Maps to |
|---|---|
| HRV (low relative to baseline) | `stress` or `energy` at low |
| Resting heart rate (elevated) | `stress` or `energy` at low |
| Sleep duration / quality | `sleep_quality` |
| Active energy / steps (zero on non-rest days) | Informs `motivation` or `energy` |

These are written as `source: apple_health` by the HealthKit sync action, without any conversation required.

---

### 6. User coach state — `user_coach_state`

One record per user, continuously updated. The coach's current read on where this person is.

```typescript
{
  _id: Id<"user_coach_state">,
  organisation_id: Id<"organisations">,
  user_id: Id<"users">,

  // Mode — computed from activity recency and frequency
  mode: "flow" | "momentum" | "recovery" | "returning",
  mode_since: number,
  mode_computed_at: number,

  // Activity signals
  streak_days: number,                    // consecutive days with at least one activity
  days_since_last_activity: number | null,
  activities_last_7_days: number,
  activities_last_28_days: number,
  typical_activity_days: string[],        // e.g. ["monday", "wednesday", "friday"]
                                          // computed from 8-week history

  // Relationship signals
  app_tenure_days: number,
  total_sessions: number,                 // total coach conversations
  lapse_count: number,                    // total lapses (>7 days inactive after being active)
  last_lapse_at: number | null,

  // Signal elicitation tracking
  last_signal_elicitation_at: number | null,  // last time coach asked about wellbeing
  signal_data_sparse: boolean,                // true if <3 signals in last 14 days

  // Outreach control
  last_coach_outreach_at: number | null,  // most recent proactive message from coach
  recent_suggestions: Array<{
    type: string,                         // "morning_walk", "rest_day", "strength_intro" etc
    suggested_at: number,
  }>,                                     // rolling 4-week window; prevents repetition

  computed_at: number,
}
```

**Mode definitions:**

| Mode | Condition | Coach posture |
|---|---|---|
| `flow` | 14+ day streak, consistent frequency | Gentle reinforcement; can nudge slightly bigger challenges |
| `momentum` | Active in last 7 days, no long streak | Encouragement; keep the consistency going |
| `recovery` | 3–7 days inactive after being active | No pressure; low bar; warm and open |
| `returning` | 7+ days inactive | Warmth first, fitness second; don't audit the gap |

Mode is recomputed after every activity record creation and every extraction job run.

---

### 7. Proactive trigger log — `coach_triggers`

Records every coach-initiated outreach. Drives rate-limiting and future effectiveness analysis.

```typescript
{
  _id: Id<"coach_triggers">,
  organisation_id: Id<"organisations">,
  user_id: Id<"users">,

  trigger_type: "activity_unacknowledged" | "inactivity_checkin" | "streak_milestone" |
                "goal_reminder" | "planned_window" | "return_welcome" |
                "signal_elicitation" | "signal_pattern_reflection",
  trigger_source_id: string | null,       // e.g. activity _id if trigger_type = activity_unacknowledged
  message_id: Id<"messages"> | null,      // the coach message that was sent
  notification_sent: boolean,
  user_responded: boolean,                // did the user open the app and reply?
  responded_at: number | null,
  suppressed: boolean,                    // evaluated but decided not to send
  suppression_reason: string | null,
  created_at: number,
}
```

---

## Signal Sources and Use Cases

Signals enter the system from two sources: passively from Apple Health, and actively from conversation. When neither is producing enough data, the coach elicits signals naturally. When enough data accumulates, the coach can reflect patterns back to the user.

### Source 1: Apple Health (passive)

Apple Health writes signals to `user_signals` with `source: apple_health` without any user interaction. This gives the coach a baseline read on the user even in quiet weeks.

The HealthKit sync action runs when:
- The user opens the app (foreground sync)
- On a background schedule (every few hours, subject to iOS limits)

Derived signals written per sync:

**Sleep quality** — from HealthKit sleep analysis. Duration below 6 hours → `value_label: low`. 6–7.5 hours → `medium`. 7.5+ → `high`. If sleep stage data is available (HKCategoryTypeIdentifierSleepAnalysis), use time in deep sleep as a quality modifier.

**Recovery / stress** — from HRV and resting heart rate where available. Both are trended against the user's own 30-day baseline, not population norms. An HRV 15% below their baseline → `signal_type: stress`, `value_label: high`. Resting HR 10% above baseline → `signal_type: energy`, `value_label: low`.

**Energy proxy** — on days where step count is near zero and no workout was recorded, and the user's typical activity pattern would have predicted movement, a `signal_type: energy`, `value_label: low` signal is written at `confidence: low`. This is a weak proxy and should only influence context, not drive a direct coach response.

Apple Health signals give the coach useful background without requiring the user to report anything. If the user arrives for a chat having had two nights of broken sleep (per HealthKit), the coach has that context even if the user hasn't mentioned it.

---

### Source 2: Conversation extraction (active)

The extraction job (described in detail below) identifies signal-type content from user messages and writes to `user_signals` with `source: reported`. Unlike memory facts, the filter here is permissive — if the user expressed a transient state, capture it.

**Examples of conversation → signal extraction:**

| User says | Signal written |
|---|---|
| "I'm exhausted today" | `energy, low` |
| "Actually feeling pretty good" | `energy, high` + `mood, medium-high` |
| "Didn't sleep well last night" | `sleep_quality, low` |
| "Really stressed at work this week" | `stress, high`, `context_note: "work"` |
| "My legs are really sore after yesterday" | `soreness, high` |
| "I couldn't be bothered going today" | `motivation, low` |
| "I felt amazing after that walk" | `mood, high`, `context_note: "post-walk"` |
| "I've been in a much better headspace lately" | `mood, high`, `value_raw: "better headspace"` |

The extraction job writes `recorded_at` as the time the message was sent, unless the user uses past tense with a specific time reference ("I was exhausted yesterday" → `recorded_at` set to yesterday).

---

### Source 3: Explicit check-in (prompted)

Some users rarely share how they feel unprompted. The coach can directly ask — but sparingly, and only in its own voice. This should never feel like a form.

**When to elicit:**
- `signal_data_sparse: true` (fewer than 3 signals in 14 days) AND a natural opportunity exists in the conversation
- After an unacknowledged Apple Health activity where the workout was notably long or intense
- Following up on a previously reported low signal (user said they were stressed yesterday; coach checks in today)

**Rate limits:**
- Maximum one signal-eliciting question per conversation
- Minimum 48 hours between signal elicitation prompts
- Never ask back-to-back sessions — if the user didn't engage with the question last time, give it a rest

**How each coach asks — examples:**

*After Apple Health detects a 45-minute run (activity unacknowledged):*
- **Fiona**: "Saw you got a run in this morning. How'd you feel after it?"
- **Ben**: "Nice work on that run. Was it a good one?"
- **Rob**: "Got a run in earlier. How's the body after it?"
- **Tom**: "Morning run today. How are you feeling?"
- **Priya**: "I noticed you went for a run this morning. How did it feel when you were out there?"
- **Margaret**: "Oh, you were out for a run this morning. How did it feel, love?"

*Following up on a previous signal ("I was stressed/exhausted yesterday"):*
- **Fiona**: "You mentioned you were pretty flat yesterday. Any different today?"
- **Ben**: "How's today feeling compared to yesterday? You were a bit wiped."
- **Rob**: "Yesterday sounded rough. Y'alright today?"
- **Priya**: "You said you were exhausted yesterday. I'm curious how you're feeling now."
- **Margaret**: "You seemed tired yesterday. How are you today, properly?"

*When user hasn't reported signals in a while and checks in generally:*
- **Fiona**: "How have you actually been? Energy-wise, mood — the bigger picture."
- **Ben**: "How's everything going? Not just the exercise stuff — generally."
- **Tom**: "How have you been? In yourself."

---

### Signal pattern reflection

Once enough data exists, the coach can reflect patterns back. This is one of the most valuable things the system can do — showing someone something true about themselves that they hadn't noticed.

**Trigger conditions for pattern reflection:**
- At least 20 signal data points for the relevant type in the last 60 days
- A pattern is statistically present (simple threshold-based detection, not complex ML)
- The coach hasn't reflected this pattern in the last 30 days

**Pattern types and example reflections (in coach voice):**

*Energy improving over time:*
- **Fiona**: "I've noticed you've been saying you're feeling better lately — more energy, fewer rough days. It's been a gradual thing over the last few weeks. Worth noticing."
- **Ben**: "You know what I've picked up? You've been talking about having more energy recently. Quietly, but it's there."

*Consistently low energy — possible overtraining signal:*
- **Rob**: "You've mentioned being tired a lot lately. Worth wondering if you're giving yourself enough recovery time. More isn't always better."
- **Priya**: "I've been noticing you mention feeling tired quite often. I wonder if the current pace is asking a lot of your body right now."
- **Fiona**: "You've been pretty flat for a few weeks now. It might be worth taking a look at whether you're doing too much, too soon."

*Mood correlates with activity:*
- **Ben**: "Something I've noticed — you tend to be in a better headspace on the days after you've moved. It's not a coincidence."
- **Margaret**: "I've noticed your mood tends to lift after you've been for a walk or done something. It's not always dramatic, but it's there. You might already know that."

*Sleep quality improving:*
- **Priya**: "Your sleep looks like it's been better lately. Is that how it feels from your side?"
- **Fiona**: "Looks like you've been sleeping better recently. That's not nothing."

*Post-exercise mood lift pattern:*
- **Rob**: "Worth knowing — you nearly always feel better after a session than before it. In case that's useful next time you're weighing it up."
- **Ben**: "One thing I've noticed — you usually feel pretty good after exercise, even when you weren't keen going in. Just something to remember on the days you're not sure."

**Important:** Pattern reflections should be framed as observations, not conclusions. "I've noticed" not "The data shows". "Worth wondering" not "You should". The coach is pointing at something, not telling the user what it means.

---

## Interaction Pipeline

### Reactive pipeline — user sends a message

```
┌─────────────────────────────────────────────────────────┐
│ 1. CLASSIFY                                              │
│                                                         │
│  What kind of message is this?                          │
│  → emotional / relational                               │
│    (check-in, lapse acknowledgement, return)            │
│  → activity report                                      │
│    ("did a 40-minute walk this morning")                │
│  → knowledge question                                   │
│    ("is HIIT better than steady-state for fat loss?")   │
│  → goal / planning                                      │
│    ("I want to try running", "can we make a plan?")     │
│  → admin / other                                        │
│    (change coach, account questions)                    │
│                                                         │
│  Lightweight LLM call or rule-based classifier.         │
│  Classification determines what gets assembled next.    │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│ 2. ASSEMBLE CONTEXT                                      │
│                                                         │
│  Always included:                                       │
│  → Persona block (from coach_personas)                  │
│  → knowledge_fact (user scope): all active facts        │
│    (sorted by last_used_at; trimmed to ~800 tokens)     │
│  → user_goals: all active goals                         │
│  → user_coach_state: mode, streak, days_since_activity, │
│    signal_data_sparse flag                              │
│  → user_signals summary: computed natural language      │
│    digest of last 7 days of signals (see below)         │
│  → Recent messages: last 10–20 turns from this thread   │
│                                                         │
│  Conditional:                                           │
│  → Wiki retrieval (classification = knowledge question) │
│    Semantic search against wiki_index; top 3 articles   │
│    injected as grounding context                        │
│  → Activity summary (classification = activity report   │
│    or goal/planning): last 28 days summary              │
│    (counts by type, recent notable activities)          │
│  → Signal trend summary (if signal_data_sparse: false   │
│    and coach is considering a pattern reflection):      │
│    30-day trend digest                                  │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│ 3. GENERATE                                             │
│                                                         │
│  Single LLM call (Claude Sonnet) with assembled prompt. │
│  Response streamed to user immediately.                 │
│                                                         │
│  Prompt structure:                                      │
│  [persona block]                                        │
│  [user context: memory + goals + mode + signals]        │
│  [knowledge context: wiki chunks if applicable]         │
│  [conversation instructions]                            │
│  [recent message history]                               │
│  [current user message]                                 │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│ 4. EXTRACT (async — runs after response is delivered)   │
│                                                         │
│  Background Convex action against the user message:    │
│                                                         │
│  Facts / preferences / barriers / relationships?        │
│  → Upsert to knowledge_fact, scope=user (high filter)   │
│                                                         │
│  Signals — mood, energy, stress, sleep, soreness,       │
│  motivation, general wellbeing?                         │
│  → Write to user_signals (low filter: if mentioned,     │
│    capture it)                                          │
│                                                         │
│  Activities reported?                                   │
│  → Create activity record (source: reported)           │
│  → Set acknowledged_by_coach: true                      │
│                                                         │
│  Goals expressed?                                       │
│  → Upsert to user_goals                                │
│                                                         │
│  Log to coach_interactions                              │
│  → wiki_articles_used, confidence_signal, needs_wiki   │
│                                                         │
│  Recompute user_coach_state                             │
│  → mode, streak, days_since_last_activity              │
│  → signal_data_sparse (count signals last 14 days)     │
│  → Update last_used_at on facts included in prompt      │
└─────────────────────────────────────────────────────────┘
```

---

### Proactive pipeline — event fires

**Trigger sources:**

| Trigger | Condition |
|---|---|
| `activity_unacknowledged` | Apple Health / Health Connect sync creates an activity with `acknowledged_by_coach: false` |
| `inactivity_checkin` | `days_since_last_activity` crosses a mode-dependent threshold |
| `streak_milestone` | Streak hits 7, 14, 30, 60, 90 days |
| `goal_reminder` | Active frequency goal; user is behind their typical pattern |
| `planned_window` | User has expressed a preferred activity time and it's approaching |
| `return_welcome` | First session after a lapse (>7 days); fires on app open |
| `signal_elicitation` | `signal_data_sparse: true`; natural opportunity to ask how they're feeling |
| `signal_pattern_reflection` | Pattern threshold met; coach hasn't reflected this pattern in 30 days |

**Threshold by mode for `inactivity_checkin`:**

| Mode | Days before checkin |
|---|---|
| `flow` | 3 days |
| `momentum` | 4 days |
| `recovery` | 5 days |
| `returning` | 7 days |

```
┌─────────────────────────────────────────────────────────┐
│ 1. EVALUATE — should we send?                           │
│                                                         │
│  → last_coach_outreach_at: minimum 20 hours since last  │
│  → Check user notification preferences                  │
│  → Check recent_suggestions: same trigger type sent     │
│    within 7 days → suppress                             │
│  → Mode check: returning users get more space           │
│  → signal_elicitation: last_signal_elicitation_at must  │
│    be >48 hours ago; user must have engaged last time   │
│  → If any check fails → log suppressed: true, exit      │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│ 2. ASSEMBLE CONTEXT                                      │
│                                                         │
│  Same as reactive pipeline, minus the user message.     │
│  Trigger type shapes the generation instruction:        │
│                                                         │
│  activity_unacknowledged →                              │
│    "Acknowledge this activity in your voice.            │
│     If it was long or intense, it's natural to ask      │
│     how they felt. One or two lines."                   │
│                                                         │
│  inactivity_checkin →                                   │
│    "The user hasn't been active for N days.             │
│     Open a door. Don't audit the gap."                  │
│                                                         │
│  streak_milestone →                                     │
│    "Note the milestone honestly.                        │
│     Don't inflate it. Then move on."                    │
│                                                         │
│  goal_reminder →                                        │
│    "User has a goal they've been quiet on.              │
│     Surface it gently, not as an obligation."           │
│                                                         │
│  signal_elicitation →                                   │
│    "User hasn't shared how they're feeling in a while.  │
│     Ask once, naturally, in your voice.                 │
│     One question only. Don't make it clinical."         │
│                                                         │
│  signal_pattern_reflection →                            │
│    Pattern description + instruction:                   │
│    "Reflect this observation back. Frame as noticing,   │
│     not concluding. One or two sentences, then open     │
│     it to them."                                        │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│ 3. GENERATE                                             │
│                                                         │
│  Two outputs:                                           │
│  → Push notification copy (short, in persona voice)    │
│  → Full in-app message (ready when user opens thread)  │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│ 4. LOG                                                  │
│                                                         │
│  → Write to coach_triggers                             │
│  → Update user_coach_state.last_coach_outreach_at      │
│  → Update last_signal_elicitation_at if applicable     │
│  → Append to recent_suggestions                        │
│  → Set activity.acknowledged_by_coach: true (if appl.) │
└─────────────────────────────────────────────────────────┘
```

---

## Scheduling and Notification Architecture

### Mechanism: per-user scheduler, not a global cron

The obvious approach — a cron job that scans all users every hour — is wrong at scale. At 10,000 users that's 10,000 evaluations per hour, most of which find nothing to do.

Convex provides a better primitive: `ctx.scheduler.runAfter()` and `ctx.scheduler.runAt()`. These schedule a one-off action for a specific user at a specific future time. The primary trigger engine is therefore **event-driven per-user scheduling**, with a light daily cron as a safety net only.

**How per-user scheduling works:**

When a triggering condition is met, a Convex action is scheduled for the specific user at the appropriate future time. If conditions change before it fires, the scheduled action is cancelled and rescheduled. Each scheduled action carries the user ID and trigger context as arguments; when it fires it re-evaluates current conditions before doing anything.

| Triggering event | Scheduling action |
|---|---|
| Activity created (Apple Health or reported) | Schedule `acknowledge_activity` for +30 min |
| User goes inactive (no activity today, last activity was today) | Schedule `inactivity_checkin` for +N days (based on mode) |
| Streak reaches 6 days | Schedule `streak_milestone` for +1 day (fires on day 7) |
| Active goal + user behind typical frequency | Schedule `goal_reminder` for next natural window |
| `signal_data_sparse` becomes true | Schedule `signal_elicitation` for next natural window |
| Pattern threshold crossed | Schedule `signal_pattern_reflection` for next natural window |

If the user becomes active again before a scheduled `inactivity_checkin` fires, the scheduled action is cancelled and a new one is set from the new inactivity start point.

**The daily cron** runs once at 6am UTC. It does not generate messages — it is a housekeeping pass only:
- Find users with unacknowledged activities older than 2 hours where no scheduled action exists → reschedule
- Find users whose mode has changed but whose scheduled inactivity action has not been updated → reschedule with correct threshold
- Check for pattern reflections that are overdue
- Log any anomalies for monitoring

---

### Send window: user behaviour + persona preference

When a scheduled action fires, it does not necessarily send immediately. It first determines the correct send window for this user and checks whether now falls within it.

**Send window calculation (in order of priority):**

1. **Hard constraints** — applied always, regardless of anything else:
   - Quiet hours: default 9:00pm to 7:00am (user's local time), user-configurable in Settings → Notifications. No push notifications during this window; in-app messages are still written.
   - User's timezone is stored on the `users` record and applied to all scheduling
   - Notification preferences: if user has disabled push, the in-app message is still written but no push is sent

2. **User behaviour window** — learned from session open times and activity timestamps over the last 8 weeks. If the user consistently opens the app between 7:30–8:30am, that is the preferred window.

3. **Persona default window** — applied as a soft modifier within the user behaviour window, or as the fallback when insufficient behaviour data exists:

| Coach | Natural window | Character reasoning |
|---|---|---|
| Ben | 7–9am | Morning person, practical |
| Rob | 7–9am or 12–1pm | Working hours rhythm |
| Fiona | 8–10am | Gets on with things in the morning |
| Priya | 7–9pm | Reflective, evening lean |
| Margaret | 6–8pm | Unhurried evenings |
| Tom | 7–9am | Up early, walks in the morning |

**If the action fires within the send window:** send now.

**If the action fires outside the send window:** queue the message and send at the start of the next valid window. The message is pre-generated at queue time so there is no generation delay when the window opens.

---

### OneSignal integration

OneSignal handles push delivery. From Convex, it is a single HTTP POST to the OneSignal REST API from within the action that generates and dispatches the message.

**Setup:**
- `onesignal_player_id` stored on the `users` table, written during app initialisation (Flutter SDK registers the device and the ID is sent to Convex via a mutation)
- OneSignal REST API key stored as a Convex environment variable — never in the Flutter client
- OneSignal app ID stored as a Convex environment variable

**What is generated and when:**

The proactive pipeline generates two things in a single LLM pass:

```
push_copy:    Short, in persona voice. 1–2 sentences. Designed to earn the tap.
              "Saw you got a run in this morning. How'd it go?"

in_app_msg:   Full coach message, written to the messages table immediately.
              Waiting in the thread the moment the user taps through.
              No generation delay on open.
```

Both are written at generation time, not on app open. The push notification is dispatched to OneSignal; the in-app message sits in the thread with `role: assistant`.

**Fallback when push is disabled:**
The in-app message is still written to the thread. A badge count or unread indicator on the coach tab handles discoverability within the app.

**Response tracking via OneSignal webhook:**

OneSignal can POST a delivery/open event to a Convex HTTP action endpoint. This closes the loop on `coach_triggers.user_responded`:

```
OneSignal open event
  → Convex HTTP action (/onesignal-webhook)
  → Find coach_triggers record by message_id or external_id
  → Set user_responded: true, responded_at: now
```

---

### Full trigger lifecycle: worked example

Apple Health detects a 35-minute run at 7:15am:

```
07:15  HealthKit sync action runs
       → Creates activity record
           source: apple_health, acknowledged_by_coach: false
       → ctx.scheduler.runAfter(30 * 60 * 1000, "acknowledgeActivity", {
           activityId, userId
         })

07:45  Scheduled action fires
       → Re-evaluate: still unacknowledged? notifications on?
         last outreach >20hr ago? → all clear

       → Determine send window
         User typically opens app 7:30–8:30am
         Coach is Ben (7–9am window)
         Current time 7:45am — within both windows → send now

       → Assemble context (persona + user state + signals)

       → Generate (single LLM call):
         push_copy:   "Saw you got a run in this morning. How'd it go?"
         in_app_msg:  "Saw you got a run in earlier. Good effort —
                       how did it feel?"

       → Write message to messages table (role: assistant)
       → POST to OneSignal REST API
       → Write coach_triggers record
       → Update user_coach_state.last_coach_outreach_at
       → Set activity.acknowledged_by_coach: true

08:12  User taps push notification, opens app
       → OneSignal open webhook fires
       → coach_triggers.user_responded = true
       → User sees in-app message already waiting; replies
       → Reactive pipeline fires as normal
```

---

### Mechanism summary

| Component | Technology | Role |
|---|---|---|
| Per-user scheduling | Convex `ctx.scheduler.runAfter/runAt` | Primary trigger engine |
| Daily housekeeping | Convex `cron` (once at 6am UTC) | Safety net, not primary |
| Push delivery | OneSignal REST API | Called from Convex action |
| Response tracking | OneSignal webhook → Convex HTTP action | Closes `coach_triggers` loop |
| In-app message | Convex `messages` table | Pre-written at generation time |

---

## Context Assembly Detail

### What goes into the prompt, in order

```
[PERSONA BLOCK]
Name, age, personality summary, voice rules, sample lines, don't-list.
~500–700 words. Static per coach; cached.

[USER CONTEXT]
Current mode and what it means for tone.
Active memory facts (all active, sorted by recency of last_used_at, capped ~800 tokens).
Active goals (description + status).
Days since last activity, current streak.
App tenure, lapse history (e.g. "this is their third return after a gap").
Signal summary — last 7 days (see format below).

[KNOWLEDGE CONTEXT]  — only if classification = knowledge question
Top 3 wiki articles retrieved by semantic search.
Each article: title + body (trimmed to ~400 tokens each).
Instruction: "Use this as grounding. Do not cite directly unless asked. Express in your voice."

[CONVERSATION INSTRUCTIONS]
Standard: ask one question, not three; acknowledge before advising;
don't count or compare; don't reference goals unless user raises them first; etc.
Mode-specific overlays (e.g. in returning mode: "warmth first, don't mention fitness").
Signal-specific overlays if relevant (e.g. "user has been consistently tired —
do not suggest increased frequency; keep bar low").

[RECENT HISTORY]
Last 10–20 turns from the current thread.
Older history is in the database but not in the prompt.

[CURRENT USER MESSAGE]
```

### Signal summary format

The signals summary is a compact natural language digest computed at context assembly time. Raw rows are never injected — this computed summary is what enters the prompt.

```
Recent signals (last 7 days):
Energy: generally low — reported low 4 of 5 sessions this week
Mood: improving — was low earlier in the week, higher yesterday
Sleep: poor (avg 5.5 hrs via HealthKit)
Soreness: leg soreness reported Tuesday; no further mention since Thursday

Longer-term pattern (last 30 days, if present):
Mood tends to be higher on days following activity. Energy trending upward
from a low baseline in early April.
```

This block stays under ~200 tokens. If no signals exist yet, it is omitted entirely.

### Token budget (approximate)

| Block | Tokens |
|---|---|
| Persona | 700 |
| User context (memory + goals + mode) | 500 |
| Signal summary | 200 |
| Knowledge context (when used) | 1,400 |
| Conversation instructions | 300 |
| Recent history (20 turns) | 2,000 |
| Current message | 200 |
| **Total (with wiki)** | **~5,300** |
| **Total (without wiki)** | **~3,900** |

Well within Sonnet's context window. Cost is manageable even at scale.

---

## Extraction Design

Extraction runs as a Convex background action after each coach response is delivered. It is not on the critical path — the user gets their response first.

The extraction call returns three arrays from a single LLM call (Haiku):

```json
{
  "facts": [...],      // → knowledge_fact, scope=user (high durability filter)
  "signals": [...],    // → user_signals (low filter)
  "activities": [...], // → activities (if not already captured by health sync)
  "goals": [...]       // → user_goals
}
```

### Facts extraction (high durability filter)

Extract only if: durable (relevant in months, not just today), personal to this user, actionable by a coach, and not already in memory.

See the extraction prompt design in the separate prompt engineering notes.

### Signal extraction (low filter)

Extract any expression of how the user is feeling — mood, energy, stress, sleep, soreness, motivation. The filter is permissive: if they mentioned it, capture it.

Prompt instruction for signals:
```
Extract any signals about the user's current or recent state.
Include: mood, energy, tiredness, stress, sleep quality, soreness, motivation.
These are time-series data points — capture everything, even if transient.
Use value_raw to preserve the exact phrase used.
Set recorded_at to when the state applied, not when the message was sent,
if the user is speaking in past tense with a specific time reference.
```

### What the extractor does NOT capture as signals

- Activities themselves (those go to the activities table)
- Future intentions ("I'm planning to go for a walk") — not a signal
- Generic complaints with no personal state content ("the weather is terrible")

### Handling updates and resolutions in memory

If the user's message suggests an existing memory fact has changed:
- `action: update` — fact is still true but the description needs updating
- `action: resolve` — a barrier or condition has improved or gone away

Example: existing memory has `bad_left_knee`. User says "my knee has been great lately actually." Extractor returns:
```json
{
  "action": "resolve",
  "updates_key": "bad_left_knee",
  "value": "User reports knee has been feeling better recently",
  "confidence": "medium"
}
```
This sets `status: resolved` on the existing record. The original fact is preserved for audit purposes.

### Output validation before writing

- `key` must be snake_case and non-empty
- `category` must be one of five valid values
- `confidence` must be one of three valid values
- `action: update` or `resolve` must reference a key that exists in memory
- Signal `value_numeric` must be 1–5 if present
- Any `value` over 200 characters is trimmed

---

## Mode Computation

Recomputed after every activity write and every extraction run.

```
days_since_last_activity = now - most_recent_activity.started_at (in days)
activities_last_7_days   = count of activities in last 7 days
streak_days              = longest current consecutive-day run (activity on each calendar day)

MODE RULES (evaluated in order):
  if streak_days >= 14 AND activities_last_7_days >= 3  → flow
  if days_since_last_activity <= 7 AND activities_last_7_days >= 2  → momentum
  if days_since_last_activity is 3–7  → recovery
  if days_since_last_activity > 7  → returning
  default  → momentum
```

---

## Phase C blockers — designed

The three gaps below were identified as Phase C blockers in the doc audit (2026-04-25). Each has been designed in enough detail to build to. They are the spec; the four "Outstanding" gaps further down the doc remain open.

---

### Thread model — per-session threads (was GAP 7)

**Decision:** per-session threads. Cross-session continuity comes from `knowledge_fact` and `user_coach_state`, not raw conversation history.

**When a new `threads` row is created:**

1. The user opens the chat after >2 hours of inactivity in the current thread (session boundary detected on app open)
2. The user explicitly starts a new conversation (rare; low-discoverability action accessed from the chat header overflow menu)
3. The coach proactively reaches out (the proactive message creates the new thread the user lands in)

**Schema:**

```typescript
threads {
  _id, organisation_id, user_id,
  coach_id,                   // which persona authored this thread
  thread_kind: "first_contact" | "ongoing" | "proactive",
  created_at, ended_at?,
  last_message_at, message_count,
}
```

The current thread for a user is `threads.byUserCoach(userId, coachId).latest()` where `ended_at` is null.

**Recent history block** (the prompt includes only the current session's turns):
- Last 10–20 turns from `messages` where `thread_id = current.thread_id`
- If the current thread has fewer than 10 turns and was opened within the same calendar day as a prior thread, the previous thread's last few turns may be appended (configurable; v1 default off — clean session boundaries)

**Coach switching** ends the current thread (sets `ended_at`) and starts a new thread under the new coach. Old threads remain in storage indefinitely for export/review; the new coach does not load them.

**Storage growth** is bounded by per-user activity. Convex handles indefinite growth fine; we don't truncate v1. If post-launch we observe extreme growth (a single power user with thousands of threads), we add an archival tier.

---

### Cold start — first contact (was GAP 1)

**Decision:** The user's first ~7 days OR first 5 sessions (whichever ends first) is one continuous `thread_kind: "first_contact"` thread. After that boundary, the per-session model kicks in.

**Why a continuous thread for cold start:** the second session needs to feel like a continuation of the first, not a stranger meeting. The structured memory layer is sparse at this stage; the raw recent history carries more weight. A per-session model from minute one would produce a coach that "forgot" what the user said yesterday.

**First-message structure (Turn 1):** fixed shape, persona-specific wording. Always:
- A warm self-introduction
- Explicit no-pressure framing
- One open question

The persona doc § "Openings" is canon for the wording. Examples already drafted there (Margaret: *"Hey. I'm Margaret. Really glad you're here. No agenda today — just want to say hi. How are you, generally?"*).

**Cold-start agenda — opportunistic context capture.**

The coach maintains an internal agenda of context items it's trying to gather. Each item is the absence of a fact in `knowledge_fact` (user scope) or an `unknown` slot in `user_profile_slots`. The coach is not scripted; it surfaces agenda items when the conversation naturally allows.

| Agenda item | Mechanism | Rough timing |
|---|---|---|
| How they're feeling about getting started | Conversation; no widget | Turn 1–3 |
| Year of birth | W-15 widget | Session 2 or 3 |
| Gender | W-16 widget (separate message from W-15; never both in the same turn) | Session 2 or 3 |
| Anything they've tried before | Extracted from natural conversation | Week 1 |
| Anything they're avoiding or struggling with | Extracted; barriers go to `knowledge_fact` with `category: "barrier"` | Week 1 |
| Any injuries or health constraints | Extracted; go to `knowledge_fact` with `category: "barrier"` | Week 1 |
| What a good outcome looks like for them | Captured to `user_goals` with `type: "general"` | Week 1–2 |

**Discipline:**
- At most one agenda question per turn
- Never two logistics questions in a row
- Always respond to what the user just said before introducing a new question
- A declined question (W-15/W-16 dismissed, or topic deflected in conversation) sets the slot to `declined` and never resurfaces in cold start (can be revisited weeks later if the user's responses suggest it'd help)

**Health connection (W-17) and notification permission (W-18) are NOT in session 1.** Earliest is session 3, or after the user has manually mentioned an activity. The frame is "so I can notice things you don't mention" — never "so we can track you."

**Minimum viable context — by end of week 1 the coach should have:**
- Year of birth (or `declined`)
- Gender (or `declined`)
- At least one barrier or one preference in `knowledge_fact`
- At least one general goal in `user_goals`

If still missing by end of week 1, the coach proceeds without. Never blocks. The product cannot make the user perform onboarding.

**Boundary out of cold start:** the `first_contact` thread closes at day 7 OR session 5 (whichever first). The next session opens a fresh `thread_kind: "ongoing"` thread. The coach's first message in the first ongoing thread acknowledges the transition implicitly ("Hey. Good to see you again.") without making it a thing.

**Practitioner-referred and enterprise-onboarded users (v3, v4):** cold-start agenda gets two additional items added at the top — confirm the affiliate relationship is welcome, surface the consent screen if not already done. Otherwise the structure is the same.

---

### Safety guardrails — defined response system (was GAP 2)

**Decision:** Five safety scenario categories, each with a defined response pattern, classifier-detected, logged, and where appropriate flagged for human review.

#### Categories and response patterns

**A. Acute physical** — chest pain, severe injury, signs of stroke, fainting, anything warranting emergency services.

- Coach response: immediate concern, recommend emergency services (000 in AU; equivalent per locale) or call a doctor now. Do not attempt to assess severity. Do not offer "wait and see" framing.
- Persona-consistent canonical message — the warmth differs but the substance is identical across all six. Sample lines drafted in `docs/twikka_coach_personas.md` § "Safety responses" (to be added).
- Logged: `coach_triggers` with `trigger_type: "safety_acute_physical"`. Tool: `flag_for_human_review` with priority `immediate`. SLA: review within hours.
- Coach does not continue the conversation about exercise until the user confirms they are safe / have sought help.

**B. Clinical-edge** — chronic condition questions, medication queries, symptoms suggesting needed medical attention but not acute.

- Coach response: acknowledges the concern, does not provide medical advice or diagnosis, suggests speaking to a GP or specialist.
- v3+: surfaces the practitioner directory (W-22) if frequency cap allows (see `docs/memory/reference_coach_character_system.md` § W-22 discipline).
- Logged: `coach_triggers` with `trigger_type: "safety_clinical_edge"`. Human review SLA: 48 hours.

**C. Emotional / mental health — non-acute distress.**

- Coach response: warmth and concern, stays in conversation, does not pivot to "you should see a therapist" on first occurrence.
- If a pattern emerges (multiple `signal_type: "mood"` rows at low across consecutive sessions), the coach can gently raise the option of speaking to someone professional, in voice.
- Logged: `coach_triggers` with `trigger_type: "safety_emotional_chronic"` (no immediate review, but cumulative tracking).

**D. Emotional / mental health — acute crisis** — suicidal ideation, self-harm intention, crisis signals.

- Coach response: provides crisis resources directly (Lifeline 13 11 14 for AU; equivalents per locale to be tabled). Does not attempt therapy. Does not minimise. Does not require the user to ask for help — surfaces the resource explicitly.
- Logged: `coach_triggers` with `trigger_type: "safety_emotional_acute"`. Tool: `flag_for_human_review` with priority `immediate`. SLA: review within hours.
- The coach can continue the conversation if the user wants to keep talking, but never tries to provide therapy.

**E. Disordered pattern** — disordered eating signals, exercise obsession, "earning food" framing, distress about missed days, compulsive engagement.

- Coach response: does not enable, does not lecture, uses curiosity ("I notice you've been pretty hard on yourself about the days you didn't move — what's that about?").
- Pattern detection: signals + activity frequency + extracted phrase patterns. Threshold tuning happens during Phase C QA.
- Logged: `coach_triggers` with `trigger_type: "safety_disordered_pattern"`. Human review SLA: 48 hours.

#### Detection mechanism

Classifier-based, not keyword matching. The classifier runs on every user message as part of the existing per-turn classify step (see § Reactive pipeline). Adds a `safety_category` field to the classification output:

```json
{
  "intent": "emotional / activity_report / knowledge_question / ...",
  "safety_category": "acute_physical | clinical_edge | emotional_acute | emotional_chronic | disordered_pattern | none",
  "confidence": 0.0–1.0
}
```

If `safety_category != "none"` and `confidence > 0.7`, the response generation step uses the safety-category-specific instruction in addition to the persona prompt. The safety instruction is canonical; the voice is persona-specific.

#### Logging and review

Every safety-categorised turn writes:
- A `messages` row (the coach response, as normal)
- A `coach_triggers` row with `trigger_type: "safety_*"` and `message_id` reference
- For categories A and D, an `audit_log` row with action `safety.flagged` and full context

A separate ops dashboard (built post-v1) consumes the `coach_triggers` queue. v1 ships with the data plumbed but the review surface is a manual Convex query for the operator on call.

#### Practitioner directory surfacing threshold (v3 W-22)

W-22 surfaces when:
- User has had 2+ Category B safety responses in a 28-day window, AND
- User has not declined the directory in the last 60 days, AND
- The W-22 28-day frequency cap (see `docs/memory/reference_coach_character_system.md`) allows

Per-persona W-22 sample lines already in the persona doc.

#### Persona consistency

The safety substance is the same across all six personas. The voice is per-persona — Rob delivers a clinical-edge deflection differently to Margaret. Per-persona safety calibration lines need to be added to `docs/twikka_coach_personas.md` (currently it has the AI-disclosure responses and the W-22 cross-sell lines; safety responses are the missing piece). This is content work to be done during Phase C alongside prompt engineering.

---

## Outstanding gaps

The following gaps are not Phase C blockers — they can be drafted during Phase C and tuned with usage. Each still needs a dedicated spec before the behaviour they govern goes live.

---

### GAP 3 — Knowledge/persona synthesis

**What's missing:** The current instruction for wiki-grounded responses is "use this as grounding, express in your voice." That's correct but underspecified. The same exercise science fact sounds completely different across the six personas, and the prompt engineering for knowledge questions needs to make this concrete.

**Why it matters:** Without per-persona synthesis guidance, knowledge questions will produce responses that are factually grounded but tonally inconsistent — the information sounds like a textbook article with a thin coat of persona paint over it. Getting this wrong is subtle but cumulative; users will feel the coach is less "real" without being able to say why.

**What needs to be designed:**
- Per-persona synthesis style guide for knowledge content: how each coach translates a factual claim into their own voice
- Concrete calibration examples: the same wiki article expressed through each of the six coaches
- Instruction for how much detail is appropriate per coach (Tom gives you one sentence; Priya might give you context and a question; Fiona gives you the headline and moves on)
- Rules for when the coach should share knowledge unprompted vs waiting to be asked
- How the coach signals appropriate uncertainty without undermining its usefulness ("I'm not certain on this one, but...")

---

### GAP 4 — Long-term relationship arc

**What's missing:** The doc has `app_tenure_days` and `lapse_count` in `user_coach_state` but no guidance on how the coach's approach changes as the relationship matures. Every user gets the same posture regardless of whether they're in week one or month eighteen.

**Why it matters:** One of the product's core promises is a coach that knows you. That should feel true at month twelve in a way that is qualitatively different from week one. Early on the coach is exploratory and careful; a year in it can reference shared history, note real change across time, speak with genuine familiarity. Without this arc, long-term users will feel stuck in a perpetual first-date dynamic.

**What needs to be designed:**
- Relationship stages keyed to tenure and interaction depth (not just time — a user who messages daily is in a different place than one who messages monthly)
- Per-stage coach posture adjustments: what changes in tone, familiarity, willingness to gently challenge
- How and when the coach can reference shared history ("I remember when you said...", "a few months ago you were struggling with...")
- How the prompt instructions change across stages
- Whether relationship stage is stored explicitly (a field) or inferred from tenure + session count at assembly time

---

### GAP 5 — Coach switching

**What's missing:** Users can change coaches. The data structures (memory, signals, goals, activities) are all user-level and transfer automatically. But there is no handoff pattern for the new coach's first conversation, and no guidance on how the new coach is briefed on who this person is.

**Why it matters:** Done badly, a coach switch feels jarring — either the new coach acts like it knows nothing (ignoring all the context that was built), or it recites facts in a way that feels like it's reading from a file ("I see you have a bad knee and prefer mornings"). Neither is right.

**What needs to be designed:**
- The new coach's first message: what it says, how it establishes itself without pretending the history doesn't exist
- How the new coach's system prompt is briefed on existing memory without it reading like a medical handover
- Whether coach switches reset the conversation thread or continue in the same thread
- Whether the old coach's conversation history is visible to the new coach (probably not — the memory layer is the handoff mechanism, not the raw history)
- Handling the case where a user switches back to a previous coach

---

### GAP 6 — Activity suggestion logic

**What's missing:** The coach can suggest activities, but there is no defined pattern for how it formulates them. The wiki has exercise programming knowledge; the user has mode, goals, barriers, signals, and activity history. How these combine into a specific, appropriate, persona-voiced suggestion is not specified.

**Why it matters:** Generic suggestions ("go for a walk") are low-value. A coach that knows this user is in `returning` mode, has a bad knee, reported low energy yesterday, and last walked on Tuesday should suggest something specific and calibrated — not just "how about some exercise today." Getting this right is one of the coach's most visible behaviours.

**What needs to be designed:**
- The inputs that shape a suggestion: mode, barriers, recent activity pattern, current signals, goals, time of day, weather reference
- How the wiki grounds the suggestion (e.g., deload principles for a user who's been going hard; low-impact options for a user with joint issues)
- Suggestion specificity levels by coach: Tom gives you one sentence; Fiona might give you a specific option; Ben might offer two and let you pick
- Frequency limits: how often the coach makes an unsolicited suggestion vs waiting to be asked
- How the coach tracks what it's already suggested (already in `recent_suggestions` in `user_coach_state`) to avoid repetition

---

## Relationship to Other Docs

| Document | Relationship |
|---|---|
| `twikka_coach_personas.md` | Defines the persona blocks injected into the prompt. This doc defines when and how they're assembled. |
| `twikka-wiki-design.md` | Defines the wiki schema and retrieval layer. This doc defines when wiki content is retrieved (knowledge question classification) and how it slots into the prompt. |
| `04-build-plan.md` | Phase C is where the coach goes live. This doc is the spec that Phase C builds to. |

---

*End of coach interaction design.*
