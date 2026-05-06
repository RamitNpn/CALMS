import mongoose from "mongoose";
import dotenv from "dotenv";
import env from "./env";

dotenv.config();

export async function connectToDatabase() {
  const mongoUri = env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("❌ MONGO_URI is not defined in your .env file.");
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: env.DB_NAME,
    });

    console.log("✅ Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    process.exit(1);
  }
}
