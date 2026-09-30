/**
 * Evergreen /learn IA — shared by index, cluster hubs, and sitemap.
 * Week 1: hubs only. Supporting pillar/slug pages come in later weeks.
 */

export const LEARN_BASE = 'https://valorisvisio.top';

/** @typedef {'hub' | 'pillar' | 'supporting'} LearnContentType */
/** @typedef {'solid' | 'stub'} HubDepth */

/**
 * @typedef {Object} PlannedArticle
 * @property {string} title
 * @property {string} primaryKeyword
 * @property {string} slugHint - future path segment under the cluster
 * @property {LearnContentType} contentType
 */

/**
 * @typedef {Object} LearnCluster
 * @property {string} id - letter code from SEO plan (A–F)
 * @property {string} slug - URL segment under /learn
 * @property {string} title
 * @property {string} shortTitle - nav / card label
 * @property {string} primaryKeyword
 * @property {string[]} secondaryKeywords
 * @property {string} intro
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {HubDepth} depth
 * @property {PlannedArticle[]} plannedArticles - placeholder links (not live yet)
 */

/** @type {LearnCluster[]} */
export const LEARN_CLUSTERS = [
  {
    id: 'A',
    slug: 'crypto-profit-calculator',
    title: 'Crypto Profit Calculator & Market-Cap Scenarios',
    shortTitle: 'Profit Calculator',
    primaryKeyword: 'crypto profit calculator',
    secondaryKeywords: [
      'market cap scenario calculator',
      'crypto what-if calculator',
      'compare crypto market caps',
      'crypto holdings profit simulator',
    ],
    intro:
      'Use ValorisVisio’s scenario calculator to model what your holdings could be worth if they reached another coin’s market cap. This hub covers how crypto profit calculators work, market-cap comparison math, and practical ways to stress-test upside — without treating any scenario as financial advice.',
    metaTitle: 'Crypto Profit Calculator & Market-Cap Scenarios',
    metaDescription:
      'Learn how a crypto profit calculator works, compare market-cap scenarios, and model what-if gains with ValorisVisio’s free scenario tool.',
    depth: 'solid',
    plannedArticles: [
      {
        title: 'How crypto market-cap scenarios work',
        primaryKeyword: 'crypto market cap calculator',
        slugHint: 'market-cap-scenarios-explained',
        contentType: 'pillar',
      },
      {
        title: 'Profit calculator vs. ROI formulas',
        primaryKeyword: 'crypto ROI calculator',
        slugHint: 'profit-vs-roi',
        contentType: 'supporting',
      },
      {
        title: 'Limitations of market-cap what-ifs',
        primaryKeyword: 'crypto market cap comparison limitations',
        slugHint: 'scenario-limitations',
        contentType: 'supporting',
      },
    ],
  },
  {
    id: 'B',
    slug: 'ethereum-scaling',
    title: 'Ethereum Scaling: PeerDAS, ePBS & L2',
    shortTitle: 'Ethereum Scaling',
    primaryKeyword: 'PeerDAS explained',
    secondaryKeywords: [
      'Ethereum PeerDAS',
      'ePBS Ethereum',
      'Ethereum L2 scaling',
      'blob data availability',
      'Fusaka upgrade',
    ],
    intro:
      'Ethereum’s scaling roadmap is shifting how data availability and block building work — from PeerDAS to ePBS and the L2 stack that depends on them. Start here for a clear explanation of PeerDAS, then follow planned deep-dives on ePBS, blob economics, and what L2 users should watch next.',
    metaTitle: 'PeerDAS Explained — Ethereum Scaling Hub',
    metaDescription:
      'PeerDAS explained in plain English, plus a hub for ePBS, L2 scaling, and upcoming Ethereum upgrade topics for builders and users.',
    depth: 'solid',
    // Hub owns primary KW "PeerDAS explained" for week 1 (one primary = one URL).
    plannedArticles: [
      {
        title: 'ePBS explained',
        primaryKeyword: 'ePBS Ethereum explained',
        slugHint: 'epbs-explained',
        contentType: 'supporting',
      },
      {
        title: 'How L2s benefit from PeerDAS',
        primaryKeyword: 'PeerDAS L2 benefits',
        slugHint: 'peerdas-and-l2s',
        contentType: 'supporting',
      },
      {
        title: 'Blob data availability after PeerDAS',
        primaryKeyword: 'Ethereum blob data availability',
        slugHint: 'blob-data-availability',
        contentType: 'supporting',
      },
    ],
  },
  {
    id: 'C',
    slug: 'solana-finality',
    title: 'Solana Finality',
    shortTitle: 'Solana Finality',
    primaryKeyword: 'Solana finality explained',
    secondaryKeywords: [
      'Solana Alpenglow',
      'Solana confirmation time',
      'Solana consensus finality',
    ],
    intro:
      'A stub hub for Solana finality, confirmation times, and upgrades that change how quickly transactions settle. Full explainers land in a later week.',
    metaTitle: 'Solana Finality Explained (Coming Soon)',
    metaDescription:
      'Stub hub for Solana finality, confirmation speed, and upgrades like Alpenglow. Evergreen guides coming soon on ValorisVisio Learn.',
    depth: 'stub',
    plannedArticles: [
      {
        title: 'Solana Alpenglow explained',
        primaryKeyword: 'Solana Alpenglow explained',
        slugHint: 'alpenglow-explained',
        contentType: 'supporting',
      },
    ],
  },
  {
    id: 'D',
    slug: 'crypto-etfs',
    title: 'Crypto ETFs',
    shortTitle: 'Crypto ETFs',
    primaryKeyword: 'crypto ETF explained',
    secondaryKeywords: [
      'Bitcoin spot ETF',
      'Ethereum ETF',
      'crypto ETF flows',
    ],
    intro:
      'Stub hub for spot and other crypto ETFs — how they work, how flows relate to price narratives, and how to read filings without the hype. Guides planned for a later week.',
    metaTitle: 'Crypto ETFs Explained (Coming Soon)',
    metaDescription:
      'Stub hub for crypto ETFs, Bitcoin and Ethereum spot products, and flow analysis. Evergreen guides coming soon on ValorisVisio Learn.',
    depth: 'stub',
    plannedArticles: [
      {
        title: 'Bitcoin spot ETF explained',
        primaryKeyword: 'Bitcoin spot ETF explained',
        slugHint: 'bitcoin-spot-etf-explained',
        contentType: 'supporting',
      },
    ],
  },
  {
    id: 'E',
    slug: 'liquid-staking',
    title: 'Liquid Staking & LSTs',
    shortTitle: 'Liquid Staking',
    primaryKeyword: 'liquid staking explained',
    secondaryKeywords: [
      'liquid staking token',
      'LST crypto',
      'stETH explained',
      'JitoSOL',
      'staking receipt tokens',
    ],
    intro:
      'Liquid staking lets you earn staking rewards while keeping a tradable receipt token (an LST). This hub explains liquid staking from first principles — how LSTs work, where risks sit, and how receipt tokens show up in ETF and regulatory conversations.',
    metaTitle: 'Liquid Staking Explained — LST Hub',
    metaDescription:
      'Liquid staking explained: how LSTs work, key risks, and how staking receipt tokens fit into DeFi and ETF discussions.',
    depth: 'solid',
    // Hub owns primary KW "liquid staking explained" for week 1.
    plannedArticles: [
      {
        title: 'LST risks and depeg scenarios',
        primaryKeyword: 'liquid staking risks',
        slugHint: 'lst-risks',
        contentType: 'supporting',
      },
      {
        title: 'Staking receipt tokens & ETFs',
        primaryKeyword: 'staking receipt token ETF',
        slugHint: 'receipt-tokens-and-etfs',
        contentType: 'supporting',
      },
      {
        title: 'stETH vs other major LSTs',
        primaryKeyword: 'stETH vs liquid staking tokens',
        slugHint: 'steth-vs-lsts',
        contentType: 'supporting',
      },
    ],
  },
  {
    id: 'F',
    slug: 'crypto-tax',
    title: 'Crypto Tax by Jurisdiction',
    shortTitle: 'Crypto Tax',
    primaryKeyword: 'crypto tax by jurisdiction',
    secondaryKeywords: [
      'crypto tax guide',
      'cryptocurrency capital gains',
      'crypto tax rules US',
    ],
    intro:
      'Stub hub for jurisdiction-by-jurisdiction crypto tax overviews. Not tax advice — structured explainers and checklists will be added later.',
    metaTitle: 'Crypto Tax by Jurisdiction (Coming Soon)',
    metaDescription:
      'Stub hub for crypto tax by jurisdiction. Evergreen, non-advice guides and checklists coming soon on ValorisVisio Learn.',
    depth: 'stub',
    plannedArticles: [
      {
        title: 'US crypto tax basics',
        primaryKeyword: 'US crypto tax basics',
        slugHint: 'us-basics',
        contentType: 'supporting',
      },
    ],
  },
];

export function getLearnClusters() {
  return LEARN_CLUSTERS;
}

export function getLearnClusterBySlug(slug) {
  return LEARN_CLUSTERS.find((c) => c.slug === slug) ?? null;
}

/** Sitemap entries for /learn and each cluster hub. */
export function getLearnSitemapEntries() {
  const now = new Date();
  return [
    {
      url: `${LEARN_BASE}/learn`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...LEARN_CLUSTERS.map((c) => ({
      url: `${LEARN_BASE}/learn/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: c.depth === 'solid' ? 0.8 : 0.5,
    })),
  ];
}
