import mongoose from 'mongoose';
import { News } from '../src/models/News.js';
import { env } from '../src/config/env.js';

async function check() {
  await mongoose.connect(env.mongodbUri);
  const count = await News.countDocuments();
  const items = await News.find().select('title visible');
  console.log('Total News in DB:', count);
  console.log('Items:', JSON.stringify(items, null, 2));
  await mongoose.disconnect();
}

check();
