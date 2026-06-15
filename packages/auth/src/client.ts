import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, AuthConfig, SupabaseInstance, SupabaseConfig } from './types';
import { SUPABASE_ENV_VARS, getInstanceDisplayName } from './types';

// Singleton instances for browser environments (one per Supabase instance)
const browserClientInstances: Map<SupabaseInstance, SupabaseClient<Database>> = new Map();

/**
 * Get environment variables for a specific Supabase instance.
 * Uses literal string access for Next.js env var inlining to work on client side.
 * NEXT_PUBLIC_ prefixed vars are checked first (for browser), then server-only vars.
 */
function getInstanceEnvVars(instance: SupabaseInstance = 'novansa'): {
  url: string | undefined;
  publishableKey: string | undefined;
  secretKey: string | undefined;
} {
  // Must use literal strings for Next.js to inline NEXT_PUBLIC_ vars on client
  switch (instance) {
    case 'novansa':
      return {
        url: process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ?? process.env.NOVANSA_SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY ?? process.env.NOVANSA_SUPABASE_PUBLISHABLE_KEY,
        secretKey: process.env.NOVANSA_SUPABASE_SECRET_KEY,
      };
    case 'couple-tools':
      return {
        url: process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_URL ?? process.env.COUPLE_TOOLS_SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY ?? process.env.COUPLE_TOOLS_SUPABASE_PUBLISHABLE_KEY,
        secretKey: process.env.COUPLE_TOOLS_SUPABASE_SECRET_KEY,
      };
    case 'twikka':
      return {
        url: process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL ?? process.env.TWIKKA_SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY ?? process.env.TWIKKA_SUPABASE_PUBLISHABLE_KEY,
        secretKey: process.env.TWIKKA_SUPABASE_SECRET_KEY,
      };
    case 'self-hosted':
      return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
        publishableKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY,
        secretKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      };
  }
}

/**
 * Resolve URL and key from config, falling back to environment variables.
 */
function resolveCredentials(config?: Partial<AuthConfig>): {
  url: string;
  key: string;
  instance: SupabaseInstance;
} {
  const instance = config?.instance ?? 'novansa';
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);

  // URL: config override > env vars
  const url = config?.url ?? envVars.url;
  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error(
      `${instanceName} Supabase URL is required. ` +
      `Set ${SUPABASE_ENV_VARS[instance].url} or ${SUPABASE_ENV_VARS[instance].urlServer} environment variable.`
    );
  }

  // Key: config override > env vars
  const key = config?.publishableKey ?? envVars.publishableKey;
  if (!key || typeof key !== 'string' || key.trim() === '') {
    throw new Error(
      `${instanceName} Supabase publishable key is required. ` +
      `Set ${SUPABASE_ENV_VARS[instance].publishableKey} or ${SUPABASE_ENV_VARS[instance].publishableKeyServer} environment variable.`
    );
  }

  return { url, key, instance };
}

/**
 * Create a Supabase client for browser environments.
 * Uses singleton pattern to prevent multiple GoTrueClient instances per instance.
 *
 * @param config - Configuration options including which Supabase instance to use
 * @returns Supabase browser client
 *
 * @example
 * // Default (Novansa instance)
 * const supabase = createClient();
 *
 * @example
 * // Couple Tools instance
 * const supabase = createClient({ instance: 'couple-tools' });
 *
 * @example
 * // Twikka instance
 * const supabase = createClient({ instance: 'twikka' });
 */
export function createClient(config?: Partial<AuthConfig>) {
  const { url, key, instance } = resolveCredentials(config);

  // Return existing singleton instance if in browser
  if (typeof window !== 'undefined' && browserClientInstances.has(instance)) {
    return browserClientInstances.get(instance)!;
  }

  // Client options with defaults optimized for auth
  const options = {
    auth: {
      autoRefreshToken: config?.enableAutoRefresh ?? true,
      persistSession: true,
      detectSessionInUrl: true,
      ...config?.options?.auth,
    },
    ...config?.options,
  };

  const client = createBrowserClient<Database>(url, key, options);

  // Store singleton instance for browser environments
  if (typeof window !== 'undefined') {
    browserClientInstances.set(instance, client as unknown as SupabaseClient<Database>);
  }

  // Add metadata about instance for debugging
  if (config?.enableDevMode && typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__supabase_instance = instance;
    // eslint-disable-next-line no-console
    console.info(`[@novansa/auth] Initialized ${getInstanceDisplayName(instance)} client`);
  }

  return client;
}

