import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import ClientPost from './ClientPost';

// Re-render periodically so metadata/content stay fresh (previous caching model:
// the page would otherwise be frozen at build time since it reads MongoDB directly).
export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = await getBlogPostBySlug(slug);

    if (!article) {
        return {
            title: 'Article Not Found | ValorisVisio Blog',
            robots: { index: false, follow: true },
        };
    }

    const title = article.seo_title || article.title;
    const description = article.seo_description || article.summary || `Read ${article.title}`;

    return {
        title,
        description,
        alternates: { canonical: `/blog/${article.slug}` },
        openGraph: {
            type: 'article',
            title,
            description,
            url: `/blog/${article.slug}`,
            images: [{ url: article.imageUrl, alt: article.title, width: 1536, height: 1024 }],
            publishedTime: article.createdAt,
            modifiedTime: article.updatedAt || article.createdAt,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [article.imageUrl],
        },
    };
}

function JsonLd({ data }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}

export default async function Post({ params }) {
    const { slug } = await params;
    const article = await getBlogPostBySlug(slug);

    if (!article) notFound();

    const base = 'https://valorisvisio.top';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: `${base}/blog/${article.slug}`,
        headline: article.seo_title || article.title,
        description: article.seo_description || article.summary,
        image: `${base}${article.imageUrl}`,
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        author: { '@type': 'Person', name: article.author || 'ValorisVisio Editorial' },
        publisher: {
            '@type': 'Organization',
            name: 'ValorisVisio',
            logo: { '@type': 'ImageObject', url: `${base}/logo.svg` },
        },
        articleSection: article.category,
        keywords: [article.seo_keywords?.primary, ...(article.seo_keywords?.secondary || [])]
            .filter(Boolean)
            .join(', '),
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <ClientPost slug={slug} article={article} />
        </>
    );
}
