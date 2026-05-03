import crypto from 'crypto';
import path from 'path';
import { cloudinary } from '../config/cloudinary.js';

function buildPdfPublicId(originalName = '') {
  const ext = (path.extname(originalName).replace('.', '') || 'pdf').toLowerCase();
  const baseName = path
    .basename(originalName, path.extname(originalName))
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'document';

  return `${baseName}.${ext}`;
}

function isTransformationSegment(value = '') {
  const segment = String(value || '');
  return /,/.test(segment) || /^[a-z]{1,3}_[A-Za-z0-9-]+/i.test(segment);
}

export function uploadToCloudinary(file) {
  const isPdf = file.mimetype === 'application/pdf';
  const isVideo = file.mimetype.startsWith('video/');
  let folder = 'loretto/images';
  let resourceType = 'image';

  if (isPdf) {
    folder = 'loretto/documents';
    resourceType = 'raw';
  } else if (isVideo) {
    folder = 'loretto/videos';
    resourceType = 'video';
  }

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

export function extractCloudinaryAsset(urlValue = '') {
  try {
    const parsed = new URL(String(urlValue || '').trim());
    if (!/(^|\.)cloudinary\.com$/i.test(parsed.hostname)) return null;

    const segments = parsed.pathname
      .split('/')
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));

    const uploadIndex = segments.indexOf('upload');
    if (uploadIndex < 2) return null;

    const resourceType = segments[uploadIndex - 1] || 'image';
    let assetSegments = segments.slice(uploadIndex + 1);
    const versionIndex = assetSegments.findIndex((segment) => /^v\d+$/.test(segment));

    if (versionIndex !== -1) {
      assetSegments = assetSegments.slice(versionIndex + 1);
    } else {
      while (assetSegments.length > 1 && isTransformationSegment(assetSegments[0])) {
        assetSegments.shift();
      }
    }

    if (!assetSegments.length) return null;

    const publicSegments = assetSegments.slice();
    if (resourceType !== 'raw') {
      const lastIndex = publicSegments.length - 1;
      publicSegments[lastIndex] = publicSegments[lastIndex].replace(/\.[^.]+$/, '');
    }

    const publicId = publicSegments.join('/').trim();
    if (!publicId) return null;

    return {
      publicId,
      resourceType
    };
  } catch (error) {
    return null;
  }
}

function normalizeDeleteTarget(target) {
  if (!target) return null;
  if (typeof target === 'string') {
    return extractCloudinaryAsset(target) || null;
  }

  const publicId = String(target.publicId || '').trim();
  const resourceType = String(target.resourceType || '').trim();
  if (publicId) {
    return {
      publicId,
      resourceType: resourceType || 'image'
    };
  }

  if (target.url) {
    return extractCloudinaryAsset(target.url) || null;
  }

  return null;
}

export async function deleteCloudinaryAsset(target, options = {}) {
  const normalized = normalizeDeleteTarget(target);
  if (!normalized) {
    return {
      ok: false,
      skipped: true,
      error: 'A valid Cloudinary url or publicId is required'
    };
  }

  try {
    const response = await cloudinary.uploader.destroy(normalized.publicId, {
      resource_type: normalized.resourceType || 'image',
      invalidate: true
    });
    const result = String((response && response.result) || '').toLowerCase();

    return {
      ok: result === 'ok' || result === 'not found',
      publicId: normalized.publicId,
      resourceType: normalized.resourceType || 'image',
      result
    };
  } catch (error) {
    if (options.suppressErrors) {
      return {
        ok: false,
        publicId: normalized.publicId,
        resourceType: normalized.resourceType || 'image',
        error: error.message || 'Cloudinary delete failed'
      };
    }
    throw error;
  }
}

export async function deleteCloudinaryAssets(targets = [], options = {}) {
  const seen = new Set();
  const results = [];

  for (const target of Array.isArray(targets) ? targets : []) {
    const normalized = normalizeDeleteTarget(target);
    if (!normalized) continue;

    const key = `${normalized.resourceType || 'image'}:${normalized.publicId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push(await deleteCloudinaryAsset(normalized, options));
  }

  return results;
}
