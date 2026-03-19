// ============================================================
// Strapi 5 Base Types
// ============================================================

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

// ============================================================
// SEO
// ============================================================

export interface SeoMetadata {
  id: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: StrapiImage | null;
  canonical_url: string | null;
  no_index: boolean;
}

// ============================================================
// Product
// ============================================================

export interface ProductOptionValue {
  id: number;
  documentId: string;
  value: string;
  position: number;
}

export interface ProductOption {
  id: number;
  documentId: string;
  name: string;
  position: number;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: number;
  documentId: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  selected_options: Record<string, string>;
  image: StrapiImage | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  images: StrapiImage[];
  categories: Category[];
  variants: ProductVariant[];
  options: ProductOption[];
  seo: SeoMetadata | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// ============================================================
// Category
// ============================================================

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  image: StrapiImage | null;
  parent: Category | null;
  children: Category[];
  products: Product[];
  seo: SeoMetadata | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Blog Post
// ============================================================

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: StrapiImage | null;
  author: string | null;
  reading_time_minutes: number | null;
  category_tags: string[];
  seo: SeoMetadata | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// ============================================================
// Landing Page Sections
// ============================================================

export interface HeroBannerSection {
  __component: 'sections.hero-banner';
  id: number;
  headline: string;
  subheadline: string | null;
  cta_text: string | null;
  cta_url: string | null;
  background_image: StrapiImage | null;
}

export interface ProductPlacementSection {
  __component: 'sections.product-placement';
  id: number;
  title: string;
  products: Product[];
}

export interface CtaBlockSection {
  __component: 'sections.cta-block';
  id: number;
  headline: string;
  body: string | null;
  cta_text: string;
  cta_url: string;
}

export interface TextBlockSection {
  __component: 'sections.text-block';
  id: number;
  content: string;
}

export interface ImageTextSection {
  __component: 'sections.image-text';
  id: number;
  image: StrapiImage;
  headline: string;
  body: string;
  image_position: 'left' | 'right';
}

export interface ImageGallerySection {
  __component: 'sections.image-gallery';
  id: number;
  images: StrapiImage[];
}

export interface TestimonialsSection {
  __component: 'sections.testimonials';
  id: number;
  testimonials: Array<{
    id: number;
    author: string;
    quote: string;
    role: string | null;
  }>;
}

export interface FaqSection {
  __component: 'sections.faq';
  id: number;
  items: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

export type LandingPageSection =
  | HeroBannerSection
  | ProductPlacementSection
  | CtaBlockSection
  | TextBlockSection
  | ImageTextSection
  | ImageGallerySection
  | TestimonialsSection
  | FaqSection;

// ============================================================
// Landing Page
// ============================================================

export interface LandingPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  sections: LandingPageSection[];
  seo: SeoMetadata | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// ============================================================
// Navigation
// ============================================================

export interface NavItem {
  id: number;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  children?: NavItem[];
}

export interface Navigation {
  id: number;
  documentId: string;
  name: string;
  identifier: string;
  items: NavItem[];
}

// ============================================================
// Global Settings
// ============================================================

export interface GlobalSetting {
  id: number;
  documentId: string;
  shop_name: string;
  currency: string;
}

// ============================================================
// Query Params
// ============================================================

export interface StrapiQueryParams {
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  sort?: string | string[];
  fields?: string[];
  locale?: string;
}
