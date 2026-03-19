import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getGlobalSettings } from '@/lib/strapi';
import { buildMetadata } from '@/components/ui/SeoHead';
import { ProductDetail } from './ProductDetail';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getProductBySlug(slug);
    if (result) {
      return buildMetadata({
        seo: result.data.seo,
        fallbackTitle: `${result.data.name} – FORMA Shop`,
        fallbackDescription: result.data.short_description ?? undefined,
      });
    }
  } catch {}
  return { title: 'Produkt – FORMA' };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;

  let result = null;
  try {
    result = await getProductBySlug(slug);
  } catch {}

  if (!result) notFound();

  let currency = 'EUR';
  try {
    const settings = await getGlobalSettings();
    currency = settings.data.currency ?? 'EUR';
  } catch {}

  return (
    <ProductDetail
      product={result.data}
      categorySlug={category}
      currency={currency}
    />
  );
}
