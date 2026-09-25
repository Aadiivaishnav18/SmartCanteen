import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedMongoData } from './routes/seedRoutes.js';
import { User } from './models/User.js';

import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for Local & Deployed Frontend (Vercel, custom domains, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://smart-canteen-nine-opal.vercel.app',
      'http://localhost:1234',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173',
      'http://127.0.0.1:1234',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      'http://127.0.0.1:5173'
    ].filter(Boolean);

    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seed', seedRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartCanteen MERN Backend Service operational.' });
});

// Connect Database & Start Server
connectDB().then(async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('🌱 Seeding default campus data into MongoDB...');
    await seedMongoData();
  }

  app.listen(PORT, () => {
    console.log(`🚀 SmartCanteen MERN Backend Server running on http://localhost:${PORT}`);
  });
});
