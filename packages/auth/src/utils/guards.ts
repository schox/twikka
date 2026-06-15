import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, PermissionConfig, AppName, UserRole } from '../types';
import { hasPermissions, isAuthenticated } from './auth';

/**
 * Auth guard result type
 */
export interface GuardResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
}

/**
 * Authentication guard - checks if user is signed in
 */
export function authGuard(
  user: User | null,
  session: Session | null,
  fallbackUrl = '/login',
): GuardResult {
  if (!isAuthenticated(user, session)) {
    return {
      allowed: false,
      reason: 'User is not authenticated',
      redirectTo: fallbackUrl,
    };
  }

  return { allowed: true };
}

/**
 * Permission guard - checks user permissions
 */
export function permissionGuard(
  profile: UserProfile | null,
  permissions: PermissionConfig,
  fallbackUrl = '/unauthorized',
): GuardResult {
  if (!profile) {
    return {
      allowed: false,
      reason: 'User profile not found',
      redirectTo: fallbackUrl,
    };
  }

  if (!hasPermissions(profile, permissions)) {
    const reasons = [];

    if (permissions.roles) {
      reasons.push(`Required roles: ${permissions.roles.join(', ')}`);
    }

    if (permissions.apps) {
      reasons.push(`Required app access: ${permissions.apps.join(', ')}`);
    }

    return {
      allowed: false,
      reason: `Insufficient permissions. ${reasons.join('. ')}`,
      redirectTo: fallbackUrl,
    };
  }

  return { allowed: true };
}

/**
 * App access guard - checks if user can access specific app
 */
export function appAccessGuard(
  profile: UserProfile | null,
  app: AppName,
  fallbackUrl = '/unauthorized',
): GuardResult {
  return permissionGuard(profile, { apps: [app] }, fallbackUrl);
}

/**
 * Role guard - checks if user has required role(s)
 */
export function roleGuard(
  profile: UserProfile | null,
  roles: UserRole | UserRole[],
  fallbackUrl = '/unauthorized',
): GuardResult {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return permissionGuard(profile, { roles: roleArray }, fallbackUrl);
}

/**
 * Admin guard - checks if user is admin
 */
export function adminGuard(
  profile: UserProfile | null,
  fallbackUrl = '/unauthorized',
): GuardResult {
  return permissionGuard(profile, { roles: ['owner', 'admin'] }, fallbackUrl);
}

/**
 * Owner guard - checks if user is owner
 */
export function ownerGuard(
  profile: UserProfile | null,
  fallbackUrl = '/unauthorized',
): GuardResult {
  return permissionGuard(profile, { roles: ['owner'] }, fallbackUrl);
}

/**
 * Combined auth and permission guard
 */
export function authPermissionGuard(
  user: User | null,
  session: Session | null,
  profile: UserProfile | null,
  permissions: PermissionConfig,
  authFallbackUrl = '/login',
  permissionFallbackUrl = '/unauthorized',
): GuardResult {
  // First check authentication
  const authResult = authGuard(user, session, authFallbackUrl);
  if (!authResult.allowed) {
    return authResult;
  }

  // Then check permissions
  return permissionGuard(profile, permissions, permissionFallbackUrl);
}

/**
 * Route guard configuration
 */
export interface RouteGuardConfig {
  requireAuth?: boolean;
  permissions?: PermissionConfig;
  authFallbackUrl?: string;
  permissionFallbackUrl?: string;
}

/**
 * Comprehensive route guard
 */
export function routeGuard(
  user: User | null,
  session: Session | null,
  profile: UserProfile | null,
  config: RouteGuardConfig = {},
): GuardResult {
  const {
    requireAuth = true,
    permissions,
    authFallbackUrl = '/login',
    permissionFallbackUrl = '/unauthorized',
  } = config;

  // Check authentication if required
  if (requireAuth) {
    const authResult = authGuard(user, session, authFallbackUrl);
    if (!authResult.allowed) {
      return authResult;
    }
  }

  // Check permissions if specified
  if (permissions) {
    return permissionGuard(profile, permissions, permissionFallbackUrl);
  }

  return { allowed: true };
}

/**
 * Server-side auth guard for API routes and middleware
 */
export function serverAuthGuard(
  user: User | null,
  session: Session | null,
): {
  authenticated: boolean;
  user: User | null;
  session: Session | null;
  error?: string;
} {
  if (!isAuthenticated(user, session)) {
    return {
      authenticated: false,
      user: null,
      session: null,
      error: 'Authentication required',
    };
  }

  return {
    authenticated: true,
    user,
    session,
  };
}

/**
 * Guard factory for creating custom guards
 */
export function createGuard<T extends Record<string, unknown>>(
  guardFn: (params: T) => boolean,
  failureReason: string,
  fallbackUrl?: string,
) {
  return (params: T): GuardResult => {
    if (!guardFn(params)) {
      return {
        allowed: false,
        reason: failureReason,
        redirectTo: fallbackUrl,
      };
    }

    return { allowed: true };
  };
}

/**
 * Common guard presets
 */
export const guardPresets = {
  /**
   * Fall admin app access
   */
  fallAdmin: (profile: UserProfile | null) => appAccessGuard(profile, 'fall-admin'),

  /**
   * Ripplebase app access
   */
  ripplebase: (profile: UserProfile | null) => appAccessGuard(profile, 'ripplebase'),

  /**
   * Fall website admin access
   */
  fallWebsiteAdmin: (profile: UserProfile | null) => appAccessGuard(profile, 'fall-website'),

  /**
   * Can edit content (editor role or higher)
   */
  canEdit: (profile: UserProfile | null) => roleGuard(profile, ['owner', 'admin', 'editor']),

  /**
   * Can view content (viewer role or higher)
   */
  canView: (profile: UserProfile | null) =>
    roleGuard(profile, ['owner', 'admin', 'editor', 'viewer']),

  /**
   * Multi-app access (fall-admin and ripplebase)
   */
  multiApp: (profile: UserProfile | null) =>
    permissionGuard(profile, {
      apps: ['fall-admin', 'ripplebase'],
      requireAll: true,
    }),
} as const;
