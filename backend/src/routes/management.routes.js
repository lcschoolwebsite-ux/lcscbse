import { Router } from 'express';
import { Management } from '../models/Management.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.group) query.group = req.query.group;
    const items = await Management.find(query).sort({ order: 1, createdAt: -1 });
    res.json(items);
  })
);

router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Management.create(req.body);
    res.status(201).json(item);
  })
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Management.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Management member not found' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Management.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Management member not found' });
    res.json({ ok: true });
  })
);

export default router;
