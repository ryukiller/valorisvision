import { NextResponse } from 'next/server';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';
import { requireAuth } from '@/lib/auth';
import { getDbCollection } from '@/lib/mongodb';
import { askJev, jevDisabled } from '@/lib/jev';

/** Long-running AI generation; capped at 60s for Vercel Hobby (plan max). */
export const maxDuration = 60;

async function connectToMongoDB() {
    return getDbCollection('blog');
}

/** Never leak stack traces / provider internals to clients. */
function publicCreateError(error) {
    const msg = String(error?.message || '');
    if (/OPENAI_API_KEY|api key|not configured/i.test(msg)) {
        return 'OpenAI is not configured';
    }
    if (/JSON|Unexpected token|parse/i.test(msg)) {
        return 'Failed to parse AI article response';
    }
    if (/MONGODB|Mongo/i.test(msg)) {
        return 'Database unavailable';
    }
    return 'Failed to create article';
}

export const POST = requireAuth(async (req) => {

    // get a topic, send it to OpenAI to generate new content on that topic
    // generate also images for the article (OpenAI Responses API image tool)
    // generate also seo meta data for the article
    // generate also a short description, title, slug for the article
    // save it to mongo db

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { success: false, error: 'OpenAI is not configured' },
            { status: 503 }
        );
    }

    const body = await req.json().catch(() => null);
    const topic = body?.topic;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
        return NextResponse.json(
            { success: false, error: 'Topic is required' },
            { status: 400 }
        );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Explicit opt-out (request body { "noJev": true }) disables every Jev step.
    const jevOff = Boolean(body?.noJev);
    if (!jevDisabled(jevOff, 'noJev flag')) {
        console.log('[jev] active (angle + QC + semantic dedupe)');
    }

    try {

        // Get existing blog posts for internal linking
        const blogCollection = await connectToMongoDB();
        const existingPosts = await blogCollection.find({}, {
            projection: { slug: 1, title: 1, createdAt: 1, _id: 0 }
        }).limit(100).toArray();

        // Titles included so the model can judge topical relevance and
        // derive keyword-rich anchor text.
        const urlsString = existingPosts
            .map((post) => `- https://valorisvisio.top/blog/${post.slug} — "${post.title}"`)
            .join('\n');

        const today = new Date().toISOString().slice(0, 10);

        // JEV(1) — angle steering: one cheap Choice before the expensive write.
        // The writer LLM still decides everything; Jev just points it.
        const ANGLES = {
            "news-breakdown": "Structured, factual breakdown of what happened and why it matters, with key figures and timeline",
            "market-impact": "What this means for prices, positioning, and investor allocation in the current market cycle",
            "explainer": "Explain the underlying concept in plain language for a smart non-expert; no hot takes, just clarity",
            "contrarian-take": "Argue against the consensus around the topic; steelman the opposition, then dismantle it",
            "investor-action": "What a practical investor should do about it: scenarios, risk, and how to test the thesis with the ValorisVisio calculator",
        };
        let angle = null;
        if (!jevOff) {
            const angleAnswers = await askJev(
                `Topic for a crypto blog article: "${topic.trim()}". Today's date: ${today}.`,
                {
                    angle: {
                        type: 'choice',
                        instructions: 'Which article angle will best make this topic land with a crypto-investor audience?',
                        criteria: ANGLES,
                    },
                }
            );
            const id = angleAnswers?.angle?.choice;
            if (id && ANGLES[id]) {
                angle = { id, description: ANGLES[id] };
                console.log(`[jev] angle: ${id}`);
            }
        }

        const editorialDirection = angle
            ? `\n## EDITORIAL DIRECTION\nSteer the piece toward this angle: ${angle.description}. The angle shapes emphasis and structure, not the facts.`
            : '';

        const postprompt = `Write a comprehensive, SEO-optimized blog post about: ${topic}. Today's date: ${today}.`;
        // Retry carries an explicit correction instruction (set below if QC fails).
        let retryInstruction = '';

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

        // JEV(2) — QC gate: one call, one retry, then drop the bad text (never publish bad).
        // The writer call is the most expensive step in this route; Jev's cheap
        // judgment is spent to make it land, or to catch a miss before publish.
        async function generateAndJudge() {
            const inputParts = [
                postprompt,
                retryInstruction ? `REVISION REQUIRED: ${retryInstruction}` : '',
            ].filter(Boolean);
            const post = await openai.responses.create({
                model: textModel,
                instructions: systemMessage + editorialDirection,
                input: inputParts
            });

            // The model returns JSON (possibly wrapped in markdown fences) - normalize before parsing
            const rawText = (post.output_text || "")
                .trim()
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```$/, "");
            let articleData;
            try {
                articleData = JSON.parse(rawText);
            } catch {
                throw new Error('Failed to parse AI article response as JSON');
            }
            if (!articleData || typeof articleData !== 'object') {
                throw new Error('Failed to parse AI article response as JSON');
            }
            return articleData;
        }

        let articleData = await generateAndJudge();
        // Jev verdicts surfaced to the caller (CLI / admin UI) as warnings.
        let qcWarnings = [];

        if (!jevOff && jevAvailable()) {
            // Soft gate: Jev flags, code decides. Categories from the prompt.
            const CATEGORIES = ['Altcoins', 'Bitcoin', 'Blockchain', 'DeFi', 'Ethereum', 'GameFi', 'Metaverse', 'NFTs', 'Trading', 'Market Analysis', 'Investment Strategies', 'Technical Analysis', 'News', 'Regulations', 'Mining', 'Staking'];
            const judgeArticle = async (data) => {
                const state = [
                    `TITLE: ${data.title || ''}`,
                    `CATEGORY (proposed): ${data.category || ''}`,
                    `EXCERPT: ${data.summary || ''}`,
                    '',
                    'ARTICLE:',
                    String(data.article_content || '').slice(0, 6000),
                ].join('\n');
                return askJev(state, {
                title_match: {
                    type: 'choice',
                    instructions: 'Does the article content deliver what the title promises?',
                    criteria: {
                        delivers: 'The article substantively covers the specific thing the title claims',
                        partially: 'Related, but the title overpromises or skews the content',
                        clickbait: 'The title is sensational and the article does not actually pay it off',
                    },
                },
                honest_language: {
                    type: 'noul',
                    instructions: 'Does the article state precise statistics or figures as absolute fact, without any hedge, attribution, or date anchoring?',
                    criteria: {
                        true: 'The article presents specific numbers or claims without hedging, sourcing, or temporal anchoring',
                        false: 'Concrete figures are hedged, attributed to a source, or dated; or the article contains no precise figures',
                    },
                },
                category: {
                    type: 'choice',
                    instructions: 'Which category does the article actually belong to?',
                    criteria: Object.fromEntries(CATEGORIES.map((c) => [c, c])),
                },
                hook: {
                    type: 'score',
                    instructions: 'How compelling is the excerpt (summary) as a feed hook?',
                    criteria: [
                        'Generic summary; a reader would skip it',
                        'Accurate but flat; no curiosity created',
                        'Creates a clear curiosity gap or tension',
                        'Impossible to scroll past; makes the reader need to know more',
                    ],
                },
            });
            };

            // One verdict pass: log, soft-fix the category, and (at most once)
            // retry the writer with an explicit correction. This route publishes
            // a single manually-chosen piece, so a still-flagged draft is kept
            // but surfaced as a warning rather than dropped.
            const applyVerdict = (data, qc) => {
                const titleMatch = qc.title_match?.choice ?? null;
                const titleConf = qc.title_match?.confidence ?? 0;
                const unhedged = typeof qc.honest_language?.noul === 'number' ? qc.honest_language.noul : null;
                const catChoice = qc.category?.choice;
                const catConf = qc.category?.confidence ?? 0;
                const hook = qc.hook?.score !== undefined ? qc.hook.score / 3 : null;
                console.log(`[jev] QC: title=${titleMatch}(${titleConf.toFixed(2)}) unhedged=${unhedged === null ? '?' : unhedged.toFixed(2)} category=${catChoice ?? '?'}(${catConf.toFixed(2)}) hook=${hook === null ? '?' : hook.toFixed(2)}`);

                if (catChoice && catConf >= 0.5) {
                    const known = CATEGORIES.find((c) => c.toLowerCase() === String(catChoice).trim().toLowerCase());
                    if (known && known.toLowerCase() !== String(data.category || '').trim().toLowerCase()) {
                        console.log(`[jev] QC: category ${data.category} -> ${known}`);
                        data.category = known;
                    }
                }

                const clickbait = titleMatch === 'clickbait' && titleConf >= 0.5;
                const unhedgedStats = unhedged !== null && unhedged >= 0.6;
                const problems = [];
                if (clickbait) problems.push('the title does not match the content — make the title honest and specific to what the article actually delivers');
                if (unhedgedStats) problems.push('it stated precise statistics without hedging or sourcing — remove or hedge every figure, and attribute data to a source');
                return problems;
            };

            let qc = await judgeArticle(articleData);
            if (qc) {
                const problems = applyVerdict(articleData, qc);
                if (problems.length > 0) {
                    console.warn(`[jev] QC: retrying writer (${problems.join('; ')})`);
                    retryInstruction = problems.join('. ') + '.';
                    articleData = await generateAndJudge();
                    const qc2 = await judgeArticle(articleData);
                    if (qc2) {
                        const still = applyVerdict(articleData, qc2);
                        if (still.length > 0) {
                            console.warn(`[jev] QC: still flagged after retry (${still.join('; ')})`);
                            qcWarnings.push('QC: ' + still.join('; '));
                        }
                    }
                }
            }
        }

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

        // JEV(3) — semantic dedupe: "same story, different words". Token/slug
        // rules above catch reworded slugs only. One batched Noul per pair
        // against the most recent archive posts (small set — cost is trivial).
        // Soft signal: a hit is surfaced as a warning, never blocks publish
        // (single manually-chosen piece per run).
        if (!jevOff && jevAvailable() && title) {
            const recent = [...existingPosts]
                .filter((p) => p.slug !== slug && p.title)
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, 20);
            if (recent.length > 0) {
                const q = {};
                recent.forEach((p, i) => {
                    q[`x${i}`] = {
                        type: 'noul',
                        instructions: `Does the candidate topic cover the SAME story or event as existing topic x${i} ("${p.title}")? Different angles on one underlying event = same story. Related themes ≠ same story.`,
                        criteria: {
                            true: 'Both topics are about the same underlying event, release, person, or controversy',
                            false: 'The topics are about different stories, even if on a related theme',
                        },
                    };
                });
                const answers = await askJev({ candidate_topic: title, existing_topics: recent.map((p, i) => ({ id: `x${i}`, title: p.title })) }, q);
                if (answers) {
                    const hit = recent.find((p, i) => {
                        const n = answers[`x${i}`]?.noul;
                        return typeof n === 'number' && n >= 0.6;
                    });
                    if (hit) {
                        console.warn(`[jev] ⏭ semantic: draft may duplicate existing post "${hit.title}" (${hit.slug})`);
                        qcWarnings.push(`Semantic dedupe: may duplicate existing post "${hit.title}" (/blog/${hit.slug})`);
                    }
                }
            }
        }

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

        // Image is best-effort: text gen is expensive — still save the article if image fails (P1-10).
        let imageUrl = null;
        let imageWarning = null;
        try {
            const imagePrompt = `Cryptocurrency article illustration about ${title} in ${randomStyle}. High quality, suitable for blog header, 16:9 aspect ratio, professional and clean design.`;

            const imageResponse = await openai.responses.create({
                model: textModel,
                input: imagePrompt,
                tools: [{
                    type: "image_generation",
                    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-flare",
                    size: "1536x1024",
                    quality: "medium"
                }]
            });

            const imgItem = (imageResponse.output || []).find(
                (o) => o.type === "image_generation_call" || o.type === "image"
            );

            let buffer;
            if (imgItem?.result) {
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
            const fileName = `${slug}-${Date.now()}.webp`;
            const filePath = path.join(publicDir, "imgs", fileName);
            await sharp(buffer).webp({ quality: 80, effort: 4 }).toFile(filePath);
            imageUrl = `/imgs/${fileName}`;
        } catch (imgErr) {
            console.error("Image generation failed; saving article without header image:", imgErr);
            imageWarning = "Article saved without header image (image generation failed)";
        }

        articleData.imageUrl = imageUrl;

        const hasImage = Boolean(imageUrl);
        const enhancedArticleData = {
            ...articleData,
            createdAt: new Date(),
            updatedAt: new Date(),
            published: true,
            views: 0,
            likes: 0,
            author: "ValorisVisio Editorial",
            // Keep public; flag missing image for ops (list endpoints do not filter drafts yet)
            status: hasImage ? "published" : "published_no_image",
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

        const result = await blogCollection.insertOne(enhancedArticleData);

        // Ops-facing warnings: Jev QC flags that survived the retry and
        // semantic-dedupe hits. Non-blocking — the piece is published.
        const warnings = [...qcWarnings];
        if (imageWarning) warnings.push(imageWarning);

        return NextResponse.json({
            success: true,
            id: result.insertedId,
            article: {
                title: articleData.title,
                slug: slug,
                category: articleData.category,
                estimated_read_time: articleData.estimated_read_time || "5 min read",
                image_url: imageUrl,
                status: enhancedArticleData.status,
                angle: angle ? angle.id : undefined
            },
            warnings: warnings.length > 0 ? warnings : undefined,
            warning: warnings[0] || undefined,
            message: hasImage
                ? "Article created successfully with enhanced SEO optimization!"
                : "Article saved without header image (generation failed); text and SEO fields were kept."
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json(
            { success: false, error: publicCreateError(error) },
            { status: 500 }
        );
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
        return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}
