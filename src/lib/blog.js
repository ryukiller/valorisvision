import { MongoClient } from 'mongodb';

// Shared, promise-cached MongoDB client for server components
let clientPromise;

async function getCollection() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB);
    clientPromise = client.connect().then(() => client);
  }
  const client = await clientPromise;
  return client.db('valorisvisio').collection('blog');
}

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id?.toString() };
}

/**
 * List blog posts with pagination and optional category filter.
 */
export async function getBlogPosts({ page = 1, limit = 30, category_slug } = {}) {
  const collection = await getCollection();
  const filter = category_slug ? { category_slug } : {};
  const skip = (page - 1) * limit;

  const [docs, totalCount] = await Promise.all([
    collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    data: docs.map(serialize),
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      totalCount,
    },
  };
}

/**
 * Single post by slug (null when not found).
 */
export async function getBlogPostBySlug(slug) {
  const collection = await getCollection();
  const doc = await collection.findOne({ slug });
  return serialize(doc);
}

/**
 * Unique categories with name + slug.
 */
export async function getCategories() {
  const collection = await getCollection();
  const categories = await collection
    .aggregate([
      { $match: { category: { $ne: '' }, category_slug: { $ne: '' } } },
      { $group: { _id: { name: '$category', slug: '$category_slug' } } },
      { $project: { _id: 0, name: '$_id.name', slug: '$_id.slug' } },
    ])
    .toArray();
  return categories;
}
