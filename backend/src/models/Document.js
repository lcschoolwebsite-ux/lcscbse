import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    name: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    date: { type: Date, default: null },
    url: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);
