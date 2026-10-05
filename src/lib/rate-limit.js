/**
 * Simple in-memory fixed-window rate limiter.
 *
 * Limitation: process-local only. On serverless / multi-instance hosts
 * (Netlify, Vercel, etc.) each isolate has its own Map, so limits are
 * per-instance rather than global. Prefer an Edge/CDN or Redis limiter
 * for production-grade protection.
 */

/** @type {Map<string, { count: number, resetAt: number }>} */
const buckets = new Map()

/**
 * @param {string} key
 * @param {{ limit?: number, windowMs?: number }} [opts]
 * @returns {{ ok: boolean, remaining: number, retryAfterMs: number }}
 */
export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
  const now = Date.now()
  let entry = buckets.get(key)

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs }
    buckets.set(key, entry)
  }

  entry.count += 1
  const remaining = Math.max(0, limit - entry.count)
  const retryAfterMs = Math.max(0, entry.resetAt - now)

  if (entry.count > limit) {
    return { ok: false, remaining: 0, retryAfterMs }
  }

  return { ok: true, remaining, retryAfterMs }
}

/**
 * Best-effort client IP from common proxy headers.
 * @param {Request} req
 * @returns {string}
 */
export function getClientIp(req) {
  // Take the LAST x-forwarded-for entry: the platform proxy appends the real
  // client IP at the end, while the first entries are user-controllable and
  // would let attackers rotate headers to bypass every limit.
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((ip) => ip.trim()).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    const parts = realIp.split(',').map((ip) => ip.trim()).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last
  }
  return 'unknown'
}
