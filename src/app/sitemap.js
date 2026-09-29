import { getBlogPosts, getCategories } from '@/lib/blog';

const baseUrl = 'https://valorisvisio.top';

// Special route handlers are cached by default — revalidate periodically so
// newly published articles appear in the sitemap.
export const revalidate = 3600;

export default async function sitemap() {
  const staticPages = [
    { url: `${baseUrl}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/cookies`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/highlithed-word-counter`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Large limit: blogs are small, one pass is fine
  const { data: articles, pagination } = await getBlogPosts({ page: 1, limit: 500 });

  const articleUrls = articles.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: a.updatedAt || a.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Remaining articles beyond the first 500 (unlikely, but keep the sitemap complete)
  let moreUrls = [];
  if (pagination.totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: pagination.totalPages - 1 }, (_, i) =>
        getBlogPosts({ page: i + 2, limit: 500 })
      )
    );
    moreUrls = rest.flatMap(
      ({ data }) =>
        data.map((a) => ({
          url: `${baseUrl}/blog/${a.slug}`,
          lastModified: a.updatedAt || a.createdAt,
          changeFrequency: 'weekly',
          priority: 0.8,
        }))
    );
  }

  const categoryUrls = (await getCategories()).map((c) => ({
    url: `${baseUrl}/blog/category/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.5,
  }));

  return [...staticPages, ...articleUrls, ...moreUrls, ...categoryUrls].map((p) => ({
    ...p,
    lastModified: p.lastModified || new Date(),
  }));
}
