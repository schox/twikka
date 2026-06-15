'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

interface NewsletterSignupProps {
  variant: 'dark' | 'light';
}

export default function NewsletterSignup({ variant }: NewsletterSignupProps) {
  const t = useTranslations('home.newsletter.form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isDark = variant === 'dark';

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = t('errors.nameRequired');
    if (!email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // Honeypot triggered
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('web_form_submission' as any)
        .insert({
          form_type: 'newsletter',
          label: 'Newsletter Signup',
          form_data: {
            name: name.trim(),
            email: email.trim(),
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
          },
        });

      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error('Newsletter signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
        {t('success')}
      </p>
    );
  }

  const inputBase =
    'px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full';
  const inputClasses = isDark
    ? `${inputBase} bg-gray-800 border border-gray-700 text-white placeholder-gray-400`
    : `${inputBase} bg-white border border-gray-300 text-foreground placeholder-gray-400`;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder={t('namePlaceholder')}
            aria-label={t('name')}
            className={`${inputClasses} ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder={t('emailPlaceholder')}
            aria-label={t('email')}
            className={`${inputClasses} ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? '...' : t('submit')}
        </button>
      </div>

      {/* Honeypot */}
      <div style={{ display: 'none' }}>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
        {t('description')}
      </p>
    </form>
  );
}
