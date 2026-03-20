interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  className?: string;
  showDiscount?: boolean;
}

export function PriceDisplay({
  price,
  compareAtPrice,
  currency = 'EUR',
  className = '',
  showDiscount = false,
}: PriceDisplayProps) {
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
    }).format(amount / 100);

  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent =
    hasDiscount && showDiscount
      ? Math.round((1 - price / compareAtPrice!) * 100)
      : null;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="font-mono text-foreground font-bold">
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="font-mono text-sm text-foreground/40 line-through">
          {formatPrice(compareAtPrice!)}
        </span>
      )}
      {discountPercent && (
        <span className="inline-block px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
