'use client';

import { useEffect } from 'react';
import { useUser } from '@novansa/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface VerificationGuardProps {
  children: React.ReactNode;
}

/**
 * VerificationGuard: Ensures the user has completed dual verification (email + phone)
 * before accessing protected content. Redirects to /verify if not fully verified.
 */
export function VerificationGuard({ children }: VerificationGuardProps) {
  const router = useRouter();
  const { profile, loading, isFullyVerified } = useUser();

  useEffect(() => {
    // Only redirect after loading is complete and we have a profile
    if (!loading && profile) {
      if (!isFullyVerified) {
        router.replace('/verify');
      }
    }
  }, [loading, profile, isFullyVerified, router]);

  // Show loading while checking verification status
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If not verified, show loading while redirecting
  if (profile && !isFullyVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to verification...</p>
      </div>
    );
  }

  // User is verified, render children
  return <>{children}</>;
}
