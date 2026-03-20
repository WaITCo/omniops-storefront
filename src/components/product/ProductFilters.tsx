'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import type { Category } from '@/lib/strapi-types';

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const t = useTranslations('shop');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when filter changes
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const toggleCategory = useCallback(
    (slug: string) => {
      const current = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      updateParam('categories', next.length ? next.join(',') : null);
    },
    [searchParams, updateParam]
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    params.delete('level');
    params.delete('price');
    params.delete('minRating');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
  const selectedLevel = searchParams.get('level') ?? '';
  const selectedPrice = searchParams.get('price') ?? '';
  const selectedRating = searchParams.get('minRating') ?? '';

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedLevel || selectedPrice || selectedRating;

  return (
    <aside className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/60">
          {t('filters')}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="font-mono text-xs text-accent hover:underline transition-colors"
          >
            {t('resetFilters')}
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
            {t('category')}
          </h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.documentId}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="w-4 h-4 rounded border-muted accent-accent cursor-pointer"
                  />
                  <span className="font-sans text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                    {cat.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Level */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
          {t('level')}
        </h3>
        <ul className="space-y-2">
          {[
            { value: '', label: t('allLevels') },
            { value: 'Einsteiger', label: t('beginner') },
            { value: 'Fortgeschrittene', label: t('intermediate') },
            { value: 'Experte', label: t('expert') },
          ].map(({ value, label }) => (
            <li key={value}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={value === '' ? selectedLevel === '' : selectedLevel === value}
                  onChange={() => updateParam('level', value || null)}
                  className="w-4 h-4 rounded border-muted accent-accent cursor-pointer"
                />
                <span className="font-sans text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
          {t('price')}
        </h3>
        <ul className="space-y-2">
          {[
            { value: '', label: t('allPrices') },
            { value: 'under50', label: t('under50') },
            { value: '50to100', label: t('50to100') },
            { value: 'over100', label: t('over100') },
          ].map(({ value, label }) => (
            <li key={value}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === value}
                  onChange={() => updateParam('price', value || null)}
                  className="w-4 h-4 border-muted accent-accent cursor-pointer"
                />
                <span className="font-sans text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">
          {t('rating')}
        </h3>
        <ul className="space-y-2">
          {[
            { value: '', label: t('allRatings') },
            { value: '4.5', label: '4.5+ ★' },
            { value: '4.0', label: '4.0+ ★' },
          ].map(({ value, label }) => (
            <li key={value}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="minRating"
                  checked={selectedRating === value}
                  onChange={() => updateParam('minRating', value || null)}
                  className="w-4 h-4 border-muted accent-accent cursor-pointer"
                />
                <span className="font-sans text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
