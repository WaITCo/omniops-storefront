import type { CtaBlockSection } from '@/lib/strapi-types';
import { Button } from '@/components/ui/Button';

interface CtaBlockProps {
  section: CtaBlockSection;
}

export function CtaBlock({ section }: CtaBlockProps) {
  const { headline, body, cta_text, cta_url } = section;

  return (
    <section className="bg-foreground text-background py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl mb-6">{headline}</h2>
        {body && (
          <p className="font-sans text-lg text-background/70 mb-10 leading-relaxed">{body}</p>
        )}
        <a href={cta_url}>
          <Button variant="secondary" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
            {cta_text}
          </Button>
        </a>
      </div>
    </section>
  );
}
