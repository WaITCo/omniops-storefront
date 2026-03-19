import type { MetadataRoute } from 'next';
import { getBlogPosts, getCategories, getProducts } from '@/lib/strapi';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
const locales = ['de', 'en'];

function alternates(path: string) {
  return Object.fromEntries(locales.map((loc) => [loc, `${siteUrl}/${loc}${path}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages ──────────────────────────────────────────────────────────

  for (const locale of locales) {
    entries.push(
      { url: `${siteUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${siteUrl}/${locale}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${siteUrl}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    );
  }

  // ── Dynamic: Categories ───────────────────────────────────────────────────

  try {
    const catsRes = await getCategories({ fields: ['slug', 'updatedAt'], pagination: { pageSize: 100 } });
    for (const cat of catsRes.data) {
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}/shop/${cat.slug}`,
          lastModified: new Date(cat.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: { languages: alternates(`/shop/${cat.slug}`) },
        });
      }
    }
  } catch {}

  // ── Dynamic: Products ─────────────────────────────────────────────────────

  try {
    const prodsRes = await getProducts({
      fields: ['slug', 'updatedAt'],
      populate: ['categories'],
      pagination: { pageSize: 500 },
    });
    for (const prod of prodsRes.data) {
      const categorySlug = prod.categories?.[0]?.slug ?? 'uncategorized';
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}/shop/${categorySlug}/${prod.slug}`,
          lastModified: new Date(prod.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: { languages: alternates(`/shop/${categorySlug}/${prod.slug}`) },
        });
      }
    }
  } catch {}

  // ── Dynamic: Blog Posts ───────────────────────────────────────────────────

  try {
    const postsRes = await getBlogPosts({
      fields: ['slug', 'updatedAt'],
      pagination: { pageSize: 200 },
    });
    for (const post of postsRes.data) {
      for (const locale of locales) {
        entries.push({
          url: `${siteUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: { languages: alternates(`/blog/${post.slug}`) },
        });
      }
    }
  } catch {}

  return entries;
}
