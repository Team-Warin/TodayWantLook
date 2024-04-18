import { MongoClient } from 'mongodb';
const url =
  process.env.DB_URL?.replace(/\{user\}/, process.env.MONGODB_ID ?? '').replace(
    /\{pwd\}/,
    process.env.MONGODB_PASSWORD ?? ''
  ) ?? '';

let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}
export { connectDB };
