'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  website: string; // Honeypot field
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactForm() {
  const t = useTranslations('contactForm');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    website: '', // Honeypot field
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.lastNameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('errors.phoneRequired');
    } else if (!/\d/.test(formData.phone)) {
      newErrors.phone = t('errors.phoneInvalid');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('errors.messageMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot field - if filled, it's likely a bot
    if (formData.website) {
      console.log('Bot detected via honeypot field');
      return; // Silently reject
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save form submission to Twikka's web.form_submission
      const supabase = createClient();
      const { error } = await supabase
        .from('web_form_submission' as any)
        .insert({
          form_type: 'contact',
          label: 'Contact us - Home Page',
          form_data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
          },
        });

      if (error) {
        console.error('Error saving form submission:', error);
        throw new Error('Failed to submit form. Please try again.');
      }

      console.log('Form submitted successfully:', formData);
      setIsSubmitted(true);

      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        website: '', // Reset honeypot field
      });
    } catch (error) {
      console.error('Form submission error:', error);
      // You could show an error message to the user here
      alert(t('errors.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-green-50 rounded-lg border border-green-200">
        <div className="text-green-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">{t('success.title')}</h3>
        <p className="text-green-700 mb-4">
          {t('success.message')}
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-brand-primary font-medium hover:text-brand-primary/80 transition-colors"
        >
          {t('success.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            name="firstName"
            placeholder={t('placeholders.firstName')}
            value={formData.firstName}
            onChange={handleInputChange}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary w-full ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder={t('placeholders.lastName')}
            value={formData.lastName}
            onChange={handleInputChange}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary w-full ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder={t('placeholders.email')}
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          type="tel"
          name="phone"
          placeholder={t('placeholders.phone')}
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <textarea
          name="message"
          placeholder={t('placeholders.message')}
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* Honeypot field - hidden from humans, visible to bots */}
      <div style={{ display: 'none' }}>
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-8 py-3 rounded-lg font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-brand-secondary text-white hover:bg-brand-secondary/90'
        }`}
      >
        {isSubmitting ? t('buttons.sending') : t('buttons.submit')}
      </button>
    </form>
  );
}
