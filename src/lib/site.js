// Shared social meta constants.
// Note: Next.js metadata objects are replaced (not deep-merged) per segment,
// so page-level openGraph/twitter definitions must re-include these keys.
export const SITE_NAME = 'ValorisVisio';
export const OG_LOCALE = 'en_US';

// twitter:site — set NEXT_PUBLIC_TWITTER_SITE (e.g. @valorisvisio) to emit it.
export function twitterSite() {
  return process.env.NEXT_PUBLIC_TWITTER_SITE
    ? { site: process.env.NEXT_PUBLIC_TWITTER_SITE }
    : {};
}
