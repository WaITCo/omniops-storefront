'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ImageGallerySection } from '@/lib/strapi-types';

interface ImageGalleryProps {
  section: ImageGallerySection;
}

export function ImageGallery({ section }: ImageGalleryProps) {
  const { images } = section;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, i) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(i)}
            className="relative aspect-square overflow-hidden hover:opacity-90 transition-opacity"
          >
            <Image
              src={`${strapiUrl}${image.url}`}
              alt={image.alternativeText ?? ''}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div className="relative max-w-4xl w-full aspect-[4/3]">
            <Image
              src={`${strapiUrl}${images[activeIndex].url}`}
              alt={images[activeIndex].alternativeText ?? ''}
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 font-mono text-background text-xl hover:text-muted transition-colors"
            onClick={() => setActiveIndex(null)}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
