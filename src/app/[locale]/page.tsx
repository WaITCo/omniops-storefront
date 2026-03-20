import { getLandingPage } from '@/lib/strapi';
import { buildMetadata } from '@/components/ui/SeoHead';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { StatsBar } from '@/components/sections/StatsBar';
import { HomepageBestsellers } from '@/components/sections/HomepageBestsellers';
import { HomepageFeatures } from '@/components/sections/HomepageFeatures';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  try {
    const page = await getLandingPage('homepage');
    if (page) {
      return buildMetadata({
        seo: page.data.seo,
        fallbackTitle: 'FORMA – Werkzeuge, die wirken.',
        fallbackDescription: 'Kuratierte digitale Produkte für moderne Teams.',
      });
    }
  } catch {}
  return {
    title: 'FORMA – Werkzeuge, die wirken.',
    description: 'Kuratierte digitale Produkte für moderne Teams.',
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  let page = null;
  try {
    page = await getLandingPage('homepage');
  } catch {}

  if (page?.data.sections?.length) {
    return <SectionRenderer sections={page.data.sections} />;
  }

  // Fallback-Content wenn noch kein LandingPage-Eintrag in Strapi
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
          Werkzeuge,
          <br />
          die wirken.
        </h1>
        <p className="mt-6 font-sans text-lg text-foreground/70 max-w-xl leading-relaxed">
          FORMA – Kuratierte digitale Produkte für moderne Teams.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/shop">
            <Button variant="primary" size="lg">Shop erkunden</Button>
          </Link>
          <Link href="/blog">
            <Button variant="secondary" size="lg">Blog lesen</Button>
          </Link>
        </div>

        {/* Trust-Indikatoren */}
        <div className="mt-10 flex items-center gap-3">
          {/* Avatar-Stapel */}
          <div className="flex -space-x-2">
            {[
              'from-amber-400 to-orange-500',
              'from-blue-400 to-indigo-500',
              'from-green-400 to-emerald-500',
              'from-pink-400 to-rose-500',
              'from-violet-400 to-purple-500',
            ].map((gradient, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-background flex-shrink-0`}
              />
            ))}
          </div>
          {/* Sterne */}
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-mono text-xs text-foreground/60">4,9 von 12.400+ Bewertungen</span>
          </div>
        </div>
      </section>

      {/* Stats-Bar */}
      <StatsBar locale={locale} />

      {/* Bestseller-Section */}
      <HomepageBestsellers locale={locale} />

      {/* Features / USPs */}
      <HomepageFeatures locale={locale} />
    </>
  );
}
