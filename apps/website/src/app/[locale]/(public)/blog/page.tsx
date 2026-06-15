import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getBlogPostsWithPagination, getBlogCategories } from '@/lib/blogService';
import { getBlogImageUrl } from '@/lib/supabaseHelpers';
import { BlogImage } from '@/components/BlogImage';
import BlogPagination from './BlogPagination';
import { siteConfig } from '@/config/site';

// Generate metadata with hreflang alternates
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const locales = ['en', 'es', 'pt-BR', 'fr', 'de', 'it', 'ja'];

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = loc === 'en' ? `${siteConfig.url}/blog` : `${siteConfig.url}/${loc}/blog`;
  }
  languages['x-default'] = `${siteConfig.url}/blog`;

  return {
    title: `Health & Fitness Blog | Tips & Insights | ${siteConfig.name}`,
    description:
      'Expert health and fitness insights to help you build sustainable healthy habits. Read our latest articles on exercise, nutrition, motivation, and wellness tips.',
    keywords:
      'health blog, fitness tips, healthy habits, exercise advice, wellness insights, fitness motivation, health education',
    alternates: {
      canonical: locale === 'en' ? `${siteConfig.url}/blog` : `${siteConfig.url}/${locale}/blog`,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale,
      url: locale === 'en' ? `${siteConfig.url}/blog` : `${siteConfig.url}/${locale}/blog`,
      title: `Health & Fitness Blog | ${siteConfig.name}`,
      description:
        'Expert health and fitness insights to help you build sustainable healthy habits.',
      images: [
        {
          url: `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: `Health and fitness blog from ${siteConfig.name}`,
        },
      ],
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Health & Fitness Blog | ${siteConfig.name}`,
      description:
        'Expert health and fitness insights to help you build sustainable healthy habits.',
      images: [`${siteConfig.url}${siteConfig.ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Enable ISR - revalidate every 30 minutes for blog list
export const revalidate = 1800;

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const t = await getTranslations('blogPage');
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const currentPage = Number(searchParamsResolved.page) || 1;
  const postsPerPage = 12;

  const [{ posts, totalPages, hasNextPage, hasPrevPage }, categories] = await Promise.all([
    getBlogPostsWithPagination(currentPage, postsPerPage, locale),
    getBlogCategories(locale),
  ]);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">{t('title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">{t('subtitle')}</p>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="bg-white rounded-full px-5 py-2 text-sm text-gray-700 font-medium border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 active:scale-95 block group"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <BlogImage
                    src={post.cover_image_url ? getBlogImageUrl(post.cover_image_url) : ''}
                    alt={`${post.title} - Health and fitness article from ${siteConfig.name}`}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  {post.categories?.[0] && (
                    <div className="text-xs text-primary font-medium mb-1">
                      {post.categories[0].name}
                    </div>
                  )}
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                  <span className="text-primary text-xs font-medium group-hover:text-primary/80 transition-colors">
                    {t('readMore')} &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-primary/5 rounded-lg p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                {t('comingSoon.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">{t('comingSoon.description')}</p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {t('comingSoon.cta')}
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage ?? false}
              hasPrevPage={hasPrevPage ?? false}
            />
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
            {t('stayUpdated.title')}
          </h3>
          <p className="text-muted-foreground mb-6">{t('stayUpdated.description')}</p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {t('stayUpdated.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
