import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String, trim: true }],
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const News = mongoose.model('News', newsSchema);
