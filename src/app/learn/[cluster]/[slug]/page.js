import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Breadcrumbs from '@/components/Breadcrumbs';
import { extractFaq } from '@/lib/faq';
import {
  getLearnArticle,
  getLearnArticles,
  getLearnClusterBySlug,
} from '@/lib/learn';
import { SITE_NAME, OG_LOCALE, twitterSite } from '@/lib/site';

const BASE = 'https://valorisvisio.top';

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function generateStaticParams() {
  return getLearnArticles().map((a) => ({
    cluster: a.clusterSlug,
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { cluster: clusterSlug, slug } = await params;
  const article = getLearnArticle(clusterSlug, slug);
  if (!article) {
    return { title: { absolute: 'Guide Not Found' }, robots: { index: false, follow: true } };
  }

  const canonical = `${BASE}/learn/${article.clusterSlug}/${article.slug}`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: OG_LOCALE,
      siteName: SITE_NAME,
      title: article.metaTitle,
      description: article.metaDescription,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      ...twitterSite(),
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function LearnArticlePage({ params }) {
  const { cluster: clusterSlug, slug } = await params;
  const article = getLearnArticle(clusterSlug, slug);
  if (!article) notFound();

  const cluster = getLearnClusterBySlug(article.clusterSlug);
  const faq = extractFaq(article.markdown);
  const canonical = `${BASE}/learn/${article.clusterSlug}/${article.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: canonical,
      headline: article.title,
      description: article.metaDescription,
      author: { '@type': 'Organization', name: SITE_NAME },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: `${BASE}/logo.svg` },
      },
      keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE}/learn` },
        {
          '@type': 'ListItem',
          position: 3,
          name: cluster?.shortTitle || article.clusterSlug,
          item: `${BASE}/learn/${article.clusterSlug}`,
        },
        { '@type': 'ListItem', position: 4, name: article.title, item: canonical },
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
      <div className="container mx-auto px-4 py-8 main-content">
        <div className="pt-[100px] mb-10">
          <Breadcrumbs
            items={[
              { label: 'Learn', href: '/learn' },
              {
                label: cluster?.shortTitle || 'Cluster',
                href: `/learn/${article.clusterSlug}`,
              },
              { label: article.shortTitle },
            ]}
          />
          <p className="term-label mb-3">
            {'// '}
            {article.contentType}
            {' · cluster_'}
            {(cluster?.id || 'a').toLowerCase()}
          </p>
          <h1
            className="glitch font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4"
            data-text={article.title.toUpperCase()}
          >
            {article.title}
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neon-magenta mb-4">
            Primary keyword: {article.primaryKeyword}
          </p>
          <p className="text-base text-muted-foreground max-w-3xl">{article.summary}</p>
        </div>

        <article className="prose-cyber cyber-frame border border-line bg-panel/40 p-6 md:p-10 max-w-3xl mb-12">
          <ReactMarkdown>{article.markdown}</ReactMarkdown>
        </article>

        {article.clusterSlug === 'crypto-profit-calculator' ? (
          <aside className="max-w-3xl mb-12 border border-neon-cyan/40 p-6 cyber-cut-sm bg-panel/50">
            <p className="term-label mb-3">{'// run_scenario'}</p>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              Try it on ValorisVisio
            </h2>
            <p className="text-muted-foreground mb-5">
              Open the free crypto scenario calculator and model a market-cap what-if with live data.
            </p>
            <Link
              href="/#calculator"
              className="inline-block cyber-cut bg-neon-cyan text-void font-mono text-xs uppercase tracking-[0.25em] px-6 py-3 hover:shadow-neon-cyan hover:brightness-110 transition-all"
            >
              Launch calculator
            </Link>
          </aside>
        ) : article.clusterSlug === 'ethereum-scaling' ||
          article.clusterSlug === 'liquid-staking' ||
          article.clusterSlug === 'crypto-etfs' ? (
          <aside className="max-w-3xl mb-12 border border-line/70 p-6 cyber-cut-sm bg-panel/40">
            <p className="term-label mb-3">{'// optional_scenario'}</p>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              Optional: market-cap what-if
            </h2>
            <p className="text-muted-foreground mb-5">
              Guides in this cluster are educational, not price forecasts. If you still want to
              explore illustrative market-cap scenarios for your holdings, the free calculator is
              available — treat outputs as conditional math only.
            </p>
            <Link
              href="/#calculator"
              className="inline-block border border-neon-cyan/50 text-neon-cyan font-mono text-xs uppercase tracking-[0.25em] px-6 py-3 hover:border-neon-cyan transition-colors"
            >
              Open calculator
            </Link>
          </aside>
        ) : null}

        <nav className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.2em]">
          <Link
            href={`/learn/${article.clusterSlug}`}
            className="text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            ‹ {cluster?.shortTitle || 'Cluster'} hub
          </Link>
          <Link href="/learn" className="text-muted-foreground hover:text-neon-cyan transition-colors">
            All Learn hubs
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-neon-cyan transition-colors">
            Calculator ›
          </Link>
        </nav>
      </div>
    </>
  );
}
