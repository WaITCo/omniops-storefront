import type { Metadata } from 'next';
import { CheckoutPageClient } from './CheckoutPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout – FORMA',
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
