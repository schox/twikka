'use client';
// Provider for the Lightbulb lookup table
import React, { useState, useEffect, useCallback } from 'react';
import { LightbulbContext, type Lightbulb } from '../contexts/LightbulbContext';
import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic SupabaseClient requires flexible typing
type AnySupabaseClient = SupabaseClient<any, any, any>;

interface LightbulbProviderProps {
  children: React.ReactNode;
  supabaseClient: AnySupabaseClient;
}

export const LightbulbProvider: React.FC<LightbulbProviderProps> = ({
  children,
  supabaseClient,
}) => {
  const [lightbulbs, setLightbulbs] = useState<Lightbulb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLightbulbs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('lightbulb')
      .select('*')
      .order('id', { ascending: true });
    if (error !== null && typeof error.message === 'string' && error.message.length > 0) {
      setError(error.message);
      setLightbulbs([]);
    } else {
      setLightbulbs(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [supabaseClient]);

  useEffect(() => {
    fetchLightbulbs();
  }, [fetchLightbulbs]);

  return (
    <LightbulbContext.Provider value={{ lightbulbs, loading, error, refresh: fetchLightbulbs }}>
      {children}
    </LightbulbContext.Provider>
  );
};
