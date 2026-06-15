'use client';

import { PrivateAppScreen } from '@novansa/ui';
import { useRouter } from 'next/navigation';

/**
 * Private page shown to unauthenticated visitors
 * Explains this is a private app and provides login option
 */
export default function PrivatePage() {
  const router = useRouter();

  return (
    <PrivateAppScreen
      appName="Twikka Admin"
      companyName="Twikka"
      title="Staff Portal"
      description="This is a private application for authorized Twikka staff only."
      loginUrl="/login"
      contactEmail="admin@twikka.com"
      onLogin={() => router.push('/login')}
    />
  );
}
