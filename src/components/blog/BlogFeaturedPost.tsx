import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { BlogPost } from '@/lib/strapi-types';

interface BlogFeaturedPostProps {
  post: BlogPost;
  locale?: string;
}

export async function BlogFeaturedPost({ post, locale = 'de' }: BlogFeaturedPostProps) {
  const t = await getTranslations('blog');
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const { title, slug, excerpt, cover_image, author, reading_time_minutes, category_tags, publishedAt } = post;

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'de-DE', { dateStyle: 'medium' }).format(
        new Date(publishedAt)
      )
    : null;

  const primaryCategory = category_tags?.[0] ?? null;

  return (
    <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-gray-100 overflow-hidden mb-14 group hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
      {/* Image / Gradient */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 min-h-64 lg:min-h-auto relative flex items-center justify-center overflow-hidden">
        {cover_image ? (
          <Image
            src={`${strapiUrl}${cover_image.url}`}
            alt={cover_image.alternativeText ?? title}
            fill
            className="object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 border-2 border-white rounded-full" />
              <div className="absolute bottom-8 right-8 w-48 h-48 border border-white rounded-xl rotate-12" />
            </div>
            <div className="relative text-center px-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </>
        )}
        {/* Featured badge */}
        <div className="absolute top-4 left-4 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
          ★ {t('featured')}
        </div>
      </div>

      {/* Text */}
      <div className="p-8 flex flex-col justify-center">
        {primaryCategory && (
          <span className="inline-flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-100 px-3 py-1.5 rounded-full w-fit mb-4">
            {primaryCategory}
          </span>
        )}
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3 group-hover:text-gray-700 transition-colors">
          {title}
        </h2>
        {excerpt && (
          <p className="text-gray-500 leading-relaxed mb-6">{excerpt}</p>
        )}
        <div className="flex items-center gap-4">
          <div>
            {author && (
              <p className="text-sm font-semibold text-gray-900">{author}</p>
            )}
            <p className="text-xs text-gray-500">
              {formattedDate && <>{formattedDate}</>}
              {formattedDate && reading_time_minutes && ' · '}
              {reading_time_minutes && (
                <>{t('readTime', { minutes: reading_time_minutes })}</>
              )}
            </p>
          </div>
          <Link
            href={`/blog/${slug}`}
            className="ml-auto inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('readMore')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
