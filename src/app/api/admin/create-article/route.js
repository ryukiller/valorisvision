import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

/**
 * Deprecated proxy (P1-9). Previously re-fetched POST /api/blog without the
 * admin session cookie and defaulted to localhost:3001.
 * Admin UI and internal-bot already call POST /api/blog directly.
 */
export const POST = requireAuth(async () => {
  return NextResponse.json(
    {
      error:
        'Deprecated. Use POST /api/blog with JSON body { "topic": "..." } (session cookie required).',
      use: '/api/blog',
    },
    { status: 410 }
  )
})
