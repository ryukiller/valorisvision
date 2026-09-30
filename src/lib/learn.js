/**
 * Evergreen /learn IA — shared by index, cluster hubs, articles, and sitemap.
 * Week 1: hubs. Week 2+: cluster A pillar/supporting pages.
 */

export const LEARN_BASE = 'https://valorisvisio.top';

/** @typedef {'hub' | 'pillar' | 'supporting'} LearnContentType */
/** @typedef {'solid' | 'stub'} HubDepth */
/** @typedef {'planned' | 'live'} ArticleStatus */

/**
 * @typedef {Object} PlannedArticle
 * @property {string} title
 * @property {string} primaryKeyword
 * @property {string} slugHint - path segment under the cluster
 * @property {LearnContentType} contentType
 * @property {ArticleStatus} [status]
 */

/**
 * @typedef {Object} LearnArticle
 * @property {string} clusterSlug
 * @property {string} slug
 * @property {string} title
 * @property {string} shortTitle
 * @property {string} primaryKeyword
 * @property {string[]} secondaryKeywords
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {LearnContentType} contentType
 * @property {string} summary
 * @property {string} markdown - body markdown (no leading H1; page renders H1)
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
 * @property {PlannedArticle[]} plannedArticles
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
        title: 'How to use a crypto market cap scenario calculator',
        primaryKeyword: 'crypto market cap calculator',
        slugHint: 'market-cap-scenarios-explained',
        contentType: 'pillar',
        status: 'live',
      },
      {
        title: 'Profit calculator vs. ROI formulas',
        primaryKeyword: 'crypto ROI calculator',
        slugHint: 'profit-vs-roi',
        contentType: 'supporting',
        status: 'planned',
      },
      {
        title: 'Limitations of market-cap what-ifs',
        primaryKeyword: 'crypto market cap comparison limitations',
        slugHint: 'scenario-limitations',
        contentType: 'supporting',
        status: 'planned',
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
    plannedArticles: [
      {
        title: 'ePBS explained',
        primaryKeyword: 'ePBS Ethereum explained',
        slugHint: 'epbs-explained',
        contentType: 'supporting',
        status: 'planned',
      },
      {
        title: 'How L2s benefit from PeerDAS',
        primaryKeyword: 'PeerDAS L2 benefits',
        slugHint: 'peerdas-and-l2s',
        contentType: 'supporting',
        status: 'planned',
      },
      {
        title: 'Blob data availability after PeerDAS',
        primaryKeyword: 'Ethereum blob data availability',
        slugHint: 'blob-data-availability',
        contentType: 'supporting',
        status: 'planned',
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
        status: 'planned',
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
        status: 'planned',
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
    plannedArticles: [
      {
        title: 'LST risks and depeg scenarios',
        primaryKeyword: 'liquid staking risks',
        slugHint: 'lst-risks',
        contentType: 'supporting',
        status: 'planned',
      },
      {
        title: 'Staking receipt tokens & ETFs',
        primaryKeyword: 'staking receipt token ETF',
        slugHint: 'receipt-tokens-and-etfs',
        contentType: 'supporting',
        status: 'planned',
      },
      {
        title: 'stETH vs other major LSTs',
        primaryKeyword: 'stETH vs liquid staking tokens',
        slugHint: 'steth-vs-lsts',
        contentType: 'supporting',
        status: 'planned',
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
        status: 'planned',
      },
    ],
  },
];

/** @type {LearnArticle[]} */
export const LEARN_ARTICLES = [
  {
    clusterSlug: 'crypto-profit-calculator',
    slug: 'market-cap-scenarios-explained',
    title: 'How to Use a Crypto Market Cap Scenario Calculator',
    shortTitle: 'Market-cap scenarios',
    primaryKeyword: 'crypto market cap calculator',
    secondaryKeywords: [
      'market cap what-if',
      'fully diluted valuation scenario',
      'crypto scenario calculator',
      'circulating supply vs FDV',
    ],
    metaTitle: 'How to Use a Crypto Market Cap Scenario Calculator',
    metaDescription:
      'Learn how a crypto market cap scenario calculator works: circulating supply vs FDV, ROI what-ifs, and how to run scenarios on ValorisVisio.',
    contentType: 'pillar',
    summary:
      'A practical guide to market-cap what-if math: circulating vs fully diluted valuation, how scenario ROI is derived, and how to use ValorisVisio’s free calculator.',
    markdown: `A **crypto market cap scenario calculator** answers a simple what-if: if your coin’s market capitalization moved toward another project’s, what could your holdings be worth? ValorisVisio’s [scenario calculator on the homepage](/) runs that comparison with live market data so you can stress-test upside without treating any output as a forecast.

## What a market-cap scenario actually models

Market capitalization is usually priced as:

**Market cap ≈ price × circulating supply**

A scenario calculator holds your **quantity of tokens** fixed, then scales the implied price as if your asset’s market cap matched a target asset’s market cap (for example, “what if my altcoin’s cap looked more like ETH’s?”). The result is an illustrative valuation of your bag under that assumption — not a prediction that the market will get there.

ValorisVisio is built for that comparison loop: pick your holdings, pick a target project, and read the simulated value and percentage move. Use it as a **crypto profit calculator** style sandbox for market-cap what-ifs, then sanity-check the assumptions below.

## Circulating market cap vs fully diluted valuation (FDV)

Two numbers get mixed up in social feeds. They are not interchangeable in a scenario tool.

- **Circulating market cap** uses coins that are already liquid (or counted as circulating by the data provider). This is the figure most “compare my coin to X’s market cap” tools lean on.
- **Fully diluted valuation (FDV)** multiplies price by **total** or max supply as if every token were circulating today. FDV is useful for unlock calendars and dilution risk; it is usually **higher** than circulating cap when large unlocks remain.

If you compare your circulating cap to another coin’s **FDV** (or the reverse), the scenario will look artificially easy or hard. Prefer **like-for-like**: circulating-to-circulating when you want a fair “size of the pie” thought experiment. When unlocks matter, note FDV separately instead of baking it into the same ratio blindly.

CoinGecko-backed fields on ValorisVisio follow the provider’s circulating market-cap convention for the live calculator — keep that in mind when you interpret results.

## How scenario ROI is derived

A typical market-cap what-if follows this shape:

1. Read your asset’s current market cap and your token balance.
2. Read the target asset’s market cap.
3. Implied new price ≈ target market cap ÷ your asset’s circulating supply.
4. Implied bag value ≈ implied new price × your balance.
5. Scenario “ROI” / gain ≈ (implied bag value ÷ current bag value) − 1.

That percentage is **conditional math**, not expected return. Liquidity, narrative, token unlocks, and demand can break the linear market-cap story long before the numbers match. Treat the output as a **scenario**, the same way the Learn hub frames ValorisVisio’s tool — not as financial advice.

## How to run it on ValorisVisio

1. Open the [Advanced Crypto Scenario Calculator](/#calculator).
2. Enter the amount you hold.
3. Select your current cryptocurrency.
4. Choose a target project whose market cap you want to compare against.
5. Read the simulated value and percentage change, then adjust targets (larger or smaller caps) to map a range of outcomes.

For more context on the cluster, return to the [crypto profit calculator hub](/learn/crypto-profit-calculator). Planned follow-ups cover profit-vs-ROI formulas and scenario limitations in more depth.

## Practical checks before you trust a number

- Confirm you know whether the target figure is circulating cap or FDV.
- Check supply: large unlocks can make today’s circulating scenario obsolete.
- Ask whether the target cap implies a realistic share of crypto’s total market — mega-caps are not interchangeable with micro-caps just because the spreadsheet allows it.
- Re-run with a few targets (one step up the ranking, not only the #1 coin) to see a band of outcomes instead of a single moonshot.

## FAQ

### What is a crypto market cap scenario calculator?

It is a tool that estimates what your holdings could be worth if your asset’s market capitalization moved toward another coin’s market cap. ValorisVisio’s free calculator uses live data to run that what-if so you can compare sizes and visualize potential bag value under the chosen assumption.

### How is circulating market cap different from FDV?

Circulating market cap multiplies price by coins counted as circulating. Fully diluted valuation (FDV) multiplies price by total or max supply as if everything were liquid. Scenarios should usually compare circulating-to-circulating; FDV is better for dilution and unlock analysis than for a direct profit what-if.

### Does a higher target market cap mean guaranteed profit?

No. The calculator shows conditional math: if market caps aligned as assumed, your holdings would imply a certain value. Price discovery, liquidity, unlocks, and demand can prevent that alignment. Use scenarios to explore ranges, not as a promise of returns.

### How do I use ValorisVisio’s crypto scenario calculator?

Go to the homepage calculator, enter your holdings, pick your coin, then select a target project. The tool returns an illustrative value and percentage change based on market-cap comparison. Pair it with this guide’s circulating-vs-FDV checks before drawing conclusions.
`,
  },
];

export function getLearnClusters() {
  return LEARN_CLUSTERS;
}

export function getLearnClusterBySlug(slug) {
  return LEARN_CLUSTERS.find((c) => c.slug === slug) ?? null;
}

export function getLearnArticles() {
  return LEARN_ARTICLES;
}

export function getLearnArticle(clusterSlug, slug) {
  return (
    LEARN_ARTICLES.find((a) => a.clusterSlug === clusterSlug && a.slug === slug) ??
    null
  );
}

export function getLiveArticlesForCluster(clusterSlug) {
  return LEARN_ARTICLES.filter((a) => a.clusterSlug === clusterSlug);
}

/** Sitemap entries for /learn, cluster hubs, and live articles. */
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
    ...LEARN_ARTICLES.map((a) => ({
      url: `${LEARN_BASE}/learn/${a.clusterSlug}/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: a.contentType === 'pillar' ? 0.75 : 0.65,
    })),
  ];
}
