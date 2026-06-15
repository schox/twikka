/**
 * Revalidation Handler
 *
 * Creates a Next.js API route handler that processes revalidation requests
 * from the Supabase Edge Function dispatcher.
 */

import {
  RevalidationConfig,
  RevalidationPayload,
  RevalidationResult,
  REVALIDATION_SECRET_HEADER,
} from "./types";

/**
 * Creates a revalidation API route handler for Next.js App Router.
 *
 * @example
 * ```typescript
 * // app/api/revalidate/route.ts
 * import { createRevalidationHandler } from '@novansa/revalidation';
 *
 * export const POST = createRevalidationHandler({
 *   secret: process.env.REVALIDATION_SECRET!,
 *   brandId: 3, // Couple Tools
 *   siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
 *   paths: {
 *     blog_post: (record) => [
 *       '/blog',
 *       `/blog/${record.slug}`,
 *       '/sitemap.xml',
 *     ],
 *   },
 * });
 * ```
 */
export function createRevalidationHandler(config: RevalidationConfig) {
  const { secret, brandId, siteUrl, paths, warmCache = true, onRevalidate } = config;

  return async (request: Request): Promise<Response> => {
    const result: RevalidationResult = {
      revalidated: false,
      paths: [],
      table: "",
      type: "INSERT",
    };

    try {
      // 1. Validate authentication
      const authHeader = request.headers.get(REVALIDATION_SECRET_HEADER);
      if (authHeader !== secret) {
        result.skipped = true;
        result.skipReason = "Invalid or missing secret";
        return Response.json(result, { status: 401 });
      }

      // 2. Parse payload
      let payload: RevalidationPayload;
      try {
        payload = (await request.json()) as RevalidationPayload;
      } catch {
        result.skipped = true;
        result.skipReason = "Invalid JSON payload";
        return Response.json(result, { status: 400 });
      }

      const { table, record, type } = payload;
      result.table = table;
      result.type = type;

      // 3. Check brand matches
      const recordBrandId = (record.brand ?? record.brand_id) as number | undefined;
      if (recordBrandId !== undefined && recordBrandId !== brandId) {
        result.skipped = true;
        result.skipReason = `Different brand (got ${recordBrandId}, expected ${brandId})`;
        return Response.json(result, { status: 200 });
      }

      // 4. Get paths to revalidate
      const pathResolver = paths[table];
      if (!pathResolver) {
        result.skipped = true;
        result.skipReason = `No path resolver configured for table: ${table}`;
        return Response.json(result, { status: 200 });
      }

      const pathsToRevalidate = pathResolver(record);
      if (pathsToRevalidate.length === 0) {
        result.skipped = true;
        result.skipReason = "Path resolver returned no paths";
        return Response.json(result, { status: 200 });
      }

      result.paths = pathsToRevalidate;

      // 5. Revalidate each path
      // Dynamic import to work in edge and node environments
      const { revalidatePath } = await import("next/cache");

      for (const path of pathsToRevalidate) {
        revalidatePath(path);
      }

      result.revalidated = true;

      // 6. Warm the cache by fetching each path
      if (warmCache && siteUrl) {
        result.cacheWarming = {
          success: [],
          failed: [],
        };

        // Warm cache in parallel, but don't block the response
        const warmingPromises = pathsToRevalidate.map(async (path) => {
          try {
            const url = `${siteUrl}${path}`;
            const response = await fetch(url, {
              method: "GET",
              // Short timeout - we just want to trigger the render
              signal: AbortSignal.timeout(10000),
              // Avoid caching issues
              headers: {
                "Cache-Control": "no-cache",
                "x-revalidation-warming": "true",
              },
            });

            if (response.ok) {
              result.cacheWarming!.success.push(path);
            } else {
              result.cacheWarming!.failed.push(path);
            }
          } catch {
            result.cacheWarming!.failed.push(path);
          }
        });

        // Wait for all warming requests (with overall timeout)
        await Promise.race([
          Promise.all(warmingPromises),
          new Promise((resolve) => setTimeout(resolve, 15000)), // 15s max
        ]);
      }

      // 7. Call optional callback
      if (onRevalidate) {
        await onRevalidate(result);
      }

      return Response.json(result, { status: 200 });
    } catch (error) {
      result.error = error instanceof Error ? error.message : "Unknown error";
      return Response.json(result, { status: 500 });
    }
  };
}

/**
 * Helper to extract the slug from a record, handling common field names
 */
export function getSlug(record: Record<string, unknown>): string {
  return (record.slug ?? record.url_slug ?? record.id ?? "") as string;
}

/**
 * Common path resolvers for typical content types
 */
export const commonPathResolvers = {
  /**
   * Blog post path resolver
   * Revalidates: /blog, /blog/[slug], /sitemap.xml
   */
  blogPost: (record: Record<string, unknown>): string[] => {
    const slug = getSlug(record);
    return ["/blog", `/blog/${slug}`, "/sitemap.xml"];
  },

  /**
   * Team member path resolver
   * Revalidates: /team, /team/[slug], /about (if team is shown there), /sitemap.xml
   */
  teamMember: (record: Record<string, unknown>): string[] => {
    const slug = getSlug(record);
    return ["/team", `/team/${slug}`, "/about", "/sitemap.xml"];
  },

  /**
   * Service path resolver
   * Revalidates: /services, /services/[slug], /, /sitemap.xml
   */
  service: (record: Record<string, unknown>): string[] => {
    const slug = getSlug(record);
    return ["/services", `/services/${slug}`, "/", "/sitemap.xml"];
  },
};
