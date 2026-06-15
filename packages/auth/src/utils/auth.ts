import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, UserRole, AppName, PermissionConfig } from '../types';

/**
 * Check if user has required permissions
 */
export function hasPermissions(profile: UserProfile | null, config: PermissionConfig): boolean {
  if (!profile) return false;

  const { roles, apps, requireAll = false } = config;

  let hasRoles = true;
  let hasApps = true;

  // Check roles
  if (roles && roles.length > 0) {
    if (requireAll) {
      hasRoles = roles.every(role => profile.account_role === role);
    } else {
      hasRoles = roles.includes(profile.account_role);
    }
  }

  // Check app access
  if (apps && apps.length > 0) {
    const userApps = profile.app_access || [];
    if (requireAll) {
      hasApps = apps.every(app => userApps.includes(app));
    } else {
      hasApps = apps.some(app => userApps.includes(app));
    }
  }

  return hasRoles && hasApps;
}

/**
 * Check if user has specific role
 */
export function hasRole(profile: UserProfile | null, roles: UserRole | UserRole[]): boolean {
  if (!profile?.account_role) return false;

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(profile.account_role);
}

/**
 * Check if user has app access
 */
export function hasAppAccess(profile: UserProfile | null, app: AppName): boolean {
  if (!profile?.app_access) return false;
  return profile.app_access.includes(app);
}

/**
 * Check if user is admin (owner, admin role, or app_admin flag)
 */
export function isAdmin(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return hasRole(profile, ['owner', 'admin']) || !!profile.app_admin;
}

/**
 * Check if user is owner
 */
export function isOwner(profile: UserProfile | null): boolean {
  return hasRole(profile, 'owner');
}

/**
 * Check if user can edit (owner, admin, editor)
 */
export function canEdit(profile: UserProfile | null): boolean {
  return hasRole(profile, ['owner', 'admin', 'editor']);
}

/**
 * Check if user can view (owner, admin, editor, viewer)
 */
export function canView(profile: UserProfile | null): boolean {
  return hasRole(profile, ['owner', 'admin', 'editor', 'viewer']);
}

/**
 * Get user's full name
 */
export function getFullName(profile: UserProfile | null): string {
  if (!profile) return '';

  const firstName = profile.first_name?.trim() ?? '';
  const lastName = profile.last_name?.trim() ?? '';

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return firstName || lastName || profile.email || '';
}

/**
 * Get user's initials
 */
export function getUserInitials(profile: UserProfile | null): string {
  if (!profile) return '';

  const firstName = profile.first_name?.trim() ?? '';
  const lastName = profile.last_name?.trim() ?? '';

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }

  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }

  // Fallback to email
  if (profile.email) {
    return profile.email.substring(0, 2).toUpperCase();
  }

  return '';
}

/**
 * Format user role for display
 */
export function formatUserRole(role: UserRole): string {
  switch (role) {
    case 'owner':
      return 'Owner';
    case 'admin':
      return 'Administrator';
    case 'editor':
      return 'Editor';
    case 'viewer':
      return 'Viewer';
    case 'client':
      return 'Client';
    default:
      return role;
  }
}

/**
 * Get role hierarchy weight (higher number = more permissions)
 */
export function getRoleWeight(role: UserRole): number {
  switch (role) {
    case 'owner':
      return 5;
    case 'admin':
      return 4;
    case 'editor':
      return 3;
    case 'viewer':
      return 2;
    case 'client':
      return 1;
    default:
      return 0;
  }
}

/**
 * Check if role A has higher permissions than role B
 */
export function hasHigherRole(roleA: UserRole, roleB: UserRole): boolean {
  return getRoleWeight(roleA) > getRoleWeight(roleB);
}

/**
 * Check if user session is valid and not expired
 */
export function isValidSession(session: Session | null): boolean {
  if (!session) return false;

  const expiresAt = session.expires_at;
  if (!expiresAt) return false;

  // Check if session expires in the next 5 minutes
  const expiryTime = expiresAt * 1000; // Convert to milliseconds
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  return expiryTime > now + fiveMinutes;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null, session: Session | null): boolean {
  return !!(user && session && isValidSession(session));
}

/**
 * Get account ID from user profile or claims
 */
export function getAccountId(profile: UserProfile | null, claims?: { account_id?: string }): string | null {
  // Try profile first (most reliable)
  if (profile?.account) {
    return profile.account;
  }

  // Fallback to claims
  if (claims?.account_id) {
    return claims.account_id;
  }

  return null;
}

/**
 * Generate a secure redirect URL for post-authentication
 */
export function getRedirectUrl(
  baseUrl: string,
  path?: string,
  searchParams?: Record<string, string>,
): string {
  try {
    const url = new URL(path ?? '/', baseUrl);

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  } catch (error) {
    console.warn('[@novansa/auth] Invalid redirect URL:', error);
    return baseUrl;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
