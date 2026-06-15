import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database, AuthConfig, SupabaseInstance, SupabaseConfig } from './types';
import { SUPABASE_ENV_VARS, getInstanceDisplayName } from './types';

interface CookieStore {
  getAll(): Array<{ name: string; value: string }>;
  set(name: string, value: string, options?: Record<string, unknown>): void;
}

/**
 * Get environment variables for a specific Supabase instance.
 */
function getInstanceEnvVars(instance: SupabaseInstance = 'novansa'): {
  url: string | undefined;
  publishableKey: string | undefined;
  secretKey: string | undefined;
} {
  const envVars = SUPABASE_ENV_VARS[instance];

  return {
    url: process.env[envVars.url] ?? process.env[envVars.urlServer],
    publishableKey: process.env[envVars.publishableKey] ?? process.env[envVars.publishableKeyServer],
    secretKey: process.env[envVars.secretKey],
  };
}

/**
 * Create a Supabase client for server environments (SSR/API routes).
 * Server-only version without 'use client' directive.
 *
 * @param cookieStore - Cookie store for session management
 * @param config - Configuration options including which Supabase instance to use
 * @returns Supabase server client
 */
export function createServerClientWithCookies(cookieStore: CookieStore, config?: Partial<AuthConfig>) {
  const instance = config?.instance ?? 'novansa';
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);

  const supabaseUrl = config?.url ?? envVars.url;
  const publishableKey = config?.publishableKey ?? envVars.publishableKey;

  if (!supabaseUrl) {
    throw new Error(
      `${instanceName} Supabase URL is required. ` +
      `Set ${SUPABASE_ENV_VARS[instance].url} or ${SUPABASE_ENV_VARS[instance].urlServer} environment variable.`
    );
  }

  if (!publishableKey) {
    throw new Error(
      `${instanceName} Supabase publishable key is required. ` +
      `Set ${SUPABASE_ENV_VARS[instance].publishableKey} or ${SUPABASE_ENV_VARS[instance].publishableKeyServer} environment variable.`
    );
  }

  return createServerClient<Database>(supabaseUrl, publishableKey, {
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
 */
export function createAdminClient(config?: Partial<SupabaseConfig>) {
  const instance = config?.instance ?? 'novansa';
  const envVars = getInstanceEnvVars(instance);
  const instanceName = getInstanceDisplayName(instance);

  const url = config?.url ?? envVars.url;
  if (!url) {
    throw new Error(
      `${instanceName} Supabase URL is required for admin client. ` +
      `Set ${SUPABASE_ENV_VARS[instance].url} environment variable.`
    );
  }

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

// Middleware exports for server-side use (without 'use client' directive)
export {
  createAuthMiddleware,
  createAdminAuthMiddleware,
  createWebsiteAuthMiddleware,
  standardMiddlewareMatcher,
} from './middleware';

export type { AuthMiddlewareConfig } from './middleware';
