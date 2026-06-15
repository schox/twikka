import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { Mail } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('deletePage.meta');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function DeletePage() {
  const t = await getTranslations('deletePage');

  return (
    <main className="bg-background">
      <section className="py-8 md:py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h1>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {t('instructions.title')}
            </h2>
            <ol className="list-decimal pl-6 space-y-4 text-muted-foreground">
              <li>{t('instructions.step1')}</li>
              <li>{t('instructions.step2')}</li>
              <li>{t('instructions.step3')}</li>
            </ol>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('contact.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('contact.description')}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-lg"
            >
              <Mail className="w-5 h-5" />
              {t('contact.email')}
            </a>
          </div>

          <p className="text-sm text-muted-foreground text-center">{t('note')}</p>
        </div>
      </section>
    </main>
  );
}
