import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { requireAuth } from '@/lib/auth'
import cache, { getCacheKey, CACHE_TTL } from '@/lib/cache'

const uri = process.env.MONGODB
const client = new MongoClient(uri)

async function connectToMongoDB() {
  try {
    await client.connect()
    return client.db("valorisvisio").collection("coins")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// POST - Fetch and update price data from CoinGecko
export const POST = requireAuth(async (req) => {
  try {
    const { pages = 5, delayMs = 30000 } = await req.json()
    
    const fetchCoins = async (pageNum) => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${pageNum}&sparkline=false&locale=en`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'ValorisVisio/1.0'
            }
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data
      } catch (err) {
        console.error(`Error fetching page ${pageNum}:`, err)
        return null
      }
    }
    
    const collection = await connectToMongoDB()
    let totalUpdated = 0
    let errors = []
    
    for (let page = 1; page <= pages; page++) {
      try {
        const coins = await fetchCoins(page)
        
        if (coins && coins.length > 0) {
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
        }
        
        // Rate limiting delay
        if (page < pages) {
          await delay(delayMs)
        }
      } catch (error) {
        console.error(`Error processing page ${page}:`, error)
        errors.push(`Page ${page}: ${error.message}`)
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
  } finally {
    await client.close()
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
  } finally {
    await client.close()
  }
})