'use client';

import { AuthProvider, UserProvider } from '@novansa/auth';
import { ThemeProvider } from '@novansa/ui';
import React from 'react';

/**
 * AppProviders: Compose all top-level providers for the app
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="twikka-admin-theme">
      <AuthProvider instance="twikka" onAuthStateChange={() => {}}>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
