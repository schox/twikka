// Context for the Lightbulb lookup table
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

export const LightbulbContext = React.createContext<LightbulbContextType | undefined>(undefined);
