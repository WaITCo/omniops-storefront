import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/strapi-types';

interface BlogCardProps {
  post: BlogPost;
  locale?: string;
}

export function BlogCard({ post, locale = 'de' }: BlogCardProps) {
  const { title, slug, excerpt, cover_image, author, reading_time_minutes, category_tags, publishedAt } = post;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'de-DE', { dateStyle: 'medium' }).format(
        new Date(publishedAt)
      )
    : null;

  const primaryCategory = category_tags?.[0] ?? null;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      {/* Cover */}
      {cover_image ? (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={`${strapiUrl}${cover_image.url}`}
            alt={cover_image.alternativeText ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {primaryCategory && (
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {primaryCategory}
          </span>
        )}
        <h3 className="font-bold text-gray-900 mt-1.5 mb-2 leading-snug group-hover:text-gray-700 transition-colors line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{excerpt}</p>
        )}
        <div className="flex items-center gap-2.5 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {author && <>{author}</>}
            {author && (formattedDate || reading_time_minutes) && ' · '}
            {formattedDate && <>{formattedDate}</>}
            {formattedDate && reading_time_minutes && ' · '}
            {reading_time_minutes && <>{reading_time_minutes} Min.</>}
          </span>
        </div>
      </div>
    </Link>
  );
}
