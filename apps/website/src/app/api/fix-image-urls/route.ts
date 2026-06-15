import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST() {
  try {
    const supabase = createServiceClient();

    console.log('Starting image URL conversion for blog posts...');

    // Get all blog posts with full URLs in cover_image_url
    const { data: posts, error: fetchError } = await supabase
      .from('blog_post')
      .select('id, title, cover_image_url')
      .eq('brand', 1)
      .not('cover_image_url', 'is', null)
      .like('cover_image_url', 'https://%'); // Only posts with full URLs

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    console.log(`Found ${posts?.length || 0} posts with full image URLs to convert`);

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts need image URL conversion',
        updatedCount: 0,
      });
    }

    let updatedCount = 0;
    const errors: Array<{ postId: number; error: string }> = [];

    // Process each post
    for (const post of posts) {
      try {
        // Extract filename from full URL
        // Example: https://cpgapeppncrhrfoubqvh.supabase.co/storage/v1/object/public/blog-images/post-2-cover.webp
        // Should become: post-2-cover.webp

        const url = post.cover_image_url;
        if (!url) continue;

        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1]; // Get the last part (filename)

        if (!filename || filename === url) {
          errors.push({
            postId: post.id,
            error: `Could not extract filename from URL: ${url}`,
          });
          continue;
        }

        // Update the post with just the filename
        const { error: updateError } = await supabase
          .from('blog_post')
          .update({
            cover_image_url: filename,
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
        console.log(`Updated post ${post.id} (${post.title}): ${url} -> ${filename}`);
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
      totalProcessed: posts.length,
      errors,
      message: `Converted ${updatedCount} blog post image URLs to filename-only format`,
      examples: posts.slice(0, 3).map(post => ({
        title: post.title,
        before: post.cover_image_url,
        after: post.cover_image_url?.split('/').pop() ?? null,
      })),
    });
  } catch (error) {
    console.error('Image URL conversion failed:', error);

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
