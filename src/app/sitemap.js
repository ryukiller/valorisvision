import { getBlogPosts, getCategories } from '@/lib/blog';
import { getLearnSitemapEntries } from '@/lib/learn';
import { shouldNoindexBlogPost } from '@/lib/seo/noindex-blog-slugs';

const baseUrl = 'https://valorisvisio.top';

// Special route handlers are cached by default — revalidate periodically so
// newly published articles appear in the sitemap.
export const revalidate = 3600;

function toArticleUrl(a) {
  return {
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: a.updatedAt || a.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  };
}

export default async function sitemap() {
  // Omit /privacy, /cookies (noindex intent) and typo utility page from sitemap.
  const staticPages = [
    { url: `${baseUrl}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.8 },
  ];

  const learnPages = getLearnSitemapEntries();

  let articleUrls = [];
  let moreUrls = [];
  let categoryUrls = [];

  try {
    // Large limit: blogs are small, one pass is fine
    const { data: articles, pagination } = await getBlogPosts({ page: 1, limit: 500 });

    articleUrls = articles
      .filter((a) => !shouldNoindexBlogPost(a.slug, a))
      .map(toArticleUrl);

    // Remaining articles beyond the first 500 (unlikely, but keep the sitemap complete)
    if (pagination.totalPages > 1) {
      const rest = await Promise.all(
        Array.from({ length: pagination.totalPages - 1 }, (_, i) =>
          getBlogPosts({ page: i + 2, limit: 500 })
        )
      );
      moreUrls = rest.flatMap(({ data }) =>
        data
          .filter((a) => !shouldNoindexBlogPost(a.slug, a))
          .map(toArticleUrl)
      );
    }

    categoryUrls = (await getCategories()).map((c) => ({
      url: `${baseUrl}/blog/category/${c.slug}`,
      changeFrequency: 'daily',
      priority: 0.5,
    }));
  } catch (err) {
    // Build/preview without MongoDB should still emit static + /learn URLs.
    console.warn('[sitemap] Skipping blog URLs:', err?.message || err);
  }

  return [...staticPages, ...learnPages, ...articleUrls, ...moreUrls, ...categoryUrls].map((p) => ({
    ...p,
    lastModified: p.lastModified || new Date(),
  }));
}
