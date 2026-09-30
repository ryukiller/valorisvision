# SEO Week 1 — Blog content audit

**Site:** valorisvisio.top  
**Scope:** Inventory existing `/blog` posts from in-repo artifacts (no live MongoDB dump in this environment).  
**Sources:** `slug-redirects.json` (canonical shortened slugs), `public/imgs/` article image filenames (includes newer posts not yet in redirects).  
**Date:** 2026-09-30  
**Note:** Classification is editorial/SEO judgment from titles/slugs only. Full body review deferred to week 3 migration.

## Classification legend

| Label | Meaning |
| --- | --- |
| **KEEP** | Fine as daily/news `/blog` content; leave in place. |
| **EVERGREEN-CANDIDATE** | Educational or technical depth that could later inform or redirect into `/learn` clusters (do **not** migrate in week 1). |
| **THIN-OR-OUTDATED-2024** | Dated price calls, thin hype, one-off 2024 news with little lasting value — candidates to prune, noindex, or consolidate later. |

## Summary counts

| Class | Approx. count |
| --- | --- |
| KEEP | ~28 |
| EVERGREEN-CANDIDATE | ~22 |
| THIN-OR-OUTDATED-2024 | ~26 |
| **Total unique posts (imgs ∪ redirects)** | **~76** |

---

## A. KEEP (news / archive OK on `/blog`)

| Slug (canonical when known) | Notes |
| --- | --- |
| `bitcoin-faces-critical-moment-as-institutions` | ETF / institutional news cycle |
| `bitcoin-nears-record-high-but-pulls` | Market snapshot |
| `bitcoin-slides-as-rising-treasury-yields` | Macro + BTC news |
| `blackrocks-ibit-hits-record-with-875` | ETF flow news |
| `bitwise-launches-first-us-spot-near` | Product launch news (from imgs) |
| `bingx-reports-security-breach-a-deep` | Exchange incident reporting |
| `binances-vishal-sacheendran-discusses-global-crypto` | Interview / regulation news |
| `cftc-settles-with-uniswap-labs-over` | Regulatory enforcement news |
| `circle-partners-with-hkt-to-transform` | Partnership news |
| `circles-strategic-expansion-integrating-usdc-with` | USDC expansion news |
| `coinbase-ottiene-lapprovazione-cftc-per-una` | Exchange/regulatory news (IT title — keep for now, localize later) |
| `dogecoin-surges-to-new-heights-following` | Meme/news spike |
| `donald-trump-makes-history-with-bitcoin-payment-in-nyc` | Political/crypto news (from imgs) |
| `fca-reveals-widespread-failures-among-cryptocurrency` | UK regulatory news |
| `federal-reserve-cuts-interest-rates-impacts` | Macro news |
| `germanys-big-crackdown-47-cryptocurrency` | Enforcement news |
| `illinois-02-crypto-tax-draft-rules` | Jurisdiction news → related to Learn F later (from imgs) |
| `louisiana-embraces-cryptocurrency-a-new-era` | State payments news |
| `magic-eden-launches-test-token-testme` | Product news |
| `mrbeasts-cryptocurrency-scandal-unraveling-the-allegations` | Celebrity/scandal news (from imgs) |
| `ondo-finance-partners-with-wellington-management` | RWA/partnership news |
| `pavel-durov-defends-telegrams-practices-following` | Telegram news |
| `polygon-unveils-new-pol-token-paving` | Token/upgrade announcement |
| `robinhood-crypto-reaches-39-million-settlement` | Legal settlement news |
| `sec-staking-receipt-token-faq-what` | Timely SEC FAQ — keep as news; themes feed Learn E |
| `senate-fails-to-advance-clarity-act` | US policy news |
| `sky-divests-wrapped-bitcoin-a-strategic` | Protocol governance news |
| `texas-judge-dismisses-consensys-lawsuit-against` | Legal news |
| `the-us-treasurys-national-strategy-for` | Policy news |
| `zurich-cantonal-bank-unveils-bitcoin-and` | Bank product news |

---

## B. EVERGREEN-CANDIDATE (potential `/learn` fuel — week 3+)

Map loosely to SEO clusters A–F where relevant.

