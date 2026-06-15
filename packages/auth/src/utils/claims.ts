import { jwtDecode } from 'jwt-decode';
import type { JWTClaims } from '../types';

/**
 * Extract JWT claims from a token
 */
export function extractClaims(token: string | null | undefined): JWTClaims | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- JWT payload structure is dynamic
    const decoded = jwtDecode<Record<string, unknown>>(token) as any;

    // Extract custom claims (account_id, etc.) and standard claims
    const claims: JWTClaims = {
      account_id: decoded.account_id ?? decoded.app_metadata?.account_id,
      role: decoded.role ?? decoded.app_metadata?.role,
      // Include other potentially useful claims
      sub: decoded.sub,
      aud: decoded.aud,
      exp: decoded.exp,
      iat: decoded.iat,
      iss: decoded.iss,
      email: decoded.email,
      email_verified: decoded.email_verified,
      phone: decoded.phone,
      phone_verified: decoded.phone_verified,
      ...decoded.app_metadata,
      ...decoded.user_metadata,
    };

    return claims;
  } catch (error) {
    console.warn('[@novansa/auth] Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Get account_id from JWT token
 */
export function getAccountIdFromToken(token: string | null | undefined): string | null {
  const claims = extractClaims(token);
  return claims?.account_id ?? null;
}

/**
 * Get user role from JWT token
 */
export function getRoleFromToken(token: string | null | undefined): string | null {
  const claims = extractClaims(token);
  return claims?.role ?? null;
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Get token expiry time
 */
export function getTokenExpiry(token: string | null | undefined): Date | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Validate JWT claims structure
 */
export function validateClaims(claims: JWTClaims | null): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!claims) {
    return {
      isValid: false,
      errors: ['Claims object is null or undefined'],
    };
  }

  // Check for required claims
  if (!claims.sub) {
    errors.push('Missing subject (sub) claim');
  }

  if (!claims.email) {
    errors.push('Missing email claim');
  }

  if (!claims.exp) {
    errors.push('Missing expiry (exp) claim');
  }

  if (!claims.iat) {
    errors.push('Missing issued at (iat) claim');
  }

  // Validate expiry
  if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) {
    errors.push('Token is expired');
  }

  // Validate issued at time is not in the future
  if (claims.iat && claims.iat > Math.floor(Date.now() / 1000) + 60) {
    errors.push('Token issued in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Server-side utility to get claims from session token
 * This can be used in API routes or server components
 */
export function getClaimsFromSession(accessToken?: string): JWTClaims | null {
  if (typeof window !== 'undefined') {
    console.warn('[@novansa/auth] getClaimsFromSession should only be used server-side');
    return null;
  }

  return extractClaims(accessToken);
}

/**
 * Debug utility to log claims information
 */
export function debugClaims(token: string | null | undefined): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const claims = extractClaims(token);
  console.group('[@novansa/auth] JWT Claims Debug');
  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('Claims:', claims);
  console.log('Account ID:', claims?.account_id ?? 'not found');
  console.log('Role:', claims?.role ?? 'not found');
  console.log('Expired:', isTokenExpired(token));
  if (token) {
    console.log('Expires at:', getTokenExpiry(token)?.toISOString() ?? 'unknown');
  }
  console.groupEnd();
}
