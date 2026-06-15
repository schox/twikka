import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function BlogPostNotFound() {
  const t = useTranslations('blogNotFound');

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-heading font-bold text-brand-accent2 mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-600 mb-8">{t('description')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
          >
            {t('buttons.backToBlog')}
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            {t('buttons.home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
