'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@novansa/ui';
import { siteConfig } from '@/config/site';
import { LifeBuoy, MessageSquare, Bug } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

export default function SupportPage() {
  const t = useTranslations('supportPage');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const supportTopics = [
    {
      icon: LifeBuoy,
      title: t('topics.account.title'),
      email: siteConfig.supportEmail,
      description: t('topics.account.description'),
    },
    {
      icon: Bug,
      title: t('topics.bug.title'),
      email: siteConfig.supportEmail,
      description: t('topics.bug.description'),
    },
    {
      icon: MessageSquare,
      title: t('topics.feedback.title'),
      email: siteConfig.supportEmail,
      description: t('topics.feedback.description'),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently reject (bot)
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!formData.firstName || !formData.email || !formData.topic || !formData.message) {
      toast.error(t('form.requiredFields'));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Contact-Token': process.env.NEXT_PUBLIC_CONTACT_TOKEN ?? '',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          // Use topic as the subject/interest field expected by /api/contact
          interest: formData.topic,
          message: formData.message,
          website: honeypot,
          formType: 'support',
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
        topic: '',
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
            {t('hero.subtitleLine2')}{' '}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-primary font-medium hover:underline"
            >
              {siteConfig.supportEmail}
            </a>
            .
          </p>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <topic.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{topic.title}</h3>
                <a
                  href={`mailto:${topic.email}`}
                  className="text-primary hover:underline font-medium mb-2 block"
                >
                  {topic.email}
                </a>
                <p className="text-muted-foreground text-sm">{topic.description}</p>
              </div>
            ))}
          </div>

          {/* Form Section */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">{t('form.title')}</h2>

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
                  <p className="text-muted-foreground mb-6">{t('success.description')}</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
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

                  {/* Topic */}
                  <div>
                    <label
                      htmlFor="topic"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.topic')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{t('form.topicOptions.select')}</option>
                      <option value="account">{t('form.topicOptions.account')}</option>
                      <option value="billing">{t('form.topicOptions.billing')}</option>
                      <option value="bug">{t('form.topicOptions.bug')}</option>
                      <option value="feature">{t('form.topicOptions.feature')}</option>
                      <option value="data">{t('form.topicOptions.data')}</option>
                      <option value="other">{t('form.topicOptions.other')}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder={t('form.placeholders.message')}
                      required
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
              {/* Direct email card */}
              <div className="bg-primary text-primary-foreground rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <LifeBuoy className="w-8 h-8" />
                  <h3 className="text-xl font-bold">{t('emailDirect.title')}</h3>
                </div>
                <p className="mb-6 opacity-90">{t('emailDirect.description')}</p>
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="inline-block bg-white text-primary px-5 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {siteConfig.supportEmail}
                </a>
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

              {/* Helpful links */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('helpfulLinks.title')}</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/contact" className="text-primary hover:underline">
                      {t('helpfulLinks.contact')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-primary hover:underline">
                      {t('helpfulLinks.privacy')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-primary hover:underline">
                      {t('helpfulLinks.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/delete" className="text-primary hover:underline">
                      {t('helpfulLinks.delete')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-6 md:py-8 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('faq.title')}</h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                {t('faq.questions.account.question')}
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('faq.questions.account.answer')}
              </p>
            </details>

            <details className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                {t('faq.questions.bug.question')}
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('faq.questions.bug.answer')}
              </p>
            </details>

            <details className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <summary className="font-semibold text-lg text-foreground cursor-pointer list-none flex items-center justify-between">
                {t('faq.questions.data.question')}
                <span className="ml-4 text-primary group-open:rotate-180 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('faq.questions.data.answer')}
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
