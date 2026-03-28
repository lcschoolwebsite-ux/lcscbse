import { Router } from 'express';
import { AdmissionInquiry } from '../models/AdmissionInquiry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const items = await AdmissionInquiry.find().sort({ createdAt: -1 });
    res.json(items);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    const className = String(req.body.class || req.body.grade || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' });
    }

    const item = await AdmissionInquiry.create({
      name,
      email,
      phone,
      class: className,
      message,
      status: 'pending'
    });

    res.status(201).json({
      ok: true,
      message: 'Admission enquiry submitted successfully',
      inquiry: item
    });
  })
);

router.put(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await AdmissionInquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(item);
  })
);

router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await AdmissionInquiry.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ ok: true });
  })
);

export default router;
