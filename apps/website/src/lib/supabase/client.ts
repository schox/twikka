import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@novansa/database';

let client: SupabaseClient<Database> | null = null;

/**
 * Create browser client for Twikka website
 * Uses Twikka's own Supabase instance for blog content and forms
 */
export function createClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Twikka Supabase environment variables (NEXT_PUBLIC_TWIKKA_SUPABASE_URL, NEXT_PUBLIC_TWIKKA_SUPABASE_PUBLISHABLE_KEY)',
    );
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  return client;
}
