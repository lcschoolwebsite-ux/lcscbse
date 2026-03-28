// ============================================================
//  Loretto Central School — ADMIN Navbar  v3.0
//  Save at:  admin/AdminNavbar.js
//  Include:  <script src="AdminNavbar.js"></script>
//
//  All completed admin pages (v3):
//    admin-panel.html            — Dashboard / Homepage
//    adminschool-profile.html    — About Us  (note: NO hyphen in "adminschool")
//    admin-academics.html        — Academics
//    admin-admissions.html       — Admissions
//    admin-schoolinfo.html       — School Info (9 tabs)
//    admin-activities.html       — Activities & Clubs (12 pages)
//    admin-news.html             — News & Events
//    admin-magazine.html         — E-Magazine
//    admin-disclosure.html       — Mandatory Disclosure (23 documents)
//    admin-contact.html          — Contact Us (inbox + page + email)
// ============================================================
(function () {
  'use strict';

  var A = './';

  /* ─────────────────────────────────────────────────────────
     CSS
  ───────────────────────────────────────────────────────── */
  var CSS = [
    '<style id="lcs-admin-navbar-styles">',
    ':root{--navy:#0e6b6b;--navy-dark:#094f4f;--navy-deep:#062f2f;--gold:#c8960c;--gold-light:#e8b020;--gold-pale:#f5e6c0;--white:#fff;--text:#1a2e2e;--text-muted:#5a6e6e;--border:#e2d5b0;}',
    '*,*::before,*::after{box-sizing:border-box;}',
    'html{scroll-behavior:smooth;}',
    'body{font-family:\'Nunito\',sans-serif;color:var(--text);background:var(--white);overflow-x:hidden;margin:0;}',
    '.lcs-container{max-width:1280px;margin:0 auto;padding:0 28px;}',
    /* top bar */
    '#lcs-top-bar{background:linear-gradient(135deg,var(--navy-deep) 0%,var(--navy-dark) 100%);color:rgba(255,255,255,.85);font-size:.78rem;border-bottom:1px solid rgba(200,150,12,.25);}',
    '.lcs-top-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;gap:14px;}',
    /* brand */
    'a.lcs-brand{display:flex;align-items:center;gap:14px;text-decoration:none;flex-shrink:0;}',
    '.lcs-brand .tb-logo{width:66px;height:66px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);flex-shrink:0;box-shadow:0 0 0 3px rgba(200,150,12,.2),0 4px 16px rgba(0,0,0,.3);}',
    '.lcs-brand .tb-text{text-align:left;}',
    '.lcs-brand .tb-name{font-family:\'Playfair Display\',serif;font-size:1.45rem;font-weight:700;color:#fff;line-height:1.2;}',
    '.lcs-brand .tb-tagline{font-size:.66rem;color:var(--gold-light);font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-top:3px;}',
    /* admin badge */
    '.lcs-admin-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(200,150,12,.14);border:1.5px solid rgba(200,150,12,.5);color:var(--gold-light);font-size:.6rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:5px 13px;border-radius:20px;flex-shrink:0;}',
    '.lcs-admin-dot{width:7px;height:7px;border-radius:50%;background:var(--gold-light);flex-shrink:0;animation:adminDotPulse 1.4s ease-in-out infinite;}',
    '@keyframes adminDotPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(.7);}}',
    /* top right */
    '.lcs-top-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}',
    '.lcs-viewsite-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.8)!important;text-decoration:none;font-family:\'Nunito\',sans-serif;font-size:.74rem;font-weight:700;padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,.18);transition:all .22s;white-space:nowrap;cursor:pointer;}',
    '.lcs-viewsite-btn:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.34);color:#fff!important;transform:translateY(-1px);}',
    '.lcs-saveall-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(14,107,107,.4);color:rgba(255,255,255,.88)!important;font-family:\'Nunito\',sans-serif;font-size:.74rem;font-weight:700;padding:8px 16px;border-radius:8px;border:1px solid rgba(14,107,107,.5);transition:all .22s;white-space:nowrap;cursor:pointer;}',
    '.lcs-saveall-btn:hover{background:rgba(14,107,107,.65);color:#fff!important;transform:translateY(-1px);}',
    '.lcs-logout-btn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy-deep)!important;font-family:\'Nunito\',sans-serif;font-size:.78rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:9px 20px;border-radius:8px;border:none;box-shadow:0 3px 10px rgba(200,150,12,.4);transition:transform .2s,box-shadow .2s;white-space:nowrap;cursor:pointer;}',
    '.lcs-logout-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(200,150,12,.55);}',
    '.lcs-top-divider{width:1px;height:22px;background:rgba(255,255,255,.12);flex-shrink:0;}',
    '.lcs-admin-user{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:5px 12px 5px 6px;cursor:pointer;transition:background .2s;}',
    '.lcs-admin-user:hover{background:rgba(255,255,255,.11);}',
    '.lcs-admin-avatar{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;color:var(--navy-deep);}',
    '.lcs-admin-username{font-size:.72rem;font-weight:700;color:rgba(255,255,255,.78);white-space:nowrap;}',
    /* search */
    '.lcs-search{position:relative;display:flex;align-items:center;}',
    '.lcs-search-toggle{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.7);padding:8px 9px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:color .2s,background .2s;}',
    '.lcs-search-toggle:hover{color:var(--gold-light);background:rgba(255,255,255,.1);}',
    '.lcs-search-box{display:flex;align-items:center;position:absolute;right:0;top:50%;transform:translateY(-50%);background:var(--navy-dark);border:1.5px solid rgba(200,150,12,.5);border-radius:22px;overflow:hidden;width:0;opacity:0;pointer-events:none;transition:width .35s cubic-bezier(.4,0,.2,1),opacity .25s;z-index:200;}',
    '.lcs-search-box.open{width:240px;opacity:1;pointer-events:all;}',
    '.lcs-search-input{background:transparent;border:none;outline:none;color:#fff;font-family:\'Nunito\',sans-serif;font-size:.82rem;padding:8px 30px 8px 14px;width:100%;}',
    '.lcs-search-input::placeholder{color:rgba(255,255,255,.4);}',
    '.lcs-search-clear{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.5);font-size:.75rem;padding:0 10px 0 0;flex-shrink:0;opacity:0;transition:opacity .2s;}',
    '.lcs-search-clear.show{opacity:1;}',
    '.lcs-search-results{position:absolute;top:calc(100% + 12px);right:0;width:320px;max-height:400px;overflow-y:auto;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.2);border:2px solid var(--gold);display:none;z-index:99999;}',
    '.lcs-search-results.show{display:block;}',
    '.lcs-res-item{padding:11px 16px;border-bottom:1px solid var(--border);text-decoration:none;display:block;transition:background .15s;}',
    '.lcs-res-item:last-child{border-bottom:none;}',
    '.lcs-res-item:hover{background:var(--gold-pale);}',
    '.lcs-res-cat{font-size:.62rem;color:var(--gold);text-transform:uppercase;font-weight:800;letter-spacing:.09em;}',
    '.lcs-res-title{font-weight:600;color:var(--navy);margin-top:2px;font-size:.86rem;}',
    /* shared admin UI fallbacks for stripped icons/buttons */
    '.ic:empty::before,.icon:empty::before{content:"•";display:inline-block;color:currentColor;opacity:.9;font-weight:800;}',
    '.modal-close:empty::before{content:"×";display:inline-block;font-size:1rem;font-weight:800;line-height:1;color:currentColor;}',
    'button.ab:empty::before{content:"E";display:inline-block;font-size:.62rem;font-weight:800;line-height:1;color:var(--navy-dark);}',
    'button.ab.del:empty::before{content:"×";font-size:.9rem;color:var(--red);}',
    'button.ab.pub:empty::before{content:"P";font-size:.6rem;color:var(--green);}',
    'a.ab:empty::before{content:"V";display:inline-block;font-size:.62rem;font-weight:800;line-height:1;color:var(--navy-dark);}',
    '.ab:empty,.modal-close:empty{color:inherit;}',
    /* header */
    '#lcs-header{background:var(--white);border-bottom:3px solid var(--gold);position:sticky;top:0;z-index:1000;transition:box-shadow .25s;}',
    '#lcs-header.scrolled{box-shadow:0 4px 22px rgba(0,0,0,.14);}',
    '.lcs-header-inner{display:flex;align-items:center;justify-content:center;padding:0;}',
    /* nav */
    '#lcs-nav{display:flex;align-items:center;gap:0;flex-wrap:wrap;width:100%;justify-content:center;max-width:1280px;margin:0 auto;padding:0 8px;}',
    '.lcs-nav-item{position:relative;display:flex;align-items:stretch;overflow:visible!important;}',
    '.lcs-nav-item>a{font-size:.86rem;font-weight:700;color:var(--navy);text-decoration:none;padding:16px 13px;white-space:nowrap;display:flex;align-items:center;gap:4px;border-radius:6px;background:transparent;transition:all .25s cubic-bezier(.4,0,.2,1);margin:2px 1px;}',
    '.lcs-nav-item>a .arrow{font-size:.5rem;opacity:.6;transition:transform .25s,opacity .25s;margin-left:2px;}',
    '.lcs-nav-item:hover>a{background:rgba(14,107,107,.1);color:var(--navy-dark);}',
    '.lcs-nav-item:hover>a .arrow{transform:rotate(180deg);opacity:1;}',
    '.lcs-nav-item>a.active{background:linear-gradient(135deg,var(--navy),var(--navy-dark));color:#fff!important;box-shadow:0 3px 10px rgba(14,107,107,.25);}',
    '.nav-ibadge{display:inline-flex;align-items:center;justify-content:center;font-size:.52rem;font-weight:800;min-width:16px;height:16px;border-radius:8px;padding:0 4px;margin-left:3px;}',
    '.nav-ibadge.green{background:#27ae60;color:#fff;}',
    '.nav-ibadge.gold{background:var(--gold);color:var(--navy-deep);}',
    /* dropdown */
    '.lcs-dropdown{display:none;position:absolute;top:100%;left:0;min-width:215px;background:var(--navy);box-shadow:0 8px 30px rgba(0,0,0,.22);z-index:9999;border-top:3px solid var(--gold);overflow:visible!important;border-radius:0 0 8px 8px;}',
    '.lcs-nav-item:hover .lcs-dropdown{display:block;}',
    '.lcs-dropdown a{display:block;padding:10px 18px;font-size:.78rem;font-weight:500;color:rgba(255,255,255,.88);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);transition:background .15s,color .15s,padding-left .15s;white-space:nowrap;}',
    '.lcs-dropdown a:last-child{border-bottom:none;}',
    '.lcs-dropdown a:hover{background:var(--gold);color:#fff;padding-left:24px;}',
    '.lcs-dd-heading{font-size:.58rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);padding:10px 18px 4px;pointer-events:none;}',
    /* flyout */
    '.lcs-has-flyout{position:relative;}',
    '.lcs-has-flyout>a{display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer;}',
    '.lcs-flyout-arrow{font-size:.52rem;margin-left:auto;opacity:.7;flex-shrink:0;transition:transform .2s;}',
    '.lcs-has-flyout.open>a .lcs-flyout-arrow{transform:rotate(90deg);}',
    '.lcs-flyout-panel{display:none;position:absolute;left:100%;top:-3px;min-width:240px;background:var(--navy-dark);border-top:3px solid var(--gold);border-left:2px solid rgba(200,150,12,.35);box-shadow:8px 8px 32px rgba(0,0,0,.3);z-index:10001;border-radius:0 8px 8px 0;}',
    '.lcs-has-flyout.open>.lcs-flyout-panel{display:block;}',
    '@media(hover:hover){.lcs-has-flyout:hover>.lcs-flyout-panel{display:block;}}',
    '.lcs-flyout-panel a{display:block;padding:10px 16px;font-size:.76rem;font-weight:500;color:rgba(255,255,255,.87);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);transition:background .15s,padding-left .15s,color .15s;white-space:nowrap;}',
    '.lcs-flyout-panel a:last-child{border-bottom:none;}',
    '.lcs-flyout-panel a:hover{background:var(--gold);color:#fff;padding-left:22px;}',
    '.lcs-dropdown .lcs-has-flyout>a{padding:10px 12px;background:rgba(255,255,255,.05);font-weight:700;font-size:.75rem;color:rgba(255,255,255,.92);letter-spacing:.02em;}',
    '.lcs-dropdown .lcs-has-flyout>a:hover,.lcs-dropdown .lcs-has-flyout.open>a{background:var(--gold);color:#fff;}',
    /* notice bar */
    '#lcs-notice-bar{background:var(--navy-deep);padding:8px 0;overflow:hidden;border-top:1px solid rgba(200,150,12,.2);}',
    '.lcs-notice-inner{display:flex;align-items:center;gap:0;overflow:hidden;}',
    '.lcs-notice-label{background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy-deep);font-weight:800;font-size:.72rem;padding:4px 14px;white-space:nowrap;letter-spacing:.08em;flex-shrink:0;border-radius:3px;}',
    '.lcs-ticker-wrap{flex:1;overflow:hidden;min-width:0;}',
    '.lcs-ticker{display:inline-block;color:rgba(255,255,255,.82);font-size:.8rem;white-space:nowrap;animation:lcsTicker 44s linear infinite;padding-left:20px;}',
    '@keyframes lcsTicker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}',
    /* mobile */
    '.lcs-mob-btn{display:none;background:none;border:2px solid var(--gold);border-radius:6px;padding:7px 10px;cursor:pointer;flex-direction:column;gap:5px;margin-left:auto;flex-shrink:0;}',
    '.lcs-mob-btn span{display:block;width:22px;height:2px;background:var(--navy);border-radius:2px;transition:all .3s;}',
    '.lcs-mob-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}',
    '.lcs-mob-btn.open span:nth-child(2){opacity:0;}',
    '.lcs-mob-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}',
    '#lcs-mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99998;backdrop-filter:blur(2px);}',
    '#lcs-mob-overlay.open{display:block;}',
    '#lcs-mob-nav{display:block;position:fixed;top:0;right:0;bottom:0;width:300px;max-width:92vw;background:var(--navy-dark);z-index:99999;overflow-y:auto;padding:0 0 30px;box-shadow:-10px 0 40px rgba(0,0,0,.35);transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1);}',
    '#lcs-mob-nav.open{transform:translateX(0);}',
    '.lcs-mob-close{background:rgba(255,255,255,.06);border:none;color:rgba(255,255,255,.8);font-size:1rem;cursor:pointer;padding:14px 20px;display:flex;align-items:center;gap:8px;width:100%;text-align:left;font-weight:700;border-bottom:1px solid rgba(255,255,255,.1);transition:background .15s;}',
    '.lcs-mob-close:hover{background:rgba(255,255,255,.12);}',
    '.lcs-mob-school{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.15);}',
    '.lcs-mob-school img{width:46px;height:46px;border-radius:50%;border:2px solid var(--gold);object-fit:cover;flex-shrink:0;}',
    '.lcs-mob-school-name{font-family:\'Playfair Display\',serif;font-size:.96rem;font-weight:700;color:#fff;line-height:1.3;}',
    '.lcs-mob-school-tag{font-size:.6rem;color:var(--gold-light);text-transform:uppercase;letter-spacing:.1em;margin-top:2px;}',
    '.lcs-mob-nav-link{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;color:rgba(255,255,255,.88);text-decoration:none;font-size:.87rem;font-weight:600;border-bottom:1px solid rgba(255,255,255,.05);transition:background .15s,color .15s;cursor:pointer;}',
    '.lcs-mob-nav-link:hover{background:rgba(255,255,255,.07);color:#fff;}',
    '.mob-arrow{font-size:.7rem;opacity:.6;transition:transform .2s;}',
    '.lcs-mob-nav-link.expanded .mob-arrow{transform:rotate(90deg);opacity:1;}',
    '.lcs-mob-submenu{display:none;background:rgba(0,0,0,.2);border-left:3px solid var(--gold);}',
    '.lcs-mob-submenu.open{display:block;}',
    '.lcs-mob-submenu a{display:block;padding:9px 20px 9px 28px;color:rgba(255,255,255,.72);text-decoration:none;font-size:.82rem;border-bottom:1px solid rgba(255,255,255,.04);transition:background .15s,color .15s;}',
    '.lcs-mob-submenu a:hover{background:rgba(255,255,255,.07);color:#fff;}',
    '.lcs-mob-section-label{font-size:.58rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);padding:14px 20px 4px;}',
    '.lcs-mob-action-wrap{padding:16px 20px;display:flex;flex-direction:column;gap:10px;margin-top:4px;}',
    '.lcs-mob-viewsite{display:block;text-align:center;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.82)!important;text-decoration:none;font-weight:700;font-size:.82rem;padding:11px 20px;border-radius:8px;}',
    '.lcs-mob-logout{display:block;text-align:center;width:100%;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy-deep)!important;border:none;cursor:pointer;font-family:\'Nunito\',sans-serif;font-weight:800;font-size:.85rem;letter-spacing:.04em;padding:13px 20px;border-radius:8px;box-shadow:0 3px 12px rgba(200,150,12,.4);}',
    /* responsive */
    '@media(max-width:1100px) and (min-width:769px){.lcs-brand .tb-name{font-size:1.2rem;}.lcs-brand .tb-logo{width:52px;height:52px;}#lcs-nav{padding:0 4px;}.lcs-nav-item>a{font-size:.76rem;padding:14px 8px;}.lcs-logout-btn{font-size:.7rem!important;padding:7px 12px!important;}.lcs-saveall-btn,.lcs-admin-user{display:none;}}',
    '@media(max-width:768px){.lcs-search,.lcs-saveall-btn,.lcs-admin-user,.lcs-admin-badge,.lcs-viewsite-btn,.lcs-logout-btn{display:none;}#lcs-nav{display:none!important;}.lcs-mob-btn{display:flex;}.lcs-header-inner{justify-content:space-between;padding:0 16px;}.lcs-top-row{flex-direction:column;padding:12px 0;gap:10px;align-items:center;}.lcs-top-right{justify-content:center;}}',
    '@media(max-width:480px){#lcs-mob-nav{width:100%;max-width:100%;}.lcs-brand .tb-name{font-size:1rem;}}',
    '</style>'
  ].join('');

  /* ─────────────────────────────────────────────────────────
     SEARCH INDEX — every admin page (v3, all links correct)
  ───────────────────────────────────────────────────────── */
  var PAGES = [
    {c:'Dashboard',  t:'Dashboard Overview',               u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'Hero / Banner Section',            u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'About Section',                    u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'Testimonials',                     u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'Gallery Section',                  u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'Stats & Counters',                 u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'Footer & Social Links',            u:A+'admin-panel.html'},
    {c:'Dashboard',  t:'SEO & Meta Tags',                  u:A+'admin-panel.html'},
    {c:'About Us',   t:'School Profile',                   u:A+'adminschool-profile.html'},
    {c:'About Us',   t:'Management',                       u:A+'adminschool-profile.html'},
    {c:'About Us',   t:'Manager Speaks',                   u:A+'adminschool-profile.html'},
    {c:'About Us',   t:"Principal's Message",              u:A+'adminschool-profile.html'},
    {c:'About Us',   t:'PTA Executive Body',               u:A+'adminschool-profile.html'},
    {c:'About Us',   t:'CBSE Affiliation Details',         u:A+'adminschool-profile.html'},
    {c:'About Us',   t:'Annual Report',                    u:A+'adminschool-profile.html'},
    {c:'Academics',  t:'Faculty',                          u:A+'admin-academics.html'},
    {c:'Academics',  t:'Former Heads of Institution',      u:A+'admin-academics.html'},
    {c:'Academics',  t:'CBSE Circulars',                   u:A+'admin-academics.html'},
    {c:'Academics',  t:'School Circulars',                 u:A+'admin-academics.html'},
    {c:'Academics',  t:'Book List',                        u:A+'admin-academics.html'},
    {c:'Admissions', t:'Admissions Overview',              u:A+'admin-admissions.html'},
    {c:'Admissions', t:'Admission Enquiries',              u:A+'admin-admissions.html'},
    {c:'Admissions', t:'Application Forms',                u:A+'admin-admissions.html'},
    {c:'Admissions', t:'Fee Structure',                    u:A+'admin-admissions.html'},
    {c:'Admissions', t:'Transfer Certificate Format',      u:A+'admin-admissions.html'},
    {c:'Admissions', t:'Admissions Page Settings',         u:A+'admin-admissions.html'},
    {c:'School Info',t:'Curriculum',                       u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'School Uniform',                   u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'School Calendar',                  u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'Office & School Timings',          u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'Provisions & Welfare',             u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'Facilities',                       u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'Prevention of Harassment',         u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'Child Protection Policy',          u:A+'admin-schoolinfo.html'},
    {c:'School Info',t:'Website Privacy Policy',           u:A+'admin-schoolinfo.html'},
    {c:'Activities', t:'Western Dance',                    u:A+'admin-activities.html'},
    {c:'Activities', t:'Thinkers Space',                   u:A+'admin-activities.html'},
    {c:'Activities', t:'Classical Dance',                  u:A+'admin-activities.html'},
    {c:'Activities', t:'Karate Class',                     u:A+'admin-activities.html'},
    {c:'Activities', t:'Chess Class',                      u:A+'admin-activities.html'},
    {c:'Clubs',      t:'English Club',                     u:A+'admin-activities.html'},
    {c:'Clubs',      t:'Social Club',                      u:A+'admin-activities.html'},
    {c:'Clubs',      t:'Eco Club',                         u:A+'admin-activities.html'},
    {c:'Clubs',      t:'Kannada Club',                     u:A+'admin-activities.html'},
    {c:'Clubs',      t:'Maths Club',                       u:A+'admin-activities.html'},
    {c:'Clubs',      t:'Science Club',                     u:A+'admin-activities.html'},
    {c:'Clubs',      t:'Hindi Club',                       u:A+'admin-activities.html'},
    {c:'News',       t:'News & Events',                    u:A+'admin-news.html'},
    {c:'News',       t:'Add / Edit News Article',          u:A+'admin-news.html'},
    {c:'Magazine',   t:'E-Magazine Issues',                u:A+'admin-magazine.html'},
    {c:'Magazine',   t:'Add E-Magazine Issue',             u:A+'admin-magazine.html'},
    {c:'Magazine',   t:'E-Magazine Page Settings',         u:A+'admin-magazine.html'},
    {c:'Disclosure', t:'Disclosure — Overview',            u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'School Name Change Order',         u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'CBSE Affiliation Letter',          u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'SARAS Mandatory Document',         u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Building Plan',                    u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Affidavit',                        u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Building Safety Certificate',      u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Land Certificate',                 u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Fire Safety Certificate',          u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'DEO Certificate',                  u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Recognition Renewal Certificate',  u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Mandatory Disclosure Link',        u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'No Objection Certificate',         u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Lease Deed Certificate',           u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Safe Drinking Water Certificate',  u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Society Registration Certificate', u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Water, Health & Sanitation',       u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Academic Calendar',                u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Management Committee',             u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'PTA Committee',                    u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'School Fee Structure',             u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'SSLC Board Exam Results',          u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'School Local Mgmt Committee',      u:A+'admin-disclosure.html'},
    {c:'Disclosure', t:'Teachers Information',             u:A+'admin-disclosure.html'},
    {c:'Contact',    t:'Contact Inbox',                    u:A+'admin-contact.html'},
    {c:'Contact',    t:'Contact Messages',                 u:A+'admin-contact.html'},
    {c:'Contact',    t:'Contact Page Content',             u:A+'admin-contact.html'},
    {c:'Contact',    t:'Email Settings (Resend)',          u:A+'admin-contact.html'},
    {c:'Contact',    t:'Google Maps Embed',                u:A+'admin-contact.html'},
    {c:'Contact',    t:'Contact Form Settings',            u:A+'admin-contact.html'},
  ];

  /* ─────────────────────────────────────────────────────────
     BUILD NAV
  ───────────────────────────────────────────────────────── */
  function dd(links) {
    return links.map(function(l){ return '<a href="'+l[0]+'">'+l[1]+'</a>'; }).join('');
  }
  function flyout(label, links) {
    return '<div class="lcs-has-flyout"><a href="#">'+label+' <span class="lcs-flyout-arrow">&#9654;</span></a>'
      + '<div class="lcs-flyout-panel">'+dd(links)+'</div></div>';
  }
  function navItem(href, label, dropdownHtml) {
    if (!dropdownHtml) return '<div class="lcs-nav-item"><a href="'+href+'">'+label+'</a></div>';
    return '<div class="lcs-nav-item"><a href="'+href+'">'+label+' <span class="arrow">&#9660;</span></a>'
      + '<div class="lcs-dropdown">'+dropdownHtml+'</div></div>';
  }

  function buildNav() {
    var nav = ''
      /* TOP BAR */
      + '<div id="lcs-top-bar"><div class="lcs-container"><div class="lcs-top-row">'
      + '<a class="lcs-brand" href="'+A+'admin-panel.html">'
      + '<img class="tb-logo" src="../logo.png" alt="Loretto Central School"/>'
      + '<div class="tb-text"><div class="tb-name">Loretto Central School</div>'
      + '<div class="tb-tagline"> Admin Control Panel</div></div></a>'
      + '<div class="lcs-admin-badge"><span class="lcs-admin-dot"></span>ADMIN MODE</div>'
      + '<div class="lcs-top-right">'
      + '<div class="lcs-search"><button class="lcs-search-toggle" id="lcsToggle" aria-label="Search">'
      + '<svg width="17" height="17" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.7"/><line x1="9.9" y1="9.9" x2="14" y2="14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
      + '</button><div class="lcs-search-box" id="lcsBox"><input class="lcs-search-input" id="lcsInput" type="text" placeholder="Search admin pages..." autocomplete="off"/><button class="lcs-search-clear" id="lcsClear">&#10005;</button></div>'
      + '<div class="lcs-search-results" id="lcsResults"></div></div>'
      + '<div class="lcs-top-divider"></div>'
      + '<div class="lcs-admin-user"><div class="lcs-admin-avatar">A</div><span class="lcs-admin-username">Administrator</span></div>'
      + '<a href="../index.html" target="_blank" class="lcs-viewsite-btn"> View Site</a>'
      + '<button class="lcs-saveall-btn" onclick="window.LCSAdminNav.triggerSave()"> Save All</button>'
      + '<div class="lcs-top-divider"></div>'
      + '<button class="lcs-logout-btn" onclick="window.LCSAdminNav.logout()"> Logout</button>'
      + '</div></div></div></div>'

      /* HEADER + NAV */
      + '<header id="lcs-header"><div class="lcs-header-inner"><nav id="lcs-nav">'

      + navItem(A+'admin-panel.html', ' Dashboard', '')

      + navItem(A+'adminschool-profile.html', 'About Us', dd([
          [A+'adminschool-profile.html', 'School Profile'],
          [A+'adminschool-profile.html', 'Management'],
          [A+'adminschool-profile.html', 'Manager Speaks'],
          [A+'adminschool-profile.html', "Principal's Message"],
          [A+'adminschool-profile.html', 'PTA Executive Body'],
          [A+'adminschool-profile.html', 'CBSE Affiliation'],
          [A+'adminschool-profile.html', 'Annual Report'],
        ]))

      + navItem(A+'admin-academics.html', 'Academics', dd([
          [A+'admin-academics.html', 'Faculty'],
          [A+'admin-academics.html', 'Former Heads'],
          [A+'admin-academics.html', 'CBSE Circulars'],
          [A+'admin-academics.html', 'School Circulars'],
          [A+'admin-academics.html', 'Book List'],
        ]))

      + navItem(A+'admin-admissions.html', 'Admissions', dd([
          [A+'admin-admissions.html', 'Overview'],
          [A+'admin-admissions.html', 'Admission Enquiries'],
          [A+'admin-admissions.html', 'Application Forms'],
          [A+'admin-admissions.html', 'Fee Structure'],
          [A+'admin-admissions.html', 'Transfer Certificate'],
          [A+'admin-admissions.html', 'Page Settings'],
        ]))

      + navItem(A+'admin-schoolinfo.html', 'School Info',
          '<div style="min-width:230px">'
          + dd([
            [A+'admin-schoolinfo.html', 'Curriculum'],
            [A+'admin-schoolinfo.html', 'School Uniform'],
            [A+'admin-schoolinfo.html', 'School Calendar'],
            [A+'admin-schoolinfo.html', 'Office &amp; School Timings'],
            [A+'admin-schoolinfo.html', 'Provisions'],
            [A+'admin-schoolinfo.html', 'Facilities'],
            [A+'admin-schoolinfo.html', 'Prevention of Harassment'],
            [A+'admin-schoolinfo.html', 'Child Protection Policy'],
            [A+'admin-schoolinfo.html', 'Privacy Policy'],
          ]) + '</div>')

      + navItem(A+'admin-activities.html', 'Activities &amp; Clubs',
          flyout(' Activities', [
            [A+'admin-activities.html', 'Western Dance'],
            [A+'admin-activities.html', 'Thinkers Space'],
            [A+'admin-activities.html', 'Classical Dance'],
            [A+'admin-activities.html', 'Karate Class'],
            [A+'admin-activities.html', 'Chess Class'],
          ])
          + flyout(' Clubs', [
            [A+'admin-activities.html', 'English Club'],
            [A+'admin-activities.html', 'Social Club'],
            [A+'admin-activities.html', 'Eco Club'],
            [A+'admin-activities.html', 'Kannada Club'],
            [A+'admin-activities.html', 'Maths Club'],
            [A+'admin-activities.html', 'Science Club'],
            [A+'admin-activities.html', 'Hindi Club'],
          ]))

      + '<div class="lcs-nav-item"><a href="'+A+'admin-news.html">News &amp; Events <span class="nav-ibadge green">NEW</span></a></div>'
      + navItem(A+'admin-magazine.html', 'E-Magazine', '')

      + navItem(A+'admin-disclosure.html', 'Disclosure', '')

      + navItem(A+'admin-contact.html', 'Contact Us', '')

      + '</nav></div></header>'

      /* NOTICE BAR */
      + '<div id="lcs-notice-bar"><div class="lcs-container"><div class="lcs-notice-inner">'
      + '<span class="lcs-notice-label"> ADMIN</span>'
      + '<div class="lcs-ticker-wrap"><div class="lcs-ticker">'
      + ' Admin Mode Active — changes apply to the live site'
      + ' &nbsp;&#183;&nbsp;  Ctrl+S to save &nbsp;&#183;&nbsp;  View Site to preview'
      + ' &nbsp;&#183;&nbsp;  Contact inbox: admin-contact.html'
      + ' &nbsp;&#183;&nbsp;  News: admin-news.html &nbsp;&#183;&nbsp;  Save before closing'
      + '</div></div></div></div></div>';

    return nav;
  }

  /* ─────────────────────────────────────────────────────────
     MOBILE DRAWER
  ───────────────────────────────────────────────────────── */
  function buildMobile() {
    var ITEMS = [
      ['Dashboard',            A+'admin-panel.html',          [
        ['Hero / Banner',            A+'admin-panel.html'],
        ['About Section',            A+'admin-panel.html'],
        ['Why Choose Us',            A+'admin-panel.html'],
        ['Stats & Counters',         A+'admin-panel.html'],
        ['Testimonials',             A+'admin-panel.html'],
        ['Gallery',                  A+'admin-panel.html'],
        ['Admissions CTA',           A+'admin-panel.html'],
        ['Footer & Social',          A+'admin-panel.html'],
        ['SEO & Meta',               A+'admin-panel.html'],
      ]],
      ['About Us',             A+'adminschool-profile.html',  [
        ['School Profile',           A+'adminschool-profile.html'],
        ['Management',               A+'adminschool-profile.html'],
        ['Manager Speaks',           A+'adminschool-profile.html'],
        ["Principal's Message",      A+'adminschool-profile.html'],
        ['PTA Executive Body',       A+'adminschool-profile.html'],
        ['CBSE Affiliation',         A+'adminschool-profile.html'],
        ['Annual Report',            A+'adminschool-profile.html'],
      ]],
      ['Academics',            A+'admin-academics.html',      [
        ['Faculty',                  A+'admin-academics.html'],
        ['Former Heads',             A+'admin-academics.html'],
        ['CBSE Circulars',           A+'admin-academics.html'],
        ['School Circulars',         A+'admin-academics.html'],
        ['Book List',                A+'admin-academics.html'],
      ]],
      ['Admissions',           A+'admin-admissions.html',     [
        ['Overview',                 A+'admin-admissions.html'],
        ['Admission Enquiries',      A+'admin-admissions.html'],
        ['Application Forms',        A+'admin-admissions.html'],
        ['Fee Structure',            A+'admin-admissions.html'],
        ['Transfer Certificate',     A+'admin-admissions.html'],
        ['Page Settings',            A+'admin-admissions.html'],
      ]],
      ['School Info',          A+'admin-schoolinfo.html',     [
        ['Curriculum',               A+'admin-schoolinfo.html'],
        ['School Uniform',           A+'admin-schoolinfo.html'],
        ['School Calendar',          A+'admin-schoolinfo.html'],
        ['Office & Timings',         A+'admin-schoolinfo.html'],
        ['Provisions',               A+'admin-schoolinfo.html'],
        ['Facilities',               A+'admin-schoolinfo.html'],
        ['Prevention of Harassment', A+'admin-schoolinfo.html'],
        ['Child Protection Policy',  A+'admin-schoolinfo.html'],
        ['Privacy Policy',           A+'admin-schoolinfo.html'],
      ]],
      ['Activities & Clubs',   A+'admin-activities.html',     [
        ['Western Dance',            A+'admin-activities.html'],
        ['Thinkers Space',           A+'admin-activities.html'],
        ['Classical Dance',          A+'admin-activities.html'],
        ['Karate Class',             A+'admin-activities.html'],
        ['Chess Class',              A+'admin-activities.html'],
        ['English Club',             A+'admin-activities.html'],
        ['Social Club',              A+'admin-activities.html'],
        ['Eco Club',                 A+'admin-activities.html'],
        ['Kannada Club',             A+'admin-activities.html'],
        ['Maths Club',               A+'admin-activities.html'],
        ['Science Club',             A+'admin-activities.html'],
        ['Hindi Club',               A+'admin-activities.html'],
      ]],
      ['News & Events',        A+'admin-news.html',           []],
      ['E-Magazine',           A+'admin-magazine.html',       []],
      ['Mandatory Disclosure', A+'admin-disclosure.html',     [
        ['School Name Change Order', A+'admin-disclosure.html'],
        ['Affiliation Letter',       A+'admin-disclosure.html'],
        ['SARAS Document',           A+'admin-disclosure.html'],
        ['Building Plan',            A+'admin-disclosure.html'],
        ['Affidavit',                A+'admin-disclosure.html'],
        ['Building Safety',          A+'admin-disclosure.html'],
        ['Land Certificate',         A+'admin-disclosure.html'],
        ['Fire Safety',              A+'admin-disclosure.html'],
        ['DEO Certificate',          A+'admin-disclosure.html'],
        ['Recognition Renewal',      A+'admin-disclosure.html'],
        ['Disclosure Link',          A+'admin-disclosure.html'],
        ['No Objection Cert.',       A+'admin-disclosure.html'],
        ['Lease Deed',               A+'admin-disclosure.html'],
        ['Safe Drinking Water',      A+'admin-disclosure.html'],
        ['Society Registration',     A+'admin-disclosure.html'],
        ['Water & Sanitation',       A+'admin-disclosure.html'],
        ['Academic Calendar',        A+'admin-disclosure.html'],
        ['Management Committee',     A+'admin-disclosure.html'],
        ['PTA Committee',            A+'admin-disclosure.html'],
        ['School Fee Structure',     A+'admin-disclosure.html'],
        ['SSLC Results',             A+'admin-disclosure.html'],
        ['Local Mgmt Committee',     A+'admin-disclosure.html'],
        ['Teachers Information',     A+'admin-disclosure.html'],
      ]],
      ['Contact Us',           A+'admin-contact.html',        [
        ['Contact Inbox',            A+'admin-contact.html'],
        ['Page Content',             A+'admin-contact.html'],
        ['Email Settings',           A+'admin-contact.html'],
      ]],
    ];

    var h = '<div id="lcs-mob-overlay"></div><div id="lcs-mob-nav">'
      + '<button class="lcs-mob-close" id="lcsMobClose">&#10005;&nbsp; Close Menu</button>'
      + '<div class="lcs-mob-school">'
      + '<img src="../logo.png" alt="Logo"/>'
      + '<div><div class="lcs-mob-school-name">Loretto Admin</div>'
      + '<div class="lcs-mob-school-tag"> Admin Mode Active</div></div></div>'
      + '<div class="lcs-mob-section-label">Navigation</div>';

    ITEMS.forEach(function (item, i) {
      var hasSub = item[2].length > 0;
      h += '<a class="lcs-mob-nav-link" href="' + (hasSub ? '#' : item[1]) + '" '
        + (hasSub ? 'data-mob-toggle="lmob' + i + '"' : '') + '>'
        + item[0] + (hasSub ? ' <span class="mob-arrow">&#9658;</span>' : '')
        + '</a>';
      if (hasSub) {
        h += '<div class="lcs-mob-submenu" id="lmob' + i + '">';
        item[2].forEach(function (s) { h += '<a href="' + s[1] + '">' + s[0] + '</a>'; });
        h += '</div>';
      }
    });

    h += '<div class="lcs-mob-action-wrap">'
      + '<a href="../index.html" target="_blank" class="lcs-mob-viewsite"> View Live Site</a>'
      + '<button class="lcs-mob-logout" onclick="window.LCSAdminNav.logout()"> Logout</button>'
      + '</div></div>';

    return h;
  }

  /* ─────────────────────────────────────────────────────────
     INJECT
  ───────────────────────────────────────────────────────── */
  function inject() {
    if (document.getElementById('lcs-top-bar')) return;
    if (!document.getElementById('lcs-admin-navbar-styles')) {
      document.head.insertAdjacentHTML('beforeend', CSS);
    }
    document.body.insertAdjacentHTML('afterbegin', buildNav());
    document.body.insertAdjacentHTML('beforeend', buildMobile());
    var hi = document.querySelector('.lcs-header-inner');
    if (hi) {
      hi.insertAdjacentHTML('beforeend',
        '<button class="lcs-mob-btn" id="lcsMobBtn" aria-label="Open menu">'
        + '<span></span><span></span><span></span></button>');
    }
  }

  /* ─────────────────────────────────────────────────────────
     INTERACTIONS
  ───────────────────────────────────────────────────────── */
  function initInteractions() {

    /* Active nav link */
    var cur = window.location.pathname.split('/').pop() || 'admin-panel.html';
    document.querySelectorAll('#lcs-nav .lcs-nav-item > a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === '#' || href.length < 2) return;
      if (href.split('/').pop().split('#')[0] === cur) a.classList.add('active');
    });

    /* Scroll shadow */
    var hdr = document.getElementById('lcs-header');
    if (hdr) window.addEventListener('scroll', function () {
      hdr.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

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
      if (!e.target.closest('.lcs-has-flyout'))
        document.querySelectorAll('.lcs-has-flyout.open').forEach(function (el) { el.classList.remove('open'); });
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
          ? m.slice(0, 12).map(function (p) {
              return '<a class="lcs-res-item" href="' + p.u + '"><div class="lcs-res-cat">' + p.c + '</div><div class="lcs-res-title">' + p.t + '</div></a>';
            }).join('')
          : '<div style="padding:14px 16px;color:#888;font-size:.85rem;">No results found.</div>';
        res.classList.add('show');
      });
      clr.addEventListener('click', function () {
        inp.value = ''; res.innerHTML = ''; res.classList.remove('show'); clr.classList.remove('show'); inp.focus();
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.lcs-search')) res.classList.remove('show');
      });
    }

    /* Mobile drawer */
    var mobBtn = document.getElementById('lcsMobBtn');
    var mobNav = document.getElementById('lcs-mob-nav');
    var mobOv  = document.getElementById('lcs-mob-overlay');
    var mobCl  = document.getElementById('lcsMobClose');
    function openMob()  { mobNav.classList.add('open'); mobOv.classList.add('open'); mobBtn && mobBtn.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeMob() { mobNav.classList.remove('open'); mobOv.classList.remove('open'); mobBtn && mobBtn.classList.remove('open'); document.body.style.overflow = ''; }
    if (mobBtn) mobBtn.addEventListener('click', openMob);
    if (mobCl)  mobCl.addEventListener('click', closeMob);
    if (mobOv)  mobOv.addEventListener('click', closeMob);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobNav && mobNav.classList.contains('open')) closeMob();
    });

    /* Mobile accordion */
    document.querySelectorAll('[data-mob-toggle]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var sub = document.getElementById(this.getAttribute('data-mob-toggle')); if (!sub) return;
        var wasOpen = sub.classList.contains('open');
        document.querySelectorAll('.lcs-mob-submenu.open').forEach(function (el) { el.classList.remove('open'); });
        document.querySelectorAll('.lcs-mob-nav-link.expanded').forEach(function (el) { el.classList.remove('expanded'); });
        if (!wasOpen) { sub.classList.add('open'); this.classList.add('expanded'); }
      });
    });

    /* Ctrl+S */
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); window.LCSAdminNav && window.LCSAdminNav.triggerSave(); }
    });
  }

  /* ─────────────────────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────────────────────── */
  window.LCSAdminNav = {
    triggerSave: function () {
      var t = document.getElementById('toast') || document.getElementById('saveToast');
      if (t) { var prev = t.textContent; t.textContent = ' Saved!'; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); t.textContent = prev; }, 2400); }
      document.dispatchEvent(new CustomEvent('lcs-admin-save'));
    },
    logout: function () {
      if (!confirm('Log out of the admin panel?')) return;
      if (window.AdminAuth) {
        window.AdminAuth.logout();
        return;
      }
      localStorage.removeItem('lorettoAdminToken');
      sessionStorage.removeItem('lorettoAdminToken');
      window.location.href = 'admin-login.html';
    }
  };

  /* ─────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────── */
  function boot() { inject(); initInteractions(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }

})();
