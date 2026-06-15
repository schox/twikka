// This module should only be imported in client components.
import { createClient } from '@/lib/supabase/client';
export const supabase = createClient();
