import { siteConfig } from '@/config/site';

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  duration?: string;
  provider?: {
    name: string;
    jobTitle: string;
  };
}

export function ServiceSchema({
  name,
  description,
  url,
  image,
  price,
  duration,
  provider,
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: name,
    description: description,
    url: url,
    image: image,
    procedureType: 'Non-surgical',
    followup: 'As recommended by podiatrist',
    preparation: 'Wear comfortable clothing and bring relevant medical history',
    howPerformed: description,
    ...(duration && {
      estimatedDuration: {
        '@type': 'Duration',
        value: duration,
      },
    }),
    provider: {
      '@type': 'MedicalClinic',
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.suburb,
        addressRegion: siteConfig.address.state,
        postalCode: siteConfig.address.postcode,
        addressCountry: 'AU',
      },
      ...(provider && {
        member: {
          '@type': 'Person',
          name: provider.name,
          jobTitle: provider.jobTitle,
        },
      }),
    },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
