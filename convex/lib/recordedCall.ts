import type { ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export type CallKind =
  | "llm"
  | "embedding"
  | "email"
  | "push"
  | "storage"
  | "search"
  | "billing"
  | "crm"
  | "other";

export interface ExternalCallMeta {
  kind: CallKind;
  provider: string;
  model?: string;
  purpose: string;
  userId?: Id<"users">;
  organisationId?: Id<"organisations">;
  agentPersonaId?: Id<"coach_personas">;
  threadId?: string;
  messageId?: string;
  parentCallId?: Id<"external_call">;
}

export interface CallOutcome<T> {
  result: T;
  inputTokens?: number;
  outputTokens?: number;
  cachedTokens?: number;
  reportedCostUsd?: number;
  costDetail?: unknown;
  providerRequestId?: string;
}

const TRUNCATE_ERROR_AT = 500;

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n);
}

function classifyError(err: unknown): "failed" | "timeout" {
  const msg = err instanceof Error ? err.message : String(err);
  return /timeout|timed out/i.test(msg) ? "timeout" : "failed";
}

function errorCode(err: unknown): string | undefined {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return undefined;
}

async function computeCost(
  ctx: ActionCtx,
  meta: ExternalCallMeta,
  outcome: Partial<CallOutcome<unknown>>,
  startedAt: number,
): Promise<number> {
  if (meta.kind !== "llm" && meta.kind !== "embedding") {
    return outcome.reportedCostUsd ?? 0;
  }
  if (!meta.model) return outcome.reportedCostUsd ?? 0;

  const pricing = await ctx.runQuery(internal.audit.priceForModel, {
    modelSlug: meta.model,
    at: startedAt,
  });
  if (!pricing) return outcome.reportedCostUsd ?? 0;

  const input = outcome.inputTokens ?? 0;
  const output = outcome.outputTokens ?? 0;
  const cached = outcome.cachedTokens ?? 0;

  if (meta.kind === "embedding") {
    const rate = pricing.embeddingCostPer1kUsd ?? pricing.inputCostPer1kUsd;
    return (input / 1000) * rate;
  }

  const cachedRate = pricing.cachedInputCostPer1kUsd ?? pricing.inputCostPer1kUsd;
  const uncached = Math.max(0, input - cached);
  return (
    (uncached / 1000) * pricing.inputCostPer1kUsd +
    (cached / 1000) * cachedRate +
    (output / 1000) * pricing.outputCostPer1kUsd
  );
}

export async function recordedCall<T>(
  ctx: ActionCtx,
  meta: ExternalCallMeta,
  fn: () => Promise<CallOutcome<T>>,
): Promise<T> {
  const startedAt = Date.now();
  try {
    const outcome = await fn();
    const completedAt = Date.now();
    const costUsd = await computeCost(ctx, meta, outcome, startedAt);

    await ctx.runMutation(internal.audit.recordCall, {
      ...meta,
      inputTokens: outcome.inputTokens,
      outputTokens: outcome.outputTokens,
      cachedTokens: outcome.cachedTokens,
      costUsd,
      reportedCostUsd: outcome.reportedCostUsd,
      costDetail: outcome.costDetail,
      state: "success",
      latencyMs: completedAt - startedAt,
      providerRequestId: outcome.providerRequestId,
      startedAt,
      completedAt,
    });
    return outcome.result;
  } catch (err) {
    const completedAt = Date.now();
    await ctx.runMutation(internal.audit.recordCall, {
      ...meta,
      costUsd: 0,
      state: classifyError(err),
      latencyMs: completedAt - startedAt,
      errorCode: errorCode(err),
      errorMessage: truncate(err instanceof Error ? err.message : String(err), TRUNCATE_ERROR_AT),
      startedAt,
      completedAt,
    });
    throw err;
  }
}
