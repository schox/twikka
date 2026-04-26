import type { ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

// Single LLM/embedding gateway. All paid third-party model calls flow
// through here so the audit (`external_call`) and pricing (`model_pricing`)
// disciplines are uniform. Each helper writes one audit row per call —
// idempotent on `x-request-id` from OpenRouter.

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

type AuditMeta = {
  purpose: string;
  userId?: Id<"users">;
  organisationId?: Id<"organisations">;
  agentPersonaId?: Id<"coach_personas">;
  threadId?: string;
  messageId?: string;
  parentCallId?: Id<"external_call">;
};

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatResult = {
  content: string;
  recordId: Id<"external_call">;
  inputTokens?: number;
  outputTokens?: number;
};

export type EmbedResult = {
  embedding: number[];
  recordId: Id<"external_call">;
  inputTokens?: number;
};

export type EmbedBatchResult = {
  embeddings: number[][];
  recordId: Id<"external_call">;
  inputTokens?: number;
};

function headers() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured on this deployment");
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    // Required by OpenRouter for attribution & rankings.
    "HTTP-Referer": "https://twikka.app",
    "X-Title": "Twikka",
  };
}

async function priceFor(
  ctx: ActionCtx,
  modelSlug: string,
  at: number,
): Promise<{
  inputCostPer1kUsd: number;
  outputCostPer1kUsd: number;
  embeddingCostPer1kUsd?: number;
} | null> {
  return await ctx.runQuery(internal.audit.priceForModel, {
    modelSlug,
    at,
  });
}

export async function recordedChat(
  ctx: ActionCtx,
  args: AuditMeta & {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
  },
): Promise<ChatResult> {
  const startedAt = Date.now();
  let resp: Response;
  try {
    resp = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model: args.model,
        messages: args.messages,
        temperature: args.temperature,
        max_tokens: args.maxTokens,
      }),
    });
  } catch (err) {
    await ctx.runMutation(internal.audit.recordCall, {
      kind: "llm",
      provider: "openrouter",
      model: args.model,
      purpose: args.purpose,
      userId: args.userId,
      organisationId: args.organisationId,
      agentPersonaId: args.agentPersonaId,
      threadId: args.threadId,
      messageId: args.messageId,
      parentCallId: args.parentCallId,
      state: "failed",
      latencyMs: Date.now() - startedAt,
      errorCode: "fetch_failed",
      errorMessage: String(err).slice(0, 500),
      costUsd: 0,
      startedAt,
      completedAt: Date.now(),
    });
    throw err;
  }

  if (!resp.ok) {
    const body = await resp.text();
    await ctx.runMutation(internal.audit.recordCall, {
      kind: "llm",
      provider: "openrouter",
      model: args.model,
      purpose: args.purpose,
      userId: args.userId,
      organisationId: args.organisationId,
      agentPersonaId: args.agentPersonaId,
      threadId: args.threadId,
      messageId: args.messageId,
      parentCallId: args.parentCallId,
      state: "failed",
      latencyMs: Date.now() - startedAt,
      errorCode: String(resp.status),
      errorMessage: body.slice(0, 500),
      costUsd: 0,
      startedAt,
      completedAt: Date.now(),
    });
    throw new Error(`OpenRouter chat failed: ${resp.status} ${body.slice(0, 300)}`);
  }

  const json = (await resp.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      cost?: number;
      prompt_tokens_details?: { cached_tokens?: number };
    };
    id?: string;
  };

  const content = json.choices[0]?.message?.content ?? "";
  const inputTokens = json.usage?.prompt_tokens;
  const outputTokens = json.usage?.completion_tokens;
  const cachedTokens = json.usage?.prompt_tokens_details?.cached_tokens;
  const reportedCostUsd = json.usage?.cost;

  const pricing = await priceFor(ctx, args.model, startedAt);
  const computedCost = pricing
    ? ((inputTokens ?? 0) - (cachedTokens ?? 0)) / 1000 *
        pricing.inputCostPer1kUsd +
      (cachedTokens ?? 0) / 1000 *
        ((pricing as { cachedInputCostPer1kUsd?: number })
          .cachedInputCostPer1kUsd ?? pricing.inputCostPer1kUsd) +
      (outputTokens ?? 0) / 1000 * pricing.outputCostPer1kUsd
    : reportedCostUsd ?? 0;

  const recordId = await ctx.runMutation(internal.audit.recordCall, {
    kind: "llm",
    provider: "openrouter",
    model: args.model,
    purpose: args.purpose,
    userId: args.userId,
    organisationId: args.organisationId,
    agentPersonaId: args.agentPersonaId,
    threadId: args.threadId,
    messageId: args.messageId,
    parentCallId: args.parentCallId,
    inputTokens,
    outputTokens,
    cachedTokens,
    costUsd: computedCost,
    reportedCostUsd,
    state: "success",
    latencyMs: Date.now() - startedAt,
    providerRequestId: json.id ?? resp.headers.get("x-request-id") ?? undefined,
    startedAt,
    completedAt: Date.now(),
  });

  return { content, recordId, inputTokens, outputTokens };
}

