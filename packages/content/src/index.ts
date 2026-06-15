/**
 * @novansa/content
 *
 * Shared content delivery package for cross-project blog access.
 * Connects to the Novansa Supabase project to fetch blog content
 * for any brand in the multi-brand system.
 *
 * @example
 * ```typescript
 * import { getBlogPosts, BRAND_IDS } from '@novansa/content';
 *
 * // Fetch posts for Couple Tools brand
 * const result = await getBlogPosts({
 *   brandId: BRAND_IDS.COUPLE_TOOLS,
 *   limit: 10,
 * });
 * ```
 */

// Types - Component-friendly nested structures
export type {
  BrandId,
  BlogTagRef,
  BlogCategoryRef,
  BlogAuthorRef,
  BlogPost,
  BlogPostFull,
  BlogCategory,
  BlogTag,
  FeaturedPost,
  RelatedPost,
  BlogSearchResult,
  BlogAuthor,
  GetBlogPostsOptions,
  PaginatedResult,
  ContentClientConfig,
} from "./types";

// Constants
export { BRAND_IDS } from "./types";

// Environment variable helpers
export {
  getNovansaSupabaseUrl,
  getNovansaSupabasePublishableKey,
} from "./types";

// Client utilities
export {
  getContentClient,
  createContentClient,
  resetContentClient,
} from "./client";

// Blog functions
export {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getBlogTags,
  getFeaturedPosts,
  getRelatedPosts,
  searchBlogPosts,
  getBlogAuthors,
  getBlogPostCount,
} from "./blog";
