import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  if (!env.adminToken) {
    return res.status(503).json({ error: 'ADMIN_TOKEN is not configured on the server' });
  }

  const token = req.header('x-admin-token');
  if (token !== env.adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
