// Service for fetching blog data from Twikka Supabase
// Uses the new blog schema per BLOG-DISTRIBUTION.md
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';

// Default language for fallback
const DEFAULT_LANGUAGE = 'en';

// Types matching the new schema
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  content_html: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  author_bio: string | null;
  author_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  is_featured: boolean;
  reading_time_minutes: number | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
  // i18n fields
  language_code: string;
  canonical_id: number | null;
  is_original: boolean;
  translated_from_id: number | null;
  translation_status: 'original' | 'ai_translated' | 'human_reviewed' | 'human_edited';
  // Joined data
  categories?: BlogCategory[];
  tags?: BlogTag[];
}

// Alternate language version for hreflang
export interface BlogPostAlternate {
  languageCode: string;
  slug: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

// Helper to get Supabase client - returns null if not configured
async function getSupabase() {
  if (typeof window === 'undefined') {
    return createServerClient();
  }
  return createBrowserClient();
}

export async function getBlogPosts(
  limit?: number,
  offset?: number,
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogPost[]> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return [];

    let query = supabase
      .from('blog_post')
      .select(`
        *,
        categories:blog_post_category(
          category:blog_category(id, name, slug)
        ),
        tags:blog_post_tag(
          tag:blog_tag(id, name, slug)
        )
      `)
      .eq('status', 'published')
      .eq('language_code', locale)
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + (limit ?? 10) - 1);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    // If no posts found for requested locale and it's not English, fall back to English
    if ((!posts || posts.length === 0) && locale !== DEFAULT_LANGUAGE) {
      return getBlogPosts(limit, offset, DEFAULT_LANGUAGE);
    }

    // Transform the data to flatten the nested structure
    return ((posts as any[]) ?? []).map(post => ({
      ...post,
      categories: post.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
      tags: post.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
    })) as BlogPost[];
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
}

export async function getBlogPostsWithPagination(
  page: number = 1,
  postsPerPage: number = 6,
  locale: string = DEFAULT_LANGUAGE,
) {
  const offset = (page - 1) * postsPerPage;

  try {
    const supabase = await getSupabase();
    if (!supabase) return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };

    const posts = await getBlogPosts(postsPerPage, offset, locale);

    const { count, error: countError } = await supabase
      .from('blog_post')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('language_code', locale);

    if (countError) {
      console.error('Error getting post count:', countError);
      return { posts, totalPosts: 0, totalPages: 0, currentPage: page };
    }

    const totalPosts = count ?? 0;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    return {
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error('Error in getBlogPostsWithPagination:', error);
    return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };
  }
}

export async function getBlogPostBySlug(
  slug: string,
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogPost | null> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return null;

    // First try to find the post in the requested locale
    const { data: post, error } = await supabase
      .from('blog_post')
      .select(`
        *,
        categories:blog_post_category(
          category:blog_category(id, name, slug)
        ),
        tags:blog_post_tag(
          tag:blog_tag(id, name, slug)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('language_code', locale)
      .single();

    if (!error && post) {
      return {
        ...post,
        categories: post.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
        tags: post.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
      } as BlogPost;
    }

    // If not found and locale is not English, try to find in English
    if (locale !== DEFAULT_LANGUAGE) {
      const { data: englishPost, error: englishError } = await supabase
        .from('blog_post')
        .select(`
          *,
          categories:blog_post_category(
            category:blog_category(id, name, slug)
          ),
          tags:blog_post_tag(
            tag:blog_tag(id, name, slug)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('language_code', DEFAULT_LANGUAGE)
        .single();

      if (!englishError && englishPost) {
        // Check if there's a translation in the requested locale
        const canonicalId = englishPost.canonical_id;
        if (canonicalId) {
          const { data: translatedPost } = await supabase
            .from('blog_post')
            .select(`
              *,
              categories:blog_post_category(
                category:blog_category(id, name, slug)
              ),
              tags:blog_post_tag(
                tag:blog_tag(id, name, slug)
              )
            `)
            .eq('canonical_id', canonicalId)
            .eq('status', 'published')
            .eq('language_code', locale)
            .single();

          if (translatedPost) {
            return {
              ...translatedPost,
              categories: translatedPost.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
              tags: translatedPost.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
            } as BlogPost;
          }
        }
        // No translation available, return English version
        return {
          ...englishPost,
          categories: englishPost.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
          tags: englishPost.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
        } as BlogPost;
      }
    }

    // Log error only if we truly couldn't find anything
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching blog post by slug:', error);
    }
    return null;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
}

