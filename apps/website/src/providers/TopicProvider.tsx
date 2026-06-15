'use client';
import React, { useState, useEffect } from 'react';
import { TopicContext, Topic, TopicCategory, TopicContextType } from '../contexts/TopicContext';
import { useSelectedBrand } from './SelectedBrandProviderZustand';
import { supabase } from '@/lib/supabaseClient';
import log from 'loglevel';

const logger = log;
logger.setLevel('debug');

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const { selectedBrand } = useSelectedBrand();
  const brandId = selectedBrand ? selectedBrand.id : undefined;
  const [topCategories, setTopCategories] = useState<TopicCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TopicCategory[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch top-level categories
  useEffect(() => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId)) return;
    setLoading(true);
    supabase
      .from('topic_category')
      .select('id, name, parent_category, brand, relevant, focus, description')
      .is('parent_category', null)
      .eq('brand', brandId)
      .then(({ data, error }) => {
        logger.debug('Top categories:', { data, error });
        if (
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string' &&
          error.message !== ''
        )
          setError(error.message);
        else if (typeof error === 'string' && error !== '') setError(error);
        else setTopCategories(data ?? []);
        setLoading(false);
      });
  }, [brandId]);

  // Fetch subcategories when a top-level category is selected
  useEffect(() => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId) || !selectedCategory) {
      setSubcategories([]);
      return;
    }
    setLoading(true);
    supabase
      .from('topic_category')
      .select('id, name, parent_category, brand, relevant, focus, description')
      .eq('parent_category', selectedCategory.id)
      .eq('brand', brandId)
      .then(({ data, error }) => {
        logger.debug('Subcategories:', { data, error });
        if (
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string' &&
          error.message !== ''
        )
          setError(error.message);
        else if (typeof error === 'string' && error !== '') setError(error);
        else setSubcategories(data ?? []);
        setLoading(false);
      });
  }, [brandId, selectedCategory]);

  // Fetch topics for all subcategories
  useEffect(() => {
    if (typeof brandId !== 'number' || !Number.isFinite(brandId) || subcategories.length === 0) {
      setTopics([]);
      return;
    }
    setLoading(true);
    const subcatIds = subcategories.map(sc => sc.id);
    supabase
      .from('topic')
      .select(
        'id, created_at, name, category, brand, relevant, focus, description, updated_at, synonyms',
      )
      .in('category', subcatIds)
      .eq('brand', brandId)
      .then(({ data, error }) => {
        logger.debug('Topics:', { data, error });
        if (
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string' &&
          error.message !== ''
        )
          setError(error.message);
        else if (typeof error === 'string' && error !== '') setError(error);
        else setTopics(data ?? []);
        setLoading(false);
      });
  }, [brandId, subcategories]);

  const value: TopicContextType = {
    topCategories,
    subcategories,
    topics: search
      ? topics.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
      : topics,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
  };

  return <TopicContext.Provider value={value}>{children}</TopicContext.Provider>;
}
