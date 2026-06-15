import { createServiceClient } from './supabase/service';
import { convertContent } from './contentConverters';
import { BRAND_ID } from '@/config/site';

// Category mapping from import categories to existing blog_category IDs
const CATEGORY_MAPPING: Record<string, number> = {
  tips: 13,
  conditions: 14,
  questions: 17,
  treatments: 15,
  'case-histories': 16,
  'common-conditions': 1,
  'diabetic-foot-care': 3,
  'patient-education': 6,
  'preventive-care': 2,
  'sports-injuries': 4,
  'surgical-procedures': 5,
};

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: Array<{ postId: number; error: string }>;
  imageFailures: Array<{ postId: number; originalUrl: string; error: string }>;
  categoryMappingFailures: Array<{ postId: number; categories: string }>;
}

export interface ImportPost {
  id: number;
  Slug: string;
  Title: string;
  Image: string;
  'Image:alt': string;
  'Image Source': string;
  Excerpt: string;
  Content: string;
  Published: boolean;
  'Date Published': string;
  Featured: boolean;
  Author: string;
  'Blog Categories': string;
  'Blog Tags': string;
}

/**
 * Get Supabase service client for migration operations (bypasses RLS)
 */
function getSupabaseClient() {
  return createServiceClient();
}

/**
 * Download image from external URL and upload to Supabase Storage
 */
async function migrateImage(importPostId: number, imageUrl: string): Promise<string | null> {
  if (!imageUrl?.startsWith('http')) {
    return null;
  }

  try {
    console.log(`Downloading image for post ${importPostId}: ${imageUrl}`);

    // Download image from external URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    // Generate filename: post-{id}-cover.{ext}
    const urlParts = imageUrl.split('.');
    const ext = urlParts[urlParts.length - 1]?.split('?')[0]?.toLowerCase() ?? 'jpg';
    const filename = `post-${importPostId}-cover.${ext}`;

    // Get Supabase client and upload to Storage
    const supabase = getSupabaseClient();
    const { error } = await supabase.storage.from('blog-images').upload(filename, imageBuffer, {
      contentType: response.headers.get('content-type') ?? 'image/jpeg',
      upsert: true,
    });

    if (error) {
      throw new Error(`Supabase storage error: ${error.message}`);
    }

    // Return just the filename (not the full URL)
    console.log(`Successfully migrated image for post ${importPostId}: ${filename}`);
    return filename;
  } catch (error) {
    console.error(`Failed to migrate image for post ${importPostId}:`, error);
    throw error;
  }
}

/**
 * Map comma-separated category string to category IDs
 */
function mapCategories(categoriesString: string): number[] {
  if (!categoriesString?.trim()) {
    return [];
  }

  return categoriesString
    .split(',')
    .map(cat => cat.trim().toLowerCase())
    .map(cat => CATEGORY_MAPPING[cat])
    .filter(Boolean);
}

/**
 * Get default author for migrated posts (use Dr. Sarah Mitchell - ID 1)
 */
async function getOrCreateDefaultAuthor(): Promise<number> {
  // For now, use the known author ID to bypass RLS issues
  // In production, this should be properly authenticated
  const defaultAuthorId = 1; // Dr. Sarah Mitchell
  console.log(`Using author ID: ${defaultAuthorId} (Dr. Sarah Mitchell)`);
  return defaultAuthorId;
}

/**
 * Create slug from title if slug is missing
 */
function createSlug(title: string, id: number): string {
  if (!title) {
    return `imported-post-${id}`;
  }

  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) || `imported-post-${id}`
  );
}

/**
 * Migrate a single blog post from import table to blog_post table
 */
