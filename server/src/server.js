// IMPORTANT: Set Node.js TLS options BEFORE any imports
// This fixes OpenSSL 3.x compatibility issues with MongoDB Atlas on Node.js 22
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Import routes
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

// Import cron jobs
import { startCronJobs } from './services/cronJobs.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/search', searchRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

  // Start cron jobs
  if (process.env.NODE_ENV === 'production') {
    startCronJobs();
  } else {
    console.log('Cron jobs disabled in development mode');
    console.log('To enable cron jobs, set NODE_ENV=production');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
