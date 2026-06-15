import { siteConfig } from '@/config/site';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  image?: string;
  keywords?: string[];
  wordCount?: number;
  readingTime?: number;
}

export function BlogPostSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
  keywords = [],
  wordCount,
  readingTime,
}: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url ?? `${siteConfig.url}/team`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
        width: 1200,
        height: 630,
      },
    }),
    ...(keywords.length > 0 && {
      keywords: keywords.join(', '),
    }),
    ...(wordCount && {
      wordCount: wordCount,
    }),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
    inLanguage: 'en-AU',
    isAccessibleForFree: true,
    genre: 'Medical',
    about: {
      '@type': 'MedicalCondition',
      medicineSystem: 'WesternConventional',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
