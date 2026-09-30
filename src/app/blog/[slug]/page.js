import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getBlogPostBySlug } from '@/lib/blog';
import { extractFaq } from '@/lib/faq';
import { stripH1 } from '@/lib/markdown';
import { SITE_NAME, OG_LOCALE, twitterSite } from '@/lib/site';
import { shouldNoindexBlogPost } from '@/lib/seo/noindex-blog-slugs';
import ClientPost from './ClientPost';

// Re-render periodically so metadata/content stay fresh (previous caching model:
// the page would otherwise be frozen at build time since it reads MongoDB directly).
export const revalidate = 3600;

const BASE = 'https://valorisvisio.top';

// Google shows ~60 chars in SERPs; keep the meta title inside that budget.
// The H1 and og/twitter titles use the SAME string, so the three always match.
function metaTitle(raw) {
  if (raw.length <= 60) return raw;
  return raw.slice(0, 57).replace(/\s+\S*$/, '').trim().replace(/[,;:-\s]+$/, '') + '…';
}

function JsonLd({ data }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}

function titleCase(slug) {
    return slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = await getBlogPostBySlug(slug);

    if (!article) {
        return {
            title: { absolute: 'Article Not Found' },
            robots: { index: false, follow: true },
        };
    }

    const seoTitle = article.seo_title || article.title;
    const description = article.seo_description || article.summary || `Read ${article.title}`;
    const noindex = shouldNoindexBlogPost(article.slug || slug, article);

    return {
        // Absolute: skip the global "| ValorisVisio" suffix — the article
        // title alone fits the 60-char SERP budget.
        title: { absolute: metaTitle(seoTitle) },
        description,
        ...(noindex ? { robots: { index: false, follow: true } } : {}),
        alternates: { canonical: `/blog/${article.slug}` },
        openGraph: {
            type: 'article',
            locale: OG_LOCALE,
            siteName: SITE_NAME,
            title: metaTitle(seoTitle),
            description,
            url: `/blog/${article.slug}`,
            images: [{ url: article.imageUrl, alt: article.title, width: 1536, height: 1024 }],
            publishedTime: article.createdAt,
            modifiedTime: article.updatedAt || article.createdAt,
        },
        twitter: {
            card: 'summary_large_image',
            ...twitterSite(),
            title: metaTitle(seoTitle),
            description,
            images: [article.imageUrl],
        },
    };
}

export default async function Post({ params }) {
    const { slug } = await params;
    const article = await getBlogPostBySlug(slug);

    if (!article) notFound();

    const seoTitle = article.seo_title || article.title;
    const faq = extractFaq(article.article_content);

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: `${BASE}/blog/${article.slug}`,
            headline: seoTitle,
            description: article.seo_description || article.summary,
            image: `${BASE}${article.imageUrl}`,
            datePublished: article.createdAt,
            dateModified: article.updatedAt || article.createdAt,
            author: { '@type': 'Person', name: article.author || 'ValorisVisio Editorial' },
            publisher: {
                '@type': 'Organization',
                name: 'ValorisVisio',
                logo: { '@type': 'ImageObject', url: `${BASE}/logo.svg` },
            },
            articleSection: article.category,
            keywords: [article.seo_keywords?.primary, ...(article.seo_keywords?.secondary || [])]
                .filter(Boolean)
                .join(', '),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
                ...(article.category_slug
                    ? [{ '@type': 'ListItem', position: 3, name: titleCase(article.category_slug), item: `${BASE}/blog/category/${article.category_slug}` }]
                    : []),
                { '@type': 'ListItem', position: article.category_slug ? 4 : 3, name: seoTitle, item: `${BASE}/blog/${article.slug}` },
            ],
        },
        ...(faq.length >= 2
            ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq }]
            : []),
    ];

    return (
        <>
            {jsonLd.map((schema, i) => (
                <JsonLd key={i} data={schema} />
            ))}
            <div className="container mx-auto px-4 pt-[100px]">
                <Breadcrumbs
                    items={[
                        { label: 'Blog', href: '/blog' },
                        ...(article.category ? [{ label: article.category }] : []),
                    ]}
                />
            </div>
            <ClientPost
                slug={slug}
                article={article}
                heading={metaTitle(seoTitle)}
                content={stripH1(article.article_content)}
            />
        </>
    );
}
