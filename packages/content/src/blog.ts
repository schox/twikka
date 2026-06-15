import { SupabaseClient } from "@supabase/supabase-js";
import { getContentClient } from "./client";
import {
  BrandId,
  BlogPost,
  BlogPostFull,
  BlogCategory,
  BlogTag,
  FeaturedPost,
  RelatedPost,
  BlogSearchResult,
  BlogAuthor,
  BlogCategoryRef,
  BlogAuthorRef,
  GetBlogPostsOptions,
  PaginatedResult,
  // RPC types (internal)
  RpcBlogPost,
  RpcBlogPostFull,
  RpcBlogCategory,
  RpcBlogTag,
  RpcFeaturedPost,
  RpcRelatedPost,
  RpcBlogSearchResult,
  RpcBlogAuthor,
} from "./types";

// ============================================================================
// Transformation helpers (RPC flat → Component nested)
// ============================================================================

function transformCategory(
  categoryName: string | null,
  categorySlug: string | null
): BlogCategoryRef | null {
  if (!categoryName || !categorySlug) return null;
  return { name: categoryName, slug: categorySlug };
}

function transformAuthor(
  firstName: string | null,
  lastName: string | null,
  image: string | null,
  bio: string | null
): BlogAuthorRef | null {
  if (!firstName && !lastName) return null;
  return {
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    image,
    bio,
  };
}

function transformBlogPost(rpc: RpcBlogPost): BlogPost {
  return {
    id: rpc.id,
    title: rpc.title,
    slug: rpc.slug,
    excerpt: rpc.excerpt,
    content: rpc.content,
    contentHtml: rpc.content_html,
    coverImageUrl: rpc.cover_image_url,
    coverImageAlt: rpc.cover_image_alt,
    publishedAt: rpc.published_at,
    updatedAt: rpc.updated_at,
    featured: rpc.featured,
    author: transformAuthor(
      rpc.author_first_name,
      rpc.author_last_name,
      rpc.author_image,
      rpc.author_bio
    ),
    category: transformCategory(rpc.category_name, rpc.category_slug),
    tags: rpc.tags ?? [],
  };
}

function transformBlogPostFull(rpc: RpcBlogPostFull): BlogPostFull {
  return {
    ...transformBlogPost(rpc),
    lexicalContent: rpc.lexical_content,
  };
}

function transformBlogCategory(rpc: RpcBlogCategory): BlogCategory {
  return {
    id: rpc.id,
    name: rpc.name,
    slug: rpc.slug,
    description: rpc.description,
    postCount: rpc.post_count,
  };
}

function transformBlogTag(rpc: RpcBlogTag): BlogTag {
  return {
    id: rpc.id,
    name: rpc.name,
    slug: rpc.slug,
    postCount: rpc.post_count,
  };
}

function transformFeaturedPost(rpc: RpcFeaturedPost): FeaturedPost {
  return {
    id: rpc.id,
    title: rpc.title,
    slug: rpc.slug,
    excerpt: rpc.excerpt,
    coverImageUrl: rpc.cover_image_url,
    coverImageAlt: rpc.cover_image_alt,
    publishedAt: rpc.published_at,
    author: transformAuthor(
      rpc.author_first_name,
      rpc.author_last_name,
      null,
      null
    ),
    category: transformCategory(rpc.category_name, rpc.category_slug),
  };
}

function transformRelatedPost(rpc: RpcRelatedPost): RelatedPost {
  return {
    id: rpc.id,
    title: rpc.title,
    slug: rpc.slug,
    excerpt: rpc.excerpt,
    coverImageUrl: rpc.cover_image_url,
    coverImageAlt: rpc.cover_image_alt,
    publishedAt: rpc.published_at,
    category: transformCategory(rpc.category_name, rpc.category_slug),
  };
}

function transformSearchResult(rpc: RpcBlogSearchResult): BlogSearchResult {
  return {
    id: rpc.id,
    title: rpc.title,
    slug: rpc.slug,
    excerpt: rpc.excerpt,
    coverImageUrl: rpc.cover_image_url,
    publishedAt: rpc.published_at,
    category: transformCategory(rpc.category_name, rpc.category_slug),
    rank: rpc.rank,
  };
}

