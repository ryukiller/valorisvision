// One-off migration: convert existing article hero PNGs to WebP (q80),
// update imageUrl in MongoDB, and delete the original PNGs.
//
// Run: node --env-file=.env scripts/convert-images.mjs
// Safe to re-run: articles already pointing at .webp are skipped.

import { MongoClient } from 'mongodb';
import sharp from 'sharp';
import { existsSync } from 'fs';
import { unlink, stat } from 'fs/promises';
import path from 'path';

const root = process.cwd();
const client = new MongoClient(process.env.MONGODB);
await client.connect();
const collection = client.db('valorisvisio').collection('blog');

let before = 0;
let after = 0;
let converted = 0;

for (const doc of await collection.find({ imageUrl: { $exists: true } }).toArray()) {
  const url = doc.imageUrl || '';
  if (!url.startsWith('/imgs/') || !url.endsWith('.png')) continue;

  const pngPath = path.join(root, 'public', url);
  if (!existsSync(pngPath)) {
    console.log('missing file, skipping:', url);
    continue;
  }

  const webpPath = pngPath.replace(/\.png$/, '.webp');
  before += (await stat(pngPath)).size;

  await sharp(pngPath).webp({ quality: 80, effort: 4 }).toFile(webpPath);
  await unlink(pngPath);

  const webpUrl = url.replace(/\.png$/, '.webp');
  after += (await stat(webpPath)).size;
  await collection.updateOne({ _id: doc._id }, { $set: { imageUrl: webpUrl } });
  converted++;
  console.log(`  ${url} -> ${webpUrl}`);
}

console.log(
  `\nConverted ${converted} images: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`
);
await client.close();
