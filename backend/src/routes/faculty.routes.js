import { Router } from 'express';
import { Faculty } from '../models/Faculty.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const items = await Faculty.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  })
);

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Faculty.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Faculty member not found' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Faculty.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Faculty member not found' });
    res.json({ ok: true });
  })
);

export default router;
