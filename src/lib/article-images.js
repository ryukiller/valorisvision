import { Binary } from 'mongodb';
import { getDbCollection } from '@/lib/mongodb';

/**
 * Blog header images stored in MongoDB (collection `blog_images`).
 *
 * Serverless hosts (Netlify/Vercel) have an ephemeral filesystem: writing to
 * `public/` at request time worked in local dev but 404'd in production
 * (docs/codebase-audit.md). Images are immutable (slug-timestamp filenames),
 * so they are served from `/api/article-image/[name]` with a 1-year
 * Cache-Control — the CDN/edge caches them and Mongo is rarely hit.
 *
 * Legacy images still committed under `public/imgs/` keep working unchanged.
 */

/** @returns {string} path stored in article.imageUrl */
export function articleImageUrl(key) {
	return `/api/article-image/${key}`;
}

/**
 * Normalize bytes from Mongo / Node into a non-empty Buffer.
 *
 * MongoDB returns BSON `Binary` for BinData fields. On that class, `.length`
 * is a *method*, not a number — so `new Uint8Array(binary)` treats the object
 * as a non-array-like and yields a **zero-length** typed array (HTTP 200 with
 * Content-Length: 0). Always go through `.buffer` / `.value()`.
 *
 * @param {unknown} data
 * @returns {Buffer | null}
 */
export function coerceImageBytes(data) {
	if (data == null) return null;

	if (Buffer.isBuffer(data)) {
		return data.length > 0 ? data : null;
	}

	// Prefer BSON Binary APIs when present (driver class or duck-typed).
	if (typeof data.value === 'function') {
		try {
			const raw = data.value(true);
			if (raw != null) {
				const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
				if (buf.length > 0) return buf;
			}
		} catch {
			// fall through
		}
	}

	if (data instanceof Uint8Array) {
		return data.byteLength > 0 ? Buffer.from(data) : null;
	}

	if (data instanceof ArrayBuffer) {
		return data.byteLength > 0 ? Buffer.from(data) : null;
	}

	// BSON Binary / similar: `{ buffer: Uint8Array|Buffer }`
	if (data.buffer != null) {
		const inner = data.buffer;
		if (Buffer.isBuffer(inner)) {
			return inner.length > 0 ? inner : null;
		}
		if (inner instanceof Uint8Array) {
			return inner.byteLength > 0 ? Buffer.from(inner) : null;
		}
		if (inner instanceof ArrayBuffer) {
			return inner.byteLength > 0 ? Buffer.from(inner) : null;
		}
		// Node Buffer JSON: `{ type: 'Buffer', data: number[] }` nested oddly
		if (inner?.type === 'Buffer' && Array.isArray(inner.data)) {
			return inner.data.length > 0 ? Buffer.from(inner.data) : null;
		}
	}

	// Node Buffer JSON shape
	if (data.type === 'Buffer' && Array.isArray(data.data)) {
		return data.data.length > 0 ? Buffer.from(data.data) : null;
	}

	return null;
}

/**
 * Upsert an image.
 * @param {string} key sanitized filename (see route: slug + timestamp + .webp)
 * @param {Buffer|Uint8Array|ArrayBuffer} data encoded image bytes
 * @param {string} contentType e.g. image/webp
 */
export async function saveArticleImage(key, data, contentType = 'image/webp') {
	const bytes = coerceImageBytes(data);
	if (!bytes) {
		throw new Error('Refusing to store empty or invalid article image bytes');
	}

	const collection = await getDbCollection('blog_images');
	await collection.updateOne(
		{ key },
		{
			$set: {
				key,
				// Explicit Binary keeps subtype stable across driver versions.
				data: new Binary(bytes),
				contentType,
				updatedAt: new Date(),
			},
			$setOnInsert: { createdAt: new Date() },
		},
		{ upsert: true }
	);
}

/**
 * @param {string} key
 * @returns {Promise<{data: Buffer, contentType: string} | null>}
 */
export async function getArticleImage(key) {
	const collection = await getDbCollection('blog_images');
	const doc = await collection.findOne({ key }, { projection: { data: 1, contentType: 1, _id: 0 } });
	if (!doc) return null;
	const data = coerceImageBytes(doc.data);
	if (!data) return null;
	return { data, contentType: doc.contentType || 'image/webp' };
}