// Get all available translations of a post (for hreflang tags)
export async function getBlogPostAlternates(
  canonicalId: number,
): Promise<BlogPostAlternate[]> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const { data: posts, error } = await supabase
      .from('blog_post')
      .select('language_code, slug')
      .eq('canonical_id', canonicalId)
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching blog post alternates:', error);
      return [];
    }

    return (posts ?? []).map(p => ({
      languageCode: p.language_code,
      slug: p.slug,
    }));
  } catch (error) {
    console.error('Error in getBlogPostAlternates:', error);
    return [];
  }
}

export async function getBlogCategories(
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogCategory[]> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const { data: categories, error } = await supabase
      .from('blog_category')
      .select('*')
      .eq('is_active', true)
      .eq('language_code', locale)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }

    // Fallback to English if no categories found for locale
    if ((!categories || categories.length === 0) && locale !== DEFAULT_LANGUAGE) {
      return getBlogCategories(DEFAULT_LANGUAGE);
    }

    return (categories as BlogCategory[]) || [];
  } catch (error) {
    console.error('Error in getBlogCategories:', error);
    return [];
  }
}

export async function getBlogTags(
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogTag[]> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return [];

    const { data: tags, error } = await supabase
      .from('blog_tag')
      .select('*')
      .eq('language_code', locale)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching blog tags:', error);
      return [];
    }

    // Fallback to English if no tags found for locale
    if ((!tags || tags.length === 0) && locale !== DEFAULT_LANGUAGE) {
      return getBlogTags(DEFAULT_LANGUAGE);
    }

    return (tags as BlogTag[]) || [];
  } catch (error) {
    console.error('Error in getBlogTags:', error);
    return [];
  }
}

