/**
 * LORETTO CENTRAL SCHOOL — Shared Data Loader
 * Standardized data fetching and rendering for the frontend.
 */

/* ── API BASE RESOLUTION ── */
var API_BASE_KEY = 'loretto_api_base';
var PROD_API_BASE = 'https://lcscbse-production.up.railway.app/api';
var IS_LOCAL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
var RESOLVED_API_BASE = IS_LOCAL ? (sessionStorage.getItem(API_BASE_KEY) || '') : PROD_API_BASE;

// On production, mark the API base as valid immediately — no probing needed
if (!IS_LOCAL) {
  sessionStorage.setItem(API_BASE_KEY, PROD_API_BASE);
  sessionStorage.setItem(API_BASE_KEY + '_ok', 'true');
}

async function resolveApiBase() {
  const cachedOk = sessionStorage.getItem(API_BASE_KEY + '_ok') === 'true';
  if (RESOLVED_API_BASE && cachedOk) return RESOLVED_API_BASE;

  // Only probe on localhost
  const candidates = [
    'http://localhost:3000/api',
    'http://127.0.0.1:3000/api',
    'http://localhost:8000/api'
  ];

  for (const base of candidates) {
    try {
      const res = await fetch(base + '/health', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.service === 'loretto-backend') {
          RESOLVED_API_BASE = base;
          sessionStorage.setItem(API_BASE_KEY, base);
          sessionStorage.setItem(API_BASE_KEY + '_ok', 'true');
          return base;
        }
      }
    } catch (e) {
      // ignore probe failures
    }
  }

  // Fallback to proxy
  RESOLVED_API_BASE = '/api';
  return '/api';
}

/**
 * Generic Fetch Helper
 */
async function fetchData(endpoint) {
  try {
    const base = await resolveApiBase();
    const response = await fetch(`${base}/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Could not load ${endpoint} data:`, error);
    return null;
  }
}

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

async function renderNewsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const news = await loadNewsData();
  
  if (news.length === 0) {
    container.innerHTML = '<div class="empty-msg">No news articles found.</div>';
    return;
  }

  const getPrimaryNewsImage = (item) => {
    if (item.image) return item.image;
    if (Array.isArray(item.images) && item.images.length) return item.images[0];
    return '';
  };

  container.innerHTML = news.map(item => `
    <article class="news-card">
      ${getPrimaryNewsImage(item) ? `<img src="${getPrimaryNewsImage(item)}" class="news-img" alt="${item.title}">` : `<div class="news-img-placeholder n${(item.id % 6) + 1}"></div>`}
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

function openNewsModal(item) {
  if (typeof item === 'string') {
    const existingModal = document.getElementById(item);
    if (existingModal) {
      existingModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    return;
  }

  const modalHtml = `
    <div class="modal-overlay open" id="news-modal" onclick="if(event.target==this) closeNewsModal()">
      <div class="modal">
        <button class="modal-close" onclick="closeNewsModal()"></button>
        ${((item.image || (Array.isArray(item.images) && item.images[0])) ? `<img src="${item.image || item.images[0]}" class="modal-img" alt="${item.title}">` : `<div class="modal-img-placeholder n${(item.id % 6) + 1}"></div>`)}
        <div class="modal-body">
          <div class="modal-meta">
            <span class="modal-date">${formatDisplayDate(item.date)}</span>
            <span class="modal-tag">${item.category || 'General'}</span>
          </div>
          <h2 class="modal-title">${item.title || ''}</h2>
          <div class="modal-divider"></div>
          <div class="modal-content">
            <p>${item.content || item.excerpt || ''}</p>
          </div>
          ${Array.isArray(item.images) && item.images.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-top:20px;">${item.images.map(url => `<img src="${url}" alt="${item.title}" style="width:100%;height:160px;object-fit:cover;border-radius:12px;border:1px solid #eee;" />`).join('')}</div>` : ''}
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
