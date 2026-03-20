import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getBlogPostBySlug } from '@/lib/strapi';
import { RichText } from '@/components/ui/RichText';
import { BlogToc } from '@/components/blog/BlogToc';
import { buildMetadata } from '@/components/ui/SeoHead';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const result = await getBlogPostBySlug(slug);
    if (result) {
      return buildMetadata({
        seo: result.data.seo,
        fallbackTitle: `${result.data.title} – FORMA Blog`,
        fallbackDescription: result.data.excerpt ?? undefined,
      });
    }
  } catch {}
  return { title: 'Blog – FORMA' };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  let result = null;
  try {
    result = await getBlogPostBySlug(slug);
  } catch {}

  if (!result) notFound();

  const post = result.data;
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : null;

  const firstTag = post.category_tags?.[0] ?? null;
  const initials = post.author
    ? post.author.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        {/* Artikel */}
        <article>
          {/* Zurück-Link */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground/50 hover:text-foreground transition-colors uppercase tracking-wider mb-8"
          >
            ← {t('backToBlog')}
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-mono text-xs text-foreground/40 mb-6">
            <Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">Blog</Link>
            {firstTag && (
              <>
                <span>/</span>
                <span>{firstTag}</span>
              </>
            )}
          </nav>

          {/* Category + Title */}
          {firstTag && (
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full mb-4">
              {firstTag}
            </span>
          )}
          <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 font-mono text-xs text-foreground/40 mb-8">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/50 text-xs font-bold">
                  {initials}
                </div>
                <span>{post.author}</span>
              </div>
            )}
            {formattedDate && <><span>·</span><span>{formattedDate}</span></>}
            {post.reading_time_minutes && (
              <><span>·</span><span>{t('readTime', { minutes: post.reading_time_minutes })}</span></>
            )}
          </div>

          {/* Cover */}
          {post.cover_image ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-10">
              <Image
                src={`${strapiUrl}${post.cover_image.url}`}
                alt={post.cover_image.alternativeText ?? post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 mb-10" />
          )}

          {/* Content */}
          <div className="prose-content">
            <RichText content={post.content || post.excerpt || ''} />
          </div>

          {/* Autoren-Karte */}
          {post.author && (
            <div className="mt-16 border-t border-muted pt-10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-background font-bold text-lg flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-sm text-foreground/60 mt-1 leading-relaxed">
                    Autor bei FORMA – schreibt über digitale Produkte, Design und moderne Arbeitsweisen.
                  </p>
                  {formattedDate && post.reading_time_minutes && (
                    <p className="font-mono text-xs text-foreground/40 mt-2">
                      {formattedDate} · {t('readTime', { minutes: post.reading_time_minutes })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Sidebar – ToC */}
        <aside className="hidden lg:block">
          <BlogToc content={post.content || ''} />
        </aside>
      </div>
    </div>
  );
}
