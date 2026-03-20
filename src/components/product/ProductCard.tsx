import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/strapi-types';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 flex-shrink-0 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-foreground ml-0.5">{rating.toFixed(1)}</span>
      <span className="text-xs text-foreground/50">({count.toLocaleString('de-DE')})</span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    name,
    slug,
    images,
    variants,
    categories,
    badge,
    videoDuration,
    rating,
    ratingCount,
    originalPrice,
  } = product;

  const categorySlug = categories?.[0]?.slug ?? '_';
  const categoryName = categories?.[0]?.name ?? null;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const coverImage = images?.[0];
  const activeVariants = variants?.filter((v) => v.is_active) ?? [];
  const lowestPrice = activeVariants.length
    ? Math.min(...activeVariants.map((v) => v.price))
    : null;

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  const discountPercent =
    originalPrice && lowestPrice && originalPrice > lowestPrice
      ? Math.round((1 - lowestPrice / originalPrice) * 100)
      : null;

  return (
    <Link
      href={`/shop/${categorySlug}/${slug}`}
      className="group block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-100"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
        {coverImage ? (
          <Image
            src={`${strapiUrl}${coverImage.url}`}
            alt={coverImage.alternativeText ?? name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Badge oben links */}
        {badge && (
          <div className="absolute top-3 left-3">
            {badge === 'BESTSELLER' && (
              <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-white text-gray-900 rounded-full shadow-sm">
                Bestseller
              </span>
            )}
            {badge === 'NEU' && (
              <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-white/15 text-white backdrop-blur-sm border border-white/20 rounded-full">
                Neu
              </span>
            )}
            {badge === 'SALE' && (
              <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-[#D4622A] text-white rounded-full">
                Sale
              </span>
            )}
          </div>
        )}

        {/* Dauer-Pill oben rechts */}
        {videoDuration && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 text-xs font-mono bg-black/60 text-white backdrop-blur-sm rounded-full">
              {videoDuration}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Kategorie-Label */}
        {categoryName && (
          <p className="font-mono text-xs text-foreground/40 uppercase tracking-wider mb-1">
            {categoryName}
          </p>
        )}

        {/* Titel */}
        <h3 className="font-sans font-semibold text-foreground text-base leading-snug group-hover:text-[#D4622A] transition-colors mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Sterne-Bewertung */}
        {rating !== null && ratingCount !== null && rating > 0 && (
          <div className="mb-3">
            <StarRating rating={rating} count={ratingCount} />
          </div>
        )}

        {/* Preis */}
        {lowestPrice !== null && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-foreground text-base">
              {formatPrice(lowestPrice)}
            </span>
            {originalPrice && originalPrice > lowestPrice && (
              <span className="font-mono text-sm text-foreground/40 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            {discountPercent && (
              <span className="inline-block px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
