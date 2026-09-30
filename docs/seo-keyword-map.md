# SEO keyword map — ValorisVisio Learn

**Rule:** one primary keyword → one target URL.  
**Status column:** all rows are `planned` or `live-stub` for week 1 (hubs published as stubs/solid intros; full copy later).  
**Base:** `https://valorisvisio.top`

## Cluster hubs (live in week 1)

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| A — Calculator / market-cap scenarios | crypto profit calculator | market cap scenario calculator; crypto what-if calculator; compare crypto market caps; crypto holdings profit simulator | `/learn/crypto-profit-calculator` | hub | live-stub (solid intro) |
| B — Ethereum scaling | PeerDAS explained | Ethereum PeerDAS; ePBS Ethereum; Ethereum L2 scaling; blob data availability; Fusaka upgrade | `/learn/ethereum-scaling` | hub | live-stub (solid intro) |
| C — Solana finality | Solana finality explained | Solana Alpenglow; Solana confirmation time; Solana consensus finality | `/learn/solana-finality` | hub | live-stub (light) |
| D — Crypto ETFs | crypto ETF explained | Bitcoin spot ETF; Ethereum ETF; crypto ETF flows | `/learn/crypto-etfs` | hub | live-stub (light) |
| E — Liquid staking / LST | liquid staking explained | liquid staking token; LST crypto; stETH explained; JitoSOL; staking receipt tokens | `/learn/liquid-staking` | hub | live-stub (solid intro) |
| F — Tax by jurisdiction | crypto tax by jurisdiction | crypto tax guide; cryptocurrency capital gains; crypto tax rules US | `/learn/crypto-tax` | hub | live-stub (light) |

## Index

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| — | crypto learn guides | evergreen crypto explainers; ValorisVisio learn | `/learn` | hub | live-stub |

## Product surface (existing — do not duplicate primary on Learn)

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| A (tool) | crypto scenario calculator | market cap comparison tool; crypto profit simulator online | `/` | tool | live |

## Planned supporting / pillar URLs (not built in week 1)

| Cluster | Primary KW | Secondary KWs | Target URL | Content type | Status |
| --- | --- | --- | --- | --- | --- |
| A | crypto market cap calculator | market cap what-if; fully diluted valuation scenario | `/learn/crypto-profit-calculator/market-cap-scenarios-explained` | pillar | planned |
| A | crypto ROI calculator | crypto profit vs ROI; holdings return formula | `/learn/crypto-profit-calculator/profit-vs-roi` | supporting | planned |
| A | crypto market cap comparison limitations | scenario calculator caveats; market cap myth | `/learn/crypto-profit-calculator/scenario-limitations` | supporting | planned |
| B | ePBS Ethereum explained | enshrined PBS; Glamsterdam ePBS | `/learn/ethereum-scaling/epbs-explained` | supporting | planned |
| B | PeerDAS L2 benefits | PeerDAS rollups; L2 data availability PeerDAS | `/learn/ethereum-scaling/peerdas-and-l2s` | supporting | planned |
| B | Ethereum blob data availability | blob throughput; PeerDAS blobs | `/learn/ethereum-scaling/blob-data-availability` | supporting | planned |
| C | Solana Alpenglow explained | Solana faster finality; Alpenglow upgrade | `/learn/solana-finality/alpenglow-explained` | supporting | planned |
| D | Bitcoin spot ETF explained | BTC ETF flows; IBIT vs peers | `/learn/crypto-etfs/bitcoin-spot-etf-explained` | supporting | planned |
| E | liquid staking risks | LST depeg; liquid staking slashing | `/learn/liquid-staking/lst-risks` | supporting | planned |
| E | staking receipt token ETF | LST ETF; SEC staking receipt FAQ context | `/learn/liquid-staking/receipt-tokens-and-etfs` | supporting | planned |
| E | stETH vs liquid staking tokens | stETH vs rETH; major LST comparison | `/learn/liquid-staking/steth-vs-lsts` | supporting | planned |
| F | US crypto tax basics | IRS crypto tax; capital gains crypto US | `/learn/crypto-tax/us-basics` | supporting | planned |

## Routing convention

```
/learn                          → evergreen index
/learn/[cluster]                → cluster hub (week 1)
/learn/[cluster]/[slug]         → pillar / supporting (later weeks)
/blog                           → daily news (unchanged)
/                               → calculator tool (unchanged)
```

Implemented in App Router as:

- `src/app/learn/page.js`
- `src/app/learn/[cluster]/page.js`
- Shared IA data: `src/lib/learn.js`
