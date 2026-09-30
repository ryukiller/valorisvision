# Codebase audit — P1 progress

**Baseline:** `main` @ `7dd0402` (urgent P1 merge)  
**This PR:** remaining actionable P1 — `articles`→`blog` unify + P1-9/10/11/13

## Done in prior P1 PR (`7dd0402`)

| ID | Item | Change |
| --- | --- | --- |
| P1-1 | Admin login rate limit | In-memory limiter on `POST /api/admin/auth` |
| P1-2 | Admin session probe | `GET /api/admin/me` |
| P1-3 | Feedback honeypot | Field rename + rate limit on `/api/send` |
| P1-4 | SMTP trailing space | Removed; `.env.example` docs |
| P1-5 | Service worker | Network-first HTML; `valorisvisio-v2` |
| P1-6 | Sitemap noindex | Filter + omit privacy/cookies/typo page |
| P1-7 | Nested layouts | Removed; metadata on pages |
| P1-8 (partial) | Shared Mongo client | `src/lib/mongodb.js` + route migration |

## Done in this PR

| ID | Item | Change |
| --- | --- | --- |
| **P1-8 remainder** | Unify `articles` → `blog` | Admin CRUD (`/api/admin/articles`) now uses collection `blog`. Removed broken `client.close()`. Safe one-off migration script (see below). |
| **P1-9** | `create-article` proxy | Route returns **410** with pointer to `POST /api/blog` (no cookie-less re-fetch, no port 3001). |
| **P1-10** | OpenAI / article errors | Preflight `OPENAI_API_KEY`; sanitized client errors; safe JSON parse; image failure no longer aborts text save (`status: published_no_image` + warning); `maxDuration = 60` (Vercel Hobby max). |
| **P1-11** | `NEXT_PUBLIC_API_URL` | `ClientPost` + `Sidebar` use relative `/api/blog...` URLs. |
| **P1-13** | Password KDF | `scrypt$salt$hash` via `hashPassword` / `verifyPassword`; legacy SHA-256 hex still accepted. `.env.example` updated. |

Also: checkboxes updated in `docs/codebase-audit.md`.

## Migration: `articles` → `blog` (Rian — run once)

App code now reads/writes **only** `blog`. If an old `articles` collection still has unique posts, copy them once:

```bash
# Preview (no writes)
npm run migrate:articles-to-blog -- --dry-run
# or: node --env-file=.env scripts/migrate-articles-to-blog.mjs --dry-run

# Copy missing slugs into blog (never deletes `articles`, never overwrites existing blog slugs)
npm run migrate:articles-to-blog
# or: node --env-file=.env scripts/migrate-articles-to-blog.mjs
```

After verifying content in Compass / the public blog, you may **manually** drop `articles` if it has no remaining unique docs. The script will not drop it.

## Ops: rotate to scrypt password hash (optional, recommended)

Existing `ADMIN_PASSWORD_HASH` as bare SHA-256 hex still works. To upgrade:

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16);const h=c.scryptSync('YOUR_PASSWORD',s,64,{N:16384,r:8,p:1});console.log('scrypt$'+s.toString('hex')+'$'+h.toString('hex'))"
```

Set the printed value as `ADMIN_PASSWORD_HASH` in production env (do not commit secrets).

## Still open (owner / follow-up)

| Item | Notes |
| --- | --- |
| **P0-3 secret rotation** | Rotate/revoke Mailtrap (and any other) credentials from git history; set production `ADMIN_PASSWORD_HASH` (prefer scrypt) + `SESSION_SECRET`. Ops only. |
| P2+ | Homepage SSR split, calculator weight, tests, a11y muted text, etc. |
| XSS / markdown | Audit **P2-8** (monitor) — not P1; `react-markdown` without `rehype-raw` remains correct. |

## Rate-limit caveat (unchanged)

`src/lib/rate-limit.js` is process-local. Fine as a first line; use Edge/CDN or Redis for global limits on multi-isolate hosts.
