# ValorisVisio codebase audit

**Repo:** [ryukiller/valorisvision](https://github.com/ryukiller/valorisvision)  
**Baseline:** `main` @ `f360812` (2026-09-30)  
**Scope:** English Next.js app — crypto scenario calculator, blog, `/learn` SEO section  
**Method:** Static review of source under `src/`, `scripts/`, `public/`, config, and `docs/`. No invented issues; every finding cites a path.

**Effort legend:** S = small (≤1 day / few files), M = medium (multi-file or careful rollout), L = large (architecture / content program).

---

## Executive summary

The app is in reasonable shape for a solo/content-driven product: App Router blog + static `/learn`, CoinGecko-backed calculator, admin-gated AI article generation. The highest risks are **unauthenticated write/import paths** (fixed in this PR for `POST /api/getdata`), **insecure admin defaults if env is missing**, **git-history secrets**, and **ops reliability** (`process.exit` in API routes, Mongo client churn, service worker cache-first). SEO work on `/learn` and noindex lists is solid; sitemap still advertises noindexed posts. Accessibility contrast on the homepage was recently improved; muted/nav text and nested legacy layouts remain gaps.

This PR ships the audit plus **surgical P0 fixes only** (auth defaults, `POST /api/getdata` lock-down, ReDoS escape on coin search, stop `process.exit` in blog Mongo connect). Remaining items are recommendations.

---

## P0 — Critical (fix or rotate soon)

### P0-1 — Unauthenticated bulk CoinGecko → Mongo import  
**Problem:** `POST /api/getdata` imported all CoinGecko market pages into Mongo with **no auth**, no CoinGecko API key header, and a long-running loop. Any client could burn API quota and write the DB.  
**Evidence:** `src/app/api/getdata/route.js` (pre-fix: exported bare `POST`). Compare with authenticated `src/app/api/admin/prices/route.js`.  
**Fix:** Wrap `POST` in `requireAuth`; prefer deprecating this route in favor of `/api/admin/prices`.  
**Effort:** S  
**Status:** **Fixed in this PR** (`requireAuth` + CoinGecko key header + no `process.exit`).

### P0-2 — Insecure admin defaults if env unset  
**Problem:** Missing `ADMIN_PASSWORD_HASH` / `SESSION_SECRET` fell back to password `admin123` and secret `12345`. Production misconfiguration = trivial admin takeover (AI article write, price import).  
**Evidence:** `src/lib/auth.js` (historical defaults); `scripts/internal-bot.mjs` and `docs/internal-bot.md` also document `admin` / `admin123`.  
**Fix:** Fail closed in production when hash/secret missing; rotate real credentials; never document live defaults as production-safe.  
**Effort:** S  
**Status:** **Fixed in this PR** (production runtime refuses missing hash/secret — skipped during `next build`; `timingSafeEqual` for hash/HMAC compare). Dev still allows local defaults.

### P0-3 — Secrets previously committed in git history  
**Problem:** `.env` was committed then deleted; history still contains Mailtrap credentials.  
**Evidence:** `git show e8adfc3:.env` (keys `MAILTRAP_USER`, `MAILTRAP_PASS`, `MAILTRAP_TOKEN`); deleted in `aac2f35`. File is gitignored now (`.gitignore`).  
**Fix:** Rotate/revoke those Mailtrap (and any other) credentials; optionally purge history (`git filter-repo` / BFG). Confirm no other secrets via `git log -p --all -- .env`.  
**Effort:** S (rotate) / M (history rewrite)  
**Status:** Documented only — do not commit rotated secrets here.

### P0-4 — `process.exit(1)` inside request handlers  
**Problem:** Mongo connect failures called `process.exit(1)`, which can tear down the Node process / serverless isolate for the whole site.  
**Evidence:** Was in `src/app/api/getdata/route.js`, `src/app/api/blog/route.js`, `src/app/api/blog/[slug]/route.js`.  
**Fix:** Throw / return 500; use a shared Mongo helper (`src/lib/blog.js` pattern).  
**Effort:** S  
**Status:** **Fixed in this PR** for the three routes above. Admin routes still construct clients per module — see P1.

---

## P1 — High (should schedule)

### P1-1 — No login rate limit / lockout  
**Problem:** `POST /api/admin/auth` accepts unlimited password attempts. SHA-256 password hashing is fast → online brute force is cheap.  
**Evidence:** `src/app/api/admin/auth/route.js`; `authenticateUser` in `src/lib/auth.js`.  
**Fix:** Rate-limit by IP (middleware, Netlify edge, or in-memory token bucket); consider slow hash (scrypt/argon2) for stored passwords.  
**Effort:** S–M

### P1-2 — Admin UI cannot see `httpOnly` session cookie  
**Problem:** After refresh, auth check uses `document.cookie.includes('admin_session')`, but the cookie is `httpOnly: true`, so the client never sees it → false logged-out state (or broken “session present” detection).  
**Evidence:** `src/app/admin/page.js` (`checkAuthStatus`); cookie set in `src/app/api/admin/auth/route.js`.  
**Fix:** Add `GET /api/admin/auth` (or `/api/admin/me`) that uses `getCurrentUser()` server-side.  
**Effort:** S

### P1-3 — Contact honeypot field name mismatch  
**Problem:** UI sends `website`; API checks `honeypot`. Spam bots are not filtered; real bots filling `website` are ignored.  
**Evidence:** `src/rgcomponents/FeedBack.js` (`name="website"`); `src/app/api/send/route.js` (`honeypot`).  
**Fix:** Align names (prefer hidden `honeypot`) and add basic rate limiting on `/api/send`.  
**Effort:** S

### P1-4 — `EMAIL_PASS` trailing space  
**Problem:** `process.env.EMAIL_PASS + " "` appends a space, which commonly breaks SMTP auth.  
**Evidence:** `src/app/api/send/route.js` line 9.  
**Fix:** Use `process.env.EMAIL_PASS` only; document `EMAIL` / `EMAIL_PASS` in `.env.example`.  
**Effort:** S

### P1-5 — Service worker cache-first for navigations  
**Problem:** `public/sw.js` caches `/` and `/blog` on install and serves `caches.match` before network → stale homepage/blog after deploys.  
**Evidence:** `public/sw.js`; registered from `src/app/layout.js`.  
**Fix:** Network-first for HTML; versioned cache name + skip waiting; or remove SW until a real PWA strategy exists.  
**Effort:** S

### P1-6 — Sitemap includes noindex blog URLs  
**Problem:** `shouldNoindexBlogPost` is applied in post metadata but **not** when building the sitemap → Google still discovers thin/outdated URLs.  
**Evidence:** `src/app/sitemap.js` maps all `getBlogPosts` results; list in `src/lib/seo/noindex-blog-slugs.js`; hygiene notes in `docs/seo-blog-hygiene.md`.  
**Fix:** Filter with `shouldNoindexBlogPost(a.slug, a)` before emitting URLs; optionally omit `/privacy` and `/cookies` (noindex intent) and the typo utility page.  
**Effort:** S

### P1-7 — Nested root layouts + `next/head` on App Router pages  
**Problem:** `privacy`, `cookies`, and `highlithed-word-counter` each render a full `<html>` tree and use `next/head` (Pages-router API). In App Router this duplicates/ignores metadata and can break noindex/theme/fonts.  
**Evidence:** `src/app/privacy/layout.js`, `src/app/cookies/layout.js`, `src/app/highlithed-word-counter/layout.js` vs root `src/app/layout.js`.  
**Fix:** Delete nested `<html>` layouts; move robots/title into `export const metadata`.  
**Effort:** S–M

### P1-8 — Mongo connection pattern inconsistent / fragile  
**Problem:** Most API routes create module-level `new MongoClient(uri)` and connect/close per request (or never reuse). Undefined `MONGODB` constructs an invalid client at import. Historical SRV DNS issues are noted in `.env.example`. Admin **articles** API writes collection `articles` while the live blog uses `blog`.  
**Evidence:** `src/app/api/admin/articles/route.js` (`"articles"`); `src/lib/blog.js` (`'blog'`); per-route clients in `getdata`, `blog`, `admin/prices`.  
**Fix:** One shared `clientPromise` helper; fail fast if `MONGODB` missing; point admin CRUD at `blog` or drop dead `articles` path. Prefer non-SRV URI when SRV fails (already documented).  
**Effort:** M

### P1-9 — `create-article` proxy drops auth + wrong default port  
**Problem:** Server-side `fetch` to `/api/blog` does not forward the admin cookie, and defaults to `localhost:3001`.  
**Evidence:** `src/app/api/admin/create-article/route.js`. Admin UI already posts directly to `/api/blog` (`src/app/admin/page.js`).  
**Fix:** Remove the proxy or call article creation logic in-process; never re-fetch without cookies.  
**Effort:** S

### P1-10 — OpenAI / article path error surface  
**Problem:** `POST /api/blog` can return raw `error.message` to clients; long-running generation has no timeout/idempotency; `JSON.parse` of model output can throw; image failure aborts after expensive text gen.  
**Evidence:** `src/app/api/blog/route.js` (catch returns `error.message`; no `OPENAI_API_KEY` pre-check). CLI: `scripts/internal-bot.mjs`, `docs/internal-bot.md`.  
**Fix:** Preflight env checks; sanitize errors; optional two-phase save (draft without image); set route `maxDuration` on host.  
**Effort:** M

### P1-11 — Client fetches depend on unset `NEXT_PUBLIC_API_URL`  
**Problem:** Sidebar / fallback client post fetch use `` `${process.env.NEXT_PUBLIC_API_URL}/api/blog...` ``. If unset → `undefined/api/...` broken URLs. Server-rendered path mostly avoids this now.  
**Evidence:** `src/app/blog/[slug]/ClientPost.js`, `src/app/blog/[slug]/Sidebar.js`.  
**Fix:** Use relative `/api/...` or document required env; prefer server data only (already done for main article body).  
**Effort:** S

### P1-12 — Unescaped user search → RegExp  
**Problem:** Coin search built `new RegExp(searchTerm, 'i')` without escaping (ReDoS / odd matches).  
**Evidence:** `src/app/api/getdata/route.js` GET handler.  
**Fix:** Escape metacharacters.  
**Effort:** S  
**Status:** **Fixed in this PR.**

### P1-13 — Weak password hashing + non–timing-safe compares (partially fixed)  
**Problem:** SHA-256 is not a password KDF; string `===` on hashes/HMAC was timing-vulnerable.  
**Evidence:** `src/lib/auth.js`.  
**Fix:** Migrate to scrypt/argon2 hashes; keep constant-time compare.  
**Effort:** M  
**Status:** Timing-safe hex compare **done** in this PR; KDF upgrade still recommended.

---

## P2 — Medium / hygiene

### P2-1 — Homepage is a full client component  
**Problem:** `src/app/page.js` is `'use client'` with Framer Motion + calculator + recent articles → larger JS for LCP/SEO crawl of marketing copy.  
**Fix:** Server page shell; client island for `ModernCalculator` only.  
**Effort:** M

### P2-2 — Calculator / coin picker weight  
**Problem:** `ModernCalculator` + `GetCoinsData` pull cmdk, popover, framer-motion, lucide; artificial 800ms delay on calculate.  
**Evidence:** `src/components/ModernCalculator.js`, `src/rgcomponents/GetCoinsData.js`.  
**Fix:** Lazy-load coin picker; drop fake delay; dynamic `import()` for motion.  
**Effort:** M

### P2-3 — In-memory cache only  
**Problem:** `src/lib/cache.js` is process-local Map — ineffective across serverless instances; TTL fine for single Node.  
**Fix:** Accept limitation on Netlify, or use HTTP `Cache-Control` / CDN for GET `/api/getdata`.  
**Effort:** S–M

### P2-4 — `generateEtags: false` / no HTTP cache headers on APIs  
**Problem:** `next.config.js` disables ETags; API routes do not set `Cache-Control`.  
**Fix:** Short public cache for coin list GET; keep admin routes private.  
**Effort:** S

### P2-5 — Dead / unused UI primitives  
**Problem:** Many shadcn files under `src/components/ui/` appear unused by app code (e.g. hover-card, avatar, navigation-menu, accordion). Admin page uses try/catch `require` + emoji icon stubs.  
**Evidence:** `src/components/ui/*`; `src/app/admin/page.js`.  
**Fix:** Trim unused UI or wire admin to real icons; simplify admin.  
**Effort:** S

### P2-6 — Typo utility page in sitemap  
**Problem:** `/highlithed-word-counter` is a Chrome-extension promo page with a misspelled slug, listed in sitemap at priority 0.3.  
**Evidence:** `src/app/sitemap.js`, `src/app/highlithed-word-counter/`.  
**Fix:** noindex + remove from sitemap, or redirect/rename if still needed.  
**Effort:** S

### P2-7 — Blog pagination `Link` `query` shape  
**Problem:** App Router `Link` expects `searchParams` / href strings; `{ pathname, query }` is Pages-router style and may not paginate correctly under Next 16.  
**Evidence:** `src/app/blog/page.js`, `src/app/blog/category/[slug]/page.js`.  
**Fix:** `href={`/blog?page=${n}`}` style.  
**Effort:** S

### P2-8 — XSS posture (generally OK)  
**Problem:** None critical found. Blog/learn use `react-markdown` **without** `rehype-raw` (HTML escaped). JSON-LD uses `dangerouslySetInnerHTML` with `<` → `\u003c` escaping.  
**Evidence:** `src/app/blog/[slug]/ClientPost.js`, `src/app/learn/**`, `src/app/blog/[slug]/page.js`.  
**Fix:** Keep avoiding `rehype-raw`; sanitize if HTML ever stored. `dangerouslyAllowSVG: true` in `next.config.js` is acceptable with the CSP sandbox on images — review if remote SVG hosts expand.  
**Effort:** — (monitor)

### P2-9 — No automated tests for critical paths  
**Problem:** No Jest/Vitest/Playwright; package scripts are build/lint/tool only.  
**Evidence:** `package.json`; CLAUDE.md notes no test framework.  
**Fix:** Add API tests for auth gate on import/blog POST; calculator unit for market-cap math; smoke e2e for `/learn` + blog metadata.  
**Effort:** M

### P2-10 — Learn stub hubs in sitemap  
**Problem:** Stub clusters (`depth: 'stub'`) are included in sitemap at priority 0.5 — OK if intentional thin hubs, but thin content can dilute crawl budget.  
**Evidence:** `src/lib/learn.js` `getLearnSitemapEntries`; stubs at liquid-staking-adjacent / tax-ish clusters.  
**Fix:** Editorial: either flesh stubs or lower priority / delay indexing until solid.  
**Effort:** S (config) / M (content)

### P2-11 — Cookie flags mostly good; session is HMAC(base64 JSON)  
**Problem:** Cookie uses `httpOnly`, `sameSite: 'strict'`, `secure` in production — good. Token is not a real JWT; no server-side revocation list.  
**Evidence:** `src/app/api/admin/auth/route.js`, `src/lib/auth.js`.  
**Fix:** Optional short TTL + refresh; or signed JWT with `jose`.  
**Effort:** M

### P2-12 — `.env.example` quality  
**Problem:** Example `ADMIN_PASSWORD_HASH=e3afed0047b08059d0fada10f400c1e5` is not a full SHA-256 hex (32 hex chars ≈ MD5 length) — confusing. Missing `EMAIL` / `EMAIL_PASS` / `COINGECKO` already present; OpenAI model names look like placeholders.  
**Evidence:** `.env.example`.  
**Fix:** Use an obvious fake 64-char hex and comments; list all required keys.  
**Effort:** S

---

## Accessibility (remaining gaps)

Recent homepage contrast work (`src/app/page.js`, `globals.css`, button variants) improved hero/body readability. Remaining:

| Gap | Evidence | Suggestion | Effort |
| --- | --- | --- | --- |
| Nav / term labels use `text-muted-foreground` (dark: ~58% L on near-black) | `Header.js`, `.term-label` in `globals.css` | Bump muted to ~65%+ L or use `text-foreground/75` for primary nav | S |
| Prose uses `text-foreground/70`–`/80` | `.prose-cyber` rules in `globals.css` | Target WCAG AA (≥4.5:1) for body | S |
| Decorative hero `alt=""` | `src/app/page.js` | OK if truly decorative; ensure nearby text conveys meaning | — |
| Scanline overlay `z-index: 9999` | `globals.css` `body::after` | Confirm it never traps focus (pointer-events: none is set — OK) | — |
| Admin emoji “icons” | `src/app/admin/page.js` | Prefer lucide + text labels | S |
| Feedback form validation messages say “Username” for email/subject | `FeedBack.js` Zod messages | Copy fix | S |

---

## SEO / learn + blog consistency

**What’s working**

- `/learn` hubs + articles with canonicals and JSON-LD (`src/app/learn/**`, `src/lib/learn.js`).
- Blog → Learn map UI (`RelatedLearnLinks`, `src/lib/seo/blog-to-learn-map.js`).
- Noindex allowlist + Mongo flags (`src/lib/seo/noindex-blog-slugs.js`, blog `generateMetadata`).
- Dynamic sitemap includes learn + blog; `robots.js` disallows `/api/` and `/admin/`.
- Slug redirects via `slug-redirects.json` + `next.config.js`.

**Gaps**

- Sitemap ↔ noindex mismatch (P1-6).
- Privacy/cookies noindex may not apply reliably due to nested layouts / `next/head` (P1-7).
- Italian-titled post noted in `docs/seo-week1-audit.md` still on English site.
- `docs/internal-bot.md` still mentions updating `public/sitemap.xml` though sitemap is dynamic (`src/app/sitemap.js`) — docs drift.

---

## Reliability notes (CoinGecko / OpenAI / Mongo / tool:article)

| Path | Observation |
| --- | --- |
| Admin prices | Good: retries, 403/429 messages, API key header, aborts if page 1 fails (`admin/prices/route.js`). |
| Legacy getdata POST | Was weaker; now auth-gated (this PR). Prefer deleting once admin prices is the only importer. |
| tool:article | CLI login → `POST /api/blog`; needs long client timeout; depends on `OPENAI_*` + Mongo + writable `public/imgs/`. |
| Mongo SRV | `.env.example` documents non-SRV fallback — keep that in deploy runbooks. |
| GET coins | In-memory cache 5m; errors return 500 without leaking stacks — OK. |

---

## DX / maintainability

- **JS not TS** despite user CRM rules elsewhere — fine for this repo; types absent.
- **Dual blogs collections** (`blog` vs `articles`) confuse admin APIs.
- **No middleware.ts** for centralized auth/rate limits.
- **CLAUDE.md** still describes Next 14-ish patterns; app is on Next **16.3.7**.
- **Lint only** — `npm run lint`; no CI test gate visible in-repo from this audit.

---

## Changes included in this PR (surgical)

1. `src/lib/auth.js` — refuse missing prod secrets; constant-time hash/HMAC compare.  
2. `src/app/api/getdata/route.js` — auth on `POST`; escape search regex; no `process.exit`; CoinGecko key header.  
3. `src/app/api/blog/route.js` + `[slug]/route.js` — `throw` instead of `process.exit`.  
4. This document.

---

## Suggested next 10 actions (owner)

See PR description for the Italian-friendly top-10 list. Ranked by impact: rotate history secrets → confirm prod env → ship sitemap noindex filter → fix honeypot/email → fix admin session check → remove/replace SW → collapse nested layouts → shared Mongo helper → rate-limit auth/send → add smoke tests.
