import type { User, Session, AuthError } from '@supabase/supabase-js';

// ============================================================================
// OTP / Passwordless Auth Types
// ============================================================================

/** OTP delivery channel */
export type OtpChannel = 'email' | 'sms';

/** OTP verification type */
export type OtpVerificationType =
  | 'login' // Login OTP
  | 'verify_email' // Verify current email
  | 'verify_phone' // Verify current phone
  | 'verify_pending_email' // Verify pending email change
  | 'verify_pending_phone'; // Verify pending phone change

/** Request to send an OTP */
export interface OtpRequest {
  identifier: string; // email or phone number
  channel: OtpChannel;
  appId?: string; // For app-specific gating (internal apps)
}

/** Request to verify an OTP */
export interface OtpVerifyRequest {
  identifier: string;
  token: string;
  type: OtpVerificationType;
}

/** Result of OTP request */
export interface OtpRequestResult {
  success: boolean;
  message: string;
  error?: string;
}

/** Result of OTP verification */
export interface OtpVerifyResult {
  success: boolean;
  session?: Session;
  error?: string;
}

/** Verification state for a single contact */
export interface ContactVerificationState {
  value: string | null;
  verified: boolean;
  pending: string | null;
  pendingVerified: boolean;
}

/** Combined verification state for UI */
export interface VerificationState {
  email: ContactVerificationState;
  phone: ContactVerificationState;
  isFullyVerified: boolean; // email_verified && phone_verified
}

/** App-specific auth configuration */
export interface AppAuthConfig {
  appId: string;
  appType: 'internal' | 'saas';
  requireDualVerification: boolean;
  allowPublicSignup: boolean;
}

// ============================================================================
// Database Types
// ============================================================================

// Define simplified database types to avoid build issues with complex generated types
export interface Database {
  public: {
    Tables: {
      user_profile: {
        Row: {
          // Core fields
          id: string;  // UUID7 (was bigint, migrated to UUID)
          auth_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
          updated_at: string | null;
          // Account & role
          account: string | null;
          account_role: 'owner' | 'admin' | 'editor' | 'viewer' | 'client';
          app_access: string[];
          app_admin: boolean;
          // Status
          active: boolean;
          suspended: boolean; // Deprecated, use 'active' instead
          // Phone & verification (new fields for passwordless auth)
          phone: string | null;
          email_verified: boolean;
          phone_verified: boolean;
          email_pending: string | null;
          phone_pending: string | null;
          email_pending_verified: boolean;
          phone_pending_verified: boolean;
          preferred_otp_channel: OtpChannel;
          // Brand selection (for multi-brand users)
          selected_brand: number | null;
        };
      };
    };
    Enums: {
      user_role: 'owner' | 'admin' | 'editor' | 'viewer' | 'client';
      subscription_type: 'trial' | 'basic' | 'pro' | 'enterprise';
      otp_channel: 'email' | 'sms';
      account_type: 'internal' | 'customer';
      subscription_status: 'internal' | 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled' | 'expired';
      billing_mode: 'internal' | 'stripe' | 'lifetime';
    };
  };
}

export type DatabaseUser = Database['public']['Tables']['user_profile']['Row'];
export type UserRole = Database['public']['Enums']['user_role'];

// App names for access control
export type AppName = 'fall-admin' | 'fall-website' | 'ripplebase' | 'couple-tools-admin' | 'couple-tools-website' | 'twikka-website';

// JWT Claims structure
export interface JWTClaims {
  // Custom claims from our JWT hook
  account_id?: string;
  app_admin?: boolean;
  app_access?: string[];
  account_role?: string;
  // Standard Supabase claims
  role?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  email?: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  [key: string]: string | number | boolean | string[] | null | undefined;
}

// Enhanced user profile with account and brand data
export interface UserProfile extends DatabaseUser {
  account_name?: string;
  account_id?: string;
  subscription_type?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  brands?: Array<{
    id: number;
    name: string;
    account: string;
  }>;
  // Computed verification state (convenience for UI)
  verificationState?: VerificationState;
}

// Auth state
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  claims: JWTClaims | null;
  loading: boolean;
  error: AuthError | Error | null;
}

// Auth actions
export interface AuthActions {
  // ============================================================================
  // OTP / Passwordless Methods (Primary)
  // ============================================================================

  /**
   * Request an OTP to be sent to the user's email or phone.
   * For internal apps, this goes through a server-side API route.
   * For SaaS apps, this can call Supabase directly.
   */
  requestOtp: (request: OtpRequest) => Promise<OtpRequestResult>;

  /**
   * Verify an OTP and establish a session.
   */
  verifyOtp: (request: OtpVerifyRequest) => Promise<OtpVerifyResult>;

  /**
   * Convenience wrapper for email OTP login.
   */
  signInWithOtp: (email: string, options?: { channel?: OtpChannel }) => Promise<OtpRequestResult>;

  /**
   * Sign out the current user.
   */
  signOut: () => Promise<void>;

  /**
   * Refresh the current session.
   */
  refreshSession: () => Promise<void>;

  /**
   * Clear any auth errors.
   */
  clearError: () => void;

}

// Combined auth context type
export interface AuthContextType extends AuthState, AuthActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- SupabaseClient generic typing requires flexibility
  supabase: any; // SupabaseClient instance for data operations
}

// User context type (separated for performance)
export interface UserContextType {
  profile: UserProfile | null;
  brands: Array<{ id: number; name: string; account: string }> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasAppAccess: (app: AppName) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isOwner: boolean;
  canEdit: boolean;
  canView: boolean;

