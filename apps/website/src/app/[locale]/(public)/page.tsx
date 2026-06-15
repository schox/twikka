import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@novansa/ui';
import { siteConfig } from '@/config/site';
import { Sparkles, Target, TrendingUp, Users, ChevronDown } from 'lucide-react';
import AppScreenshotShowcase from '@/components/AppScreenshotShowcase';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords:
    'health app, fitness app, healthy habits, wellness, exercise, nutrition, health tracking, fitness goals',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

const featureKeys = ['goals', 'progress', 'habits', 'motivation'] as const;
const featureIcons = {
  goals: Target,
  progress: TrendingUp,
  habits: Sparkles,
  motivation: Users,
};

const faqKeys = ['whatIs', 'why', 'howWorks', 'forMe', 'start'] as const;

const benefitKeys = ['premium', 'input', 'perks'] as const;

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 md:py-12 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {t('hero.titlePart1')}{' '}
              <span className="text-primary">{t('hero.titlePart2')}</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto italic">
              {t('hero.tagline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button variant="default" size="lg" asChild>
                <Link href="/join">{t('hero.getEarlyAccess')}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">{t('hero.learnMore')}</Link>
              </Button>
            </div>

            {/* App Screenshots */}
            <AppScreenshotShowcase />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureKeys.map((key) => {
              const Icon = featureIcons[key];
              return (
                <div
                  key={key}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">{t(`features.items.${key}.description`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section className="py-6 md:py-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('earlyAccess.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('earlyAccess.subtitle')}
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-lg mx-auto">
            <ul className="text-left space-y-4 mb-8">
              {benefitKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{t(`earlyAccess.benefits.${key}`)}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="secondary"
              size="lg"
              asChild
              className="w-full bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/join">{t('earlyAccess.joinWaitlist')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{t('learnMore.title')}</h2>
          </div>

          <div className="space-y-4">
            {faqKeys.map((key) => (
              <details
                key={key}
                className="group bg-primary/5 border border-primary/10 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                  {t(`learnMore.faqs.${key}.question`)}
                  <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                    <ChevronDown className="w-6 h-6" />
                  </span>
                </summary>
                <div className="mt-4 text-muted-foreground leading-relaxed">
                  <FaqAnswer faqKey={key} t={t} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-6 md:py-8 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('newsletter.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('newsletter.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto">
            <NewsletterSignup variant="light" />
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('blogPreview.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('blogPreview.subtitle')}
            </p>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">{t('blogPreview.button')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// Helper component for rendering FAQ answers with structured content
function FaqAnswer({ faqKey, t }: { faqKey: typeof faqKeys[number]; t: ReturnType<typeof getTranslations> extends Promise<infer T> ? T : never }) {
  const pointKeys = {
    whatIs: ['science', 'sustainability', 'designed', 'social'],
    why: ['steps', 'progress', 'science', 'support'],
    howWorks: null, // Special case - uses steps instead of points
    forMe: ['age', 'tried', 'notFitness', 'support', 'change'],
    start: ['try', 'feedback', 'community', 'perks'],
  };

  const stepKeys = ['plan', 'checkins', 'adapt', 'join'];

  if (faqKey === 'howWorks') {
    return (
      <>
        <p className="mb-4">{t(`learnMore.faqs.${faqKey}.answer.intro`)}</p>
        <p className="mb-4">{t(`learnMore.faqs.${faqKey}.answer.description`)}</p>
        <ol className="list-decimal pl-6 mb-4 space-y-3">
          {stepKeys.map((step) => (
            <li key={step}>
              <strong>{t(`learnMore.faqs.${faqKey}.answer.steps.${step}.title`)}</strong>
              <br />
              {t(`learnMore.faqs.${faqKey}.answer.steps.${step}.description`)}
            </li>
          ))}
        </ol>
        <p>{t(`learnMore.faqs.${faqKey}.answer.conclusion`)}</p>
      </>
    );
  }

  const points = pointKeys[faqKey];
  const hasConclusion = faqKey !== 'start';

  return (
    <>
      <p className="mb-4">{t(`learnMore.faqs.${faqKey}.answer.intro`)}</p>
      <p className="mb-4">{t(`learnMore.faqs.${faqKey}.answer.description`)}</p>
      {points && (
        <ul className="list-disc pl-6 mb-4 space-y-2">
          {points.map((point) => (
            <li key={point}>{t(`learnMore.faqs.${faqKey}.answer.points.${point}`)}</li>
          ))}
        </ul>
      )}
      {hasConclusion && <p>{t(`learnMore.faqs.${faqKey}.answer.conclusion`)}</p>}
    </>
  );
}
