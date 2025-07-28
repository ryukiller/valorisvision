import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { requireAuth } from '@/lib/auth'
import cache, { getCacheKey, CACHE_TTL } from '@/lib/cache'

const uri = process.env.MONGODB
const client = new MongoClient(uri)

async function connectToMongoDB() {
  try {
    await client.connect()
    return client.db("valorisvisio").collection("articles")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

// GET - List all articles (admin view)
export const GET = requireAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const skip = (page - 1) * limit
    
    const collection = await connectToMongoDB()
    
    const articles = await collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const total = await collection.countDocuments({})
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
})

// POST - Create new article
export const POST = requireAuth(async (req) => {
  try {
    const articleData = await req.json()
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'summary', 'slug']
    for (const field of requiredFields) {
      if (!articleData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    const collection = await connectToMongoDB()
    
    // Check if slug already exists
    const existingArticle = await collection.findOne({ slug: articleData.slug })
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      )
    }
    
    const article = {
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: req.user.username,
      published: articleData.published || false,
      views: 0
    }
    
    const result = await collection.insertOne(article)
    
    // Clear blog cache
    cache.delete(getCacheKey.blog(1, 20))
    
    return NextResponse.json({
      success: true,
      data: { ...article, _id: result.insertedId }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
})