  // Verification state and methods (passwordless auth)
  verificationState: VerificationState | null;
  isFullyVerified: boolean;

  /**
   * Update the pending email for verification.
   * The new email won't become active until verified.
   */
  updatePendingEmail: (email: string) => Promise<void>;

  /**
   * Update the pending phone for verification.
   * The new phone won't become active until verified.
   */
  updatePendingPhone: (phone: string) => Promise<void>;

  /**
   * Cancel a pending email or phone change.
   */
  cancelPendingChange: (type: 'email' | 'phone') => Promise<void>;

  /**
   * Mark a contact as verified after OTP verification.
   * Called by the verification hook after successful OTP.
   */
  markContactVerified: (type: 'email' | 'phone' | 'pending_email' | 'pending_phone') => Promise<void>;

  /**
   * Update the user's selected brand.
   * Persists to database for cross-session persistence.
   */
  updateSelectedBrand: (brandId: number | null) => Promise<void>;
}

// Permission check types
export interface PermissionConfig {
  roles?: UserRole[];
  apps?: AppName[];
  requireAll?: boolean; // If true, user must have ALL specified roles/apps
}

// Auth guard props
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  permissions?: PermissionConfig;
  loading?: React.ReactNode;
}

// Provider props
export interface AuthProviderProps {
  children: React.ReactNode;
  /** The Supabase instance to connect to. Defaults to 'novansa'. */
  instance?: SupabaseInstance;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  onAuthStateChange?: (state: AuthState) => void;
}

export interface UserProviderProps {
  children: React.ReactNode;
  enableCaching?: boolean;
  cacheTimeout?: number;
  onUserProfileChange?: (profile: UserProfile | null) => void;
}

// Error types
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends Error {
  constructor(
    message: string,
    public requiredPermissions?: PermissionConfig,
  ) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class UserProfileError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = 'UserProfileError';
  }
}

// Utility types
export type AuthEventType =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'USER_DELETED';

export interface AuthEvent {
  type: AuthEventType;
  session: Session | null;
  user: User | null;
  error?: AuthError;
}

// ============================================================================
// Supabase Instance Configuration
// ============================================================================

/**
 * Available Supabase instances in the monorepo.
 * Each instance has its own set of environment variables.
 *
 * - 'novansa', 'couple-tools', 'twikka' — Supabase Cloud projects (publishable key)
 * - 'self-hosted' — Hetzner self-hosted Supabase (anon JWT)
 */
export type SupabaseInstance =
  | 'novansa'
  | 'couple-tools'
  | 'twikka'
  | 'self-hosted';

/**
 * Environment variable names for each Supabase instance.
 * Follows the pattern: {INSTANCE}_SUPABASE_{URL|PUBLISHABLE_KEY|SECRET_KEY}
 * With NEXT_PUBLIC_ prefix for client-exposed variables.
 *
 * For 'self-hosted', uses the generic NEXT_PUBLIC_SUPABASE_URL /
 * NEXT_PUBLIC_SUPABASE_ANON_KEY pair — same convention novansa-admin uses
 * and what self-hosted Supabase emits by default. The "publishableKey"
 * field name is retained for type compatibility but holds the anon JWT.
 */
export const SUPABASE_ENV_VARS = {
  novansa: {
    url: 'NEXT_PUBLIC_NOVANSA_SUPABASE_URL',
    urlServer: 'NOVANSA_SUPABASE_URL',
    publishableKey: 'NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY',
    publishableKeyServer: 'NOVANSA_SUPABASE_PUBLISHABLE_KEY',
    secretKey: 'NOVANSA_SUPABASE_SECRET_KEY',
  },
  'couple-tools': {
    url: 'NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_URL',
    urlServer: 'COUPLE_TOOLS_SUPABASE_URL',
    publishableKey: 'NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY',
    publishableKeyServer: 'COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY',
    secretKey: 'COUPLE_TOOLS_SUPABASE_SECRET_KEY',
  },
  twikka: {
    url: 'NEXT_PUBLIC_TWIKKA_SUPABASE_URL',
    urlServer: 'TWIKKA_SUPABASE_URL',
    publishableKey: 'NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY',
    publishableKeyServer: 'TWIKKA_SUPABASE_PUBLISHABLE_KEY',
    secretKey: 'TWIKKA_SUPABASE_SECRET_KEY',
  },
  'self-hosted': {
    url: 'NEXT_PUBLIC_SUPABASE_URL',
    urlServer: 'SUPABASE_URL',
    publishableKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    publishableKeyServer: 'SUPABASE_ANON_KEY',
    secretKey: 'SUPABASE_SERVICE_ROLE_KEY',
  },
} as const;

/**
 * Get the display name for a Supabase instance (for error messages).
 */
export function getInstanceDisplayName(instance: SupabaseInstance): string {
  switch (instance) {
    case 'novansa':
      return 'Novansa';
    case 'couple-tools':
      return 'Couple Tools';
    case 'twikka':
      return 'Twikka';
    case 'self-hosted':
      return 'Self-hosted Supabase';
  }
}

// Configuration types
export interface SupabaseConfig {
  /** The Supabase instance to connect to. Defaults to 'novansa'. */
  instance?: SupabaseInstance;
  /** Direct URL override (takes precedence over instance env vars) */
  url?: string;
  /** Direct publishable key override (takes precedence over instance env vars) */
  publishableKey?: string;
  /** Direct secret key override for server-side operations */
  secretKey?: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
  };
}

export interface AuthConfig extends SupabaseConfig {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  enableDevMode?: boolean;
}
