import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import { useUser } from './useUser';
import type {
  OtpChannel,
  OtpVerificationType,
  OtpRequestResult,
  OtpVerifyResult,
  VerificationState,
} from '../types';
import { AuthenticationError } from '../types';

/**
 * Hook for managing contact verification flows.
 * Provides methods for requesting and verifying OTPs for email/phone verification.
 */
export function useVerification() {
  const { requestOtp, verifyOtp, supabase } = useAuth();
  const {
    verificationState,
    isFullyVerified,
    updatePendingEmail,
    updatePendingPhone,
    cancelPendingChange,
    markContactVerified,
    refetch,
  } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request an OTP for verifying a contact (email or phone).
   */
  const requestVerificationOtp = useCallback(
    async (
      type: 'email' | 'phone' | 'pending_email' | 'pending_phone',
      options?: { channel?: OtpChannel },
    ): Promise<OtpRequestResult> => {
      setLoading(true);
      setError(null);

      try {
        // Determine the identifier based on type
        let identifier: string | null = null;
        let channel: OtpChannel = options?.channel ?? 'email';

        switch (type) {
          case 'email':
            identifier = verificationState?.email.value ?? null;
            channel = 'email';
            break;
          case 'phone':
            identifier = verificationState?.phone.value ?? null;
            channel = 'sms';
            break;
          case 'pending_email':
            identifier = verificationState?.email.pending ?? null;
            channel = 'email';
            break;
          case 'pending_phone':
            identifier = verificationState?.phone.pending ?? null;
            channel = 'sms';
            break;
        }

        if (!identifier) {
          const result: OtpRequestResult = {
            success: false,
            message: `No ${type.replace('_', ' ')} available to verify`,
            error: 'MISSING_IDENTIFIER',
          };
          setError(result.message);
          return result;
        }

        // For phone verification, use updateUser which triggers OTP
        // signInWithOtp only works if phone is already in auth.users
        if (channel === 'sms') {
          const { error } = await supabase.auth.updateUser({
            phone: identifier.trim(),
          });

          if (error) {
            const errorMessage = error.message || 'Failed to send verification code';
            setError(errorMessage);
            return {
              success: false,
              message: errorMessage,
              error: errorMessage,
            };
          }

          return {
            success: true,
            message: 'Verification code sent to your phone',
          };
        }

        // For email, use the standard requestOtp flow
        const result = await requestOtp({
          identifier,
          channel,
        });

        if (!result.success) {
          setError(result.error ?? result.message);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to request OTP';
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [verificationState, requestOtp, supabase],
  );

  /**
   * Verify a contact with an OTP code.
   */
  const verifyContact = useCallback(
    async (
      type: 'email' | 'phone' | 'pending_email' | 'pending_phone',
      token: string,
    ): Promise<OtpVerifyResult> => {
      setLoading(true);
      setError(null);

      try {
        // Determine the identifier and verification type
        let identifier: string | null = null;
        let verificationType: OtpVerificationType;

        switch (type) {
          case 'email':
            identifier = verificationState?.email.value ?? null;
            verificationType = 'verify_email';
            break;
          case 'phone':
            identifier = verificationState?.phone.value ?? null;
            verificationType = 'verify_phone';
            break;
          case 'pending_email':
            identifier = verificationState?.email.pending ?? null;
            verificationType = 'verify_pending_email';
            break;
          case 'pending_phone':
            identifier = verificationState?.phone.pending ?? null;
            verificationType = 'verify_pending_phone';
            break;
        }

        if (!identifier) {
          const result: OtpVerifyResult = {
            success: false,
            error: `No ${type.replace('_', ' ')} available to verify`,
          };
          setError(result.error ?? null);
          return result;
        }

        const result = await verifyOtp({
          identifier,
          token,
          type: verificationType,
        });

        if (result.success) {
          // Mark the contact as verified in the database
          await markContactVerified(type);
          // Refetch profile to update UI immediately
          await refetch();
        } else {
          setError(result.error ?? 'Verification failed');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [verificationState, verifyOtp, markContactVerified, refetch],
  );

  /**
   * Clear the error state.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    verificationState,
    isFullyVerified,
    loading,
    error,

    // Actions
    requestVerificationOtp,
    verifyContact,
    updatePendingEmail,
    updatePendingPhone,
    cancelPendingChange,
    clearError,
  };
}
