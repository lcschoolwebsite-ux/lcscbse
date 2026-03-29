// ============================================================
//  Loretto Central School — Navbar Component  v2.0
//  Fixes: depth detection, scroll shadow, tablet layout,
//         flyout z-index, active link, mobile accordion,
//         keyboard accessibility, sticky scroll behaviour.
// ============================================================
(function () {
  'use strict';

  /* ── 1. ROOT PREFIX DETECTION ── */
  function getRootPrefix() {
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);
    if (parts.length && /\.html?$/i.test(parts[parts.length - 1])) parts.pop();
    var KNOWN_ROOTS = ['LORETTO WEBZ', 'LORETTO%20WEBZ', 'loretto-webz', 'loretto_webz', 'www', 'public', 'dist', 'site', 'frontend'];
    if (parts.length && KNOWN_ROOTS.indexOf(decodeURIComponent(parts[0])) > -1) parts.shift();
    if (parts.length === 0) return './';
    return parts.map(function () { return '../'; }).join('');
  }
  var R = getRootPrefix();
  var DEFAULT_NOTICE_TEXT = 'Admissions Open for 2025-26 | Annual Sports Day - March 15, 2025 | Board Exam Results: Outstanding Performance - 98% Pass | Science Exhibition on April 5th | PTM Scheduled for March 20th | New Computer Lab Inaugurated | Apply now for Nursery Admissions';

  /* ── 2. CSS ── */
  var CSS = '<style id="lcs-navbar-styles">'
    + ':root{--navy:#0e6b6b;--navy-dark:#094f4f;--gold:#c8960c;--gold-light:#e8b020;--gold-pale:#f5e6c0;--white:#ffffff;--light-bg:#f9f6ef;--text:#1a2e2e;--text-muted:#5a6e6e;--border:#e2d5b0;}'
    + '*,*::before,*::after{box-sizing:border-box;}'
    + 'html{scroll-behavior:smooth;}'
    + 'body{font-family:\'Nunito\',sans-serif;color:var(--text);background:var(--white);overflow-x:hidden;margin:0;}'

    /* CONTAINER */
    + '.lcs-container{max-width:1160px;margin:0 auto;padding:0 24px;}'

    /* TOP BAR */
    + '#lcs-top-bar{background:var(--navy-dark);color:rgba(255,255,255,.85);font-size:.78rem;}'
    + '.lcs-top-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;gap:12px;}'
    + 'a.lcs-brand{display:flex;align-items:center;gap:14px;text-decoration:none;flex-shrink:0;}'
    + '.lcs-brand .tb-logo{width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);flex-shrink:0;}'
    + '.lcs-brand .tb-text{text-align:left;}'
    + '.lcs-brand .tb-name{font-family:\'Playfair Display\',serif;font-size:1.45rem;font-weight:700;color:#fff;line-height:1.2;}'
    + '.lcs-brand .tb-tagline{font-size:.68rem;color:var(--gold-light);font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-top:2px;}'
    + '.lcs-brand .tb-affiliation{font-size:.60rem;color:rgba(255,255,255,0.8);font-weight:600;letter-spacing:.08em;margin-top:2px;text-transform:uppercase;}'
    + '.lcs-top-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}'

    /* PARENT BTN */
    + '.lcs-parent-btn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy-dark)!important;text-decoration:none;font-family:\'Nunito\',sans-serif;font-size:.78rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:9px 20px;border-radius:8px;border:none;box-shadow:0 3px 10px rgba(200,150,12,.4),inset 0 1px 0 rgba(255,255,255,.3);position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;white-space:nowrap;cursor:pointer;}'
    + '.lcs-parent-btn::before{content:\'\';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);transform:translateX(-100%);transition:transform .5s;}'
    + '.lcs-parent-btn:hover::before{transform:translateX(100%);}'
    + '.lcs-parent-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(200,150,12,.55);}'

    /* SEARCH */
    + '.lcs-search{position:relative;display:flex;align-items:center;}'
    + '.lcs-search-toggle{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.75);padding:7px 9px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:color .2s,background .2s;}'
    + '.lcs-search-toggle:hover{color:var(--gold-light);background:rgba(255,255,255,.1);}'
    + '.lcs-search-box{display:flex;align-items:center;position:absolute;right:0;top:50%;transform:translateY(-50%);background:var(--navy-dark);border:1.5px solid rgba(200,150,12,.5);border-radius:22px;overflow:hidden;width:0;opacity:0;pointer-events:none;transition:width .35s cubic-bezier(.4,0,.2,1),opacity .25s;z-index:200;}'
    + '.lcs-search-box.open{width:230px;opacity:1;pointer-events:all;}'
    + '.lcs-search-input{background:transparent;border:none;outline:none;color:#fff;font-family:\'Nunito\',sans-serif;font-size:.82rem;padding:8px 30px 8px 14px;width:100%;}'
    + '.lcs-search-input::placeholder{color:rgba(255,255,255,.4);}'
    + '.lcs-search-clear{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.5);font-size:.75rem;padding:0 10px 0 0;flex-shrink:0;opacity:0;transition:opacity .2s;}'
    + '.lcs-search-clear.show{opacity:1;}'
    + '.lcs-search-results{position:absolute;top:calc(100% + 12px);right:0;width:310px;max-height:380px;overflow-y:auto;background:#fff;border-radius:12px;box-shadow:0 10px 36px rgba(0,0,0,.18);border:2px solid var(--gold);display:none;z-index:99999;}'
    + '.lcs-search-results.show{display:block;}'
    + '.lcs-res-item{padding:12px 16px;border-bottom:1px solid var(--border);text-decoration:none;display:block;transition:background .15s;}'
    + '.lcs-res-item:last-child{border-bottom:none;}'
    + '.lcs-res-item:hover{background:var(--gold-pale);}'
    + '.lcs-res-cat{font-size:.63rem;color:var(--gold);text-transform:uppercase;font-weight:800;letter-spacing:.09em;}'
    + '.lcs-res-title{font-weight:600;color:var(--navy);margin-top:2px;font-size:.87rem;}'

    /* STICKY HEADER */
    + '#lcs-header{background:var(--white);border-bottom:3px solid var(--gold);position:sticky;top:0;z-index:1000;transition:box-shadow .25s;}'
    + '#lcs-header.scrolled{box-shadow:0 4px 20px rgba(0,0,0,.13);}'
    + '.lcs-header-inner{display:flex;align-items:center;justify-content:center;padding:0;}'

    /* NAV */
    + '#lcs-nav{display:flex;align-items:center;gap:0;flex-wrap:wrap;width:100%;justify-content:center;max-width:1160px;margin:0 auto;padding:0 8px;}'
    + '.lcs-nav-item{position:relative;display:flex;align-items:stretch;overflow:visible!important;}'
    + '.lcs-nav-item>a{font-size:.88rem;font-weight:700;color:var(--navy);text-decoration:none;padding:16px 14px;white-space:nowrap;display:flex;align-items:center;gap:4px;border-radius:6px;background:transparent;transition:all .25s cubic-bezier(.4,0,.2,1);margin:2px 1px;}'
    + '.lcs-nav-item>a .arrow{font-size:.52rem;opacity:.6;transition:transform .25s,opacity .25s;margin-left:2px;}'
    + '.lcs-nav-item:hover>a{background:rgba(14,107,107,.1);color:var(--navy-dark);}'
    + '.lcs-nav-item:hover>a .arrow{transform:rotate(180deg);opacity:1;}'
    + '.lcs-nav-item>a.active{background:linear-gradient(135deg,var(--navy),var(--navy-dark));color:#fff!important;box-shadow:0 3px 10px rgba(14,107,107,.25);}'

    /* DROPDOWN */
    + '.lcs-dropdown{display:none;position:absolute;top:100%;left:0;min-width:210px;background:var(--navy);box-shadow:0 8px 28px rgba(0,0,0,.2);z-index:9999;border-top:3px solid var(--gold);overflow:visible!important;border-radius:0 0 6px 6px;}'
    + '.lcs-nav-item:hover .lcs-dropdown{display:block;}'
    + '.lcs-dropdown a{display:block;padding:10px 18px;font-size:.78rem;font-weight:500;color:rgba(255,255,255,.88);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);transition:background .15s,color .15s,padding-left .15s;white-space:nowrap;}'
    + '.lcs-dropdown a:last-child{border-bottom:none;}'
    + '.lcs-dropdown a:hover,.lcs-dropdown a.active{background:var(--gold);color:#fff;padding-left:24px;}'

    /* FLYOUT */
    + '.lcs-has-flyout{position:relative;}'
    + '.lcs-has-flyout>a{display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer;}'
    + '.lcs-flyout-arrow{font-size:.52rem;margin-left:auto;opacity:.7;flex-shrink:0;transition:transform .2s;}'
    + '.lcs-has-flyout.open>a .lcs-flyout-arrow{transform:rotate(90deg);}'
    + '.lcs-flyout-panel{display:none;position:absolute;left:100%;top:-3px;min-width:240px;background:var(--navy-dark);border-top:3px solid var(--gold);border-left:2px solid rgba(200,150,12,.35);box-shadow:8px 8px 32px rgba(0,0,0,.3);z-index:10001;border-radius:0 6px 6px 0;}'
    + '.lcs-has-flyout.open>.lcs-flyout-panel{display:block;}'
    + '@media(hover:hover){.lcs-has-flyout:hover>.lcs-flyout-panel{display:block;}}'
    + '.lcs-flyout-panel a{display:block;padding:10px 16px;font-size:.76rem;font-weight:500;color:rgba(255,255,255,.87);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);transition:background .15s,padding-left .15s,color .15s;white-space:nowrap;}'
    + '.lcs-flyout-panel a:last-child{border-bottom:none;}'
    + '.lcs-flyout-panel a:hover{background:var(--gold);color:#fff;padding-left:22px;}'
    + '.lcs-dropdown .lcs-has-flyout>a{padding:10px 12px;background:rgba(255,255,255,.05);font-weight:700;font-size:.75rem;color:rgba(255,255,255,.92);letter-spacing:.02em;}'
    + '.lcs-dropdown .lcs-has-flyout>a:hover,.lcs-dropdown .lcs-has-flyout.open>a{background:var(--gold);color:#fff;}'

    /* NOTICE BAR */
    + '#lcs-notice-bar{background:var(--navy);padding:9px 0;overflow:hidden;}'
    + '.lcs-notice-inner{display:flex;align-items:center;gap:0;overflow:hidden;}'
    + '.lcs-notice-label{background:var(--gold-light);color:#094f4f;font-weight:700;font-size:.75rem;padding:4px 14px;white-space:nowrap;letter-spacing:.06em;flex-shrink:0;border-radius:3px;z-index:2;}'
    + '.lcs-ticker-wrap{flex:1;overflow:hidden;min-width:0;}'
    + '.lcs-ticker{display:inline-block;color:rgba(255,255,255,.9);font-size:.83rem;white-space:nowrap;animation:lcsTicker 32s linear infinite;padding-left:20px;}'
    + '@keyframes lcsTicker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}'

    /* MOBILE HAMBURGER — Dynamic Spin Animation */
    + '.lcs-mob-btn{display:none;background:none;border:none;padding:9px 6px;cursor:pointer;flex-direction:column;gap:5px;align-items:flex-end;justify-content:center;flex-shrink:0;outline:none;}'
    + '.lcs-mob-btn span{display:block;height:2.5px;background:var(--navy-dark);border-radius:2px;transform-origin:center;transition:transform 0.45s cubic-bezier(0.68,-0.55,0.265,1.55), width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;}'
    + '.lcs-mob-btn span:nth-child(1){width:24px;}'
    + '.lcs-mob-btn span:nth-child(2){width:16px;}'
    + '.lcs-mob-btn span:nth-child(3){width:20px;}'
    + '.lcs-mob-btn.open span:nth-child(1){transform:translateY(7.5px) rotate(135deg);width:24px;}'
    + '.lcs-mob-btn.open span:nth-child(2){transform:scaleX(0);opacity:0;}'
    + '.lcs-mob-btn.open span:nth-child(3){transform:translateY(-7.5px) rotate(-135deg);width:24px;}'

    /* MOBILE DRAWER */
    + '#lcs-mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99998;}'
    + '#lcs-mob-overlay.open{display:block;}'
    + '#lcs-mob-nav{display:block;position:fixed;top:0;right:0;bottom:0;width:290px;max-width:90vw;background:var(--navy-dark);z-index:99999;overflow-y:auto;padding:0 0 24px;box-shadow:-8px 0 36px rgba(0,0,0,.3);transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1);}'
    + '#lcs-mob-nav.open{transform:translateX(0);}'
    + '.lcs-mob-close{background:rgba(255,255,255,.06);border:none;color:rgba(255,255,255,.8);font-size:1rem;cursor:pointer;padding:14px 20px;display:flex;align-items:center;gap:8px;width:100%;text-align:left;font-weight:700;border-bottom:1px solid rgba(255,255,255,.1);transition:background .15s;}'
    + '.lcs-mob-close:hover{background:rgba(255,255,255,.12);}'
    + '.lcs-mob-school{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1);}'
    + '.lcs-mob-school img{width:44px;height:44px;border-radius:50%;border:2px solid var(--gold);object-fit:cover;flex-shrink:0;}'
    + '.lcs-mob-school-name{font-family:\'Playfair Display\',serif;font-size:.95rem;font-weight:700;color:#fff;line-height:1.3;}'
    + '.lcs-mob-school-tag{font-size:.68rem;color:var(--gold-light);text-transform:uppercase;letter-spacing:.06em;margin-top:2px;font-weight:700;line-height:1.2;}'
    + '.lcs-mob-school-aff{font-size:.58rem;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:.04em;margin-top:1px;}'
    + '.lcs-mob-nav-link{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;color:rgba(255,255,255,.88);text-decoration:none;font-size:.88rem;font-weight:600;border-bottom:1px solid rgba(255,255,255,.05);transition:background .15s,color .15s;cursor:pointer;}'
    + '.lcs-mob-nav-link:hover{background:rgba(255,255,255,.07);color:#fff;}'
    + '.lcs-mob-nav-link.active-page{color:var(--gold-light)!important;}'
    + '.mob-arrow{font-size:.7rem;opacity:.6;transition:transform .2s;}'
    + '.lcs-mob-nav-link.expanded .mob-arrow{transform:rotate(90deg);opacity:1;}'
    + '.lcs-mob-submenu{display:none;background:rgba(0,0,0,.18);border-left:3px solid var(--gold);}'
    + '.lcs-mob-submenu.open{display:block;}'
    + '.lcs-mob-submenu a{display:block;padding:10px 20px 10px 28px;color:rgba(255,255,255,.75);text-decoration:none;font-size:.83rem;border-bottom:1px solid rgba(255,255,255,.04);transition:background .15s,color .15s;}'
    + '.lcs-mob-submenu a:hover{background:rgba(255,255,255,.07);color:#fff;}'
    + '.lcs-mob-login-wrap{padding:16px 20px;margin-top:8px;}'
    + '.lcs-mob-login-btn{display:block;text-align:center;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy-dark)!important;text-decoration:none;font-weight:800;font-size:.85rem;letter-spacing:.04em;padding:13px 20px;border-radius:8px;box-shadow:0 3px 12px rgba(200,150,12,.4);}'

    /* TABLET 769–1024 */
    + '@media(max-width:1024px) and (min-width:769px){'
    + '.lcs-brand .tb-name{font-size:1.2rem;}'
    + '.lcs-brand .tb-logo{width:52px;height:52px;}'
    + '#lcs-nav{padding:0 4px;}'
    + '.lcs-nav-item>a{font-size:.78rem;padding:14px 9px;}'
    + '.lcs-parent-btn{font-size:.7rem!important;padding:7px 12px!important;}'
    + '}'

    /* ── IDEA 9: MOBILE TICKER inside sticky header ── */
    + '#lcs-mob-ticker{display:none;flex:1;min-width:0;overflow:hidden;}'
    + '#lcs-mob-ticker .lmt{display:inline-block;white-space:nowrap;font-size:.7rem;font-weight:700;color:rgba(200,150,12,.92);letter-spacing:.06em;animation:lmtScroll 22s linear infinite;}'
    + '@keyframes lmtScroll{0%{transform:translateX(110%)}100%{transform:translateX(-100%)}}'

    /* MOBILE ≤768 */
    + '@media(max-width:768px){'
    + '.lcs-search{display:none!important;}'
    + '.lcs-search-box.open{width:180px;}'
    + '#lcs-nav{display:none!important;}'
    + '.lcs-mob-btn{display:flex;}'
    + '#lcs-mob-ticker{display:flex;align-items:center;padding:0 2px 0 14px;}'
    + '#lcs-header{background:var(--gold-pale)!important;border-bottom:none!important;box-shadow:none!important;}'
    + '#lcs-header.scrolled{box-shadow:none!important;}'
    + '.lcs-header-inner{justify-content:space-between;padding:0 4px 0 0;min-height:48px;}'
    + '.lcs-top-row{flex-wrap:wrap;padding:9px 0;gap:8px;}'
    + '#lcs-top-bar{position:relative;margin-bottom:12px;}'
    + '#lcs-top-bar::after{content:"";position:absolute;left:0;right:0;top:calc(100% - 1px);height:14px;background-image:url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L0,40 Q300,120 600,40 T1200,40 L1200,0 Z" fill="%23c8960c"></path></svg>\');background-size:100% 100%;background-position:top;background-repeat:no-repeat;z-index:10;}'
    + '.lcs-parent-btn{display:none;}'
    + '#lcs-notice-bar{display:none;}'
    + '}'
    + '@media(max-width:480px){'
    + '#lcs-mob-nav{width:100%;max-width:100%;}'
    + '.lcs-brand .tb-name{font-size:1.05rem;}'
    + '.lcs-brand .tb-logo{width:52px;height:52px;}'
    + '}'
    + '</style>';

  var RESPONSIVE_FIXES = '<style id="lcs-mobile-fixes">'
    + 'img,svg,video,canvas,iframe{max-width:100%;}'
    + 'iframe{display:block;border:0;}'
    + 'table{max-width:100%;}'
    + '.container,.lcs-container{width:min(100%,1160px);}'
    + '.about-subnav-inner,.adm-subnav-inner,.si-subnav-inner,.acad-subnav-inner,.ac-subnav-inner{scrollbar-width:none;}'
    + '.about-subnav-inner::-webkit-scrollbar,.adm-subnav-inner::-webkit-scrollbar,.si-subnav-inner::-webkit-scrollbar,.acad-subnav-inner::-webkit-scrollbar,.ac-subnav-inner::-webkit-scrollbar{display:none;}'
    + '@media(max-width:768px){'
    + 'body{overflow-x:hidden;}'
    + '.container,.lcs-container{padding-left:16px!important;padding-right:16px!important;}'
    + 'section[style*="padding: 80px 0"]{padding:56px 0!important;}'
    + '.page-banner{padding:44px 0 36px!important;}'
    + '.page-banner h1,.page-banner-title,.hero-title{font-size:clamp(1.8rem,7vw,2.35rem)!important;line-height:1.15!important;}'
    + '.page-banner p,.hero-subtitle,.acad-hero-text p,.ac-hero-text p{font-size:.96rem!important;}'
    + '.content-card,.doc-card,.news-card,.mag-card,.download-card,.step-card,.activity-card{padding:24px 18px!important;}'
    + '.contact-cta,.enquiry-notice,.acad-hero-inner,.mag-card.featured{flex-direction:column!important;}'
    + '.enquiry-notice,.contact-cta{padding:24px 20px!important;text-align:left!important;}'
    + '.contact-cta .cta-btn,.download-btn,.doc-btn{width:100%;justify-content:center;}'
    + '.school-gallery,.feat-grid,.ac-info-grid,.ac-also-grid,.faculty-grid,.acad-tiles,.steps-grid,.download-cards,.adm-highlight-row,.payment-cards,.news-grid,.footer-grid,.magazine-grid,.activities-grid,.docs-grid,.mgmt-cards,.members-list,.content-layout,.tc-field,.sidebar{grid-template-columns:1fr!important;}'
    + '.about-subnav-inner,.adm-subnav-inner,.si-subnav-inner,.acad-subnav-inner,.ac-subnav-inner{padding-left:16px!important;padding-right:16px!important;}'
    + 'table,.info-table,.timing-table,.fee-table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;}'
    + '.info-table td:first-child,.timing-table tbody td:first-child{min-width:160px!important;width:160px!important;}'
    + 'table td,table th{font-size:.9rem!important;}'
    + 'div[style*="grid-template-columns: 1fr 1fr"],div[style*="grid-template-columns: repeat(2"],div[style*="grid-template-columns: repeat(3"],div[style*="grid-template-columns: repeat(4"]{grid-template-columns:1fr!important;}'
    + 'div[style*="padding: 40px"],div[style*="padding:40px"]{padding:24px!important;}'
    + 'div[style*="padding: 30px"],div[style*="padding:30px"]{padding:20px!important;}'
    + 'h1[style*="font-size: 2rem"],h2[style*="font-size: 2rem"],h3[style*="font-size: 1.8rem"]{font-size:1.65rem!important;line-height:1.2!important;}'
    + 'iframe[height="450"]{height:320px!important;}'
    + '.mag-card.featured .mag-cover,.content-layout aside,.content-layout .sidebar{width:100%!important;max-width:none!important;}'
    + '}'
    + '@media(max-width:480px){'
    + '.container,.lcs-container{padding-left:12px!important;padding-right:12px!important;}'
    + '.content-card,.doc-card,.news-card,.mag-card,.download-card,.step-card,.activity-card{padding:20px 14px!important;}'
    + '.school-gallery,.gallery-grid,.ac-also-grid,.acad-tiles{grid-template-columns:1fr!important;}'
    + '.page-banner h1,.page-banner-title,.hero-title{font-size:1.65rem!important;}'
    + 'iframe[height="450"]{height:260px!important;}'
    + '}'
    + '</style>';

  function ensureViewportMeta() {
    if (document.querySelector('meta[name="viewport"]')) return;
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);
  }

  function unique(values) {
    return values.filter(function (value, index, list) {
      return value && list.indexOf(value) === index;
    });
  }

  async function getApiBases() {
    var bases = [];

    if (typeof window.resolveApiBase === 'function') {
      try {
        bases.push(String(await window.resolveApiBase() || '/api').replace(/\/+$/, ''));
      } catch (error) { }
    }

    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      bases.push('http://localhost:3000/api');
      bases.push('http://127.0.0.1:3000/api');
      bases.push('http://localhost:8000/api');
      bases.push('http://127.0.0.1:8000/api');
    }

    if (/^https?:$/i.test(window.location.protocol)) {
      bases.push(String(window.location.origin || '').replace(/\/+$/, '') + '/api');
    }

    bases.push('/api');
    return unique(bases);
  }

  async function fetchFirstJson(path) {
    var bases = await getApiBases();

    for (var index = 0; index < bases.length; index += 1) {
      var base = String(bases[index] || '').replace(/\/+$/, '');
      if (!base) continue;

      try {
        var response = await fetch(base + path);
        if (!response.ok) continue;
        return await response.json().catch(function () { return null; });
      } catch (error) { }
    }

    return null;
  }

  function setText(selector, value) {
    if (value == null || value === '') return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setImageSources(selector, url) {
    var cleanUrl = String(url || '').trim();
    if (!cleanUrl) return;
    document.querySelectorAll(selector).forEach(function (img) {
      img.src = cleanUrl;
    });
  }

  function injectResponsiveFixes() {
    if (document.getElementById('lcs-mobile-fixes')) return;
    document.head.insertAdjacentHTML('beforeend', RESPONSIVE_FIXES);
  }

  function parseHtmlPayload(data) {
    if (!data || typeof data.html !== 'string' || !data.html.trim()) return null;
    var parser = new DOMParser();
    return parser.parseFromString('<div>' + data.html + '</div>', 'text/html');
  }

  function valueOf(node) {
    if (!node) return '';
    return String(node.value || node.getAttribute('value') || '').trim();
  }

  function getBannerUrlFromAboutPayload(data) {
    if (!data) return '';
    if (typeof data.bannerImage === 'string' && data.bannerImage.trim()) return data.bannerImage.trim();
    if (typeof data.bannerUrl === 'string' && data.bannerUrl.trim()) return data.bannerUrl.trim();

    var doc = parseHtmlPayload(data);
    if (!doc) return '';

    var bannerInput = doc.querySelector('#bannerUrlInput');
    var bannerImg = doc.querySelector('#bannerImg');
    return valueOf(bannerInput) || (bannerImg ? String(bannerImg.getAttribute('src') || '').trim() : '');
  }

  function applySharedBannerImage(url) {
    var cleanUrl = String(url || '').trim();
    if (!cleanUrl) return;
    var banner = document.querySelector('.page-banner');
    if (!banner) return;

    var runtimeStyle = document.getElementById('lcs-shared-banner-style');
    if (!runtimeStyle) {
      runtimeStyle = document.createElement('style');
      runtimeStyle.id = 'lcs-shared-banner-style';
      runtimeStyle.textContent = '.page-banner.lcs-shared-banner::before{display:none !important;}';
      document.head.appendChild(runtimeStyle);
    }

    banner.classList.add('lcs-shared-banner');
    banner.style.background = 'linear-gradient(135deg, rgba(9,79,79,0.82) 0%, rgba(14,107,107,0.74) 60%, rgba(18,122,122,0.7) 100%), url("' + cleanUrl.replace(/"/g, '\\"') + '") center/cover no-repeat';
  }

  async function syncSharedBanner() {
    var banner = document.querySelector('.page-banner');
    if (!banner) return;

    var cacheKey = 'lcsSharedBannerImage';
    try {
      var cached = window.sessionStorage && window.sessionStorage.getItem(cacheKey);
      if (cached) {
        applySharedBannerImage(cached);
        return;
      }
    } catch (error) { }

    try {
      var payload = await fetchFirstJson('/about/school-profile');
      var data = payload && payload.data ? payload.data : null;
      var bannerUrl = getBannerUrlFromAboutPayload(data);
      if (!bannerUrl) return;
      applySharedBannerImage(bannerUrl);
      try {
        if (window.sessionStorage) window.sessionStorage.setItem(cacheKey, bannerUrl);
      } catch (error) { }
    } catch (error) { }
  }

  function applySiteSettings(siteSettings) {
    if (!siteSettings || typeof siteSettings !== 'object') return;

    setText('.lcs-brand .tb-name', siteSettings.schoolName);
    // Hardcoded per user request, ignoring site settings for tagline/affiliation
    // setText('.lcs-brand .tb-tagline', siteSettings.tagline || siteSettings.affiliation);
    setText('.lcs-mob-school-name', siteSettings.schoolName);
    // setText('.lcs-mob-school-tag', siteSettings.affiliation || siteSettings.tagline);

    if (siteSettings.logo) {
      setImageSources('.lcs-brand .tb-logo, .lcs-mob-school img', siteSettings.logo);
    }

    if (siteSettings.noticeText) {
      setText('.lcs-ticker', siteSettings.noticeText);
      setText('#lcs-mob-ticker .lmt', siteSettings.noticeText);
    }

    var showNotice = siteSettings.showNoticeBar !== false;
    var noticeBar = document.getElementById('lcs-notice-bar');
    var mobileTicker = document.getElementById('lcs-mob-ticker');
    if (noticeBar) noticeBar.style.display = showNotice ? '' : 'none';
    if (mobileTicker) mobileTicker.style.display = showNotice ? '' : 'none';
  }

  async function syncSiteSettings() {
    var cacheKey = 'lcsSiteSettings';

    try {
      var cached = window.sessionStorage && window.sessionStorage.getItem(cacheKey);
      if (cached) {
        applySiteSettings(JSON.parse(cached));
      }
    } catch (error) { }

    try {
      var payload = await fetchFirstJson('/settings/site');
      var data = payload && payload.data ? payload.data : null;
      if (!data || !Object.keys(data).length) return;
      applySiteSettings(data);
      try {
        if (window.sessionStorage) window.sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) { }
    } catch (error) { }
  }

  /* ── 3. NAV HTML ── */
  function nav(html) { return html; }
  function dd(items) {
    return '<div class="lcs-dropdown">' + items.map(function (i) { return '<a href="' + i[0] + '">' + i[1] + '</a>'; }).join('') + '</div>';
  }
  function flyItem(label, items) {
    return '<div class="lcs-has-flyout"><a href="#">' + label + ' <span class="lcs-flyout-arrow">&#9654;</span></a>'
      + '<div class="lcs-flyout-panel">'
      + items.map(function (i) { return '<a href="' + i[0] + '">' + i[1] + '</a>'; }).join('')
      + '</div></div>';
  }

  function buildNav() {
    return ''
      + '<div id="lcs-top-bar"><div class="lcs-container"><div class="lcs-top-row">'
      + '<a class="lcs-brand" href="' + R + 'index.html">'
      + '<img class="tb-logo" src="' + R + 'logo.png" alt="Loretto Central School"/>'
      + '<div class="tb-text"><div class="tb-name">Loretto Central School</div>'
      + '<div class="tb-tagline">Love through service</div>'
      + '<div class="tb-affiliation">Affiliated to CBSE New Delhi: 831368</div></div></a>'
      + '<div class="lcs-top-right">'
      + '<div class="lcs-search">'
      + '<button class="lcs-search-toggle" id="lcsToggle" aria-label="Search">'
      + '<svg width="17" height="17" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.7"/><line x1="9.9" y1="9.9" x2="14" y2="14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
      + '</button>'
      + '<div class="lcs-search-box" id="lcsBox"><input class="lcs-search-input" id="lcsInput" type="text" placeholder="Search pages..." autocomplete="off"/>'
      + '<button class="lcs-search-clear" id="lcsClear">&#10005;</button></div>'
      + '<div class="lcs-search-results" id="lcsResults"></div></div>'
      + '<a href="' + R + 'login/parent-login.html" class="lcs-parent-btn"> Parent Login</a>'
      + '</div></div></div></div>'

      + '<header id="lcs-header"><div class="lcs-header-inner">'
      /* IDEA 9: ticker (hidden on desktop, shown on mobile via CSS) */
      + '<div id="lcs-mob-ticker"><div class="lmt">' + DEFAULT_NOTICE_TEXT + '</div></div>'
      /* Desktop nav */
      + '<nav id="lcs-nav">'

      + '<div class="lcs-nav-item"><a href="' + R + 'index.html">Home</a></div>'

      + '<div class="lcs-nav-item"><a href="#">About Us <span class="arrow">&#9660;</span></a>'
      + '<div class="lcs-dropdown">'
      + '<a href="' + R + 'about-us/1-school-profile.html">School Profile</a>'
      + '<a href="' + R + 'about-us/2-management.html">Management</a>'
      + '<a href="' + R + 'about-us/3-manager-speaks.html">Manager Speaks</a>'
      + '<a href="' + R + 'about-us/4-principals-message.html">Principal\'s Message</a>'
      + '<a href="' + R + 'about-us/5-pta-executive-body.html">PTA Executive Body</a>'
      + '<a href="' + R + 'about-us/6-cbse-details.html">CBSE Details</a>'
      + '<a href="' + R + 'about-us/7-annual-report.html">Annual Report</a>'
      + '</div></div>'

      + '<div class="lcs-nav-item"><a href="' + R + 'admissions/1-admissions.html">Admissions <span class="arrow">&#9660;</span></a>'
      + '<div class="lcs-dropdown">'
      + '<a href="' + R + 'admissions/1-admissions.html">Admissions Overview</a>'
      + '<a href="' + R + 'admissions/2-admission-enquiry.html">Admission Enquiry</a>'
      + '<a href="' + R + 'admissions/3-transfer-certificate.html">Transfer Certificate</a>'
      + '<a href="' + R + 'admissions/4-fee-structure.html">Fee Structure</a>'
      + '</div></div>'

      + '<div class="lcs-nav-item"><a href="' + R + 'academics/index.html">Academics <span class="arrow">&#9660;</span></a>'
      + '<div class="lcs-dropdown">'
      + '<a href="' + R + 'academics/index.html">Academics Overview</a>'
      + '<a href="' + R + 'academics/1-faculty.html">Faculty</a>'
      + '<a href="' + R + 'academics/2-former-heads.html">Former Heads</a>'
      + '<a href="' + R + 'academics/3-cbse-circulars.html">CBSE Circulars</a>'
      + '<a href="' + R + 'academics/4-school-circulars.html">School Circulars</a>'
      + '<a href="' + R + 'academics/5-book-list.html">Book List 2024&#8211;25</a>'
      + '</div></div>'

      + '<div class="lcs-nav-item"><a href="#">School Info <span class="arrow">&#9660;</span></a>'
      + '<div class="lcs-dropdown">'
      + '<a href="' + R + 'school-information/1-curriculum.html">Curriculum</a>'
      + '<a href="' + R + 'school-information/2-school-uniform.html">School Uniform</a>'
      + '<a href="' + R + 'school-information/3-school-calendar.html">School Calendar</a>'
      + '<a href="' + R + 'school-information/4-office-school-timings.html">Office &amp; School Timings</a>'
      + '<a href="' + R + 'school-information/5-provisions.html">Provisions</a>'
      + '<a href="' + R + 'school-information/6-facilities.html">Facilities</a>'
      + '<a href="' + R + 'school-information/7-prevention-sexual-harassment.html">Prevention of Harassment</a>'
      + '<a href="' + R + 'school-information/8-child-protection-policy.html">Child Protection Policy</a>'
      + '<a href="' + R + 'school-information/9-website-privacy-policy.html">Privacy Policy</a>'
      + '</div></div>'

      + '<div class="lcs-nav-item"><a href="#">Activities &amp; Clubs <span class="arrow">&#9660;</span></a>'
      + '<div class="lcs-dropdown" style="min-width:200px;">'
      + '<div class="lcs-has-flyout"><a href="#"> Activities <span class="lcs-flyout-arrow">&#9654;</span></a>'
      + '<div class="lcs-flyout-panel">'
      + '<a href="' + R + 'activities-and-clubs/1-western-dance.html">Western Dance</a>'
      + '<a href="' + R + 'activities-and-clubs/2-thinkers-space.html">Thinkers Space</a>'
      + '<a href="' + R + 'activities-and-clubs/3-classical-dance.html">Classical Dance</a>'
      + '<a href="' + R + 'activities-and-clubs/4-karate-class.html">Karate Class</a>'
      + '<a href="' + R + 'activities-and-clubs/5-chess-class.html">Chess Class</a>'
      + '</div></div>'
      + '<div class="lcs-has-flyout"><a href="#"> Clubs <span class="lcs-flyout-arrow">&#9654;</span></a>'
      + '<div class="lcs-flyout-panel">'
      + '<a href="' + R + 'activities-and-clubs/6-english-club.html">English Club</a>'
      + '<a href="' + R + 'activities-and-clubs/7-social-club.html">Social Club</a>'
      + '<a href="' + R + 'activities-and-clubs/8-eco-club.html">Eco Club</a>'
      + '<a href="' + R + 'activities-and-clubs/9-kannada-club.html">Kannada Club</a>'
      + '<a href="' + R + 'activities-and-clubs/10-maths-club.html">Maths Club</a>'
      + '<a href="' + R + 'activities-and-clubs/11-science-club.html">Science Club</a>'
      + '<a href="' + R + 'activities-and-clubs/12-hindi-club.html">Hindi Club</a>'
      + '</div></div></div></div>'

      + '<div class="lcs-nav-item"><a href="' + R + 'news.html">News &amp; Events</a></div>'
      + '<div class="lcs-nav-item"><a href="' + R + 'e-magazine.html">E-Magazine</a></div>'

      + '<div class="lcs-nav-item"><a href="' + R + 'mandatory-disclosure.html">Disclosure</a></div>'

      + '<div class="lcs-nav-item"><a href="' + R + 'contact.html">Contact Us</a></div>'

      + '</nav></div></header>'

      + '<div id="lcs-notice-bar"><div class="lcs-container"><div class="lcs-notice-inner">'
      + '<span class="lcs-notice-label"> NOTICE</span>'
      + '<div class="lcs-ticker-wrap"><div class="lcs-ticker">'
      + DEFAULT_NOTICE_TEXT
      + '</div></div></div></div></div>';
  }

  /* ── 4. MOBILE DRAWER ── */
  function buildMobile() {
    var ITEMS = [
      ['Home', R + 'index.html', []],
      ['About Us', '#', [
        ['School Profile', R + 'about-us/1-school-profile.html'],
        ['Management', R + 'about-us/2-management.html'],
        ['Manager Speaks', R + 'about-us/3-manager-speaks.html'],
        ["Principal's Message", R + 'about-us/4-principals-message.html'],
        ['PTA Executive Body', R + 'about-us/5-pta-executive-body.html'],
        ['CBSE Details', R + 'about-us/6-cbse-details.html'],
        ['Annual Report', R + 'about-us/7-annual-report.html'],
      ]],
      ['Admissions', R + 'admissions/1-admissions.html', [
        ['Admissions Overview', R + 'admissions/1-admissions.html'],
        ['Admission Enquiry', R + 'admissions/2-admission-enquiry.html'],
        ['Transfer Certificate', R + 'admissions/3-transfer-certificate.html'],
        ['Fee Structure', R + 'admissions/4-fee-structure.html'],
      ]],
      ['Academics', R + 'academics/index.html', [
        ['Academics Overview', R + 'academics/index.html'],
        ['Faculty', R + 'academics/1-faculty.html'],
        ['Former Heads', R + 'academics/2-former-heads.html'],
        ['CBSE Circulars', R + 'academics/3-cbse-circulars.html'],
        ['School Circulars', R + 'academics/4-school-circulars.html'],
        ['Book List 2024–25', R + 'academics/5-book-list.html'],
      ]],
      ['School Information', '#', [
        ['Curriculum', R + 'school-information/1-curriculum.html'],
        ['School Uniform', R + 'school-information/2-school-uniform.html'],
        ['School Calendar', R + 'school-information/3-school-calendar.html'],
        ['Timings', R + 'school-information/4-office-school-timings.html'],
        ['Provisions', R + 'school-information/5-provisions.html'],
        ['Facilities', R + 'school-information/6-facilities.html'],
        ['Prevention of Harassment', R + 'school-information/7-prevention-sexual-harassment.html'],
        ['Child Protection Policy', R + 'school-information/8-child-protection-policy.html'],
        ['Privacy Policy', R + 'school-information/9-website-privacy-policy.html'],
      ]],
      ['Activities & Clubs', '#', [
        ['Western Dance', R + 'activities-and-clubs/1-western-dance.html'],
        ['Thinkers Space', R + 'activities-and-clubs/2-thinkers-space.html'],
        ['Classical Dance', R + 'activities-and-clubs/3-classical-dance.html'],
        ['Karate Class', R + 'activities-and-clubs/4-karate-class.html'],
        ['Chess Class', R + 'activities-and-clubs/5-chess-class.html'],
        ['English Club', R + 'activities-and-clubs/6-english-club.html'],
        ['Social Club', R + 'activities-and-clubs/7-social-club.html'],
        ['Eco Club', R + 'activities-and-clubs/8-eco-club.html'],
        ['Kannada Club', R + 'activities-and-clubs/9-kannada-club.html'],
        ['Maths Club', R + 'activities-and-clubs/10-maths-club.html'],
        ['Science Club', R + 'activities-and-clubs/11-science-club.html'],
        ['Hindi Club', R + 'activities-and-clubs/12-hindi-club.html'],
      ]],
      ['News & Events', R + 'news.html', []],
      ['E-Magazine', R + 'e-magazine.html', []],
      ['Mandatory Disclosure', R + 'mandatory-disclosure.html', []],
      ['Contact Us', R + 'contact.html', []],
    ];

    var h = '<div id="lcs-mob-overlay"></div><div id="lcs-mob-nav">'
      + '<button class="lcs-mob-close" id="lcsMobClose">&#10005;&nbsp; Close Menu</button>'
      + '<div class="lcs-mob-school"><img src="' + R + 'logo.png" alt="Logo"/>'
      + '<div><div class="lcs-mob-school-name">Loretto Central School</div>'
      + '<div class="lcs-mob-school-tag">Love through service</div>'
      + '<div class="lcs-mob-school-aff">Affiliated to CBSE New Delhi: 831368</div></div></div>';

    ITEMS.forEach(function (item, i) {
      var hasSub = item[2].length > 0;
      h += '<a class="lcs-mob-nav-link" href="' + (hasSub ? '#' : item[1]) + '" '
        + (hasSub ? 'data-mob-toggle="lmob' + i + '"' : '') + '>'
        + item[0] + (hasSub ? ' <span class="mob-arrow">&#9658;</span>' : '') + '</a>';
      if (hasSub) {
        h += '<div class="lcs-mob-submenu" id="lmob' + i + '">';
        item[2].forEach(function (s) { h += '<a href="' + s[1] + '">' + s[0] + '</a>'; });
        h += '</div>';
      }
    });

    h += '<div class="lcs-mob-login-wrap">'
      + '<a href="' + R + 'login/parent-login.html" class="lcs-mob-login-btn"> Parent Login</a>'
      + '</div></div>';
    return h;
  }

  /* ── 5. SEARCH DATA ── */
  var PAGES = [
    { c: 'About Us', t: 'School Profile', u: R + 'about-us/1-school-profile.html' },
    { c: 'About Us', t: 'Management', u: R + 'about-us/2-management.html' },
    { c: 'About Us', t: 'Manager Speaks', u: R + 'about-us/3-manager-speaks.html' },
    { c: 'About Us', t: "Principal's Message", u: R + 'about-us/4-principals-message.html' },
    { c: 'About Us', t: 'PTA Executive Body', u: R + 'about-us/5-pta-executive-body.html' },
    { c: 'About Us', t: 'CBSE Details', u: R + 'about-us/6-cbse-details.html' },
    { c: 'About Us', t: 'Annual Report', u: R + 'about-us/7-annual-report.html' },
    { c: 'Admissions', t: 'Admissions Overview', u: R + 'admissions/1-admissions.html' },
    { c: 'Admissions', t: 'Admission Enquiry', u: R + 'admissions/2-admission-enquiry.html' },
    { c: 'Admissions', t: 'Transfer Certificate', u: R + 'admissions/3-transfer-certificate.html' },
    { c: 'Admissions', t: 'Fee Structure', u: R + 'admissions/4-fee-structure.html' },
    { c: 'Academics', t: 'Academics Overview', u: R + 'academics/index.html' },
    { c: 'Academics', t: 'Faculty', u: R + 'academics/1-faculty.html' },
    { c: 'Academics', t: 'Former Heads', u: R + 'academics/2-former-heads.html' },
    { c: 'Academics', t: 'CBSE Circulars', u: R + 'academics/3-cbse-circulars.html' },
    { c: 'Academics', t: 'School Circulars', u: R + 'academics/4-school-circulars.html' },
    { c: 'Academics', t: 'Book List', u: R + 'academics/5-book-list.html' },
    { c: 'School Info', t: 'Curriculum', u: R + 'school-information/1-curriculum.html' },
    { c: 'School Info', t: 'School Uniform', u: R + 'school-information/2-school-uniform.html' },
    { c: 'School Info', t: 'School Calendar', u: R + 'school-information/3-school-calendar.html' },
    { c: 'School Info', t: 'Timings', u: R + 'school-information/4-office-school-timings.html' },
    { c: 'School Info', t: 'Facilities', u: R + 'school-information/6-facilities.html' },
    { c: 'Activities', t: 'Western Dance', u: R + 'activities-and-clubs/1-western-dance.html' },
    { c: 'Activities', t: 'Classical Dance', u: R + 'activities-and-clubs/3-classical-dance.html' },
    { c: 'Activities', t: 'Karate / Chess', u: R + 'activities-and-clubs/4-karate-class.html' },
    { c: 'Clubs', t: 'English Club', u: R + 'activities-and-clubs/6-english-club.html' },
    { c: 'Clubs', t: 'Eco Club', u: R + 'activities-and-clubs/8-eco-club.html' },
    { c: 'Clubs', t: 'Maths Club', u: R + 'activities-and-clubs/10-maths-club.html' },
    { c: 'Clubs', t: 'Science Club', u: R + 'activities-and-clubs/11-science-club.html' },
    { c: 'Clubs', t: 'Hindi Club', u: R + 'activities-and-clubs/12-hindi-club.html' },
    { c: 'News', t: 'News & Events', u: R + 'news.html' },
    { c: 'Magazine', t: 'E-Magazine', u: R + 'e-magazine.html' },
    { c: 'Contact', t: 'Contact Us', u: R + 'contact.html' },
    { c: 'Portal', t: 'Parent Login', u: R + 'login/parent-login.html' },
  ];

  /* ── 6. INJECT ── */
  function inject() {
    ensureViewportMeta();
    if (document.getElementById('lcs-top-bar')) return;
    if (!document.getElementById('lcs-navbar-styles')) {
      document.head.insertAdjacentHTML('beforeend', CSS);
    }
    injectResponsiveFixes();
    document.body.insertAdjacentHTML('afterbegin', buildNav());
    document.body.insertAdjacentHTML('beforeend', buildMobile());
    var hi = document.querySelector('.lcs-header-inner');
    if (hi) {
      hi.insertAdjacentHTML('beforeend',
        '<button class="lcs-mob-btn" id="lcsMobBtn" aria-label="Open menu"><span></span><span></span><span></span></button>'
      );
    }
  }

  /* ── 7. INTERACTIONS ── */
  function initInteractions() {
    /* Active link */
    var path = window.location.pathname.replace(/\/+$/, '');
    document.querySelectorAll('#lcs-nav .lcs-nav-item > a').forEach(function (a) {
      var href = (a.getAttribute('href') || '');
      if (href === '#' || href.length < 2) return;
      var norm = href.replace(/^(\.\.\/)*/, '').replace(/^\.\//, '');
      if (norm.length > 1 && path.indexOf(norm) > -1) a.classList.add('active');
    });

    /* Scroll shadow */
    var hdr = document.getElementById('lcs-header');
    if (hdr) {
      window.addEventListener('scroll', function () {
        hdr.classList.toggle('scrolled', window.scrollY > 8);
      }, { passive: true });
    }

    /* Flyout click-toggle */
    document.querySelectorAll('.lcs-has-flyout > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var item = this.closest('.lcs-has-flyout');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.lcs-has-flyout.open').forEach(function (el) { el.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lcs-has-flyout')) {
        document.querySelectorAll('.lcs-has-flyout.open').forEach(function (el) { el.classList.remove('open'); });
      }
    });
    document.querySelectorAll('.lcs-nav-item').forEach(function (item) {
      item.addEventListener('mouseleave', function () {
        item.querySelectorAll('.lcs-has-flyout.open').forEach(function (el) { el.classList.remove('open'); });
      });
    });

    /* Search */
    var toggle = document.getElementById('lcsToggle');
    var box = document.getElementById('lcsBox');
    var inp = document.getElementById('lcsInput');
    var clr = document.getElementById('lcsClear');
    var res = document.getElementById('lcsResults');
    if (toggle && box && inp && res) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (box.classList.contains('open')) {
          box.classList.remove('open'); res.classList.remove('show'); inp.value = ''; clr.classList.remove('show');
        } else {
          box.classList.add('open'); setTimeout(function () { inp.focus(); }, 60);
        }
      });
      inp.addEventListener('input', function () {
        var q = this.value.trim().toLowerCase();
        clr.classList.toggle('show', q.length > 0);
        if (!q) { res.classList.remove('show'); res.innerHTML = ''; return; }
        var m = PAGES.filter(function (p) { return p.t.toLowerCase().indexOf(q) > -1 || p.c.toLowerCase().indexOf(q) > -1; });
        res.innerHTML = m.length
          ? m.map(function (p) { return '<a class="lcs-res-item" href="' + p.u + '"><div class="lcs-res-cat">' + p.c + '</div><div class="lcs-res-title">' + p.t + '</div></a>'; }).join('')
          : '<div style="padding:14px 16px;color:#888;font-size:.85rem;">No results.</div>';
        res.classList.add('show');
      });
      clr.addEventListener('click', function () { inp.value = ''; res.innerHTML = ''; res.classList.remove('show'); clr.classList.remove('show'); inp.focus(); });
      document.addEventListener('click', function (e) { if (!e.target.closest('.lcs-search')) res.classList.remove('show'); });
    }

    /* Mobile drawer */
    var mobBtn = document.getElementById('lcsMobBtn');
    var mobNav = document.getElementById('lcs-mob-nav');
    var mobOverlay = document.getElementById('lcs-mob-overlay');
    var mobClose = document.getElementById('lcsMobClose');
    function openMob() { mobNav.classList.add('open'); mobOverlay.classList.add('open'); mobBtn && mobBtn.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeMob() { mobNav.classList.remove('open'); mobOverlay.classList.remove('open'); mobBtn && mobBtn.classList.remove('open'); document.body.style.overflow = ''; }
    if (mobBtn) mobBtn.addEventListener('click', openMob);
    if (mobClose) mobClose.addEventListener('click', closeMob);
    if (mobOverlay) mobOverlay.addEventListener('click', closeMob);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobNav && mobNav.classList.contains('open')) closeMob(); });

    /* Mobile accordion */
    document.querySelectorAll('[data-mob-toggle]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var sub = document.getElementById(this.getAttribute('data-mob-toggle'));
        if (!sub) return;
        var wasOpen = sub.classList.contains('open');
        document.querySelectorAll('.lcs-mob-submenu.open').forEach(function (el) { el.classList.remove('open'); });
        document.querySelectorAll('.lcs-mob-nav-link.expanded').forEach(function (el) { el.classList.remove('expanded'); });
        if (!wasOpen) { sub.classList.add('open'); this.classList.add('expanded'); }
      });
    });
  }

  /* ── 8. BOOT ── */
  function boot() {
    inject();
    initInteractions();
    syncSiteSettings();
    syncSharedBanner();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.LCSNavbar = { init: boot, prefix: R };
})();
