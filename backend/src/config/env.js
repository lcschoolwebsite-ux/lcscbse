import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI || '',
  adminToken: process.env.ADMIN_TOKEN || '',
  adminUsername: (process.env.ADMIN_USERNAME || '').trim().toLowerCase(),
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'Loretto Central School <onboarding@resend.dev>',
  contactEmail: process.env.CONTACT_EMAIL || ''
};
