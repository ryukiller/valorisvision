import { NextResponse } from 'next/server';
import { getDbCollection } from '@/lib/mongodb';

async function connectToMongoDB() {
    return getDbCollection('blog');
}

export async function GET(req, { params }) {
    const { slug } = await params;

    try {
        const collection = await connectToMongoDB();

        const article = await collection.findOne({ slug: slug });

        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json({ success: false, error: 'Failed to fetch article' }, { status: 500 });
    }
}