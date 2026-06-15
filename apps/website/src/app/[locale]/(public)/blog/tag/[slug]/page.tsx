import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getBlogPostsByTag, getTagBySlug, getBlogTags } from '@/lib/blogService';
import { getBlogImageUrl } from '@/lib/supabaseHelpers';
import { BlogImage } from '@/components/BlogImage';
import { siteConfig } from '@/config/site';
import BlogPagination from '../../BlogPagination';

interface TagPageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const tag = await getTagBySlug(slug, locale);
  const locales = ['en', 'es', 'pt-BR', 'fr', 'de', 'it', 'ja'];

  if (!tag) {
    return {
      title: 'Tag Not Found - Twikka Blog',
    };
  }

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] =
      loc === 'en'
        ? `${siteConfig.url}/blog/tag/${slug}`
        : `${siteConfig.url}/${loc}/blog/tag/${slug}`;
  }
  languages['x-default'] = `${siteConfig.url}/blog/tag/${slug}`;

  return {
    title: `Posts tagged "${tag.name}" - Twikka Blog`,
    description: `Browse all posts tagged with ${tag.name} on the Twikka blog.`,
    alternates: {
      canonical:
        locale === 'en'
          ? `${siteConfig.url}/blog/tag/${slug}`
          : `${siteConfig.url}/${locale}/blog/tag/${slug}`,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale,
      url:
        locale === 'en'
          ? `${siteConfig.url}/blog/tag/${slug}`
          : `${siteConfig.url}/${locale}/blog/tag/${slug}`,
      siteName: siteConfig.name,
      title: `Posts tagged "${tag.name}" - Twikka Blog`,
      description: `Browse all posts tagged with ${tag.name}.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  const tags = await getBlogTags('en');
  return tags.map(tag => ({
    slug: tag.slug,
  }));
}

export const revalidate = 1800; // 30 minutes
export const dynamicParams = true; // Allow fallback for tags not generated at build time

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const t = await getTranslations('blogPage');
  const { slug, locale } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const postsPerPage = 12;

  const tag = await getTagBySlug(slug, locale);

  if (!tag) {
    notFound();
  }

  const { posts, totalPages, hasNextPage, hasPrevPage, totalPosts } = await getBlogPostsByTag(
    slug,
    currentPage,
    postsPerPage,
    locale,
  );

  return (
    <main className="bg-white">
      {/* Tag Header */}
      <section className="py-6 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-brand-primary mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('tag.backToBlog')}
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{tag.name}</h1>
          <p className="text-gray-500">{t('tag.postCount', { count: totalPosts })}</p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-6 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 active:scale-95 overflow-hidden group"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <BlogImage
                        src={post.cover_image_url ? getBlogImageUrl(post.cover_image_url) : ''}
                        alt={post.cover_image_alt ?? post.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-brand-primary font-medium mb-2">
                        {post.category?.name ?? t('tag.defaultCategory')}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : t('tag.unpublished')}
                        </span>
                        <span>&bull;</span>
                        <span>{t('tag.minRead', { minutes: 5 })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    basePath={`/blog/tag/${slug}`}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('tag.emptyState.title')}
                </h2>
                <p className="text-gray-600 mb-6">{t('tag.emptyState.description')}</p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
                >
                  {t('tag.emptyState.cta')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
