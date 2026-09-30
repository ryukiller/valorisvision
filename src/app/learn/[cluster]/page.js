import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  getLearnClusterBySlug,
  getLearnClusters,
  getLiveArticlesForCluster,
} from '@/lib/learn';
import { SITE_NAME, OG_LOCALE } from '@/lib/site';

const BASE = 'https://valorisvisio.top';

export function generateStaticParams() {
  return getLearnClusters().map((c) => ({ cluster: c.slug }));
}

export async function generateMetadata({ params }) {
  const { cluster: slug } = await params;
  const cluster = getLearnClusterBySlug(slug);
  if (!cluster) {
    return { title: { absolute: 'Learn Hub Not Found' }, robots: { index: false, follow: true } };
  }

  return {
    title: cluster.metaTitle,
    description: cluster.metaDescription,
    alternates: { canonical: `${BASE}/learn/${cluster.slug}` },
    openGraph: {
      locale: OG_LOCALE,
      siteName: SITE_NAME,
      title: cluster.metaTitle,
      description: cluster.metaDescription,
      url: `${BASE}/learn/${cluster.slug}`,
    },
  };
}

export default async function LearnClusterPage({ params }) {
  const { cluster: slug } = await params;
  const cluster = getLearnClusterBySlug(slug);
  if (!cluster) notFound();

  const isStub = cluster.depth === 'stub';
  const liveArticles = getLiveArticlesForCluster(cluster.slug);
  const plannedOnly = cluster.plannedArticles.filter((a) => a.status !== 'live');

  return (
    <div className="container mx-auto px-4 py-8 main-content">
      <div className="pt-[100px] mb-10">
        <Breadcrumbs
          items={[
            { label: 'Learn', href: '/learn' },
            { label: cluster.shortTitle },
          ]}
        />
        <p className="term-label mb-3">
          {'// cluster_'}
          {cluster.id.toLowerCase()}
          {isStub ? ' · stub' : ''}
        </p>
        <h1
          className="glitch font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4"
          data-text={cluster.title.toUpperCase()}
        >
          {cluster.title}
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neon-magenta mb-4">
          Primary keyword: {cluster.primaryKeyword}
        </p>
        <p className="text-base text-muted-foreground max-w-3xl">{cluster.intro}</p>
      </div>

      {!isStub && (
        <section className="mb-12 max-w-3xl" aria-labelledby="hub-overview">
          <h2 id="hub-overview" className="font-display text-xl font-bold tracking-tight mb-4">
            What you&apos;ll find here
          </h2>
          <p className="text-muted-foreground mb-4">
            This hub is the IA landing page for the{' '}
            <strong className="text-foreground">{cluster.primaryKeyword}</strong> topic cluster.
            Live guides appear below; remaining pillars stay planned until later SEO weeks.
            Daily news stays on{' '}
            <Link href="/blog" className="text-neon-cyan hover:underline">
              /blog
            </Link>
            .
          </p>
          {cluster.id === 'A' && (
            <p className="text-muted-foreground">
              Ready to run a scenario now?{' '}
              <Link href="/" className="text-neon-cyan hover:underline">
                Open the ValorisVisio crypto profit calculator
              </Link>
              . Or read the guide:{' '}
              <Link
                href="/learn/crypto-profit-calculator/market-cap-scenarios-explained"
                className="text-neon-cyan hover:underline"
              >
                How to use a crypto market cap scenario calculator
              </Link>
              .
            </p>
          )}
        </section>
      )}

      {isStub && (
        <section className="mb-12 max-w-3xl border border-line/70 p-6 cyber-cut-sm" aria-labelledby="stub-note">
          <h2 id="stub-note" className="font-display text-lg font-bold tracking-tight mb-3">
            Hub stub
          </h2>
          <p className="text-sm text-muted-foreground">
            Lightweight placeholder so the URL and sitemap exist. Evergreen copy and supporting
            pages for this cluster ship in a later SEO week — no migration from /blog yet.
          </p>
        </section>
      )}

      {liveArticles.length > 0 && (
        <section className="mb-12 max-w-3xl" aria-labelledby="live-articles">
          <h2 id="live-articles" className="font-display text-xl font-bold tracking-tight mb-4">
            Guides in this cluster
          </h2>
          <ul className="space-y-3">
            {liveArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/learn/${article.clusterSlug}/${article.slug}`}
                  className="block border border-neon-cyan/40 px-4 py-3 cyber-cut-sm hover:border-neon-cyan/70 transition-colors"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon-cyan mb-1">
                    {article.contentType} · live
                  </p>
                  <p className="text-foreground font-medium">{article.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{article.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {plannedOnly.length > 0 && (
        <section className="mb-12 max-w-3xl" aria-labelledby="planned-articles">
          <h2 id="planned-articles" className="font-display text-xl font-bold tracking-tight mb-4">
            Planned articles
          </h2>
          <ul className="space-y-3">
            {plannedOnly.map((article) => (
              <li
                key={article.slugHint}
                className="border border-line/60 px-4 py-3 cyber-cut-sm opacity-80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      {article.contentType} · placeholder
                    </p>
                    <p className="text-foreground font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      KW: {article.primaryKeyword}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground shrink-0">
                    /learn/{cluster.slug}/{article.slugHint}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isStub && cluster.secondaryKeywords?.length > 0 && (
        <section className="mb-12 max-w-3xl" aria-labelledby="secondary-kws">
          <h2 id="secondary-kws" className="font-display text-lg font-bold tracking-tight mb-3">
            Related search themes
          </h2>
          <ul className="flex flex-wrap gap-2">
            {cluster.secondaryKeywords.map((kw) => (
              <li
                key={kw}
                className="font-mono text-[11px] tracking-wide border border-line px-3 py-1.5 text-muted-foreground"
              >
                {kw}
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.2em]">
        <Link href="/learn" className="text-muted-foreground hover:text-neon-cyan transition-colors">
          ‹ All Learn hubs
        </Link>
        <Link href="/blog" className="text-muted-foreground hover:text-neon-cyan transition-colors">
          Blog news ›
        </Link>
      </nav>
    </div>
  );
}
