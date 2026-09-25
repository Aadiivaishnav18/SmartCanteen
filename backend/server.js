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

// ✅ ADD: Request logging middleware
app.use((req, res, next) => {
  console.log(`📍 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://smart-canteen-nine-opal.vercel.app',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173',
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

// Mount Routes
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
  res.json({ status: 'OK', message: 'SmartCanteen MERN Backend operational' });
});

// ✅ ADD: Error handling middleware (MUST be after all routes)
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// ✅ ADD: Catch undefined routes
app.use((req, res) => {
  console.warn(`⚠️ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Connect Database & Start Server
connectDB()
  .then(async () => {
    console.log('✅ Database connected successfully');
    
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in DB: ${userCount}`);
    
    if (userCount === 0) {
      console.log('🌱 Seeding default data...');
      await seedMongoData();
      console.log('✅ Seeding complete');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  })
  .catch(err => {
    console.error('❌ FATAL: Database connection failed');
    console.error('Error:', err.message);
    process.exit(1);
  });