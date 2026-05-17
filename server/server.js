// Load server/.env before any other application modules
import { env, validateEnv, corsOrigins } from './config/env.js';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import interviewPrepRoutes from './routes/interviewPrepRoutes.js';

validateEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// CORS — localhost:5173 + CLIENT_URL from .env
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check (includes env sanity flags for local debugging)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Joblytic API is running',
    env: env.nodeEnv,
    port: env.port,
    cors: corsOrigins,
    mongoConfigured: Boolean(env.mongoUri),
    rapidApiConfigured: Boolean(env.rapidApiKey),
    geminiConfigured: Boolean(env.geminiApiKey),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview-prep', interviewPrepRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
});
