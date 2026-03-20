import type { Metadata } from 'next';
import { DankePageClient } from '@/components/ui/DankePageClient';

export const metadata: Metadata = {
  title: 'Vielen Dank! – FORMA',
  robots: { index: false, follow: false },
};

export default function DankePage() {
  return <DankePageClient />;
}
