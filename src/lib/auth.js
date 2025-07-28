import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple hash-based authentication
// In production, use proper JWT tokens and database storage
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || crypto.createHash('sha256').update('admin123').digest('hex')
const SESSION_SECRET = process.env.SESSION_SECRET || '12345'

// Create a simple session token
export function createSessionToken(username) {
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

    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null

    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
    if (signature !== expectedSignature) return null

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
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')

  return username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH
}

// Middleware to check authentication
export function requireAuth(handler) {
  return async (req) => {
    const cookieStore = cookies()
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
export function getCurrentUser() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('admin_session')?.value

  return verifySessionToken(sessionToken)
}

// Hash password utility (for setup)
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}