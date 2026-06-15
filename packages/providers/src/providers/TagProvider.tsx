'use client';
// Provider for the Tag lookup table
import React, { useState, useEffect, useCallback } from 'react';
import { TagContext, type Tag } from '../contexts/TagContext';
import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic SupabaseClient requires flexible typing
type AnySupabaseClient = SupabaseClient<any, any, any>;

interface TagProviderProps {
  children: React.ReactNode;
  supabaseClient: AnySupabaseClient;
}

export const TagProvider: React.FC<TagProviderProps> = ({ children, supabaseClient }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('tag')
      .select('id, created_at, tag, brand')
      .order('id');
    if (error !== null && typeof error.message === 'string' && error.message.length > 0) {
      setError(error.message);
      setTags([]);
    } else {
      setTags(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [supabaseClient]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return (
    <TagContext.Provider value={{ tags, loading, error, refresh: fetchTags }}>
      {children}
    </TagContext.Provider>
  );
};
