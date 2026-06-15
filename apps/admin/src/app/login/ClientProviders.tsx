'use client';

import { AuthProvider } from '@novansa/auth';

/**
 * Client-side providers for login page
 * Minimal providers - just auth for login functionality
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider instance="twikka" onAuthStateChange={() => {}}>{children}</AuthProvider>;
}
