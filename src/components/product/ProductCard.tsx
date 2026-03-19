import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/strapi-types';
import { Badge } from '@/components/ui/Badge';
import { PriceDisplay } from './PriceDisplay';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { name, slug, short_description, images, variants, categories } = product;
  const categorySlug = categories?.[0]?.slug ?? '_';
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const coverImage = images?.[0];
  const activeVariants = variants?.filter((v) => v.is_active) ?? [];
  const lowestPrice = activeVariants.length
    ? Math.min(...activeVariants.map((v) => v.price))
    : null;
  const hasCompareAt = activeVariants.some((v) => v.compare_at_price);
  const compareAtPrice = hasCompareAt
    ? Math.min(...activeVariants.filter((v) => v.compare_at_price).map((v) => v.compare_at_price!))
    : null;

  const isNew = !product.publishedAt || new Date(product.publishedAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const isSoldOut = activeVariants.every((v) => v.stock_quantity === 0);
  const isOnSale = hasCompareAt;

  return (
    <Link href={`/shop/${categorySlug}/${slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-muted mb-4">
        {coverImage ? (
          <Image
            src={`${strapiUrl}${coverImage.url}`}
            alt={coverImage.alternativeText ?? name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs text-foreground/30 uppercase tracking-wider">
              Kein Bild
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isSoldOut && <Badge variant="error">Ausverkauft</Badge>}
          {!isSoldOut && isOnSale && <Badge variant="warning">Sale</Badge>}
          {!isSoldOut && isNew && !isOnSale && <Badge variant="default">Neu</Badge>}
        </div>
      </div>

      <div>
        <h3 className="font-sans font-medium text-foreground group-hover:text-accent transition-colors mb-1">
          {name}
        </h3>
        {short_description && (
          <p className="font-sans text-sm text-foreground/60 mb-2 line-clamp-2">
            {short_description}
          </p>
        )}
        {lowestPrice !== null && (
          <PriceDisplay price={lowestPrice} compareAtPrice={compareAtPrice} />
        )}
      </div>
    </Link>
  );
}
