import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* 404 indicator */}
        <div className="text-8xl font-bold text-primary/20 mb-6">404</div>

        {/* Error message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('title')}</h1>

        {/* Friendly description */}
        <p className="text-lg text-gray-600 mb-8">{t('description')}</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            {t('buttons.home')}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-200"
          >
            {t('buttons.contact')}
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">{t('helpfulLinks.title')}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
              {t('helpfulLinks.about')}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/blog" className="text-primary hover:text-primary/80 transition-colors">
              {t('helpfulLinks.blog')}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
              {t('helpfulLinks.contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
