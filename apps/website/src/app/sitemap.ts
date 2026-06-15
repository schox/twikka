import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getBlogPosts, getBlogCategories, getBlogTags } from '@/lib/blogService';

// Supported locales
const locales = ['en', 'es', 'pt-BR', 'fr', 'de', 'it', 'ja'];
const defaultLocale = 'en';

// Helper to generate URL for a locale
function getLocalizedUrl(path: string, locale: string): string {
  return locale === defaultLocale
    ? `${siteConfig.url}${path}`
    : `${siteConfig.url}/${locale}${path}`;
}

// Helper to generate alternates for all locales
function getAlternates(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = getLocalizedUrl(path, locale);
  }
  languages['x-default'] = getLocalizedUrl(path, defaultLocale);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes with multi-language support
  const staticPaths = ['', '/about', '/blog', '/contact', '/support', '/privacy', '/terms'];

  const routes: MetadataRoute.Sitemap = staticPaths.flatMap(path =>
    locales.map(locale => ({
      url: getLocalizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: getAlternates(path),
    })),
  );

  // Blog posts - get for default locale (English)
  // Each post entry includes alternates to all language versions
  const posts = await getBlogPosts(1000, 0, defaultLocale);
  const blogRoutes: MetadataRoute.Sitemap = posts.flatMap(post => {
    const path = `/blog/${post.slug}`;
    return locales.map(locale => ({
      url: getLocalizedUrl(path, locale),
      lastModified: new Date(post.updated_at ?? post.published_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: getAlternates(path),
    }));
  });

  // Blog categories - get for default locale
  const categories = await getBlogCategories(defaultLocale);
  const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap(category => {
    const path = `/blog/category/${category.slug}`;
    return locales.map(locale => ({
      url: getLocalizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: getAlternates(path),
    }));
  });

  // Blog tags - get for default locale
  const tags = await getBlogTags(defaultLocale);
  const tagRoutes: MetadataRoute.Sitemap = tags.flatMap(tag => {
    const path = `/blog/tag/${tag.slug}`;
    return locales.map(locale => ({
      url: getLocalizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
      alternates: getAlternates(path),
    }));
  });

  return [...routes, ...blogRoutes, ...categoryRoutes, ...tagRoutes];
}
