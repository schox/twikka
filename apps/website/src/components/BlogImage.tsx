'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  placeholderText?: string;
}

export function BlogImage({
  src,
  alt,
  fill = true,
  className = '',
  placeholderText = 'Image not available',
}: BlogImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
        <span className="text-sm">{placeholderText}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
