import type { QueryCtx, MutationCtx } from "../_generated/server";

type AnyCtx = QueryCtx | MutationCtx;

/**
 * Throws "Unauthenticated" if no Clerk identity is attached to the
 * request. Use this in queries/mutations that must reject anonymous
 * callers but don't need a `users` row (the only real example today is
 * `users:ensureFromIdentity`, which creates the row).
 *
 * Throwing — rather than silently returning null/empty — matters
 * because the Flutter `convexSubscribe` wrapper's retry-with-backoff
 * keys off subscription errors. Returning null/empty would hide a
 * stale-JWT failure as "no data".
 */
export async function requireIdentity(ctx: AnyCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return identity;
}

/**
 * Throws on missing identity OR missing `users` row. Returns both. The
 * default for any user-scoped query/mutation; use this everywhere that
 * touches user data.
 *
 * The "no users row" case is genuinely rare in practice: the Clerk
 * webhook + `ensureFromIdentity` retry both populate the row before
 * any user-scoped call should fire. When it does happen, throwing is
 * still the right move — the subscription wrapper will retry, and by
 * the next tick the row exists.
 */
export async function requireUser(ctx: AnyCtx) {
  const identity = await requireIdentity(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!user) throw new Error("No users row for the authenticated identity");
  return { identity, user };
}
