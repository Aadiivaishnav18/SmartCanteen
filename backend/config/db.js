import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  try {
    if (mongoUri) {
      console.log('🍃 Connecting to MongoDB Atlas / Local MongoDB...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ MongoDB Connected Successfully to: ${mongoose.connection.host}`);
      return;
    }
  } catch (error) {
    console.warn('⚠️ Primary MONGO_URI connection failed or timed out:', error.message);
    console.log('🔄 Fallback: Initializing MongoMemoryServer for instant database availability...');
  }

  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✅ In-Memory MongoDB Connected Successfully!');
  } catch (memErr) {
    console.error('❌ MongoDB connection failed:', memErr.message);
  }
}