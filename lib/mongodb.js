import { MongoClient } from 'mongodb'

let clientPromise

export async function getCollection(name) {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI not set')
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoPromise) global._mongoPromise = client.connect()
      clientPromise = global._mongoPromise
    } else {
      clientPromise = client.connect()
    }
  }
  const client = await clientPromise
  return client.db('propertybids').collection(name)
}
