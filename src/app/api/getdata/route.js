import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

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
    const client = new MongoClient(process.env.MONGODB);

    const { searchParams } = new URL(req.url)

    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Search parameter
    const searchTerm = searchParams.get('page');

    try {
        await client.connect();
        const collection = client.db("valorisvisio").collection("coins");

        let query = {};
        if (searchTerm) {
            // Search by name or symbol using regex for case-insensitive partial match
            query = {
                $or: [
                    { name: new RegExp(searchTerm, 'i') },
                    { symbol: new RegExp(searchTerm, 'i') }
                ]
            };
        }

        const coins = await collection.find(query).skip(skip).limit(limit).toArray();
        const total = await collection.countDocuments(query);
        return NextResponse.json({ message: "Here coins", coins, total, page, limit }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch coins:", error);
        return NextResponse.json({ message: "Failed to fetch coins" }, { status: 500 });
    } finally {
        await client.close();
    }
}