function transformBlogAuthor(rpc: RpcBlogAuthor): BlogAuthor {
  return {
    id: rpc.id,
    firstName: rpc.first_name,
    lastName: rpc.last_name,
    bio: rpc.bio,
    image: rpc.image,
    postCount: rpc.post_count,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get published blog posts for a brand with pagination and optional filtering
 */
export async function getBlogPosts(
  options: GetBlogPostsOptions,
  client?: SupabaseClient
): Promise<PaginatedResult<BlogPost>> {
  const supabase = client ?? getContentClient();

  const { brandId, limit = 10, offset = 0, categorySlug, tagSlug } = options;

  // Fetch posts and count in parallel
  const [postsResult, countResult] = await Promise.all([
    supabase.rpc("get_blog_posts", {
      p_brand_id: brandId,
      p_limit: limit,
      p_offset: offset,
      p_category_slug: categorySlug ?? null,
      p_tag_slug: tagSlug ?? null,
    }),
    supabase.rpc("get_blog_post_count", {
      p_brand_id: brandId,
      p_category_slug: categorySlug ?? null,
      p_tag_slug: tagSlug ?? null,
    }),
  ]);

  if (postsResult.error) {
    throw new Error(`Failed to fetch blog posts: ${postsResult.error.message}`);
  }

  if (countResult.error) {
    throw new Error(
      `Failed to fetch blog post count: ${countResult.error.message}`
    );
  }

  const rpcPosts = (postsResult.data ?? []) as RpcBlogPost[];
  const posts = rpcPosts.map(transformBlogPost);
  const total = countResult.data ?? 0;

  return {
    data: posts,
    total,
    limit,
    offset,
    hasMore: offset + posts.length < total,
  };
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(
  options: { brandId: BrandId; slug: string },
  client?: SupabaseClient
): Promise<BlogPostFull | null> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_blog_post_by_slug", {
    p_brand_id: options.brandId,
    p_slug: options.slug,
  });

  if (error) {
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return transformBlogPostFull(data[0] as RpcBlogPostFull);
}

/**
 * Get blog categories for a brand
 */
export async function getBlogCategories(
  options: { brandId: BrandId; showInBlogOnly?: boolean },
  client?: SupabaseClient
): Promise<BlogCategory[]> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_blog_categories", {
    p_brand_id: options.brandId,
    p_show_in_blog_only: options.showInBlogOnly ?? true,
  });

  if (error) {
    throw new Error(`Failed to fetch blog categories: ${error.message}`);
  }

  const rpcCategories = (data ?? []) as RpcBlogCategory[];
  return rpcCategories.map(transformBlogCategory);
}

/**
 * Get blog tags for a brand
 */
export async function getBlogTags(
  options: { brandId: BrandId },
  client?: SupabaseClient
): Promise<BlogTag[]> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_blog_tags", {
    p_brand_id: options.brandId,
  });

  if (error) {
    throw new Error(`Failed to fetch blog tags: ${error.message}`);
  }

  const rpcTags = (data ?? []) as RpcBlogTag[];
  return rpcTags.map(transformBlogTag);
}

/**
 * Get featured posts for a brand
 */
export async function getFeaturedPosts(
  options: { brandId: BrandId; limit?: number },
  client?: SupabaseClient
): Promise<FeaturedPost[]> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_featured_posts", {
    p_brand_id: options.brandId,
    p_limit: options.limit ?? 3,
  });

  if (error) {
    throw new Error(`Failed to fetch featured posts: ${error.message}`);
  }

  const rpcPosts = (data ?? []) as RpcFeaturedPost[];
  return rpcPosts.map(transformFeaturedPost);
}

/**
 * Get related posts for a given post
 */
export async function getRelatedPosts(
  options: { brandId: BrandId; postId: number; limit?: number },
  client?: SupabaseClient
): Promise<RelatedPost[]> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_related_posts", {
    p_brand_id: options.brandId,
    p_post_id: options.postId,
    p_limit: options.limit ?? 3,
  });

  if (error) {
    throw new Error(`Failed to fetch related posts: ${error.message}`);
  }

  const rpcPosts = (data ?? []) as RpcRelatedPost[];
  return rpcPosts.map(transformRelatedPost);
}

/**
 * Search blog posts using full-text search
 */
export async function searchBlogPosts(
  options: { brandId: BrandId; query: string; limit?: number },
  client?: SupabaseClient
): Promise<BlogSearchResult[]> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("search_blog_posts", {
    p_brand_id: options.brandId,
    p_query: options.query,
    p_limit: options.limit ?? 10,
  });

  if (error) {
    throw new Error(`Failed to search blog posts: ${error.message}`);
  }

  const rpcResults = (data ?? []) as RpcBlogSearchResult[];
  return rpcResults.map(transformSearchResult);
}

/**
 * Get blog authors for a brand
 */
export async function getBlogAuthors(
  options: { brandId: BrandId },
  client?: SupabaseClient
): Promise<BlogAuthor[]> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_blog_authors", {
    p_brand_id: options.brandId,
  });

  if (error) {
    throw new Error(`Failed to fetch blog authors: ${error.message}`);
  }

  const rpcAuthors = (data ?? []) as RpcBlogAuthor[];
  return rpcAuthors.map(transformBlogAuthor);
}

/**
 * Get total count of published posts for a brand
 */
export async function getBlogPostCount(
  options: { brandId: BrandId; categorySlug?: string; tagSlug?: string },
  client?: SupabaseClient
): Promise<number> {
  const supabase = client ?? getContentClient();

  const { data, error } = await supabase.rpc("get_blog_post_count", {
    p_brand_id: options.brandId,
    p_category_slug: options.categorySlug ?? null,
    p_tag_slug: options.tagSlug ?? null,
  });

  if (error) {
    throw new Error(`Failed to fetch blog post count: ${error.message}`);
  }

  return data ?? 0;
}
