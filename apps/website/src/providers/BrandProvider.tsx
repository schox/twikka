'use client';
// Provider for the Brand lookup table
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { BrandContext, Brand } from '../contexts/BrandContext';
import { useUser } from '@novansa/auth';
import { createClient } from '@/lib/supabase/client';

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { profile: user } = useUser();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // user and user.account are always present when user exists
  const accountId = user?.account?.id;

  const fetchBrands = useCallback(async () => {
    if (typeof accountId !== 'string' || accountId.trim() === '') {
      setBrands([]);
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from('brand')
      .select('*')
      .eq('account', accountId);
    if (fetchError) {
      setError(fetchError.message);
      setBrands([]);
    } else {
      setBrands(data as Brand[]);
    }
    setLoading(false);
  }, [accountId]);

  useEffect(() => {
    if (typeof accountId === 'string' && accountId.trim() !== '') {
      fetchBrands();
    } else {
      setBrands([]);
    }
  }, [fetchBrands, accountId]);

  // If no user, just render children without brand context data
  if (!user) {
    return <>{children}</>;
  }

  const contextValue = { brands, loading, error, refresh: fetchBrands };

  return <BrandContext.Provider value={contextValue}>{children}</BrandContext.Provider>;
}

export function useBrands() {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrands must be used within a BrandProvider');
  return context;
}
