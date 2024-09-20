import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, readFile } from 'fs/promises';
import xml2js from 'xml2js';
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

        const response = await fetch(`http://localhost:3001/api/blog?page=1&limit=1000`);
        const data = await response.json();
        let urls = [];

        if (data.success) {
            // Assuming the blog posts are in data.posts
            urls = data.data.map(post => "https://valorisvisio.top/blog/" + post.slug);
        }

        // Step 2: Prepare the URLs string
        const urlsString = urls.join('\n');

        const postprompt = `Generate a new Blog Post about ${topic}.`;

        const systemMessage = `You are a New York Times journalist working for ValorisVisio. Your task is to write a blog post about the topit defined below with a minimum of 1,000 words. Please follow these guidelines:
                                
                                - **Topic**:
                                "${topic}"
        
                                - **Writing Style**:
                                - Use markdown for styling.
                                - Organize content with headings and subheadings.
                                - Use bullet points or numbered lists to enhance readability.
                                - Keep paragraphs concise (maximum of 2-3 lines).
                                - Use **bold text** to highlight important points.

                                - **Internal Links**:
                                - Incorporate internal links based on the following URLs, first try to add them naturally based on poential keywords inside the articles where they fit else add them as related articles:
                                    ${urlsString}

                                - **SEO Best Practices**:
                                - Optimize the content for search engines.
                                - Include relevant keywords naturally.
                                - Write an engaging meta description of max 160 characters.

                                - **Article Category**:
                                - Choose an appropriate category from the following options:
                                    - Altcoins
                                    - Bitcoin
                                    - Blockchain
                                    - DeFi
                                    - Ethereum
                                    - GameFi
                                    - Metaverse
                                    - NFTs
                                    - Trading

                                - **Output Format**:
                                - Provide the final output as a JSON object with the following keys:
                                    - **title**: The title of the blog post.
                                    - **seo_title**: An SEO-friendly version of the title of max 55 characters.
                                    - **seo_description**: A brief description optimized for SEO of max 155 characters.
                                    - **summary**: A concise summary of the article.
                                    - **article_content**: The full article content in markdown format.
                                    - **category**: The selected category for the article.

                                Ensure the content is engaging, informative, and adheres to journalistic standards.`;

        // Generate article content
        const post = await openai.chat.completions.create({
            messages: [{
                role: "system",
                content: systemMessage
            }, {
                role: "user",
                content: postprompt
            }],
            model: "gpt-4o-mini", // "gpt-4o",
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
        const category_title = articleData.category || '';
        const category_slug = slugify(category_title);
        articleData.category_slug = category_slug;

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

        // Update sitemap.xml
        await updateSitemap(slug);

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
        const limit = parseInt(searchParams.get('limit')) || 12;
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

async function updateSitemap(slug) {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

    try {
        // Read existing sitemap
        const xmlData = await readFile(sitemapPath, 'utf8');

        // Parse XML
        const parser = new xml2js.Parser({ xmldec: { 'version': '1.0', 'encoding': 'UTF-8' } });
        const result = await parser.parseStringPromise(xmlData);

        // Add new URL
        const newUrl = {
            loc: [`https://valorisvisio.top/blog/${slug}`],
            lastmod: [new Date().toISOString().split('T')[0]],
            changefreq: ['weekly'],
            priority: ['0.8']
        };

        // Add new URL to existing urls
        result.urlset.url.push(newUrl);

        // Convert back to XML
        const builder = new xml2js.Builder({
            xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },
            renderOpts: { pretty: true, indent: '  ', newline: '\n' },
            xmlns: result.urlset.$
        });
        let updatedXml = builder.buildObject(result);

        // Ensure the XML declaration is correct
        updatedXml = updatedXml.replace(
            '<?xml?>',
            '<?xml version="1.0" encoding="UTF-8"?>'
        );

        // Write updated sitemap
        await writeFile(sitemapPath, updatedXml, 'utf8');
        console.log('Sitemap updated successfully');
    } catch (error) {
        console.error('Error updating sitemap:', error);
    }
}