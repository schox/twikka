import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/blogService';
import { getBlogImageUrl } from '@/lib/supabaseHelpers';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    // Get blog posts for the feed
    const blogPosts = await getBlogPosts(50); // Last 50 blog posts

    const rssItems = await Promise.all(
      blogPosts.map(async post => ({
        title: post.title,
        description: post.excerpt || '',
        link: `${siteConfig.url}/blog/${post.slug}`,
        pubDate: new Date(post.published_at).toUTCString(),
        guid: `${siteConfig.url}/blog/${post.slug}`,
        image: post.cover_image_url ? await getBlogImageUrl(post.cover_image_url) : undefined,
        categories: [
          ...(post.category ? [post.category.name] : []),
          ...(post.tags ? post.tags.map(tag => tag.name) : []),
        ],
      })),
    );

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${siteConfig.name} - Health & Fitness Insights</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-AU</language>
    <managingEditor>${siteConfig.contact.email} (${siteConfig.name})</managingEditor>
    <webMaster>${siteConfig.contact.email} (${siteConfig.name})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${rssItems[0]?.pubDate || new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${siteConfig.url}/images/twikka_icon_v4.png</url>
      <title>${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${siteConfig.url}/api/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems
  .map(
    item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>${
        item.image
          ? `
      <media:content url="${item.image}" type="image/jpeg"/>`
          : ''
      }${
        item.categories.length > 0
          ? `
${item.categories.map(cat => `      <category>${cat}</category>`).join('\n')}`
          : ''
      }
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
