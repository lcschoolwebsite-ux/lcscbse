import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    qualification: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    photo: { type: String, default: '' },
    note: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Faculty = mongoose.model('Faculty', facultySchema);
