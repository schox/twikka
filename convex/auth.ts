import { v } from "convex/values";
import { action } from "./_generated/server";

// Public, unauthenticated action used by the morph auth screen to decide
// whether the user is signing in or signing up. Wraps Clerk's Backend API
// GET /v1/users?email_address=…
//
// Trade-off: enables account enumeration (caller can probe whether an email
// has an account). Acceptable pre-launch for the smart-auth UX; before the
// public launch we should rate-limit + add a captcha gate, or fall back to
// "blind" attemptSignIn-then-attemptSignUp on error.
export const probeEmail = action({
  args: { email: v.string() },
  handler: async (_ctx, { email }): Promise<{ exists: boolean }> => {
    const secret = process.env.CLERK_SECRET_KEY;
    if (!secret) {
      throw new Error("CLERK_SECRET_KEY not configured on this deployment");
    }

    const url = new URL("https://api.clerk.com/v1/users");
    url.searchParams.set("email_address", email);
    url.searchParams.set("limit", "1");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!res.ok) {
      throw new Error(`Clerk probe failed (${res.status}): ${await res.text()}`);
    }

    const users = (await res.json()) as Array<{ id: string }>;
    return { exists: users.length > 0 };
  },
});
