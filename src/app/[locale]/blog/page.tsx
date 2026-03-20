import { getBlogPosts } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';
import { BlogFeaturedPost } from '@/components/blog/BlogFeaturedPost';
import { BlogCategoryFilter } from '@/components/blog/BlogCategoryFilter';
import { BlogGrid } from '@/components/blog/BlogGrid';

export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategorie?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { kategorie } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const { data: posts } = await getBlogPosts({ sort: ['publishedAt:desc'] });

  // Alle einzigartigen Tags sammeln
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.category_tags ?? []))
  ).sort();

  // Gefilterte Posts
  const filtered = kategorie
    ? posts.filter((p) => p.category_tags?.includes(kategorie))
    : posts;

  // Featured Post (erster mit featured=true, sonst erster überhaupt)
  const featuredPost = posts.find((p) => p.featured) ?? posts[0] ?? null;

  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-3">{t('title')}</h1>
          <p className="text-lg text-foreground/60">{t('subtitle')}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Featured Post – nur ohne aktiven Filter */}
        {!kategorie && featuredPost && (
          <BlogFeaturedPost post={featuredPost} locale={locale} />
        )}

        {/* Kategorie-Tabs */}
        <BlogCategoryFilter tags={allTags} activeTag={kategorie ?? null} />

        {/* Post-Grid */}
        <BlogGrid posts={filtered} locale={locale} />
      </div>
    </main>
  );
}
