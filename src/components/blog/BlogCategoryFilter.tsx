'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BlogCategoryFilterProps {
  categories: string[];
  activeCategory: string;
}

export function BlogCategoryFilter({ categories, activeCategory }: BlogCategoryFilterProps) {
  const t = useTranslations('blog');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelect(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === '') {
      params.delete('kategorie');
    } else {
      params.set('kategorie', cat);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const all = ['', ...categories];

  return (
    <section className="border-b border-gray-100 bg-white sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
          {all.map((cat) => {
            const isActive = cat === activeCategory;
            const label = cat === '' ? t('allCategories') : cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelect(cat)}
                className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
