import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@novansa/ui';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacyPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('privacyPage');
  const tCommon = await getTranslations('common');

  const isNonEnglish = locale !== 'en';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-2">{t('subtitle')}</p>
        <p className="text-sm text-gray-500 mb-8">{t('lastUpdated')}</p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <p className="font-semibold">{t('companyInfo.name')}</p>
          <p>{t('companyInfo.registry')}</p>
          <p>{t('companyInfo.address')}</p>
          <p>
            {t('companyInfo.enquiriesLabel')}{' '}
            <a href="mailto:privacy@novansa.com" className="text-primary hover:underline">
              privacy@novansa.com
            </a>
          </p>
        </div>

        {isNonEnglish && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
            <p className="text-amber-800 text-sm">{tCommon('translationComingSoon')}</p>
          </div>
        )}

        <div className="prose prose-gray max-w-none">
          <h2>Who we are</h2>
          <p>
            Twikka is operated by Novansa OÜ, a company registered in Estonia (registry code
            17445226). We are the data controller for personal data collected through Twikka.
          </p>
          <p>
            Contact:{' '}
            <a href="mailto:privacy@novansa.com" className="text-primary hover:underline">
              privacy@novansa.com
            </a>
          </p>

          <h2>1. Our approach to privacy</h2>
          <p>
            We built Twikka to help people build sustainable, healthy activity habits. We understand
            that the data you create in this app — including activity, location, and health
            information — can be personal and sensitive, and we take our responsibility to protect
            it seriously.
          </p>
          <p>
            We collect only what we need to operate the service, we store it securely, and we do not
            sell it.
          </p>

          <h2>2. Legal basis for processing (GDPR)</h2>
          <p>
            We are based in Estonia and subject to the General Data Protection Regulation (GDPR).
            Where GDPR applies to your use of Twikka, we process your personal data on the following
            legal bases:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Operating your account and delivering the service: Performance of contract (Article
              6(1)(b))
            </li>
            <li>Payment processing: Performance of contract (Article 6(1)(b))</li>
            <li>Analytics to improve the app: Legitimate interests (Article 6(1)(f))</li>
            <li>
              Sending you service-related communications: Performance of contract (Article 6(1)(b))
            </li>
            <li>
              Marketing communications (where you have opted in): Consent (Article 6(1)(a))
            </li>
            <li>Compliance with legal obligations: Legal obligation (Article 6(1)(c))</li>
            <li>
              Processing health-related data (where you provide it): Explicit consent (Article
              9(2)(a))
            </li>
          </ul>

          <h2>3. What data we collect</h2>
          <p>
            <strong>Account data:</strong> When you create an account, we collect your email
            address, a display name, and a password (stored as a hash, not in plain text). You may
            optionally add a profile picture or avatar.
          </p>
          <p>
            <strong>Profile and health data:</strong> If you choose to provide it, we collect
            information such as age range, gender, height, weight, and self-reported activity
            levels. This data is used to personalise your experience and is treated as a special
            category of personal data under GDPR.
          </p>
          <p>
            <strong>Activity content:</strong> We store the activity entries, plans, check-ins,
            notes and social posts you create in Twikka. Where you choose to share content with
            other users (for example through challenges or social features), those users will see
            that content.
          </p>
          <p>
            <strong>Usage data:</strong> We collect anonymised or pseudonymised data about how you
            use the app, such as which features you use and how often. This helps us improve the
            product.
          </p>
          <p>
            <strong>Device and technical data:</strong> We collect standard technical information
            when you use the app, including device type, operating system, app version, and IP
            address.
          </p>
          <p>
            <strong>Location and locale data:</strong> Country (inferred or provided by you), time
            zone, and language or locale preferences. If you grant location permissions, the app may
            also use your approximate or precise location to support activity-tracking and city
            features. You can disable location access at any time from your device settings.
          </p>
          <p>
            <strong>Payment data:</strong> If you subscribe to a paid plan, payment is processed by
            our payment partners (such as Apple App Store, Google Play, or Paddle). We do not store
            your full payment card details. We receive a transaction record and subscription status
            from the payment partner.
          </p>

          <h2>4. How we use your data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>create and manage your account</li>
            <li>deliver the features of Twikka, including personalised plans and check-ins</li>
            <li>process payments and manage your subscription</li>
            <li>respond to support requests</li>
            <li>send you service notifications (e.g. subscription renewal reminders)</li>
            <li>improve the app through aggregated analytics</li>
            <li>meet our legal obligations</li>
          </ul>
          <p>We do not use your personal health data to train AI models.</p>

          <h2>5. Third-party services</h2>
          <p>We use the following third-party services that may process your personal data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase:</strong> Database and authentication infrastructure — Account data,
              app content
            </li>
            <li>
              <strong>Convex:</strong> Backend infrastructure for some app features — Activity
              content, usage data
            </li>
            <li>
              <strong>App Store / Google Play / Paddle:</strong> Payment processing — Payment and
              billing information
            </li>
            <li>
              <strong>Push notification provider:</strong> Push notifications — Device identifiers,
              notification preferences
            </li>
            <li>
              <strong>Analytics provider:</strong> App usage analytics — Pseudonymised usage data
            </li>
            <li>
              <strong>AI provider (e.g. OpenAI, OpenRouter, Anthropic):</strong> AI-powered coaching
              features — Limited content data to process AI requests
            </li>
          </ul>
          <p>
            Each of these providers has their own privacy policy and data processing terms. Where
            required by GDPR, we have Data Processing Agreements in place with these providers.
          </p>

          <h2>6. Data transfers outside the EEA</h2>
          <p>
            Some of our third-party service providers are based outside the European Economic Area
            (EEA). Where we transfer personal data outside the EEA, we ensure appropriate safeguards
            are in place, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Standard Contractual Clauses (SCCs) approved by the European Commission
            </li>
            <li>adequacy decisions where applicable</li>
          </ul>

          <h2>7. How long we keep your data</h2>
          <p>
            <strong>Account data:</strong> Until you delete your account, plus 30 days
          </p>
          <p>
            <strong>Activity and health content:</strong> Until you delete your account, plus 30
            days
          </p>
          <p>
            <strong>Usage analytics:</strong> 24 months (aggregated/anonymised)
          </p>
          <p>
            <strong>Payment records:</strong> 7 years (for legal and tax compliance)
          </p>
          <p>
            <strong>Backup copies:</strong> Up to 90 days after deletion from primary systems
          </p>

          <h2>8. Your rights</h2>
          <p>Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access</strong> — you can ask us for a copy of the personal data we hold about
              you.
            </li>
            <li>
              <strong>Correction</strong> — you can ask us to correct inaccurate data.
            </li>
            <li>
              <strong>Deletion</strong> — you can ask us to delete your data (subject to legal
              retention requirements).
            </li>
            <li>
              <strong>Portability</strong> — you can ask us to provide your data in a
              machine-readable format.
            </li>
            <li>
              <strong>Restriction</strong> — you can ask us to restrict processing of your data in
              certain circumstances.
            </li>
            <li>
              <strong>Objection</strong> — you can object to processing based on legitimate
              interests.
            </li>
            <li>
              <strong>Withdraw consent</strong> — where processing is based on consent, you can
              withdraw it at any time.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@novansa.com" className="text-primary hover:underline">
              privacy@novansa.com
            </a>
            . We will respond within 30 days.
          </p>
          <p>
            You also have the right to lodge a complaint with the Estonian Data Protection
            Inspectorate (Andmekaitse Inspektsioon,{' '}
            <a
              href="https://www.aki.ee"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              aki.ee
            </a>
            ) or the data protection authority in your country of residence.
          </p>

          <h2>9. Data security</h2>
          <p>We implement technical and organisational measures to protect your data, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>encryption in transit (TLS) and at rest</li>
            <li>access controls limiting who within our team can access personal data</li>
            <li>regular security reviews</li>
            <li>secure, hardened server infrastructure</li>
          </ul>
          <p>
            No system is completely secure. If you become aware of a potential security issue,
            please contact us at{' '}
            <a href="mailto:security@novansa.com" className="text-primary hover:underline">
              security@novansa.com
            </a>
            .
          </p>

          <h2>10. Cookies and tracking</h2>
          <p>
            The Twikka website and app may use cookies or similar technologies for session
            management and analytics. You can control cookie settings through your device or
            browser. Refusing certain cookies may affect how the service functions.
          </p>

          <h2>11. Children&apos;s data</h2>
          <p>
            Twikka is not intended for users under 16. We do not knowingly collect data from minors.
            If we discover that we have collected data from someone under 16, we will delete it
            promptly.
          </p>

          <h2>12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by email or through the app. The updated policy will state the date it takes
            effect.
          </p>

          <h2>13. Contact us</h2>
          <p>For privacy-related questions or to exercise your rights:</p>
          <p>
            Novansa OÜ
            <br />
            Sepapaja tn 6, 15551 Tallinn, Harju Maakond, Estonia
            <br />
            Email:{' '}
            <a href="mailto:privacy@novansa.com" className="text-primary hover:underline">
              privacy@novansa.com
            </a>
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-primary text-primary-foreground rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg mb-6 opacity-90">{t('cta.subtitle')}</p>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="bg-white text-primary hover:bg-gray-100"
          >
            <Link href="/contact">{t('cta.button')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
