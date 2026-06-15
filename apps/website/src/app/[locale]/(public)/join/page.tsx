'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@novansa/ui';
import { createClient } from '@/lib/supabase/client';

export default function JoinPage() {
  const t = useTranslations('joinPage');
  const [formData, setFormData] = useState({ name: '', email: '', goal: '', website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('errors.nameRequired');
    if (!formData.email.trim()) newErrors.email = t('errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('errors.emailInvalid');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return; // honeypot
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('web_form_submission' as any)
        .insert({
          form_type: 'early_access',
          label: 'Join Early Access',
          form_data: {
            name: formData.name,
            email: formData.email.toLowerCase(),
            goal: formData.goal || null,
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
          },
        });

      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error('Join form error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="bg-background">
        <section className="py-8 md:py-10">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{t('success.title')}</h1>
            <p className="text-muted-foreground mb-8">{t('success.message')}</p>
            <Button variant="outline" asChild>
              <Link href="/">{t('success.backHome')}</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <section className="py-8 md:py-10">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h1>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                {t('form.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={t('form.namePlaceholder')}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                {t('form.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t('form.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-foreground mb-1">
                {t('form.goal')}
              </label>
              <textarea
                id="goal"
                name="goal"
                placeholder={t('form.goalPlaceholder')}
                rows={4}
                value={formData.goal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Honeypot */}
            <div style={{ display: 'none' }}>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? t('form.sending') : t('form.submit')}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
