import type { Metadata } from 'next';
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../globals.css';

// Force SSR for all routes under [locale] – avoids ISR/static conflicts with next-intl
// in production Docker where React cache() scope differs between layout and page phases
export const dynamic = 'force-dynamic';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export const metadata: Metadata = {
  title: {
    default: 'FORMA – Werkzeuge, die wirken.',
    template: '%s – FORMA',
  },
  description: 'Kuratierte digitale Produkte für moderne Teams.',
  metadataBase: new URL(siteUrl || 'https://example.com'),
  openGraph: {
    siteName: 'FORMA',
    type: 'website',
    images: [{ url: '/images/og-default.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'de' | 'en')) {
    notFound();
  }

  // Import messages directly from JSON – bypasses next-intl's getConfig()/getRequestLocale()
  // pipeline which triggers headers() in production Docker → DYNAMIC_SERVER_USAGE
  // Static map required because Turbopack cannot resolve dynamic template literal imports
  const messagesMap: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
    de: () => import('../../../messages/de.json'),
    en: () => import('../../../messages/en.json'),
  };
  const messages = (await (messagesMap[locale] ?? messagesMap['de'])()).default;

  return (
    <html
      lang={locale}
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
