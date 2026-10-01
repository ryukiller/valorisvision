import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import cache, { getCacheKey, CACHE_TTL } from '@/lib/cache'
import { getDbCollection } from '@/lib/mongodb'

async function connectToMongoDB() {
  return getDbCollection('coins')
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// POST - Fetch and update price data from CoinGecko
export const POST = requireAuth(async (req) => {
  try {
    const { pages = 5, delayMs = 30000 } = await req.json()
    
    // Throws on failure so the caller can record/abort with the real reason
    const fetchCoins = async (pageNum) => {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${pageNum}&sparkline=false&locale=en`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'ValorisVisio/1.0',
              // Free-tier requests get 403 without a demo key on the markets endpoint
              ...(process.env.COINGECKO_API_KEY ? { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY } : {})
            }
          }
        )

        if (!response.ok) {
          throw new Error(
            `CoinGecko HTTP ${response.status} on page ${pageNum}` +
            (response.status === 403 && !process.env.COINGECKO_API_KEY
              ? ' - blocked: set COINGECKO_API_KEY in .env (free key from https://www.coingecko.com/en/api)' : '') +
            (response.status === 429
              ? ' - rate limited: increase delayMs' : '')
          )
        }

        return response.json()
    }
    
    const collection = await connectToMongoDB()
    let totalUpdated = 0
    let errors = []
    
    for (let page = 1; page <= pages; page++) {
      let coins = null
      const maxAttempts = 3

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          coins = await fetchCoins(page)
          break
        } catch (error) {
          console.error(`Error fetching page ${page} (attempt ${attempt}/${maxAttempts}):`, error.message)
          if (attempt < maxAttempts) {
            const backoff = delayMs * attempt
            console.log(`Retrying page ${page} in ${backoff}ms`)
            await delay(backoff)
          } else {
            errors.push(`Page ${page}: ${error.message}`)
          }
        }
      }

      if (!coins && page === 1) {
        // First page lost after all retries (403/429): abort early, no point continuing
        cache.clear()
        return NextResponse.json({
          success: false,
          message: `Aborting: CoinGecko rejected the first page (${errors[0]}). No further attempts.`
        }, { status: 502 })
      }

      if (coins && coins.length > 0) {
        try {
          // Batch update operations
          const operations = coins.map(coin => ({
            updateOne: {
              filter: { id: coin.id },
              update: { 
                $set: {
                  ...coin,
                  lastUpdated: new Date()
                }
              },
              upsert: true
            }
          }))
          
          const result = await collection.bulkWrite(operations)
          totalUpdated += result.upsertedCount + result.modifiedCount
          
          console.log(`Page ${page}: Updated ${result.upsertedCount + result.modifiedCount} coins`)
        } catch (error) {
          console.error(`Error writing page ${page} to MongoDB:`, error)
          errors.push(`Page ${page} (db): ${error.message}`)
        }

        // Rate limiting delay
        if (page < pages) {
          await delay(delayMs)
        }
      }
    }
    
    // Clear coins cache
    cache.clear()
    
    return NextResponse.json({
      success: true,
      message: `Price update completed. Updated ${totalUpdated} coins across ${pages} pages.`,
      totalUpdated,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Error updating prices:', error)
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    )
  }
})

// GET - Get price update status
export const GET = requireAuth(async (req) => {
  try {
    const collection = await connectToMongoDB()
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalCoins: { $sum: 1 },
          lastUpdate: { $max: "$lastUpdated" },
          avgMarketCap: { $avg: "$market_cap" }
        }
      }
    ]).toArray()
    
    const recentUpdates = await collection
      .find({ lastUpdated: { $exists: true } })
      .sort({ lastUpdated: -1 })
      .limit(10)
      .project({ name: 1, symbol: 1, current_price: 1, lastUpdated: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: {
        statistics: stats[0] || { totalCoins: 0, lastUpdate: null, avgMarketCap: 0 },
        recentUpdates
      }
    })
  } catch (error) {
    console.error('Error getting price status:', error)
    return NextResponse.json(
      { error: 'Failed to get price status' },
      { status: 500 }
    )
  }
})