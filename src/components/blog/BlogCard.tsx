import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/strapi-types';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { title, slug, excerpt, cover_image, author, reading_time_minutes, publishedAt } =
    post;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(publishedAt))
    : null;

  return (
    <Link href={`/blog/${slug}`} className="group block">
      {cover_image && (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted mb-5">
          <Image
            src={`${strapiUrl}${cover_image.url}`}
            alt={cover_image.alternativeText ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center gap-4 mb-3">
        {formattedDate && (
          <span className="font-mono text-xs text-foreground/50">{formattedDate}</span>
        )}
        {reading_time_minutes && (
          <span className="font-mono text-xs text-foreground/50">
            {reading_time_minutes} Min. Lesezeit
          </span>
        )}
      </div>

      <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors mb-3 leading-snug">
        {title}
      </h3>

      {excerpt && (
        <p className="font-sans text-foreground/60 line-clamp-3 leading-relaxed">{excerpt}</p>
      )}

      {author && (
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/40 mt-4">
          {author}
        </p>
      )}
    </Link>
  );
}
