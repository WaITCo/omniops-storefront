import { getLandingPage } from '@/lib/strapi';
import { buildMetadata } from '@/components/ui/SeoHead';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
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
  await params;

  let page = null;
  try {
    page = await getLandingPage('homepage');
  } catch {}

  if (page?.data.sections?.length) {
    return <SectionRenderer sections={page.data.sections} />;
  }

  // Fallback-Content wenn noch kein LandingPage-Eintrag in Strapi
  return (
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
    </section>
  );
}
