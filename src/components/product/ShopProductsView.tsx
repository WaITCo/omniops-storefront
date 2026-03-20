'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Product, Category } from '@/lib/strapi-types';
import { ProductGrid } from './ProductGrid';
import { ProductListItem } from './ProductListItem';
import { ShopTopbar } from './ShopTopbar';

interface ShopProductsViewProps {
  products: Product[];
  categories: Category[];
}

function applyClientFilters(products: Product[], searchParams: URLSearchParams): Product[] {
  let filtered = [...products];

  // Categories filter
  const catSlugs = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
  if (catSlugs.length > 0) {
    filtered = filtered.filter((p) =>
      p.categories?.some((c) => catSlugs.includes(c.slug))
    );
  }

  // Level filter
  const level = searchParams.get('level');
  if (level) {
    filtered = filtered.filter((p) => p.level === level);
  }

  // Price filter – prices are stored in cents
  const price = searchParams.get('price');
  if (price === 'under50') {
    filtered = filtered.filter((p) => {
      const lowest = getLowestPrice(p);
      return lowest !== null && lowest < 5000;
    });
  } else if (price === '50to100') {
    filtered = filtered.filter((p) => {
      const lowest = getLowestPrice(p);
      return lowest !== null && lowest >= 5000 && lowest <= 10000;
    });
  } else if (price === 'over100') {
    filtered = filtered.filter((p) => {
      const lowest = getLowestPrice(p);
      return lowest !== null && lowest > 10000;
    });
  }

  // Rating filter
  const minRating = parseFloat(searchParams.get('minRating') ?? '');
  if (!isNaN(minRating)) {
    filtered = filtered.filter((p) => p.rating !== null && p.rating >= minRating);
  }

  // Sort
  const sort = searchParams.get('sort') ?? '';
  if (sort === 'newest') {
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sort === 'price_asc') {
    filtered.sort((a, b) => (getLowestPrice(a) ?? 0) - (getLowestPrice(b) ?? 0));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (getLowestPrice(b) ?? 0) - (getLowestPrice(a) ?? 0));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } else {
    // Default: "popular" – sort by enrollment desc
    filtered.sort((a, b) => (b.enrollment ?? 0) - (a.enrollment ?? 0));
  }

  return filtered;
}

function getLowestPrice(product: Product): number | null {
  const active = product.variants?.filter((v) => v.is_active) ?? [];
  if (!active.length) return null;
  return Math.min(...active.map((v) => v.price));
}

export function ShopProductsView({ products, categories }: ShopProductsViewProps) {
  const t = useTranslations('shop');
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') ?? 'grid';

  const filtered = applyClientFilters(products, searchParams);

  return (
    <>
      <ShopTopbar totalCount={filtered.length} categories={categories} />

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider py-16 text-center">
          {t('noProducts')}
        </p>
      ) : currentView === 'list' ? (
        <div className="flex flex-col gap-4">
          {filtered.map((product) => (
            <ProductListItem key={product.documentId} product={product} />
          ))}
        </div>
      ) : (
        <ProductGrid products={filtered} columns={3} />
      )}
    </>
  );
}
