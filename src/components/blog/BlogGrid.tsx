import type { BlogPost } from '@/lib/strapi-types';
import { BlogCard } from './BlogCard';
import { getTranslations } from 'next-intl/server';

interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
}

export async function BlogGrid({ posts, locale }: BlogGridProps) {
  const t = await getTranslations({ locale, namespace: 'blog' });

  if (!posts.length) {
    return (
      <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider py-12 text-center">
        {t('noPostsFound')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.documentId} post={post} locale={locale} />
      ))}
    </div>
  );
}