export async function recordedEmbedding(
  ctx: ActionCtx,
  args: AuditMeta & { model: string; input: string },
): Promise<EmbedResult> {
  const startedAt = Date.now();
  let resp: Response;
  try {
    resp = await fetch(`${OPENROUTER_BASE}/embeddings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ model: args.model, input: args.input }),
    });
  } catch (err) {
    await ctx.runMutation(internal.audit.recordCall, {
      kind: "embedding",
      provider: "openrouter",
      model: args.model,
      purpose: args.purpose,
      userId: args.userId,
      organisationId: args.organisationId,
      agentPersonaId: args.agentPersonaId,
      state: "failed",
      latencyMs: Date.now() - startedAt,
      errorCode: "fetch_failed",
      errorMessage: String(err).slice(0, 500),
      costUsd: 0,
      startedAt,
      completedAt: Date.now(),
    });
    throw err;
  }
  if (!resp.ok) {
    const body = await resp.text();
    await ctx.runMutation(internal.audit.recordCall, {
      kind: "embedding",
      provider: "openrouter",
      model: args.model,
      purpose: args.purpose,
      userId: args.userId,
      organisationId: args.organisationId,
      agentPersonaId: args.agentPersonaId,
      state: "failed",
      latencyMs: Date.now() - startedAt,
      errorCode: String(resp.status),
      errorMessage: body.slice(0, 500),
      costUsd: 0,
      startedAt,
      completedAt: Date.now(),
    });
    throw new Error(`OpenRouter embed failed: ${resp.status} ${body.slice(0, 300)}`);
  }

  const json = (await resp.json()) as {
    data: Array<{ embedding: number[] }>;
    usage?: { prompt_tokens?: number; total_tokens?: number; cost?: number };
    id?: string;
  };

  const embedding = json.data[0].embedding;
  const inputTokens = json.usage?.prompt_tokens ?? json.usage?.total_tokens;
  const reportedCostUsd = json.usage?.cost;

  const pricing = await priceFor(ctx, args.model, startedAt);
  const computedCost = pricing && inputTokens
    ? (inputTokens / 1000) *
        ((pricing as { embeddingCostPer1kUsd?: number }).embeddingCostPer1kUsd ??
          pricing.inputCostPer1kUsd)
    : reportedCostUsd ?? 0;

  const recordId = await ctx.runMutation(internal.audit.recordCall, {
    kind: "embedding",
    provider: "openrouter",
    model: args.model,
    purpose: args.purpose,
    userId: args.userId,
    organisationId: args.organisationId,
    agentPersonaId: args.agentPersonaId,
    inputTokens,
    costUsd: computedCost,
    reportedCostUsd,
    state: "success",
    latencyMs: Date.now() - startedAt,
    providerRequestId: json.id ?? resp.headers.get("x-request-id") ?? undefined,
    startedAt,
    completedAt: Date.now(),
  });

  return { embedding, recordId, inputTokens };
}

export async function recordedEmbeddingBatch(
  ctx: ActionCtx,
  args: AuditMeta & { model: string; inputs: string[] },
): Promise<EmbedBatchResult> {
  const startedAt = Date.now();
  let resp: Response;
  try {
    resp = await fetch(`${OPENROUTER_BASE}/embeddings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ model: args.model, input: args.inputs }),
    });
  } catch (err) {
    await ctx.runMutation(internal.audit.recordCall, {
      kind: "embedding",
      provider: "openrouter",
      model: args.model,
      purpose: args.purpose,
      userId: args.userId,
      organisationId: args.organisationId,
      state: "failed",
      latencyMs: Date.now() - startedAt,
      errorCode: "fetch_failed",
      errorMessage: String(err).slice(0, 500),
      costUsd: 0,
      startedAt,
      completedAt: Date.now(),
    });
    throw err;
  }
  if (!resp.ok) {
    const body = await resp.text();
    await ctx.runMutation(internal.audit.recordCall, {
      kind: "embedding",
      provider: "openrouter",
      model: args.model,
      purpose: args.purpose,
      userId: args.userId,
      organisationId: args.organisationId,
      state: "failed",
      latencyMs: Date.now() - startedAt,
      errorCode: String(resp.status),
      errorMessage: body.slice(0, 500),
      costUsd: 0,
      startedAt,
      completedAt: Date.now(),
    });
    throw new Error(`OpenRouter embed failed: ${resp.status} ${body.slice(0, 300)}`);
  }

  const json = (await resp.json()) as {
    data: Array<{ embedding: number[]; index?: number }>;
    usage?: { prompt_tokens?: number; total_tokens?: number };
    id?: string;
  };

  // OpenAI returns embeddings in an array; we sort by `index` defensively
  // since some providers don't preserve input order.
  const ordered = [...json.data].sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0),
  );
  const embeddings = ordered.map((d) => d.embedding);
  const inputTokens = json.usage?.prompt_tokens ?? json.usage?.total_tokens;

  const pricing = await priceFor(ctx, args.model, startedAt);
  const computedCost = pricing && inputTokens
    ? (inputTokens / 1000) *
        ((pricing as { embeddingCostPer1kUsd?: number }).embeddingCostPer1kUsd ??
          pricing.inputCostPer1kUsd)
    : 0;

  const recordId = await ctx.runMutation(internal.audit.recordCall, {
    kind: "embedding",
    provider: "openrouter",
    model: args.model,
    purpose: args.purpose,
    userId: args.userId,
    organisationId: args.organisationId,
    inputTokens,
    costUsd: computedCost,
    state: "success",
    latencyMs: Date.now() - startedAt,
    providerRequestId: json.id ?? resp.headers.get("x-request-id") ?? undefined,
    startedAt,
    completedAt: Date.now(),
  });

  return { embeddings, recordId, inputTokens };
}
