import { siteConfig } from '@/config/site';

interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  description?: string;
  image?: string;
  url?: string;
  qualifications?: string[];
  email?: string;
  telephone?: string;
}

export function PersonSchema({
  name,
  jobTitle,
  description,
  image,
  url,
  qualifications = [],
  email,
  telephone,
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: jobTitle,
    description: description,
    image: image,
    url: url ?? `${siteConfig.url}/team`,
    worksFor: {
      '@type': 'MedicalClinic',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(email && { email: email }),
    ...(telephone && { telephone: telephone }),
    ...(qualifications.length > 0 && {
      hasCredential: qualifications.map(qual => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: qual,
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
