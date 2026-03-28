import { Router } from 'express';
import { News } from '../models/News.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await News.find().sort({ date: -1, createdAt: -1 });
    res.json(items);
  })
);

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await News.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'News item not found' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await News.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'News item not found' });
    res.json({ ok: true });
  })
);

export default router;
