import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function CheckoutMinimalHeader() {
  const t = useTranslations('checkout');

  return (
    <header className="border-b border-muted bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl font-normal tracking-tight text-foreground"
          >
            FORMA
          </Link>

          {/* Secure checkout badge */}
          <div className="flex items-center gap-2 text-foreground/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider">
              {t('secureCheckout')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
