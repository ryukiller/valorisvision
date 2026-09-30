# SEO week 4 notes — Cluster E (liquid staking) + Cluster D (crypto ETFs)

**Goal:** Ship LST pillar + compare, flesh the crypto ETF hub, document blog→Learn targets and thin-blog hygiene. No Mongo blog deletes/migrations.

## Live Learn URLs (week 4)

| Type | URL | Primary KW |
| --- | --- | --- |
| Hub | `/learn/liquid-staking` | liquid staking tokens |
| Pillar | `/learn/liquid-staking/liquid-staking-explained` | liquid staking explained |
| Supporting (compare / risks) | `/learn/liquid-staking/lst-risks` | liquid staking risks |
| Hub | `/learn/crypto-etfs` | crypto ETF explained |
| Supporting | `/learn/crypto-etfs/near-etf-explained` | NEAR ETF explained |

Still planned (unchanged for later weeks):

- `/learn/liquid-staking/receipt-tokens-and-etfs`
- `/learn/liquid-staking/steth-vs-lsts`
- `/learn/crypto-etfs/bitcoin-spot-etf-explained`

## Keyword ownership notes

- Hub E primary KW shifted to **liquid staking tokens** so **liquid staking explained** owns the pillar URL (same one-KW→one-URL rule as week 3 PeerDAS).
- Hub D keeps **crypto ETF explained** on the hub via `hubOverview` markdown (light hub, not a separate pillar).
- Compare pick: **JitoSOL / LST risks** (`lst-risks`) — chosen over stETH vs rETH because `/blog/sec-staking-receipt-token-faq-what` already covers JitoSOL + staking receipt / LST ETF themes.

## Blog → Learn internal links (Mongo; content bot / manual)

Do **not** delete these posts. Prefer a short “Evergreen guide” callout or inline link:

| Blog slug | Suggested Learn target | Anchor idea |
| --- | --- | --- |
| `sec-staking-receipt-token-faq-what` | `/learn/liquid-staking/liquid-staking-explained` | “Evergreen: liquid staking explained” |
| `sec-staking-receipt-token-faq-what` | `/learn/liquid-staking/lst-risks` | “LST risks & JitoSOL / receipt context” |
| `sec-staking-receipt-token-faq-what` | `/learn/liquid-staking` | Optional hub link in intro/footer |
| `bitwise-launches-first-us-spot-near` | `/learn/crypto-etfs/near-etf-explained` | “NEAR ETF explained (evergreen)” |
| `bitwise-launches-first-us-spot-near` | `/learn/crypto-etfs` | “Crypto ETF explained hub” |
| `blackrocks-ibit-hits-record-with-875` | `/learn/crypto-etfs` | Optional flows → hub (spot ETF context) |
| `bitcoin-faces-critical-moment-as-institutions` | `/learn/crypto-etfs` | Optional ETF narrative → hub |

Optional: any new LST or ETF launch news can link the matching hub once in intro or footer.

## Thin / outdated 2024 blog hygiene (from `docs/seo-week1-audit.md`)

Section C lists ~26 **THIN-OR-OUTDATED-2024** posts (price predictions, personality forecasts, short-lived hype).

### Proposed next steps (editorial — not implemented in code this week)

1. **Noindex candidates (high priority):** Personality / dated price-target posts, e.g. `cathie-woods-bold-new-bitcoin-price`, `geoff-kendricks-bold-bitcoin-prediction-125000`, `michael-saylor-predicts-bitcoin-could-reach`, `raoul-pal-predicts-bitcoin-to-soar`, `plan-bs-stock-to-flow-model`, `jamie-dimons-bitcoin-skepticism-a-2024`, `kevin-svenson-predicts-bullish-trajectory-for`.
2. **Merge / consolidate candidates:** Overlapping ETH gloom pair `ethereum-faces-challenges-amidst-slowing-dapp` + `ethereum-faces-uncertain-times-amid-declining` → keep one canonical news URL or fold into a single archive note; leave Learn B as the evergreen scaling home.
3. **Keep as thin archive (noindex later if traffic is near-zero):** Meme/hype one-offs (`dogwifhat-futures-surge-traders-anticipate-major`, `the-highly-anticipated-cati-token-launch`, `helium-hnt-soars-by-18-amidst`).
4. **Do not noindex KEEP / EVERGREEN-CANDIDATE** posts from the week 1 audit without a second pass.

### Code-side noindex — document only this week

Existing robots patterns in the app:

- Global `src/app/robots.js` — allow `/`, disallow `/api/`, `/admin/`.
- Not-found metadata: `robots: { index: false }` on missing learn/blog pages.
- Static noindex meta on `/privacy` and `/cookies` layouts.

There is **no** per-slug blog noindex / `robots` field on Mongo articles today. Implementing thin-post noindex would need a CMS flag (e.g. `noindex: true` on the article document) wired into `src/app/blog/[slug]/page.js` `generateMetadata`. **Out of scope for week 4 code** — track as a follow-up once editorial confirms the slug list.

## Constraints respected

- English evergreen copy; FAQ sections use singular `## FAQ`.
- Soft calculator CTAs only; no financial-advice claims.
- Blog left in Mongo; sitemap via `getLearnSitemapEntries()`.
- Calculator / blog tools untouched beyond Learn IA.
