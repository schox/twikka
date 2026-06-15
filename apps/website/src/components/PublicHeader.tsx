'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@novansa/ui';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import LanguageSwitcher from './LanguageSwitcher';

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations('header');

  const navigation = [
    { name: t('navigation.home'), href: '/' as const },
    { name: t('navigation.about'), href: '/about' as const },
    { name: t('navigation.blog'), href: '/blog' as const },
    { name: t('navigation.contact'), href: '/contact' as const },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/twikka_icon_v4.png"
                alt={`${siteConfig.name} logo`}
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl sm:text-2xl font-bold text-primary">{siteConfig.name}</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="default" size="default" asChild>
              <Link href="/join">{t('cta')}</Link>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button variant="default" size="sm" asChild className="text-xs">
              <Link href="/join">{t('cta')}</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4">
            <div className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-3 font-medium rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {/* Language switcher in mobile menu */}
              <div className="px-3 py-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
