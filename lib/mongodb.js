import { MongoClient } from "mongodb";

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Dev: reuse across HMR hot reloads
  if (!global._mongoPromise) {
    global._mongoPromise = new MongoClient(
      process.env.MONGODB_URI,
      options,
    ).connect();
  }
  clientPromise = global._mongoPromise;
} else {
  // Prod: one client per serverless instance
  clientPromise = new MongoClient(process.env.MONGODB_URI, options).connect();
}

export async function getCollection(name) {
  const client = await clientPromise;
  return client.db("propertybids").collection(name);
}
