import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/strapi';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop – FORMA',
  description: 'Alle Kategorien im FORMA Shop.',
};

export default async function ShopPage() {
  let categories = [];
  try {
    const response = await getCategories({ pagination: { pageSize: 24 } });
    categories = response.data;
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-5xl text-foreground mb-12">Shop</h1>
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.documentId}
              href={`/shop/${cat.slug}`}
              className="group p-8 border border-muted hover:border-foreground transition-colors"
            >
              <h2 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-2">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="font-sans text-sm text-foreground/60 line-clamp-2">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider">
          Noch keine Kategorien vorhanden
        </p>
      )}
    </div>
  );
}
