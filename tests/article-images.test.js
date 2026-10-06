import { describe, it, expect } from 'vitest'
import { Binary } from 'mongodb'
import { coerceImageBytes, articleImageUrl } from '@/lib/article-images'

describe('coerceImageBytes', () => {
  const sample = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x01, 0x02, 0x03, 0x04])

  it('returns a Buffer unchanged when non-empty', () => {
    const out = coerceImageBytes(sample)
    expect(Buffer.isBuffer(out)).toBe(true)
    expect(out.equals(sample)).toBe(true)
  })

  it('rejects empty Buffer / Uint8Array', () => {
    expect(coerceImageBytes(Buffer.alloc(0))).toBeNull()
    expect(coerceImageBytes(new Uint8Array(0))).toBeNull()
    expect(coerceImageBytes(null)).toBeNull()
    expect(coerceImageBytes(undefined)).toBeNull()
  })

  it('extracts bytes from BSON Binary (the prod failure mode)', () => {
    // Root cause: Binary.length is a *function*, so
    // `new Uint8Array(binary)` yields length 0 while still being truthy.
    const binary = new Binary(sample)
    expect(typeof binary.length).toBe('function')
    expect(new Uint8Array(binary).byteLength).toBe(0)

    const out = coerceImageBytes(binary)
    expect(out).not.toBeNull()
    expect(out.equals(sample)).toBe(true)
    expect(new Uint8Array(out).byteLength).toBe(sample.length)
  })

  it('handles Binary after BSON serialize/deserialize round-trip', async () => {
    const { serialize, deserialize } = await import('bson')
    const doc = deserialize(serialize({ data: sample }))
    expect(doc.data._bsontype).toBe('Binary')
    expect(new Uint8Array(doc.data).byteLength).toBe(0)

    const out = coerceImageBytes(doc.data)
    expect(out.equals(sample)).toBe(true)
  })

  it('accepts Uint8Array and ArrayBuffer', () => {
    const u8 = new Uint8Array(sample)
    expect(coerceImageBytes(u8).equals(sample)).toBe(true)
    expect(coerceImageBytes(sample.buffer.slice(sample.byteOffset, sample.byteOffset + sample.byteLength)).equals(sample)).toBe(true)
  })

  it('accepts Node Buffer JSON shape', () => {
    const json = sample.toJSON()
    expect(json.type).toBe('Buffer')
    expect(coerceImageBytes(json).equals(sample)).toBe(true)
  })
})

describe('articleImageUrl', () => {
  it('builds the API path', () => {
    expect(articleImageUrl('slug-123.webp')).toBe('/api/article-image/slug-123.webp')
  })
})
