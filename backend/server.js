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

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
