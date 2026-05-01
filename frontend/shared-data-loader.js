/**
 * LORETTO CENTRAL SCHOOL — Shared Data Loader
 * Standardized data fetching and rendering for the frontend.
 */

/* ── API BASE RESOLUTION ── */
var API_BASE_KEY = 'loretto_api_base';
var API_BASE_OK_KEY = API_BASE_KEY + '_ok';
var PROD_API_BASE = 'https://lcscbse-production.up.railway.app/api';
var IS_LOCAL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.indexOf('.local') !== -1);
var RESOLVED_API_BASE = '';
var CACHE_PREFIX = 'loretto_cache_';
var CACHE_TTL_MS = 5 * 60 * 1000; // Increased to 5 minutes for better performance
var CACHE_BUST_KEY = 'loretto_public_cache_bust';
var REQUEST_CACHE = Object.create(null);
var PENDING_REQUESTS = Object.create(null);
var API_BASE_PROMISE = null;
var ACTIVE_CACHE_BUST_TOKEN = '';

function storageGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function storageSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures.
  }
}

function storageRemove(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    // Ignore storage failures.
  }
}

function persistentGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function persistentSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures.
  }
}

if (IS_LOCAL) {
  RESOLVED_API_BASE = storageGet(API_BASE_KEY) || '';
}

ACTIVE_CACHE_BUST_TOKEN = persistentGet(CACHE_BUST_KEY) || '';

async function resolveApiBase() {
  var cachedOk = storageGet(API_BASE_OK_KEY) === 'true';
  var cachedBase = storageGet(API_BASE_KEY);
  if (cachedBase && cachedOk) return cachedBase;

  if (API_BASE_PROMISE) return API_BASE_PROMISE;

  API_BASE_PROMISE = (async function () {
    var origin = window.location.origin.replace(/\/+$/, '');
    var candidates = [
      '/api',
      origin + '/api',
      'http://localhost:3000/api',
      'http://127.0.0.1:3000/api',
      'https://lcscbse-production.up.railway.app/api'
    ];

    // Filter out duplicates and nulls
    var uniqueCandidates = [];
    var seen = {};
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (c && !seen[c]) {
        uniqueCandidates.push(c);
        seen[c] = true;
      }
    }

    async function probe(base) {
      return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () {
          reject(new Error('Timeout'));
        }, 2500); // 2.5s timeout for fast fail

        var probeUrl = String(base).replace(/\/+$/, '') + '/health';
        fetch(probeUrl, { method: 'GET', mode: 'cors' })
          .then(function (res) {
            clearTimeout(timer);
            if (res.ok) {
              return res.json();
            }
            throw new Error('Not OK');
          })
          .then(function (data) {
            if (data && (data.service === 'loretto-backend' || data.ok === true)) {
              resolve(base);
            } else {
              reject(new Error('Invalid footprint'));
            }
          })
          .catch(function (err) {
            clearTimeout(timer);
            reject(err);
          });
      });
    }

    // Parallel Probing
    try {
      var winner = await new Promise(function (resolve, reject) {
        var finished = 0;
        var resolved = false;
        if (uniqueCandidates.length === 0) return reject(new Error('No candidates'));

        uniqueCandidates.forEach(function (base) {
          probe(base).then(function (result) {
            if (!resolved) {
              resolved = true;
              resolve(result);
            }
          }).catch(function () {
            finished++;
            if (finished === uniqueCandidates.length && !resolved) {
              reject(new Error('All probes failed'));
            }
          });
        });
      });

      RESOLVED_API_BASE = winner;
      storageSet(API_BASE_KEY, winner);
      storageSet(API_BASE_OK_KEY, 'true');
      return winner;
    } catch (error) {
      // Default fallback if probing fails
      var fallback = IS_LOCAL ? 'http://localhost:3000/api' : '/api';
      RESOLVED_API_BASE = fallback;
      return fallback;
    }
  })();

  try {
    return await API_BASE_PROMISE;
  } finally {
    API_BASE_PROMISE = null;
  }
}

function cacheKey(endpoint) {
  return String(endpoint || '').replace(/^\/+/, '');
}

