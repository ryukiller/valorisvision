#!/usr/bin/env node
/**
 * Optimize blog hero images for git / Vercel.
 *
 * Conventions:
 *   local/imgs-originals/  — heavy sources (gitignored, local only)
 *   public/imgs/           — optimized assets the site serves (committed)
 *
 * Modes:
 *   npm run images:optimize
 *     Read originals from local/imgs-originals/ → write WebP into public/imgs/
 *
 *   npm run images:optimize -- --reencode
 *     Re-encode oversized files already in public/imgs/ in place
 *     (same filenames / public URLs). Use after pulling fat legacy assets.
 *
 * No secrets / Mongo required. Does not touch Mongo-backed /api/article-image/.
 *
 * Options:
 *   --reencode          In-place pass over public/imgs/
 *   --dir <path>        Source dir for originals (default: local/imgs-originals)
 *   --out <path>        Output dir (default: public/imgs)
 *   --max-width <n>     Max width px (default: 1920)
 *   --quality <n>       WebP quality 1–100 (default: 78)
 *   --min-bytes <n>     Only re-encode files larger than this (default: 200000)
 *   --dry-run           Print plan without writing
 *   --png-to-webp       With --reencode: write .webp beside/instead of .png
 *                       (same basename). Removes the .png only when the WebP
 *                       is smaller. Prefer for orphan PNGs; for live
 *                       /imgs/*.png URLs keep PNG or run convert-images.mjs.
 */

import sharp from 'sharp';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import path from 'path';

const root = process.cwd();

const DEFAULTS = {
  dir: path.join(root, 'local', 'imgs-originals'),
  out: path.join(root, 'public', 'imgs'),
  maxWidth: 1920,
  quality: 72,
  minBytes: 180_000,
  effort: 4,
};

const IMAGE_EXT = new Set([
  '.webp',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.tif',
  '.tiff',
  '.avif',
]);

function parseArgs(argv) {
  const opts = { ...DEFAULTS, reencode: false, dryRun: false, pngToWebp: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--reencode') opts.reencode = true;
    else if (a === '--png-to-webp') opts.pngToWebp = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--dir') opts.dir = path.resolve(argv[++i]);
    else if (a === '--out') opts.out = path.resolve(argv[++i]);
    else if (a === '--max-width') opts.maxWidth = Number(argv[++i]);
    else if (a === '--quality') opts.quality = Number(argv[++i]);
    else if (a === '--min-bytes') opts.minBytes = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(`Usage:
  node scripts/optimize-imgs.mjs [--dir DIR] [--out DIR] [--max-width N] [--quality N]
  node scripts/optimize-imgs.mjs --reencode [--min-bytes N] [--max-width N] [--quality N]
  node scripts/optimize-imgs.mjs --dry-run ...`);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return opts;
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      return IMAGE_EXT.has(ext) && !name.startsWith('.');
    })
    .map((name) => path.join(dir, name));
}

function fmtKb(n) {
  return `${(n / 1024).toFixed(1)}K`;
}

async function encodeBuffer(inputPath, { maxWidth, quality, effort, format }) {
  let pipeline = sharp(inputPath).rotate();
  const meta = await pipeline.metadata();
  const width = meta.width || 0;
  if (width > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });
  }

  if (format === 'webp') {
    return pipeline.webp({ quality, effort }).toBuffer();
  }
  if (format === 'jpeg' || format === 'jpg') {
    return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  }
  // Keep PNG extension for legacy /imgs/*.png URLs; compress aggressively.
  return pipeline
    .png({ compressionLevel: 9, effort: 10, quality: Math.min(quality, 90) })
    .toBuffer();
}

async function writeAtomic(outPath, buffer, dryRun) {
  if (dryRun) return;
  const dir = path.dirname(outPath);
  mkdirSync(dir, { recursive: true });
  const tmp = `${outPath}.tmp-${process.pid}`;
  writeFileSync(tmp, buffer);
  renameSync(tmp, outPath);
}

