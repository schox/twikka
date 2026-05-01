# Twikka — AI Coaching App: Wiki & Knowledge Architecture

## Overview

Twikka is an AI health/lifestyle/fitness coaching app focused on sustainably increasing physical activity. The core product thesis is **behaviour change and adherence** — exercise science knowledge is the supporting substrate, not the product itself. Six coach personas with distinct demographics and personalities deliver coaching via an LLM (Claude Sonnet).

---

## Knowledge Architecture: LLM Wiki Pattern

### Concept

Based on Andrej Karpathy's April 2026 LLM Wiki pattern. Instead of standard RAG (rediscovering knowledge from raw documents on every query), knowledge is **compiled once** into a structured, interlinked wiki of markdown articles. The wiki is a persistent, compounding artefact — cross-references pre-built, contradictions pre-flagged, synthesis already done.

**The compilation analogy:** RAG executes source code on every request. The wiki compiles it once and queries the artefact.

### Why Hybrid (Wiki + RAG)

- **Wiki layer** — stable conceptual backbone: training principles, exercise taxonomy, energy systems, behaviour change constructs. Compile once, query forever.
- **RAG layer** — raw source documents (papers, ACSM guidelines, NSCA standards) for precise, citation-grounded claims.
- **Semantic search** — sits across both layers; navigates wiki index and retrieves RAG chunks.

### Scale Limits

Pure wiki (single context) works up to ~50,000–100,000 tokens (~150–200 pages). Beyond that, selective page loading or semantic search layer required.

---

## Data Architecture

### Storage

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Wiki articles, index, taxonomy, citations, audit | Convex | FTS, reactive queries, relational |
| Source documents (PDFs, papers, guidelines) | Cloudflare R2 | Object storage, keyed by source record ID |
| Optional snapshots | R2 | Periodic markdown exports for offline use |

---

## Convex Schema

### `wiki_sources`

```typescript
{
  _id: Id<"wiki_sources">,
  slug: string,
  title: string,
  authors: string[],
  year: number,
  type: "textbook" | "guideline" | "rct" | "meta-analysis" | "review" | "position-statement" | "book",
  r2_key: string | null,
  doi: string | null,
  url: string | null,
  entered_by: "human" | "llm",
  notes: string | null,
}
```

### `wiki_articles`

```typescript
{
  _id: Id<"wiki_articles">,
  slug: string,
  title: string,
  body: string,                          // markdown; citations as ^[{source_id},{source_id}]
  tags: string[],
  related_article_ids: Id<"wiki_articles">[],
  confidence: "high" | "moderate" | "low" | "contested",
  reviewed_by: "human" | "llm-compiled" | "llm-audited",
  last_reviewed_at: number,
  reviewed_by_user: Id<"users"> | null,
  visible_to_users: boolean,             // safety gate for health context
  created_at: number,
  updated_at: number,
}
```

### `wiki_citations` (junction table)

```typescript
{
  _id: Id<"wiki_citations">,
  article_id: Id<"wiki_articles">,
  source_id: Id<"wiki_sources">,
  location_in_source: string | null,     // "p.142", "ch.7", "finding:2"
  assertion_excerpt: string,
  assertion_anchor: string,
  added_by: "human" | "llm",
}
```

### `wiki_index`

```typescript
{
  _id: Id<"wiki_index">,
  article_id: Id<"wiki_articles">,
  slug: string,
  title: string,
  summary: string,                       // 2-3 sentence précis, LLM-generated
  tags: string[],
  concept_aliases: string[],             // e.g. ["DOMS", "delayed onset muscle soreness"]
  related_slugs: string[],
}
```

FTS runs against `title`, `summary`, `tags`, `concept_aliases`. Aliases solve the cross-cutting problem without requiring multiple parents in the taxonomy tree.

### `wiki_taxonomy_nodes`

```typescript
{
  _id: Id<"wiki_taxonomy_nodes">,
  level: "topic" | "subtopic" | "item",
  label: string,
  parent_id: Id<"wiki_taxonomy_nodes"> | null,
  article_id: Id<"wiki_articles"> | null,  // null = outstanding content backlog
  domain: "behaviour-change" | "exercise-science",
  sort_order: number,
}
```

### `wiki_audit_runs` and `wiki_audit_flags`

```typescript
// wiki_audit_flags
{
  _id: Id<"wiki_audit_flags">,
  audit_run_id: Id<"wiki_audit_runs">,
  article_id: Id<"wiki_articles">,
  citation_id: Id<"wiki_citations"> | null,
  severity: "superseded" | "contested" | "unsupported" | "overstated",
  description: string,
  status: "open" | "resolved" | "dismissed",
  resolved_at: number | null,
  resolved_by: Id<"users"> | null,
}
```

### `coach_interactions` (analytics + wiki prioritisation)

