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
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-serif text-2xl font-normal tracking-tight text-foreground"
          >
            FORMA
          </Link>

          {/* Desktop nav links */}
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

          {/* Desktop search – centered, hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder={t('search')}
              aria-label={t('searchAriaLabel')}
              className="w-full pl-9 pr-4 py-2 text-sm border border-muted rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher />

            {/* Mobile search icon button */}
            <button
              type="button"
              aria-label={t('searchAriaLabel')}
              className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* CTA button */}
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center px-4 py-2 bg-foreground text-background font-mono text-sm uppercase tracking-wider hover:bg-accent transition-colors rounded-md"
            >
              {t('cta')}
            </Link>

            {/* Cart */}
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
