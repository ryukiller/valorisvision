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
 * Upsert an image.
 * @param {string} key sanitized filename (see route: slug + timestamp + .webp)
 * @param {Buffer} data encoded image bytes
 * @param {string} contentType e.g. image/webp
 */
export async function saveArticleImage(key, data, contentType = 'image/webp') {
	const collection = await getDbCollection('blog_images');
	await collection.updateOne(
		{ key },
		{
			$set: { key, data, contentType, updatedAt: new Date() },
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
	if (!doc || !doc.data) return null;
	return { data: doc.data, contentType: doc.contentType || 'image/webp' };
}
