import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/strapi';
import type { Product, Category } from '@/lib/strapi-types';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ShopProductsView } from '@/components/product/ShopProductsView';
import { buildMetadata } from '@/components/ui/SeoHead';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  try {
    const result = await getCategoryBySlug(category);
    if (result) {
      return buildMetadata({
        seo: result.data.seo,
        fallbackTitle: `${result.data.name} – FORMA Shop`,
        fallbackDescription: result.data.description ?? undefined,
      });
    }
  } catch {}
  return { title: 'Shop – FORMA' };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  let catResult = null;
  try {
    catResult = await getCategoryBySlug(category);
  } catch {}

  if (!catResult) notFound();

  const cat = catResult.data;

  let products: Product[] = [];
  let allCategories: Category[] = [];

  try {
    const [prodResponse, catResponse] = await Promise.all([
      getProducts({
        filters: { categories: { slug: { $eq: category } } },
        pagination: { pageSize: 100 },
      }),
      getCategories({ pagination: { pageSize: 48 } }),
    ]);
    products = prodResponse.data;
    allCategories = catResponse.data;
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground/50 mb-10">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{cat.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-12">
        {cat.image && (
          <div className="relative h-48 md:h-64 overflow-hidden mb-8">
            <Image
              src={`${strapiUrl}${cat.image.url}`}
              alt={cat.image.alternativeText ?? cat.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-foreground/30" />
            <h1 className="absolute bottom-6 left-6 font-serif text-4xl text-white">
              {cat.name}
            </h1>
          </div>
        )}
        {!cat.image && (
          <h1 className="font-serif text-5xl text-foreground mb-4">{cat.name}</h1>
        )}
        {cat.description && (
          <p className="font-sans text-foreground/70 max-w-2xl leading-relaxed">
            {cat.description}
          </p>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Suspense fallback={null}>
              <ProductFilters categories={allCategories} />
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
            <ShopProductsView products={products} categories={allCategories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
