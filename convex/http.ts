import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// POST https://<deployment>.convex.site/clerk-webhook
// Configure this URL in the Clerk dashboard → Webhooks. Clerk signs the
// payload with a Svix signing secret; we verify before dispatching.
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) {
      console.error("CLERK_WEBHOOK_SIGNING_SECRET not set on this deployment");
      return new Response("Webhook misconfigured", { status: 500 });
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await request.text();

    let event: ClerkWebhookEvent;
    try {
      const wh = new Webhook(secret);
      event = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      console.warn("Clerk webhook signature verification failed", err);
      return new Response("Invalid signature", { status: 400 });
    }

    const actorLabel = `clerk-webhook:${event.type}`;

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const data = event.data;
        const primaryEmail =
          data.email_addresses?.find(
            (e) => e.id === data.primary_email_address_id,
          )?.email_address ??
          data.email_addresses?.[0]?.email_address;

        if (!primaryEmail) {
          console.warn(
            `Clerk ${event.type} for ${data.id} had no primary email; skipping`,
          );
          break;
        }

        await ctx.runMutation(internal.users.upsertFromClerk, {
          clerkId: data.id,
          email: primaryEmail,
          displayName:
            data.first_name ??
            (data.username ? data.username : undefined),
          actorLabel,
        });
        break;
      }

      case "user.deleted": {
        if (!event.data.id) break;
        await ctx.runMutation(internal.users.markDeletedFromClerk, {
          clerkId: event.data.id,
          actorLabel,
        });
        break;
      }

      default:
        // Other events (session.*, organization.*, etc.) are accepted and
        // acknowledged. When we subscribe to more event types in Clerk, add
        // handlers here.
        break;
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;

// Minimal shape of the Clerk webhook events we consume. Clerk sends richer
// payloads; we only pick the fields we use.
type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserCreatedOrUpdated = {
  type: "user.created" | "user.updated";
  data: {
    id: string;
    email_addresses?: ClerkEmailAddress[];
    primary_email_address_id?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
};

type ClerkUserDeleted = {
  type: "user.deleted";
  data: {
    id?: string;
    deleted: boolean;
  };
};

type ClerkOther = {
  type: string;
  data: Record<string, unknown>;
};

type ClerkWebhookEvent =
  | ClerkUserCreatedOrUpdated
  | ClerkUserDeleted
  | ClerkOther;
