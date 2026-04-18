// ============================================================
//  Loretto Central School — Footer Component
//  Desktop: original full-width grid
//  Mobile:  Floating dark card (ported from lens-frontend)
//  Drop this script at the end of <body> in every HTML page.
//  Auto-detects depth for correct relative paths.
// ============================================================
(function () {

  function getRootPrefix() {
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);
    if (parts.length > 0 && parts[parts.length - 1].indexOf('.html') > -1) parts.pop();
    var prefix = '';
    for (var i = 0; i < parts.length; i++) prefix += '../';
    return prefix || './';
  }

  var R = getRootPrefix();

  async function loadContact() {
    try {
      if (typeof window.loadContactData === 'function') {
        return await window.loadContactData();
      }
      const res = await fetch(R + 'api/contact');
      if (res.ok) return await res.json();
    } catch (e) { }
    return null;
  }

  /* ── HTML ── */
  var FOOTER_HTML = [
    '<footer id="lcs-footer">',
    '  <div class="lcs-ft-inner">',

    /* --- DESKTOP: original full-width grid --- */
    '    <div class="lcs-ft-desktop">',
    '      <div class="container">',
    '      <div class="footer-main">',

    '      <div class="footer-brand">',
    '        <a class="footer-logo-wrap" href="' + R + 'index.html">',
    '          <img src="' + R + 'logo.png" alt="Loretto Central School Crest" style="width:52px;height:52px;border-radius:50%;border:2px solid var(--gold);object-fit:cover;" />',
    '          <div style="margin-left:12px;">',
    '            <div style="color:#fff;font-family:\'Playfair Display\',serif;font-size:1rem;font-weight:700;line-height:1.2;">Loretto Central School</div>',
    '            <div style="font-size:0.7rem;color:var(--gold-light);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">CBSE Affiliated</div>',
    '          </div>',
    '        </a>',
    '        <p>Loretto Central School has been shaping young minds for over three decades. We are committed to delivering excellence in education with values, innovation, and care.</p>',
    '        <div class="social-links">',
    '          <a class="social-link" href="#" aria-label="Facebook" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>',
    '          <a class="social-link" href="#" aria-label="Instagram" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>',
    '          <a class="social-link" href="#" aria-label="Twitter" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>',
    '          <a class="social-link" href="#" aria-label="YouTube" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a3535"/></svg></a>',
    '        </div>',
    '      </div>',

    '      <div class="footer-col">',
    '        <h4>Quick Links</h4>',
    '        <ul>',
    '          <li><a href="' + R + 'index.html">Home</a></li>',
    '          <li><a href="' + R + 'about-us/1-school-profile.html">About Us</a></li>',
    '          <li><a href="' + R + 'admissions/1-admissions.html">Admissions</a></li>',
    '          <li><a href="' + R + 'academics/index.html">Academics</a></li>',
    '          <li><a href="' + R + 'news.html">News &amp; Events</a></li>',
    '          <li><a href="' + R + 'e-magazine.html">E-Magazine</a></li>',
    '          <li><a href="' + R + 'contact.html">Contact Us</a></li>',
    '        </ul>',
    '      </div>',

    '      <div class="footer-col">',
    '        <h4>Academics</h4>',
    '        <ul>',
    '          <li><a href="' + R + 'academics/index.html">Academics Overview</a></li>',
    '          <li><a href="' + R + 'school-information/1-curriculum.html">Curriculum</a></li>',
    '          <li><a href="' + R + 'academics/1-faculty.html">Faculty</a></li>',
    '          <li><a href="' + R + 'school-information/6-facilities.html">Facilities</a></li>',
    '          <li><a href="' + R + 'academics/5-book-list.html">Book List</a></li>',
    '          <li><a href="' + R + 'academics/3-cbse-circulars.html">CBSE Circulars</a></li>',
    '          <li><a href="' + R + 'mandatory-disclosure.html">Mandatory Disclosure</a></li>',
    '        </ul>',
    '      </div>',

    '      <div class="footer-col">',
    '        <h4>Contact</h4>',
    '        <ul class="footer-contact-list">',
    '          <li><span>&#128205;</span> Main Road, Bantwal, Karnataka</li>',
    '          <li><a href="tel:+919480663011"><span>&#128222;</span> +91 94806 63011</a></li>',
    '          <li><a href="mailto:Lorettocentralschool@gmail.com"><span>&#9993;&#65039;</span> Lorettocentralschool@gmail.com</a></li>',
    '          <li><span>&#128336;</span> Mon&#8211;Sat: 8:00 AM &#8211; 4:00 PM</li>',
    '          <li class="footer-login-link"><a href="' + R + 'login/parent-login.html">&#128106; Parent Login Portal</a></li>',
    '        </ul>',
    '      </div>',

    '    </div>',

    '    <div class="footer-bottom">',
    '      <span>&#169; <span class="lcs-ft-yr"></span> Loretto Central School, Bantwal. All rights reserved. &nbsp;&#183;&nbsp; CBSE Affiliation No. 831368</span>',
    '      <div class="footer-bottom-links">',
    '        <a href="' + R + 'school-information/9-website-privacy-policy.html">Privacy and Policy</a>',
    '        <a href="' + R + 'mandatory-disclosure.html">Mandatory Disclosure</a>',
    '      </div>',
    '    </div>',

    '    <div class="footer-credits">',
    '      <span class="footer-credits-dev">Developed by <a href="https://appvertex.in" target="_blank" rel="noopener" class="footer-credits-brand">AppVertex</a></span>',
    '      <span class="footer-credits-built">Built by <strong>Leston</strong> &amp; <strong>Lenstar</strong> &nbsp;&#183;&nbsp; <a class="footer-admin-link" href="' + R + 'admin/admin-login.html" aria-label="Admin login"></a></span>',
    '    </div>',

    '      </div>',
    '    </div>',
    /* --- END DESKTOP --- */

    /* --- MOBILE: Floating dark card (from lens) --- */
    '    <div class="lcs-ft-mobile">',
    '      <div class="mob-ft-base">',
    '        <div class="mob-ft-card">',

    '          <div class="mob-ft-row1">',
    '            <div class="mob-ft-brand">',
    '              <div class="mob-ft-logo"><img src="' + R + 'logo.png" alt="Loretto Central School" /></div>',
    '              <div>',
    '                <div class="mob-ft-name">Loretto Central School</div>',
    '                <div class="mob-ft-sub">Bantwal, Dakshina Kannada</div>',
    '              </div>',
    '            </div>',
    '            <a href="' + R + 'contact.html" class="mob-ft-cta">Contact Us &#8250;</a>',
    '          </div>',

    '          <div class="mob-ft-links">',
    '            <a href="' + R + 'index.html" class="mob-ft-link">Home</a>',
    '            <a href="' + R + 'about-us/1-school-profile.html" class="mob-ft-link">About</a>',
    '            <a href="' + R + 'admissions/1-admissions.html" class="mob-ft-link">Admissions</a>',
    '            <a href="' + R + 'school-information/6-facilities.html" class="mob-ft-link">Facilities</a>',
    '            <a href="' + R + 'news.html" class="mob-ft-link">News</a>',
    '            <a href="' + R + 'login/parent-login.html" class="mob-ft-link mob-ft-link--gold">Parent Login</a>',
    '          </div>',

    '          <div class="mob-ft-rule"></div>',

    '          <div class="mob-ft-contact">',
    '            <a href="tel:+919480663011" class="mob-ft-contact-item">',
    '              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l1.61-1.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    '              +91 94806 63011',
    '            </a>',
    '            <a href="mailto:Lorettocentralschool@gmail.com" class="mob-ft-contact-item">',
    '              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    '              Lorettocentralschool@gmail.com',
    '            </a>',
    '          </div>',

    '          <div class="mob-ft-rule"></div>',

    '          <div class="mob-ft-bottom">',
    '            <span class="mob-ft-copy">&#169; <span class="lcs-ft-yr"></span> Loretto Central School</span>',
    '            <span class="mob-ft-cbse">CBSE No. 831368</span>',
    '          </div>',

    '        </div>',

    '        <div class="mob-ft-credits">',
    '          Developed by <a href="https://appvertex.in" target="_blank" rel="noopener">AppVertex</a>',
    '          &nbsp;&#183;&nbsp; Built by <strong>Leston</strong> &amp; <strong>Lenstar</strong>',
    '        </div>',

    '      </div>',
    '    </div>',
    /* --- END MOBILE --- */

    '  </div>',
    '</footer>',

    '<button id="lcs-scroll-top" aria-label="Scroll to top" title="Scroll to top">',
    '  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
    '</button>'

  ].join('\n');

  /* ── CSS ── */
  var FOOTER_CSS = [
    '<style id="lcs-footer-styles">',

    'footer#lcs-footer{font-family:\'Nunito\',sans-serif;border-top:4px solid var(--gold,#c8960c);}',

    /* DESKTOP */
    '.lcs-ft-desktop{display:block;}',
    '.lcs-ft-mobile{display:none;}',
    'footer#lcs-footer .lcs-ft-desktop{background:#0a3535;color:rgba(255,255,255,0.7);}',
    '.footer-main{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding:60px 0 40px;}',
    '.footer-logo-wrap{display:flex;align-items:center;text-decoration:none;margin-bottom:16px;}',
    '.footer-brand p{font-size:0.85rem;line-height:1.7;color:rgba(255,255,255,0.6);margin-bottom:20px;}',
    '.social-links{display:flex;gap:10px;}',
    '.social-link{width:36px;height:36px;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.7);text-decoration:none;transition:background 0.2s,color 0.2s;}',
    '.social-link:hover{background:var(--gold,#c8960c);color:#054040;}',
    '.footer-col h4{color:var(--gold-light,#e8b020);font-size:0.88rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;border-bottom:1px solid rgba(200,150,12,0.25);padding-bottom:8px;}',
    '.footer-col ul{list-style:none;}',
    '.footer-col ul li{margin-bottom:10px;}',
    '.footer-col ul li a{color:rgba(255,255,255,0.6);text-decoration:none;font-size:0.85rem;transition:color 0.2s;}',
    '.footer-col ul li a:hover{color:var(--gold,#c8960c);}',
    '.footer-contact-list li{display:flex;gap:10px;align-items:flex-start;color:rgba(255,255,255,0.75);}',
    '.footer-contact-list li span{color:var(--gold-light,#e8b020);flex-shrink:0;}',
    '.footer-login-link{margin-top:15px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);}',
    '.footer-login-link a{font-weight:700;color:var(--gold-light,#e8b020)!important;}',
    '.footer-bottom{border-top:1px solid rgba(255,255,255,0.08);padding:20px 0 10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:0.8rem;}',
    '.footer-bottom a{color:var(--gold,#c8960c);text-decoration:none;font-size:0.8rem;transition:color 0.2s;}',
    '.footer-bottom a:hover{color:#fff;}',
    '.footer-bottom-links{display:flex;gap:20px;}',
    '.footer-credits{padding:24px 0 32px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;}',
    '.footer-credits-dev,.footer-credits-built{font-family:\'Nunito\',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.12em;color:rgba(255,255,255,0.4);text-transform:uppercase;}',
    '.footer-credits-brand{color:var(--gold-light,#e8b020)!important;text-decoration:none;transition:color 0.3s;margin-left:4px;border-bottom:1px solid rgba(232,176,32,0.2);padding-bottom:1px;}',
    '.footer-credits-brand:hover{color:#fff!important;border-bottom-color:#fff;}',
    '.footer-credits-built strong{color:rgba(255,255,255,0.7);font-weight:800;}',
    '.footer-admin-link{display:inline-flex;width:6px;height:6px;background:rgba(255,255,255,0.1);border-radius:50%;margin-left:8px;transition:all 0.3s;border:none;flex-shrink:0;}',
    '.footer-admin-link:hover{background:var(--gold-light);transform:scale(1.2);}',

    '@media(max-width:1100px){.footer-main{grid-template-columns:repeat(3,1fr);gap:30px;}}',
    '@media(max-width:768px){',
    '  .lcs-ft-desktop{display:none!important;}',
    '  .lcs-ft-mobile{display:block!important;}',
    '}',

    /* MOBILE — Floating dark card */
    '.mob-ft-base{background:#0e6b6b;padding:16px 14px 20px;}',
    '.mob-ft-card{background:#094f4f;border:0.5px solid rgba(200,150,12,0.28);border-radius:16px;padding:18px 16px 14px;box-shadow:0 4px 24px rgba(0,0,0,0.22);}',
    '.mob-ft-row1{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:16px;}',
    '.mob-ft-brand{display:flex;align-items:center;gap:10px;min-width:0;}',
    '.mob-ft-logo{width:36px;height:36px;border-radius:50%;border:1.5px solid #c8960c;overflow:hidden;flex-shrink:0;}',
    '.mob-ft-logo img{width:100%;height:100%;object-fit:cover;display:block;}',
    '.mob-ft-name{font-family:\'Playfair Display\',serif;font-size:0.82rem;font-weight:700;color:#fff;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.mob-ft-sub{font-size:0.68rem;color:#e8b020;margin-top:2px;white-space:nowrap;}',
    '.mob-ft-cta{flex-shrink:0;font-size:0.68rem;font-weight:700;color:#e8b020;border:0.5px solid rgba(232,176,32,0.5);border-radius:50px;padding:6px 12px;text-decoration:none;white-space:nowrap;letter-spacing:0.02em;transition:background 0.2s,color 0.2s;}',
    '.mob-ft-cta:hover{background:#c8960c;color:#094f4f;}',
    '.mob-ft-links{display:flex;flex-wrap:wrap;gap:4px 0;margin-bottom:14px;}',
    '.mob-ft-link{font-size:0.75rem;color:rgba(255,255,255,0.62);text-decoration:none;padding:2px 8px 2px 0;transition:color 0.18s;}',
    '.mob-ft-link:not(:last-child)::after{content:"·";margin-left:8px;color:rgba(255,255,255,0.22);}',
    '.mob-ft-link:hover{color:#e8b020;}',
    '.mob-ft-link--gold{color:#e8b020!important;font-weight:700;}',
    '.mob-ft-rule{border:none;border-top:0.5px solid rgba(200,150,12,0.2);margin:0 0 12px;}',
    '.mob-ft-contact{display:flex;flex-direction:column;gap:7px;margin-bottom:14px;}',
    '.mob-ft-contact-item{display:flex;align-items:center;gap:7px;font-size:0.72rem;color:rgba(255,255,255,0.65);text-decoration:none;transition:color 0.18s;word-break:break-all;}',
    '.mob-ft-contact-item svg{stroke:#e8b020;flex-shrink:0;}',
    '.mob-ft-contact-item:hover{color:#e8b020;}',
    '.mob-ft-bottom{display:flex;justify-content:space-between;align-items:center;gap:8px;}',
    '.mob-ft-copy{font-size:0.68rem;color:rgba(255,255,255,0.32);}',
    '.mob-ft-cbse{font-size:0.66rem;color:rgba(200,150,12,0.7);border:0.5px solid rgba(200,150,12,0.28);border-radius:4px;padding:3px 7px;flex-shrink:0;}',
    '.mob-ft-credits{padding:16px 0 8px;text-align:center;font-family:\'Nunito\',sans-serif;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.3);line-height:1.6;}',
    '.mob-ft-credits a{color:var(--gold-light);text-decoration:none;font-weight:800;border-bottom:0.5px solid rgba(232,176,32,0.3);}',
    '.mob-ft-credits strong{color:rgba(255,255,255,0.6);font-weight:800;}',

    /* Scroll to top */
    '#lcs-scroll-top{position:fixed;bottom:25px;right:25px;width:48px;height:48px;background:var(--gold,#c8960c);color:#094f4f;border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;visibility:hidden;transform:translateY(20px);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:0 6px 20px rgba(0,0,0,0.3);z-index:99990;}',
    '#lcs-scroll-top.show{opacity:1;visibility:visible;transform:translateY(0);}',
    '#lcs-scroll-top:hover{background:var(--gold-light,#e8b020);transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,0,0,0.4);}',
    '@media(max-width:768px){#lcs-scroll-top{bottom:20px;right:20px;width:42px;height:42px;}}',

    '</style>'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('lcs-footer-styles')) return;
    document.head.insertAdjacentHTML('beforeend', FOOTER_CSS);
  }

  async function injectHTML() {
    if (document.getElementById('lcs-footer')) return;
    const contact = await loadContact();

    let html = FOOTER_HTML;
    if (contact) {
      if (contact.address) html = html.replace(/Main Road, Bantwal, Karnataka/g, contact.address);
      if (contact.phone) html = html.replace(/\+91 94806 63011/g, contact.phone);
      else html = html.replace(/\+91 94806 63011/g, '+91 94806 63011');
      if (contact.email) html = html.replace(/info@school\.edu/g, contact.email);
      else html = html.replace(/info@school\.edu/g, 'Lorettocentralschool@gmail.com');
    }

    document.body.insertAdjacentHTML('beforeend', html);
    var yr = new Date().getFullYear();
    document.querySelectorAll('.lcs-ft-yr').forEach(function (el) { el.textContent = yr; });
  }

  async function boot() {
    injectStyles();
    await injectHTML();

    var btn = document.getElementById('lcs-scroll-top');
    if (btn) {
      window.addEventListener('scroll', function () {
        btn.classList.toggle('show', window.scrollY > 400);
      }, { passive: true });
      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.LCSFooter = { init: boot };
})();
