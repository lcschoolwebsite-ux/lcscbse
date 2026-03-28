import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    subject: { type: String, default: 'General Enquiry', trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, default: 'new', trim: true },
    adminEmailSent: { type: Boolean, default: false },
    autoReplySent: { type: Boolean, default: false },
    adminEmailError: { type: String, default: '', trim: true },
    autoReplyError: { type: String, default: '', trim: true },
    notificationRecipient: { type: String, default: '', trim: true, lowercase: true }
  },
  { timestamps: true }
);

export const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
