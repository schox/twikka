'use client';

import { useEffect, useState } from 'react';
import { cn } from '../utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: 18,
  md: 24,
  lg: 32,
};

export function LoadingSpinner({ size = 'md', className, color }: LoadingSpinnerProps) {
  const [isClient, setIsClient] = useState(false);
  const pixelSize = sizeMap[size];

  useEffect(() => {
    // Dynamically import ldrs only on client (auto-registers the web component)
    import('ldrs/ring2').then(() => {
      setIsClient(true);
    });
  }, []);

  return (
    <div className={cn('flex items-center justify-center', className)} role="status" aria-label="Loading">
      {isClient ? (
        // @ts-expect-error - ldrs web component
        <l-ring-2
          size={pixelSize}
          stroke={Math.max(2, pixelSize / 8)}
          stroke-length="0.25"
          bg-opacity="0.1"
          speed="0.8"
          color={color ?? 'currentColor'}
        />
      ) : (
        // Fallback for SSR - simple CSS spinner
        <div
          className="animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ width: pixelSize, height: pixelSize }}
        />
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}

interface LoadingContentProps {
  message?: string;
  className?: string;
}

export function LoadingContent({ message, className }: LoadingContentProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <LoadingSpinner size="lg" />
      {message && <p className="text-sm text-muted-foreground mt-4">{message}</p>}
    </div>
  );
}
