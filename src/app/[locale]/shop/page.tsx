import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCategories, getProducts } from '@/lib/strapi';
import type { Category, Product } from '@/lib/strapi-types';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ShopProductsView } from '@/components/product/ShopProductsView';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop – FORMA',
  description: 'Alle Produkte im FORMA Shop.',
};

export default async function ShopPage() {
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [catResponse, prodResponse] = await Promise.all([
      getCategories({ pagination: { pageSize: 48 } }),
      getProducts({ pagination: { pageSize: 100 } }),
    ]);
    categories = catResponse.data;
    products = prodResponse.data;
  } catch {
    // Graceful degradation: render empty state
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-5xl text-foreground mb-12">Shop</h1>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Suspense fallback={null}>
              <ProductFilters categories={categories} />
            </Suspense>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0">
          <Suspense fallback={
            <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider py-12 text-center">
              Wird geladen…
            </p>
          }>
            <ShopProductsView products={products} categories={categories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
