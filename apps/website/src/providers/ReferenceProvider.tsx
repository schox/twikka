// ReferenceProvider for managing references and CRUD operations in RippleBase app
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ReferenceContext, Reference } from '../contexts/ReferenceContext';
import { useSelectedBrand } from './SelectedBrandProviderZustand';
import { supabase } from '@/lib/supabaseClient';

export function ReferenceProvider({ children }: { children: React.ReactNode }) {
  const { selectedBrand } = useSelectedBrand();
  const brandId = selectedBrand?.id;
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferences = useCallback(async () => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) {
      setReferences([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('reference')
      .select('*')
      .eq('brand', brandId)
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setReferences([]);
    } else {
      setReferences(data);
    }
    setLoading(false);
  }, [brandId]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const addReference = async (ref: Partial<Reference>) => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) {
      throw new Error('No brand selected');
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('reference').insert([{ ...ref, brand: brandId }]);
    if (error) {
      setError(error.message);
      setLoading(false);
      throw new Error(error.message);
    }
    await fetchReferences();
    setLoading(false);
  };

  const updateReference = async (id: number, ref: Partial<Reference>) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('reference').update(ref).eq('id', id);
    if (error) {
      setError(error.message);
      setLoading(false);
      throw new Error(error.message);
    }
    await fetchReferences();
    setLoading(false);
  };

  const deleteReference = async (id: number) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('reference').delete().eq('id', id);
    if (error) setError(error.message);
    await fetchReferences();
    setLoading(false);
  };

  const value = {
    references,
    loading,
    error,
    refresh: fetchReferences,
    addReference,
    updateReference,
    deleteReference,
  };

  return <ReferenceContext.Provider value={value}>{children}</ReferenceContext.Provider>;
}
