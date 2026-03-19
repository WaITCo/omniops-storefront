import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-foreground/40 mb-4">404</p>
      <h1 className="font-serif text-5xl text-foreground mb-6">Seite nicht gefunden</h1>
      <p className="font-sans text-foreground/60 mb-10">
        Die gesuchte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link href="/">
        <Button variant="primary">Zurück zur Startseite</Button>
      </Link>
    </div>
  );
}
