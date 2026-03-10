import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDB() {
  try {
    if (!config.mongodb.uri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    await mongoose.connect(config.mongodb.uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection failed:", error);
  }
}
