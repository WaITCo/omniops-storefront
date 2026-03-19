import Image from 'next/image';
import type { ImageTextSection } from '@/lib/strapi-types';
import { Button } from '@/components/ui/Button';

interface ImageTextProps {
  section: ImageTextSection;
}

export function ImageText({ section }: ImageTextProps) {
  const { image, headline, body, image_position } = section;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';
  const isLeft = image_position === 'left';

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className={`flex flex-col gap-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
        <div className="w-full md:w-1/2 relative aspect-[4/3] overflow-hidden">
          <Image
            src={`${strapiUrl}${image.url}`}
            alt={image.alternativeText ?? ''}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="font-serif text-4xl text-foreground mb-6 leading-tight">{headline}</h2>
          <p className="font-sans text-foreground/70 leading-relaxed mb-8">{body}</p>
        </div>
      </div>
    </section>
  );
}
