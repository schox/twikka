import { describe, it, expect } from 'vitest';
import {
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
} from '../auth';
import type { UserProfile, Session, User } from '../../types';

// Test fixtures
const mockUserProfile: UserProfile = {
  id: 'user-1',
  auth_id: 'auth-1',
  email: 'john.doe@example.com',
  first_name: 'John',
  last_name: 'Doe',
  account: 'account-1',
  account_role: 'admin',
  app_admin: false,
  app_access: ['fall-admin', 'ripplebase'],
  created_at: '2024-01-01T00:00:00Z',
};

const mockSession: Session = {
  access_token: 'token',
  refresh_token: 'refresh',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  token_type: 'bearer',
  user: {} as User,
};

describe('Auth Utilities', () => {
  describe('hasPermissions', () => {
    it('should return false for null profile', () => {
      expect(hasPermissions(null, { roles: ['admin'] })).toBe(false);
    });

    it('should check roles correctly', () => {
      expect(hasPermissions(mockUserProfile, { roles: ['admin'] })).toBe(true);
      expect(hasPermissions(mockUserProfile, { roles: ['owner'] })).toBe(false);
    });

    it('should check app access correctly', () => {
      expect(hasPermissions(mockUserProfile, { apps: ['fall-admin'] })).toBe(true);
      expect(hasPermissions(mockUserProfile, { apps: ['fall-website'] })).toBe(false);
    });

    it('should handle requireAll flag', () => {
      expect(
        hasPermissions(mockUserProfile, {
          apps: ['fall-admin', 'ripplebase'],
          requireAll: true,
        }),
      ).toBe(true);

      expect(
        hasPermissions(mockUserProfile, {
          apps: ['fall-admin', 'fall-website'],
          requireAll: true,
        }),
      ).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return false for null profile', () => {
      expect(hasRole(null, 'admin')).toBe(false);
    });

    it('should check single role', () => {
      expect(hasRole(mockUserProfile, 'admin')).toBe(true);
      expect(hasRole(mockUserProfile, 'owner')).toBe(false);
    });

    it('should check multiple roles', () => {
      expect(hasRole(mockUserProfile, ['admin', 'owner'])).toBe(true);
      expect(hasRole(mockUserProfile, ['owner', 'editor'])).toBe(false);
    });
  });

  describe('hasAppAccess', () => {
    it('should return false for null profile', () => {
      expect(hasAppAccess(null, 'fall-admin')).toBe(false);
    });

    it('should check app access correctly', () => {
      expect(hasAppAccess(mockUserProfile, 'fall-admin')).toBe(true);
      expect(hasAppAccess(mockUserProfile, 'fall-website')).toBe(false);
    });
  });

  describe('role check functions', () => {
    it('should identify admin correctly', () => {
      expect(isAdmin(mockUserProfile)).toBe(true);

      const viewerProfile = { ...mockUserProfile, account_role: 'viewer' as const };
      expect(isAdmin(viewerProfile)).toBe(false);

      const appAdminProfile = {
        ...mockUserProfile,
        account_role: 'viewer' as const,
        app_admin: true,
      };
      expect(isAdmin(appAdminProfile)).toBe(true);
    });

    it('should identify owner correctly', () => {
      const ownerProfile = { ...mockUserProfile, account_role: 'owner' as const };
      expect(isOwner(ownerProfile)).toBe(true);
      expect(isOwner(mockUserProfile)).toBe(false);
    });

    it('should check edit permissions correctly', () => {
      expect(canEdit(mockUserProfile)).toBe(true);

      const viewerProfile = { ...mockUserProfile, account_role: 'viewer' as const };
      expect(canEdit(viewerProfile)).toBe(false);
    });

    it('should check view permissions correctly', () => {
      expect(canView(mockUserProfile)).toBe(true);

      const viewerProfile = { ...mockUserProfile, account_role: 'viewer' as const };
      expect(canView(viewerProfile)).toBe(true);
    });
  });

  describe('name utilities', () => {
    it('should get full name correctly', () => {
      expect(getFullName(mockUserProfile)).toBe('John Doe');

      const noLastName = { ...mockUserProfile, last_name: '' };
      expect(getFullName(noLastName)).toBe('John');

      const noNames = { ...mockUserProfile, first_name: '', last_name: '' };
      expect(getFullName(noNames)).toBe('john.doe@example.com');
    });

    it('should get initials correctly', () => {
      expect(getUserInitials(mockUserProfile)).toBe('JD');

      const noLastName = { ...mockUserProfile, last_name: '' };
      expect(getUserInitials(noLastName)).toBe('JO');

      const noNames = { ...mockUserProfile, first_name: '', last_name: '' };
      expect(getUserInitials(noNames)).toBe('JO');
    });
  });

  describe('role formatting and weights', () => {
    it('should format roles correctly', () => {
      expect(formatUserRole('owner')).toBe('Owner');
      expect(formatUserRole('admin')).toBe('Administrator');
      expect(formatUserRole('editor')).toBe('Editor');
      expect(formatUserRole('viewer')).toBe('Viewer');
    });

    it('should assign correct role weights', () => {
      expect(getRoleWeight('owner')).toBe(5);
      expect(getRoleWeight('admin')).toBe(4);
      expect(getRoleWeight('editor')).toBe(3);
      expect(getRoleWeight('viewer')).toBe(2);
    });

    it('should compare roles correctly', () => {
      expect(hasHigherRole('owner', 'admin')).toBe(true);
      expect(hasHigherRole('admin', 'owner')).toBe(false);
      expect(hasHigherRole('editor', 'viewer')).toBe(true);
    });
  });

  describe('session validation', () => {
    it('should validate sessions correctly', () => {
      expect(isValidSession(mockSession)).toBe(true);
      expect(isValidSession(null)).toBe(false);

      const expiredSession = {
        ...mockSession,
        expires_at: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };
      expect(isValidSession(expiredSession)).toBe(false);
    });

    it('should check authentication correctly', () => {
      const mockUser = { id: 'user-1' } as User;

      expect(isAuthenticated(mockUser, mockSession)).toBe(true);
      expect(isAuthenticated(null, mockSession)).toBe(false);
      expect(isAuthenticated(mockUser, null)).toBe(false);
    });
  });

  describe('utility functions', () => {
    it('should get account ID correctly', () => {
      expect(getAccountId(mockUserProfile)).toBe('account-1');
      expect(getAccountId(null, { account_id: 'claims-account' })).toBe('claims-account');
      expect(getAccountId(null)).toBe(null);
    });

    it('should generate redirect URLs correctly', () => {
      const baseUrl = 'https://example.com';

      expect(getRedirectUrl(baseUrl)).toBe('https://example.com/');
      expect(getRedirectUrl(baseUrl, '/dashboard')).toBe('https://example.com/dashboard');
      expect(getRedirectUrl(baseUrl, '/search', { q: 'test' })).toBe(
        'https://example.com/search?q=test',
      );
    });

    it('should validate emails correctly', () => {
      expect(isValidEmail('john@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should validate passwords correctly', () => {
      const validPassword = 'ValidPass123!';
      const result = validatePassword(validPassword);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const weakPassword = 'weak';
      const weakResult = validatePassword(weakPassword);
      expect(weakResult.isValid).toBe(false);
      expect(weakResult.errors.length).toBeGreaterThan(0);
    });
  });
});
