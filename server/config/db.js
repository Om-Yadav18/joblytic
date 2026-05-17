import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Connect to MongoDB Atlas using MONGO_URI from server/.env
 */
export const connectDB = async () => {
  if (!env.mongoUri) {
    console.error('MongoDB connection error: MONGO_URI is not defined in server/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
