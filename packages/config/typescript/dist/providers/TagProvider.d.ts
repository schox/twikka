import React from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
type AnySupabaseClient = SupabaseClient<any, any, any>;
interface TagProviderProps {
    children: React.ReactNode;
    supabaseClient: AnySupabaseClient;
}
export declare const TagProvider: React.FC<TagProviderProps>;
export {};
//# sourceMappingURL=TagProvider.d.ts.map