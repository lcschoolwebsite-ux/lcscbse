import mongoose from 'mongoose';

const admissionInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    class: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export const AdmissionInquiry = mongoose.model('AdmissionInquiry', admissionInquirySchema);
