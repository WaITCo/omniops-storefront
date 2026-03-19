import type { ProductPlacementSection } from '@/lib/strapi-types';
import { ProductGrid } from '@/components/product/ProductGrid';

interface ProductPlacementProps {
  section: ProductPlacementSection;
}

export function ProductPlacement({ section }: ProductPlacementProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="font-serif text-3xl text-foreground mb-10">{section.title}</h2>
      <ProductGrid products={section.products} />
    </section>
  );
}
