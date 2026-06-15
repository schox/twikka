import { createClient } from '@supabase/supabase-js';
import { Database } from '@novansa/database';

/**
 * Service role client for admin operations that bypass RLS
 * Only use this for trusted operations like migrations
 */
export function createServiceClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_TWIKKA_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.TWIKKA_SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase service role credentials. Please add NEXT_PUBLIC_SUPABASE_SERVICE_KEY to your environment variables.',
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
