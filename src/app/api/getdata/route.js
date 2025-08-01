import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import cache, { getCacheKey, CACHE_TTL } from '@/lib/cache';

// MongoDB setup
const uri = process.env.MONGODB;
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db("valorisvisio").collection("coins");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req) {
    const fetchCoins = async (pageNum) => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${pageNum}&sparkline=false&locale=en`);
            const data = await response.json();
            console.log(response)
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    let page = 1;
    let coins;
    const collection = await connectToMongoDB();

    do {
        coins = await fetchCoins(page);
        if (coins && coins.length > 0) {
            try {
                // Insert or Update each coin in MongoDB
                for (const coin of coins) {
                    await collection.updateOne({ id: coin.id }, { $set: coin }, { upsert: true });
                }
            } catch (err) {
                console.error('Error with MongoDB operation:', err);
                return NextResponse.json({ message: "Error with MongoDB operation" }, { status: 500 });
            }
            page++;
            await delay(30000); // Delay to avoid rate limits
        }
    } while (coins && coins.length > 0);

    // If the loop completes without errors
    return NextResponse.json({ message: "Data saved to MongoDB successfully" }, { status: 200 });
}




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
    
    if (cachedData) {
        return NextResponse.json(cachedData, { status: 200 })
    }

    const client = new MongoClient(process.env.MONGODB);

    try {
        await client.connect();
        const collection = client.db("valorisvisio").collection("coins");

        let query = {
            $and: [
                { market_cap: { $gt: 0 } },
                { total_supply: { $gt: 0 } },
                { circulating_supply: { $gt: 0 } },
            ]
        };

        if (searchTerm) {
            // Extend the query to include search conditions
            query.$and.push({
                $or: [
                    { name: new RegExp(searchTerm, 'i') },
                    { symbol: new RegExp(searchTerm, 'i') }
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
        
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch coins:", error);
        return NextResponse.json({ message: "Failed to fetch coins" }, { status: 500 });
    } finally {
        await client.close();
    }
}
