'use client';
// QueryProvider for TanStack Query configuration
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance with optimal defaults for our app
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time - how long data is considered fresh (5 minutes)
            staleTime: 5 * 60 * 1000,
            // Cache time - how long data stays in cache after unused (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 2 times with exponential backoff
            retry: 2,
            // Don't refetch when window regains focus by default
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
