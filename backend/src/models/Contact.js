import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    address: { type: String, default: '' },
    phones: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    officeHours: { type: String, default: '' },
    holidayHours: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    formEnabled: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    recipientEmail: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
