import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'es', 'pt-BR', 'fr', 'de', 'it', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeCookie: {
    name: 'LOCALE',
    maxAge: 31536000, // 1 year
  },
});
