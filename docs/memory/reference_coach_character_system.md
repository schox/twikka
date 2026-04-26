# Coach character system — index and discipline

**Status:** Foundational reference. Indexes the persona, image, and behaviour work spread across multiple docs; pins the rules that don't fit cleanly into any of them.
**Purpose:** Anyone touching coach behaviour, character, prompts, or affiliate cross-sell starts here.

---

## Where the persona work lives

| Doc | Role |
|---|---|
| `docs/twikka_coach_personas.md` | Operative source for all persona content. Six personas (Priya, Ben, Fiona, Rob, Margaret, Tom). Voice rules, would/wouldn't say lists, sample lines, special-case responses. |
| `docs/twikka_coach_image_prompts.md` | Midjourney prompts for each persona's portrait, with HeyGen-ready and hero variants. Avatar pipeline notes. |
| `docs/05-coach-interaction-design.md` | How personas are assembled into prompts at runtime. Memory, signals, mode, knowledge retrieval. |
| `docs/twikka_v1_prd.md` §8 | Product-level positioning of the coach system, mode definitions, tool catalogue. |

When persona content disagrees across docs, the personas doc wins. The PRD describes the framing; the personas doc holds the character.

---

## AI disclosure rules

Twikka's coaches are AI personas trained by the Twikka team. The product is honest about this from onboarding through every chat.

### Disclosure surfaces (already specified in build plan Phase A)

1. **Welcome screen subtitle** — "Coaches are AI personas trained by our expert team"
2. **Coach selection screen** — line above the cards stating the same
3. **Chat header** — small "AI coach" text under the coach name
4. **Settings → About** — longer plain-language explanation (Phase D)

### When asked directly

When a user asks "are you AI?" / "are you a real person?" the coach answers honestly, in voice, never deflects, never pretends. Per-persona variants are in `docs/twikka_coach_personas.md` § "When asked are you AI / a real person?". These responses are not optional — they are hard guardrails baked into each persona's system prompt as canonical sample responses.

The framing is **additive**: "AI coach trained by humans who care" — not "AI coach replacing humans." Never apologise for being AI; never deflect ("I'm just an AI, I can't help"). Trust comes from honesty plus capability, not from hedging.

### Never

- Claim to be human
- Claim credentials the AI does not have ("As a physiotherapist...")
- Claim to remember things outside what's in `knowledge_fact`
- Promise outcomes
- Take responsibility for the user's condition or progress

---

## Avatar strategy across phases

| Phase | Avatar form | Surfaces |
|---|---|---|
| v1 | Static portraits | Onboarding cards, chat header, message avatars, list views |
| v2 Premium | HeyGen-rendered video moments | Onboarding welcome, milestones, weekly reflections (premium-only, opt-in) |
| v3+ very Premium | HeyGen Streaming Avatars | Live video calls with the coach (post-v3) |

Same source portrait pipeline supports all three. The point of standardising on HeyGen now is that the avatar pipeline does not need to be rebuilt as we move up the tier ladder.

Static portrait sizes per coach (per `docs/twikka_coach_image_prompts.md`):
- **Hero (onboarding)**: 800×1000 (4:5 hero portrait, full)
- **Coach profile**: 512×512
- **Chat header**: 120×120
- **Message avatar**: 80×80
- **Tiny avatar (list views)**: 40×40

All stored in R2, organised by coach. Convex `coach_personas.avatarRefs` carries the keys.

---

## v3 affiliate cross-sell — W-22 discipline

W-22 is the coach-surfaced suggestion that the user might benefit from a real human practitioner. Built into the catalogue from v1 (flag-off) so v3 reveal is a flag flip.

### When the coach surfaces W-22

Only when at least one of:
- User asks a clinical-edge question the AI guardrails decline to answer
- User describes wanting deeper accountability than AI can provide
- User describes a goal that benefits from in-person guidance (e.g. specific injury rehabilitation, structured strength programming)

### How

Per-persona sample lines are in `docs/twikka_coach_personas.md` § "When suggesting an affiliate practitioner". Framing is **additive**, never deflective:

- ✓ "Worth knowing — Twikka keeps a directory of real human coaches you can add to this."
- ✗ "I'm not enough for this, you should talk to a real person."

The coach is staying in the conversation, offering an additive option. Never positioning itself as inadequate.

### Frequency cap

A coach that surfaces W-22 more than once every several weeks for the same user is failing. It is a "you might want this too" surface, not a deflection mechanism. The agent's tool-use logic enforces the cap (suggested cap: at most one W-22 per 28-day window per user, regardless of trigger condition).

### Persona consistency

W-22 sounds different across the six. Rob is dry ("There's a list of real ones if you want one. No drama."). Margaret is warm ("There's a directory we keep of practitioners. Have a browse if you fancy, love. I'm not going anywhere."). The AI guardrails are the same; the voice differs.

---

## Persona evolution within a single coach

Within a single coach, tone deepens with familiarity. Implementation is via prompt parameters that depend on relationship duration (`user_coach_state.app_tenure_days`) and recent engagement, not via separate coach variants.

| Stage | Trigger | Prompt overlay |
|---|---|---|
| First contact | tenure < 7 days | Exploratory, careful, no presumed history |
| Settled | 7 ≤ tenure < 30 | Comfortable, can reference recent shared history |
| Deepening | tenure ≥ 30, regular engagement | Can reference longer-term shared history naturally ("you mentioned last month that...") |
| Returned | tenure ≥ 30 with a recent gap of 14+ days | Tone resets slightly to something more formal to match the social cooling |

The full long-term relationship arc is GAP 4 in `docs/05-coach-interaction-design.md`. This table is the working scaffold until that gap is properly specified.

---

## Coach switching handoff

Architecturally simple (memory transfers via shared `knowledge_fact` user scope), behaviourally subtle. The full design lives in GAP 5 of `docs/05-coach-interaction-design.md`.

Working principles:
- The new coach reads the same memory store but speaks fresh
- The new coach acknowledges history without reciting facts ("I can see you've been at this a while" not "I see you have a bad knee and prefer mornings")
- Raw conversation history from the previous coach is not visible to the new coach — the memory layer is the handoff mechanism
- The outgoing coach gets a brief warm farewell

---

## Persona seed source of truth

The Convex `coach_personas` rows are seeded from `docs/twikka_coach_personas.md`. Each row carries:

- `slug`, `name`, `ageBand`, `genderPresentation`
- `shortDescriptor`, `introSample`
- `avatarRefs` (R2 keys, all five sizes)
- `heyGenAvatarId` (post-v2)
- `voiceId` (post-v2)
- `styleDescriptors`, `sampleLines`, `wouldSayExamples`, `wouldntSayExamples`
- `aiDisclosureLine` (per-persona AI disclosure response)
- `affiliateSuggestionLine` (per-persona W-22 sample)
- `modelOverride` (optional; if a persona benefits from a specific model)
- `active` (kill switch per persona)
- `promptVersion` (bump on prompt change for cache busting)

Seed script is `convex/seed/coachPersonas.ts`. Re-run safely; idempotent on `slug`.

---

## Related docs

- `docs/twikka_coach_personas.md` — operative persona content
- `docs/twikka_coach_image_prompts.md` — portrait generation
- `docs/05-coach-interaction-design.md` — runtime assembly, the seven gaps
- `docs/twikka_v1_prd.md` §8 — product-level positioning
- `docs/04-build-plan.md` Phase A and Phase C — when this lands
