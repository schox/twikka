// MessageProvider for managing message records and CRUD operations in RippleBase app
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { MessageContext, Message } from '../contexts/MessageContext';
import { useSelectedBrand } from './SelectedBrandProviderZustand';
import { supabase } from '@/lib/supabaseClient';

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { selectedBrand } = useSelectedBrand();
  const brandId = selectedBrand?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .eq('brand', brandId)
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setMessages([]);
    } else {
      setMessages(data as Message[]);
    }
    setLoading(false);
  }, [brandId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const addMessage = async (msg: Partial<Message>) => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('message').insert([{ ...msg, brand: brandId }]);
    if (error) setError(error.message);
    await fetchMessages();
    setLoading(false);
  };

  const updateMessage = async (id: number, msg: Partial<Message>) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('message').update(msg).eq('id', id);
    if (error) setError(error.message);
    await fetchMessages();
    setLoading(false);
  };

  const deleteMessage = async (id: number) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('message').delete().eq('id', id);
    if (error) setError(error.message);
    await fetchMessages();
    setLoading(false);
  };

  const value = {
    messages,
    loading,
    error,
    refresh: fetchMessages,
    addMessage,
    updateMessage,
    deleteMessage,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}
