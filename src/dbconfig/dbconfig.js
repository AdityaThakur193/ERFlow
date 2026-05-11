import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let isConnected = false;

export default async function connectToDb() {
  try {
    if (isConnected) {
      console.log("Using existing database connection");
      return;
    }

    const db = await mongoose.connect(MONGO_URI);

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅✅ MongoDB Connected");
    }
  } catch (error) {
    console.log("Database connection failed:", error);
  }
}
