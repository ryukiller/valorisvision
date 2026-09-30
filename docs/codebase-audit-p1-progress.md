# Codebase audit — P1 progress

**Baseline:** `main` @ `f61265c` (P0 audit merge)  
**This PR:** urgent P1 code fixes (one PR)

## Done in this PR

| ID | Item | Change |
| --- | --- | --- |
| P1-1 | Admin login rate limit | In-memory limiter on `POST /api/admin/auth` via `src/lib/rate-limit.js` (10 / 15 min / IP). **Limitation:** per-instance only on serverless multi-instance hosts. |
| P1-2 | Admin session probe | `GET /api/admin/me` + admin UI uses it instead of `document.cookie`. |
| P1-3 | Feedback honeypot | UI field renamed `website` → `honeypot`; API accepts both; rate limit on `POST /api/send` (5 / 15 min / IP). |
| P1-4 | SMTP trailing space | Removed `EMAIL_PASS + " "`; documented `EMAIL` / `EMAIL_PASS` in `.env.example`. |
| P1-5 | Service worker | `public/sw.js` v2: network-first for navigations/HTML; cache-first only for listed static assets; `skipWaiting` + `clients.claim`. |
| P1-6 | Sitemap noindex | Filter blog URLs with `shouldNoindexBlogPost`; omit `/privacy`, `/cookies`, `/highlithed-word-counter`. |
| P1-7 | Nested layouts / `next/head` | Deleted nested `<html>` layouts for privacy/cookies/highlighted; metadata (+ `robots: noindex`) on each `page.js`; Cookiebot Script kept on cookies page. |
| P1-8 (start) | Shared Mongo client | Added `src/lib/mongodb.js`; migrated `blog.js` + API routes (`getdata`, `blog`, `blog/[slug]`, `admin/prices`, `admin/articles`) to lazy shared client. **Still open:** `articles` vs `blog` collection unify. |

Also: checkboxes updated in `docs/codebase-audit.md` for the items above.

## Still open (owner / follow-up)

| Item | Notes |
| --- | --- |
| **P0-3 secret rotation** | Rotate/revoke Mailtrap (and any other) credentials from git history; set production `ADMIN_PASSWORD_HASH` + `SESSION_SECRET`. Ops only — not committed here. |
| P1-8 remainder | Migrate API routes (`getdata`, `blog`, `admin/prices`) to shared client; unify admin `articles` collection → live `blog`. |
| P1-9 | `create-article` proxy auth/port |
| P1-10 | OpenAI / article error surface |
| P1-11 | `NEXT_PUBLIC_API_URL` client fetches |
| P1-13 | Upgrade password hashing to scrypt/argon2 |
| P2+ | Homepage SSR split, calculator weight, tests, etc. |

## Rate-limit caveat (document for ops)

`src/lib/rate-limit.js` uses a process-local `Map`. On Netlify/Vercel (or any multi-isolate deploy), each instance has its own counter. Acceptable as a first line of defense; replace with Edge/CDN or Redis for global limits.
