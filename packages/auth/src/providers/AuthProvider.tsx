import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext } from '../contexts/AuthContext';
import { createClient } from '../client';
import { extractClaims } from '../utils/claims';
import { debugJWT, debugAuthState, setupDebugHelpers } from '../utils/debug';
import { AuthenticationError } from '../types';
import type {
  AuthState,
  AuthProviderProps,
  UserProfile,
  AuthEvent,
  AuthEventType,
  OtpRequest,
  OtpVerifyRequest,
  OtpRequestResult,
  OtpVerifyResult,
  OtpChannel,
} from '../types';

/**
 * AuthProvider component that manages authentication state
 * Handles Supabase auth, session management, and JWT claims
 */
export function AuthProvider({
  children,
  instance,
  enableAutoRefresh: _enableAutoRefresh = true,
  refreshInterval: _refreshInterval = 60000, // 1 minute
  onAuthStateChange,
}: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    claims: null,
    loading: true,
    error: null,
  });

  const supabase = useMemo(() => createClient({ instance }), [instance]);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Setup debug helpers on mount
  useEffect(() => {
    setupDebugHelpers();
  }, []);

  // Clear error helper
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Update state helper
  const updateState = useCallback(
    (updates: Partial<AuthState>) => {
      setState(prev => {
        const newState = { ...prev, ...updates };
        onAuthStateChange?.(newState);
        return newState;
      });
    },
    [onAuthStateChange],
  );

  // Emit auth event helper
  const emitAuthEvent = useCallback((type: AuthEventType, data: Partial<AuthEvent>) => {
    const event: AuthEvent = {
      type,
      session: data.session ?? null,
      user: data.user ?? null,
      error: data.error,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[@novansa/auth] Auth event:', event);
    }
  }, []); // No dependencies needed

  // Fetch user profile (reserved for future use)
  const _fetchUserProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase client requires generic database typing
        const supabaseAny = supabase as any;
        const { data, error } = await supabaseAny
          .from('v_user_profile_with_account_and_subscription')
          .select('*')
          .eq('auth_id', userId)
          .single();

        if (error) {
          console.error('[@novansa/auth] Failed to fetch user profile:', error);
          return null;
        }

        return data as UserProfile;
      } catch (error) {
        console.error('[@novansa/auth] Error fetching user profile:', error);
        return null;
      }
    },
    [supabase],
  );

  // Handle session change
  const handleSessionChange = useCallback(
    async (session: Session | null) => {
      console.log('[@novansa/auth] handleSessionChange called with session:', !!session);

      if (!session) {
        console.log('[@novansa/auth] No session - signing out');
        updateState({
          user: null,
          session: null,
          profile: null,
          claims: null,
          loading: false,
        });
        emitAuthEvent('SIGNED_OUT', { session, user: null });
        return;
      }

      const { user } = session;
      const claims = extractClaims(session.access_token);

      console.log('[@novansa/auth] Session found - user:', user?.email);
      console.log('[@novansa/auth] JWT claims extracted:', claims);

      // Debug JWT token details
      if (session.access_token) {
        debugJWT(session.access_token, 'Access Token');
      }

      const newState = {
        user,
        session,
        claims,
        profile: null, // UserProvider will fetch this
        loading: false,
      };

      updateState(newState);
      debugAuthState(newState, 'Updated Auth State');

      emitAuthEvent('SIGNED_IN', { session, user });
    },
    [updateState, emitAuthEvent],
  );

  // Set up auth state listener
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[@novansa/auth] Error getting initial session:', error);
          if (mounted) {
            updateState({
              error: new AuthenticationError('Failed to get initial session', error),
              loading: false,
            });
          }
          return;
        }

        if (mounted) {
          await handleSessionChange(session);
        }
      } catch (error) {
        console.error('[@novansa/auth] Error in getInitialSession:', error);
        if (mounted) {
          updateState({
            error: error instanceof Error ? error : new Error('Failed to initialize auth'),
            loading: false,
          });
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('[@novansa/auth] Auth state change:', event);

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          await handleSessionChange(session);
          break;
        case 'SIGNED_OUT':
          await handleSessionChange(null);
          break;
        default:
          break;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [supabase, handleSessionChange, updateState]);

  /**
   * Request OTP delivery.
   * For internal apps (with appId), calls server API for gated access.
   * For SaaS apps (no appId), calls Supabase directly.
   */
  const requestOtp = useCallback(
    async (request: OtpRequest): Promise<OtpRequestResult> => {
      const { identifier, channel, appId } = request;
      updateState({ loading: true, error: null });

      try {
        // Internal apps: Use server-side API route for gated OTP
        if (appId) {
          const response = await fetch('/api/auth/request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, channel, appId }),
          });

          const result = await response.json();

          if (!response.ok) {
            // Return generic error to prevent user enumeration
            updateState({ loading: false });
            return {
              success: false,
              message: 'Unable to send verification code. Please try again.',
              error: result.error,
            };
          }

          updateState({ loading: false });
          return {
            success: true,
            message: `Verification code sent to your ${channel === 'sms' ? 'phone' : 'email'}`,
          };
        }

        // SaaS apps: Call Supabase directly
        if (channel === 'sms') {
          // Phone OTP
          const { error } = await supabase.auth.signInWithOtp({
            phone: identifier.trim(),
            options: {
              shouldCreateUser: false,
            },
          });

          if (error) {
            throw new AuthenticationError('Failed to send OTP', error);
          }
        } else {
          // Email OTP (default)
          const { error } = await supabase.auth.signInWithOtp({
            email: identifier.trim(),
            options: {
              shouldCreateUser: false,
            },
          });

          if (error) {
            throw new AuthenticationError('Failed to send OTP', error);
          }
        }

        updateState({ loading: false });
        return {
          success: true,
          message: `Verification code sent to your ${channel === 'sms' ? 'phone' : 'email'}`,
        };
      } catch (error) {
        const authError =
          error instanceof AuthenticationError
            ? error
            : new AuthenticationError('OTP request failed', error as Error);

        updateState({ error: authError, loading: false });
        return {
          success: false,
          message: 'Failed to send verification code',
          error: authError.message,
        };
      }
    },
    [supabase, updateState],
  );

  /**
   * Verify OTP and establish session.
   */
  const verifyOtp = useCallback(
    async (request: OtpVerifyRequest): Promise<OtpVerifyResult> => {
      const { identifier, token, type } = request;
      updateState({ loading: true, error: null });

      try {
        // Determine if identifier is email or phone
        const isPhone = identifier.startsWith('+') || /^\d{10,}$/.test(identifier.replace(/\D/g, ''));

        // Call verifyOtp with appropriate parameters based on identifier type
        let data;
        let error;

        if (isPhone) {
          // Phone verification
          const phoneType: 'sms' | 'phone_change' =
            type === 'login' ? 'sms' : 'phone_change';
          const result = await supabase.auth.verifyOtp({
            phone: identifier.trim(),
            token,
            type: phoneType,
          });
          data = result.data;
          error = result.error;
        } else {
          // Email verification
          const emailType: 'email' | 'email_change' =
            type === 'login' || type === 'verify_email' ? 'email' : 'email_change';
          const result = await supabase.auth.verifyOtp({
            email: identifier.trim(),
            token,
            type: emailType,
          });
          data = result.data;
          error = result.error;
        }

        if (error) {
          throw new AuthenticationError('Invalid verification code', error);
        }

        updateState({ loading: false });

        if (data.session) {
          // Session will be handled by onAuthStateChange listener
          emitAuthEvent('SIGNED_IN', { session: data.session, user: data.user });
        }

        return {
          success: true,
          session: data.session ?? undefined,
        };
      } catch (error) {
        const authError =
          error instanceof AuthenticationError
            ? error
            : new AuthenticationError('OTP verification failed', error as Error);

        updateState({ error: authError, loading: false });
        return {
          success: false,
          error: authError.message,
        };
      }
    },
    [supabase, updateState, emitAuthEvent],
  );

  /**
   * @deprecated Use requestOtp() instead for more control.
   * Convenience wrapper for email OTP login.
   */
  const signInWithOtp = useCallback(
    async (email: string, options?: { channel?: OtpChannel }): Promise<OtpRequestResult> => {
      return requestOtp({
        identifier: email,
        channel: options?.channel ?? 'email',
      });
    },
    [requestOtp],
  );

  const signOut = useCallback(async () => {
    updateState({ loading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new AuthenticationError('Failed to sign out', error);
      }
    } catch (error) {
      const authError =
        error instanceof AuthenticationError
          ? error
          : new AuthenticationError('Sign out failed', error as Error);

      updateState({ error: authError, loading: false });
      throw authError;
    }
  }, [supabase, updateState]);

  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        throw new AuthenticationError('Failed to refresh session', error);
      }

      if (session) {
        await handleSessionChange(session);
        emitAuthEvent('TOKEN_REFRESHED', { session, user: session.user });
      }
    } catch (error) {
      const authError =
        error instanceof AuthenticationError
          ? error
          : new AuthenticationError('Session refresh failed', error as Error);

      updateState({ error: authError });
      throw authError;
    }
  }, [supabase, handleSessionChange, updateState, emitAuthEvent]);

  // Context value
  const contextValue = useMemo(
    () => ({
      ...state,
      // Primary OTP methods
      requestOtp,
      verifyOtp,
      signInWithOtp,
      signOut,
      refreshSession,
      clearError,
      supabase, // Provide shared client
    }),
    [
      state,
      requestOtp,
      verifyOtp,
      signInWithOtp,
      signOut,
      refreshSession,
      clearError,
      // supabase is stable due to singleton pattern, don't include in deps
    ],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
