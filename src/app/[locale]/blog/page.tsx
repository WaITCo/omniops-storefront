import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getBlogPosts } from '@/lib/strapi';
import type { BlogPost } from '@/lib/strapi-types';
import { BlogFeaturedPost } from '@/components/blog/BlogFeaturedPost';
import { BlogCategoryFilter } from '@/components/blog/BlogCategoryFilter';
import { BlogGrid } from '@/components/blog/BlogGrid';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog – FORMA',
  description: 'Einblicke, Tutorials und Neuigkeiten aus dem FORMA Universum.',
};

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kategorie?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { kategorie } = await searchParams;

  const t = await getTranslations('blog');

  let posts: BlogPost[] = [];
  try {
    const response = await getBlogPosts({ pagination: { pageSize: 24 } });
    posts = response.data;
  } catch {
    // Silently handle fetch errors – show empty state
  }

  // Extract unique categories from all posts
  const allCategories = Array.from(
    new Set(posts.flatMap((p) => p.category_tags ?? []))
  ).sort();

  // Active category from URL param (empty string = all)
  const activeCategory = kategorie && allCategories.includes(kategorie) ? kategorie : '';

  // Featured post: first with featured === true, fallback to first post
  const featuredPost = posts.find((p) => p.featured) ?? posts[0] ?? null;

  // Grid posts: filter by active category, exclude featured
  const gridPosts = posts
    .filter((p) => p.documentId !== featuredPost?.documentId)
    .filter((p) =>
      activeCategory === '' ? true : (p.category_tags ?? []).includes(activeCategory)
    );

  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl text-gray-900 tracking-tight mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-500">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <BlogCategoryFilter categories={allCategories} activeCategory={activeCategory} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && activeCategory === '' && (
          <BlogFeaturedPost post={featuredPost} locale={locale} />
        )}

        {/* Post Grid */}
        <BlogGrid posts={gridPosts} locale={locale} />
      </div>
    </>
  );
}