async function migrateSinglePost(
  importPost: ImportPost,
  defaultAuthorId: number,
  result: MigrationResult,
): Promise<void> {
  try {
    console.log(`Migrating post ${importPost.id}: ${importPost.Title}`);

    // 1. Migrate image if present
    let coverImageUrl = null;
    const coverImageAlt = importPost['Image:alt'] ?? null;

    if (importPost.Image) {
      try {
        coverImageUrl = await migrateImage(importPost.id, importPost.Image);
      } catch (error) {
        result.imageFailures.push({
          postId: importPost.id,
          originalUrl: importPost.Image,
          error: error instanceof Error ? error.message : String(error),
        });
        // Continue with migration even if image fails
      }
    }

    // 2. Convert content from HTML to all formats
    let contentMarkdown = '';
    let lexicalContent = null;
    let contentHtml = '';

    if (importPost.Content) {
      try {
        const converted = convertContent(importPost.Content, 'html');
        if (converted?.markdownContent) {
          contentMarkdown = converted.markdownContent;
          lexicalContent = converted.lexicalContent;
          contentHtml = converted.htmlContent || importPost.Content;
          console.log(
            `Successfully converted content for post ${importPost.id} - Markdown: ${contentMarkdown.length} chars`,
          );
        } else {
          console.warn(
            `Content conversion returned empty for post ${importPost.id}, using fallback`,
          );
          // Fallback: simple HTML to markdown conversion
          contentMarkdown = importPost.Content.replace(/<h([1-6])>/g, '\n# ')
            .replace(/<\/h[1-6]>/g, '\n\n')
            .replace(/<p>/g, '\n')
            .replace(/<\/p>/g, '\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]*>/g, '')
            .trim();
          contentHtml = importPost.Content;
          lexicalContent = null;
        }
      } catch (error) {
        console.error(`Content conversion failed for post ${importPost.id}:`, error);
        // Fallback: simple HTML to markdown conversion
        contentMarkdown = importPost.Content.replace(/<h([1-6])>/g, '\n# ')
          .replace(/<\/h[1-6]>/g, '\n\n')
          .replace(/<p>/g, '\n')
          .replace(/<\/p>/g, '\n')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<[^>]*>/g, '')
          .trim();
        contentHtml = importPost.Content;
        lexicalContent = null;
      }
    }

    // Ensure we have some content
    if (!contentMarkdown && importPost.Content) {
      contentMarkdown = importPost.Content;
      contentHtml = importPost.Content;
    }

    // 3. Map categories
    const categoryIds = mapCategories(importPost['Blog Categories']);
    const primaryCategoryId = categoryIds[0] || null;

    if (importPost['Blog Categories'] && categoryIds.length === 0) {
      result.categoryMappingFailures.push({
        postId: importPost.id,
        categories: importPost['Blog Categories'],
      });
    }

    // 4. Prepare post data
    const slug = importPost.Slug || createSlug(importPost.Title, importPost.id);
    const title = importPost.Title || `Imported Post ${importPost.id}`;
    const excerpt = importPost.Excerpt || contentMarkdown.substring(0, 200).trim() || '';

    // 5. Insert blog post
    const supabase = getSupabaseClient();
    const { data: newPost, error } = await supabase
      .from('blog_post')
      .insert({
        title,
        slug,
        content: contentMarkdown,
        lexical_content: lexicalContent,
        content_html: contentHtml,
        excerpt,
        cover_image_url: coverImageUrl,
        cover_image_alt: coverImageAlt,
        author_id: defaultAuthorId,
        category_id: primaryCategoryId,
        brand: BRAND_ID,
        status: 'published', // Make all migrated posts published for now
        published_at: importPost['Date Published'] || new Date().toISOString(),
        featured: importPost.Featured || false,
        migrated_from_import_id: importPost.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    // 6. Create additional category relationships if multiple categories
    if (categoryIds.length > 1) {
      const additionalCategories = categoryIds.slice(1);
      const categoryRelations = additionalCategories.map(catId => ({
        post_id: newPost.id,
        category_id: catId,
      }));

      const { error: relationError } = await supabase
        .from('blog_post_category')
        .insert(categoryRelations);

      if (relationError) {
        console.warn(
          `Failed to create additional category relations for post ${importPost.id}:`,
          relationError,
        );
      }
    }

    result.migratedCount++;
    console.log(`Successfully migrated post ${importPost.id}`);
  } catch (error) {
    result.errors.push({
      postId: importPost.id,
      error: error instanceof Error ? error.message : String(error),
    });
    console.error(`Failed to migrate post ${importPost.id}:`, error);
  }
}

/**
 * Main migration function - migrate all blog posts from import table
 */
export async function migrateBlogPosts(dryRun: boolean = false): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errors: [],
    imageFailures: [],
    categoryMappingFailures: [],
  };

  try {
    console.log('Starting blog post migration...');

    if (!dryRun) {
      // 1. Clear existing migrated blog_post entries for brand = 1
      console.log('Clearing existing migrated blog posts for FALL brand...');
      const supabase = getSupabaseClient();
      const { error: deleteError } = await supabase
        .from('blog_post')
        .delete()
        .eq('brand', BRAND_ID)
        .not('migrated_from_import_id', 'is', null);

      if (deleteError) {
        throw new Error(`Failed to clear existing posts: ${deleteError.message}`);
      }
    }

    // 2. Get default author ID
    console.log('Getting/creating default author...');
    const defaultAuthorId = await getOrCreateDefaultAuthor();

    // 3. Fetch all import posts
    console.log('Fetching import posts...');
    const supabase = getSupabaseClient();
    const { data: importPosts, error: fetchError } = await supabase
      .from('blog_import_posts')
      .select('*')
      .order('id');

    if (fetchError) {
      throw new Error(`Failed to fetch import posts: ${fetchError.message}`);
    }

    if (!importPosts || importPosts.length === 0) {
      throw new Error('No import posts found');
    }

    console.log(`Found ${importPosts.length} posts to migrate`);

    // 4. Process each post
    for (const importPost of importPosts) {
      if (dryRun) {
        console.log(`[DRY RUN] Would migrate post ${importPost.id}: ${importPost.Title}`);
        result.migratedCount++;
      } else {
        await migrateSinglePost(importPost as ImportPost, defaultAuthorId, result);
      }
    }

    result.success = result.errors.length === 0;

    // Log summary
    console.log('\n=== Migration Summary ===');
    console.log(`Total posts: ${importPosts.length}`);
    console.log(`Successfully migrated: ${result.migratedCount}`);
    console.log(`Errors: ${result.errors.length}`);
    console.log(`Image failures: ${result.imageFailures.length}`);
    console.log(`Category mapping failures: ${result.categoryMappingFailures.length}`);

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(error => {
        console.log(`- Post ${error.postId}: ${error.error}`);
      });
    }

    if (result.imageFailures.length > 0) {
      console.log('\nImage failures:');
      result.imageFailures.forEach(failure => {
        console.log(`- Post ${failure.postId}: ${failure.error}`);
      });
    }

    if (result.categoryMappingFailures.length > 0) {
      console.log('\nCategory mapping failures:');
      result.categoryMappingFailures.forEach(failure => {
        console.log(`- Post ${failure.postId}: "${failure.categories}"`);
      });
    }

    return result;
  } catch (error) {
    result.errors.push({
      postId: -1,
      error: error instanceof Error ? error.message : String(error),
    });
    console.error('Migration failed:', error);
    return result;
  }
}

/**
 * Test migration on a subset of posts
 */
export async function testMigration(limit: number = 5): Promise<MigrationResult> {
  console.log(`Running test migration on ${limit} posts...`);

  // Temporarily modify the migration to only process limited posts
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errors: [],
    imageFailures: [],
    categoryMappingFailures: [],
  };

  try {
    const defaultAuthorId = await getOrCreateDefaultAuthor();

    const supabase = getSupabaseClient();
    const { data: importPosts, error: fetchError } = await supabase
      .from('blog_import_posts')
      .select('*')
      .order('id')
      .limit(limit);

    if (fetchError) {
      throw new Error(`Failed to fetch import posts: ${fetchError.message}`);
    }

    console.log(`Testing with ${importPosts?.length || 0} posts`);

    for (const importPost of importPosts || []) {
      await migrateSinglePost(importPost as ImportPost, defaultAuthorId, result);
    }

    result.success = result.errors.length === 0;
    return result;
  } catch (error) {
    result.errors.push({
      postId: -1,
      error: error instanceof Error ? error.message : String(error),
    });
    return result;
  }
}
