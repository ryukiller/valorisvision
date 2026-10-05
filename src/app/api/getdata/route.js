import { NextResponse } from 'next/server';
import cache, { getCacheKey, CACHE_TTL } from '@/lib/cache';
import { getDbCollection } from '@/lib/mongodb';

async function connectToMongoDB() {
    return getDbCollection('coins');
}

// NOTE: the legacy unauthenticated CoinGecko bulk import (old POST) was removed.
// Use `POST /api/admin/prices` — it is auth-gated, supports `pages`/`delayMs`,
// retries, and reports 403/429 quota errors cleanly.

export async function GET(req) {
    const { searchParams } = new URL(req.url)

    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Search parameter
    const searchTerm = searchParams.get('searchTerm');
    
    // Check cache first
    const cacheKey = getCacheKey.coins(page, limit, searchTerm || '')
    const cachedData = cache.get(cacheKey)
    
    const cacheHeaders = {
        // `generateEtags` is disabled globally — set caching explicitly.
        'Cache-Control': 'public, max-age=60, s-maxage=300',
    }

    if (cachedData) {
        return NextResponse.json(cachedData, { status: 200, headers: cacheHeaders })
    }

    try {
        const collection = await connectToMongoDB();

        let query = {
            $and: [
                { market_cap: { $gt: 0 } },
                { total_supply: { $gt: 0 } },
                { circulating_supply: { $gt: 0 } },
            ]
        };

        if (searchTerm) {
            // Escape regex metacharacters to avoid ReDoS / unintended patterns
            const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$and.push({
                $or: [
                    { name: new RegExp(escaped, 'i') },
                    { symbol: new RegExp(escaped, 'i') }
                ]
            });
        }

        const coins = await collection
            .find(query)
            .sort({ market_cap: -1 }) // Sorting by market cap in descending order
            .skip(skip)
            .limit(limit)
            .toArray();

        const responseData = { message: "Here coins", coins, page, limit }
        
        // Cache the response
        cache.set(cacheKey, responseData, CACHE_TTL.COINS)
        
        return NextResponse.json(responseData, { status: 200, headers: cacheHeaders });
    } catch (error) {
        console.error("Failed to fetch coins:", error);
        return NextResponse.json({ message: "Failed to fetch coins" }, { status: 500 });
    }
}
