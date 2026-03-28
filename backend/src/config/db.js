import mongoose from 'mongoose';
import { env } from './env.js';

export function getDbStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    configured: Boolean(env.mongoUri),
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState
  };
}

export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing');
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
}
