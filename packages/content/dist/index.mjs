import { createClient } from '@supabase/supabase-js';

// src/types.ts
var BRAND_IDS = {
  FALL: 1,
  TWIKKA: 2,
  COUPLE_TOOLS: 3
};
function getNovansaSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ?? process.env.NOVANSA_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "Novansa Supabase URL is required for content package. Set NEXT_PUBLIC_NOVANSA_SUPABASE_URL or NOVANSA_SUPABASE_URL environment variable."
    );
  }
  return url;
}
function getNovansaSupabasePublishableKey() {
  const key = process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NOVANSA_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Novansa Supabase publishable key is required for content package. Set NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY or NOVANSA_SUPABASE_PUBLISHABLE_KEY environment variable."
    );
  }
  return key;
}
var contentClient = null;
function getContentClient(config) {
  if (contentClient) {
    return contentClient;
  }
  const supabaseUrl = config?.supabaseUrl ?? getNovansaSupabaseUrl();
  const supabaseKey = config?.supabasePublishableKey ?? config?.supabaseAnonKey ?? // deprecated fallback
  getNovansaSupabasePublishableKey();
  contentClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  return contentClient;
}
function createContentClient(config) {
  const supabaseUrl = config?.supabaseUrl ?? getNovansaSupabaseUrl();
  const supabaseKey = config?.supabasePublishableKey ?? config?.supabaseAnonKey ?? // deprecated fallback
  getNovansaSupabasePublishableKey();
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
function resetContentClient() {
  contentClient = null;
}

// src/blog.ts
function transformCategory(categoryName, categorySlug) {
  if (!categoryName || !categorySlug) return null;
  return { name: categoryName, slug: categorySlug };
}
function transformAuthor(firstName, lastName, image, bio) {
  if (!firstName && !lastName) return null;
  return {
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    image,
    bio
  };
}
function transformBlogPost(rpc) {
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
    tags: rpc.tags ?? []
  };
}
function transformBlogPostFull(rpc) {
  return {
    ...transformBlogPost(rpc),
    lexicalContent: rpc.lexical_content
  };
}
function transformBlogCategory(rpc) {
  return {
    id: rpc.id,
    name: rpc.name,
    slug: rpc.slug,
    description: rpc.description,
    postCount: rpc.post_count
  };
}
function transformBlogTag(rpc) {
  return {
    id: rpc.id,
    name: rpc.name,
    slug: rpc.slug,
    postCount: rpc.post_count
  };
}
function transformFeaturedPost(rpc) {
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
    category: transformCategory(rpc.category_name, rpc.category_slug)
  };
}
function transformRelatedPost(rpc) {
  return {
    id: rpc.id,
    title: rpc.title,
    slug: rpc.slug,
    excerpt: rpc.excerpt,
    coverImageUrl: rpc.cover_image_url,
    coverImageAlt: rpc.cover_image_alt,
    publishedAt: rpc.published_at,
    category: transformCategory(rpc.category_name, rpc.category_slug)
  };
}
function transformSearchResult(rpc) {
  return {
    id: rpc.id,
    title: rpc.title,
    slug: rpc.slug,
    excerpt: rpc.excerpt,
    coverImageUrl: rpc.cover_image_url,
    publishedAt: rpc.published_at,
    category: transformCategory(rpc.category_name, rpc.category_slug),
    rank: rpc.rank
  };
}
function transformBlogAuthor(rpc) {
  return {
    id: rpc.id,
    firstName: rpc.first_name,
    lastName: rpc.last_name,
    bio: rpc.bio,
    image: rpc.image,
    postCount: rpc.post_count
  };
}
async function getBlogPosts(options, client) {
  const supabase = client ?? getContentClient();
  const { brandId, limit = 10, offset = 0, categorySlug, tagSlug } = options;
  const [postsResult, countResult] = await Promise.all([
    supabase.rpc("get_blog_posts", {
      p_brand_id: brandId,
      p_limit: limit,
      p_offset: offset,
      p_category_slug: categorySlug ?? null,
      p_tag_slug: tagSlug ?? null
    }),
    supabase.rpc("get_blog_post_count", {
      p_brand_id: brandId,
      p_category_slug: categorySlug ?? null,
      p_tag_slug: tagSlug ?? null
    })
  ]);
  if (postsResult.error) {
    throw new Error(`Failed to fetch blog posts: ${postsResult.error.message}`);
  }
  if (countResult.error) {
    throw new Error(
      `Failed to fetch blog post count: ${countResult.error.message}`
    );
  }
  const rpcPosts = postsResult.data ?? [];
  const posts = rpcPosts.map(transformBlogPost);
  const total = countResult.data ?? 0;
  return {
    data: posts,
    total,
    limit,
    offset,
    hasMore: offset + posts.length < total
  };
}
async function getBlogPostBySlug(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_blog_post_by_slug", {
    p_brand_id: options.brandId,
    p_slug: options.slug
  });
  if (error) {
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }
  if (!data || data.length === 0) {
    return null;
  }
  return transformBlogPostFull(data[0]);
}
async function getBlogCategories(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_blog_categories", {
    p_brand_id: options.brandId,
    p_show_in_blog_only: options.showInBlogOnly ?? true
  });
  if (error) {
    throw new Error(`Failed to fetch blog categories: ${error.message}`);
  }
  const rpcCategories = data ?? [];
  return rpcCategories.map(transformBlogCategory);
}
async function getBlogTags(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_blog_tags", {
    p_brand_id: options.brandId
  });
  if (error) {
    throw new Error(`Failed to fetch blog tags: ${error.message}`);
  }
  const rpcTags = data ?? [];
  return rpcTags.map(transformBlogTag);
}
async function getFeaturedPosts(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_featured_posts", {
    p_brand_id: options.brandId,
    p_limit: options.limit ?? 3
  });
  if (error) {
    throw new Error(`Failed to fetch featured posts: ${error.message}`);
  }
  const rpcPosts = data ?? [];
  return rpcPosts.map(transformFeaturedPost);
}
async function getRelatedPosts(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_related_posts", {
    p_brand_id: options.brandId,
    p_post_id: options.postId,
    p_limit: options.limit ?? 3
  });
  if (error) {
    throw new Error(`Failed to fetch related posts: ${error.message}`);
  }
  const rpcPosts = data ?? [];
  return rpcPosts.map(transformRelatedPost);
}
async function searchBlogPosts(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("search_blog_posts", {
    p_brand_id: options.brandId,
    p_query: options.query,
    p_limit: options.limit ?? 10
  });
  if (error) {
    throw new Error(`Failed to search blog posts: ${error.message}`);
  }
  const rpcResults = data ?? [];
  return rpcResults.map(transformSearchResult);
}
async function getBlogAuthors(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_blog_authors", {
    p_brand_id: options.brandId
  });
  if (error) {
    throw new Error(`Failed to fetch blog authors: ${error.message}`);
  }
  const rpcAuthors = data ?? [];
  return rpcAuthors.map(transformBlogAuthor);
}
async function getBlogPostCount(options, client) {
  const supabase = client ?? getContentClient();
  const { data, error } = await supabase.rpc("get_blog_post_count", {
    p_brand_id: options.brandId,
    p_category_slug: options.categorySlug ?? null,
    p_tag_slug: options.tagSlug ?? null
  });
  if (error) {
    throw new Error(`Failed to fetch blog post count: ${error.message}`);
  }
  return data ?? 0;
}

export { BRAND_IDS, createContentClient, getBlogAuthors, getBlogCategories, getBlogPostBySlug, getBlogPostCount, getBlogPosts, getBlogTags, getContentClient, getFeaturedPosts, getNovansaSupabasePublishableKey, getNovansaSupabaseUrl, getRelatedPosts, resetContentClient, searchBlogPosts };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map