'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { Globe } from 'lucide-react';

const languageNames: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  'pt-BR': { name: 'Português', flag: '🇧🇷' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  ja: { name: '日本語', flag: '🇯🇵' },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('header.languageSwitcher');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative inline-flex items-center">
      <Globe className="absolute left-2 h-4 w-4 text-gray-500 pointer-events-none" />
      <select
        value={locale}
        onChange={handleChange}
        className="appearance-none bg-transparent pl-8 pr-6 py-1.5 text-sm font-medium text-gray-700 hover:text-primary cursor-pointer border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        aria-label={t('label')}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc].flag} {languageNames[loc].name}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-1.5 h-4 w-4 text-gray-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
