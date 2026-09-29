import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import OpenAI from 'openai';
import { requireAuth } from '@/lib/auth';

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

export const POST = requireAuth(async (req) => {

    // get a topic, send it to OpenAI to generate new content on that topic
    // generate also images for the article (OpenAI Responses API image tool)
    // generate also seo meta data for the article
    // generate also a short description, title, slug for the article
    // save it to mongo db

    const { topic } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {

        // Get existing blog posts for internal linking
        const blogCollection = await connectToMongoDB();
        const existingPosts = await blogCollection.find({}, {
            projection: { slug: 1, title: 1, _id: 0 }
        }).limit(100).toArray();

        const urls = existingPosts.map(post => "https://valorisvisio.top/blog/" + post.slug);

        // Step 2: Prepare the URLs string
        const urlsString = urls.join('\n');

        const postprompt = `Generate a new Blog Post about ${topic}.`;

        const systemMessage = `You are an expert cryptocurrency journalist and SEO specialist working for ValorisVisio. Your task is to write a comprehensive, SEO-optimized blog post about the topic defined below with a minimum of 1,500 words. Please follow these enhanced guidelines:
                                
                                - **Topic**:
                                "${topic}"
        
                                - **Advanced Writing Style**:
                                - Use markdown for styling with proper H1, H2, H3 hierarchy
                                - Create engaging hooks in the introduction
                                - Use data-driven insights and current market statistics
                                - Include actionable advice and expert analysis
                                - Keep paragraphs concise but informative (2-4 sentences)
                                - Use **bold text** for key terms and important points
                                - Include relevant emojis sparingly for engagement
                                - Add FAQ section at the end for long-tail keywords

                                - **SEO Optimization Requirements**:
                                - Target primary keyword density of 1-2%
                                - Include semantic keywords and LSI terms naturally
                                - Use keyword variations in subheadings
                                - Optimize for featured snippets with clear answers
                                - Include current year and trending terms
                                - Add schema-friendly structure

                                - **Internal Linking Strategy**:
                                - Naturally incorporate 3-5 internal links from: ${urlsString}
                                - Use descriptive anchor text with target keywords
                                - Link to related articles in context, not just at the end
                                - Prioritize high-authority pages for link juice

                                - **Content Structure**:
                                - Introduction with hook and value proposition
                                - Main content with 4-6 H2 sections
                                - Data points, statistics, and expert quotes
                                - Actionable tips and strategies
                                - FAQ section (3-5 questions)
                                - Strong conclusion with call-to-action

                                - **Enhanced Category Selection**:
                                Choose the most specific category from:
                                    - Altcoins, Bitcoin, Blockchain, DeFi, Ethereum
                                    - GameFi, Metaverse, NFTs, Trading, Market Analysis
                                    - Investment Strategies, Technical Analysis, News
                                    - Regulations, Mining, Staking

                                - **Required JSON Output**:
                                {
                                    "title": "Compelling title with primary keyword",
                                    "seo_title": "SEO title max 60 chars with year/trending terms",
                                    "seo_description": "Meta description 150-160 chars with CTA",
                                    "summary": "Article summary highlighting key insights",
                                    "article_content": "Full markdown content with proper structure",
                                    "category": "Most relevant category",
                                    "primary_keyword": "Main target keyword",
                                    "secondary_keywords": ["keyword1", "keyword2", "keyword3"],
                                    "estimated_read_time": "X min read",
                                    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
                                }

                                Ensure content is original, fact-based, and provides genuine value to crypto investors and enthusiasts.`;

        // Generate article content with the OpenAI Responses API
        const textModel = process.env.OPENAI_TEXT_MODEL || "gpt-6-luna";
        // NB: gpt-6-series models do not accept `temperature` (and some reasoning
        // models reject it) - keep the call to the minimal supported params.
        const post = await openai.responses.create({
            model: textModel,
            instructions: systemMessage,
            input: postprompt
        });

        // The model returns JSON (possibly wrapped in markdown fences) - normalize before parsing
        const rawText = (post.output_text || "")
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "");
        const articleData = JSON.parse(rawText);

        // Function to slugify the title
        function slugify(text) {
            if (!text) return ''
            return String(text)
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
        const category_title = articleData.category || '';
        const category_slug = slugify(category_title);
        articleData.category_slug = category_slug;

        console.log(articleData)

        // Array of famous Japanese mangaka styles
        const mangakaStyles = [
            "dynamic action scenes, rounded muscular characters, clean line art",
            "realistic detailed characters, psychological depth, cinematic composition",
            "dark fantasy, incredibly detailed linework, gothic atmosphere",
            "clean expressive characters, classic manga aesthetic, simple but powerful",
            "whimsical nature-focused art, soft colors, magical atmosphere",
            "beautiful detailed backgrounds, realistic lighting, atmospheric",
            "surreal horror aesthetic, detailed linework, unsettling atmosphere",
            "elegant shoujo aesthetic, flowing designs, beautiful character designs",
            "action-packed ninja scenes, dynamic poses, energetic composition",
            "quirky exaggerated characters, adventure atmosphere, cartoonish style",
            "gritty intense artwork, dramatic lighting, post-apocalyptic feel",
            "stylish fashion-forward characters, clean composition, modern aesthetic",
            "incredibly detailed action scenes, dynamic movement, superhero aesthetic",
            "traditional Japanese aesthetic, vibrant colors, spiritual themes"
        ];

        // Randomly select an art style
        const randomStyle = mangakaStyles[Math.floor(Math.random() * mangakaStyles.length)];

        // Generate image with random professional art style via the Responses API image tool
        const imagePrompt = `Cryptocurrency article illustration about ${title} in ${randomStyle}. High quality, suitable for blog header, 16:9 aspect ratio, professional and clean design.`;

        const imageResponse = await openai.responses.create({
            model: textModel,
            input: imagePrompt,
            tools: [{
                type: "image_generation",
                model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-flare",
                size: "1536x1024", // Better aspect ratio for blog headers
                quality: "medium"
            }]
        });

        // Extract the generated image from the response output
        const imgItem = (imageResponse.output || []).find(
            (o) => o.type === "image_generation_call" || o.type === "image"
        );

        let buffer;
        if (imgItem?.result) {
            // Base64 payload
            buffer = Buffer.from(imgItem.result, "base64");
        } else if (imgItem?.image_url) {
            const url = imgItem.image_url;
            if (url.startsWith("data:")) {
                buffer = Buffer.from(url.split(",")[1], "base64");
            } else {
                const imageRes = await fetch(url);
                buffer = Buffer.from(await imageRes.arrayBuffer());
            }
        } else {
            throw new Error("No image returned by the model");
        }

        const publicDir = path.join(process.cwd(), 'public');
        const fileName = `${slug}-${Date.now()}.png`;
        const filePath = path.join(publicDir, "imgs", fileName);

        await writeFile(filePath, buffer);

        articleData.imageUrl = `/imgs/${fileName}`; // Use a URL path for client-side usage

        // Prepare enhanced article data for MongoDB
        const enhancedArticleData = {
            ...articleData,
            createdAt: new Date(),
            updatedAt: new Date(),
            published: true,
            views: 0,
            likes: 0,
            author: "ValorisVisio Editorial",
            status: "published",
            featured: false,
            reading_time: articleData.estimated_read_time || "5 min read",
            seo_keywords: {
                primary: articleData.primary_keyword || topic,
                secondary: articleData.secondary_keywords || [],
                tags: articleData.tags || []
            },
            social_media: {
                twitter_card: "summary_large_image",
                og_type: "article"
            }
        };

        // Save to MongoDB (the sitemap is generated dynamically from the DB)
        const result = await blogCollection.insertOne(enhancedArticleData);

        return NextResponse.json({
            success: true,
            id: result.insertedId,
            article: {
                title: articleData.title,
                slug: slug,
                category: articleData.category,
                estimated_read_time: articleData.estimated_read_time || "5 min read",
                image_url: `/imgs/${fileName}`
            },
            message: "Article created successfully with enhanced SEO optimization!"
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    });

export async function GET(req) {
    try {
        const collection = await connectToMongoDB();

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 30;
        const page = parseInt(searchParams.get('page')) || 1;
        const category = searchParams.get('category');
        const getCategories = searchParams.get('getCategories') === 'true';
        const skip = (page - 1) * limit;

        if (getCategories) {
            // Fetch unique categories and their slugs, excluding empty ones
            const categories = await collection.aggregate([
                { $match: { category: { $ne: "" }, category_slug: { $ne: "" } } },
                { $group: { _id: { name: "$category", slug: "$category_slug" } } },
                { $project: { _id: 0, name: "$_id.name", slug: "$_id.slug" } },
                { $match: { name: { $ne: null }, slug: { $ne: null } } }
            ]).toArray();

            return NextResponse.json({
                success: true,
                data: categories
            });
        }

        // Prepare filter
        const filter = {};
        if (category) {
            filter.category_slug = category;
        }

        // Fetch blog posts
        const blogPosts = await collection.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination
        const totalCount = await collection.countDocuments(filter);

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
