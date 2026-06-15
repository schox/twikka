'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const screenshots = [
  { src: '/images/screenshots/Twikka_Info.png', alt: 'Twikka Info Screen' },
  { src: '/images/screenshots/Twikka_Discover.png', alt: 'Twikka Discover Screen' },
  { src: '/images/screenshots/Twikka_Interests.png', alt: 'Twikka Interests Screen' },
  { src: '/images/screenshots/Twikka_Daily.png', alt: 'Twikka Daily Screen' },
  { src: '/images/screenshots/Twikka_Activity.png', alt: 'Twikka Activity Screen' },
  { src: '/images/screenshots/Twikka_Plan.png', alt: 'Twikka Plan Screen' },
];

export default function AppScreenshotShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 300);
    },
    [activeIndex, isTransitioning],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % screenshots.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeIndex, goTo]);

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Main featured screenshot */}
      <div className="relative aspect-[9/19] max-h-[520px] mx-auto mb-6 overflow-hidden rounded-3xl shadow-2xl">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          <Image
            src={screenshots[activeIndex].src}
            alt={screenshots[activeIndex].alt}
            fill
            className="object-cover"
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 80vw, 400px"
          />
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {screenshots.map((shot, i) => (
          <button
            key={shot.src}
            onClick={() => goTo(i)}
            className={`relative aspect-[9/19] w-12 sm:w-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              i === activeIndex
                ? 'border-primary ring-2 ring-primary/30 scale-105'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover"
              sizes="60px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
