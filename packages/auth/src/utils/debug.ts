/**
 * Debug utilities for auth system
 * These functions help inspect JWT tokens and auth state during development
 */

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

/**
 * Decode a JWT token (for debugging purposes only)
 * Note: This doesn't verify the signature, just decodes the payload
 */
export function decodeJWT(token: string): DecodedJWT | null {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('[@novansa/auth] Invalid JWT format');
      return null;
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    // Decode header
    const header = JSON.parse(atob(headerPart.replace(/-/g, '+').replace(/_/g, '/')));

    // Decode payload
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));

    return {
      header,
      payload,
      signature: signaturePart,
      raw: {
        header: headerPart,
        payload: payloadPart,
        signature: signaturePart,
      },
    };
  } catch (error) {
    console.error('[@novansa/auth] Error decoding JWT:', error);
    return null;
  }
}

/**
 * Log JWT token details to console for debugging
 */
export function debugJWT(token: string, label = 'JWT Token'): void {
  if (process.env.NODE_ENV !== 'development') return;

  const decoded = decodeJWT(token);
  if (!decoded) {
    console.log(`[@novansa/auth] ${label}: Invalid token`);
    return;
  }

  console.group(`[@novansa/auth] ${label} Debug`);
  console.log('Header:', decoded.header);
  console.log('Payload:', decoded.payload);
  console.log(
    'Custom Claims:',
    decoded.payload?.account_id
      ? {
          account_id: decoded.payload.account_id,
        }
      : 'None',
  );
  console.log(
    'Expires:',
    typeof decoded.payload?.exp === 'number'
      ? new Date(decoded.payload.exp * 1000).toISOString()
      : 'Unknown',
  );
  console.log(
    'Issued:',
    typeof decoded.payload?.iat === 'number'
      ? new Date(decoded.payload.iat * 1000).toISOString()
      : 'Unknown',
  );
  console.groupEnd();
}

/**
 * Create a window debug function for manual JWT inspection
 */
export function setupDebugHelpers(): void {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return;

  // Make debug functions available on window for manual inspection
  (window as unknown as Record<string, unknown>).debugJWT = debugJWT;
  (window as unknown as Record<string, unknown>).decodeJWT = decodeJWT;

  console.log(
    '[@novansa/auth] Debug helpers available: window.debugJWT(token), window.decodeJWT(token)',
  );
}

/**
 * Log current auth state for debugging
 */
interface AuthStateDebug {
  loading?: boolean;
  user?: { email?: string } | null;
  session?: unknown;
  profile?: { id?: number; email?: string; account?: string; app_access?: string[]; account_role?: string } | null;
  claims?: unknown;
  error?: { message?: string } | null;
}

export function debugAuthState(state: AuthStateDebug, label = 'Auth State'): void {
  if (process.env.NODE_ENV !== 'development') return;

  console.group(`[@novansa/auth] ${label} Debug`);
  console.log('Loading:', state.loading);
  console.log('User:', state.user?.email ?? 'None');
  console.log('Session:', !!state.session);
  console.log(
    'Profile:',
    state.profile
      ? {
          id: state.profile.id,
          email: state.profile.email,
          account: state.profile.account,
          app_access: state.profile.app_access,
          account_role: state.profile.account_role,
        }
      : 'None',
  );
  console.log('Claims:', state.claims ?? 'None');
  console.log('Error:', state.error?.message ?? 'None');
  console.groupEnd();
}
