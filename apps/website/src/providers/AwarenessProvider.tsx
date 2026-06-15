'use client';
// Provider for the Awareness lookup table
import React, { useState, useEffect, useCallback } from 'react';
import { AwarenessContext, Awareness } from '../contexts/AwarenessContext';
import { supabase } from '@/lib/supabaseClient';

export const AwarenessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [awarenesses, setAwarenesses] = useState<Awareness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAwarenesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('awareness')
      .select('id, created_at, stage, description')
      .order('id');
    if (error !== null && typeof error.message === 'string' && error.message.length > 0) {
      setError(error.message);
      setAwarenesses([]);
    } else {
      setAwarenesses(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAwarenesses();
  }, [fetchAwarenesses]);

  return (
    <AwarenessContext.Provider value={{ awarenesses, loading, error, refresh: fetchAwarenesses }}>
      {children}
    </AwarenessContext.Provider>
  );
};
