// filepath: d:\projects\gadget-pulse\lib\mongo.js
import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    // Check if we're already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB is already connected.");
      return mongoose.connection;
    }

    // Check if we have a connection URI
    if (!process.env.DB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("MongoDB connected successfully.");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectMongo;