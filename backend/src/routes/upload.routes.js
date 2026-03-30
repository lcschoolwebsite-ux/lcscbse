import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { deleteCloudinaryAsset, uploadToCloudinary } from '../utils/cloudinaryAssets.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

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

router.delete(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const deletion = await deleteCloudinaryAsset({
      url: req.body && req.body.url,
      publicId: req.body && req.body.publicId,
      resourceType: req.body && req.body.resourceType
    });

    if (deletion.skipped) {
      return res.status(400).json({ error: deletion.error });
    }

    if (!deletion.ok) {
      return res.status(502).json({
        error: deletion.error || 'Cloudinary delete failed',
        publicId: deletion.publicId,
        resourceType: deletion.resourceType,
        result: deletion.result || ''
      });
    }

    res.json({
      ok: true,
      publicId: deletion.publicId,
      resourceType: deletion.resourceType,
      result: deletion.result
    });
  })
);

export default router;
