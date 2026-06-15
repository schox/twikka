'use client';

import { useEffect } from 'react';
import { useAuth, useUser, useVerification } from '@novansa/auth';
import { VerifyContactRow } from '@novansa/ui';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUser();
  const {
    verificationState,
    isFullyVerified,
    requestVerificationOtp,
    verifyContact,
  } = useVerification();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Redirect to home if fully verified
  useEffect(() => {
    if (isFullyVerified) {
      toast.success('Verification complete!');
      router.push('/home');
    }
  }, [isFullyVerified, router]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-background to-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null; // Will redirect
  }

  const emailVerified = verificationState?.email.verified ?? false;
  const phoneVerified = verificationState?.phone.verified ?? false;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md bg-card border rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Verify Your Identity</h1>
          <p className="text-muted-foreground mt-2">
            Please verify both your email and phone number to continue.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                emailVerified
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {emailVerified ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">1</span>
              )}
            </div>
            <span className={`text-sm ${emailVerified ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
              Email
            </span>
          </div>

          <div className="w-8 h-px bg-border" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                phoneVerified
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {phoneVerified ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">2</span>
              )}
            </div>
            <span className={`text-sm ${phoneVerified ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
              Phone
            </span>
          </div>
        </div>

        {/* Verification rows */}
        <div className="space-y-4 divide-y divide-border">
          {/* Email verification */}
          <VerifyContactRow
            type="email"
            value={verificationState?.email.value ?? profile?.email ?? null}
            verified={emailVerified}
            pendingValue={verificationState?.email.pending}
            pendingVerified={verificationState?.email.pendingVerified}
            onRequestOtp={async () => {
              const result = await requestVerificationOtp('email');
              return { success: result.success, error: result.error };
            }}
            onVerifyOtp={async (code) => {
              const result = await verifyContact('email', code);
              return { success: result.success, error: result.error };
            }}
            masked={false}
          />

          {/* Phone verification */}
          <VerifyContactRow
            type="phone"
            value={verificationState?.phone.value ?? profile?.phone ?? null}
            verified={phoneVerified}
            pendingValue={verificationState?.phone.pending}
            pendingVerified={verificationState?.phone.pendingVerified}
            onRequestOtp={async () => {
              const result = await requestVerificationOtp('phone');
              return { success: result.success, error: result.error };
            }}
            onVerifyOtp={async (code) => {
              const result = await verifyContact('phone', code);
              return { success: result.success, error: result.error };
            }}
            masked={false}
          />
        </div>

        {/* No phone number set message */}
        {!verificationState?.phone.value && !profile?.phone && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Phone number required:</strong> Please contact your administrator to add a phone number to your profile.
            </p>
          </div>
        )}

        {/* Sign out link */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSignOut}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Info */}
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Verification is required for your security. You only need to do this once.
        </p>
      </div>
    </div>
  );
}
