// Context for the Tag lookup table
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

export const TagContext = React.createContext<TagContextType | undefined>(undefined);
