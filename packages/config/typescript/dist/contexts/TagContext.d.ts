import React from 'react';
export type Tag = {
    id: number;
    created_at?: string;
    tag?: string;
    brand?: number;
};
export type TagContextType = {
    tags: Tag[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
};
export declare const TagContext: React.Context<TagContextType | undefined>;
//# sourceMappingURL=TagContext.d.ts.map