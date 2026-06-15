import { createClient } from '@novansa/auth';

/**
 * Supabase client for Twikka Admin
 * Uses the Twikka Supabase instance
 */
export const supabase = createClient({ instance: 'twikka' });