async function optimizeOriginals(opts) {
  const sources = listImages(opts.dir);
  if (sources.length === 0) {
    console.log(
      `No images in ${path.relative(root, opts.dir) || opts.dir}.\n` +
        `Drop heavy originals there, then re-run. Output goes to ${path.relative(root, opts.out)}.`
    );
    return { before: 0, after: 0, count: 0 };
  }

  mkdirSync(opts.out, { recursive: true });
  let before = 0;
  let after = 0;
  let count = 0;

  for (const src of sources) {
    const base = path.basename(src, path.extname(src));
    // Strip common "original" suffixes so output names stay clean.
    const cleanBase = base
      .replace(/[-_.]?original$/i, '')
      .replace(/[-_.]?raw$/i, '');
    const outName = `${cleanBase}.webp`;
    const outPath = path.join(opts.out, outName);
    const inSize = statSync(src).size;
    before += inSize;

    const buffer = await encodeBuffer(src, {
      maxWidth: opts.maxWidth,
      quality: opts.quality,
      effort: opts.effort,
      format: 'webp',
    });
    after += buffer.length;
    count++;

    const relSrc = path.relative(root, src);
    const relOut = path.relative(root, outPath);
    console.log(
      `  ${relSrc} (${fmtKb(inSize)}) → ${relOut} (${fmtKb(buffer.length)})`
    );
    await writeAtomic(outPath, buffer, opts.dryRun);
  }

  return { before, after, count };
}

async function reencodePublic(opts) {
  const files = listImages(opts.out);
  let before = 0;
  let after = 0;
  let count = 0;
  let skipped = 0;

  for (const file of files) {
    const inSize = statSync(file).size;
    if (inSize < opts.minBytes) {
      skipped++;
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    let format = 'webp';
    let outPath = file;
    if (ext === '.png') {
      if (opts.pngToWebp) {
        format = 'webp';
        outPath = file.replace(/\.png$/i, '.webp');
      } else {
        format = 'png';
      }
    } else if (ext === '.jpg' || ext === '.jpeg') format = 'jpeg';
    else if (ext === '.webp') format = 'webp';
    else {
      console.log(`  skip (unsupported for in-place): ${path.relative(root, file)}`);
      skipped++;
      continue;
    }

    const buffer = await encodeBuffer(file, {
      maxWidth: opts.maxWidth,
      quality: opts.quality,
      effort: opts.effort,
      format,
    });

    // Only replace when meaningfully smaller (avoid churn / quality loss for free).
    if (buffer.length >= inSize * 0.97) {
      console.log(
        `  keep ${path.relative(root, file)} (${fmtKb(inSize)}; re-encode not smaller)`
      );
      skipped++;
      continue;
    }

    before += inSize;
    after += buffer.length;
    count++;
    const relIn = path.relative(root, file);
    const relOut = path.relative(root, outPath);
    console.log(
      `  ${relIn}${relIn !== relOut ? ` → ${relOut}` : ''}: ` +
        `${fmtKb(inSize)} → ${fmtKb(buffer.length)} (−${fmtKb(inSize - buffer.length)})`
    );
    await writeAtomic(outPath, buffer, opts.dryRun);
    if (
      !opts.dryRun &&
      outPath !== file &&
      existsSync(file) &&
      ext === '.png' &&
      opts.pngToWebp
    ) {
      unlinkSync(file);
    }
  }

  if (skipped) console.log(`  (${skipped} files skipped)`);
  return { before, after, count };
}

const opts = parseArgs(process.argv.slice(2));
console.log(
  opts.dryRun ? '[dry-run] ' : '',
  opts.reencode
    ? `Re-encoding public imgs >${fmtKb(opts.minBytes)} (max-width=${opts.maxWidth}, q=${opts.quality})`
    : `Optimizing originals → public (max-width=${opts.maxWidth}, q=${opts.quality})`
);

const result = opts.reencode
  ? await reencodePublic(opts)
  : await optimizeOriginals(opts);

if (result.count === 0) {
  console.log('\nNothing written.');
} else {
  const saved = result.before - result.after;
  console.log(
    `\n${opts.dryRun ? 'Would update' : 'Updated'} ${result.count} file(s): ` +
      `${fmtKb(result.before)} → ${fmtKb(result.after)} ` +
      `(saved ${fmtKb(saved)}, ${((saved / result.before) * 100).toFixed(0)}%)`
  );
}
