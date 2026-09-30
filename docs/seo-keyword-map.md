# SEO keyword map — ValorisVisio Learn

**Rule:** one primary keyword → one target URL.  
**Status column:** `live` / `live-stub` / `in-progress` / `planned`.  
**Base:** `https://valorisvisio.top`

## Cluster hubs (live in week 1)

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| A — Calculator / market-cap scenarios | crypto profit calculator | market cap scenario calculator; crypto what-if calculator; compare crypto market caps; crypto holdings profit simulator | `/learn/crypto-profit-calculator` | hub | live-stub (solid intro) |
| B — Ethereum scaling | Ethereum L2 scaling | PeerDAS explained; ePBS Ethereum; blob data availability; Fusaka upgrade; Glamsterdam ePBS | `/learn/ethereum-scaling` | hub | **live (week 3)** — intro + 3 guides linked |
| C — Solana finality | Solana finality explained | Solana Alpenglow; Solana confirmation time; Solana consensus finality | `/learn/solana-finality` | hub | live-stub (light) |
| D — Crypto ETFs | crypto ETF explained | Bitcoin spot ETF; Ethereum ETF; crypto ETF flows | `/learn/crypto-etfs` | hub | live-stub (light) |
| E — Liquid staking / LST | liquid staking explained | liquid staking token; LST crypto; stETH explained; JitoSOL; staking receipt tokens | `/learn/liquid-staking` | hub | live-stub (solid intro) |
| F — Tax by jurisdiction | crypto tax by jurisdiction | crypto tax guide; cryptocurrency capital gains; crypto tax rules US | `/learn/crypto-tax` | hub | live-stub (light) |

## Index

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| — | crypto learn guides | evergreen crypto explainers; ValorisVisio learn | `/learn` | hub | live-stub |

## Product surface (homepage — Cluster A tool)

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| A (tool) | crypto scenario calculator | crypto profit calculator; crypto market cap calculator; market cap comparison tool | `/` | tool | **done (week 2)** — title/meta/H1/copy refreshed |

## Supporting / pillar URLs

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| A | crypto market cap calculator | market cap what-if; fully diluted valuation scenario | `/learn/crypto-profit-calculator/market-cap-scenarios-explained` | pillar | **done (week 2)** |
| A | crypto ROI calculator | crypto profit vs ROI; holdings return formula | `/learn/crypto-profit-calculator/profit-vs-roi` | supporting | planned |
| A | crypto market cap comparison limitations | scenario calculator caveats; market cap myth | `/learn/crypto-profit-calculator/scenario-limitations` | supporting | planned |
| B | PeerDAS explained | Ethereum PeerDAS; Fusaka upgrade; blob data availability | `/learn/ethereum-scaling/peerdas-explained` | pillar | **done (week 3)** |
| B | ePBS explained | enshrined PBS; Glamsterdam ePBS; proposer builder separation | `/learn/ethereum-scaling/epbs-explained` | pillar | **done (week 3)** |
| B | PeerDAS L2 benefits | PeerDAS rollups; L2 data availability PeerDAS; rollup blob fees | `/learn/ethereum-scaling/peerdas-and-l2s` | supporting | **done (week 3)** |
| B | Ethereum blob data availability | blob throughput; PeerDAS blobs | `/learn/ethereum-scaling/blob-data-availability` | supporting | planned |
| C | Solana Alpenglow explained | Solana faster finality; Alpenglow upgrade | `/learn/solana-finality/alpenglow-explained` | supporting | planned |
| D | Bitcoin spot ETF explained | BTC ETF flows; IBIT vs peers | `/learn/crypto-etfs/bitcoin-spot-etf-explained` | supporting | planned |
| E | liquid staking risks | LST depeg; liquid staking slashing | `/learn/liquid-staking/lst-risks` | supporting | planned |
| E | staking receipt token ETF | LST ETF; SEC staking receipt FAQ context | `/learn/liquid-staking/receipt-tokens-and-etfs` | supporting | planned |
| E | stETH vs liquid staking tokens | stETH vs rETH; major LST comparison | `/learn/liquid-staking/steth-vs-lsts` | supporting | planned |
| F | US crypto tax basics | IRS crypto tax; capital gains crypto US | `/learn/crypto-tax/us-basics` | supporting | planned |

## Week 2 notes (Cluster A)

- Homepage on-page SEO aligned to long-tail intent without stuffing; brand ValorisVisio kept in title/meta.
- Pillar guide live with `## FAQ` (FAQPage JSON-LD via `extractFaq`).
- Soft CTAs: homepage hero + under-calculator link; hub `/learn/crypto-profit-calculator` links the live guide.
- Sitemap: `getLearnSitemapEntries()` includes live article URLs under `/learn/[cluster]/[slug]`.

## Week 3 notes (Cluster B)

- Hub primary KW shifted to **Ethereum L2 scaling** so **PeerDAS explained** can own `/learn/ethereum-scaling/peerdas-explained` (one primary KW → one URL).
- Three live guides: PeerDAS / Fusaka pillar, ePBS / Glamsterdam pillar, PeerDAS↔L2 fees supporting.
- Soft calculator CTAs only where ETH market-cap scenarios are natural; Cluster B article aside is optional/soft (not the Cluster A hard CTA).
- Blog posts left in Mongo; see `docs/seo-week3-notes.md` for recommended internal links from blog → Learn.
- Sitemap: same `getLearnSitemapEntries()` helper as week 2 picks up new `LEARN_ARTICLES`.

## Routing convention

```
/learn                          → evergreen index
/learn/[cluster]                → cluster hub (week 1)
/learn/[cluster]/[slug]         → pillar / supporting (week 2+)
/blog                           → daily news (unchanged)
/                               → calculator tool (week 2 on-page SEO)
```

Implemented in App Router as:

- `src/app/learn/page.js`
- `src/app/learn/[cluster]/page.js`
- `src/app/learn/[cluster]/[slug]/page.js`
- Shared IA data: `src/lib/learn.js`
