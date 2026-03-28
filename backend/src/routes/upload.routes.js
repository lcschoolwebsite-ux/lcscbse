import { Router } from 'express';
import crypto from 'crypto';
import path from 'path';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

function buildPdfPublicId(originalName = '') {
  const ext = (path.extname(originalName).replace('.', '') || 'pdf').toLowerCase();
  const baseName = path.basename(originalName, path.extname(originalName))
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'document';

  return `${baseName}.${ext}`;
}

function uploadToCloudinary(file) {
  const isPdf = file.mimetype === 'application/pdf';
  const folder = isPdf ? 'loretto/documents' : 'loretto/images';
  const resourceType = isPdf ? 'raw' : 'image';
  const publicId = isPdf ? buildPdfPublicId(file.originalname) : crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

router.post(
  '/',
  requireAdmin,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
    }

    const result = await uploadToCloudinary(req.file);
    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes
    });
  })
);

export default router;
