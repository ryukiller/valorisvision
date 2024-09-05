import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';

import OpenAI from 'openai';


// MongoDB setup
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

export async function POST(req) {

    // get a topic search for articles on that topic get the content the send it to to openai to generate new content on that topic
    // generate also images for the article
    // generate also seo meta data for the article
    // generate also a short description for the article
    // generate also a title for the article
    // generate also a slug for the article
    // generate also a summary for the article
    // generate also a summary for the article
    // generate also a summary for the article
    // generate also a summary for the article
    // save it to mongo db

    const { topic } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {

        const postprompt = `Generate a new Blog Post about ${topic}.`;

        // Generate article content
        const post = await openai.chat.completions.create({
            messages: [{
                role: "system",
                content: `You are a New York Times Journalist working for ValorisVisio write a blog post about ${topic} minimum 1000 words use markdown for styling use Seo Best Practices for the writing. You will be given a topic and you will generate a json with the following keys: title, seo title, seo description, summary, article content.`
            }, {
                role: "user",
                content: postprompt
            }],
            model: "gpt-4o", // "gpt-4o",
            max_tokens: 1500,
            response_format: { "type": "json_object" }
        });

        const articleData = JSON.parse(post.choices[0].message.content);

        // Function to slugify the title
        function slugify(text) {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')        // Replace spaces with -
                .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
                .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                .replace(/^-+/, '')          // Trim - from start of text
                .replace(/-+$/, '');         // Trim - from end of text
        }

        // Extract title, create slug, and append to articleData
        const title = articleData.title || '';
        const slug = slugify(title);
        articleData.slug = slug;

        console.log(articleData)
        // Generate image (placeholder - you'll need to implement actual image generation)

        const imageResponse = await openai.images.generate(
            {
                model: "dall-e-3",
                prompt: articleData.seo_description,
                n: 1,
                size: "1024x1024",
            }
        )

        const image_url = imageResponse.data[0].url

        // Download and save the image
        const imageRes = await fetch(image_url);
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const publicDir = path.join(process.cwd(), 'public');
        const fileName = `${slug}-${Date.now()}.png`;
        const filePath = path.join(publicDir, "imgs", fileName);

        await writeFile(filePath, buffer);

        articleData.imageUrl = `/imgs/${fileName}`; // Use a URL path for client-side usage

        // Save to MongoDB
        const collection = await connectToMongoDB();
        const result = await collection.insertOne({
            ...articleData,
            createdAt: new Date(),
        });

        console.log(image_url)

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

}

export async function GET(req) {
    try {
        const collection = await connectToMongoDB();

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 10;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        // Fetch blog posts
        const blogPosts = await collection.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination
        const totalCount = await collection.countDocuments();

        return NextResponse.json({
            success: true,
            data: blogPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            }
        });
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}