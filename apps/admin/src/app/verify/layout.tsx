// Server layout for verify page
// No 'use client' directive - this is a React Server Component
export const dynamic = 'force-dynamic';

import ClientProviders from './ClientProviders';

/**
 * Verify layout - provides auth context for verification functionality
 */
export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
