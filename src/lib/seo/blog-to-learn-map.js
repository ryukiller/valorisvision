/**
 * Maps blog post slugs → related Learn URLs for the “Further reading” panel.
 *
 * Blog bodies live in MongoDB, so we cannot edit article markdown in-repo.
 * Instead, `RelatedLearnLinks` on the blog article page reads this map and
 * renders evergreen Learn links for matching slugs.
 *
 * Sources: docs/seo-week3-notes.md (Ethereum scaling) and
 * docs/seo-week4-notes.md (liquid staking + crypto ETFs), plus calculator /
 * tax affinities from docs/seo-week1-audit.md.
 *
 * How to add a mapping:
 * 1. Use the canonical blog slug (same as /blog/[slug]).
 * 2. Add an entry with one or more Learn paths (absolute path under /learn/…).
 * 3. Prefer 1–3 links per post; keep titles user-facing.
 *
 * Optional CMS path: if an admin/content bot can patch Mongo, mirror the same
 * URLs as inline “Evergreen guide” links in the article body for SEO juice;
 * this UI map still provides a consistent footer even when bodies are stale.
 */

/**
 * @typedef {Object} BlogLearnLink
 * @property {string} href - Learn path, e.g. /learn/ethereum-scaling/peerdas-explained
 * @property {string} title - Anchor / list label
 * @property {string} [description] - Short supporting line
 */

/** @type {Record<string, BlogLearnLink[]>} */
export const BLOG_TO_LEARN_MAP = {
  // Cluster B — Ethereum scaling
  'ethereum-fusaka-upgrade-peerdas-and-l2': [
    {
      href: '/learn/ethereum-scaling/peerdas-explained',
      title: 'PeerDAS explained',
      description: 'Evergreen guide to PeerDAS, Fusaka, and blob data availability.',
    },
    {
      href: '/learn/ethereum-scaling/peerdas-and-l2s',
      title: 'What PeerDAS means for L2 fees',
      description: 'How sampling capacity can affect rollup throughput and fees.',
    },
    {
      href: '/learn/ethereum-scaling',
      title: 'Ethereum scaling hub',
      description: 'PeerDAS, ePBS, and L2 guides in one place.',
    },
  ],
  'ethereum-glamsterdam-upgrade-sepolia-epbs-in': [
    {
      href: '/learn/ethereum-scaling/epbs-explained',
      title: 'ePBS / Glamsterdam explained',
      description: 'Block building and ePBS in plain English for investors and L2 users.',
    },
    {
      href: '/learn/ethereum-scaling/peerdas-explained',
      title: 'PeerDAS explained',
      description: 'Cross-link: data availability vs block-building upgrades.',
    },
    {
      href: '/learn/ethereum-scaling',
      title: 'Ethereum scaling hub',
    },
  ],
  'economic-analysis-of-layer-2-solutions': [
    {
      href: '/learn/ethereum-scaling/peerdas-and-l2s',
      title: 'PeerDAS & L2 fees',
      description: 'Update the fee path with PeerDAS capacity context.',
    },
    {
      href: '/learn/ethereum-scaling',
      title: 'Ethereum scaling hub',
    },
  ],
  'analysis-of-l2-finality-and-economics': [
    {
      href: '/learn/ethereum-scaling',
      title: 'Ethereum scaling hub',
      description: 'L2 security, finality, and scaling explainers.',
    },
  ],
  'core-platform-expansion-enhancing-growthepie-for': [
    {
      href: '/learn/ethereum-scaling',
      title: 'Ethereum scaling hub',
    },
  ],

  // Cluster E — liquid staking / JitoSOL
  'sec-staking-receipt-token-faq-what': [
    {
      href: '/learn/liquid-staking/liquid-staking-explained',
      title: 'Liquid staking explained',
      description: 'Evergreen LST mechanics and staking receipt context.',
    },
    {
      href: '/learn/liquid-staking/lst-risks',
      title: 'LST risks & JitoSOL context',
      description: 'Risk checks for liquid staking tokens including JitoSOL themes.',
    },
    {
      href: '/learn/liquid-staking',
      title: 'Liquid staking hub',
    },
  ],

  // Cluster D — crypto ETFs / NEAR
  'bitwise-launches-first-us-spot-near': [
    {
      href: '/learn/crypto-etfs/near-etf-explained',
      title: 'NEAR ETF explained',
      description: 'Evergreen context for NEAR spot ETF products.',
    },
    {
      href: '/learn/crypto-etfs',
      title: 'Crypto ETF explained hub',
    },
  ],
  'blackrocks-ibit-hits-record-with-875': [
    {
      href: '/learn/crypto-etfs',
      title: 'Crypto ETF explained',
      description: 'Spot ETF flows in context — not a price forecast.',
    },
  ],
  'bitcoin-faces-critical-moment-as-institutions': [
    {
      href: '/learn/crypto-etfs',
      title: 'Crypto ETF explained',
      description: 'Institutional ETF narrative → evergreen hub.',
    },
  ],

  // Cluster F — tax (hub exists; Illinois news → tax hub)
  'illinois-02-crypto-tax-draft-rules': [
    {
      href: '/learn/crypto-tax',
      title: 'Crypto tax by jurisdiction',
      description: 'Upcoming jurisdiction guides; educational only, not tax advice.',
    },
  ],

  // Cluster A — calculator / market-cap scenarios (product surface)
  // Soft links for readers who land on educational-ish posts; expand as needed.
};

/**
 * @param {string | null | undefined} slug
 * @returns {BlogLearnLink[]}
 */
export function getLearnLinksForBlogSlug(slug) {
  if (!slug || typeof slug !== 'string') return [];
  return BLOG_TO_LEARN_MAP[slug.toLowerCase()] || [];
}
