import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { extractClaims, isTokenExpired, getTokenExpiry } from '../utils/claims';
import type { JWTClaims } from '../types';

/**
 * Hook to access JWT claims from the current session
 * Provides direct access to account_id, app_admin, app_access, and other custom claims
 */
export function useClaims() {
  const { session, user } = useAuth();

  const claims = useMemo<JWTClaims | null>(() => {
    if (!session?.access_token) {
      return null;
    }

    return extractClaims(session.access_token);
  }, [session?.access_token]);

  const accountId = useMemo(() => {
    return claims?.account_id ?? null;
  }, [claims?.account_id]);

  const role = useMemo(() => {
    return claims?.role ?? null;
  }, [claims?.role]);

  const accountRole = useMemo(() => {
    return claims?.account_role ?? null;
  }, [claims?.account_role]);

  const appAdmin = useMemo(() => {
    return claims?.app_admin ?? false;
  }, [claims?.app_admin]);

  const appAccess = useMemo(() => {
    return claims?.app_access ?? [];
  }, [claims?.app_access]);

  const isExpired = useMemo(() => {
    return isTokenExpired(session?.access_token);
  }, [session?.access_token]);

  const expiresAt = useMemo(() => {
    return getTokenExpiry(session?.access_token);
  }, [session?.access_token]);

  const isValid = useMemo(() => {
    return !!(claims && user && !isExpired);
  }, [claims, user, isExpired]);

  return {
    // Core claims data
    claims,
    accountId,
    role,
    accountRole,
    appAdmin,
    appAccess,

    // Token validation
    isValid,
    isExpired,
    expiresAt,

    // Convenience getters
    hasAccountId: !!accountId,
    hasRole: !!role,
    isAppAdmin: appAdmin,
    isAccountAdmin: accountRole === 'owner' || accountRole === 'admin',
    isAccountOwner: accountRole === 'owner',

    // App access helpers
    hasAppAccess: (app: string) => appAccess.includes(app),

    // Raw token access (use sparingly)
    accessToken: session?.access_token ?? null,

    // Helper function to get specific claim
    getClaim: <T = unknown>(key: string): T | null => {
      return (claims?.[key] as T) ?? null;
    },
  };
}
