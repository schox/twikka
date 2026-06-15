import { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@novansa/ui';
import { siteConfig } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { Heart, Lightbulb, Users, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `About ${siteConfig.name} - Our Mission & Story`,
  description:
    'Learn about Twikka, the health and fitness app designed to help you build sustainable healthy habits. Discover our mission, values, and the team behind the app.',
  keywords:
    'about Twikka, health app mission, fitness app story, wellness company, healthy habits app',
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/about`,
    title: `About ${siteConfig.name} - Our Mission & Story`,
    description:
      'Learn about Twikka, the health and fitness app designed to help you build sustainable healthy habits.',
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `About ${siteConfig.name}`,
      },
    ],
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    title: `About ${siteConfig.name}`,
    description:
      'Learn about Twikka, the health and fitness app designed to help you build sustainable healthy habits.',
  },
};

export default async function AboutPage() {
  const t = await getTranslations('about');

  const values = [
    {
      icon: Heart,
      title: t('values.healthFirst.title'),
      description: t('values.healthFirst.description'),
    },
    {
      icon: Lightbulb,
      title: t('values.simplicity.title'),
      description: t('values.simplicity.description'),
    },
    {
      icon: Users,
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      icon: Sparkles,
      title: t('values.sustainability.title'),
      description: t('values.sustainability.description'),
    },
  ];

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-8 md:py-10 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Founder Introduction */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Founder Image */}
            <div className="order-2 md:order-1">
              <div className="max-w-md mx-auto">
                <Image
                  src="/images/andrew_about.jpeg"
                  alt={t('founder.imageAlt')}
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-lg w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Founder Intro */}
            <div className="order-1 md:order-2">
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>{t('founder.intro1')}</p>
                <p>{t('founder.intro2')}</p>
                <p>{t('founder.intro3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Days Section */}
      <section className="py-6 md:py-8 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            {t('earlyDays.title')}
          </h2>
          <div className="prose prose-lg text-muted-foreground space-y-4">
            <p>{t('earlyDays.paragraph1')}</p>
            <p>{t('earlyDays.paragraph2')}</p>
          </div>
        </div>
      </section>

      {/* Losing the Rhythm Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            {t('losingRhythm.title')}
          </h2>
          <div className="prose prose-lg text-muted-foreground space-y-4">
            <p>{t('losingRhythm.paragraph1')}</p>
            <p>{t('losingRhythm.paragraph2')}</p>
          </div>
        </div>
      </section>

      {/* Why Twikka Section */}
      <section className="py-6 md:py-8 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            {t('whyTwikka.title')}
          </h2>
          <div className="prose prose-lg text-muted-foreground space-y-4">
            <p>{t('whyTwikka.paragraph1')}</p>
            <p>{t('whyTwikka.paragraph2')}</p>
            <p>{t('whyTwikka.paragraph3')}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('values.title')}
            </h2>
            <p className="text-xl text-muted-foreground">{t('values.subtitle')}</p>
          </div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 md:py-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{t('cta.description')}</p>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-gray-100"
          >
            <Link href="/contact">{t('cta.button')}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
