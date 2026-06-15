'use client';

import { useEffect } from 'react';
import { useAuth } from '@novansa/auth';
import { AdminLoginCard } from '@novansa/ui';
import { toast } from 'sonner';

export default function LoginPage() {
  const { verifyOtp, supabase } = useAuth();

  // Clear stale local session on mount to prevent redirect loops
  useEffect(() => {
    supabase.auth.signOut({ scope: 'local' });
  }, [supabase]);

  return (
    <AdminLoginCard
      appName="Twikka Admin"
      onRequestOtp={async (identifier, channel, e164Phone) => {
        const response = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: e164Phone ?? identifier,
            channel,
          }),
        });
        const result = await response.json();
        if (result.success) {
          toast.success(
            channel === 'email'
              ? 'Check your email for the verification code'
              : 'Check your phone for the verification code'
          );
        }
        return {
          success: result.success,
          error: result.error,
        };
      }}
      onVerifyOtp={async (code, identifier) => {
        const result = await verifyOtp({
          identifier,
          token: code,
          type: 'login',
        });

        if (result.success) {
          toast.success('Welcome!');
          window.location.href = '/verify';
        }
        return {
          success: result.success,
          error: result.error,
        };
      }}
      footerText="This is a private app for authorized staff only."
    />
  );
}