function readCacheEntry(key) {
  var memoryEntry = REQUEST_CACHE[key];
  if (memoryEntry && memoryEntry.ts) return memoryEntry;

  var raw = storageGet(CACHE_PREFIX + key);
  if (!raw) return null;

  try {
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.ts) return null;
    if ((parsed.bust || '') !== (ACTIVE_CACHE_BUST_TOKEN || '')) {
      delete REQUEST_CACHE[key];
      storageRemove(CACHE_PREFIX + key);
      return null;
    }
    REQUEST_CACHE[key] = parsed;
    return parsed;
  } catch (error) {
    storageRemove(CACHE_PREFIX + key);
    return null;
  }
}

function cacheGet(key, allowStale) {
  var entry = readCacheEntry(key);
  if (!entry) return null;

  if (!allowStale && (Date.now() - entry.ts) > CACHE_TTL_MS) {
    delete REQUEST_CACHE[key];
    storageRemove(CACHE_PREFIX + key);
    return null;
  }

  return entry.data;
}

function cacheSet(key, data) {
  var entry = { ts: Date.now(), data: data, bust: ACTIVE_CACHE_BUST_TOKEN || '' };
  REQUEST_CACHE[key] = entry;
  storageSet(CACHE_PREFIX + key, JSON.stringify(entry));
}

function syncExternalCacheBust() {
  var latestToken = persistentGet(CACHE_BUST_KEY) || '';
  if (ACTIVE_CACHE_BUST_TOKEN === latestToken) return;
  ACTIVE_CACHE_BUST_TOKEN = latestToken;
  clearSharedDataCache();
}

/**
 * Generic Fetch Helper
 */
async function fetchData(endpoint) {
  syncExternalCacheBust();
  var key = cacheKey(endpoint);
  var cached = cacheGet(key, false);
  if (cached !== null) return cached;
  if (PENDING_REQUESTS[key]) return PENDING_REQUESTS[key];

  PENDING_REQUESTS[key] = (async function () {
    try {
      var base = await resolveApiBase();
      var response = await fetch(String(base).replace(/\/+$/, '') + '/' + key);
      if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
      var data = await response.json();
      cacheSet(key, data);
      return data;
    } catch (error) {
      var stale = cacheGet(key, true);
      if (stale !== null) {
        console.warn('Using stale cached data for ' + key + ' after fetch failed.', error);
        return stale;
      }
      console.error('Could not load ' + key + ' data:', error);
      return null;
    } finally {
      delete PENDING_REQUESTS[key];
    }
  })();

  return PENDING_REQUESTS[key];
}

