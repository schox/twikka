'use client';
import { useEffect } from 'react';
import { clearAuthAndReload } from '../utils/clearAuthAndReload';

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Patch fetch to catch invalid refresh token errors globally
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await origFetch(...args);
      if (response.status === 401) {
        try {
          const text = await response.clone().text();
          if (text.includes('Invalid Refresh Token')) {
            clearAuthAndReload();
          }
        } catch {
          // Ignore
        }
      }
      return response;
    };
    return () => {
      window.fetch = origFetch;
    };
  }, []);
  return <>{children}</>;
}
