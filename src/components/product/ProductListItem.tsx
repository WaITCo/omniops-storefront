import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/strapi-types';

interface ProductListItemProps {
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

export function ProductListItem({ product }: ProductListItemProps) {
  const {
    name,
    slug,
    images,
    variants,
    categories,
    badge,
    short_description,
    rating,
    ratingCount,
    originalPrice,
    level,
    videoDuration,
    instructor,
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
      className="group flex gap-5 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-36 h-28 sm:w-44 sm:h-32 overflow-hidden rounded-xl bg-gray-900">
        {coverImage ? (
          <Image
            src={`${strapiUrl}${coverImage.url}`}
            alt={coverImage.alternativeText ?? name}
            fill
            className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        {badge && (
          <div className="absolute top-2 left-2">
            {badge === 'BESTSELLER' && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-white text-gray-900 rounded-full shadow-sm">
                Bestseller
              </span>
            )}
            {badge === 'NEU' && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-white/15 text-white backdrop-blur-sm border border-white/20 rounded-full">
                Neu
              </span>
            )}
            {badge === 'SALE' && (
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-[#D4622A] text-white rounded-full">
                Sale
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          {/* Category + Level row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {categoryName && (
              <p className="font-mono text-xs text-foreground/40 uppercase tracking-wider">
                {categoryName}
              </p>
            )}
            {level && (
              <span className="font-mono text-xs text-foreground/50 border border-muted rounded-full px-2 py-0.5">
                {level}
              </span>
            )}
            {videoDuration && (
              <span className="font-mono text-xs text-foreground/50">
                {videoDuration}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-sans font-semibold text-foreground text-base leading-snug group-hover:text-[#D4622A] transition-colors mb-1.5 line-clamp-2">
            {name}
          </h3>

          {/* Short description */}
          {short_description && (
            <p className="font-sans text-sm text-foreground/60 line-clamp-2 mb-2">
              {short_description}
            </p>
          )}

          {/* Instructor */}
          {instructor && (
            <p className="font-sans text-xs text-foreground/50 mb-2">{instructor}</p>
          )}

          {/* Rating */}
          {rating !== null && ratingCount !== null && rating > 0 && (
            <StarRating rating={rating} count={ratingCount} />
          )}
        </div>

        {/* Price row */}
        {lowestPrice !== null && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
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
