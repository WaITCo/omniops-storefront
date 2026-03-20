import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { BlogPost } from '@/lib/strapi-types';

interface BlogFeaturedPostProps {
  post: BlogPost;
  locale: string;
}

export async function BlogFeaturedPost({ post, locale }: BlogFeaturedPostProps) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const { title, slug, excerpt, cover_image, author, reading_time_minutes, publishedAt, category_tags } = post;

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(publishedAt))
    : null;

  const firstTag = category_tags?.[0] ?? null;

  return (
    <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
      {/* Left: Image / Gradient Placeholder */}
      <div className="relative aspect-[4/3] md:aspect-auto bg-gradient-to-br from-gray-700 to-gray-900 min-h-[280px]">
        {cover_image ? (
          <Image
            src={`${strapiUrl}${cover_image.url}`}
            alt={cover_image.alternativeText ?? title}
            fill
            className="object-cover"
            priority
          />
        ) : null}
      </div>

      {/* Right: Content */}
      <div className="flex flex-col justify-center p-8 lg:p-12">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
            ⭐ {t('featured')}
          </span>
          {firstTag && (
            <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">
              {firstTag}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-snug">
          {title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-foreground/60 leading-relaxed line-clamp-3 mb-6">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-foreground/40 font-mono mb-6">
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

        {/* CTA */}
        <div>
          <Link
            href={`/${locale}/blog/${slug}`}
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('readMore')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
