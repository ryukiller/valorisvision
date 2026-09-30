import { MongoClient } from 'mongodb'

/**
 * Shared MongoDB client promise (reuse across server modules).
 * Prefer this over `new MongoClient` per route — see docs/codebase-audit.md P1-8.
 *
 * Remaining work (not done in P1): migrate admin/articles from collection
 * `articles` → live `blog`, and switch remaining API routes (getdata, blog,
 * admin/prices) to this helper.
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
 * @param {string} [dbName='valorisvisio']
 * @param {string} collectionName
 * @returns {Promise<import('mongodb').Collection>}
 */
export async function getDbCollection(collectionName, dbName = 'valorisvisio') {
  const client = await getMongoClient()
  return client.db(dbName).collection(collectionName)
}
