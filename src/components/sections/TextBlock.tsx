import type { TextBlockSection } from '@/lib/strapi-types';
import { RichText } from '@/components/ui/RichText';

interface TextBlockProps {
  section: TextBlockSection;
}

export function TextBlock({ section }: TextBlockProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <RichText content={section.content} />
    </section>
  );
}
