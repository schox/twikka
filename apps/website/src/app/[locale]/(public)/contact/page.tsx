'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@novansa/ui';
import { siteConfig } from '@/config/site';
import { Mail, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export default function ContactPage() {
  const t = useTranslations('contactPage');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const contactReasons = [
    {
      icon: Sparkles,
      title: t('contactReasons.earlyAccess.title'),
      email: siteConfig.email,
      description: t('contactReasons.earlyAccess.description'),
    },
    {
      icon: MessageSquare,
      title: t('contactReasons.generalInquiries.title'),
      email: siteConfig.email,
      description: t('contactReasons.generalInquiries.description'),
    },
    {
      icon: Mail,
      title: t('contactReasons.support.title'),
      email: siteConfig.supportEmail,
      description: t('contactReasons.support.description'),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently reject (bot)
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!formData.firstName || !formData.email || !formData.interest) {
      toast.error(t('form.requiredFields'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Contact-Token': process.env.NEXT_PUBLIC_CONTACT_TOKEN || '',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          interest: formData.interest,
          message: formData.message,
          website: honeypot,
        }),
      });

      if (!response.ok) {
        throw new Error(t('error.submitFailed'));
      }

      setSubmitted(true);
      toast.success(t('success.toast'));
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        interest: '',
        message: '',
      });
    } catch {
      toast.error(t('error.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="py-8 md:py-10 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('hero.subtitle')}
            <br />
            {t('hero.subtitleLine2')}
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <a
                  href={`mailto:${reason.email}`}
                  className="text-primary hover:underline font-medium mb-2 block"
                >
                  {reason.email}
                </a>
                <p className="text-muted-foreground text-sm">{reason.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('form.title')}
              </h2>

              {submitted ? (
                <div className="bg-accent/10 border border-accent rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('success.title')}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('success.description')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    {t('success.sendAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from humans */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t('form.firstName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={t('form.placeholders.firstName')}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t('form.lastName')}
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={t('form.placeholders.lastName')}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t('form.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('form.placeholders.email')}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t('form.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('form.placeholders.phone')}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Interest */}
                  <div>
                    <label
                      htmlFor="interest"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.interest')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('form.interestOptions.select')}</option>
                      <option value="early-access">{t('form.interestOptions.earlyAccess')}</option>
                      <option value="general">{t('form.interestOptions.general')}</option>
                      <option value="feedback">{t('form.interestOptions.feedback')}</option>
                      <option value="partnership">{t('form.interestOptions.partnership')}</option>
                      <option value="media">{t('form.interestOptions.media')}</option>
                      <option value="other">{t('form.interestOptions.other')}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder={t('form.placeholders.message')}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? t('form.sending') : t('form.submit')}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {t('form.responseNote')}
                  </p>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="space-y-8">
              {/* Early Access CTA */}
              <div className="bg-primary text-primary-foreground rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8" />
                  <h3 className="text-xl font-bold">{t('waitlist.title')}</h3>
                </div>
                <p className="mb-6 opacity-90">
                  {t('waitlist.description')}
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{t('waitlist.benefits.premium')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{t('waitlist.benefits.input')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{t('waitlist.benefits.perks')}</span>
                  </li>
                </ul>
              </div>

              {/* Response Time */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('responseTimes.title')}</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• {t('responseTimes.weekdays')}</li>
                  <li>• {t('responseTimes.weekends')}</li>
                  <li>• {t('responseTimes.priority')}</li>
                </ul>
              </div>

              {/* Social Links */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('social.title')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('social.description')}
                </p>
                <div className="flex gap-4">
                  {siteConfig.social.instagram && (
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {siteConfig.social.facebook && (
                    <a
                      href={siteConfig.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-6 md:py-8 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('faq.title')}
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                {t('faq.questions.earlyAccess.question')}
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('faq.questions.earlyAccess.answer')}
              </p>
            </details>

            <details className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                {t('faq.questions.availability.question')}
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('faq.questions.availability.answer')}
              </p>
            </details>

            <details className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                {t('faq.questions.feedback.question')}
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('faq.questions.feedback.answerPrefix')} {siteConfig.email}. {t('faq.questions.feedback.answerSuffix')}
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-6 md:py-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('bottomCta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('bottomCta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/about">{t('bottomCta.learnAbout')}</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/blog">{t('bottomCta.readBlog')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
