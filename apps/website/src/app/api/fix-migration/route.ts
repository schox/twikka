import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

// Enhanced HTML to Markdown converter
function htmlToMarkdown(html: string): string {
  return (
    html
      // First handle HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      // Handle headings
      .replace(/<h1[^>]*>/g, '\n# ')
      .replace(/<\/h1>/g, '\n\n')
      .replace(/<h2[^>]*>/g, '\n## ')
      .replace(/<\/h2>/g, '\n\n')
      .replace(/<h3[^>]*>/g, '\n### ')
      .replace(/<\/h3>/g, '\n\n')
      .replace(/<h4[^>]*>/g, '\n#### ')
      .replace(/<\/h4>/g, '\n\n')
      .replace(/<h5[^>]*>/g, '\n##### ')
      .replace(/<\/h5>/g, '\n\n')
      .replace(/<h6[^>]*>/g, '\n###### ')
      .replace(/<\/h6>/g, '\n\n')
      // Handle list containers first
      .replace(/<ul[^>]*>/g, '\n')
      .replace(/<\/ul>/g, '\n')
      .replace(/<ol[^>]*>/g, '\n')
      .replace(/<\/ol>/g, '\n')
      // Handle complex list items with nested tags more carefully
      .replace(/<li[^>]*><p[^>]*>([^<]*)<\/p><\/li>/g, '- $1\n') // li > p content
      .replace(/<li[^>]*>([^<]+)<\/li>/g, '- $1\n') // simple li content
      .replace(/<li[^>]*>/g, '- ') // fallback for complex li tags
      .replace(/<\/li>/g, '\n')
      // Handle paragraphs
      .replace(/<p[^>]*>/g, '\n')
      .replace(/<\/p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      // Handle formatting
      .replace(/<strong[^>]*>/g, '**')
      .replace(/<\/strong>/g, '**')
      .replace(/<b[^>]*>/g, '**')
      .replace(/<\/b>/g, '**')
      .replace(/<em[^>]*>/g, '*')
      .replace(/<\/em>/g, '*')
      .replace(/<i[^>]*>/g, '*')
      .replace(/<\/i>/g, '*')
      // Handle links
      .replace(/<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '[$2]($1)')
      // Remove any remaining HTML tags and attributes
      .replace(/<[^>]*>/g, '')
      // Clean up whitespace and newlines
      .replace(/\n\s*\n\s*\n+/g, '\n\n') // Multiple newlines to double
      .replace(/^\n+|\n+$/g, '') // Trim newlines from start/end
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
      .replace(/\n /g, '\n') // Remove spaces at start of lines
      // Fix broken list formatting where bullets are on separate lines
      .replace(/- \n([A-Z])/g, '- $1') // Fix "- \nSome text" to "- Some text"
      .replace(/- \n([a-z])/g, '- $1') // Fix "- \nsome text" to "- some text"
      .trim()
  );
}

export async function POST() {
  try {
    const supabase = createServiceClient();

    console.log('Starting content fix for migrated posts...');

    // Get all migrated posts that need content fixes (empty content or contains HTML entities)
    const { data: posts, error: fetchError } = await supabase
      .from('blog_post')
      .select('id, migrated_from_import_id, content')
      .eq('brand', 1)
      .not('migrated_from_import_id', 'is', null);

    // Filter for posts that need fixing (empty content or contains HTML entities or broken lists)
    const postsToFix =
      posts?.filter(
        post =>
          !post.content ||
          post.content === '' ||
          post.content.includes('&nbsp;') ||
          post.content.includes('&amp;') ||
          (post.content.match(/- \n/) ?? false) || // Posts with broken list formatting (bullet on separate line)
          post.content.match(/- \n[A-Z]/), // Posts where bullet is followed by newline then text
      ) ?? [];

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    console.log(
      `Found ${postsToFix.length} posts needing content fixes out of ${posts?.length ?? 0} total posts`,
    );

    if (postsToFix.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts need content fixes',
        updatedCount: 0,
      });
    }

    let updatedCount = 0;
    const errors: Array<{ postId: number; error: string }> = [];

    // Process each post
    for (const post of postsToFix) {
      try {
        // Get original content from import table
        const { data: importPost, error: importError } = await supabase
          .from('blog_import_posts')
          .select('Content')
          .eq('id', post.migrated_from_import_id!)
          .single();

        if (importError || !importPost?.Content) {
          errors.push({
            postId: post.id,
            error: `Failed to get original content: ${importError?.message ?? 'No content found'}`,
          });
          continue;
        }

        // Convert HTML to Markdown
        const markdownContent = htmlToMarkdown(importPost.Content);

        if (!markdownContent) {
          errors.push({
            postId: post.id,
            error: 'Content conversion resulted in empty string',
          });
          continue;
        }

        // Update the post with converted content
        const { error: updateError } = await supabase
          .from('blog_post')
          .update({
            content: markdownContent,
            content_html: importPost.Content,
            status: 'published', // Also make sure posts are published
            updated_at: new Date().toISOString(),
          })
          .eq('id', post.id);

        if (updateError) {
          errors.push({
            postId: post.id,
            error: `Failed to update post: ${updateError.message}`,
          });
          continue;
        }

        updatedCount++;
        console.log(`Updated post ${post.id} with ${markdownContent.length} characters of content`);
      } catch (error) {
        errors.push({
          postId: post.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      updatedCount,
      totalProcessed: postsToFix.length,
      errors,
      message: `Updated ${updatedCount} posts with content`,
    });
  } catch (error) {
    console.error('Content fix failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        updatedCount: 0,
        errors: [{ postId: -1, error: error instanceof Error ? error.message : String(error) }],
      },
      {
        status: 500,
      },
    );
  }
}
