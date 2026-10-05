import { describe, it, expect, vi } from 'vitest'
import crypto from 'crypto'

// auth.js imports next/headers + next/server at module load; stub them —
// tests only cover the pure crypto helpers, not request handlers.
vi.mock('next/headers', () => ({ cookies: vi.fn() }))
vi.mock('next/server', () => ({ NextResponse: { json: vi.fn() } }))

const { hashPassword, verifyPassword } = await import('@/lib/auth')

describe('hashPassword / verifyPassword', () => {
  it('round-trips scrypt hashes', () => {
    const hash = hashPassword('correct horse battery staple')
    expect(hash).toMatch(/^scrypt\$/)
    expect(verifyPassword('correct horse battery staple', hash)).toBe(true)
  })

  it('uses a fresh random salt per call', () => {
    const a = hashPassword('same-password')
    const b = hashPassword('same-password')
    expect(a).not.toBe(b)
    expect(verifyPassword('same-password', a)).toBe(true)
    expect(verifyPassword('same-password', b)).toBe(true)
  })

  it('verifies legacy bare SHA-256 hashes (transition)', () => {
    const legacy = crypto.createHash('sha256').update('oldpassword').digest('hex')
    expect(verifyPassword('oldpassword', legacy)).toBe(true)
    expect(verifyPassword('wrong', legacy)).toBe(false)
  })

  it('rejects wrong passwords', () => {
    const hash = hashPassword('s3cret')
    expect(verifyPassword('S3cret', hash)).toBe(false)
    expect(verifyPassword('s3cre', hash)).toBe(false)
  })

  it('rejects malformed / non-string input', () => {
    expect(verifyPassword(null, 'scrypt$x$y')).toBe(false)
    expect(verifyPassword('pw', undefined)).toBe(false)
    expect(verifyPassword('pw', 'scrypt$only-two-parts')).toBe(false)
    expect(verifyPassword('pw', 'not-a-known-format')).toBe(false)
    // Garbage hex must not throw
    expect(verifyPassword('pw', 'scrypt$zz$zz')).toBe(false)
  })
})
