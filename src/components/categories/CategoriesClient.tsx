'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/strapi-types';

interface Props {
  categories: Category[];
  labels: {
    searchPlaceholder: string;
    noResults: string;
    courses: string;
    viewCategory: string;
  };
}

export function CategoriesClient({ categories, labels }: Props) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : categories;

  const primary = filtered[0] ?? null;
  const secondary = filtered.slice(1, 6);
  const rest = filtered.slice(6);

  return (
    <>
      {/* Search */}
      <div className="max-w-md mx-auto mt-6 mb-12">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 border border-muted rounded-full bg-white font-sans text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-foreground/50 font-mono text-sm py-12">
          {labels.noResults}
        </p>
      ) : (
        <>
          {/* Top-Kategorien-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Primäre Karte (groß) */}
            {primary && (
              <Link
                href={`/shop?kategorie=${encodeURIComponent(primary.name)}`}
                className="md:col-span-1 bg-foreground text-background rounded-2xl p-8 hover:bg-foreground/90 transition-colors group"
              >
                <div className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-background/90">
                  {primary.name}
                </h3>
                {primary.description && (
                  <p className="text-background/70 text-sm leading-relaxed mb-4 line-clamp-2">
                    {primary.description}
                  </p>
                )}
                <span className="font-mono text-xs text-background/50">
                  {labels.viewCategory} →
                </span>
              </Link>
            )}

            {/* Sekundäre Karten */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {secondary.map((cat) => (
                <Link
                  key={cat.documentId}
                  href={`/shop?kategorie=${encodeURIComponent(cat.name)}`}
                  className="bg-white border border-muted rounded-2xl p-6 hover:shadow-md transition-shadow group"
                >
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-foreground/60 leading-relaxed mb-3 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subCategories.slice(0, 3).map((sub) => (
                        <span key={sub} className="text-xs bg-muted text-foreground/60 px-2 py-0.5 rounded-full">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Alle weiteren Kategorien */}
          {rest.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {rest.map((cat) => (
                <Link
                  key={cat.documentId}
                  href={`/shop?kategorie=${encodeURIComponent(cat.name)}`}
                  className="bg-white border border-muted rounded-xl p-5 hover:shadow-sm transition-shadow group"
                >
                  <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-accent transition-colors">
                    {cat.name}
                  </h4>
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.subCategories.slice(0, 2).map((sub) => (
                        <span key={sub} className="text-xs bg-muted text-foreground/50 px-1.5 py-0.5 rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
