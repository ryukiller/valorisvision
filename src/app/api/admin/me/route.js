import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

/**
 * Session probe for the admin UI (httpOnly cookie is not readable via document.cookie).
 */
export async function GET() {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({
      authenticated: true,
      user: { username: session.username },
    })
  } catch (error) {
    console.error('Admin me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
