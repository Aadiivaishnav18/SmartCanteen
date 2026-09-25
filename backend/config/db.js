import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('🍃 Connecting to MongoDB Atlas...');

    await mongoose.connect(mongoUri);

    console.log(
      `✅ MongoDB Connected Successfully to: ${mongoose.connection.host}`
    );
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  }
}