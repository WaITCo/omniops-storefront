'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-muted bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-xl text-foreground">{t('tagline')}</p>

          <nav className="flex items-center gap-6">
            <Link
              href="/shop"
              className="font-mono text-xs uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/impressum"
              className="font-mono text-xs uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {t('imprint')}
            </Link>
            <Link
              href="/datenschutz"
              className="font-mono text-xs uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {t('privacy')}
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-muted">
          <p className="font-mono text-xs text-foreground/60 text-center">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
