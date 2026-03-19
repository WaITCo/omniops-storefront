import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/strapi';
import { RichText } from '@/components/ui/RichText';
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
  const { slug } = await params;
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  let result = null;
  try {
    result = await getBlogPostBySlug(slug);
  } catch {}

  if (!result) notFound();

  const post = result.data;
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }).format(
        new Date(post.publishedAt)
      )
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground/50 mb-10">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-foreground">{post.title}</span>
      </nav>

      {/* Cover */}
      {post.cover_image && (
        <div className="relative aspect-[16/9] overflow-hidden mb-10">
          <Image
            src={`${strapiUrl}${post.cover_image.url}`}
            alt={post.cover_image.alternativeText ?? post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 mb-6">
        {formattedDate && (
          <span className="font-mono text-xs text-foreground/50">{formattedDate}</span>
        )}
        {post.reading_time_minutes && (
          <span className="font-mono text-xs text-foreground/50">
            {post.reading_time_minutes} Min. Lesezeit
          </span>
        )}
        {post.author && (
          <span className="font-mono text-xs text-foreground/50">{post.author}</span>
        )}
      </div>

      <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-10">
        {post.title}
      </h1>

      <RichText content={post.content} />
    </article>
  );
}