```typescript
{
  _id: Id<"coach_interactions">,
  session_id: string,
  user_id: Id<"users"> | null,
  coach_id: string,
  query: string,
  response: string,
  model: string,
  wiki_articles_used: Id<"wiki_articles">[],   // empty until wiki lands

  // user signals
  thumbs_up: boolean | null,
  flagged: boolean,

  // async LLM classification
  topic_tags: string[],
  confidence_signal: "hedged" | "direct" | "unknown",
  needs_wiki: boolean,

  created_at: number,
}
```

`confidence_signal` is populated by an async background action that detects hedged language ("it depends," "generally speaking") as a proxy for soft priors — these cluster into the first wiki sprint priorities.

---

## Inline Citation Format

Citations in article body reference Convex `_id` directly:

```markdown
Progressive overload is the foundational principle of all resistance
training programming.^[2j7x9k4m8n3p]

Load progression is not always linear.^[5r2w6v1q9m4t,8h3n7j2k5p9x]
```

The wiki web app resolves IDs to full source metadata on render (hover tooltip or footnote list). The audit agent queries `wiki_citations` by `article_id` — does not parse the body.

---

## Article Format

```markdown
---
title: Progressive Overload
last_reviewed: 2026-04-15
reviewed_by: human
confidence: high
tags: [training-principles, strength, hypertrophy]
related: [periodisation-types, recovery-and-adaptation, rpe-based-programming]
---

## Definition

Progressive overload is the systematic increase of training stimulus over
time to drive continued physiological adaptation.^[2j7x9k4m8n3p]

## Audit Notes
_Last audit: 2026-03-01 | Status: clean_
```

---

## Audit Process

Periodic traversal (monthly once corpus is established):

1. Extract all `^[id]` citations from article body
2. Resolve each ID against `wiki_sources`
3. Load source from R2 (PDF chunk) or URL fetch
4. For each assertion-citation pair, ask LLM: does the source support this claim? Flag if unsupported, overstated, contradicted, or superseded
5. Write findings to `wiki_audit_flags`
6. Update `last_reviewed_at` on article

Severity levels: `superseded` | `contested` | `unsupported` | `overstated`

---

## Topic Taxonomy

### Two Domains, One Tree Structure

| Domain | Role |
|--------|------|
| Behaviour Change | Product's intellectual core — drives coaching logic |
| Exercise Science | Reference substrate — makes advice credible and accurate |

Both use the same three-level hierarchy: **topic → subtopic → item**

### Behaviour Change Taxonomy

Already exists as a several-hundred-term structured dataset with self-referencing FK (top-level topics have null parent). Three levels enforced consistently — straight migration to Convex with no structural changes.

Cross-cutting relationships (e.g. Self-Efficacy under both Motivational Constructs and Barrier Management) handled by **tags and aliases** rather than multiple parents. This avoids DAG complexity while solving the practical query and discovery problem.

### Exercise Science Taxonomy (first-pass)

```
Training Principles
  Overload & Adaptation, Specificity (SAID), Progressive Overload,
  Reversibility, Individualisation, Recovery & Supercompensation

Exercise Programming
  Periodisation (Linear, DUP/WUP, Block), Volume/Intensity/Load Management,
  Deload Protocols, Exercise Selection & Order, Warm-up & Cool-down

Energy Systems & Physiology
  ATP-PCr, Glycolytic, Oxidative, VO2max, Lactate Threshold, Fat Oxidation

Strength & Resistance Training
  Hypertrophy Mechanisms, Strength vs Power, Rep Ranges, Tempo/TUT,
  RPE & Autoregulation, Bodyweight & Loaded Progressions

Cardiovascular & Endurance Training
  Zone Training (2/5 models), HIIT & SIT, Steady-State,
  Concurrent Training, Cardiac Adaptations

Flexibility, Mobility & Movement
  Static vs Dynamic Stretching, Mobility vs Stability,
  Fascial Considerations, Functional Movement Patterns

Recovery & Regeneration
  Sleep & Performance, Active Recovery, Cold/Heat Therapy,
  HRV Monitoring, Overtraining & Overreaching

Nutrition for Performance
  Macronutrient Timing, Protein Requirements, Carbohydrate Periodisation,
  Hydration, Supplementation (evidence-based)

Special Populations
  Older Adults, Deconditioned/Sedentary, Post-rehabilitation,
  Pregnancy & Postnatal, Chronic Disease (T2D, CVD, obesity)

Behaviour Change & Adherence
  [Covered by existing behaviour change taxonomy]

Injury Prevention & Load Monitoring
  Acute:Chronic Workload Ratio, Common Overuse Injuries,
  Screening & Movement Assessment, Return to Activity Guidelines
```

---

## Build Sequence

### Phase 1 — Prototype (no wiki)

- Six coach personas, Sonnet backbone
- `coach_interactions` table logging all queries and responses
- Async LLM classifier flags hedged responses (`needs_wiki: true`)
- User thumbs up/down feedback
- System prompt structured as: `[persona] | [knowledge context — empty] | [conversation instructions]`

