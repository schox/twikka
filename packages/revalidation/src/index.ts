/**
 * @novansa/revalidation
 *
 * On-demand revalidation for Next.js apps with cache warming.
 * Provides a standardized way to handle content updates across
 * the Novansa multi-brand platform.
 *
 * @example
 * ```typescript
 * // app/api/revalidate/route.ts
 * import { createRevalidationHandler, BRAND_IDS } from '@novansa/revalidation';
 *
 * export const POST = createRevalidationHandler({
 *   secret: process.env.REVALIDATION_SECRET!,
 *   brandId: BRAND_IDS.COUPLE_TOOLS,
 *   siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
 *   paths: {
 *     blog_post: (record) => ['/blog', `/blog/${record.slug}`],
 *   },
 * });
 * ```
 */

// Main handler
export { createRevalidationHandler, getSlug, commonPathResolvers } from "./handler";

// Types
export type {
  BrandId,
  OperationType,
  RevalidationPayload,
  PathResolver,
  RevalidationConfig,
  RevalidationResult,
} from "./types";

// Constants
export { BRAND_IDS, REVALIDATION_SECRET_HEADER } from "./types";
