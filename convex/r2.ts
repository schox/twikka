import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";

// Shared R2 client. Reads bucket/endpoint/keys from the Convex env
// vars (R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).
// All `media`-table mutations go through this — there should be no
// other R2 imports in the codebase.
export const r2 = new R2(components.r2);
