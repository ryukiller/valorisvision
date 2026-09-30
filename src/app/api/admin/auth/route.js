import { NextResponse } from 'next/server'
import { authenticateUser, createSessionToken } from '@/lib/auth'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

export async function POST(req) {
  try {
    // In-memory limiter (per-instance on serverless — see src/lib/rate-limit.js)
    const ip = getClientIp(req)
    const limited = rateLimit(`admin-auth:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 })
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(limited.retryAfterMs / 1000) || 60) },
        }
      )
    }

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (authenticateUser(username, password)) {
      const sessionToken = createSessionToken(username)

      const response = NextResponse.json(
        { success: true, user: { username } },
        { status: 200 }
      )

      // Set HTTP-only cookie
      response.cookies.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )

  // Clear the session cookie
  response.cookies.delete('admin_session')

  return response
}
