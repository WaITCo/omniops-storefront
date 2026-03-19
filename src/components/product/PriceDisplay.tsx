interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  className?: string;
}

export function PriceDisplay({
  price,
  compareAtPrice,
  currency = 'EUR',
  className = '',
}: PriceDisplayProps) {
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
    }).format(amount / 100);

  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-mono text-foreground">
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="font-mono text-sm text-foreground/40 line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
