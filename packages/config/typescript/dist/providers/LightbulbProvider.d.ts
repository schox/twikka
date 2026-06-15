import React from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
type AnySupabaseClient = SupabaseClient<any, any, any>;
interface LightbulbProviderProps {
    children: React.ReactNode;
    supabaseClient: AnySupabaseClient;
}
export declare const LightbulbProvider: React.FC<LightbulbProviderProps>;
export {};
//# sourceMappingURL=LightbulbProvider.d.ts.map