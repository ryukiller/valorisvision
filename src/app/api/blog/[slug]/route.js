import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB;
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db("valorisvisio").collection("blog");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export async function GET(req, { params }) {
    const { slug } = params;

    try {
        const collection = await connectToMongoDB();

        const article = await collection.findOne({ slug: slug });

        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}