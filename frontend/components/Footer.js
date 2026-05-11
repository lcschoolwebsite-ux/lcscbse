// ============================================================
//  Loretto Central School — Premium Responsive Footer
//  Enhanced with Modern Aesthetics & Functional Admin Access
//  Connected to Admin Panel Footer Content & Social Links
// ============================================================
(function () {

  /**
   * Calculates the relative path prefix based on the current URL depth.
   */
  function getRootPrefix() {
    var path = window.location.pathname;
    if (path.endsWith('/')) path = path.slice(0, -1);
    var parts = path.split('/').filter(Boolean);
    if (parts.length > 0 && parts[parts.length - 1].indexOf('.') > -1) parts.pop();
    var prefix = '';
    for (var i = 0; i < parts.length; i++) prefix += '../';
    return prefix || './';
  }

  var R = getRootPrefix();
  var PROD_API = 'https://api.lorettocentralschool.edu.in/api';

  /**
   * Helper to fetch JSON with robust error handling and type checking.
   */
  async function fetchJson(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null; // Probably an HTML 404 page
      }
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function getApiBase() {
    // If shared-data-loader is present, use its resolved base
    if (window.RESOLVED_API_BASE) return window.RESOLVED_API_BASE;
    if (window.resolveApiBase) return await window.resolveApiBase();

    // Otherwise, try to find it ourselves
    const candidates = [
      R + 'api',
      '/api',
      'http://localhost:3000/api',
      PROD_API
    ];

    for (let base of candidates) {
      const cleanBase = base.replace(/\/+$/, '');
      const data = await fetchJson(cleanBase + '/health');
      if (data && (data.ok || data.service === 'loretto-backend')) {
        return cleanBase;
      }
    }
    return '/api'; // Final fallback
  }

  async function loadContact(apiBase) {
    return await fetchJson(apiBase + '/contact');
  }

  async function loadFooterSettings(apiBase) {
    const item = await fetchJson(apiBase + '/content/homepage.footer');
    return item && item.data ? item.data : null;
  }

  /* ── CSS ── */
  var FOOTER_CSS = `
<style id="lcs-footer-styles">
  :root {
    --ft-bg: #071f1f;
    --ft-top: #0a2e2e;
    --ft-gold: #c8960c;
    --ft-gold-light: #e8b020;
    --ft-text: rgba(255, 255, 255, 0.7);
    --ft-text-dim: rgba(255, 255, 255, 0.5);
    --ft-border: rgba(255, 255, 255, 0.06);
    --ft-gold-glow: rgba(200, 150, 12, 0.15);
  }

  .ft-wrap { background: var(--ft-bg); color: var(--ft-text); font-family: 'Nunito', sans-serif; border-top: 3px solid var(--ft-gold); width: 100%; box-sizing: border-box; position: relative; z-index: 100; }
  .ft-top-bar { background: var(--ft-top); display: flex; align-items: center; justify-content: space-between; padding: 10px 48px; border-bottom: 1px solid var(--ft-gold-glow); }
  .ft-topbar-item { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: var(--ft-text-dim); }
  .ft-topbar-item svg { stroke: var(--ft-gold); }
  .ft-topbar-item a { color: inherit; text-decoration: none; transition: color 0.2s; }
  .ft-topbar-divider { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.08); }
  .ft-main { display: grid; grid-template-columns: 2.2fr 1fr 1fr 1.1fr; gap: 0; padding: 0 48px; }
  .ft-col { padding: 44px 32px 40px 0; border-right: 1px solid rgba(255, 255, 255, 0.05); }
  .ft-col:last-child { border-right: none; padding-right: 0; padding-left: 32px; }
  .ft-col:first-child { padding-left: 0; }
  .ft-brand-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; text-decoration: none; }
  .ft-logo-ring { width: 54px; height: 54px; border-radius: 50%; border: 2px solid var(--ft-gold); overflow: hidden; flex-shrink: 0; background: #0a3535; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 14px; font-weight: 700; color: var(--ft-gold); letter-spacing: 1px; }
  .ft-logo-ring img { width: 100%; height: 100%; object-fit: cover; }
  .ft-brand-name { font-family: Georgia, serif; font-size: 1.05rem; font-weight: 700; color: #fff; line-height: 1.25; }
  .ft-brand-tag { font-size: 0.65rem; color: var(--ft-gold); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 3px; font-weight: 700; }
  .ft-brand-desc { font-size: 0.82rem; line-height: 1.75; color: var(--ft-text-dim); margin-bottom: 22px; max-width: 300px; }
  .ft-social { display: flex; gap: 8px; }
  .ft-soc-btn { width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: var(--ft-text-dim); text-decoration: none; transition: all 0.2s; cursor: pointer; }
  .ft-soc-btn:hover { background: var(--ft-gold); border-color: var(--ft-gold); color: var(--ft-bg); transform: translateY(-2px); }
  .ft-col-heading { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ft-gold); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .ft-col-heading::after { content: ''; flex: 1; height: 1px; background: var(--ft-gold-glow); }
  .ft-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
  .ft-links li a { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--ft-text-dim); text-decoration: none; padding: 5px 0; transition: all 0.18s; }
  .ft-links li a::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--ft-gold); opacity: 0; transition: opacity 0.18s; flex-shrink: 0; }
  .ft-links li a:hover { color: var(--ft-gold-light); transform: translateX(4px); }
  .ft-contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
  .ft-contact-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--ft-gold-glow); border: 1px solid rgba(200, 150, 12, 0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ft-contact-label { font-size: 0.64rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
  .ft-contact-val { font-size: 0.8rem; color: rgba(255,255,255,0.75); font-weight: 600; }
  .ft-contact-val a { color: inherit; text-decoration: none; }
  .ft-login-btn { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 18px; padding: 10px; background: var(--ft-gold-glow); border: 1px solid rgba(200,150,12,0.3); border-radius: 10px; font-size: 0.78rem; font-weight: 700; color: var(--ft-gold-light); text-decoration: none; transition: all 0.2s; cursor: pointer; }
  .ft-login-btn:hover { background: rgba(200,150,12,0.2); border-color: var(--ft-gold); transform: translateY(-1px); }
  .ft-bottom { border-top: 1px solid var(--ft-border); margin: 0 48px; padding: 18px 0 14px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .ft-copy { font-size: 0.75rem; color: rgba(255,255,255,0.3); }
  .ft-bottom-links { display: flex; gap: 20px; }
  .ft-bottom-links a { font-size: 0.75rem; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.18s; }
  .ft-credits { background: var(--ft-bg); padding: 14px 48px 22px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
  .ft-credits a { color: var(--ft-gold); text-decoration: none; border-bottom: 1px solid rgba(200,150,12,0.2); padding-bottom: 1px; }
  .ft-admin-trigger { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.08); margin-left: 8px; vertical-align: middle; transition: all 0.3s; cursor: pointer; text-decoration: none; border: none; }
  .ft-admin-trigger:hover { background: var(--ft-gold); transform: scale(1.4); box-shadow: 0 0 8px var(--ft-gold); }

  /* MOBILE */
  .ft-desktop { display: block; }
  .ft-mobile { display: none; }

  @media (max-width: 1024px) {
    .ft-main { grid-template-columns: 1fr 1fr; }
    .ft-col { border-right: none; padding-right: 16px; }
    .ft-col:nth-child(2n) { padding-left: 32px; border-left: 1px solid rgba(255,255,255,0.05); }
    .ft-top-bar { padding: 10px 24px; flex-wrap: wrap; gap: 10px; }
  }

  @media (max-width: 768px) {
    .ft-desktop { display: none; }
    .ft-mobile { display: block; }
    .mob-ft-base { background: #0e6b6b; padding: 20px 16px 24px; }
    .mob-ft-card { background: #083838; border: 1px solid rgba(200,150,12,0.35); border-radius: 20px; padding: 20px 18px 16px; position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .mob-ft-card::before { content:""; position:absolute; top:-30px; right:-30px; width:120px; height:120px; border-radius:50%; background:rgba(200,150,12,0.06); pointer-events:none; }
    .mob-ft-card::after { content:""; position:absolute; bottom:-20px; left:-20px; width:80px; height:80px; border-radius:50%; background:rgba(200,150,12,0.04); pointer-events:none; }
    .mob-ft-row1 { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:18px; position: relative; z-index: 1; }
    .mob-ft-brand { display:flex; align-items:center; gap:11px; min-width:0; text-decoration: none; }
    .mob-ft-logo { width:42px; height:42px; border-radius:50%; border:2px solid #c8960c; overflow:hidden; flex-shrink:0; }
    .mob-ft-logo img { width:100%; height:100%; object-fit:cover; display:block; }
    .mob-ft-name { font-family: 'Playfair Display', serif; font-size:0.85rem; font-weight:700; color:#fff; line-height:1.25; }
    .mob-ft-sub { font-size:0.67rem; color:#e8b020; margin-top:2px; letter-spacing:0.04em; }
    .mob-ft-cta { flex-shrink:0; font-size:0.7rem; font-weight:700; color:#083838; background:#c8960c; border-radius:50px; padding:7px 14px; text-decoration:none; white-space:nowrap; letter-spacing:0.02em; transition:opacity 0.2s; }
    .mob-ft-links { display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-bottom:18px; position: relative; z-index: 1; }
    .mob-ft-link { font-size:0.78rem; color:rgba(255,255,255,0.7); text-decoration:none; padding:7px 10px; border-radius:8px; display:flex; align-items:center; gap:6px; transition:all 0.18s; }
    .mob-ft-link:hover { background:rgba(255,255,255,0.05); color:#e8b020; transform: translateX(2px); }
    .mob-ft-link--gold { color:#e8b020!important; font-weight:700; }
    .mob-ft-rule { border:none; border-top:1px solid rgba(200,150,12,0.2); margin:0 0 16px; position: relative; z-index: 1; }
    .mob-ft-contact { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; position: relative; z-index: 1; }
    .mob-ft-contact-item { display:flex; align-items:center; gap:10px; text-decoration:none; background:rgba(255,255,255,0.04); border-radius:10px; padding:10px 12px; transition:background 0.18s; }
    .mob-ft-contact-item:hover { background:rgba(255,255,255,0.08); }
    .mob-ft-contact-icon { width:30px; height:30px; border-radius:8px; background:rgba(200,150,12,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .mob-ft-contact-label { font-size:0.67rem; color:rgba(255,255,255,0.4); margin-bottom:1px; letter-spacing:0.05em; text-transform:uppercase; }
    .mob-ft-contact-value { font-size:0.8rem; color:#fff; font-weight:600; }
    .mob-ft-bottom { display:flex; justify-content:space-between; align-items:center; gap:8px; position: relative; z-index: 1; }
    .mob-ft-copy { font-size:0.68rem; color:rgba(255,255,255,0.3); }
    .mob-ft-cbse { font-size:0.65rem; color:rgba(200,150,12,0.8); border:1px solid rgba(200,150,12,0.3); border-radius:5px; padding:3px 8px; flex-shrink:0; }
  }

  #ft-scroll-top { position: fixed; bottom: 30px; right: 30px; width: 45px; height: 45px; background: var(--ft-gold); color: var(--ft-bg); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 8px 20px rgba(0,0,0,0.4); z-index: 999; }
  #ft-scroll-top.show { opacity: 1; visibility: visible; transform: translateY(0); }
</style>
`;

  /* ── HTML STRUCTURE ── */
  var FOOTER_HTML = [
    '<div class="ft-wrap" id="lcs-footer">',
    '  <div class="ft-desktop">',
    '    <div class="ft-top-bar">',
    '      <div class="ft-topbar-item">',
    '        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    '        <span class="ft-data-address">Main Road, Bantwal, Karnataka</span>',
    '      </div>',
    '      <div class="ft-topbar-divider"></div>',
    '      <div class="ft-topbar-item">',
    '        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l1.61-1.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    '        <a href="tel:+919480663011" class="ft-data-phone">+91 94806 63011</a>',
    '      </div>',
    '      <div class="ft-topbar-divider"></div>',
    '      <div class="ft-topbar-item">',
    '        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    '        <a href="mailto:Lorettocentralschool@gmail.com" class="ft-data-email">Lorettocentralschool@gmail.com</a>',
    '      </div>',
    '      <div class="ft-topbar-divider"></div>',
    '      <div class="ft-topbar-item">',
    '        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    '        Mon–Sat: 8:00 AM – 4:00 PM',
    '      </div>',
    '    </div>',
    '    <div class="ft-main">',
    '      <div class="ft-col">',
    '        <a class="ft-brand-logo" href="' + R + 'index.html">',
    '          <div class="ft-logo-ring"><img src="' + R + 'logo.png" alt="LCS"></div>',
    '          <div>',
    '            <div class="ft-brand-name">Loretto Central School</div>',
    '            <div class="ft-brand-tag">CBSE Affiliated · Est. 2010</div>',
    '          </div>',
    '        </a>',
    '        <p class="ft-brand-desc" id="ft-desc">Shaping young minds for over three decades with excellence in education, rooted in values, innovation, and care.</p>',
    '        <div class="ft-social">',
    '          <a class="ft-soc-btn" aria-label="Facebook" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>',
    '          <a class="ft-soc-btn" aria-label="Instagram" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>',
    '          <a class="ft-soc-btn" aria-label="Twitter" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>',
    '          <a class="ft-soc-btn" aria-label="YouTube" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#071f1f"/></svg></a>',
    '        </div>',
    '      </div>',
    '      <div class="ft-col" style="padding-left:32px;">',
    '        <div class="ft-col-heading">Quick Links</div>',
    '        <ul class="ft-links" id="ft-quick-links">',
    '          <li><a href="' + R + 'index.html">Home</a></li>',
    '          <li><a href="' + R + 'about-us/1-school-profile.html">About Us</a></li>',
    '          <li><a href="' + R + 'admissions/1-admissions.html">Admissions</a></li>',
    '          <li><a href="' + R + 'academics/index.html">Academics</a></li>',
    '          <li><a href="' + R + 'news.html">News &amp; Events</a></li>',
    '          <li><a href="' + R + 'contact.html">Contact Us</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="ft-col" style="padding-left:32px;">',
    '        <div class="ft-col-heading">Academics</div>',
    '        <ul class="ft-links">',
    '          <li><a href="' + R + 'academics/index.html">Academics Overview</a></li>',
    '          <li><a href="' + R + 'school-information/1-curriculum.html">Curriculum</a></li>',
    '          <li><a href="' + R + 'academics/1-faculty.html">Faculty</a></li>',
    '          <li><a href="' + R + 'school-information/6-facilities.html">Facilities</a></li>',
    '          <li><a href="' + R + 'academics/5-book-list.html">Book List</a></li>',
    '          <li><a href="' + R + 'academics/3-cbse-circulars.html">CBSE Circulars</a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="ft-col">',
    '        <div class="ft-col-heading">Contact</div>',
    '        <div class="ft-contact-item">',
    '          <div class="ft-contact-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8960c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>',
    '          <div>',
    '            <div class="ft-contact-label">Address</div>',
    '            <div class="ft-contact-val ft-data-address">Main Road, Bantwal, Karnataka</div>',
    '          </div>',
    '        </div>',
    '        <div class="ft-contact-item">',
    '          <div class="ft-contact-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8960c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l1.61-1.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>',
    '          <div>',
    '            <div class="ft-contact-label">Phone</div>',
    '            <div class="ft-contact-val"><a href="tel:+919480663011" class="ft-data-phone">+91 94806 63011</a></div>',
    '          </div>',
    '        </div>',
    '        <div class="ft-contact-item">',
    '          <div class="ft-contact-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8960c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>',
    '          <div>',
    '            <div class="ft-contact-label">Email</div>',
    '            <div class="ft-contact-val" style="font-size:0.72rem;word-break:break-all;"><a href="mailto:Lorettocentralschool@gmail.com" class="ft-data-email">Lorettocentralschool@gmail.com</a></div>',
    '          </div>',
    '        </div>',
    '        <a class="ft-login-btn" href="' + R + 'login/parent-login.html">',
    '          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    '          Parent Login Portal',
    '        </a>',
    '      </div>',
    '    </div>',
    '    <div class="ft-bottom">',
    '      <span class="ft-copy" id="ft-copyright">© <span class="ft-year"></span> Loretto Central School. All rights reserved.</span>',
    '      <div class="ft-bottom-links">',
    '        <a href="' + R + 'school-information/9-website-privacy-policy.html">Privacy &amp; Policy</a>',
    '        <a href="' + R + 'mandatory-disclosure.html">Mandatory Disclosure</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="ft-mobile">',
    '    <div class="mob-ft-base">',
    '      <div class="mob-ft-card">',
    '        <div class="mob-ft-row1">',
    '          <a class="mob-ft-brand" href="' + R + 'index.html">',
    '            <div class="mob-ft-logo"><img src="' + R + 'logo.png" alt="LCS"></div>',
    '            <div>',
    '              <div class="mob-ft-name">Loretto Central School</div>',
    '              <div class="mob-ft-sub">Bantwal, Dakshina Kannada</div>',
    '            </div>',
    '          </a>',
    '          <a href="' + R + 'contact.html" class="mob-ft-cta">Contact Us ›</a>',
    '        </div>',
    '        <div class="mob-ft-links" id="mob-ft-quick-links">',
    '          <a href="' + R + 'index.html" class="mob-ft-link">Home</a>',
    '          <a href="' + R + 'about-us/1-school-profile.html" class="mob-ft-link">About Us</a>',
    '          <a href="' + R + 'admissions/1-admissions.html" class="mob-ft-link">Admissions</a>',
    '          <a href="' + R + 'academics/index.html" class="mob-ft-link">Academics</a>',
    '          <a href="' + R + 'login/parent-login.html" class="mob-ft-link mob-ft-link--gold">Parent Portal</a>',
    '        </div>',
    '        <div class="mob-ft-rule"></div>',
    '        <div class="mob-ft-contact">',
    '          <a href="tel:+919480663011" class="mob-ft-contact-item">',
    '            <div class="mob-ft-contact-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l1.61-1.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>',
    '            <div><div class="mob-ft-contact-label">Phone</div><div class="mob-ft-contact-value ft-data-phone">+91 94806 63011</div></div>',
    '          </a>',
    '          <a href="mailto:Lorettocentralschool@gmail.com" class="mob-ft-contact-item">',
    '            <div class="mob-ft-contact-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>',
    '            <div><div class="mob-ft-contact-label">Email</div><div class="mob-ft-contact-value ft-data-email">Lorettocentralschool@gmail.com</div></div>',
    '          </a>',
    '        </div>',
    '        <div class="mob-ft-bottom">',
    '          <span class="mob-ft-copy">© <span class="ft-year"></span> Loretto School</span>',
    '          <span class="mob-ft-cbse">CBSE 831368</span>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="ft-credits">',
    '    <span>Developed by <a href="https://appvertex.in" target="_blank" rel="noopener">AppVertex</a></span>',
    '    <span style="color:rgba(255,255,255,0.12);">·</span>',
    '    <span>Built by <strong>Leston</strong> &amp; <strong>Lenstar</strong></span>',
    '    <a class="ft-admin-trigger" id="ft-admin-trigger" href="' + R + 'admin/admin-login.html" title="Admin Access"></a>',
    '  </div>',
    '  <button id="ft-scroll-top" aria-label="Scroll to top" title="Scroll to top">',
    '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
    '  </button>',
    '</div>'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('lcs-footer-styles')) return;
    document.head.insertAdjacentHTML('beforeend', FOOTER_CSS);
  }

  async function injectHTML() {
    if (document.getElementById('lcs-footer')) return;
    
    var temp = document.createElement('div');
    temp.innerHTML = FOOTER_HTML;
    document.body.appendChild(temp.firstElementChild);

    var yr = new Date().getFullYear();
    document.querySelectorAll('.ft-year').forEach(function(el) { el.textContent = yr; });

    // Fetch and Apply Data
    try {
      const apiBase = await getApiBase();
      console.log('[Footer] Using API base:', apiBase);

      const [contact, settings] = await Promise.all([loadContact(apiBase), loadFooterSettings(apiBase)]);
      
      console.log('[Footer] Data loaded:', { contact, settings });

      if (contact) {
        if (contact.address) document.querySelectorAll('.ft-data-address').forEach(el => el.textContent = contact.address);
        if (contact.phones && contact.phones[0]) {
          const ph = contact.phones[0];
          document.querySelectorAll('.ft-data-phone').forEach(el => {
            el.textContent = ph;
            if (el.tagName === 'A') el.href = 'tel:' + ph.replace(/\s/g, '');
          });
        } else if (contact.phone) {
           document.querySelectorAll('.ft-data-phone').forEach(el => {
            el.textContent = contact.phone;
            if (el.tagName === 'A') el.href = 'tel:' + contact.phone.replace(/\s/g, '');
          });
        }
        if (contact.email) {
          document.querySelectorAll('.ft-data-email').forEach(el => {
            el.textContent = contact.email;
            if (el.tagName === 'A') el.href = 'mailto:' + contact.email;
          });
        }
      }

      if (settings) {
        if (settings.description) {
          var desc = document.getElementById('ft-desc');
          if (desc) desc.textContent = settings.description;
        }
        if (settings.copyright) {
          var copy = document.getElementById('ft-copyright');
          if (copy) copy.innerHTML = settings.copyright.replace('{{year}}', '<span class="ft-year">' + yr + '</span>');
        }
        if (settings.socialLinks) {
          var socials = settings.socialLinks;
          var targets = {
            'Facebook': socials.facebook,
            'Instagram': socials.instagram,
            'Twitter': socials.twitter,
            'YouTube': socials.youtube
          };
          for (var label in targets) {
            var url = targets[label];
            document.querySelectorAll('.ft-soc-btn[aria-label="' + label + '"]').forEach(el => {
              if (url && url.trim()) {
                el.href = url.trim();
                el.style.display = 'flex';
              } else {
                el.style.display = 'none';
              }
            });
          }
        }
        if (Array.isArray(settings.quickLinks) && settings.quickLinks.length) {
          var qlContainer = document.getElementById('ft-quick-links');
          var mqlContainer = document.getElementById('mob-ft-quick-links');
          if (qlContainer) {
            qlContainer.innerHTML = settings.quickLinks.map(link => '<li><a href="' + link.url + '">' + link.text + '</a></li>').join('');
          }
          if (mqlContainer) {
            mqlContainer.innerHTML = settings.quickLinks.map(link => '<a href="' + link.url + '" class="mob-ft-link">' + link.text + '</a>').join('');
          }
        }
      }
    } catch (err) {
      console.error('[Footer] Error applying data:', err);
    }

    // Scroll to top
    var scrollBtn = document.getElementById('ft-scroll-top');
    if (scrollBtn) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 500) scrollBtn.classList.add('show');
        else scrollBtn.classList.remove('show');
      }, { passive: true });
      scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Secret Admin Access
    var logo = document.querySelector('.ft-brand-logo');
    var clicks = 0;
    if (logo) {
      logo.addEventListener('click', function(e) {
        clicks++;
        if (clicks === 5) {
          e.preventDefault();
          window.location.href = R + 'admin/admin-login.html';
        }
        setTimeout(() => { clicks = 0; }, 2000);
      });
    }
  }

  function boot() {
    injectStyles();
    injectHTML();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.LorettoFooter = { init: boot };

})();
