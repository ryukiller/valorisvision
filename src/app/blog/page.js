import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleGrid from '@/components/ArticleGrid';
import { getBlogPosts } from '@/lib/blog';

const BASE = 'https://valorisvisio.top';
const PER_PAGE = 30;

export async function generateMetadata({ searchParams }) {
    const sp = await searchParams;
    const page = Math.max(1, parseInt(sp.page) || 1);

    return {
        title: page === 1
            ? 'Crypto News, Market Trends & Analysis'
            : `Crypto News & Analysis (Page ${page})`,
        description: 'Stay informed with our expert analysis, market trends, and in-depth articles on Bitcoin, Ethereum, and emerging cryptocurrencies. Your go-to source for crypto knowledge.',
        alternates: {
            canonical: page === 1 ? `${BASE}/blog` : `${BASE}/blog?page=${page}`,
        },
        openGraph: {
            title: 'Crypto Insights: Latest News and Analysis on Cryptocurrencies',
            description: 'Expert analysis, market trends, and in-depth articles on Bitcoin, Ethereum, and emerging cryptocurrencies.',
        },
    };
}

export default async function Blog({ searchParams }) {
    const sp = await searchParams;
    const page = Math.max(1, parseInt(sp.page) || 1);

    const { data: articles, pagination } = await getBlogPosts({ page, limit: PER_PAGE });
    if (page > 1 && articles.length === 0) notFound();

    const pageParam = (p) => ({ page: p > 1 ? String(p) : undefined });

    return (
        <div className="container mx-auto px-4 py-8 main-content">
            <div className="pt-[100px] mb-10">
                <Breadcrumbs items={[{ label: 'Blog' }]} />
                <p className="term-label mb-3">{'// grid_transmissions'}</p>
                <h1 className="glitch font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4" data-text="CRYPTO INSIGHTS & ANALYSIS">
                    CRYPTO <span className="text-neon-cyan">INSIGHTS</span> & <span className="text-neon-magenta">ANALYSIS</span>
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
                    Signal from the noise — the latest cryptocurrency news, market trends, and expert analysis to make sharper investment decisions.
                </p>
            </div>
            <ArticleGrid articles={articles} />
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                    <Link
                        href={page > 1 ? { pathname: '/blog', query: { page: String(page - 1) } } : '/blog'}
                        aria-disabled={page === 1}
                        className={`cyber-cut-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan transition-all ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        ‹ Prev
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground tracking-widest">
                        [ {page} / {pagination.totalPages} ]
                    </span>
                    <Link
                        href={{ pathname: '/blog', query: pageParam(page + 1) }}
                        aria-disabled={page >= pagination.totalPages}
                        className={`cyber-cut-sm border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan transition-all ${page >= pagination.totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        Next ›
                    </Link>
                </div>
            )}
        </div>
    );
}
