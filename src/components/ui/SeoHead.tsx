import type { Metadata } from 'next';
import type { SeoMetadata } from '@/lib/strapi-types';

interface SeoHeadOptions {
  seo: SeoMetadata | null;
  fallbackTitle: string;
  fallbackDescription?: string;
  siteUrl?: string;
}

/**
 * Converts a Strapi SeoMetadata object into a Next.js Metadata object.
 * Use in generateMetadata() functions of page components.
 */
export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription = '',
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '',
}: SeoHeadOptions): Metadata {
  const title = seo?.meta_title ?? fallbackTitle;
  const description = seo?.meta_description ?? fallbackDescription;
  const canonical = seo?.canonical_url
    ? `${siteUrl}${seo.canonical_url}`
    : undefined;

  const ogImageUrl = seo?.og_image
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL ?? ''}${seo.og_image.url}`
    : undefined;

  return {
    title,
    description,
    robots: seo?.no_index ? { index: false, follow: false } : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}
