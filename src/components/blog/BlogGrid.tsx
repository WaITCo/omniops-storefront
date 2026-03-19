import type { BlogPost } from '@/lib/strapi-types';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (!posts.length) {
    return (
      <p className="font-mono text-sm text-foreground/40 uppercase tracking-wider py-12 text-center">
        Keine Beiträge gefunden
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.documentId} post={post} />
      ))}
    </div>
  );
}
