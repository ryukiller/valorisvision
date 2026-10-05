import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const reqWith = (headers = {}) => ({ headers: new Headers(headers) })

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to the limit, then blocks', () => {
    const key = 'test:1'
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, { limit: 3, windowMs: 60_000 }).ok).toBe(true)
    }
    const blocked = rateLimit(key, { limit: 3, windowMs: 60_000 })
    expect(blocked.ok).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterMs).toBeGreaterThan(0)
  })

  it('resets after the window expires', () => {
    const key = 'test:2'
    rateLimit(key, { limit: 1, windowMs: 1000 })
    expect(rateLimit(key, { limit: 1, windowMs: 1000 }).ok).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(rateLimit(key, { limit: 1, windowMs: 1000 }).ok).toBe(true)
  })

  it('tracks keys independently', () => {
    expect(rateLimit('a', { limit: 1, windowMs: 60_000 }).ok).toBe(true)
    expect(rateLimit('a', { limit: 1, windowMs: 60_000 }).ok).toBe(false)
    expect(rateLimit('b', { limit: 1, windowMs: 60_000 }).ok).toBe(true)
  })
})

describe('getClientIp', () => {
  it('uses the LAST x-forwarded-for entry (first is user-controllable)', () => {
    const req = reqWith({ 'x-forwarded-for': '203.0.113.66, 198.51.100.7, 192.0.2.9' })
    expect(getClientIp(req)).toBe('192.0.2.9')
  })

  it('ignores empty / whitespace entries in the chain', () => {
    const req = reqWith({ 'x-forwarded-for': ', , 198.51.100.7' })
    expect(getClientIp(req)).toBe('198.51.100.7')
  })

  it('falls back to x-real-ip, then "unknown"', () => {
    expect(getClientIp(reqWith({ 'x-real-ip': '10.0.0.4' }))).toBe('10.0.0.4')
    expect(getClientIp(reqWith({}))).toBe('unknown')
  })
})
