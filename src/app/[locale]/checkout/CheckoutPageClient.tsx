'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export function CheckoutPageClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const isHydrated = useCartStore.persist?.hasHydrated?.() ?? true;

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/shop');
    }
  }, [isHydrated, items.length, router]);

  const firstItem = items[0];

  if (!firstItem) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider">
          Warenkorb wird geladen…
        </p>
      </div>
    );
  }

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-4xl text-foreground mb-12">Bestellung abschließen</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <CheckoutForm
            productName={firstItem.productName}
            productId={firstItem.productId}
            variantId={firstItem.variantId}
            price={totalPrice}
          />
        </div>
        <div>
          <OrderSummary
            productName={firstItem.productName}
            variantLabel={firstItem.variantLabel}
            price={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
