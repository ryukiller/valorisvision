# Blog images — git vs local originals

Keep the repo and Vercel deploy small: **commit only optimized heroes** under
`public/imgs/`. Keep heavy sources on disk locally; never push them.

Newer articles store covers in Mongo (`blog_images`) and serve them from
`/api/article-image/[name]` (see PR #21 / #22). That path is unchanged.
This doc is for **legacy** static files under `public/imgs/` and any manual
assets you still commit there.

## Layout

| Path | Role | In git? |
|------|------|---------|
| `public/imgs/*.webp` (and rare `.png`/`.jpg`) | Optimized files the site serves at `/imgs/...` | Yes |
| `local/imgs-originals/` | Heavy / unoptimized sources | **No** (gitignored) |
| `public/imgs/originals/` | Alternate dump folder (also ignored) | **No** |
| `*-original*`, `*.original.*`, `*-raw.*` under `public/imgs/` | Accidental fat dumps | **No** |

## Workflow (human or bot)

1. Drop the full-resolution source into `local/imgs-originals/`  
   (create the folder if needed; it is gitignored).
2. Run:

   ```bash
   npm run images:optimize
   ```

   This writes WebP into `public/imgs/` (max width 1920, quality ~72 by default).
3. Commit **only** the new/updated files under `public/imgs/`.
4. Do **not** `git add local/imgs-originals/` or any `*-original*` dump.

### Re-encode fat files already in `public/imgs/`

If legacy committed assets are still large, shrink them **in place** (same
filenames / public URLs — no Mongo migration):

```bash
npm run images:optimize -- --reencode
# optional: npm run images:optimize -- --reencode --dry-run
# optional: --quality 72 --max-width 1920 --min-bytes 180000
```

PNG heroes stay `.png` by default so existing `/imgs/....png` URLs keep
working (e.g. in-article embeds). To convert orphan PNGs to WebP with the
same basename:

```bash
npm run images:optimize -- --reencode --png-to-webp
```

For PNGs still referenced as `imageUrl` in Mongo, prefer
`scripts/convert-images.mjs` (updates `imageUrl` and deletes the PNG).

### Italian (ops)

- Originali pesanti → `local/imgs-originals/` (ignorati da git).
- Poi `npm run images:optimize` → WebP ottimizzati in `public/imgs/`.
- Committa solo l’output in `public/imgs/`. Nuovi articoli del bot usano Mongo
  (`/api/article-image/`), non `public/imgs/`.

## Do not

- Commit raw AI dumps, Photoshop sources, or multi‑MB PNGs under `public/imgs/`.
- Rely on writing images to `public/` at request time in production (serverless
  filesystem is ephemeral); use Mongo + `/api/article-image/` for new posts.
- Change filenames of legacy `/imgs/...` assets unless you also update Mongo
  `imageUrl` (or run `convert-images.mjs`).
