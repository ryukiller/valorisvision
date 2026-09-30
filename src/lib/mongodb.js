import { MongoClient } from 'mongodb'

/**
 * Shared MongoDB client promise (reuse across server modules).
 * Prefer this over `new MongoClient` per route — see docs/codebase-audit.md P1-8.
 *
 * App code uses collection `blog` for posts (admin + public + content bot).
 * One-off copy from legacy `articles`: scripts/migrate-articles-to-blog.mjs
 */

let clientPromise

/**
 * @returns {Promise<import('mongodb').MongoClient>}
 */
export function getMongoClient() {
  const uri = process.env.MONGODB
  if (!uri) {
    throw new Error('MONGODB environment variable is not set')
  }

  if (!clientPromise) {
    const client = new MongoClient(uri)
    clientPromise = client.connect().then(() => client)
  }

  return clientPromise
}

/**
 * @param {string} collectionName
 * @param {string} [dbName='valorisvisio']
 * @returns {Promise<import('mongodb').Collection>}
 */
export async function getDbCollection(collectionName, dbName = 'valorisvisio') {
  const client = await getMongoClient()
  return client.db(dbName).collection(collectionName)
}
