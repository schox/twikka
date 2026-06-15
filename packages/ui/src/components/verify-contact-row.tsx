'use client';

import * as React from 'react';
import { cn } from '../utils';
import { Button } from './button';
import { OtpInput } from './otp-input';
import { Badge } from './badge';

export type VerifyContactRowState =
  | 'idle'
  | 'sending'
  | 'awaiting_code'
  | 'verifying'
  | 'verified'
  | 'error';

export interface VerifyContactRowProps {
  /** Type of contact */
  type: 'email' | 'phone';
  /** The contact value to verify */
  value: string | null;
  /** Whether the contact is already verified */
  verified: boolean;
  /** Pending value (for contact change flow) */
  pendingValue?: string | null;
  /** Whether the pending value is verified */
  pendingVerified?: boolean;
  /** Callback to request an OTP */
  onRequestOtp: () => Promise<{ success: boolean; error?: string }>;
  /** Callback to verify an OTP */
  onVerifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  /** Callback to cancel pending change */
  onCancelPending?: () => Promise<void>;
  /** Show masked value (e.g., j***@example.com) */
  masked?: boolean;
  /** Disable the component */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Mask an email address for privacy display.
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : `${local[0]}***`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask a phone number for privacy display.
 */
function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 3)}***${phone.slice(-2)}`;
}

/**
 * VerifyContactRow component for displaying and verifying a contact.
 * Handles the full verification flow: idle -> sending -> awaiting_code -> verifying -> verified
 */
export function VerifyContactRow({
  type,
  value,
  verified,
  pendingValue,
  pendingVerified = false,
  onRequestOtp,
  onVerifyOtp,
  onCancelPending,
  masked = false,
  disabled = false,
  className,
}: VerifyContactRowProps) {
  const [state, setState] = React.useState<VerifyContactRowState>(
    verified ? 'verified' : 'idle',
  );
  const [error, setError] = React.useState<string | null>(null);
  const [resendTimer, setResendTimer] = React.useState(0);

  // Reset state when verified prop changes
  React.useEffect(() => {
    if (verified) {
      setState('verified');
    } else if (state === 'verified') {
      setState('idle');
    }
  }, [verified, state]);

  // Resend timer countdown
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendTimer]);

  const displayValue = React.useMemo(() => {
    if (!value) return null;
    if (!masked) return value;
    return type === 'email' ? maskEmail(value) : maskPhone(value);
  }, [value, masked, type]);

  const handleSendCode = async () => {
    setState('sending');
    setError(null);

    try {
      const result = await onRequestOtp();
      if (result.success) {
        setState('awaiting_code');
        setResendTimer(60); // 60 second cooldown
      } else {
        setError(result.error ?? 'Failed to send code');
        setState('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
      setState('error');
    }
  };

  const handleVerifyCode = async (code: string) => {
    setState('verifying');
    setError(null);

    try {
      const result = await onVerifyOtp(code);
      if (result.success) {
        setState('verified');
      } else {
        setError(result.error ?? 'Invalid code');
        setState('awaiting_code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setState('awaiting_code');
    }
  };

  const handleCancel = () => {
    setState('idle');
    setError(null);
  };

  const handleCancelPending = async () => {
    if (onCancelPending) {
      await onCancelPending();
    }
  };

  if (!value) {
    return (
      <div className={cn('flex items-center justify-between py-3', className)}>
        <div>
          <span className="text-sm font-medium capitalize">{type}</span>
          <p className="text-sm text-muted-foreground">Not set</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-3', className)}>
      {/* Main contact row */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize">{type}</span>
            {verified && (
              <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                Verified
              </Badge>
            )}
            {!verified && state !== 'verified' && (
              <Badge variant="secondary" className="text-muted-foreground">
                Not verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground truncate">{displayValue}</p>
        </div>

        {/* Action button */}
        {!verified && state === 'idle' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendCode}
            disabled={disabled}
          >
            Verify
          </Button>
        )}

        {state === 'sending' && (
          <Button variant="outline" size="sm" disabled>
            Sending...
          </Button>
        )}

        {state === 'verified' && (
          <span className="text-green-600 text-sm flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>

      {/* OTP input section */}
      {(state === 'awaiting_code' || state === 'verifying') && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            Enter the 6-digit code sent to your {type}
          </p>

          <OtpInput
            onComplete={handleVerifyCode}
            disabled={state === 'verifying' || disabled}
            error={!!error}
            autoFocus
          />

          {error && (
            <p className="text-sm text-destructive mt-2 text-center">{error}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={state === 'verifying'}>
              Cancel
            </Button>

            {resendTimer > 0 ? (
              <span className="text-sm text-muted-foreground">
                Resend in {resendTimer}s
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendCode}
                disabled={state === 'verifying' || disabled}
              >
                Resend code
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {state === 'error' && (
        <div className="mt-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => setState('idle')} className="mt-2">
            Try again
          </Button>
        </div>
      )}

      {/* Pending value section */}
      {pendingValue && !pendingVerified && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Pending change
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {masked
                  ? type === 'email'
                    ? maskEmail(pendingValue)
                    : maskPhone(pendingValue)
                  : pendingValue}
              </p>
            </div>
            {onCancelPending && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelPending}
                className="text-amber-700 hover:text-amber-900"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
