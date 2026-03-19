'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import { useCartStore } from '@/lib/cart-store';

export default function Header() {
  const t = useTranslations('navigation');
  const itemCount = useCartStore((s) => s.totalItems());

  return (
    <header className="border-b border-muted bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-normal tracking-tight text-foreground"
          >
            FORMA
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {t('shop')}
            </Link>
            <Link
              href="/blog"
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {t('blog')}
            </Link>
            <Link
              href="/kategorien"
              className="font-mono text-sm uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {t('categories')}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link
              href="/checkout"
              aria-label={t('cart')}
              className="relative font-mono text-sm uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {t('cart')}
              {itemCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-accent text-white text-xs font-bold rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
