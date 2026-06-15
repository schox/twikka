import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getBlogPostBySlug, getRelatedPosts, getBlogPostAlternates } from '@/lib/blogService';
import { getBlogImageUrl } from '@/lib/supabaseHelpers';
import { BlogImage } from '@/components/BlogImage';
import SimpleLexicalRenderer from '@/components/SimpleLexicalRenderer';
import { BlogPostSchema, BreadcrumbSchema } from '@/components/schema';
import { siteConfig } from '@/config/site';

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Temporarily disable SSG until database types are fixed
// export async function generateStaticParams() {
//   try {
//     const posts = await getBlogPosts(1000); // Get all posts
//     return posts.map((post) => ({
//       slug: post.slug,
//     }));
//   } catch (error) {
//     console.error('Error generating static params for blog posts:', error);
//     return [];
//   }
// }

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    return {
      title: `Post Not Found - ${siteConfig.name}`,
    };
  }

  // Build alternates for hreflang tags
  const alternates: Metadata['alternates'] = {
    canonical: `${siteConfig.url}/${locale}/blog/${post.slug}`,
  };

  if (post.canonical_id) {
    const postAlternates = await getBlogPostAlternates(post.canonical_id);
    if (postAlternates.length > 0) {
      const languages: Record<string, string> = {};
      for (const alt of postAlternates) {
        languages[alt.languageCode] = `${siteConfig.url}/${alt.languageCode}/blog/${alt.slug}`;
      }
      // Add x-default pointing to English version
      const englishAlt = postAlternates.find(a => a.languageCode === 'en');
      if (englishAlt) {
        languages['x-default'] = `${siteConfig.url}/blog/${englishAlt.slug}`;
      }
      alternates.languages = languages;
    }
  }

  return {
    title: `${post.title} - ${siteConfig.name} Blog`,
    description: post.excerpt ?? `Read about ${post.title} on the ${siteConfig.name} blog.`,
    alternates,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      images: post.cover_image_url ? [getBlogImageUrl(post.cover_image_url)] : [],
      locale: locale,
      url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const t = await getTranslations('blogPage');
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, 3, locale);

  const breadcrumbItems = [
    { name: t('breadcrumb.home'), url: '/' },
    { name: t('breadcrumb.blog'), url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <BlogPostSchema
        title={post.title}
        description={post.excerpt ?? ''}
        url={`${siteConfig.url}/blog/${post.slug}`}
        datePublished={post.published_at}
        dateModified={post.updated_at ?? undefined}
        author={{
          name: siteConfig.name,
          url: siteConfig.url,
        }}
        image={post.cover_image_url ? getBlogImageUrl(post.cover_image_url) : undefined}
        keywords={post.tags?.map(tag => tag.name) ?? []}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  {t('breadcrumb.home')}
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-2">/</span>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                  {t('breadcrumb.blog')}
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-2">/</span>
              </li>
              <li className="text-gray-900 font-medium truncate">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">{post.title}</h1>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {post.categories?.[0] && (
                <Link
                  href={`/blog/category/${post.categories[0].slug}`}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  {post.categories[0].name}
                </Link>
              )}
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden h-96 relative">
            <BlogImage
              src={post.cover_image_url ? getBlogImageUrl(post.cover_image_url) : ''}
              alt={`${post.title} - Featured image for ${siteConfig.name} article`}
              className="object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="mb-12">
            {post.excerpt && (
              <p className="text-xl text-muted-foreground font-medium mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.content ? (
              <SimpleLexicalRenderer markdown={post.content} className="max-w-none" />
            ) : (
              <p className="text-muted-foreground">{t('post.contentComingSoon')}</p>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 pb-8 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('post.tagsLabel')}</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#5f27cd] hover:text-white transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-primary/5 rounded-lg p-8 mb-12 text-center">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
              {t('post.cta.title')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('post.cta.description', { siteName: siteConfig.name })}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t('post.cta.button')}
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                {t('post.relatedArticles')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="h-32 bg-gray-200 relative overflow-hidden">
                        <BlogImage
                          src={relatedPost.cover_image_url ? getBlogImageUrl(relatedPost.cover_image_url) : ''}
                          alt={`${relatedPost.title} - Related article from ${siteConfig.name}`}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-foreground mb-2 text-sm group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
