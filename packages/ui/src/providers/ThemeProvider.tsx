'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemeVariant = 'default' | 'high-contrast';

interface ThemeProviderState {
  theme: Theme;
  variant: ThemeVariant;
  setTheme: (theme: Theme) => void;
  setVariant: (variant: ThemeVariant) => void;
  actualTheme: 'light' | 'dark'; // The resolved theme (system resolves to light/dark)
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultVariant?: ThemeVariant;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultVariant = 'default',
  storageKey = 'novansa-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [variant, setVariant] = useState<ThemeVariant>(defaultVariant);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null && stored.trim() !== '') {
        const parsed: unknown = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          const data = parsed as Record<string, unknown>;
          const storedTheme = data.theme;
          const storedVariant = data.variant;

          if (
            typeof storedTheme === 'string' &&
            (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')
          ) {
            setTheme(storedTheme);
          }
          if (
            typeof storedVariant === 'string' &&
            (storedVariant === 'default' || storedVariant === 'high-contrast')
          ) {
            setVariant(storedVariant);
          }
        }
      }
    } catch {
      // Ignore localStorage errors (SSR, private browsing, etc.)
    }
  }, [storageKey]);

  // Apply theme changes to DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast');

    // Determine actual theme
    let resolvedTheme: 'light' | 'dark' = 'light';

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      resolvedTheme = systemTheme;
    } else {
      resolvedTheme = theme;
    }

    // Apply theme classes (always ensure a theme class is present)
    root.classList.add(resolvedTheme);
    if (variant === 'high-contrast') {
      root.classList.add('high-contrast');
    }

    // Force a style recalculation
    root.style.colorScheme = resolvedTheme;

    setActualTheme(resolvedTheme);

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify({ theme, variant }));
    } catch {
      // Ignore localStorage errors
    }
  }, [theme, variant, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setActualTheme(e.matches ? 'dark' : 'light');

      // Update DOM classes for system theme changes
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
      root.style.colorScheme = e.matches ? 'dark' : 'light';
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    variant,
    setTheme,
    setVariant,
    actualTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}