interface CookieStore {
  getAll(): Array<{ name: string; value: string }>;
  set(name: string, value: string, options?: Record<string, unknown>): void;
}

/**
 * Create a Supabase client for server environments (SSR/API routes).
 * Uses publishable key for authenticated user requests.
 *
 * @param cookieStore - Cookie store for session management
 * @param config - Configuration options including which Supabase instance to use
 * @returns Supabase server client
 *
 * @example
 * // In a Next.js Server Component
 * const cookieStore = await cookies();
 * const supabase = createServerClientWithCookies(cookieStore, { instance: 'couple-tools' });
 */
export function createServerClientWithCookies(cookieStore: CookieStore, config?: Partial<AuthConfig>) {
  const { url, key } = resolveCredentials(config);

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (_error) {
          // Handle cases where cookies can't be set (e.g., server components)
        }
      },
    },
    auth: {
      autoRefreshToken: false, // Server-side doesn't need auto-refresh
      persistSession: false,
      ...config?.options?.auth,
    },
    ...config?.options,
  });
}

/**
 * Create a Supabase admin client for server-side operations that bypass RLS.
 * Uses the secret key instead of publishable key.
 *
 * WARNING: Only use this for server-side operations (API routes, server actions).
 * Never expose the secret key to the browser.
 *
 * @param config - Configuration options including which Supabase instance to use
 * @returns Supabase admin client with service role access
 *
 * @example
 * // In an API route
 * const supabaseAdmin = createAdminClient({ instance: 'couple-tools' });
 * const { data } = await supabaseAdmin.from('admin.admin_user').select('*');
 */
export function createAdminClient(config?: Partial<SupabaseConfig>) {
  const instance = config?.instance ?? 'novansa';
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);

  // URL: config override > env vars
  const url = config?.url ?? envVars.url;
  if (!url) {
    throw new Error(
      `${instanceName} Supabase URL is required for admin client. ` +
      `Set ${SUPABASE_ENV_VARS[instance].url} environment variable.`
    );
  }

  // Secret key: config override > env vars
  const secretKey = config?.secretKey ?? envVars.secretKey;
  if (!secretKey) {
    throw new Error(
      `${instanceName} Supabase secret key is required for admin client. ` +
      `Set ${SUPABASE_ENV_VARS[instance].secretKey} environment variable.`
    );
  }

  return createSupabaseClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Lightweight client factory for different environments.
 */
export const supabaseClientFactory = {
  /**
   * Browser client with singleton pattern
   */
  browser: (config?: Partial<AuthConfig>) => createClient(config),

  /**
   * Server client with cookie management
   */
  server: (cookieStore: CookieStore, config?: Partial<AuthConfig>) =>
    createServerClientWithCookies(cookieStore, config),

  /**
   * Admin client with secret key (bypasses RLS)
   */
  admin: (config?: Partial<SupabaseConfig>) => createAdminClient(config),

  /**
   * Get default configuration based on environment
   */
  getDefaultConfig: (): Partial<AuthConfig> => ({
    instance: 'novansa',
    enableAutoRefresh: true,
    refreshInterval: 60000, // 1 minute
    enableDevMode: process.env.NODE_ENV === 'development',
  }),
};

/**
 * Validate Supabase configuration for an instance.
 */
export function validateSupabaseConfig(config?: Partial<AuthConfig>): {
  isValid: boolean;
  errors: string[];
  instance: SupabaseInstance;
} {
  const errors: string[] = [];
  const instance = config?.instance ?? 'novansa';
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);

  const url = config?.url ?? envVars.url;
  const publishableKey = config?.publishableKey ?? envVars.publishableKey;

  if (!url) {
    errors.push(`${instanceName} Supabase URL is missing`);
  } else if (!url.startsWith('https://')) {
    errors.push(`${instanceName} Supabase URL must be a valid HTTPS URL`);
  }

  if (!publishableKey) {
    errors.push(`${instanceName} Supabase publishable key is missing`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    instance,
  };
}

/**
 * Clear browser client singleton (useful for testing or switching instances).
 */
export function clearBrowserClientInstance(instance?: SupabaseInstance) {
  if (instance) {
    browserClientInstances.delete(instance);
  } else {
    browserClientInstances.clear();
  }
}
