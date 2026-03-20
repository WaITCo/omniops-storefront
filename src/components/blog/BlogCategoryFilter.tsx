'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BlogCategoryFilterProps {
  tags: string[];
  activeTag: string | null;
}

export function BlogCategoryFilter({ tags, activeTag }: BlogCategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('blog');

  function handleSelect(tag: string | null) {
    if (tag) {
      router.push(`${pathname}?kategorie=${encodeURIComponent(tag)}`);
    } else {
      router.push(pathname);
    }
  }

  if (tags.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 pb-1 min-w-max">
        {/* "Alle" button */}
        <button
          onClick={() => handleSelect(null)}
          className={
            activeTag === null
              ? 'px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white transition-colors'
              : 'px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-foreground/60 hover:border-gray-400 transition-colors'
          }
        >
          {t('allCategories')}
        </button>

        {/* Dynamic tag buttons */}
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleSelect(tag)}
            className={
              activeTag === tag
                ? 'px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white transition-colors'
                : 'px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-foreground/60 hover:border-gray-400 transition-colors'
            }
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
