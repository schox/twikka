import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  ContentClientConfig,
  getNovansaSupabaseUrl,
  getNovansaSupabasePublishableKey,
} from "./types";

// Singleton client instance
let contentClient: SupabaseClient | null = null;

/**
 * Get or create a Supabase client for the Novansa content database.
 * Uses singleton pattern to avoid creating multiple clients.
 *
 * The client reads from environment variables:
 * - NEXT_PUBLIC_NOVANSA_SUPABASE_URL or NOVANSA_SUPABASE_URL
 * - NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY or NOVANSA_SUPABASE_PUBLISHABLE_KEY
 *
 * @param config - Optional configuration to override defaults
 * @returns Supabase client configured for Novansa content database
 */
export function getContentClient(config?: ContentClientConfig): SupabaseClient {
  if (contentClient) {
    return contentClient;
  }

  const supabaseUrl = config?.supabaseUrl ?? getNovansaSupabaseUrl();
  const supabaseKey =
    config?.supabasePublishableKey ??
    config?.supabaseAnonKey ?? // deprecated fallback
    getNovansaSupabasePublishableKey();

  contentClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return contentClient;
}

/**
 * Create a new Supabase client for the Novansa content database.
 * Use this when you need a fresh client instance (e.g., for server-side rendering).
 *
 * The client reads from environment variables:
 * - NEXT_PUBLIC_NOVANSA_SUPABASE_URL or NOVANSA_SUPABASE_URL
 * - NEXT_PUBLIC_NOVANSA_SUPABASE_PUBLISHABLE_KEY or NOVANSA_SUPABASE_PUBLISHABLE_KEY
 *
 * @param config - Optional configuration to override defaults
 * @returns New Supabase client configured for Novansa content database
 */
export function createContentClient(
  config?: ContentClientConfig
): SupabaseClient {
  const supabaseUrl = config?.supabaseUrl ?? getNovansaSupabaseUrl();
  const supabaseKey =
    config?.supabasePublishableKey ??
    config?.supabaseAnonKey ?? // deprecated fallback
    getNovansaSupabasePublishableKey();

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Reset the singleton client (useful for testing)
 */
export function resetContentClient(): void {
  contentClient = null;
}
