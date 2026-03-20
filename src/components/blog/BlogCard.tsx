import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { BlogPost } from '@/lib/strapi-types';

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export async function BlogCard({ post, locale }: BlogCardProps) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const { title, slug, excerpt, cover_image, author, reading_time_minutes, publishedAt, category_tags } = post;

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(publishedAt))
    : null;

  const firstTag = category_tags?.[0] ?? null;

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-shadow"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden">
        {cover_image && (
          <Image
            src={`${strapiUrl}${cover_image.url}`}
            alt={cover_image.alternativeText ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category Tag */}
        {firstTag && (
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-2">
            {firstTag}
          </span>
        )}

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 mb-4 flex-1">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-xs text-foreground/40 font-mono mt-auto">
          {author && <span>{author}</span>}
          {author && formattedDate && <span>·</span>}
          {formattedDate && <span>{formattedDate}</span>}
          {reading_time_minutes && (
            <>
              <span>·</span>
              <span>{t('readTime', { minutes: reading_time_minutes })}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
