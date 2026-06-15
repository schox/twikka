// src/types.ts
var BRAND_IDS = {
  FALL: 1,
  TWIKKA: 2,
  COUPLE_TOOLS: 3
};
var REVALIDATION_SECRET_HEADER = "x-revalidation-secret";

// src/handler.ts
function createRevalidationHandler(config) {
  const { secret, brandId, siteUrl, paths, warmCache = true, onRevalidate } = config;
  return async (request) => {
    const result = {
      revalidated: false,
      paths: [],
      table: "",
      type: "INSERT"
    };
    try {
      const authHeader = request.headers.get(REVALIDATION_SECRET_HEADER);
      if (authHeader !== secret) {
        result.skipped = true;
        result.skipReason = "Invalid or missing secret";
        return Response.json(result, { status: 401 });
      }
      let payload;
      try {
        payload = await request.json();
      } catch {
        result.skipped = true;
        result.skipReason = "Invalid JSON payload";
        return Response.json(result, { status: 400 });
      }
      const { table, record, type } = payload;
      result.table = table;
      result.type = type;
      const recordBrandId = record.brand ?? record.brand_id;
      if (recordBrandId !== void 0 && recordBrandId !== brandId) {
        result.skipped = true;
        result.skipReason = `Different brand (got ${recordBrandId}, expected ${brandId})`;
        return Response.json(result, { status: 200 });
      }
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
      const { revalidatePath } = await import('next/cache');
      for (const path of pathsToRevalidate) {
        revalidatePath(path);
      }
      result.revalidated = true;
      if (warmCache && siteUrl) {
        result.cacheWarming = {
          success: [],
          failed: []
        };
        const warmingPromises = pathsToRevalidate.map(async (path) => {
          try {
            const url = `${siteUrl}${path}`;
            const response = await fetch(url, {
              method: "GET",
              // Short timeout - we just want to trigger the render
              signal: AbortSignal.timeout(1e4),
              // Avoid caching issues
              headers: {
                "Cache-Control": "no-cache",
                "x-revalidation-warming": "true"
              }
            });
            if (response.ok) {
              result.cacheWarming.success.push(path);
            } else {
              result.cacheWarming.failed.push(path);
            }
          } catch {
            result.cacheWarming.failed.push(path);
          }
        });
        await Promise.race([
          Promise.all(warmingPromises),
          new Promise((resolve) => setTimeout(resolve, 15e3))
          // 15s max
        ]);
      }
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
function getSlug(record) {
  return record.slug ?? record.url_slug ?? record.id ?? "";
}
var commonPathResolvers = {
  /**
   * Blog post path resolver
   * Revalidates: /blog, /blog/[slug], /sitemap.xml
   */
  blogPost: (record) => {
    const slug = getSlug(record);
    return ["/blog", `/blog/${slug}`, "/sitemap.xml"];
  },
  /**
   * Team member path resolver
   * Revalidates: /team, /team/[slug], /about (if team is shown there), /sitemap.xml
   */
  teamMember: (record) => {
    const slug = getSlug(record);
    return ["/team", `/team/${slug}`, "/about", "/sitemap.xml"];
  },
  /**
   * Service path resolver
   * Revalidates: /services, /services/[slug], /, /sitemap.xml
   */
  service: (record) => {
    const slug = getSlug(record);
    return ["/services", `/services/${slug}`, "/", "/sitemap.xml"];
  }
};

export { BRAND_IDS, REVALIDATION_SECRET_HEADER, commonPathResolvers, createRevalidationHandler, getSlug };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map