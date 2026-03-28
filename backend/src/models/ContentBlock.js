import mongoose from 'mongoose';

const contentBlockSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    section: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const ContentBlock = mongoose.model('ContentBlock', contentBlockSchema);
