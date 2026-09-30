# SEO week 3 notes — Cluster B (Ethereum scaling)

**Goal:** Ship evergreen `/learn/ethereum-scaling/*` pillars without deleting or mass-migrating Mongo blog posts.

## Live Learn URLs (week 3)

| Type | URL | Primary KW |
| --- | --- | --- |
| Hub | `/learn/ethereum-scaling` | Ethereum L2 scaling |
| Pillar | `/learn/ethereum-scaling/peerdas-explained` | PeerDAS explained |
| Pillar | `/learn/ethereum-scaling/epbs-explained` | ePBS explained |
| Supporting | `/learn/ethereum-scaling/peerdas-and-l2s` | PeerDAS L2 benefits |

Still planned: `/learn/ethereum-scaling/blob-data-availability`.

## Blog is Mongo-only

Article bodies live in MongoDB (admin / content bot), not as static markdown in this repo. Image assets under `public/imgs/` confirm these Cluster B news posts exist:

- `ethereum-fusaka-upgrade-peerdas-and-l2`
- `ethereum-glamsterdam-upgrade-sepolia-epbs-in`
- `economic-analysis-of-layer-2-solutions` (fee economics context)
- `analysis-of-l2-finality-and-economics` (L2 security/finality context)

Week 3 Learn copy reused accurate educational facts from the live Fusaka / Glamsterdam API responses and framed upgrade timing as changeable.

## Recommended blog → Learn internal links (content bot / manual)

Do **not** delete these posts. Prefer adding a short “Evergreen guide” callout or inline link in each body:

| Blog slug | Suggested Learn target | Anchor idea |
| --- | --- | --- |
| `ethereum-fusaka-upgrade-peerdas-and-l2` | `/learn/ethereum-scaling/peerdas-explained` | “Read the evergreen PeerDAS explained guide” |
| `ethereum-fusaka-upgrade-peerdas-and-l2` | `/learn/ethereum-scaling/peerdas-and-l2s` | “What PeerDAS means for L2 fees” |
| `ethereum-glamsterdam-upgrade-sepolia-epbs-in` | `/learn/ethereum-scaling/epbs-explained` | “Evergreen ePBS / Glamsterdam explainer” |
| `ethereum-glamsterdam-upgrade-sepolia-epbs-in` | `/learn/ethereum-scaling/peerdas-explained` | Cross-link DA vs block-building (already related) |
| `economic-analysis-of-layer-2-solutions` | `/learn/ethereum-scaling/peerdas-and-l2s` | Update fee path with PeerDAS capacity context |
| `analysis-of-l2-finality-and-economics` | `/learn/ethereum-scaling` | Hub for scaling cluster (optional) |
| `core-platform-expansion-enhancing-growthepie-for` | `/learn/ethereum-scaling` | Optional ecosystem → hub |

Optional hub mention in any new Ethereum upgrade news: link `/learn/ethereum-scaling` once in intro or footer of the post.

## Constraints respected

- No redirects from blog → Learn yet (can reconsider after traffic review).
- No changes to `tool:article` / admin CMS APIs.
- Calculator CTAs soft/optional on Cluster B pages; hard CTA remains Cluster A.
- Sitemap via existing `getLearnSitemapEntries()` in `src/lib/learn.js`.
