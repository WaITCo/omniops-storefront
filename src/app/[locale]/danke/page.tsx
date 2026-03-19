import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Konfetti } from '@/components/ui/Konfetti';

export const metadata: Metadata = {
  title: 'Vielen Dank! – FORMA',
  robots: { index: false, follow: false },
};

export default function DankePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <Konfetti />
      <h1 className="font-serif text-5xl text-foreground mb-6">Vielen Dank!</h1>
      <p className="font-sans text-lg text-foreground/70 mb-12 leading-relaxed">
        Deine Anfrage wurde erfolgreich übermittelt.
        <br />
        Wir melden uns in Kürze bei dir.
      </p>
      <Link href="/shop">
        <Button variant="primary" size="lg">Weiter einkaufen</Button>
      </Link>
    </div>
  );
}
