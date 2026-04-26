import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { recordedChat, recordedEmbedding } from "./lib/openrouter.ts";

// PRD §9.2 five-step resolver. Phrase → activity_kinds row.
//   1. user-alias lookup  — phrase the same user has used before
//   2. global-alias lookup — phrase pre-loaded onto an activity_kinds row
//   3. embedding similarity — top-1 above HIGH threshold ⇒ resolve
//   4. ambiguous band       — embedding top-1 above LOW but below HIGH
//                              ⇒ return top-3 so the coach can ask
//   5. LLM fallback         — pick a candidate, or propose a new
//                              activity_kinds row with needsReview:true

const HIGH_THRESHOLD = 0.85;
const LOW_THRESHOLD = 0.65;
const VECTOR_LIMIT = 8;

type ResolvedOrigin =
  | "user_alias"
  | "global_alias"
  | "embedding"
  | "llm_match"
  | "llm_create";

type Candidate = {
  activityKindId: Id<"activity_kinds">;
  name: string;
  mets?: number;
  headingName: string;
  score: number;
};

type ClassifyResult =
  | {
      kind: "resolved";
      origin: ResolvedOrigin;
      activityKindId: Id<"activity_kinds">;
      name: string;
      mets?: number;
      headingName: string;
      score?: number;
      llmRecordId?: Id<"external_call">;
    }
  | { kind: "ambiguous"; candidates: Candidate[] }
  | {
      kind: "new";
      origin: "llm_create";
      activityKindId: Id<"activity_kinds">;
      name: string;
      mets?: number;
      headingName: string;
      llmRecordId: Id<"external_call">;
    }
  | { kind: "error"; error: string };

// ── helper queries / mutations ─────────────────────────────────────────

export const userByClerk = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

export const findUserAlias = internalQuery({
  args: { userId: v.id("users"), phrase: v.string() },
  handler: async (ctx, { userId, phrase }) => {
    const alias = await ctx.db
      .query("user_activity_aliases")
      .withIndex("by_user_phrase", (q) =>
        q.eq("userId", userId).eq("phrase", phrase),
      )
      .first();
    if (!alias) return null;
    const kind = await ctx.db.get(alias.activityKindId);
    if (!kind) return null;
    return {
      activityKindId: alias.activityKindId,
      name: kind.name,
      mets: kind.mets,
      headingName: kind.headingName,
    };
  },
});

// Single page of activity_kinds for global-alias scanning. Convex
// limits a function to one paginate call, so the classify action
// loops over this query page-by-page.
export const findGlobalAliasPage = internalQuery({
  args: {
    phrase: v.string(),
    cursor: v.optional(v.union(v.string(), v.null())),
    pageSize: v.number(),
  },
  handler: async (ctx, { phrase, cursor, pageSize }) => {
    const r = await ctx.db
      .query("activity_kinds")
      .paginate({ numItems: pageSize, cursor: cursor ?? null });
    for (const row of r.page) {
      if (row.aliases.includes(phrase)) {
        return {
          match: {
            activityKindId: row._id,
            name: row.name,
            mets: row.mets,
            headingName: row.headingName,
          },
          isDone: true,
          continueCursor: r.continueCursor,
        };
      }
    }
    return {
      match: null,
      isDone: r.isDone,
      continueCursor: r.continueCursor,
    };
  },
});

export const fetchKindsById = internalQuery({
  args: { ids: v.array(v.id("activity_kinds")) },
  handler: async (ctx, { ids }) => {
    const rows: Array<Doc<"activity_kinds">> = [];
    for (const id of ids) {
      const row = await ctx.db.get(id);
      if (row) rows.push(row);
    }
    return rows;
  },
});

export const systemConfigModels = internalQuery({
  args: {},
  handler: async (ctx) => {
    const cfg = await ctx.db.query("system_config").first();
    if (!cfg) throw new Error("system_config singleton missing");
    return cfg.models;
  },
});

