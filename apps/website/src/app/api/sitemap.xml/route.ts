import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/blogService';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    const blogPosts = await getBlogPosts(1000);

    // Define static pages with their priority and change frequency
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' }, // Homepage
      { url: 'about', priority: '0.9', changefreq: 'monthly' },
      { url: 'blog', priority: '0.8', changefreq: 'daily' },
      { url: 'contact', priority: '0.7', changefreq: 'monthly' },
      { url: 'privacy', priority: '0.5', changefreq: 'yearly' },
      { url: 'terms', priority: '0.5', changefreq: 'yearly' },
    ];

    // Dynamic pages - blog posts only
    const dynamicPages = blogPosts.map(post => ({
      url: `blog/${post.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: post.updated_at ?? post.published_at,
    }));

    const allPages = [
      ...staticPages.map(page => ({
        ...page,
        lastmod: new Date().toISOString(),
      })),
      ...dynamicPages,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${siteConfig.url}${page.url ? `/${page.url}` : ''}</loc>
    <lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