The knowledge context slot is empty now; wiki chunks slot in later without touching persona definitions.

### Phase 2 — Wiki Bootstrap

1. Andrew authors first-draft articles at item level (`reviewed_by: human`, `confidence: high`) using known authoritative sources (ACSM, NSCA, Sports Medicine Australia position statements, key meta-analyses)
2. LLM generates stub articles for referenced-but-unwritten concepts (`reviewed_by: llm-compiled`, `confidence: moderate`)
3. `visible_to_users: false` on all LLM-compiled articles until reviewed
4. Priority order driven by `needs_wiki` query frequency from Phase 1

### Phase 3 — Wiki in Production

- Coaching responses grounded against compiled wiki
- `wiki_articles_used` populated on interactions
- Before/after comparison available in analytics
- Monthly audit runs against source documents

### Wiki Web App (separate)

- Article editor (markdown + citation picker against `wiki_sources`)
- Source manager (R2 upload + `wiki_sources` registration)
- Audit dashboard (open flags, severity filter, resolve with notes)
- Index browser with FTS
- Content backlog view: `article_id: null` nodes sorted by query frequency

---

## Model Strategy

### Current: Sonnet for Everything

Claude Sonnet handles all coaching interactions during the prototype phase. The priority is learning what interaction patterns actually emerge before optimising model selection. The `coach_interactions` audit table instruments this automatically.

### Where the Model Actually Earns Its Keep

Not all coaching tasks require the same inference capability:

| Task | AI Complexity | Why |
|------|--------------|-----|
| Activity planning | Low | Rule-based + template selection from user profile |
| Progress monitoring | Very low | Maths + threshold comparison against DB |
| Suggesting improvements | Low-moderate | Pattern matching against wiki + user history |
| Answering exercise questions | Moderate | Wiki retrieval + synthesis |
| Motivational support | Moderate-high | Tone, empathy, personalisation |
| BCT selection and delivery | Moderate-high | Right technique, right moment, natural framing |
| Handling novel/complex queries | High | Genuine inference needed |

Realistically 70-80% of interactions fall into the first four categories. A well-structured prompt with the right DB context and wiki chunks handed to a modest model handles these well. The genuinely hard parts — empathetic tone calibration, BCT selection, persona consistency, handling ambiguity — are where smaller models noticeably fall short.

### Future: Hybrid Model Routing

When unit economics demand it, a router sits in front of the model call and directs traffic based on interaction complexity. The architecture already supports this without structural changes.

```
Simple/structured interactions
  → Smaller/cheaper model (e.g. Llama 3.3 70B via Groq, Mistral Small)
  → High-context DB + wiki retrieval doing the heavy lifting
  → Model formats and tones the response

Complex/sensitive interactions
  → Frontier model (Sonnet or equivalent)
  → Genuine inference, empathy, BCT selection
  → Triggered by: first session, low confidence signal,
    emotional content detected, novel query type
```

### Open Source / Self-Hosted Considerations

If self-hosting becomes viable:

- **Llama 3.3 70B** — strongest open weight option; needs ~40GB VRAM (4-bit quantisation)
- **Mistral Small 3.1** — 24B, less hardware, capable for structured tasks
- **Groq hosted inference** — open models without GPU infrastructure; fast, cheap, no ops overhead

Hardware reality: a 70B model requires dedicated GPU nodes (Hetzner GPU servers or equivalent), making hosted inference APIs (Groq, Together AI, Fireworks) more practical than true self-hosting for most interaction volumes.

### Migration Path (when needed)

All instrumentation is already in place:

1. Query `coach_interactions` — find low-complexity, high-volume interaction clusters
2. Define routing rules from observed patterns (`confidence_signal`, `topic_tags`)
3. Add router step before model call
4. Shadow test — run both models, compare outputs
5. Gradually shift traffic

No product or wiki changes required. Purely infrastructure.

### Why the Wiki Helps Model Routing

As the wiki matures it progressively reduces inference burden regardless of model — the more context injected from structured sources, the less raw inference required. This makes the cheaper routing path more viable over time and increases the ceiling on what a smaller model can handle competently.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Wiki storage | Convex (not markdown files) | FTS, relational queries, same DB as app |
| Source storage | R2 | PDFs up to any size, keyed by source ID |
| Citation format | Convex `_id` inline | Direct resolution, no slug mapping needed |
| Taxonomy shape | Single-parent tree | Clean queries; tags/aliases handle cross-cutting |
| Multiple parents | Deferred | Tags and aliases solve the practical problem |
| Content safety gate | `visible_to_users` boolean | LLM-compiled content withheld until reviewed |
| Wiki priority | Behaviour change first | It's the product core; exercise science is reference |
| Special Populations | First wiki sprint | Weakest area in base LLM knowledge |
| Model (now) | Claude Sonnet | Learn interaction patterns before optimising |
| Model (future) | Hybrid routing | Data-driven; instrumentation already in place |
