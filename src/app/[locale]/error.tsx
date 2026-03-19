'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[FORMA Error]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-foreground/40 mb-4">Fehler</p>
      <h1 className="font-serif text-4xl text-foreground mb-6">Etwas ist schiefgelaufen</h1>
      <p className="font-sans text-foreground/60 mb-10">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
      </p>
      <Button variant="primary" onClick={reset}>
        Erneut versuchen
      </Button>
    </div>
  );
}
