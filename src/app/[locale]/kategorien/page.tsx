import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/lib/strapi';
import type { Category } from '@/lib/strapi-types';
import { CategoriesClient } from '@/components/categories/CategoriesClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kategorien – FORMA',
  description: 'Alle Themenbereiche auf einen Blick.',
};

type Props = { params: Promise<{ locale: string }> };

export default async function KategorienPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });

  let categories: Category[] = [];
  try {
    const { data } = await getCategories({ pagination: { pageSize: 50 } });
    categories = data;
  } catch {}

  const stats = [
    { value: String(categories.length || '—'), label: t('stats.categories') },
    { value: '85', label: t('stats.courses') },
    { value: '12.400+', label: t('stats.learners') },
  ];

  const labels = {
    searchPlaceholder: t('searchPlaceholder'),
    noResults: t('noResults'),
    courses: t('stats.courses'),
    viewCategory: t('viewCategory'),
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-muted py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-foreground/60 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Stats-Zeile */}
      <section className="border-b border-muted bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-muted">
            {stats.map(({ value, label }) => (
              <div key={label} className="py-8 text-center">
                <p className="font-serif text-3xl text-foreground font-bold">{value}</p>
                <p className="font-mono text-xs text-foreground/50 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid (client for search) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoriesClient categories={categories} labels={labels} />
      </section>
    </main>
  );
}
