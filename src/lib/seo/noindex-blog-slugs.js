/**
 * Blog slugs that should not be indexed by search engines.
 *
 * Source of truth for the initial list: docs/seo-week1-audit.md section C
 * (THIN-OR-OUTDATED-2024) and the high-priority noindex candidates called out
 * in docs/seo-week4-notes.md. Do NOT add KEEP or EVERGREEN-CANDIDATE posts
 * from the week 1 audit without a second editorial pass.
 *
 * How to add a slug:
 * 1. Confirm the canonical short slug (see slug-redirects.json / Mongo `slug`).
 * 2. Append it to NOINDEX_BLOG_SLUGS below (lowercase, no leading slash).
 * 3. Optionally set `noindex: true` on the Mongo article document — the blog
 *    post page honors either the list OR the document flag.
 *
 * How to remove a slug: delete it from this array (and clear Mongo `noindex`
 * if set). Rebuild / redeploy so metadata updates.
 */

/** @type {readonly string[]} */
export const NOINDEX_BLOG_SLUGS = Object.freeze([
  // High-priority personality / dated price-target posts (week 4 notes)
  'cathie-woods-bold-new-bitcoin-price',
  'geoff-kendricks-bold-bitcoin-prediction-125000',
  'michael-saylor-predicts-bitcoin-could-reach',
  'raoul-pal-predicts-bitcoin-to-soar',
  'plan-bs-stock-to-flow-model',
  'jamie-dimons-bitcoin-skepticism-a-2024',
  'kevin-svenson-predicts-bullish-trajectory-for',
  // Remaining THIN-OR-OUTDATED-2024 from week 1 audit §C
  'bitmex-co-founder-arthur-hayes-shifts',
  'dogwifhat-futures-surge-traders-anticipate-major',
  'elon-musk-hints-at-leading-hypothetical',
  'ethereum-faces-challenges-amidst-slowing-dapp',
  'ethereum-faces-uncertain-times-amid-declining',
  'ethereum-underperforms-bitcoin-44-since-pos',
  'helium-hnt-soars-by-18-amidst',
  'jamie-dimon-acknowledges-jpmorgans-embrace-of',
  'microstrategys-ambitious-42-billion-bitcoin-investment',
  'south-korean-tech-stocks-soar-as',
  'tether-diversifies-portfolio-with-100m-investment',
  'the-crypto-market-is-playing-mind',
  'the-highly-anticipated-cati-token-launch',
  'bitget-and-foresight-ventures-invest-30',
  'vitalik-buterins-10-million-eth-transfer',
]);

const NOINDEX_SET = new Set(NOINDEX_BLOG_SLUGS);

/**
 * @param {string | null | undefined} slug
 * @param {{ noindex?: boolean, seo?: { robots?: string | { index?: boolean } } } | null} [article]
 * @returns {boolean}
 */
export function shouldNoindexBlogPost(slug, article = null) {
  if (article?.noindex === true) return true;
  const robots = article?.seo?.robots;
  if (robots === 'noindex' || robots === 'noindex,follow' || robots === 'noindex, follow') {
    return true;
  }
  if (robots && typeof robots === 'object' && robots.index === false) return true;
  if (!slug || typeof slug !== 'string') return false;
  return NOINDEX_SET.has(slug.toLowerCase());
}
