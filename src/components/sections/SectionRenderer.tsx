import type { LandingPageSection } from '@/lib/strapi-types';
import { HeroBanner } from './HeroBanner';
import { ProductPlacement } from './ProductPlacement';
import { CtaBlock } from './CtaBlock';
import { TextBlock } from './TextBlock';
import { ImageText } from './ImageText';
import { ImageGallery } from './ImageGallery';
import { Testimonials } from './Testimonials';
import { Faq } from './Faq';

interface SectionRendererProps {
  sections: LandingPageSection[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.__component) {
          case 'sections.hero-banner':
            return <HeroBanner key={i} section={section} />;
          case 'sections.product-placement':
            return <ProductPlacement key={i} section={section} />;
          case 'sections.cta-block':
            return <CtaBlock key={i} section={section} />;
          case 'sections.text-block':
            return <TextBlock key={i} section={section} />;
          case 'sections.image-text':
            return <ImageText key={i} section={section} />;
          case 'sections.image-gallery':
            return <ImageGallery key={i} section={section} />;
          case 'sections.testimonials':
            return <Testimonials key={i} section={section} />;
          case 'sections.faq':
            return <Faq key={i} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
