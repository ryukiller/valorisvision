import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import OpenAI from 'openai';
import sharp from 'sharp';
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

        // Titles included so the model can judge topical relevance and
        // derive keyword-rich anchor text.
        const urlsString = existingPosts
            .map((post) => `- https://valorisvisio.top/blog/${post.slug} — "${post.title}"`)
            .join('\n');

        const today = new Date().toISOString().slice(0, 10);

        const postprompt = `Write a comprehensive, SEO-optimized blog post about: ${topic}. Today's date: ${today}.`;

        const systemMessage = `You are an expert cryptocurrency journalist and SEO specialist working for ValorisVisio, a crypto scenario calculator site. Write an original, fact-based, in-depth article that is optimized to rank in Google for its primary keyword. Topic: "${topic}". Today's date: ${today}. Follow these rules strictly.

## CONTENT RULES (hard requirements)
- Minimum 1,500 words, written in markdown.
- The content MUST begin with a single H1 matching the title exactly.
- 4-6 H2 sections. Each H2 must contain the primary keyword or a natural LSI variation. Use H3 sparingly.
- Start the introduction with a 40-60 word direct answer to the topic's core question (featured-snippet format), then a short hook.
- Paragraphs of 2-3 sentences. Use bullet lists or one table where they add clarity. Bold key terms.
- Primary keyword at 1-2% density, distributed naturally; vary with LSI terms. Never keyword-stuff.
- Use real, current market data where possible. Never invent statistics. Use the current year and trending terms naturally.
- Use at most 2 emojis, only if they fit.

## INTERNAL LINKS (archive)
- From the archive below, pick the 5-8 posts that are most topically relevant to this article and link to them where the topic naturally comes up (distributed through the body, never clustered at the end).
- Anchor text must be a specific 2-4 word phrase from the linked article's subject (keyword-oriented), not generic text like "this article" or "read more". If fewer than 3 archive posts are truly relevant, include only those.
- Archive:
${urlsString}

## SEO FIELDS (character limits are hard limits)
- "title": MAX 8 WORDS. Put the primary keyword first. Add a number or the current year when it helps.
- "seo_title": max 60 chars. Primary keyword near the start plus one power word (Guide, Explained, What To Know, Impact).
- "seo_description": 140-155 chars. Contains the primary keyword and one clear call to action.
- "summary": 2-3 sentences for card previews, including 1-2 LSI terms.

## STRUCTURE
- Introduction: answer-first (per rules), then hook.
- Main body: 4-6 H2 sections with data points, examples, and actionable advice.
- FAQ: a dedicated final section titled exactly \`## FAQ\` containing 4 questions phrased as long-tail searches people would type. Each question MUST be its own \`### Question?\` (H3) line followed by a 40-50 word answer paragraph. This exact \`## FAQ\` + \`###\` structure is required — it powers the FAQ rich results.
- Conclusion: 2-3 sentences plus a call to use the free ValorisVisio calculator at https://valorisvisio.top.

## CATEGORY
Choose the single most specific category from: Altcoins, Bitcoin, Blockchain, DeFi, Ethereum, GameFi, Metaverse, NFTs, Trading, Market Analysis, Investment Strategies, Technical Analysis, News, Regulations, Mining, Staking.

## OUTPUT FORMAT
Return exactly one JSON object, no markdown fences, with these fields:
{
    "title": "...",
    "seo_title": "...",
    "seo_description": "...",
    "summary": "...",
    "article_content": "# {title} ... full markdown ...",
    "category": "...",
    "primary_keyword": "...",
    "secondary_keywords": ["...", "...", "..."],
    "estimated_read_time": "X min read",
    "tags": ["...", "...", "..."]
}

The content must be original, fact-based, and genuinely useful to crypto investors and enthusiasts.`;

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
        // Keep slugs crawlable and shareable: max 6 words.
        // Fall back to the topic if the resulting slug is degenerate.
        let slug = slugify(title).split('-').slice(0, 6).join('-');
        if (slug.length < 8) slug = (slug + '-' + slugify(topic)).split('-').slice(0, 6).join('-');
        // De-duplicate against existing posts (title collisions get -2, -3, ...)
        {
            let candidate = slug;
            let n = 2;
            while (await blogCollection.findOne({ slug: candidate }, { projection: { _id: 1 } })) {
                candidate = `${slug}-${n++}`;
            }
            slug = candidate;
        }
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
        // Compress to WebP (quality 80): a raw OpenAI PNG is ~2-3 MB, the
        // WebP version lands well under 500 KB — better LCP and social previews.
        const fileName = `${slug}-${Date.now()}.webp`;
        const filePath = path.join(publicDir, "imgs", fileName);

        await sharp(buffer).webp({ quality: 80, effort: 4 }).toFile(filePath);

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
