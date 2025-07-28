// Simple in-memory cache with TTL
class MemoryCache {
  constructor() {
    this.cache = new Map()
    this.timers = new Map()
  }

  set(key, value, ttl = 300000) { // Default 5 minutes
    // Clear existing timer if it exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }

    // Set the value
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })

    // Set timer to clear the cache entry
    const timer = setTimeout(() => {
      this.delete(key)
    }, ttl)

    this.timers.set(key, timer)
  }

  get(key) {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return null
    }

    return entry.value
  }

  delete(key) {
    this.cache.delete(key)
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
  }

  clear() {
    this.cache.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }

  has(key) {
    return this.cache.has(key) && this.get(key) !== null
  }

  size() {
    return this.cache.size
  }
}

// Create singleton instance
const cache = new MemoryCache()

// Cache key generators
export const getCacheKey = {
  coins: (page, limit, searchTerm = '') => `coins:${page}:${limit}:${searchTerm}`,
  blog: (page, limit, category = '') => `blog:${page}:${limit}:${category}`,
  blogPost: (slug) => `blogPost:${slug}`,
  priceData: (coinId) => `price:${coinId}`,
  marketData: () => `market:global`
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  COINS: 5 * 60 * 1000, // 5 minutes
  BLOG: 10 * 60 * 1000, // 10 minutes
  BLOG_POST: 30 * 60 * 1000, // 30 minutes
  PRICE_DATA: 2 * 60 * 1000, // 2 minutes
  MARKET_DATA: 5 * 60 * 1000, // 5 minutes
}

export default cache