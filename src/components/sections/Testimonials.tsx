import type { TestimonialsSection } from '@/lib/strapi-types';

interface TestimonialsProps {
  section: TestimonialsSection;
}

export function Testimonials({ section }: TestimonialsProps) {
  const { testimonials } = section;

  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <blockquote
              key={item.id}
              className="bg-background p-8 border border-muted"
            >
              <p className="font-serif text-lg text-foreground leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer>
                <p className="font-mono text-sm uppercase tracking-wider text-foreground">
                  {item.author}
                </p>
                {item.role && (
                  <p className="font-sans text-xs text-foreground/60 mt-0.5">{item.role}</p>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