export const learnAlias = internalMutation({
  args: {
    userId: v.id("users"),
    organisationId: v.id("organisations"),
    phrase: v.string(),
    activityKindId: v.id("activity_kinds"),
  },
  handler: async (ctx, args) => {
    // Idempotent: if the alias already exists, no-op.
    const existing = await ctx.db
      .query("user_activity_aliases")
      .withIndex("by_user_phrase", (q) =>
        q.eq("userId", args.userId).eq("phrase", args.phrase),
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("user_activity_aliases", {
      userId: args.userId,
      organisationId: args.organisationId,
      phrase: args.phrase,
      activityKindId: args.activityKindId,
      createdAt: Date.now(),
    });
  },
});

export const createKind = internalMutation({
  args: {
    name: v.string(),
    headingName: v.string(),
    mets: v.optional(v.number()),
    isCardio: v.boolean(),
    isStrength: v.boolean(),
    isMobility: v.boolean(),
    isBalance: v.boolean(),
    isMental: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("activity_kinds", {
      name: args.name,
      headingName: args.headingName,
      coaClass: "adult",
      isCardio: args.isCardio,
      isStrength: args.isStrength,
      isMobility: args.isMobility,
      isBalance: args.isBalance,
      isMental: args.isMental,
      mets: args.mets,
      platformTypes: [],
      aliases: [],
      source: "manual",
      needsReview: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ── classifier action ──────────────────────────────────────────────────

export const classify = action({
  args: { phrase: v.string() },
  handler: async (ctx, { phrase }): Promise<ClassifyResult> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { kind: "error", error: "classify called without auth" };
    }
    const trimmed = phrase.trim().toLowerCase();
    if (trimmed.length === 0) {
      return { kind: "error", error: "empty phrase" };
    }

    const user = await ctx.runQuery(
      internal.activityClassifier.userByClerk,
      { clerkId: identity.subject },
    );
    if (!user) return { kind: "error", error: "no users row" };

    // Step 1 — user alias.
    const userAlias = await ctx.runQuery(
      internal.activityClassifier.findUserAlias,
      { userId: user._id, phrase: trimmed },
    );
    if (userAlias) {
      return {
        kind: "resolved",
        origin: "user_alias",
        activityKindId: userAlias.activityKindId,
        name: userAlias.name,
        mets: userAlias.mets,
        headingName: userAlias.headingName,
      };
    }

    // Step 2 — global alias scan. Page across activity_kinds rows
    // whose `aliases` includes the phrase. We early-terminate on
    // first match. Most rows currently have empty aliases (B2 seed),
    // so this is fast; once aliases are populated we'll add a
    // per-alias index to skip the scan.
    {
      let cursor: string | null = null;
      for (let i = 0; i < 20; i++) {
        const page = await ctx.runQuery(
          internal.activityClassifier.findGlobalAliasPage,
          { phrase: trimmed, cursor, pageSize: 200 },
        );
        if (page.match) {
          return {
            kind: "resolved",
            origin: "global_alias",
            activityKindId: page.match.activityKindId,
            name: page.match.name,
            mets: page.match.mets,
            headingName: page.match.headingName,
          };
        }
        if (page.isDone) break;
        cursor = page.continueCursor;
      }
    }

    // Step 3 — embedding similarity (vector index).
    const models = await ctx.runQuery(
      internal.activityClassifier.systemConfigModels,
      {},
    );
    const { embedding } = await recordedEmbedding(ctx, {
      model: models.embedding,
      input: phrase,
      purpose: "classify_activity",
      userId: user._id,
      organisationId: user.organisationId,
    });

    const vectorResults = await ctx.vectorSearch(
      "activity_kinds",
      "by_embedding",
      {
        vector: embedding,
        limit: VECTOR_LIMIT,
        filter: (q) => q.eq("coaClass", "adult"),
      },
    );

    const ids = vectorResults.map((r) => r._id);
    const rows = await ctx.runQuery(
      internal.activityClassifier.fetchKindsById,
      { ids },
    );

    // Re-pair with the search scores in original order.
    const candidates: Candidate[] = vectorResults.map((r) => {
      const row = rows.find((x) => x._id === r._id);
      return {
        activityKindId: r._id,
        name: row?.name ?? "(removed)",
        mets: row?.mets,
        headingName: row?.headingName ?? "Unknown",
        score: r._score,
      };
    });

    const top = candidates[0];
    if (top && top.score >= HIGH_THRESHOLD) {
      await ctx.runMutation(internal.activityClassifier.learnAlias, {
        userId: user._id,
        organisationId: user.organisationId,
        phrase: trimmed,
        activityKindId: top.activityKindId,
      });
      return {
        kind: "resolved",
        origin: "embedding",
        activityKindId: top.activityKindId,
        name: top.name,
        mets: top.mets,
        headingName: top.headingName,
        score: top.score,
      };
    }

    if (top && top.score >= LOW_THRESHOLD) {
      return { kind: "ambiguous", candidates: candidates.slice(0, 3) };
    }

    // Step 5 — LLM fallback.
    const enumerated = candidates
      .slice(0, 5)
      .map(
        (c, i) =>
          `${i}: ${c.name} (METs ${c.mets ?? "?"}, heading ${c.headingName})`,
      )
      .join("\n");

    const prompt = `A user said they did this activity: "${phrase}"

Closest existing taxonomy candidates (low confidence):
${enumerated}

Decide whether one of these candidates is a clear fit, or whether a brand-new entry is warranted.

Respond ONLY with strict JSON, no commentary, in one of two shapes:

  {"decision":"match","candidateIndex":N}

OR

  {"decision":"new","name":"Canonical activity name","headingName":"One of: Walking | Running | Bicycling | Sports | Conditioning Exercise | Home Activities | Lawn & Garden | Water Activities | Winter Activities | Dancing | Self Care | Miscellaneous","mets":4.0,"isCardio":true,"isStrength":false,"isMobility":false,"isBalance":false,"isMental":false}

Pick "new" only if none of the candidates would be how a real coach categorises this activity.`;

    const llm = await recordedChat(ctx, {
      model: models.classifier,
      messages: [{ role: "user", content: prompt }],
      purpose: "classify_activity_llm_fallback",
      userId: user._id,
      organisationId: user.organisationId,
      temperature: 0,
      maxTokens: 300,
    });

    let parsed:
      | { decision: "match"; candidateIndex: number }
      | {
          decision: "new";
          name: string;
          headingName: string;
          mets?: number;
          isCardio: boolean;
          isStrength: boolean;
          isMobility: boolean;
          isBalance: boolean;
          isMental: boolean;
        }
      | null = null;
    try {
      parsed = JSON.parse(llm.content);
    } catch (_) {
      // Recover by stripping markdown fences if the model added any.
      const stripped = llm.content
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "");
      try {
        parsed = JSON.parse(stripped);
      } catch (_) {
        return {
          kind: "ambiguous",
          candidates: candidates.slice(0, 3),
        };
      }
    }

    if (parsed && parsed.decision === "match") {
      const idx = parsed.candidateIndex;
      const chosen = candidates[idx];
      if (!chosen) {
        return { kind: "ambiguous", candidates: candidates.slice(0, 3) };
      }
      await ctx.runMutation(internal.activityClassifier.learnAlias, {
        userId: user._id,
        organisationId: user.organisationId,
        phrase: trimmed,
        activityKindId: chosen.activityKindId,
      });
      return {
        kind: "resolved",
        origin: "llm_match",
        activityKindId: chosen.activityKindId,
        name: chosen.name,
        mets: chosen.mets,
        headingName: chosen.headingName,
        score: chosen.score,
        llmRecordId: llm.recordId,
      };
    }

    if (parsed && parsed.decision === "new") {
      const newId: Id<"activity_kinds"> = await ctx.runMutation(
        internal.activityClassifier.createKind,
        {
          name: parsed.name,
          headingName: parsed.headingName,
          mets: parsed.mets,
          isCardio: parsed.isCardio,
          isStrength: parsed.isStrength,
          isMobility: parsed.isMobility,
          isBalance: parsed.isBalance,
          isMental: parsed.isMental,
        },
      );
      await ctx.runMutation(internal.activityClassifier.learnAlias, {
        userId: user._id,
        organisationId: user.organisationId,
        phrase: trimmed,
        activityKindId: newId,
      });
      return {
        kind: "new",
        origin: "llm_create",
        activityKindId: newId,
        name: parsed.name,
        mets: parsed.mets,
        headingName: parsed.headingName,
        llmRecordId: llm.recordId,
      };
    }

    return { kind: "ambiguous", candidates: candidates.slice(0, 3) };
  },
});
