'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import type { Category } from '@/lib/strapi-types';

interface ShopTopbarProps {
  totalCount: number;
  categories: Category[];
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor" />
      <rect x="1" y="7" width="14" height="3" rx="1" fill="currentColor" />
      <rect x="1" y="12" width="14" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

export function ShopTopbar({ totalCount, categories }: ShopTopbarProps) {
  const t = useTranslations('shop');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') ?? '';
  const currentView = searchParams.get('view') ?? 'grid';

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Active filter chips data
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
  const selectedLevel = searchParams.get('level') ?? '';
  const selectedPrice = searchParams.get('price') ?? '';
  const selectedRating = searchParams.get('minRating') ?? '';

  const removeCategory = (slug: string) => {
    const next = selectedCategories.filter((s) => s !== slug);
    updateParam('categories', next.length ? next.join(',') : null);
  };

  const priceLabel: Record<string, string> = {
    under50: t('under50'),
    '50to100': t('50to100'),
    over100: t('over100'),
  };

  const levelLabel: Record<string, string> = {
    Einsteiger: t('beginner'),
    Fortgeschrittene: t('intermediate'),
    Experte: t('expert'),
  };

  const hasChips =
    selectedCategories.length > 0 || selectedLevel || selectedPrice || selectedRating;

  return (
    <div className="space-y-3 mb-6">
      {/* Main topbar row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Count */}
        <p className="font-mono text-sm text-foreground/60">
          {t('productsFound', { count: totalCount })}
        </p>

        {/* Sort + View toggle */}
        <div className="flex items-center gap-3">
          {/* Sort select */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="font-mono text-xs text-foreground/50 uppercase tracking-wider hidden sm:block"
            >
              {t('sortBy')}:
            </label>
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value || null)}
              className="font-mono text-sm bg-background border border-muted rounded px-3 py-1.5 text-foreground focus:outline-none focus:border-foreground/40 cursor-pointer"
            >
              <option value="">{t('sortPopular')}</option>
              <option value="newest">{t('sortNewest')}</option>
              <option value="price_asc">{t('sortPriceAsc')}</option>
              <option value="price_desc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-muted rounded overflow-hidden">
            <button
              onClick={() => updateParam('view', null)}
              title={t('gridView')}
              className={`p-2 transition-colors ${
                currentView === 'grid'
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground/50 hover:text-foreground'
              }`}
              aria-pressed={currentView === 'grid'}
            >
              <GridIcon />
            </button>
            <button
              onClick={() => updateParam('view', 'list')}
              title={t('listView')}
              className={`p-2 transition-colors ${
                currentView === 'list'
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground/50 hover:text-foreground'
              }`}
              aria-pressed={currentView === 'list'}
            >
              <ListIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasChips && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((slug) => {
            const cat = categories.find((c) => c.slug === slug);
            return (
              <FilterChip
                key={slug}
                label={cat?.name ?? slug}
                onRemove={() => removeCategory(slug)}
              />
            );
          })}
          {selectedLevel && (
            <FilterChip
              label={levelLabel[selectedLevel] ?? selectedLevel}
              onRemove={() => updateParam('level', null)}
            />
          )}
          {selectedPrice && (
            <FilterChip
              label={priceLabel[selectedPrice] ?? selectedPrice}
              onRemove={() => updateParam('price', null)}
            />
          )}
          {selectedRating && (
            <FilterChip
              label={`${selectedRating}+ ★`}
              onRemove={() => updateParam('minRating', null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm font-sans text-foreground/80">
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-foreground"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}
