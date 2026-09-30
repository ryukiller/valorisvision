/**
 * Evergreen /learn IA — shared by index, cluster hubs, articles, and sitemap.
 * Week 1: hubs. Week 2: cluster A. Week 3: cluster B (Ethereum scaling).
 * Week 4: cluster E (liquid staking) + cluster D (crypto ETFs, light hub).
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
 * @property {string} [hubOverview] - optional markdown for solid hubs (no leading H1)
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
    primaryKeyword: 'Ethereum L2 scaling',
    secondaryKeywords: [
      'PeerDAS explained',
      'ePBS Ethereum',
      'blob data availability',
      'Fusaka upgrade',
      'Glamsterdam ePBS',
    ],
    intro:
      'Ethereum’s scaling roadmap is shifting how data availability and block building work — from PeerDAS and Fusaka to ePBS / Glamsterdam and the L2 stack that depends on them. Start with the PeerDAS explainer, then read ePBS for investors and L2 users, and the shorter guide on what PeerDAS means for rollup fees. Protocol timing can change; treat dates as educational context, not a fixed mainnet schedule.',
    metaTitle: 'Ethereum L2 Scaling — PeerDAS, ePBS & Fees',
    metaDescription:
      'Ethereum L2 scaling hub: PeerDAS explained, ePBS / Glamsterdam for investors and L2 users, and what PeerDAS means for rollup fees.',
    depth: 'solid',
    plannedArticles: [
      {
        title: 'PeerDAS / Fusaka explained for investors & L2 users',
        primaryKeyword: 'PeerDAS explained',
        slugHint: 'peerdas-explained',
        contentType: 'pillar',
        status: 'live',
      },
      {
        title: 'ePBS / Glamsterdam explained',
        primaryKeyword: 'ePBS explained',
        slugHint: 'epbs-explained',
        contentType: 'pillar',
        status: 'live',
      },
      {
        title: 'What PeerDAS means for L2 throughput and rollup fees',
        primaryKeyword: 'PeerDAS L2 benefits',
        slugHint: 'peerdas-and-l2s',
        contentType: 'supporting',
        status: 'live',
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
    title: 'Crypto ETFs Explained',
    shortTitle: 'Crypto ETFs',
    primaryKeyword: 'crypto ETF explained',
    secondaryKeywords: [
      'Bitcoin spot ETF',
      'Ethereum ETF',
      'crypto ETF flows',
      'NEAR ETF',
      'how crypto ETFs work',
    ],
    intro:
      'A crypto ETF explained in plain English: exchange-traded funds that track digital assets so investors can get price exposure through a brokerage account instead of holding coins directly. This hub covers spot vs futures products, how flows show up in market narratives, and where ValorisVisio’s evergreen guides sit next to daily ETF news on /blog.',
    hubOverview: `## Crypto ETF explained

A **crypto ETF** is an exchange-traded fund whose value is designed to follow one or more cryptocurrencies (or related strategies). You buy and sell shares on a traditional exchange during market hours. The fund issuer handles custody, creation/redemption, and regulatory filings — you do not need a self-custody wallet for the underlying coins.

### Spot vs futures (keep them separate)

| Type | What it tracks | Common takeaway |
| --- | --- | --- |
| **Spot** crypto ETF | Aims to reflect the spot price of the asset (e.g. Bitcoin or Ether held by custodians) | Often what headlines mean by “Bitcoin ETF” / “Ethereum ETF” after U.S. spot approvals |
| **Futures** crypto ETF | Holds futures contracts, not (primarily) the spot coins | Roll costs and basis can make tracking differ from spot |

“Crypto ETF explained” does **not** mean every ticker works the same. Read the prospectus for holdings, fees, creation mechanism, and risks.

### How flows enter the conversation

Daily **inflow/outflow** figures measure whether authorized participants created or redeemed shares. Large creations can coincide with issuer buying of the underlying; redemptions can coincide with selling. Flows are **one input** next to macro rates, spot liquidity, and leverage — not a standalone price forecast.

### What this hub links to

- Short supporting guide: [NEAR ETF explained](/learn/crypto-etfs/near-etf-explained) (alt-asset spot context; pairs with Bitwise NEAR launch news on /blog).
- Planned later: Bitcoin spot ETF deep dive.
- Related market-cap what-ifs (educational only): [scenario calculator](/#calculator).
- Daily flow and launch coverage stays on [/blog](/blog) — for example BlackRock IBIT flow snapshots and product launches.

This is educational framing, **not** investment advice. ETF shares and self-custody assets have different operational, tax, and counterparty profiles depending on your jurisdiction.
`,
    metaTitle: 'Crypto ETF Explained — Spot, Flows & Guides',
    metaDescription:
      'Crypto ETF explained: how spot and futures crypto ETFs work, how flows relate to price narratives, and links to ValorisVisio Learn guides.',
    depth: 'solid',
    plannedArticles: [
      {
        title: 'NEAR ETF explained',
        primaryKeyword: 'NEAR ETF explained',
        slugHint: 'near-etf-explained',
        contentType: 'supporting',
        status: 'live',
      },
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
    primaryKeyword: 'liquid staking tokens',
    secondaryKeywords: [
      'liquid staking explained',
      'liquid staking token',
      'LST crypto',
      'stETH explained',
      'JitoSOL',
      'staking receipt tokens',
    ],
    intro:
      'Liquid staking tokens (LSTs) let you earn staking rewards while keeping a tradable receipt for staked assets. This hub is the IA home for LST mechanics, risk checks, and how staking receipt tokens show up in ETF and regulatory conversations — start with the liquid staking explained pillar, then the LST risks guide.',
    metaTitle: 'Liquid Staking Tokens — LST Hub',
    metaDescription:
      'Liquid staking tokens hub: LST mechanics, risks, and staking receipt context. Start with liquid staking explained and LST risk checks.',
    depth: 'solid',
    plannedArticles: [
      {
        title: 'Liquid staking explained',
        primaryKeyword: 'liquid staking explained',
        slugHint: 'liquid-staking-explained',
        contentType: 'pillar',
        status: 'live',
      },
      {
        title: 'JitoSOL & LST risks',
        primaryKeyword: 'liquid staking risks',
        slugHint: 'lst-risks',
        contentType: 'supporting',
        status: 'live',
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
  {
    clusterSlug: 'ethereum-scaling',
    slug: 'peerdas-explained',
    title: 'PeerDAS Explained: Fusaka, Blobs & What L2 Users Should Know',
    shortTitle: 'PeerDAS explained',
    primaryKeyword: 'PeerDAS explained',
    secondaryKeywords: [
      'Ethereum PeerDAS',
      'Fusaka upgrade',
      'blob data availability',
      'PeerDAS L2',
      'data availability sampling Ethereum',
    ],
    metaTitle: 'PeerDAS Explained — Ethereum Fusaka for Investors & L2 Users',
    metaDescription:
      'PeerDAS explained in plain English: how Ethereum Fusaka data availability sampling works, what it means for blobs and L2 users, and what investors should track.',
    contentType: 'pillar',
    summary:
      'A durable explainer of PeerDAS (Peer Data Availability Sampling) in the Fusaka era: how sampling differs from downloading every blob, what that means for rollups, and how to read capacity claims without treating upgrade timing as fixed.',
    markdown: `**PeerDAS explained** simply: Ethereum validators check that rollup blob data is available by **sampling pieces** of erasure-coded data instead of downloading every blob in full. That design aims to support higher blob capacity for Layer 2s without forcing every consensus participant to carry the entire data load.

This guide is for investors and L2 users who want the mechanism, the limits, and the metrics that matter — not a launch-day scoreboard. **Mainnet parameters and fork timing can change**; treat any calendar context as educational and verify against current Ethereum client and developer documentation.

For the wider cluster, start at the [Ethereum scaling hub](/learn/ethereum-scaling). For fee mechanics, see [what PeerDAS means for L2 throughput and rollup fees](/learn/ethereum-scaling/peerdas-and-l2s). Block-building changes such as ePBS live in a separate pillar: [ePBS / Glamsterdam explained](/learn/ethereum-scaling/epbs-explained).

## What PeerDAS is (and is not)

**PeerDAS** stands for **Peer Data Availability Sampling**. Ethereum uses **blobs** so rollups can post data more cheaply than stuffing everything into ordinary execution-layer calldata. Availability still matters: independent parties need a path to reconstruct or verify that the data existed so they can check rollup state and, where applicable, challenge faults.

Before sampling-style designs, verifying availability generally meant receiving the relevant blob data. With PeerDAS, data is erasure-coded and distributed so a validator can sample parts of it. If enough samples succeed under the protocol’s rules, the network can gain confidence that the full data can be reconstructed when required.

PeerDAS is a change in **how Ethereum checks data availability**. It does **not**:

- make rollup data optional,
- by itself make L1 execution “faster,”
- guarantee cheaper user fees, or
- publish a permanent, universal TPS multiplier.

Its job is to make **higher rollup data capacity** more practical while limiting how much each validator must download.

## Fusaka, blobs, and BPO context

In ValorisVisio’s roadmap coverage, the **Fusaka** upgrade is the packaging name most often associated with bringing PeerDAS into Ethereum’s data-availability story. Fusaka is also associated with a more flexible path for adjusting blob parameters through **Blob Parameter-Only (BPO)** forks — so targets and limits can be tuned in stages rather than only inside a single mega-upgrade.

Blob size context that often appears in explainers: a blob is a fixed-size object of **128 KiB**. Historical configuration notes (for example, post-Pectra pre-Fusaka targets such as six blobs per block with a maximum of nine) describe **earlier** settings. Live targets and maxima can differ by date and network; always check current client/network docs rather than treating a blog figure as permanent.

## How PeerDAS helps Layer 2s

A rollup batches transactions off Ethereum’s execution layer, then posts data or commitments back to Ethereum. Users share settlement costs across many transactions, but the rollup still needs reliable **data availability** so others can verify state.

PeerDAS can support increased **blob capacity** while capping per-participant bandwidth. More room for rollup data can ease competition for blob space when demand is high. Whether users see lower fees depends on rollup pricing, competition, and whether demand actually fills the new capacity — not on PeerDAS alone.

Keep four ideas separate when you read “throughput” headlines:

| Measure | What it means | What it does not prove |
| --- | --- | --- |
| Blob capacity | How much rollup data Ethereum can include and make available over time | That every L2 is cheaper tomorrow |
| Rollup throughput | How many txs a specific L2 can process | That all L2s share one TPS number |
| User fees | What end users pay (sequencer + data + other costs) | That L1 blob-fee moves pass through 1:1 |
| Finality / security | Confirmation and trust assumptions | That capacity upgrades remove every risk |

Compression, transaction mix, and sequencer design all change how the same blob budget maps to “transactions per second.”

## What investors and L2 users should track

Prefer observables over slogans:

1. **Blob utilization and blob fees** — Is new capacity being used? Are fees still elevated when demand spikes?
2. **Rollup-level activity and median fees** — Compare like-for-like transaction types across networks.
3. **Client and DA health** — Sampling only helps if clients keep up and data remains reconstructible under the protocol’s assumptions.
4. **Roadmap honesty** — Feature names (Fusaka, PeerDAS, BPO) are not price catalysts by themselves.

Related ValorisVisio news pieces that informed this evergreen rewrite (blog left in place): [Ethereum Fusaka upgrade: PeerDAS and L2 throughput](/blog/ethereum-fusaka-upgrade-peerdas-and-l2) and [Layer 2 fee economics](/blog/economic-analysis-of-layer-2-solutions).

If you are stress-testing an **ETH market-cap narrative** around scaling (not predicting fork outcomes), you can optionally run a what-if on the [ValorisVisio scenario calculator](/#calculator) — treat any output as conditional math, not a forecast.

## FAQ

### What is PeerDAS on Ethereum?

PeerDAS (Peer Data Availability Sampling) lets validators check that blob data is available by sampling erasure-coded pieces instead of downloading every blob in full. It supports higher rollup data capacity while limiting per-validator bandwidth.

### How is PeerDAS related to the Fusaka upgrade?

Fusaka is the upgrade framing commonly used for Ethereum’s PeerDAS data-availability work and related blob-parameter flexibility (including BPO-style adjustments). Exact activation details and live blob targets can change — verify current client and developer sources.

### Will PeerDAS automatically lower my L2 fees?

Not automatically. More blob capacity can reduce pressure when demand for data space is high, but rollups set user prices based on many costs. See [PeerDAS and L2 fees](/learn/ethereum-scaling/peerdas-and-l2s) for the fee path.

### Does PeerDAS change Ethereum block building or MEV?

No. PeerDAS is about data availability sampling for blobs. Proposer-builder changes such as **ePBS** are a separate topic covered in [ePBS explained](/learn/ethereum-scaling/epbs-explained).
`,
  },
  {
    clusterSlug: 'ethereum-scaling',
    slug: 'epbs-explained',
    title: 'ePBS Explained: Glamsterdam, Proposer-Builder Separation & What to Watch',
    shortTitle: 'ePBS explained',
    primaryKeyword: 'ePBS explained',
    secondaryKeywords: [
      'ePBS Ethereum',
      'enshrined PBS',
      'Glamsterdam ePBS',
      'proposer builder separation Ethereum',
      'block-level access lists',
    ],
    metaTitle: 'ePBS Explained — Glamsterdam & Enshrined PBS for ETH Users',
    metaDescription:
      'ePBS explained: what enshrined proposer-builder separation means in Ethereum’s Glamsterdam plans, how it differs from today’s MEV-Boost world, and what to watch on testnets.',
    contentType: 'pillar',
    summary:
      'Plain-English ePBS (enshrined proposer-builder separation) for ETH holders, validators, and L2 users — including Glamsterdam context, how it differs from external PBS, and why testnet milestones are not mainnet promises.',
    markdown: `**ePBS explained** in one line: **enshrined proposer-builder separation** means moving key proposer–builder coordination rules **into Ethereum’s protocol**, so block production depends less on external relays and off-protocol arrangements than today’s MEV-Boost-style PBS.

This pillar sits under the [Ethereum scaling hub](/learn/ethereum-scaling). It pairs with [PeerDAS explained](/learn/ethereum-scaling/peerdas-explained) (data availability) — ePBS is about **who builds and proposes blocks**, not about blob sampling.

**Timing caveat:** Glamsterdam-related testnet windows discussed in industry coverage (for example, a Sepolia target in late 2026) are **tests**, not a confirmed mainnet fork date. Specs, client readiness, and feature scope can change. Verify All Core Devs notes, published specs, and client releases before acting on a headline.

## Today’s PBS vs enshrined PBS

On Ethereum today, a validator may be selected to **propose** a block while specialized **builders** assemble profitable block contents. That split lets validators access sophisticated construction without running a full builder stack. In practice, much of the coordination has relied on **external infrastructure**, including relays used by MEV-Boost participants.

**Enshrined PBS (ePBS)** proposes to place important parts of that relationship inside consensus rules: how builders commit to payloads, what proposers can verify before signing, and how missing or invalid payloads are handled. Exact mechanics depend on the **active specification version** under discussion or test — do not assume every ePBS design draft behaves the same.

Open questions that matter for validators and users include:

- Can smaller validators participate without heavy operational burden?
- What happens when a builder fails to deliver?
- How does the design interact with censorship resistance and latency?
- Which pieces remain optional vs mandatory at activation?

## Glamsterdam: packaging name, not a finished product

**Glamsterdam** is a proposed Ethereum network upgrade name that groups candidate changes — commonly including **ePBS** and, in many roadmaps, **block-level access lists (BALs)**. A named upgrade is a planning and testing container, not proof that every listed idea will ship unchanged to mainnet.

**Sepolia** (and other testnets) let client teams check that implementations agree, that validators can follow the chain, and that ordinary transactions still work. A clean testnet activation is valuable evidence — it is still only one input before any mainnet decision.

Useful checklist when you see “Glamsterdam / ePBS” news:

1. **Activation details** — Matching fork epoch/time across client teams?
2. **Feature scope** — Is ePBS included? Are BALs in the same activation or separate?
3. **Client readiness** — Published compatible releases and operator instructions?
4. **Test artifacts** — Public notes on reorgs, missed proposals, resource use, mismatches?
5. **Next steps** — Spec changes, more tests, or only then a mainnet discussion?

## Block-level access lists (related, not the same as ePBS)

**Block-level access lists** describe state that transactions in a block read or modify. By exposing dependencies, they may help clients find work that can execute in parallel. They are **not** a synonym for ePBS and do **not** automatically raise throughput or cut fees. Benefits depend on correct rules, client implementations, and real workloads.

Do not confuse BALs with **blob data availability** or PeerDAS. For DA and rollup fees, use the PeerDAS guides in this hub.

## What ETH investors and L2 users should (and should not) infer

ePBS primarily concerns **block production and MEV infrastructure**, not a direct fee schedule for rollup users. L2 teams still care because L1 block timing, inclusion, and builder markets affect how batches land — but user fee outcomes remain multi-factor.

Investors should separate **protocol development** from **price narratives**. A Sepolia (or other testnet) milestone does not prove near-term changes to fees, ETH supply, staking rewards, or demand. Any valuation story tied to an unconfirmed mainnet scope is speculative.

Optional soft check: if you are comparing **ETH market-cap scenarios** under different narrative assumptions (smooth upgrade path vs delay), the [scenario calculator](/#calculator) can illustrate bag math — it cannot predict fork schedules.

Source news left on /blog (not deleted): [Ethereum Glamsterdam upgrade: Sepolia ePBS](/blog/ethereum-glamsterdam-upgrade-sepolia-epbs-in). PeerDAS context: [Fusaka / PeerDAS blog](/blog/ethereum-fusaka-upgrade-peerdas-and-l2).

## FAQ

### What does ePBS mean on Ethereum?

ePBS means enshrined proposer-builder separation: putting important proposer–builder coordination into Ethereum’s protocol so the network relies less on external PBS relays and off-protocol deals. Final effects depend on the shipped specification and validator adoption.

### Is Glamsterdam the same thing as ePBS?

No. Glamsterdam is an upgrade packaging name that may include ePBS and other proposals (such as block-level access lists). ePBS is one feature family inside that broader plan.

### Does a Sepolia ePBS test set a mainnet date?

No. Testnet activation helps validate client implementations. Mainnet still requires review, fixes, coordinated releases, and a communicated activation plan. Dates can slip as specs evolve.

### Will ePBS lower my gas fees or move ETH price?

Not in a way you can responsibly forecast from a testnet headline. ePBS targets block-building mechanics; user fees and market prices depend on many factors. Treat price claims tied to early milestones as speculation.
`,
  },
  {
    clusterSlug: 'ethereum-scaling',
    slug: 'peerdas-and-l2s',
    title: 'What PeerDAS Means for L2 Throughput and Rollup Fees',
    shortTitle: 'PeerDAS & L2 fees',
    primaryKeyword: 'PeerDAS L2 benefits',
    secondaryKeywords: [
      'PeerDAS rollups',
      'L2 data availability PeerDAS',
      'rollup blob fees',
      'Ethereum L2 throughput',
    ],
    metaTitle: 'PeerDAS L2 Benefits — Throughput, Blobs & Rollup Fees',
    metaDescription:
      'How PeerDAS can affect Layer 2 throughput and rollup fees: blob capacity vs user prices, what to measure, and why savings are not automatic.',
    contentType: 'supporting',
    summary:
      'A shorter supporting guide: the path from PeerDAS blob capacity to rollup fees, why TPS headlines mislead, and which indicators L2 users should compare.',
    markdown: `PeerDAS can raise how much **rollup data** Ethereum can make available without every validator downloading every blob. That is the core **PeerDAS L2 benefit** — more practical **blob capacity**, which *may* ease fee pressure when demand for data space is high.

It does **not** mint a single guaranteed TPS number or force every rollup to cut prices. For the full mechanism, read [PeerDAS explained](/learn/ethereum-scaling/peerdas-explained). Hub: [Ethereum scaling](/learn/ethereum-scaling).

## From blob capacity to what you pay

Rollups post batches (and proofs/commitments, depending on design) and charge users a blend of:

- sequencer / L2 execution costs,
- **L1 data (blob) costs**,
- proof and settlement costs,
- and their own margin or incentives.

If PeerDAS (and related blob-parameter changes) increases available blob space, competition for that space can soften when the network is congested. Operators *may* pass savings through — or keep them, or use them to absorb demand spikes. Passing savings is a **market choice**, not a protocol rule.

## Throughput vs fees (do not collapse them)

- **More blob capacity** ≠ **identical fee cuts on every L2**.
- **Higher L2 TPS** can still mean expensive complex transactions.
- **Low blob fees** with empty capacity do not prove the upgrade “failed”; they may mean demand has not filled the pipe yet.
- **High activity** with stubborn user fees may mean other bottlenecks (sequencer, proving, L2 congestion) dominate.

Compare **median fees for the same action** (e.g. simple token transfer) on each network, and note whether quotes include only the sequencer charge or also L1 data share.

## Practical checklist for L2 users

1. Watch **blob fee / utilization** dashboards when L2 usage spikes.
2. Compare your rollup’s **fee share of L1 data** vs peers (when disclosed).
3. Separate marketing TPS from **your** wallet’s confirmed cost and time.
4. Remember PeerDAS is L1 DA — it does not remove bridge, sequencer, or proof risks.

Deeper economics background on the blog (unchanged): [Layer 2 fee economics](/blog/economic-analysis-of-layer-2-solutions) and the dated [Fusaka / PeerDAS news piece](/blog/ethereum-fusaka-upgrade-peerdas-and-l2).

## FAQ

### How do L2s benefit from PeerDAS?

PeerDAS helps Ethereum support more blob data with sampling-based availability checks, which can reduce bandwidth pressure on validators and make higher data throughput for rollups more realistic.

### Will my rollup fees drop right after PeerDAS?

Only if demand, capacity, and the rollup’s pricing policy line up that way. Capacity is necessary but not sufficient for lower end-user fees.

### Is PeerDAS the same as cheaper L1 gas for swaps on mainnet?

No. PeerDAS targets rollup **data availability** via blobs. Ordinary L1 execution gas is a different market.
`,
  },
  {
    clusterSlug: 'liquid-staking',
    slug: 'liquid-staking-explained',
    title: 'Liquid Staking Explained: How LSTs Work',
    shortTitle: 'Liquid staking explained',
    primaryKeyword: 'liquid staking explained',
    secondaryKeywords: [
      'liquid staking token',
      'LST crypto',
      'stETH explained',
      'staking receipt token',
      'how liquid staking works',
    ],
    metaTitle: 'Liquid Staking Explained — How LSTs & Receipt Tokens Work',
    metaDescription:
      'Liquid staking explained: how LSTs work, how rewards accrue, what differs from locked staking, and how receipt tokens fit DeFi and ETF conversations.',
    contentType: 'pillar',
    summary:
      'A plain-English pillar on liquid staking: staking vs liquid staking, how LST receipt tokens work, major design patterns, and what to read next on risks.',
    markdown: `**Liquid staking explained** in one sentence: you stake assets with a protocol (or its operators), receive a **liquid staking token (LST)** that represents your claim, and can often trade or use that receipt in DeFi while staking rewards continue to accrue according to the protocol’s rules.

This pillar sits under the [liquid staking hub](/learn/liquid-staking). For risk-focused reading (including JitoSOL / Solana LST context and staking-receipt regulatory themes), see [JitoSOL & LST risks](/learn/liquid-staking/lst-risks).

Educational only — not financial, legal, or tax advice. Protocols, fees, and rules change; verify current docs before interacting with any product.

## Staking vs liquid staking

**Native / locked staking** typically bonds coins to validators. Rewards may accrue, but the bonded position is often illiquid until an unbonding or withdrawal queue completes.

**Liquid staking** aims to keep economic exposure to staking rewards **and** give you a transferable receipt:

1. You deposit (or stake through) a liquid-staking protocol.
2. You receive an **LST** (sometimes called a staking receipt token) that represents your staked claim plus, depending on design, accrued rewards.
3. You may hold, transfer, or use that LST elsewhere — subject to market liquidity and smart-contract risk.
4. Exiting usually means redeeming through the protocol (possible queue / rate limits) or selling the LST on a secondary market (price can differ from “fair” redemption value).

Liquid staking does **not** remove consensus risk, operator risk, or smart-contract risk. It changes **liquidity and composability**, not the fact that something can go wrong.

## How LST designs usually work

Two common accounting patterns (names vary by chain and issuer):

| Pattern | Idea | Example framing |
| --- | --- | --- |
| **Rebase / balance-changing** | Your token balance rises as rewards accrue | Often associated with designs like stETH-style balances |
| **Reward-bearing / exchange-rate** | Balance stays fixed; each token is worth more underlying over time | Common in many LST vaults (e.g. rETH-style rate) |

Neither pattern is “safer” by default. What matters is **who runs validators**, **how withdrawals work**, **oracle/rate updates**, **fees**, and **where the LST trades**.

Major ecosystems you will see in headlines:

- **Ethereum LSTs** — e.g. stETH (Lido), rETH (Rocket Pool), and others. Designs differ on node-operator sets, fees, and decentralization assumptions.
- **Solana LSTs** — e.g. **JitoSOL** and peer products that wrap staked SOL (sometimes with MEV-related reward narratives). Same core idea: receipt token + staking economics + secondary market.

A planned compare page will go deeper on stETH vs other major LSTs; this pillar stays mechanism-first.

## Why people use LSTs (and why that is not a recommendation)

Common motivations in educational literature:

- Keep staking exposure while retaining a transferable token.
- Use the LST as collateral or LP inventory in DeFi (adds **protocol + liquidation** risk on top of staking risk).
- Bridge operational complexity to a specialized operator set.

None of those motives imply positive expected returns after fees, depegs, or hacks. Treat every LST as a **claim on a system**, not as “the same as holding the native coin in a cold wallet.”

## Staking receipt tokens, ETFs, and news context

Regulators and product issuers sometimes discuss **staking receipt tokens** in ETF or fund contexts — whether a wrapper that represents staked assets fits a given product rule set. ValorisVisio covered related news on /blog (left in place): [SEC staking receipt token FAQ — JitoSOL & liquid staking ETFs context](/blog/sec-staking-receipt-token-faq-what).

Use news for **dated policy snapshots**. Use this Learn pillar for **evergreen mechanics**. A later supporting page will expand receipt-token × ETF mapping; until then, prefer primary sources (SEC FAQs, prospectuses, protocol docs).

## Practical checklist before you treat an LST as “just the coin”

1. **Redemption path** — Instant secondary market only, or protocol withdraw with a queue?
2. **Operator set** — Permissionless node set, curated set, or single operator risk?
3. **Fees** — Protocol fee on rewards; any exit fee?
4. **Market basis** — Does the LST trade at a premium/discount to implied redemption?
5. **Composability stack** — Extra venues (lending, LP) multiply failure modes.

Risk detail: [liquid staking risks](/learn/liquid-staking/lst-risks).

Optional soft check: if you are comparing an LST’s **market-cap size** to another asset for a what-if bag illustration, the [scenario calculator](/#calculator) can show conditional math — it cannot price slashing, depeg, or smart-contract failure.

## FAQ

### What is liquid staking?

Liquid staking is a design where you stake assets through a protocol and receive a tradable liquid staking token (LST) that represents your staked claim, so you can often move or use the receipt while rewards accrue under the protocol’s rules.

### What is an LST (liquid staking token)?

An LST is the receipt token issued when you liquid-stake. It is not automatically identical to holding the native asset unstaked: secondary-market price, redemption rules, fees, and smart-contract risk all matter.

### How is liquid staking different from regular staking?

Regular staking often locks or queues the asset until unbonding finishes. Liquid staking issues a transferable receipt so liquidity can exist before protocol withdrawal completes — at the cost of extra protocol and market risks.

### Is an LST the same as the underlying coin?

No. An LST is a claim mediated by smart contracts, operators, and (often) a secondary market. Pegs can break; redemption can be delayed; additional DeFi use adds risk.
`,
  },
  {
    clusterSlug: 'liquid-staking',
    slug: 'lst-risks',
    title: 'JitoSOL & LST Risks: Depeg, Slashing & Receipt Tokens',
    shortTitle: 'LST risks',
    primaryKeyword: 'liquid staking risks',
    secondaryKeywords: [
      'JitoSOL risks',
      'LST depeg',
      'liquid staking slashing',
      'staking receipt token risks',
      'stETH depeg',
    ],
    metaTitle: 'Liquid Staking Risks — JitoSOL, Depeg & Receipt Tokens',
    metaDescription:
      'Liquid staking risks explained: LST depeg, slashing, smart-contract and liquidity risk, with JitoSOL / staking receipt context from regulatory news.',
    contentType: 'supporting',
    summary:
      'A compare-style risk guide for LSTs: depeg vs redemption, slashing and operator failure, liquidity, and how staking-receipt / JitoSOL headlines fit the picture.',
    markdown: `**Liquid staking risks** are easy to understate when an LST “tracks” a familiar coin. This supporting guide pairs with [liquid staking explained](/learn/liquid-staking/liquid-staking-explained) and focuses on failure modes — including themes that showed up in Solana **JitoSOL** and **staking receipt token** news.

Hub: [liquid staking](/learn/liquid-staking). Dated policy snapshot on /blog (unchanged): [SEC staking receipt token FAQ — what JitoSOL and liquid staking ETFs need to know](/blog/sec-staking-receipt-token-faq-what).

Not financial advice. Risk lists are incomplete by nature; always read live protocol docs and disclosures.

## Risk map (compare dimensions)

| Risk | What it looks like | Why LSTs are exposed |
| --- | --- | --- |
| **Smart contract / protocol** | Bug, misconfiguration, governance attack | LST logic + oracles + withdrawal contracts |
| **Validator / operator** | Poor performance, downtime, correlated failures | Stake is delegated to operators the protocol selects or incentivizes |
| **Slashing / penalties** | Consensus penalties reduce underlying | Receipt value depends on remaining claim after penalties (rules vary) |
| **Depeg / basis** | Secondary market price ≠ implied redemption | Liquidity crunches, fear, or exit queues |
| **Liquidity** | Wide spreads, thin books, stalled redemptions | “Liquid” is market-dependent |
| **Composability** | Cascading liquidations in lending/LP | Using LST as collateral stacks protocols |
| **Regulatory / product wrapper** | Uncertain treatment of staking receipts in funds/ETFs | Affects product design and narratives — not your on-chain positions directly |

## Depeg vs slow redemption

A **depeg** usually means the LST’s **market price** diverges from the value you would expect if you could redeem one-for-one (or at the official exchange rate) right now.

That can happen when:

- traders sell the LST faster than the protocol can process exits,
- redemption is queued or rate-limited,
- confidence in operators or contracts drops,
- or leveraged DeFi unwind forces LST dumps.

A discount is a **market signal**, not proof the protocol is insolvent — and a small premium is not proof it is safe. Compare **market price**, **protocol exchange rate**, and **time-to-exit** as three different numbers.

## Slashing, MEV narratives, and Solana LST context

On proof-of-stake networks, validators can be penalized for certain failures or violations. Liquid-staking users inherit a share of that risk according to how the protocol socializes losses.

**JitoSOL** (and similar Solana LSTs) often appear in coverage that mixes staking yield with **MEV-related** reward stories. Extra reward sources can mean extra operational and smart-contract surface area. Treat “higher rewards” marketing as a prompt to read **fee schedules and risk disclosures**, not as a safety rating.

Ethereum LSTs (stETH, rETH, and peers) share the same broad categories above even when brand names differ. A later page will compare stETH vs other majors feature-by-feature; this page stays risk-first.

## Staking receipt tokens & ETF headlines

When regulators publish FAQs on **staking receipt tokens**, the debate is often about whether a tokenized claim on staked assets fits a particular investment-product framework. That is adjacent to — not identical with — using an LST in a self-custody wallet.

Practical split:

- **On-chain LST holder** — protocol, market, and key-management risks dominate.
- **ETF / fund investor** — prospectus, issuer, custody, and fee risks dominate; you may never touch the LST directly.

Use Learn for mechanisms; use /blog for timestamped FAQ coverage; confirm against primary legal text before drawing product conclusions.

## Checklist: stress-test an LST narrative

1. What is the **exit path** under stress (queue length, caps, guardians)?
2. Who can pause or upgrade contracts?
3. How are losses socialized after slashing or exploits?
4. Where does secondary liquidity live (which venues, how deep)?
5. If you use the LST in DeFi, what is the **liquidation** path if the LST discounts?

Optional: comparing LST **market caps** as a size thought experiment is fine on the [calculator](/#calculator) — it will not model depeg severity.

## FAQ

### What are the main liquid staking risks?

Smart-contract failure, validator/operator issues, slashing or penalty socialization, secondary-market depegs, thin liquidity, and extra risk if you reuse the LST in DeFi. Regulatory headlines about staking receipts mainly affect product wrappers and narratives.

### Can an LST permanently lose value vs the underlying?

Yes. Exploits, unresolved bad debt, or severe confidence failure can impair claims. Even without a total failure, discounts can last while exits are constrained.

### Is JitoSOL risk-free because SOL staking is familiar?

No. JitoSOL is an LST with its own contracts, operators, liquidity, and reward design. Familiarity with SOL does not erase those layers.

### Does an SEC FAQ make liquid staking ETFs “safe”?

No. FAQs clarify regulatory interpretations for product designers and the public. They are not endorsements of any token, yield, or fund. Read prospectuses and protocol docs separately.
`,
  },
  {
    clusterSlug: 'crypto-etfs',
    slug: 'near-etf-explained',
    title: 'NEAR ETF Explained: Spot Altcoin ETFs in Context',
    shortTitle: 'NEAR ETF explained',
    primaryKeyword: 'NEAR ETF explained',
    secondaryKeywords: [
      'Bitwise NEAR ETF',
      'spot NEAR ETF',
      'altcoin ETF',
      'crypto ETF vs holding NEAR',
    ],
    metaTitle: 'NEAR ETF Explained — Spot Altcoin ETF Basics',
    metaDescription:
      'NEAR ETF explained in plain English: how a spot NEAR ETF differs from holding NEAR, what to read in a prospectus, and how it fits the crypto ETF hub.',
    contentType: 'supporting',
    summary:
      'A short supporting guide to spot NEAR ETF mechanics vs self-custody, with links to the crypto ETF hub and Bitwise launch news on /blog.',
    markdown: `**NEAR ETF explained** simply: a spot **NEAR** exchange-traded fund aims to track NEAR Protocol’s market price by holding NEAR (via custodians) or an equivalent creation/redemption design disclosed in its filings — so brokerage investors can trade fund shares without managing wallets or on-chain staking themselves.

This page supports the hub overview [crypto ETF explained](/learn/crypto-etfs). Launch-style news stays on /blog: [Bitwise launches first US spot NEAR ETF](/blog/bitwise-launches-first-us-spot-near).

Not investment advice. Tickers, fees, and listings change — verify the live prospectus and exchange listing details.

## ETF shares vs holding NEAR

| | Spot NEAR ETF shares | Holding NEAR directly |
| --- | --- | --- |
| Access | Brokerage account | Wallet / exchange account |
| Custody | Fund custodian / issuer stack | You or your exchange |
| Staking | Usually **not** the same as solo staking NEAR (check prospectus) | Optional on-chain staking / liquid staking |
| Trading hours | Exchange hours + fund rules | Crypto markets ~24/7 |
| Tracking | Fees, cash drag, creation frictions | Spot inventory you control |

A NEAR ETF is a **securities product**. NEAR tokens are **network assets**. Similar price charts do not mean identical risk, tax treatment, or rights.

## What “first US spot NEAR ETF” style headlines mean

Product-launch coverage usually signals that an issuer listed a NEAR-focused spot ETF in a given jurisdiction. That is a **market-structure** event: new brokerage rails for NEAR price exposure. It does **not** by itself prove lasting inflows, protocol success, or upside for NEAR holders.

When you read launch posts (including ValorisVisio’s Bitwise NEAR piece), separate:

1. **Listing / issuer facts** — who sponsors the fund, what it holds, expense ratio.
2. **Flow narratives** — creations/redemptions after launch (noisy early on).
3. **Protocol fundamentals** — NEAR usage, supply, staking — mostly outside the ETF wrapper.

## How this fits the wider crypto ETF cluster

Bitcoin and Ether spot ETFs normalized the “spot crypto ETF” pattern for larger assets. Altcoin spot ETFs extend the same wrapper idea to thinner, more idiosyncratic assets — which can mean **wider spreads**, **different liquidity**, and **higher sensitivity** to single-asset news.

Return to the hub for the general **crypto ETF explained** overview (spot vs futures, flows). A deeper Bitcoin spot ETF guide remains planned.

Soft optional tool link: if you are only exploring **market-cap size** what-ifs for NEAR vs another asset, use the [scenario calculator](/#calculator) as conditional math — not as a view on ETF demand.

## FAQ

### What is a NEAR ETF?

A NEAR ETF is an exchange-traded fund designed to provide price exposure to NEAR, typically through a spot holdings model described in its prospectus, traded as shares on a securities exchange.

### Is a spot NEAR ETF the same as staking NEAR?

Almost never by default. ETF shareholders receive fund economics (price tracking minus fees and frictions). On-chain staking rewards and liquid-staking LSTs are separate designs unless a specific product explicitly includes staking and discloses it.

### Where should I read launch news vs evergreen explainers?

Use [/blog](/blog) for dated launch and flow coverage; use [/learn/crypto-etfs](/learn/crypto-etfs) for the evergreen crypto ETF explained hub and this short NEAR ETF page for altcoin-ETF context.
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
