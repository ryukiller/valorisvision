#!/usr/bin/env node
/**
 * One-off migration: copy Mongo documents from collection `articles` → `blog`.
 *
 * Safe by design:
 * - Never deletes from `articles`
 * - Skips docs whose `slug` already exists in `blog` (no overwrite)
 * - Supports --dry-run (report only)
 *
 * Run once (from repo root, with MONGODB in .env):
 *   node --env-file=.env scripts/migrate-articles-to-blog.mjs --dry-run
 *   node --env-file=.env scripts/migrate-articles-to-blog.mjs
 *
 * After verifying blog content, you may drop `articles` manually in Compass/shell
 * if it is empty of unique content — this script will not drop it.
 */

import { MongoClient } from 'mongodb'

const dryRun = process.argv.includes('--dry-run')
const uri = process.env.MONGODB

if (!uri) {
  console.error('MONGODB environment variable is not set')
  process.exit(1)
}

const client = new MongoClient(uri)
await client.connect()

const db = client.db('valorisvisio')
const articles = db.collection('articles')
const blog = db.collection('blog')

const sourceCount = await articles.countDocuments({})
const blogCountBefore = await blog.countDocuments({})

console.log(`Source articles: ${sourceCount}`)
console.log(`Blog before:     ${blogCountBefore}`)
console.log(dryRun ? 'Mode: DRY-RUN (no writes)\n' : 'Mode: WRITE\n')

if (sourceCount === 0) {
  console.log('Nothing to migrate. Collection `articles` is empty (or missing).')
  await client.close()
  process.exit(0)
}

const docs = await articles.find({}).toArray()
let copied = 0
let skippedExisting = 0
let skippedNoSlug = 0

for (const doc of docs) {
  const { _id, ...rest } = doc
  const slug = rest.slug

  if (!slug || typeof slug !== 'string') {
    skippedNoSlug++
    console.log(`  skip (no slug): _id=${_id}`)
    continue
  }

  const existing = await blog.findOne({ slug }, { projection: { _id: 1 } })
  if (existing) {
    skippedExisting++
    console.log(`  skip (slug exists in blog): ${slug}`)
    continue
  }

  if (!dryRun) {
    await blog.insertOne({
      ...rest,
      migratedFrom: 'articles',
      migratedAt: new Date(),
      legacyArticlesId: _id,
    })
  }
  copied++
  console.log(`  ${dryRun ? 'would copy' : 'copied'}: ${slug}`)
}

const blogCountAfter = dryRun ? blogCountBefore : await blog.countDocuments({})

console.log('\n--- Summary ---')
console.log(`Copied / would copy: ${copied}`)
console.log(`Skipped (slug in blog): ${skippedExisting}`)
console.log(`Skipped (no slug): ${skippedNoSlug}`)
console.log(`Blog after: ${blogCountAfter}`)
console.log(
  '\nSource collection `articles` was NOT modified. Drop it manually only after you verify blog content.'
)

await client.close()
