# Blog SEO helpers (noindex + Learn internal links)

## Noindex thin / outdated blog posts

**File:** `src/lib/seo/noindex-blog-slugs.js`

`generateMetadata` in `src/app/blog/[slug]/page.js` calls `shouldNoindexBlogPost(slug, article)`. When true, the page emits:

```js
robots: { index: false, follow: true }
```

A post is noindexed if **any** of these apply:

1. Its slug is listed in `NOINDEX_BLOG_SLUGS` (initial set = week 1 audit §C thin/outdated 2024 posts, prioritized in week 4 notes).
2. The Mongo document has `noindex: true`.
3. The Mongo document has `seo.robots` set to a noindex string, or `{ index: false }`.

### Add a slug

1. Confirm the canonical short slug.
2. Append it to `NOINDEX_BLOG_SLUGS` in `noindex-blog-slugs.js`.
3. Optionally set `noindex: true` on the Mongo article (CMS/admin) so the flag survives even if the code list is trimmed later.
4. Redeploy so metadata refreshes (`revalidate = 3600` on the blog page).

### Do not noindex

KEEP and EVERGREEN-CANDIDATE posts from `docs/seo-week1-audit.md` without a second editorial pass — especially recent high-value 2026 evergreen-candidate posts.

---

## Blog → Learn related links

**File:** `src/lib/seo/blog-to-learn-map.js`  
**UI:** `src/components/RelatedLearnLinks.js` (rendered at the end of the blog article body in `ClientPost`).

Blog markdown lives in MongoDB, so in-repo edits cannot patch article bodies. The map drives a “Evergreen Learn guides” panel on matching posts.

### Add a mapping

```js
'your-blog-slug': [
  {
    href: '/learn/some-cluster/some-guide',
    title: 'User-facing title',
    description: 'Optional one-liner',
  },
],
```

Current seeded slugs include PeerDAS/Fusaka, Glamsterdam/ePBS, L2 economics, SEC staking receipt / JitoSOL, Bitwise NEAR ETF, IBIT / institutional ETF news, Illinois tax draft → `/learn/crypto-tax`.

### Optional Mongo body links

If a content bot or admin API can patch articles, also add one inline “Evergreen guide” link in the intro or footer for link-equity. The UI map still keeps a consistent further-reading block when bodies are stale.
