import { NextResponse } from 'next/server';
import { getArticleImage } from '@/lib/article-images';

export const dynamic = 'force-dynamic';

// Keys are generated as `${slug}-${timestamp}.webp` — keep only that shape.
const SAFE_NAME = /^[a-z0-9][a-z0-9._-]{0,200}$/;

export async function GET(_req, { params }) {
	const { name } = await params;
	if (!name || !SAFE_NAME.test(name)) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	try {
		const image = await getArticleImage(name);
		if (!image) {
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
		}
		// Copy into a standalone Uint8Array so the Response body is real image
		// bytes (not a BSON Binary, which `new Uint8Array(binary)` empties).
		const body = new Uint8Array(image.data);
		return new NextResponse(body, {
			status: 200,
			headers: {
				'Content-Type': image.contentType,
				'Content-Length': String(body.byteLength),
				// Immutable filename (slug + timestamp) → cache for a year at the edge.
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		});
	} catch (error) {
		console.error('Failed to fetch article image:', error);
		return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
	}
}
