import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/strapi';
import type { BlogPost } from '@/lib/strapi-types';
import { BlogGrid } from '@/components/blog/BlogGrid';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog – FORMA',
  description: 'Einblicke, Tutorials und Neuigkeiten aus dem FORMA Universum.',
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    const response = await getBlogPosts({ pagination: { pageSize: 24 } });
    posts = response.data;
  } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-5xl text-foreground mb-12">Blog</h1>
      <BlogGrid posts={posts} />
    </div>
  );
}
