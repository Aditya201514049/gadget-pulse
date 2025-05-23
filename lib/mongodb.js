// filepath: d:\projects\gadget-pulse\lib\mongodb.js
import mongoose from "mongoose";

// Connection caching
const MONGODB_URI = process.env.DB_URI; // Using DB_URI from .env.local
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to MongoDB
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log('MongoDB connected successfully!');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;