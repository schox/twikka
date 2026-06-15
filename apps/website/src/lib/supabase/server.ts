import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@novansa/database';
import { createServerClient as createSSRServerClient } from '@supabase/ssr';

/**
 * Create Supabase server client for Twikka website
 * Uses Twikka's own Supabase instance for blog content, forms, etc.
 */
export async function createServerClient(): Promise<SupabaseClient<Database>> {
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

  // Try request-scoped cookies first (API routes, server components)
  try {
    const cookieStore = await cookies();
    const client = createSSRServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // In server components, setting cookies may not be supported
          }
        },
      },
    });
    return client;
  } catch {
    // Fallback for SSG/build-time contexts where cookies() is unavailable
    const client = createSSRServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op in SSG context
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    return client;
  }
}