| Slug | Suggested cluster affinity | Notes |
| --- | --- | --- |
| `analysis-of-l2-finality-and-economics` | B (Ethereum scaling / L2) | Technical L2 finality |
| `anonymous-validator-data-collection-using-zero` | B | Ethereum validator / ZK |
| `apibara-adding-ethereum-data-to-the` | B | Eth data tooling |
| `celestia-unveils-1-gigabyte-block-plan` | B (DA adjacent) | Modular DA / scaling context |
| `core-platform-expansion-enhancing-growthepie-for` | B | L2 ecosystem analytics |
| `economic-analysis-of-layer-2-solutions` | B | EIP-4844 / L2 economics |
| `enhancing-privacy-and-security-anonymous-client` | B | Ethereum client privacy |
| `establishing-healthy-network-baselines-for-ethereum` | B | Network baselines (Xatu) |
| `ethereum-fusaka-upgrade-peerdas-and-l2` | **B** | Direct PeerDAS / Fusaka — strong Learn B candidate (from imgs) |
| `ethereum-glamsterdam-upgrade-sepolia-epbs-in` | **B** | ePBS / Glamsterdam — Learn B (from imgs) |
| `mapping-the-future-of-ethereum-inside` | B | Eth research / data |
| `revolutionizing-blockchain-data-standardised-and-crowdsourced` | B | Labels/ABIs education-ish |
| `unveiling-dotpics-revolutionizing-ethereum-dashboards-data` | B | Eth dashboards |
| `walletlabels-standardizing-enriching-ethereum-account-labels` | B | Account labeling |
| `solana-alpenglow-upgrade-faster-finality` | **C** | Solana finality — Learn C (from imgs) |
| `sonic-the-new-frontier-in-blockchain` | C-adjacent | Speed/finality narrative |
| `unveiling-susd-solayers-innovative-stablecoin-on` | E-adjacent | Solana staking/stablecoin adjacent |
| `21co-launches-wrapped-bitcoin-21btc-on` | D/E-adjacent | Wrapped assets / institutional rails |
| `celebrating-16-years-of-bitcoin-the` | A-adjacent | Historical explainer tone |
| `navigating-the-bitcoin-halving-bear-market` | A-adjacent | Cyclical guide (age carefully) |
| `polymarket-is-booming-while-usage-is` | — | Prediction markets explainer-ish |
| `analyzing-the-synchronization-slowdown-of-bitcoin` | — | Bitcoin Core technical |
| `coordinating-optimization-and-debugging-flags-in` | — | Dev/build flags — niche evergreen |
| `moving-forward-deprecating-uint256s-in-favor` | — | Crypto dev hygiene |

**Calculator cluster (A):** No dedicated evergreen calculator guides in the blog corpus; `/` tool remains the product surface. Learn A hubs are net-new.

---

## C. THIN-OR-OUTDATED-2024 (prune / consolidate later)

| Slug | Why |
| --- | --- |
| `bitmex-co-founder-arthur-hayes-shifts` | Personality price outlook |
| `cathie-woods-bold-new-bitcoin-price` | Dated mega price prediction |
| `dogwifhat-futures-surge-traders-anticipate-major` | Meme futures hype |
| `elon-musk-hints-at-leading-hypothetical` | Off-topic / thin political |
| `ethereum-faces-challenges-amidst-slowing-dapp` | Duplicate-ish ETH dapp gloom (see also next) |
| `ethereum-faces-uncertain-times-amid-declining` | Overlaps prior ETH activity piece |
| `ethereum-underperforms-bitcoin-44-since-pos` | Dated relative-performance take |
| `geoff-kendricks-bold-bitcoin-prediction-125000` | Price prediction |
| `helium-hnt-soars-by-18-amidst` | Short-lived price spike |
| `jamie-dimon-acknowledges-jpmorgans-embrace-of` | Personality quote news |
| `jamie-dimons-bitcoin-skepticism-a-2024` | Explicitly 2024 forecast framing |
| `kevin-svenson-predicts-bullish-trajectory-for` | Price prediction |
| `michael-saylor-predicts-bitcoin-could-reach` | Ultra-long prediction headline |
| `microstrategys-ambitious-42-billion-bitcoin-investment` | Company plan news — ages fast |
| `plan-bs-stock-to-flow-model` | S2F prediction (2025 target) |
| `raoul-pal-predicts-bitcoin-to-soar` | Price prediction |
| `south-korean-tech-stocks-soar-as` | Tangential equity/crypto headline |
| `tether-diversifies-portfolio-with-100m-investment` | One-off corporate allocation |
| `the-crypto-market-is-playing-mind` | Vague market-mood piece |
| `the-highly-anticipated-cati-token-launch` | Dated token launch (Sep 20) |
| `bitget-and-foresight-ventures-invest-30` | Funding announcement |
| `vitalik-buterins-10-million-eth-transfer` | Transfer speculation |

*Also treat any remaining personality “$X by date” posts the same way if discovered in MongoDB beyond this file list.*

---

## D. Gaps vs. approved Learn clusters

| Cluster | Hub URL (week 1) | Blog coverage |
| --- | --- | --- |
| A Calculator / market-cap scenarios | `/learn/crypto-profit-calculator` | Essentially none — greenfield |
| B Ethereum scaling (PeerDAS, ePBS, L2) | `/learn/ethereum-scaling` | Strong candidates (Fusaka/PeerDAS, Glamsterdam/ePBS, L2 economics) |
| C Solana finality | `/learn/solana-finality` | Alpenglow image/slug present |
| D Crypto ETFs | `/learn/crypto-etfs` | Several KEEP news posts; few true explainers |
| E Liquid staking / LST | `/learn/liquid-staking` | SEC staking receipt FAQ is news-shaped; needs evergreen rewrite |
| F Tax by jurisdiction | `/learn/crypto-tax` | Illinois draft rules news only |

---

## E. Week 1 actions (this PR)

- Do **not** migrate, redirect, or delete blog posts.
- Do **not** change `tool:article` / admin APIs.
- Ship `/learn` IA hubs + keyword map only.
- Use this audit in week 3 when selecting EVERGREEN-CANDIDATE posts for rewrite/canonical moves.
