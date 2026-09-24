import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export async function connectDB() {
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcanteen_db';

  try {
    console.log(`🍃 Attempting MongoDB connection to: ${mongoUri}`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // Fast 2s timeout fallback
    });
    console.log(`✅ MongoDB Connected Successfully to: ${mongoose.connection.host}`);
  } catch (err) {
    console.log('⚠️ Local MongoDB service not active on port 27017. Switching to MongoDB in-memory database instance...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri, {
        dbName: 'smartcanteen_db'
      });
      console.log(`✅ MongoDB Connected Successfully to In-Memory Instance: ${mongoose.connection.host}`);
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to MongoDB instance:', fallbackErr);
      process.exit(1);
    }
  }
}
