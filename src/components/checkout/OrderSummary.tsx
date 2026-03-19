import { PriceDisplay } from '@/components/product/PriceDisplay';

interface OrderSummaryProps {
  productName: string;
  variantLabel?: string;
  price: number;
  currency?: string;
}

export function OrderSummary({
  productName,
  variantLabel,
  price,
  currency = 'EUR',
}: OrderSummaryProps) {
  return (
    <div className="border border-muted p-6 bg-background">
      <h3 className="font-mono text-xs uppercase tracking-wider text-foreground/60 mb-4">
        Bestellübersicht
      </h3>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans font-medium text-foreground">{productName}</p>
          {variantLabel && (
            <p className="font-mono text-xs text-foreground/50 mt-1">{variantLabel}</p>
          )}
        </div>
        <PriceDisplay price={price} currency={currency} />
      </div>
      <div className="mt-6 pt-4 border-t border-muted flex items-center justify-between">
        <span className="font-mono text-sm uppercase tracking-wider text-foreground">Gesamt</span>
        <PriceDisplay price={price} currency={currency} />
      </div>
    </div>
  );
}
