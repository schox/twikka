// ContentProvider for managing content records and CRUD operations in RippleBase app
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ContentContext, Content } from '../contexts/ContentContext';
import { useSelectedBrand } from './SelectedBrandProviderZustand';
import { supabase } from '@/lib/supabaseClient';

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { selectedBrand } = useSelectedBrand();
  const brandId = selectedBrand?.id;
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = useCallback(async () => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) {
      setContents([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('brand', brandId)
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setContents([]);
    } else {
      setContents(data as Content[]);
    }
    setLoading(false);
  }, [brandId]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const addContent = async (content: Partial<Content>) => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('content').insert([{ ...content, brand: brandId }]);
    if (error) setError(error.message);
    await fetchContents();
    setLoading(false);
  };

  const updateContent = async (id: number, content: Partial<Content>) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('content').update(content).eq('id', id);
    if (error) setError(error.message);
    await fetchContents();
    setLoading(false);
  };

  const deleteContent = async (id: number) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('content').delete().eq('id', id);
    if (error) setError(error.message);
    await fetchContents();
    setLoading(false);
  };

  const value = {
    contents,
    loading,
    error,
    refresh: fetchContents,
    addContent,
    updateContent,
    deleteContent,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
