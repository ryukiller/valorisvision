import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export const POST = requireAuth(async (req) => {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Call the blog API to create the article
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic })
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Article created successfully!',
        data: data
      })
    } else {
      return NextResponse.json(
        { error: data.error || 'Failed to create article' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
})