function clearSharedDataCache() {
  REQUEST_CACHE = Object.create(null);
  PENDING_REQUESTS = Object.create(null);

  try {
    for (var i = sessionStorage.length - 1; i >= 0; i -= 1) {
      var key = sessionStorage.key(i);
      if (key && key.indexOf(CACHE_PREFIX) === 0) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (error) {
    // Ignore storage failures.
  }
}

function bumpSharedDataCacheVersion(scope) {
  var payload = JSON.stringify({
    scope: scope || 'all',
    ts: Date.now()
  });
  ACTIVE_CACHE_BUST_TOKEN = payload;
  persistentSet(CACHE_BUST_KEY, payload);
  clearSharedDataCache();
}

window.addEventListener('storage', function (event) {
  if (event && event.key === CACHE_BUST_KEY) {
    ACTIVE_CACHE_BUST_TOKEN = event.newValue || '';
    clearSharedDataCache();
  }
});

// ── DATA FETCHERS ──────────────────────────────────────────

async function loadNewsData() { return await fetchData('news') || []; }
async function loadFacultyData() { return await fetchData('faculty') || []; }
async function loadManagementData() { return await fetchData('management') || []; }
async function loadDocumentsData() { return await fetchData('documents') || []; }
async function loadTestimonialsData() { return await fetchData('testimonials') || []; }
async function loadContactData() { return await fetchData('contact'); }
async function loadAboutSection(section) { return await fetchData(`about/${section}`); }
async function loadSettingData(key) { return await fetchData(`settings/${key}`); }
async function loadContentBlock(key) { return await fetchData(`content/${key}`); }

window.resolveApiBase = resolveApiBase;
window.fetchData = fetchData;
window.clearSharedDataCache = clearSharedDataCache;
window.bumpSharedDataCacheVersion = bumpSharedDataCacheVersion;
window.loadNewsData = loadNewsData;
window.loadFacultyData = loadFacultyData;
window.loadManagementData = loadManagementData;
window.loadDocumentsData = loadDocumentsData;
window.loadTestimonialsData = loadTestimonialsData;
window.loadContactData = loadContactData;
window.loadAboutSection = loadAboutSection;
window.loadSettingData = loadSettingData;
window.loadContentBlock = loadContentBlock;

// ── RENDERING HELPERS ──────────────────────────────────────

function formatDisplayDate(value) {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function splitParagraphs(value) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map(function (part) { return part.trim(); })
    .filter(Boolean);
}

function renderParagraphHtml(value) {
  const paragraphs = Array.isArray(value) ? value : splitParagraphs(value);
  return paragraphs.map(function (paragraph) {
    return '<p>' + escapeHtml(paragraph).replace(/\n/g, '<br>') + '</p>';
  }).join('');
}

function getPrimaryNewsImage(item) {
  if (item && item.image) return item.image;
  if (item && Array.isArray(item.images) && item.images.length) return item.images[0];
  return '';
}

function getNewsGalleryImages(item) {
  const images = Array.isArray(item && item.images) ? item.images.filter(Boolean) : [];
  const primary = getPrimaryNewsImage(item);
  let skippedPrimary = false;

  return images.filter(function (url) {
    if (!primary) return true;
    if (!skippedPrimary && url === primary) {
      skippedPrimary = true;
      return false;
    }
    return true;
  });
}

function getNewsPlaceholderClass(item, index) {
  const source = String(
    (item && (item._id || item.id || item.title || item.date)) ||
    index ||
    'news'
  );
  let hash = 0;

  for (let i = 0; i < source.length; i += 1) {
    hash = (hash + source.charCodeAt(i)) % 6;
  }

  return 'n' + (hash + 1);
}

function extractStructuredContent(data) {
  if (!data || typeof data !== 'object') return null;

  if (typeof data.html === 'string' && data.html.trim()) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.html, 'text/html');
    const heading = (doc.querySelector('h1, h2, h3') || {}).textContent || '';
    const paragraphs = Array.from(doc.querySelectorAll('p'))
      .map(node => (node.textContent || '').trim())
      .filter(Boolean);
    const features = Array.from(doc.querySelectorAll('li, .feat-item, .card, .pill'))
      .map(node => (node.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 8);
    const image = (doc.querySelector('img') || {}).src || '';

    return {
      title: heading.trim(),
      paragraphs,
      features,
      image
    };
  }

  const paragraphs = Array.isArray(data.paragraphs)
    ? data.paragraphs.filter(Boolean)
    : [data.description, data.body, data.content].filter(Boolean);

  const featureSource = Array.isArray(data.features)
    ? data.features
    : Array.isArray(data.items)
      ? data.items
      : [];

  const features = featureSource
    .map(item => {
      if (!item) return '';
      if (typeof item === 'string') return item.trim();
      return (item.label || item.title || item.name || item.text || '').trim();
    })
    .filter(Boolean)
    .slice(0, 8);

  return {
    title: data.title || data.heading || data.name || '',
    subtitle: data.subtitle || data.tag || '',
    paragraphs,
    features,
    image: data.image || data.photo || data.bannerImage || ''
  };
}

async function renderNewsList(containerId, paginationId, page = 1) {
  // Set to 6 for both for now so user can see pagination working with 7 items
  const pageSize = 6; 
  const container = document.getElementById(containerId);
  if (!container) return;
  const paginationContainer = paginationId ? document.getElementById(paginationId) : null;
  
  const allNews = await loadNewsData();
  const news = allNews.filter(n => n.visible !== false);
  
  if (news.length === 0) {
    container.innerHTML = '<div class="empty-msg">No news articles found.</div>';
    if (paginationContainer) paginationContainer.style.display = 'none';
    return;
  }

  // Improved sorting: Date primary, createdAt secondary
  news.sort((a, b) => {
    const da = new Date(a.date || a.createdAt || 0);
    const db = new Date(b.date || b.createdAt || 0);
    return db - da; // Latest first
  });

  const totalPages = Math.ceil(news.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedNews = news.slice(start, start + pageSize);

  container.innerHTML = paginatedNews.map((item, index) => `
    <article class="news-card">
      ${getPrimaryNewsImage(item) ? `<img src="${getPrimaryNewsImage(item)}" class="news-img" alt="${item.title}">` : `<div class="news-img-placeholder ${getNewsPlaceholderClass(item, index)}"></div>`}
      <div class="news-body">
        <div class="news-meta">
          <span class="news-date">${formatDisplayDate(item.date)}</span>
          <span class="news-tag">${item.category || 'General'}</span>
        </div>
        <h3>${item.title || 'Untitled'}</h3>
        <p class="news-excerpt">${item.excerpt || ''}</p>
        <button class="read-more-btn" onclick="openNewsModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
          Read Story 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </article>
  `).join('') + `
    <div style="grid-column: 1 / -1; text-align: center; margin-top: 20px; font-size: 0.8rem; color: var(--text-muted); opacity: 0.6;">
      Showing ${start + 1}–${Math.min(start + pageSize, news.length)} of ${news.length} articles
    </div>
  `;
  
  if (container.style.display === 'none') container.style.display = 'grid';
  const loader = document.getElementById('news-loading');
  if (loader) loader.style.display = 'none';

  if (paginationContainer) {
    if (news.length <= pageSize) {
      paginationContainer.style.display = 'none';
    } else {
      renderPagination(paginationId, totalPages, page, (newPage) => {
        renderNewsList(containerId, paginationId, newPage);
        window.scrollTo({ top: container.offsetTop - 150, behavior: 'smooth' });
      });
      paginationContainer.style.display = 'flex';
    }
  }
}

function renderPagination(containerId, totalPages, currentPage, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  window._onLcscPageChange = onPageChange;

  let html = '';
  
  // Prev button
  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="_onLcscPageChange(${currentPage - 1})" aria-label="Previous Page">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>`;

  // Page numbers
  const range = 2; // How many pages around current page
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - range && i <= currentPage + range)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="_onLcscPageChange(${i})">${i}</button>`;
    } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
      html += `<span class="page-dots">...</span>`;
    }
  }

  // Next button
  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="_onLcscPageChange(${currentPage + 1})" aria-label="Next Page">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>`;

  container.innerHTML = html;
}

async function renderNewsListOld(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const news = await loadNewsData();
  
  if (news.length === 0) {
    container.innerHTML = '<div class="empty-msg">No news articles found.</div>';
    return;
  }

  container.innerHTML = news.map((item, index) => `
    <article class="news-card">
      ${getPrimaryNewsImage(item) ? `<img src="${getPrimaryNewsImage(item)}" class="news-img" alt="${item.title}">` : `<div class="news-img-placeholder ${getNewsPlaceholderClass(item, index)}"></div>`}
      <div class="news-body">
        <div class="news-meta">
          <span class="news-date">${formatDisplayDate(item.date)}</span>
          <span class="news-tag">${item.category || 'General'}</span>
        </div>
        <h3>${item.title || 'Untitled'}</h3>
        <p class="news-excerpt">${item.excerpt || ''}</p>
        <button class="read-more-btn" onclick="openNewsModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
          Read Story 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </article>
  `).join('');
  
  if (container.style.display === 'none') container.style.display = 'grid';
  const loader = document.getElementById('news-loading');
  if (loader) loader.style.display = 'none';
}

async function renderDocumentsList(containerId, filter = 'all') {
  const container = document.getElementById(containerId);
  if (!container) return;
  let docs = await loadDocumentsData();
  
  if (filter !== 'all') {
    docs = docs.filter(d => d.category === filter);
  }

  if (docs.length === 0) {
    container.innerHTML = '<div class="empty-msg">No documents found for this category.</div>';
    return;
  }

  container.innerHTML = docs.map(item => `
    <div class="doc-card">
      <div class="doc-icon"></div>
      <div class="doc-info">
        <div class="doc-category">${item.category || ''}</div>
        <div class="doc-title">${item.name || item.title || 'Untitled Document'}</div>
        <div class="doc-date">${formatDisplayDate(item.date)}</div>
        ${item.url ? `<a href="${item.url}" class="doc-download" target="_blank">Download</a>` : ''}
      </div>
    </div>
  `).join('');

  if (container.style.display === 'none') container.style.display = 'grid';
  const loader = document.getElementById('docs-loading');
  if (loader) loader.style.display = 'none';
}

async function renderFacultyList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const faculty = await loadFacultyData();
  
  if (faculty.length === 0) {
    container.innerHTML = '<div class="empty-msg">No faculty data available.</div>';
    return;
  }

  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((part) => part[0] || '')
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : '?';

  container.innerHTML = faculty.map(item => `
    <div class="faculty-card">
      ${item.photo
        ? `<img class="faculty-avatar faculty-avatar-photo" src="${item.photo}" alt="${item.name || 'Faculty member'}" />`
        : `<div class="faculty-avatar faculty-avatar-fallback">${getInitials(item.name)}</div>`
      }
      <div class="faculty-info">
        <h3 class="faculty-name">${item.name || ''}</h3>
        <p class="faculty-subject">${item.subject || ''}</p>
        <p class="faculty-qual">${item.qualification || ''}</p>
        <p class="faculty-exp">Experience: ${item.experience || '0'} Years</p>
      </div>
    </div>
  `).join('');
}

async function renderManagementList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const mgmt = await loadManagementData();
  
  if (mgmt.length === 0) {
    container.innerHTML = '<div class="empty-msg">No management data available.</div>';
    return;
  }

  container.innerHTML = mgmt.map(item => `
    <div class="mgmt-card">
      <h3>${item.name || ''}</h3>
      <p class="role">${item.designation || item.role || ''}</p>
      ${item.email ? `<p class="email">${item.email}</p>` : ''}
    </div>
  `).join('');
}

async function renderTestimonialsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const testimonials = await loadTestimonialsData();
  
  if (testimonials.length === 0) {
    container.innerHTML = '<div class="empty-msg">No testimonials found.</div>';
    return;
  }

  container.innerHTML = testimonials.filter(t => t.visible !== false).map((item, i) => {
    const emoji = ['👩', '👨', '🧑', '👱‍♀️', '👨‍🦰', '👩‍🦱'][i % 6];
    const imgUrl = (item.image || '').trim();
    const hasImage = imgUrl.length > 0;
    const photoHtml = hasImage
      ? '<img src="' + imgUrl + '" alt="' + (item.name || '') + '" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:3px solid #c8960c;box-shadow:0 4px 12px rgba(0,0,0,0.12);" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
        + '<span style="display:none;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#094f4f,#0e6b6b);align-items:center;justify-content:center;font-size:1.5rem;">' + emoji + '</span>'
      : '<span style="display:flex;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#094f4f,#0e6b6b);align-items:center;justify-content:center;font-size:1.5rem;">' + emoji + '</span>';
    return `
    <div class="testimonial-card">
      <div class="quote-icon">"</div>
      <p class="text">${item.text || ''}</p>
      <div class="meta">
        ${photoHtml}
        <strong>${item.name || ''}</strong>
        <span>${item.role || ''}</span>
        <div class="stars">${'★'.repeat(Math.max(0, Math.min(5, Number(item.rating) || 5)))}${'☆'.repeat(5 - Math.max(0, Math.min(5, Number(item.rating) || 5)))}</div>
      </div>
    </div>
  `}).join('');

}

// ── MODAL HELPER for News ──────────────────────────────────

function bindNewsImageViewer(root) {
  if (!root) return;

  root.querySelectorAll('[data-news-image]').forEach(function (node) {
    if (node.dataset.bound === 'true') return;
    node.dataset.bound = 'true';
    node.addEventListener('click', function () {
      const rawUrl = node.getAttribute('data-news-image') || '';
      const rawAlt = node.getAttribute('data-news-alt') || '';
      const url = rawUrl ? decodeURIComponent(rawUrl) : '';
      const alt = rawAlt ? decodeURIComponent(rawAlt) : '';
      openNewsImageModal(url, alt);
    });
  });
}

function openNewsImageModal(url, alt) {
  if (!url) return;

  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }

  const existing = document.getElementById('news-image-viewer');
  if (existing) existing.remove();

  const viewer = document.createElement('div');
  viewer.id = 'news-image-viewer';
  viewer.className = 'modal-image-viewer';

  const dialog = document.createElement('div');
  dialog.className = 'modal-image-viewer-dialog';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'modal-image-viewer-close';
  closeBtn.setAttribute('aria-label', 'Close image viewer');
  closeBtn.innerHTML = '&times;';

  const image = document.createElement('img');
  image.className = 'modal-image-viewer-img';
  image.src = url;
  image.alt = alt || 'News image';

  dialog.appendChild(closeBtn);
  dialog.appendChild(image);

  if (alt) {
    const caption = document.createElement('div');
    caption.className = 'modal-image-viewer-caption';
    caption.textContent = alt;
    dialog.appendChild(caption);
  }

  viewer.appendChild(dialog);

  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) closeNewsImageModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNewsImageModal);
  }

  container.appendChild(viewer);
}

function closeNewsImageModal() {
  const viewer = document.getElementById('news-image-viewer');
  if (viewer) viewer.remove();
}

function openNewsModal(item) {
  if (typeof item === 'string') {
    const existingModal = document.getElementById(item);
    if (existingModal) {
      existingModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    return;
  }

  const primaryImage = getPrimaryNewsImage(item);
  const galleryImages = getNewsGalleryImages(item);

  const modalHtml = `
    <div class="modal-overlay open" id="news-modal" onclick="if(event.target==this) closeNewsModal()">
      <div class="modal">
        <button class="modal-close" onclick="closeNewsModal()"></button>
        ${primaryImage ? `<button type="button" class="modal-main-image-btn" data-news-image="${encodeURIComponent(primaryImage)}" data-news-alt="${encodeURIComponent(item.title || 'News image')}"><img src="${primaryImage}" class="modal-img" alt="${item.title}"></button>` : `<div class="modal-img-placeholder ${getNewsPlaceholderClass(item, 0)}"></div>`}
        <div class="modal-body">
          <div class="modal-meta">
            <span class="modal-date">${formatDisplayDate(item.date)}</span>
            <span class="modal-tag">${item.category || 'General'}</span>
          </div>
          <h2 class="modal-title">${item.title || ''}</h2>
          <div class="modal-divider"></div>
          <div class="modal-content">
            ${renderParagraphHtml(item.content || item.excerpt || '')}
          </div>
          ${galleryImages.length ? `<div class="modal-gallery">${galleryImages.map((url, index) => `<button type="button" class="modal-gallery-link" data-news-image="${encodeURIComponent(url)}" data-news-alt="${encodeURIComponent((item.title || 'News image') + ' ' + (index + 1))}"><img src="${url}" alt="${item.title}" class="modal-gallery-img" loading="lazy" /></button>`).join('')}</div>` : ''}
          <div style="margin-top: 25px; pt: 15px; border-top: 1px solid #eee; text-align: center;">
            <a href="/news.html" style="color: var(--navy); font-size: 0.85rem; font-weight: 700; text-decoration: none;">View All News & Events →</a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }
  container.innerHTML = modalHtml;
  bindNewsImageViewer(container);
  document.body.style.overflow = 'hidden';
}

function closeNewsModal(id) {
  if (id) {
    const existingModal = document.getElementById(id);
    if (existingModal) {
      existingModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    return;
  }

  const modal = document.getElementById('news-modal');
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => {
      const container = document.getElementById('modal-container');
      if (container) container.innerHTML = '';
      document.body.style.overflow = '';
    }, 300);
  }
}
