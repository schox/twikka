import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@novansa/ui';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('termsPage');
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
            <a href="mailto:legal@novansa.com" className="text-primary hover:underline">
              legal@novansa.com
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
            17445226), with its registered address at Sepapaja tn 6, 15551 Tallinn, Harju Maakond,
            Estonia.
          </p>
          <p>
            When we say &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; in this document, we mean
            Novansa OÜ. When we say &quot;you&quot; or &quot;your&quot;, we mean you as a user of
            Twikka.
          </p>
          <p>
            If you have questions about these terms, you can contact us at{' '}
            <a href="mailto:legal@novansa.com" className="text-primary hover:underline">
              legal@novansa.com
            </a>
            .
          </p>

          <h2>1. Acceptance of these terms</h2>
          <p>
            By creating an account, accessing the Twikka website, or using the Twikka app, you agree
            to these Terms and Conditions. If you do not agree, please do not use Twikka.
          </p>
          <p>
            These terms form a legally binding agreement between you and Novansa OÜ, governed by the
            laws of Estonia.
          </p>

          <h2>2. Who can use Twikka</h2>
          <p>
            Twikka is a general-audience health and activity app. You must be at least 16 years old
            to create an account. If you are under the age of majority in your country, you confirm
            that a parent or legal guardian has reviewed these terms with you.
          </p>
          <p>
            By using Twikka, you confirm that you meet this age requirement. If we become aware that
            a user does not meet the minimum age requirement, we will close their account and delete
            their data.
          </p>

          <h2>3. About the service</h2>
          <p>
            Twikka is a science-based health and activity app that helps people build sustainable
            activity habits. It is provided as a software service, and we may update or change its
            features from time to time.
          </p>
          <p>
            Twikka is not a medical service, diagnostic tool, or substitute for professional medical
            advice. The content, coaching messages, and recommendations provided in the app are for
            general informational and motivational purposes only. Always consult a qualified
            healthcare professional before starting a new exercise programme, especially if you have
            an existing health condition. If you experience a medical emergency, contact your local
            emergency service immediately.
          </p>
          <p>
            Personal, Premium and Corporate accounts may be offered. The accounts available, and
            their features, may change from time to time. Some accounts may be governed by separate
            terms or a Software Licensing Agreement. Where this is the case, we will inform you, and
            those terms will apply in addition to (or in place of) these Terms.
          </p>

          <h2>4. Your account</h2>
          <p>
            <strong>Creating your account:</strong> You are responsible for keeping your login
            credentials secure. Do not share your password with anyone. You are responsible for all
            activity that takes place under your account.
          </p>
          <p>
            <strong>Your responsibility for content:</strong> You are responsible for any content
            you add to Twikka, including activity entries, profile information, social posts, and
            messages. You must not add content that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>is unlawful, harmful, threatening, abusive, or harassing</li>
            <li>infringes anyone else&apos;s intellectual property rights</li>
            <li>contains malware, spam, or any harmful code</li>
            <li>impersonates another person or falsely implies any sponsorship or association</li>
            <li>
              attempts to disrupt, reverse-engineer, scan, or otherwise compromise the integrity,
              availability, or security of Twikka or our infrastructure
            </li>
          </ul>
          <p>
            <strong>Account use:</strong> Twikka accounts are intended for personal, non-commercial
            use, unless you have a separate Corporate or Software Licensing Agreement with us.
          </p>

          <h2>5. Subscription and payments</h2>
          <p>
            Twikka may offer free and paid subscription plans. Paid subscriptions are processed
            through our payment partners (such as Apple App Store, Google Play, or Paddle, depending
            on how you subscribe). Those partners handle payment processing and issue receipts on
            our behalf.
          </p>
          <p>
            <strong>Billing:</strong> Subscriptions are billed in advance on a recurring basis
            (monthly or annually, depending on the plan you choose). Your subscription will
            automatically renew at the end of each billing period unless you cancel before the
            renewal date.
          </p>
          <p>
            <strong>Cancellation:</strong> You may cancel your subscription at any time through your
            app store account or the app settings. Cancellation takes effect at the end of your
            current billing period. We do not offer refunds for partial periods unless required by
            applicable law.
          </p>
          <p>
            <strong>Price changes:</strong> We may change subscription prices from time to time.
            Where required, we will give you at least 30 days&apos; notice before any price change
            takes effect. Continued use of the app after a price change constitutes acceptance of
            the new price.
          </p>
          <p>
            <strong>Refunds:</strong> EU consumer protection regulations may give you rights to a
            refund in certain circumstances. Nothing in these terms limits those rights. Refund
            requests for App Store or Google Play purchases are handled by the relevant store.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            All content, software, design, and technology that makes up Twikka belongs to Novansa OÜ
            or our licensors and is protected by copyright and other intellectual property laws. You
            may not copy, modify, distribute, sell, or reverse-engineer any part of the app or
            website, except as expressly permitted in these Terms.
          </p>
          <p>
            <strong>Your content:</strong> You retain ownership of content you create in Twikka
            (such as activity entries, notes, and social posts). By using the app, you grant us a
            limited, worldwide, non-exclusive, royalty-free licence to store, process, and display
            that content solely to provide the service to you and other users you choose to share
            with.
          </p>

          <h2>7. Artificial intelligence features</h2>
          <p>
            Twikka may include features powered by third-party AI providers (such as coaching
            personas and personalised suggestions). Where AI features are present:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              AI-generated suggestions are provided for general guidance and motivation only and
              should not be relied upon for medical or other important decisions
            </li>
            <li>We do not use your personal health data to train AI models</li>
            <li>
              AI processing may involve data being sent to a third-party provider; see our Privacy
              Policy for details
            </li>
          </ul>

          <h2>8. Service availability</h2>
          <p>
            We aim to keep Twikka available and working well, but we do not guarantee uninterrupted
            service. We may need to take the app offline for maintenance, updates, or for reasons
            beyond our control.
          </p>

          <h2>9. Limitation of liability</h2>
          <p>To the extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We provide Twikka &quot;as is&quot; and make no warranties about its fitness for any
              particular purpose
            </li>
            <li>
              We are not liable for any indirect, incidental, special, or consequential loss arising
              from your use of the app, including (without limitation) loss of profit, loss of data,
              or damage to goodwill
            </li>
            <li>
              Our total liability to you in any 12-month period is limited to the amount you paid us
              in that period (or, where you have not paid anything, the resupply of the service to
              you)
            </li>
          </ul>
          <p>
            Nothing in these terms excludes or limits liability that cannot be excluded under
            Estonian law or EU consumer protection law.
          </p>

          <h2>10. Indemnity</h2>
          <p>
            You agree to indemnify Novansa OÜ, its affiliates, employees, agents, contributors and
            licensors from and against all actions, suits, claims, demands, liabilities, costs,
            expenses, loss and damage (including reasonable legal fees) incurred or arising out of
            or in connection with your content, your use of Twikka, or your breach of these Terms.
          </p>

          <h2>11. Termination</h2>
          <p>
            <strong>By you:</strong> You may delete your account at any time through the app
            settings, or by contacting{' '}
            <a href="mailto:support@twikka.com" className="text-primary hover:underline">
              support@twikka.com
            </a>
            .
          </p>
          <p>
            <strong>By us:</strong> We may suspend or terminate your account if you breach these
            terms, engage in harmful conduct, fail to pay applicable fees, or if we discontinue the
            service. Where possible, we will give you reasonable notice.
          </p>
          <p>On termination, your data will be handled as described in our Privacy Policy.</p>

          <h2>12. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of material changes by
            email or through the app at least 14 days before they take effect. Continued use after
            that date means you accept the updated Terms. We recommend you keep a copy of the Terms
            for your records.
          </p>

          <h2>13. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of Estonia. The courts of Estonia have jurisdiction
            over any disputes arising from these Terms or your use of Twikka.
          </p>
          <p>
            If you are a consumer in the EU, you may also have the right to use the EU Online
            Dispute Resolution platform at{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>

          <h2>14. Severance</h2>
          <p>
            If any part of these Terms is found to be void or unenforceable by a court of competent
            jurisdiction, that part will be severed and the remaining Terms will continue in full
            force and effect.
          </p>

          <h2>15. Contact us</h2>
          <p>For questions about these Terms, please contact:</p>
          <p>
            Novansa OÜ
            <br />
            Sepapaja tn 6, 15551 Tallinn, Harju Maakond, Estonia
            <br />
            Email:{' '}
            <a href="mailto:legal@novansa.com" className="text-primary hover:underline">
              legal@novansa.com
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
