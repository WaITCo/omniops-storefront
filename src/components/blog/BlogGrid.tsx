import type { BlogPost } from '@/lib/strapi-types';
import { BlogCard } from './BlogCard';
import { getTranslations } from 'next-intl/server';

interface BlogGridProps {
  posts: BlogPost[];
  locale?: string;
}

export async function BlogGrid({ posts, locale = 'de' }: BlogGridProps) {
  const t = await getTranslations('blog');

  if (!posts.length) {
    return (
      <p className="font-mono text-sm text-gray-400 uppercase tracking-wider py-12 text-center">
        {t('noPostsFound')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.documentId} post={post} locale={locale} />
      ))}
    </div>
  );
}
