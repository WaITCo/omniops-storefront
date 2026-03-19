'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { PriceDisplay } from '@/components/product/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RichText } from '@/components/ui/RichText';
import { useCartStore } from '@/lib/cart-store';
import type { Product } from '@/lib/strapi-types';

interface Props {
  product: Product;
  categorySlug: string;
  currency?: string;
}

export function ProductDetail({ product, categorySlug, currency = 'EUR' }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const activeVariants = product.variants?.filter((v) => v.is_active) ?? [];

  const initialOptions: Record<string, string> = {};
  product.options?.forEach((opt) => {
    const firstValue = opt.values?.[0]?.value;
    if (firstValue) initialOptions[opt.name] = firstValue;
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);

  const selectedVariant =
    activeVariants.find((v) =>
      Object.entries(selectedOptions).every(([k, val]) => v.selected_options[k] === val)
    ) ?? activeVariants[0];

  const isSoldOut = !selectedVariant || selectedVariant.stock_quantity === 0;

  function handleAddToCart() {
    if (!selectedVariant) return;
    const variantLabel = Object.entries(selectedOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    addItem({
      productId: product.documentId,
      productName: product.name,
      variantId: selectedVariant.documentId,
      variantLabel: variantLabel || undefined,
      price: selectedVariant.price,
    });
    router.push('/checkout');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground/50 mb-10">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop/${categorySlug}`} className="hover:text-foreground transition-colors capitalize">
          {categorySlug}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <ProductGallery images={product.images ?? []} productName={product.name} />

        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-serif text-4xl text-foreground leading-tight">{product.name}</h1>
            {isSoldOut && <Badge variant="error">Ausverkauft</Badge>}
          </div>

          {selectedVariant && (
            <PriceDisplay
              price={selectedVariant.price}
              compareAtPrice={selectedVariant.compare_at_price}
              currency={currency}
              className="mb-6 text-lg"
            />
          )}

          {product.short_description && (
            <p className="font-sans text-foreground/70 leading-relaxed mb-8">
              {product.short_description}
            </p>
          )}

          {(product.options?.length ?? 0) > 0 && (
            <div className="mb-8">
              <VariantSelector
                options={product.options}
                variants={activeVariants}
                selectedOptions={selectedOptions}
                onSelect={(name, value) =>
                  setSelectedOptions((prev) => ({ ...prev, [name]: value }))
                }
              />
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className="w-full mb-4"
          >
            {isSoldOut ? 'Ausverkauft' : 'Jetzt anfragen'}
          </Button>

          {product.description && (
            <div className="mt-10 pt-10 border-t border-muted">
              <h2 className="font-mono text-xs uppercase tracking-wider text-foreground/60 mb-4">
                Produktbeschreibung
              </h2>
              <RichText content={product.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
