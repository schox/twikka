/**
 * Blog Content Types for Cross-Project Content Delivery
 *
 * These types are component-friendly nested structures.
 * The package transforms flat RPC results into these shapes.
 */

// Brand IDs for the multi-brand system
export const BRAND_IDS = {
  FALL: 1,
  TWIKKA: 2,
  COUPLE_TOOLS: 3,
} as const;

export type BrandId = (typeof BRAND_IDS)[keyof typeof BRAND_IDS];

// Nested structures for component-friendly usage
export interface BlogTagRef {
  name: string;
  slug: string;
}

export interface BlogCategoryRef {
  name: string;
  slug: string;
}

export interface BlogAuthorRef {
  firstName: string;
  lastName: string;
  image: string | null;
  bio: string | null;
}

// Blog post as returned by getBlogPosts
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  contentHtml: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  featured: boolean;
  author: BlogAuthorRef | null;
  category: BlogCategoryRef | null;
  tags: BlogTagRef[];
}

// Full blog post as returned by getBlogPostBySlug (includes lexical content)
export interface BlogPostFull extends BlogPost {
  lexicalContent: Record<string, unknown> | null;
}

// Blog category with post count
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

// Blog tag with post count
export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

// Featured post (subset of BlogPost fields)
export interface FeaturedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: string | null;
  author: BlogAuthorRef | null;
  category: BlogCategoryRef | null;
}

// Related post (subset of BlogPost fields)
export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: string | null;
  category: BlogCategoryRef | null;
}

// Search result
export interface BlogSearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  category: BlogCategoryRef | null;
  rank: number;
}

// Author with post count
export interface BlogAuthor {
  id: number;
  firstName: string;
  lastName: string;
  bio: string | null;
  image: string | null;
  postCount: number;
}

// ============================================================================
// Raw RPC return types (internal use only)
// ============================================================================

/** @internal */
export interface RpcBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  content_html: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  published_at: string | null;
  updated_at: string | null;
  featured: boolean;
  author_first_name: string | null;
  author_last_name: string | null;
  author_image: string | null;
  author_bio: string | null;
  category_name: string | null;
  category_slug: string | null;
  tags: Array<{ name: string; slug: string }> | null;
}

/** @internal */
export interface RpcBlogPostFull extends RpcBlogPost {
  lexical_content: Record<string, unknown> | null;
}

/** @internal */
export interface RpcBlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
}

/** @internal */
export interface RpcBlogTag {
  id: number;
  name: string;
  slug: string;
  post_count: number;
}

/** @internal */
export interface RpcFeaturedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  published_at: string | null;
  author_first_name: string | null;
  author_last_name: string | null;
  category_name: string | null;
  category_slug: string | null;
}

/** @internal */
export interface RpcRelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
}

/** @internal */
export interface RpcBlogSearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
  rank: number;
}

/** @internal */
export interface RpcBlogAuthor {
  id: number;
  first_name: string;
  last_name: string;
  bio: string | null;
  image: string | null;
  post_count: number;
}

// ============================================================================
// Options and Config Types
// ============================================================================

export interface GetBlogPostsOptions {
  brandId: BrandId;
  limit?: number;
  offset?: number;
  categorySlug?: string;
  tagSlug?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ContentClientConfig {
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  /** @deprecated Use supabasePublishableKey instead */
  supabaseAnonKey?: string;
}

/**
 * Get the Novansa Supabase URL from environment variables.
 * Falls back to a deprecation warning in development if not set.
 */
export function getNovansaSupabaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ??
    process.env.NOVANSA_SUPABASE_URL;

  if (!url) {
    throw new Error(
      "Novansa Supabase URL is required for content package. " +
        "Set NEXT_PUBLIC_NOVANSA_SUPABASE_URL or NOVANSA_SUPABASE_URL environment variable."
    );
  }

  return url;
}

/**
 * Get the Novansa Supabase publishable key from environment variables.
 * Falls back to a deprecation warning in development if not set.
 */
export function getNovansaSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NOVANSA_SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error(
      "Novansa Supabase publishable key is required for content package. " +
        "Set NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY or NOVANSA_SUPABASE_PUBLISHABLE_KEY environment variable."
    );
  }

  return key;
}
