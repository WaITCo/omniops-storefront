import Image from 'next/image';
import type { HeroBannerSection } from '@/lib/strapi-types';
import { Button } from '@/components/ui/Button';

interface HeroBannerProps {
  section: HeroBannerSection;
}

export function HeroBanner({ section }: HeroBannerProps) {
  const { headline, subheadline, cta_text, cta_url, background_image } = section;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  return (
    <section className="relative w-full min-h-[70vh] flex items-center bg-background overflow-hidden">
      {background_image && (
        <Image
          src={`${strapiUrl}${background_image.url}`}
          alt={background_image.alternativeText ?? ''}
          fill
          className="object-cover object-center opacity-20"
          priority
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight max-w-3xl">
          {headline}
        </h1>

        {subheadline && (
          <p className="mt-6 font-sans text-lg text-foreground/70 max-w-xl leading-relaxed">
            {subheadline}
          </p>
        )}

        {cta_text && cta_url && (
          <div className="mt-10">
            <a href={cta_url}>
              <Button variant="primary" size="lg">
                {cta_text}
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
