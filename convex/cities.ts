import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

// Type-ahead search over the cities table. Hits the `by_haystack`
// search index — relevance-ordered, capped at 20 results. Optional
// countryCode filter for callers that want to narrow scope.
export const search = query({
  args: {
    q: v.string(),
    countryCode: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { q, countryCode, limit }) => {
    const trimmed = q.trim();
    if (trimmed.length === 0) return [];
    const cap = Math.min(Math.max(limit ?? 20, 1), 50);
    const results = await ctx.db
      .query("cities")
      .withSearchIndex("by_haystack", (b) => {
        const base = b.search("searchHaystack", trimmed);
        return countryCode ? base.eq("countryCode", countryCode) : base;
      })
      .take(cap);
    return results.map((c) => ({
      _id: c._id,
      name: c.name,
      asciiname: c.asciiname,
      countryCode: c.countryCode,
      timezone: c.timezone,
      latitude: c.latitude,
      longitude: c.longitude,
    }));
  },
});

// Set the current user's city + timezone. Looks up the chosen city,
// updates the users row, audits the change. Phase C will move this into
// the user_profile_slots state machine; for B1 we patch users directly.
export const setForCurrentUser = mutation({
  args: { cityId: v.id("cities") },
  handler: async (ctx, { cityId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("setForCurrentUser called without auth");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("No users row for the authenticated identity");

    const city = await ctx.db.get(cityId);
    if (!city) throw new Error("Unknown city");

    const before = { cityId: user.cityId, timezone: user.timezone };
    const after = { cityId, timezone: city.timezone };
    if (before.cityId === after.cityId && before.timezone === after.timezone) {
      return user._id;
    }

    await ctx.db.patch(user._id, {
      cityId: after.cityId,
      timezone: after.timezone,
      updatedAt: Date.now(),
    });

    await ctx.runMutation(internal.audit.recordAudit, {
      action: "users.setCity",
      actorUserId: user._id,
      actorLabel: "flutter:cities.setForCurrentUser",
      organisationId: user.organisationId,
      subjectType: "users",
      subjectId: user._id,
      before,
      after: { ...after, cityName: city.name, countryCode: city.countryCode },
    });

    return user._id;
  },
});

// Resolve a city by Convex id — used by the picker to display the
// user's current city without keeping the full row in client state.
export const byId = query({
  args: { cityId: v.id("cities") },
  handler: async (ctx, { cityId }) => {
    const city = await ctx.db.get(cityId);
    if (!city) return null;
    return {
      _id: city._id,
      name: city.name,
      asciiname: city.asciiname,
      countryCode: city.countryCode,
      timezone: city.timezone,
    };
  },
});
