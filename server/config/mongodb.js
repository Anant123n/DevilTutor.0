import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || process.env.mongo_url;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured. Add it to server/.env before starting the API.");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  await mongoose.connect(mongoUri);
}
