import { siteConfig } from '@/config/site';

interface OrganizationSchemaProps {
  customData?: Record<string, unknown>;
}

export function OrganizationSchema({ customData = {} }: OrganizationSchemaProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'iOS, Android, Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
      description: 'Free with optional premium features',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.contact.email,
    },
    image: `${siteConfig.url}/images/twikka_icon_v4.png`,
    logo: `${siteConfig.url}/images/twikka_icon_v4.png`,
    sameAs: Object.values(siteConfig.social || {}),
    ...customData,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
