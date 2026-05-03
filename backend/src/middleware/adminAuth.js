import { env } from '../config/env.js';

export function requireAdmin(req, res, next) {
  if (!env.adminToken) {
    return res.status(503).json({ error: 'ADMIN_TOKEN is not configured on the server' });
  }

  const token = req.header('x-admin-token');
  const identifier = (req.header('x-admin-identifier') || '').trim().toLowerCase();

  const tokenMatches = token === env.adminToken;
  const identifierConfigured = Boolean(env.adminUsername || env.adminEmail);
  const identifierMatches = !identifierConfigured
    ? true
    : (identifier === env.adminUsername?.toLowerCase() || identifier === env.adminEmail?.toLowerCase());

  if (!tokenMatches || !identifierMatches) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