export async function getFeaturedPost(
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogPost | null> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return null;

    const { data: post, error } = await supabase
      .from('blog_post')
      .select(`
        *,
        categories:blog_post_category(
          category:blog_category(id, name, slug)
        ),
        tags:blog_post_tag(
          tag:blog_tag(id, name, slug)
        )
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .eq('language_code', locale)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching featured post:', error);
      return null;
    }

    // Fallback to English if no featured post for locale
    if (!post && locale !== DEFAULT_LANGUAGE) {
      return getFeaturedPost(DEFAULT_LANGUAGE);
    }

    if (!post) return null;

    // Transform the data
    return {
      ...post,
      categories: post.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
      tags: post.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
    } as BlogPost;
  } catch (error) {
    console.error('Error in getFeaturedPost:', error);
    return null;
  }
}

export async function getBlogPostsByCategory(
  categorySlug: string,
  page: number = 1,
  postsPerPage: number = 12,
  locale: string = DEFAULT_LANGUAGE,
) {
  const offset = (page - 1) * postsPerPage;

  try {
    const supabase = await getSupabase();
    if (!supabase) return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
    };

    // Get category ID from slug (in the requested locale)
    const { data: category, error: categoryError } = await supabase
      .from('blog_category')
      .select('id')
      .eq('slug', categorySlug)
      .eq('language_code', locale)
      .single();

    if (categoryError || !category) {
      // Try English fallback
      if (locale !== DEFAULT_LANGUAGE) {
        return getBlogPostsByCategory(categorySlug, page, postsPerPage, DEFAULT_LANGUAGE);
      }
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    // Get post IDs for this category
    const { data: postCategories, error: pcError } = await supabase
      .from('blog_post_category')
      .select('post_id')
      .eq('category_id', category.id);

    if (pcError || !postCategories || postCategories.length === 0) {
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const postIds = postCategories.map(pc => pc.post_id);

    // Get count of published posts in this locale
    const { count } = await supabase
      .from('blog_post')
      .select('*', { count: 'exact', head: true })
      .in('id', postIds)
      .eq('status', 'published')
      .eq('language_code', locale);

    const totalPosts = count ?? 0;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // Fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from('blog_post')
      .select(`
        *,
        categories:blog_post_category(
          category:blog_category(id, name, slug)
        ),
        tags:blog_post_tag(
          tag:blog_tag(id, name, slug)
        )
      `)
      .in('id', postIds)
      .eq('status', 'published')
      .eq('language_code', locale)
      .order('published_at', { ascending: false })
      .range(offset, offset + postsPerPage - 1);

    if (postsError) {
      console.error('Error fetching posts by category:', postsError);
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const posts = ((postsData as any[]) ?? []).map(post => ({
      ...post,
      categories: post.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
      tags: post.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
    })) as BlogPost[];

    return {
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error('Error in getBlogPostsByCategory:', error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}

export async function getBlogPostsByTag(
  tagSlug: string,
  page: number = 1,
  postsPerPage: number = 12,
  locale: string = DEFAULT_LANGUAGE,
) {
  const offset = (page - 1) * postsPerPage;

  try {
    const supabase = await getSupabase();
    if (!supabase) return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
    };

    // Get tag ID from slug (in the requested locale)
    const { data: tag, error: tagError } = await supabase
      .from('blog_tag')
      .select('id')
      .eq('slug', tagSlug)
      .eq('language_code', locale)
      .single();

    if (tagError || !tag) {
      // Try English fallback
      if (locale !== DEFAULT_LANGUAGE) {
        return getBlogPostsByTag(tagSlug, page, postsPerPage, DEFAULT_LANGUAGE);
      }
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    // Get post IDs for this tag
    const { data: postTags, error: ptError } = await supabase
      .from('blog_post_tag')
      .select('post_id')
      .eq('tag_id', tag.id);

    if (ptError || !postTags || postTags.length === 0) {
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const postIds = postTags.map(pt => pt.post_id);

    // Get count of published posts in this locale
    const { count } = await supabase
      .from('blog_post')
      .select('*', { count: 'exact', head: true })
      .in('id', postIds)
      .eq('status', 'published')
      .eq('language_code', locale);

    const totalPosts = count ?? 0;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // Fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from('blog_post')
      .select(`
        *,
        categories:blog_post_category(
          category:blog_category(id, name, slug)
        ),
        tags:blog_post_tag(
          tag:blog_tag(id, name, slug)
        )
      `)
      .in('id', postIds)
      .eq('status', 'published')
      .eq('language_code', locale)
      .order('published_at', { ascending: false })
      .range(offset, offset + postsPerPage - 1);

    if (postsError) {
      console.error('Error fetching posts by tag:', postsError);
      return {
        posts: [],
        totalPosts: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const posts = ((postsData as any[]) ?? []).map(post => ({
      ...post,
      categories: post.categories?.map((c: any) => c.category).filter(Boolean) ?? [],
      tags: post.tags?.map((t: any) => t.tag).filter(Boolean) ?? [],
    })) as BlogPost[];

    return {
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error('Error in getBlogPostsByTag:', error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}

export async function getCategoryBySlug(
  slug: string,
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogCategory | null> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return null;

    const { data: category, error } = await supabase
      .from('blog_category')
      .select('*')
      .eq('slug', slug)
      .eq('language_code', locale)
      .single();

    if (error || !category) {
      // Try English fallback
      if (locale !== DEFAULT_LANGUAGE) {
        return getCategoryBySlug(slug, DEFAULT_LANGUAGE);
      }
      return null;
    }

    return category as BlogCategory;
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
}

export async function getTagBySlug(
  slug: string,
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogTag | null> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return null;

    const { data: tag, error } = await supabase
      .from('blog_tag')
      .select('*')
      .eq('slug', slug)
      .eq('language_code', locale)
      .single();

    if (error || !tag) {
      // Try English fallback
      if (locale !== DEFAULT_LANGUAGE) {
        return getTagBySlug(slug, DEFAULT_LANGUAGE);
      }
      return null;
    }

    return tag as BlogTag;
  } catch (error) {
    console.error('Error in getTagBySlug:', error);
    return null;
  }
}

export async function getRelatedPosts(
  postId: number,
  limit: number = 3,
  locale: string = DEFAULT_LANGUAGE,
): Promise<BlogPost[]> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return [];

    // Get the current post's categories
    const { data: postCategories } = await supabase
      .from('blog_post_category')
      .select('category_id')
      .eq('post_id', postId);

    if (!postCategories || postCategories.length === 0) {
      // No categories, just get recent posts in same locale
      const { data: posts } = await supabase
        .from('blog_post')
        .select('*')
        .eq('status', 'published')
        .eq('language_code', locale)
        .neq('id', postId)
        .order('published_at', { ascending: false })
        .limit(limit);

      return (posts as BlogPost[]) ?? [];
    }

    const categoryIds = postCategories.map(pc => pc.category_id);

    // Get posts in same categories
    const { data: relatedPostIds } = await supabase
      .from('blog_post_category')
      .select('post_id')
      .in('category_id', categoryIds)
      .neq('post_id', postId);

    if (!relatedPostIds || relatedPostIds.length === 0) {
      return [];
    }

    const uniquePostIds = [...new Set(relatedPostIds.map(r => r.post_id))];

    // Fetch posts in the same locale
    const { data: posts, error } = await supabase
      .from('blog_post')
      .select('*')
      .in('id', uniquePostIds)
      .eq('status', 'published')
      .eq('language_code', locale)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }

    return (posts as BlogPost[]) ?? [];
  } catch (error) {
    console.error('Error in getRelatedPosts:', error);
    return [];
  }
}
