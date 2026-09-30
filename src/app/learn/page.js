import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getLearnClusters } from '@/lib/learn';
import { SITE_NAME, OG_LOCALE } from '@/lib/site';

const BASE = 'https://valorisvisio.top';

export const metadata = {
  title: 'Learn Crypto — Evergreen Guides & Explainers',
  description:
    'Evergreen crypto guides from ValorisVisio: profit calculators, PeerDAS and Ethereum scaling, liquid staking, Solana finality, ETFs, and tax hubs.',
  alternates: { canonical: `${BASE}/learn` },
  openGraph: {
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: 'Learn Crypto — Evergreen Guides & Explainers',
    description:
      'Evergreen crypto guides: scenario calculators, Ethereum scaling, liquid staking, and more.',
    url: `${BASE}/learn`,
  },
};

export default function LearnIndexPage() {
  const clusters = getLearnClusters();
  const solid = clusters.filter((c) => c.depth === 'solid');
  const stubs = clusters.filter((c) => c.depth === 'stub');

  return (
    <div className="container mx-auto px-4 py-8 main-content">
      <div className="pt-[100px] mb-12">
        <Breadcrumbs items={[{ label: 'Learn' }]} />
        <p className="term-label mb-3">{'// knowledge_grid'}</p>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          LEARN <span className="text-neon-cyan">CRYPTO</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mb-4">
          ValorisVisio Learn is a library of evergreen crypto explainers — built for readers who want
          durable context, not only day-to-day headlines. Pick a topic hub, then open the guides that
          match what you are trying to understand.
        </p>
        <p className="text-base text-muted-foreground max-w-2xl">
          Daily market and product news stays on the{' '}
          <Link href="/blog" className="text-neon-cyan hover:underline">
            blog
          </Link>
          . When you are ready to run a market-cap what-if, open the{' '}
          <Link href="/#calculator" className="text-neon-cyan hover:underline">
            scenario calculator
          </Link>
          .
        </p>
      </div>

      <section className="mb-14" aria-labelledby="learn-featured">
        <h2 id="learn-featured" className="font-display text-xl font-bold tracking-tight mb-2">
          Topic hubs
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          Start here if you want a clear overview plus links to live guides in each topic.
        </p>
        <ul className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {solid.map((cluster) => (
            <li key={cluster.slug}>
              <Link
                href={`/learn/${cluster.slug}`}
                className="block h-full border border-line p-6 cyber-cut-sm hover:border-neon-cyan/60 transition-all group"
              >
                <p className="term-label mb-2">
                  {'// '}
                  {cluster.shortTitle.toLowerCase().replace(/\s+/g, '_')}
                </p>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-neon-cyan transition-colors mb-3">
                  {cluster.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{cluster.intro}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neon-cyan/90">
                  Explore hub ›
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="learn-coming">
        <h2 id="learn-coming" className="font-display text-xl font-bold tracking-tight mb-2">
          More topics on the way
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          These hubs already outline who they are for and what is coming next. Full guides will
          appear here as they are published.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {stubs.map((cluster) => (
            <li key={cluster.slug}>
              <Link
                href={`/learn/${cluster.slug}`}
                className="block border border-line/70 p-5 cyber-cut-sm hover:border-neon-cyan/40 transition-all"
              >
                <h3 className="font-display text-base font-bold text-foreground mb-2">
                  {cluster.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{cluster.intro}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 font-mono text-xs text-muted-foreground tracking-widest">
        <Link href="/" className="hover:text-neon-cyan transition-colors">
          › Open the scenario calculator
        </Link>
      </p>
    </div>
  );
}
