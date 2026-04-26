import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("coach_personas")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

/// The persona the current user is assigned to, or null if they haven't
/// picked yet. Drives the router's onboarding redirect (no assignment →
/// /onboarding/coach) and the chat header.
export const currentForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) return null;
    const assignment = await ctx.db
      .query("coachAssignment")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!assignment) return null;
    return await ctx.db.get(assignment.coachPersonaId);
  },
});

/// Assign or change the user's coach. Idempotent — first call inserts,
/// subsequent calls patch the existing assignment. Audited.
export const assignCoach = mutation({
  args: { coachPersonaId: v.id("coach_personas") },
  handler: async (ctx, { coachPersonaId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("assignCoach called without auth");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) {
      throw new Error("No users row for the authenticated identity");
    }

    const persona = await ctx.db.get(coachPersonaId);
    if (!persona) throw new Error("Unknown coach persona");
    if (!persona.active) throw new Error("Coach persona is not active");

    const now = Date.now();
    const existing = await ctx.db
      .query("coachAssignment")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    let action: "users.assignCoach" | "users.changeCoach";
    let before: { coachPersonaId: string } | undefined;

    if (existing) {
      if (existing.coachPersonaId === coachPersonaId) {
        // Idempotent no-op — same coach.
        return existing._id;
      }
      action = "users.changeCoach";
      before = { coachPersonaId: existing.coachPersonaId };
      await ctx.db.patch(existing._id, {
        coachPersonaId,
        assignedAt: now,
      });
    } else {
      action = "users.assignCoach";
      await ctx.db.insert("coachAssignment", {
        userId: user._id,
        organisationId: user.organisationId,
        coachPersonaId,
        assignedAt: now,
      });
    }

    await ctx.runMutation(internal.audit.recordAudit, {
      action,
      actorUserId: user._id,
      actorLabel: "flutter:assignCoach",
      organisationId: user.organisationId,
      subjectType: "coachAssignment",
      subjectId: user._id,
      before,
      after: { coachPersonaId, slug: persona.slug },
    });

    return existing?._id;
  },
});
