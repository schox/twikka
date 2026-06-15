// Server layout - controls rendering mode for protected segment
// No 'use client' directive - this is a React Server Component
export const dynamic = 'force-dynamic'; // Protected routes should be dynamic
export const runtime = 'nodejs'; // Required for Supabase server operations

import ClientProviders from './ClientProviders';
import { cookies } from 'next/headers';
import { createServerClientWithCookies } from '@novansa/auth/server';
import { redirect } from 'next/navigation';

/**
 * Protected layout with server-side auth check
 * Prevents client flash by redirecting at request time
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check
  const cookieStore = await cookies();
  const supabase = createServerClientWithCookies(cookieStore, { instance: 'twikka' });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect to login if no authenticated user
  if (!user || error) {
    redirect('/login');
  }

  // Render with client providers
  return <ClientProviders>{children}</ClientProviders>;
}
