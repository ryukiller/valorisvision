import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const isProd = process.env.NODE_ENV === 'production'

/** scrypt params — keep stable so stored hashes remain verifiable */
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 }

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

function safeEqualBuf(a, b) {
  try {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) return false
    if (a.length === 0 || a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Hash a password for ADMIN_PASSWORD_HASH.
 * Format: scrypt$<saltHex>$<hashHex>
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const derived = crypto.scryptSync(password, salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
  })
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`
}

/**
 * Verify password against stored hash.
 * Supports scrypt$… (preferred) and legacy bare SHA-256 hex (transition).
 */
export function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false

  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$')
    if (parts.length !== 3) return false
    const salt = Buffer.from(parts[1], 'hex')
    const expected = Buffer.from(parts[2], 'hex')
    if (salt.length === 0 || expected.length === 0) return false
    const actual = crypto.scryptSync(password, salt, expected.length, {
      N: SCRYPT.N,
      r: SCRYPT.r,
      p: SCRYPT.p,
    })
    return safeEqualBuf(actual, expected)
  }

  // Legacy SHA-256 hex (pre–P1-13)
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  return safeEqualHex(passwordHash, storedHash)
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

    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
    if (!safeEqualHex(signature, expectedSignature)) return null

    const data = JSON.parse(Buffer.from(payload, 'base64').toString())

    if (Date.now() > data.exp) return null

    return data
  } catch {
    return null
  }
}

// Authenticate user
export function authenticateUser(username, password) {
  requireProdSecrets()
  return username === ADMIN_USERNAME && verifyPassword(password, ADMIN_PASSWORD_HASH)
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
