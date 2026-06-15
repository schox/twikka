'use client';

import { AuthProvider, UserProvider } from '@novansa/auth';
import { ThemeProvider } from '@novansa/ui';
import { VerificationGuard } from '../../components/VerificationGuard';
import React from 'react';

/**
 * Client-side providers for protected routes
 * This component is imported by the server layout to maintain proper RSC boundaries
 *
 * VerificationGuard ensures the user has completed dual verification (email + phone)
 * before accessing protected content.
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="twikka-admin-theme">
      <AuthProvider instance="twikka" onAuthStateChange={() => {}}>
        <UserProvider>
          <VerificationGuard>{children}</VerificationGuard>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
