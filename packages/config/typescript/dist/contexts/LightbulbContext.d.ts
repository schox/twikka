import React from 'react';
export type Lightbulb = {
    id: number;
    name: string | null;
    description?: string | null;
    created_at?: string;
    business_perspective?: string | null;
    customer_belief?: string | null;
};
export type LightbulbContextType = {
    lightbulbs: Lightbulb[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
};
export declare const LightbulbContext: React.Context<LightbulbContextType | undefined>;
//# sourceMappingURL=LightbulbContext.d.ts.map