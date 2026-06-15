// Server layout for login page
// No 'use client' directive - this is a React Server Component
export const dynamic = 'force-dynamic';

import ClientProviders from './ClientProviders';

/**
 * Login layout - provides minimal auth context for login functionality
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
