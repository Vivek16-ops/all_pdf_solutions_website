import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MongoDB_URI || process.env.MongoDB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MongoDB URI in your .env file');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    })
      .then((mongoose) => {
        console.log('MongoDB connection successful!');
        return mongoose;
      })
      .catch((err) => {
        console.error('There is a problem while connecting to MongoDB:', err);
        throw err;
      });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    // Already logged in catch above
    throw err;
  }
}
