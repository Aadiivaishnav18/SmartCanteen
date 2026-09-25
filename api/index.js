import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../backend/config/db.js';
import { seedMongoData } from '../backend/routes/seedRoutes.js';
import { User } from '../backend/models/User.js';

import authRoutes from '../backend/routes/authRoutes.js';
import foodRoutes from '../backend/routes/foodRoutes.js';
import slotRoutes from '../backend/routes/slotRoutes.js';
import orderRoutes from '../backend/routes/orderRoutes.js';
import seedRoutes from '../backend/routes/seedRoutes.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Database Middleware for Serverless
let isConnected = false;

const ensureDbConnected = async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Seeding Vercel serverless database with campus data...');
        await seedMongoData();
      }
      isConnected = true;
    } catch (err) {
      console.error('❌ Serverless DB connection error:', err.message);
    }
  }
  next();
};

app.use(ensureDbConnected);

// Mount API Routes (supports both /api/* prefix and serverless stripped routes)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/foods', foodRoutes);
app.use('/foods', foodRoutes);

app.use('/api/slots', slotRoutes);
app.use('/slots', slotRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/seed', seedRoutes);
app.use('/seed', seedRoutes);

app.get(['/api/health', '/health', '/'], (req, res) => {
  res.json({ status: 'OK', message: 'SmartCanteen Serverless API is operational.' });
});

export default app;
