import { Router } from 'express';
import { Document } from '../models/Document.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    const items = await Document.find(query).sort({ order: 1, date: -1, createdAt: -1 });
    res.json(items);
  })
);

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Document.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Document not found' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Document.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Document not found' });
    res.json({ ok: true });
  })
);

export default router;
