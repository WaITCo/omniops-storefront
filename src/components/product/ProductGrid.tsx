import type { Product } from '@/lib/strapi-types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider py-12 text-center">
        Keine Produkte gefunden
      </p>
    );
  }

  return (
    <div
      className={[
        'grid grid-cols-1 gap-8 sm:grid-cols-2',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
      ].join(' ')}
    >
      {products.map((product) => (
        <ProductCard key={product.documentId} product={product} />
      ))}
    </div>
  );
}
