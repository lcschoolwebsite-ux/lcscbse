import mongoose from 'mongoose';

const managementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: '' },
    role: { type: String, default: '' },
    group: { type: String, default: 'management' },
    period: { type: String, default: '' },
    contact: { type: String, default: '' },
    photo: { type: String, default: '' },
    bio: { type: String, default: '' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Management = mongoose.model('Management', managementSchema);
