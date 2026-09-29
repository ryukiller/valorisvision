import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleGrid from '@/components/ArticleGrid';
import { getBlogPosts } from '@/lib/blog';

const BASE = 'https://valorisvisio.top';
const PER_PAGE = 30;

function titleCase(slug) {
    return slug
        .split('-')
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(' ');
}

export async function generateMetadata({ params, searchParams }) {
    const { slug } = await params;
    const sp = await searchParams;
    const name = titleCase(slug);
    const page = Math.max(1, parseInt(sp.page) || 1);

    return {
        title: page === 1
            ? `${name} Articles, News & Analysis`
            : `${name} Articles (Page ${page})`,
        description: `The latest ${name} articles on ValorisVisio — market analysis, trends, and expert insights on ${name}.`,
        alternates: {
            canonical: page === 1
                ? `${BASE}/blog/category/${slug}`
                : `${BASE}/blog/category/${slug}?page=${page}`,
        },
        robots: { index: true, follow: true },
        openGraph: {
            title: `${name} Articles, News & Analysis | ValorisVisio`,
            description: `The latest ${name} articles on ValorisVisio — market analysis, trends, and expert insights.`,
        },
    };
}

export default async function Category({ params, searchParams }) {
    const { slug } = await params;
    const sp = await searchParams;
    const page = Math.max(1, parseInt(sp.page) || 1);
    const name = titleCase(slug);

    const { data: articles, pagination } = await getBlogPosts({ page, limit: PER_PAGE, category_slug: slug });
    if (articles.length === 0) notFound();

    const pageParam = (p) => ({ page: p > 1 ? String(p) : undefined });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 pt-[100px]">
                <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: name }]} />
                <p className="term-label mb-3">{'// channel: '}{slug}</p>
                <h1 className="glitch font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground" data-text={`RECENT ARTICLES IN ${slug.toUpperCase()}`}>
                    RECENT ARTICLES IN <span className="text-neon-cyan">{slug.toUpperCase()}</span>
                </h1>
            </div>
            <ArticleGrid articles={articles} />
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                    <Link
                        href={page > 1 ? { query: { page: String(page - 1) } } : { query: {} }}
                        className={`cyber-cut-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan transition-all ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        ‹ Prev
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground tracking-widest">
                        [ {page} / {pagination.totalPages} ]
                    </span>
                    <Link
                        href={{ query: pageParam(page + 1) }}
                        className={`cyber-cut-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan transition-all ${page >= pagination.totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        Next ›
                    </Link>
                </div>
            )}
        </div>
    );
}
