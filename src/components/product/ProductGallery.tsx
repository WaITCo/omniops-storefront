'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { StrapiImage } from '@/lib/strapi-types';

interface ProductGalleryProps {
  images: StrapiImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  if (!images.length) return null;

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={`${strapiUrl}${activeImage.url}`}
          alt={activeImage.alternativeText ?? productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(i)}
              className={[
                'relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors',
                i === activeIndex ? 'border-foreground' : 'border-transparent hover:border-muted',
              ].join(' ')}
            >
              <Image
                src={`${strapiUrl}${image.url}`}
                alt={image.alternativeText ?? productName}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
