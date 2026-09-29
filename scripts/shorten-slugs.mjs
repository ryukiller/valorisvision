// One-off migration: shorten long blog slugs (max 6 words) and record 308
// redirects from the old slugs in slug-redirects.json (consumed by
// next.config.js `redirects()`).
//
// Run: node --env-file=.env scripts/shorten-slugs.mjs
// Safe to re-run: already-short slugs are skipped, existing redirects are kept.

import { MongoClient } from 'mongodb';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const root = process.cwd();
const redirectFile = path.join(root, 'slug-redirects.json');

function slugify(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function shortSlug(title, fallback) {
  let s = slugify(title).split('-').slice(0, 6).join('-');
  if (s.length < 8) s = (s + '-' + slugify(fallback || '')).split('-').slice(0, 6).join('-');
  return s;
}

const client = new MongoClient(process.env.MONGODB);
await client.connect();
const collection = client.db('valorisvisio').collection('blog');

const docs = await collection
  .find({}, { projection: { slug: 1, title: 1, seo_keywords: 1 } })
  .sort({ createdAt: 1 })
  .toArray();

// Previously recorded redirects (from earlier runs)
let redirects = existsSync(redirectFile) ? JSON.parse(readFileSync(redirectFile, 'utf8')) : [];
const redirectedFrom = new Set(redirects.map((r) => r.source));

// Slugs that cannot be reused (short slugs that stay put)
const taken = new Set(docs.map((d) => d.slug));

const changes = [];
for (const doc of docs) {
  const current = doc.slug;
  if (current.split('-').length <= 6) continue;

  // Free the old slug if it was never redirected away
  if (!redirectedFrom.has(`/blog/${current}`)) {
    taken.delete(current);
  }

  const base = shortSlug(doc.title, doc.seo_keywords?.primary || doc.title);
  let candidate = base;
  let n = 2;
  while (taken.has(candidate)) candidate = `${base}-${n++}`;
  taken.add(candidate);

  if (candidate !== current) {
    changes.push({ from: current, to: candidate });
    await collection.updateOne({ slug: current }, { $set: { slug: candidate } });
    if (!redirectedFrom.has(`/blog/${current}`)) {
      redirects.push({ source: `/blog/${current}`, destination: `/blog/${candidate}` });
    }
  }
}

writeFileSync(redirectFile, JSON.stringify(redirects, null, 2) + '\n');

console.log(`Renamed ${changes.length} slugs. Total redirect entries: ${redirects.length}`);
for (const c of changes.slice(0, 10)) console.log(`  ${c.from} -> ${c.to}`);
if (changes.length > 10) console.log(`  ... and ${changes.length - 10} more`);

await client.close();
