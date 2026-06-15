'use client';

import { AuthProvider, UserProvider } from '@novansa/auth';

/**
 * Client-side providers for verify page
 * Includes AuthProvider and UserProvider for verification functionality
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider instance="twikka" onAuthStateChange={() => {}}>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}
