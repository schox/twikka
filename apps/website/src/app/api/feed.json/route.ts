import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/blogService';
import { getBlogImageUrl } from '@/lib/supabaseHelpers';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    // Get blog posts for the feed
    const blogPosts = await getBlogPosts(50); // Last 50 blog posts

    const feedItems = await Promise.all(
      blogPosts.map(async post => ({
        id: `${siteConfig.url}/blog/${post.slug}`,
        url: `${siteConfig.url}/blog/${post.slug}`,
        title: post.title,
        content_html: post.excerpt || '',
        summary: post.excerpt || '',
        image: post.cover_image_url ? await getBlogImageUrl(post.cover_image_url) : undefined,
        date_published: post.published_at,
        date_modified: post.updated_at ?? post.published_at,
        author: {
          name: siteConfig.name,
          url: siteConfig.url,
        },
        tags: [
          ...(post.category ? [post.category.name] : []),
          ...(post.tags ? post.tags.map(tag => tag.name) : []),
        ],
      })),
    );

    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: `${siteConfig.name} - Health & Fitness Insights`,
      home_page_url: siteConfig.url,
      feed_url: `${siteConfig.url}/api/feed.json`,
      description: siteConfig.description,
      icon: `${siteConfig.url}/images/twikka_icon_v4.png`,
      favicon: `${siteConfig.url}/favicon.ico`,
      language: 'en-AU',
      authors: [
        {
          name: siteConfig.name,
          url: siteConfig.url,
        },
      ],
      items: feedItems,
    };

    return NextResponse.json(jsonFeed, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('JSON feed generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
