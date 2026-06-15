/**
 * @novansa/auth - Modern Supabase authentication package
 *
 * Provides comprehensive authentication and authorization for Next.js apps
 * with multi-tenant support, JWT claims integration, and role-based permissions.
 */

// Core client and configuration
export {
  createClient,
  createServerClientWithCookies,
  createAdminClient,
  supabaseClientFactory,
  validateSupabaseConfig,
  clearBrowserClientInstance,
} from './client';

// Type definitions
export type {
  // Core types
  Database,
  DatabaseUser,
  UserRole,
  AppName,
  JWTClaims,
  UserProfile,
  AuthState,
  AuthActions,
  AuthContextType,
  UserContextType,

  // OTP / Passwordless types
  OtpChannel,
  OtpVerificationType,
  OtpRequest,
  OtpVerifyRequest,
  OtpRequestResult,
  OtpVerifyResult,
  ContactVerificationState,
  VerificationState,
  AppAuthConfig,

  // Permission and guard types
  PermissionConfig,
  AuthGuardProps,

  // Provider types
  AuthProviderProps,
  UserProviderProps,

  // Event types
  AuthEventType,
  AuthEvent,

  // Configuration types
  SupabaseConfig,
  AuthConfig,

  // Supabase instance types
  SupabaseInstance,
} from './types';

// Supabase instance configuration
export { SUPABASE_ENV_VARS, getInstanceDisplayName } from './types';

// React hooks
export { useAuth, useUser, useClaims, useVerification } from './hooks';

// React contexts (usually not imported directly, but available)
export { AuthContext } from './contexts/AuthContext';
export { UserContext } from './contexts/UserContext';

// React providers
export { AuthProvider } from './providers/AuthProvider';
export { UserProvider } from './providers/UserProvider';

// Note: Middleware functions are exported from ./server for server-side use
export type { AuthMiddlewareConfig } from './middleware';

// Utility functions
export {
  // Auth utilities
  hasPermissions,
  hasRole,
  hasAppAccess,
  isAdmin,
  isOwner,
  canEdit,
  canView,
  getFullName,
  getUserInitials,
  formatUserRole,
  getRoleWeight,
  hasHigherRole,
  isValidSession,
  isAuthenticated,
  getAccountId,
  getRedirectUrl,
  isValidEmail,
  validatePassword,

  // JWT claims utilities
  extractClaims,
  getAccountIdFromToken,
  getRoleFromToken,
  isTokenExpired,
  getTokenExpiry,
  validateClaims,
  getClaimsFromSession,
  debugClaims,

  // Debug utilities
  debugJWT,
  decodeJWT,
  debugAuthState,
  setupDebugHelpers,

  // Guard utilities
  authGuard,
  permissionGuard,
  appAccessGuard,
  roleGuard,
  adminGuard,
  ownerGuard,
  authPermissionGuard,
  routeGuard,
  serverAuthGuard,
  createGuard,
  guardPresets,
} from './utils';

// Guard result type for convenience
export type { GuardResult, RouteGuardConfig } from './utils/guards';

// Error classes (re-export from types)
import {
  AuthenticationError as AuthError,
  PermissionError as PermError,
  UserProfileError as UserError,
} from './types';

export {
  AuthError as AuthenticationError,
  PermError as PermissionError,
  UserError as UserProfileError,
};

/**
 * Package version and metadata
 */
export const version = '0.1.0';
export const name = '@novansa/auth';

/**
 * Quick setup function for common configurations
 */
export function createAuthConfig(options?: {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  enableDevMode?: boolean;
}) {
  return {
    enableAutoRefresh: options?.enableAutoRefresh ?? true,
    refreshInterval: options?.refreshInterval ?? 60000,
    enableDevMode: options?.enableDevMode ?? process.env.NODE_ENV === 'development',
    fallbackToLegacyKeys: true,
  };
}

/**
 * App names with their corresponding Supabase instances.
 */
export type AppWithInstance =
  | 'fall-admin'
  | 'fall-website'
  | 'ripplebase'
  | 'couple-tools-admin'
  | 'couple-tools-website'
  | 'twikka-admin'
  | 'twikka-website';

/**
 * Get the default Supabase instance for an app.
 */
export function getAppInstance(app: AppWithInstance): 'novansa' | 'couple-tools' | 'twikka' {
  switch (app) {
    case 'fall-admin':
    case 'fall-website':
    case 'ripplebase':
      return 'novansa';
    case 'couple-tools-admin':
    case 'couple-tools-website':
      return 'couple-tools';
    case 'twikka-admin':
    case 'twikka-website':
      return 'twikka';
  }
}

/**
 * Common provider setup for apps.
 * Returns configuration including the appropriate Supabase instance.
 */
export function createProviderConfig(app: AppWithInstance) {
  const instance = getAppInstance(app);
  const baseConfig = {
    instance,
    enableAutoRefresh: true,
    refreshInterval: 60000,
  };

  switch (app) {
    case 'fall-admin':
    case 'couple-tools-admin':
    case 'twikka-admin':
      return {
        ...baseConfig,
        // Admin apps might need more frequent refresh for sensitive operations
        refreshInterval: 30000,
      };

    case 'ripplebase':
      return {
        ...baseConfig,
        // Standard config for SaaS app
      };

    case 'fall-website':
    case 'couple-tools-website':
    case 'twikka-website':
      return {
        ...baseConfig,
        // Public websites might need less frequent refresh
        refreshInterval: 120000,
      };

    default:
      return baseConfig;
  }
}
