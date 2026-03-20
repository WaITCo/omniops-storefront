import type {
  StrapiListResponse,
  StrapiSingleResponse,
  StrapiQueryParams,
  Product,
  Category,
  BlogPost,
  LandingPage,
  Navigation,
  GlobalSetting,
} from './strapi-types';

function buildQueryString(params: StrapiQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.pagination) {
    const p = params.pagination;
    if (p.page !== undefined) searchParams.set('pagination[page]', String(p.page));
    if (p.pageSize !== undefined) searchParams.set('pagination[pageSize]', String(p.pageSize));
    if (p.start !== undefined) searchParams.set('pagination[start]', String(p.start));
    if (p.limit !== undefined) searchParams.set('pagination[limit]', String(p.limit));
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    sorts.forEach((s, i) => searchParams.set(`sort[${i}]`, s));
  }

  if (params.fields) {
    params.fields.forEach((f, i) => searchParams.set(`fields[${i}]`, f));
  }

  if (params.locale) {
    searchParams.set('locale', params.locale);
  }

  if (params.populate) {
    if (typeof params.populate === 'string') {
      searchParams.set('populate', params.populate);
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((p, i) => searchParams.set(`populate[${i}]`, p));
    }
  }

  if (params.filters) {
    const flattenFilters = (obj: Record<string, unknown>, prefix = 'filters') => {
      for (const [key, value] of Object.entries(obj)) {
        const paramKey = `${prefix}[${key}]`;
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          flattenFilters(value as Record<string, unknown>, paramKey);
        } else {
          searchParams.set(paramKey, String(value));
        }
      }
    };
    flattenFilters(params.filters);
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

async function fetchStrapi<T>(
  path: string,
  params: StrapiQueryParams = {},
  options: RequestInit = {}
): Promise<T> {
  // STRAPI_INTERNAL_URL overrides for server-side fetches inside Docker containers
  // (host.docker.internal vs localhost for browser image URLs)
  const baseUrl = process.env.STRAPI_INTERNAL_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
  const queryString = buildQueryString(params);
  const url = `${baseUrl}/api${path}${queryString}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // STRAPI_API_TOKEN ist Server-only – kein NEXT_PUBLIC_ Prefix
  // Guard verhindert, dass der Token im Browser-Bundle landet
  if (typeof window === 'undefined' && process.env.STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText} – ${url}`
    );
  }

  return response.json() as Promise<T>;
}

// ============================================================
// Products
// ============================================================

export async function getProducts(
  params: StrapiQueryParams = {}
): Promise<StrapiListResponse<Product>> {
  return fetchStrapi<StrapiListResponse<Product>>('/products', {
    populate: ['images', 'categories', 'variants', 'options', 'seo', 'instructorAvatar'],
    ...params,
  });
}

export async function getProductBySlug(
  slug: string
): Promise<StrapiSingleResponse<Product> | null> {
  const response = await fetchStrapi<StrapiListResponse<Product>>('/products', {
    filters: { slug: { $eq: slug } },
    populate: [
      'images', 'categories', 'variants', 'variants.image',
      'options', 'options.values', 'seo',
      'instructorAvatar', 'curriculum'
    ],
  });
  if (!response.data.length) return null;
  return { data: response.data[0], meta: response.meta };
}

// ============================================================
// Categories
// ============================================================

export async function getCategories(
  params: StrapiQueryParams = {}
): Promise<StrapiListResponse<Category>> {
  return fetchStrapi<StrapiListResponse<Category>>('/categories', {
    populate: ['image', 'parent', 'seo'],
    ...params,
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<StrapiSingleResponse<Category> | null> {
  const response = await fetchStrapi<StrapiListResponse<Category>>('/categories', {
    filters: { slug: { $eq: slug } },
    populate: ['image', 'parent', 'children', 'seo'],
  });
  if (!response.data.length) return null;
  return { data: response.data[0], meta: response.meta };
}

// ============================================================
// Blog Posts
// ============================================================

export async function getBlogPosts(
  params: StrapiQueryParams = {}
): Promise<StrapiListResponse<BlogPost>> {
  return fetchStrapi<StrapiListResponse<BlogPost>>('/blog-posts', {
    populate: ['cover_image', 'seo'],
    sort: ['publishedAt:desc'],
    ...params,
  });
}

export async function getBlogPostBySlug(
  slug: string
): Promise<StrapiSingleResponse<BlogPost> | null> {
  const response = await fetchStrapi<StrapiListResponse<BlogPost>>('/blog-posts', {
    filters: { slug: { $eq: slug } },
    populate: ['cover_image', 'seo'],
  });
  if (!response.data.length) return null;
  return { data: response.data[0], meta: response.meta };
}

// ============================================================
// Landing Page
// ============================================================

export async function getLandingPage(
  slug: string
): Promise<StrapiSingleResponse<LandingPage> | null> {
  const response = await fetchStrapi<StrapiListResponse<LandingPage>>('/landing-pages', {
    filters: { slug: { $eq: slug } },
    populate: {
      sections: { populate: '*' },
      seo: { populate: ['og_image'] },
    },
  });
  if (!response.data.length) return null;
  return { data: response.data[0], meta: response.meta };
}

// ============================================================
// Navigation
// ============================================================

export async function getNavigation(
  identifier: string
): Promise<StrapiSingleResponse<Navigation> | null> {
  const response = await fetchStrapi<StrapiListResponse<Navigation>>('/navigations', {
    filters: { identifier: { $eq: identifier } },
    populate: { items: { populate: ['children'] } },
  });
  if (!response.data.length) return null;
  return { data: response.data[0], meta: response.meta };
}

// ============================================================
// Global Settings
// ============================================================

export async function getGlobalSettings(): Promise<StrapiSingleResponse<GlobalSetting>> {
  return fetchStrapi<StrapiSingleResponse<GlobalSetting>>('/global-setting', {
    populate: '*',
  });
}
