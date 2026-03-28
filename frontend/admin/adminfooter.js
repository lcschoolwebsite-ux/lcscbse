// ============================================================
//  Loretto Central School — ADMIN Footer  v1.0
//  Save at:  admin/adminfooter.js
// ============================================================
(function () {
  'use strict';

  var styles = document.createElement('style');
  styles.innerHTML = `
    #lcs-admin-footer {
      background: linear-gradient(180deg, #062f2f 0%, #0e6b6b 100%);
      border-top: 3px solid #c8960c;
      color: rgba(255, 255, 255, 0.85);
      font-family: 'Nunito', sans-serif;
      padding: 12px 0;
      font-size: 0.7rem;
    }
    .lcs-footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: center;
    }
    .lcs-footer-left { display: flex; flex-direction: column; gap: 4px; }
    .lcs-footer-title { font-family: 'Playfair Display', serif; font-size: 0.72rem; font-weight: 700; color: #e8b020; }
    .lcs-footer-text { font-size: 0.65rem; color: rgba(255, 255, 255, 0.75); margin: 0; }
    .lcs-footer-link { color: #e8b020; text-decoration: none; font-weight: 600; }
    .lcs-footer-link:hover { color: #c8960c; }
    .lcs-footer-right { display: flex; flex-direction: column; gap: 6px; text-align: right; }
    .lcs-footer-contact { display: flex; flex-direction: column; gap: 2px; }
    .lcs-footer-contact-label { font-size: 0.55rem; font-weight: 800; color: rgba(200, 150, 12, 0.8); }
    .lcs-footer-contact-info { font-size: 0.68rem; color: rgba(255, 255, 255, 0.9); }
    .lcs-footer-contact-info a { color: #e8b020; text-decoration: none; }
    .lcs-footer-divider { height: 1px; background: rgba(200, 150, 12, 0.25); margin: 8px 0; }
    .lcs-footer-credits { text-align: center; font-size: 0.60rem; color: rgba(255, 255, 255, 0.65); padding-top: 6px; }
    .lcs-footer-credits a { color: #e8b020; text-decoration: none; font-weight: 700; }
    @media (max-width: 768px) {
      .lcs-footer-inner { grid-template-columns: 1fr; gap: 10px; }
      .lcs-footer-right { text-align: left; }
    }
  `;
  document.head.appendChild(styles);

  var HTML = '<footer id="lcs-admin-footer"><div class="lcs-footer-inner"><div class="lcs-footer-left"><div class="lcs-footer-title"> Developed By</div><p class="lcs-footer-text">Designed & built by <strong style="color: #e8b020;">Appvertex</strong></p><p class="lcs-footer-text" style="font-size: 0.60rem;">Visit: <a href="https://appvertex.in" target="_blank" class="lcs-footer-link">appvertex.in ↗</a></p></div><div class="lcs-footer-right"><div class="lcs-footer-contact"><div class="lcs-footer-contact-label"> Support</div><div class="lcs-footer-contact-info"><a href="mailto:info@appvertex.in">info@appvertex.in</a></div></div><div class="lcs-footer-contact"><div class="lcs-footer-contact-label"> Built By</div><div class="lcs-footer-contact-info">Leston & Lenstar</div></div></div></div><div class="lcs-footer-divider"></div><div class="lcs-footer-credits">© 2026 Loretto | Powered by <a href="https://appvertex.in" target="_blank">Appvertex</a></div></footer>';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (!document.getElementById('lcs-admin-footer')) {
        document.body.insertAdjacentHTML('beforeend', HTML);
      }
    });
  } else {
    if (!document.getElementById('lcs-admin-footer')) {
      document.body.insertAdjacentHTML('beforeend', HTML);
    }
  }
})();
//
//  Admin-only footer with Appvertex branding and contact info
//  Matches admin navbar colors and premium styling
// ============================================================
(function () {
  'use strict';

  // Create and inject styles directly
  var styles = document.createElement('style');
  styles.innerHTML = `
    #lcs-admin-footer {
      background: linear-gradient(180deg, #062f2f 0%, #0e6b6b 100%);
      border-top: 3px solid #c8960c;
      color: rgba(255, 255, 255, 0.85);
      font-family: 'Nunito', sans-serif;
      padding: 12px 0;
      margin-top: auto;
      font-size: 0.7rem;
    }
    
    .lcs-footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: center;
    }
    
    .lcs-footer-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .lcs-footer-title {
      font-family: 'Playfair Display', serif;
      font-size: 0.72rem;
      font-weight: 700;
      color: #e8b020;
      margin-bottom: 2px;
      letter-spacing: 0.05em;
    }
    
    .lcs-footer-text {
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.4;
      margin: 0;
    }
    
    .lcs-footer-link {
      color: #e8b020;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    
    .lcs-footer-link:hover {
      color: #c8960c;
      text-decoration: underline;
    }
    
    .lcs-footer-right {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: right;
    }
    
    .lcs-footer-contact {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .lcs-footer-contact-label {
      font-size: 0.55rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(200, 150, 12, 0.8);
    }
    
    .lcs-footer-contact-info {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
      word-break: break-word;
    }
    
    .lcs-footer-contact-info a {
      color: #e8b020;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .lcs-footer-contact-info a:hover {
      color: #c8960c;
    }
    
    .lcs-footer-divider {
      height: 1px;
      background: rgba(200, 150, 12, 0.25);
      margin: 8px 0;
    }
    
    .lcs-footer-credits {
      text-align: center;
      font-size: 0.60rem;
      color: rgba(255, 255, 255, 0.65);
      padding-top: 6px;
    }
    
    .lcs-footer-credits .credit-text {
      display: inline;
    }
    
    .lcs-footer-credits a {
      color: #e8b020;
      text-decoration: none;
      font-weight: 700;
      transition: all 0.2s;
    }
    
    .lcs-footer-credits a:hover {
      color: #c8960c;
    }
    
    @media (max-width: 768px) {
      .lcs-footer-inner {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .lcs-footer-right {
        text-align: left;
      }
      .lcs-footer-inner {
        padding: 0 18px;
      }
  `;
  document.head.appendChild(styles);

  var HTML = '<footer id="lcs-admin-footer">'
    + '<div class="lcs-footer-inner">'
      + '<div class="lcs-footer-left">'
      +   '<div class="lcs-footer-title"> Developed By</div>'
      +   '<p class="lcs-footer-text">'
      +     'This admin panel was designed & built by '
      +     '<strong style="color: #e8b020;">Appvertex</strong> — '
      +     'a premium digital solutions agency specializing in web design, development, and digital strategy.'
      +   '</p>'
      +   '<p class="lcs-footer-text" style="margin-top: 8px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.6);">'
      +     'Visit us: <a href="https://appvertex.in" target="_blank" class="lcs-footer-link">appvertex.in ↗</a>'
      +   '</p>'
      + '</div>'
      + '<div class="lcs-footer-right">'
      +   '<div class="lcs-footer-contact">'
      +     '<div class="lcs-footer-contact-label"> Technical Support</div>'
      +     '<div class="lcs-footer-contact-info">'
      +       '<a href="mailto:info@appvertex.in">info@appvertex.in</a>'
      +     '</div>'
      +   '</div>'
      +   '<div class="lcs-footer-contact">'
      +     '<div class="lcs-footer-contact-label"> Built By</div>'
      +     '<div class="lcs-footer-contact-info">Leston & Lenstar</div>'
      +   '</div>'
      + '</div>'
    + '</div>'
    + '<div class="lcs-footer-divider"></div>'
    + '<div class="lcs-footer-credits">'
    +   '<span class="credit-text">Loretto Central School Admin Panel © 2026 | Powered by <a href="https://appvertex.in" target="_blank">Appvertex</a></span>'
    + '</div>'
    + '</footer>';

  // Insert HTML on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (!document.getElementById('lcs-admin-footer')) {
        document.body.insertAdjacentHTML('beforeend', HTML);
      }
    });
  } else {
    if (!document.getElementById('lcs-admin-footer')) {
      document.body.insertAdjacentHTML('beforeend', HTML);
    }
  }
})();
