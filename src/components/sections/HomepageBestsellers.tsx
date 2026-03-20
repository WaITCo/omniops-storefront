import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/lib/strapi';
import { ProductCard } from '@/components/product/ProductCard';

interface Props {
  locale: string;
}

export async function HomepageBestsellers({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  let bestsellers = [];
  try {
    const { data } = await getProducts({ filters: { badge: { $eq: 'BESTSELLER' } }, pagination: { pageSize: 3 } });
    bestsellers = data;
  } catch {
    return null;
  }

  if (!bestsellers.length) return null;

  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full mb-3">
              {t('bestsellers.label')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              {t('bestsellers.title')}
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 font-mono text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            {t('bestsellers.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.documentId} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="font-mono text-sm text-foreground/50 hover:text-foreground underline underline-offset-4">
            {t('bestsellers.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
