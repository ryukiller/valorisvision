import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple hash-based authentication
// In production, use proper JWT tokens and database storage
const isProd = process.env.NODE_ENV === 'production'

function requireProdSecrets() {
  // Skip during `next build` (routes are analyzed without runtime env).
  if (!isProd || process.env.NEXT_PHASE === 'phase-production-build') return
  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.SESSION_SECRET) {
    throw new Error(
      'ADMIN_PASSWORD_HASH and SESSION_SECRET must be set in production (refusing insecure defaults)'
    )
  }
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  crypto.createHash('sha256').update('admin123').digest('hex')
const SESSION_SECRET = process.env.SESSION_SECRET || '12345'

/** Constant-time compare for equal-length hex digests. */
function safeEqualHex(a, b) {
  try {
    if (typeof a !== 'string' || typeof b !== 'string') return false
    const ba = Buffer.from(a, 'hex')
    const bb = Buffer.from(b, 'hex')
    if (ba.length === 0 || ba.length !== bb.length) return false
    return crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

// Create a simple session token
export function createSessionToken(username) {
  requireProdSecrets()
  const payload = {
    username,
    timestamp: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }

  const token = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(token).digest('hex')

  return `${token}.${signature}`
}

// Verify session token
export function verifySessionToken(token) {
  try {
    if (!token) return null
    requireProdSecrets()

    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null

    // Verify signature (constant-time)
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
    if (!safeEqualHex(signature, expectedSignature)) return null

    // Parse payload
    const data = JSON.parse(Buffer.from(payload, 'base64').toString())

    // Check expiration
    if (Date.now() > data.exp) return null

    return data
  } catch (error) {
    return null
  }
}

// Authenticate user
export function authenticateUser(username, password) {
  requireProdSecrets()
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

  return username === ADMIN_USERNAME && safeEqualHex(passwordHash, ADMIN_PASSWORD_HASH)
}

// Middleware to check authentication
export function requireAuth(handler) {
  return async (req) => {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    const session = verifySessionToken(sessionToken)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Add user info to request
    req.user = session
    return handler(req)
  }
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_session')?.value

  return verifySessionToken(sessionToken)
}

// Hash password utility (for setup)
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}