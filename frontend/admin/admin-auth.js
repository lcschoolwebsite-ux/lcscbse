(function () {
  'use strict';

  // Use extensionless URL — Cloudflare Pages 308-redirects .html to extensionless
  var LOGIN_PAGE = 'admin-login';
  var TOKEN_KEY = 'lorettoAdminToken';
  var IDENTIFIER_KEY = 'lorettoAdminIdentifier';
  var RETURN_KEY = 'lorettoAdminReturnTo';
  var RESOLVED_API_BASE_KEY = 'lorettoAdminApiBase';
  var RESOLVED_OK_KEY = 'lorettoAdminApiBase_ok';
  var PUBLIC_CACHE_BUST_KEY = 'loretto_public_cache_bust';
  var path = window.location.pathname;
  // Match both /admin-login and /admin-login.html (Cloudflare strips .html via 308)
  var isLoginPage = /\/admin-login(\.html)?$/i.test(path);

  // Hide page immediately to prevent flash/flicker before auth check completes
  if (!isLoginPage) {
    document.documentElement.style.visibility = 'hidden';
  }

  function normalizeOrigin(value) {
    return (value || '').replace(/\/+$/, '');
  }

  function injectAdminUiFixes() {
    if (document.getElementById('loretto-admin-ui-fixes')) return;

    var style = document.createElement('style');
    style.id = 'loretto-admin-ui-fixes';
    style.textContent = [
      '.ic,.icon,.act-btn,.ab,.ql-icon,.uz-icon,.sidebar-brand-icon,.stat-card-icon,.sb-ic,.sb-icon,.tile-ic,.sc-ic,.oi-icon,.hp-icon,.it-icon,.circ-ic,.cld-add-ic{font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Segoe UI Symbol","Arial Unicode MS",sans-serif;}',
      '.ic:empty::before,.icon:empty::before,.ql-icon:empty::before,.uz-icon:empty::before,.sidebar-brand-icon:empty::before,.stat-card-icon:empty::before,.sb-ic:empty::before,.sb-icon:empty::before,.tile-ic:empty::before,.sc-ic:empty::before,.oi-icon:empty::before,.hp-icon:empty::before,.it-icon:empty::before,.circ-ic:empty::before,.cld-add-ic:empty::before{content:"•";display:inline-flex;align-items:center;justify-content:center;color:currentColor;opacity:.95;font-weight:800;}',
      '.modal-close:empty::before{content:"×";display:inline-block;font-size:1rem;font-weight:800;line-height:1;color:currentColor;}',
      'button.ab:empty::before{content:"E";display:inline-block;font-size:.62rem;font-weight:800;line-height:1;color:var(--navy-dark,#094f4f);}',
      'button.ab.del:empty::before{content:"×";font-size:.92rem;color:var(--red,#e74c3c);}',
      'button.ab.pub:empty::before{content:"P";font-size:.6rem;color:var(--green,#27ae60);}',
      'button.act-btn:empty::before{content:"E";display:inline-flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;line-height:1;color:var(--navy-dark,#094f4f);}',
      'button.act-btn.del:empty::before{content:"×";font-size:.92rem;color:var(--red,#e74c3c);}',
      'a.ab:empty::before{content:"V";display:inline-block;font-size:.62rem;font-weight:800;line-height:1;color:var(--navy-dark,#094f4f);}',
      '.ab:empty,.act-btn:empty,.modal-close:empty{color:inherit;}',
      '.ab:empty,.act-btn:empty,.modal-close:empty,.ic:empty,.icon:empty,.ql-icon:empty,.uz-icon:empty,.sidebar-brand-icon:empty,.stat-card-icon:empty,.sb-ic:empty,.sb-icon:empty,.tile-ic:empty,.sc-ic:empty,.oi-icon:empty,.hp-icon:empty,.it-icon:empty,.circ-ic:empty,.cld-add-ic:empty{min-width:1em;min-height:1em;}'
    ].join('');
    document.head.appendChild(style);
  }

  function injectAdminCloudinaryHelper() {
    if (document.getElementById('loretto-admin-cloudinary-helper')) return;

    var script = document.createElement('script');
    script.id = 'loretto-admin-cloudinary-helper';
    script.src = '/admin/admin-cloudinary.js?v=20260330-1';
    document.head.appendChild(script);
  }

  function trimText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeGlyphLabel(label, el) {
    var normalized = trimText(label);
    var nearby = '';
    var parent = el && el.closest
      ? el.closest('button,a,div,td,tr,.section-block,.block,.tile,.sc,.stat-card,.quick-link-btn,.ov-item,.sb-link,.sb-lnk,.sl')
      : null;
    if (parent) nearby = trimText(parent.textContent || '').toLowerCase();

    if (normalized === '🇮🇳') return 'HI';
    if (normalized === '⭐') return '★';
    if (normalized === '⏱') return 'T';
    if (normalized === '📰') return 'N';
    if (normalized === '📞') return 'C';
    if (normalized === '📋') return 'D';
    if (normalized === '📈') return '↑';
    if (normalized === '⚙') return 'S';
    if (normalized === '🖼' || normalized === '📷') return 'IMG';
    if (normalized === '✏') return 'E';
    if (normalized === '📊') return 'ST';
    if (normalized === '📬' || normalized === '✉️') return 'M';
    if (normalized === '📍') return 'L';
    if (normalized === '🕐') return 'T';
    if (normalized === '🔍') return '?';
    if (normalized === '👤' || normalized === '👨' || normalized === '👩' || normalized === '🧑') return 'U';
    if (normalized === '🏫') return 'SCH';
    if (normalized === '♟') return 'CH';
    if (normalized === '💃' || normalized === '🕺') return 'DN';
    if (normalized === '🌿') return 'E';
    if (normalized === '🔬') return 'SCI';
    if (normalized.indexOf('★') > -1 && /testimonials|rating/.test(nearby)) {
      return normalized.replace(/★/g, '*');
    }
    return normalized;
  }

  function inferControlLabel(el) {
    var title = (el.getAttribute('title') || '').toLowerCase();
    var onclick = (el.getAttribute('onclick') || '').toLowerCase();
    var nearby = '';
    var parent = el.closest('button,a,div,td,tr,.section-block,.block,.tile,.sc,.stat-card,.quick-link-btn,.ov-item,.sb-link,.sb-lnk,.sl');
    if (parent) {
      nearby = trimText(parent.textContent || '').toLowerCase();
    }
    var text = (title + ' ' + onclick + ' ' + nearby).trim();

    if (el.classList.contains('del') || /delete|remove/.test(text)) return '×';
    if (el.classList.contains('pub') || /publish/.test(text)) return 'P';
    if (/preview|view|open|pdf|download/.test(text)) return 'V';
    if (/add|\+ row|new|create/.test(text)) return '+';
    if (/close/.test(text) || el.classList.contains('modal-close')) return '×';
    if (/save|update/.test(text)) return 'S';
    if (/edit/.test(text)) return 'E';
    if (/upload|cloudinary|image|photo|logo/.test(text)) return '↑';
    if (/dashboard|overview|home/.test(text)) return 'D';
    if (/news/.test(text)) return 'N';
    if (/academics|faculty|school info|about|contact|gallery|seo|settings/.test(text)) return '•';
    if (/hindi/.test(text)) return 'HI';
    if (/kannada/.test(text)) return 'ಕ';
    if (/featured|star/.test(text)) return '★';
    return '•';
  }

  function applyVisibleFallback(el) {
    if (!el || el.dataset.lorettoFixed === 'true') return;
    var existing = trimText(el.textContent);
    if (existing) {
      var normalizedExisting = normalizeGlyphLabel(existing, el);
      if (normalizedExisting !== existing) {
        el.textContent = normalizedExisting;
        existing = normalizedExisting;
      }
      if (existing) return;
    }

    var label = inferControlLabel(el);
    el.textContent = label;
    el.dataset.lorettoFixed = 'true';
    el.setAttribute('aria-label', el.getAttribute('aria-label') || el.getAttribute('title') || label);

    if (el.classList.contains('ab') || el.classList.contains('act-btn')) {
      el.style.display = el.style.display || 'inline-flex';
      el.style.alignItems = el.style.alignItems || 'center';
      el.style.justifyContent = el.style.justifyContent || 'center';
      el.style.fontWeight = el.style.fontWeight || '800';
      el.style.lineHeight = el.style.lineHeight || '1';
      if (!el.style.color) {
        el.style.color = el.classList.contains('del')
          ? 'var(--red, #e74c3c)'
          : 'var(--navy-dark, #094f4f)';
      }
    } else if (el.classList.contains('modal-close')) {
      el.style.display = el.style.display || 'inline-flex';
      el.style.alignItems = el.style.alignItems || 'center';
      el.style.justifyContent = el.style.justifyContent || 'center';
      el.style.fontWeight = el.style.fontWeight || '800';
      el.style.lineHeight = el.style.lineHeight || '1';
    } else if (
      el.classList.contains('ic') ||
      el.classList.contains('icon') ||
      el.classList.contains('ql-icon') ||
      el.classList.contains('uz-icon') ||
      el.classList.contains('sidebar-brand-icon') ||
      el.classList.contains('stat-card-icon') ||
      el.classList.contains('sb-ic') ||
      el.classList.contains('sb-icon') ||
      el.classList.contains('tile-ic') ||
      el.classList.contains('sc-ic') ||
      el.classList.contains('oi-icon') ||
      el.classList.contains('hp-icon') ||
      el.classList.contains('it-icon') ||
      el.classList.contains('circ-ic') ||
      el.classList.contains('cld-add-ic')
    ) {
      el.style.display = el.style.display || 'inline-flex';
      el.style.alignItems = el.style.alignItems || 'center';
      el.style.justifyContent = el.style.justifyContent || 'center';
      el.style.fontWeight = el.style.fontWeight || '800';
    }
  }

  function repairAdminUi(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var selectors = [
      '.modal-close',
      'button.act-btn',
      'button.ab',
      'a.ab',
      '.ic',
      '.icon',
      '.ql-icon',
      '.uz-icon',
      '.sidebar-brand-icon',
      '.stat-card-icon',
      '.sb-ic',
      '.sb-icon',
      '.tile-ic',
      '.sc-ic',
      '.oi-icon',
      '.hp-icon',
      '.it-icon',
      '.circ-ic',
      '.cld-add-ic'
    ].join(',');

    scope.querySelectorAll(selectors).forEach(function (el) {
      applyVisibleFallback(el);
    });
  }

  function watchAdminUi() {
    if (window.__lorettoAdminUiObserver) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches('.modal-close,button.act-btn,button.ab,a.ab,.ic,.icon,.ql-icon,.uz-icon,.sidebar-brand-icon,.stat-card-icon,.sb-ic,.sb-icon,.tile-ic,.sc-ic,.oi-icon,.hp-icon,.it-icon,.circ-ic,.cld-add-ic')) {
            applyVisibleFallback(node);
          }
          if (node.querySelectorAll) repairAdminUi(node);
        });
      });
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });

    window.__lorettoAdminUiObserver = observer;
  }

  function getCandidateApiBases() {
    var candidates = [
      'https://lcscbse-production.up.railway.app',
      window.location.origin,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8000',
      'http://127.0.0.1:8000'
    ].map(normalizeOrigin);

    return candidates.filter(function (value, index, list) {
      return value && list.indexOf(value) === index;
    });
  }

  async function probeApiBase(base) {
    try {
      var res = await nativeFetch(base + '/api/health');
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok && res.status !== 200) return null;
      if (data && data.service === 'loretto-backend') {
        return {
          base: base,
          authConfigured: !!data.authConfigured,
          identifierConfigured: !!data.identifierConfigured
        };
      }
    } catch (err) {}
    return null;
  }

  async function resolveApiBase(forceRefresh) {
    var cached = localStorage.getItem(RESOLVED_API_BASE_KEY) || sessionStorage.getItem(RESOLVED_API_BASE_KEY);
    var cachedConfigured = localStorage.getItem(RESOLVED_OK_KEY) === 'true' || sessionStorage.getItem(RESOLVED_OK_KEY) === 'true';
    
    if (cached && cachedConfigured && !forceRefresh) {
      return cached;
    }
 
    var candidates = getCandidateApiBases();
    var resolved = normalizeOrigin(window.location.origin);

    // Try each candidate one by one
    for (var i = 0; i < candidates.length; i++) {
      var result = await probeApiBase(candidates[i]);
      if (result) {
        resolved = result.base;
        localStorage.setItem(RESOLVED_API_BASE_KEY, resolved);
        sessionStorage.setItem(RESOLVED_API_BASE_KEY, resolved);
        if (result.authConfigured) {
          localStorage.setItem(RESOLVED_OK_KEY, 'true');
          sessionStorage.setItem(RESOLVED_OK_KEY, 'true');
        }
        return resolved;
      }
    }
    
    // Fallback to origin
    localStorage.setItem(RESOLVED_API_BASE_KEY, resolved);
    sessionStorage.setItem(RESOLVED_API_BASE_KEY, resolved);
    return resolved;
  }

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  }

  function getIdentifier() {
    return sessionStorage.getItem(IDENTIFIER_KEY) || '';
  }

  function persistSession(token, identifier) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(IDENTIFIER_KEY, identifier || '');
    window.ADMIN_TOKEN = token;
    window.ADMIN_IDENTIFIER = identifier || '';
  }

  function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(IDENTIFIER_KEY);
    window.ADMIN_TOKEN = '';
    window.ADMIN_IDENTIFIER = '';
  }

  function getReturnUrl() {
    return sessionStorage.getItem(RETURN_KEY) || 'admin-panel';
  }

  function setReturnUrl(url) {
    sessionStorage.setItem(RETURN_KEY, url);
  }

  function clearReturnUrl() {
    sessionStorage.removeItem(RETURN_KEY);
  }

  function redirectToLogin() {
    if (isLoginPage) return;
    var current = path.split('/').pop() || '';
    // Don't save admin-login itself as the return URL
    if (current && !/admin-login/.test(current)) {
      setReturnUrl(current + window.location.search + window.location.hash);
    }
    window.location.replace(LOGIN_PAGE);
  }

  async function verifyToken(token, identifier) {
    if (!token) return { ok: false, authenticated: false };
    try {
      var apiBase = await resolveApiBase();
      var res = await nativeFetch(apiBase + '/api/health', {
        headers: {
          'x-admin-token': token,
          'x-admin-identifier': identifier || ''
        }
      });
      var data = await res.json().catch(function () { return {}; });
      return {
        ok: res.ok,
        authenticated: !!data.authenticated,
        authConfigured: !!data.authConfigured,
        identifierConfigured: !!data.identifierConfigured,
        apiBase: apiBase,
        data: data
      };
    } catch (err) {
      return { ok: false, authenticated: false, error: err };
    }
  }

  function withAuthHeaders(headers) {
    var finalHeaders = headers ? new Headers(headers) : new Headers();
    var token = getToken();
    var identifier = getIdentifier();
    if (token && !finalHeaders.has('x-admin-token')) {
      finalHeaders.set('x-admin-token', token);
    }
    if (identifier && !finalHeaders.has('x-admin-identifier')) {
      finalHeaders.set('x-admin-identifier', identifier);
    }
    return finalHeaders;
  }

  function notifyPublicDataChanged(scope) {
    try {
      localStorage.setItem(PUBLIC_CACHE_BUST_KEY, JSON.stringify({
        scope: scope || 'all',
        ts: Date.now()
      }));
    } catch (error) {
      // Ignore localStorage failures.
    }
  }

  var nativeFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var isRelativeApiRequest = /^\/api\//.test(url);
    var sameOriginAbsoluteApiRequest = url.indexOf(window.location.origin + '/api/') === 0;
    var isAbsoluteApiRequest = /\/api\//.test(url);
    var isApiRequest = isRelativeApiRequest || isAbsoluteApiRequest;
    if (!isApiRequest) {
      return nativeFetch(input, init);
    }

    return resolveApiBase().then(function (apiBase) {
      var resolvedUrl = url;
      if (isRelativeApiRequest) {
        resolvedUrl = apiBase + url;
      } else if (sameOriginAbsoluteApiRequest && apiBase !== normalizeOrigin(window.location.origin)) {
        resolvedUrl = url.replace(normalizeOrigin(window.location.origin), apiBase);
      }

      var nextInit = Object.assign({}, init || {});
      nextInit.headers = withAuthHeaders(nextInit.headers);
      return nativeFetch(resolvedUrl, nextInit).then(function (res) {
        if (res.status === 401 && !isLoginPage) {
          clearToken();
          redirectToLogin();
        }
        return res;
      });
    });
  };

  window.AdminAuth = {
    getToken: getToken,
    getIdentifier: getIdentifier,
    persistSession: persistSession,
    clearToken: clearToken,
    getReturnUrl: getReturnUrl,
    clearReturnUrl: clearReturnUrl,
    verifyToken: verifyToken,
    resolveApiBase: resolveApiBase,
    redirectToLogin: redirectToLogin,
    apiHeaders: function (base) {
      var headers = withAuthHeaders(base || {});
      var obj = {};
      headers.forEach(function (value, key) { obj[key] = value; });
      return obj;
    },
    notifyPublicDataChanged: notifyPublicDataChanged,
    logout: function () {
      clearToken();
      clearReturnUrl();
      window.location.replace(LOGIN_PAGE);
    }
  };

  window.ADMIN_TOKEN = getToken();
  window.ADMIN_IDENTIFIER = getIdentifier();
  window.notifyPublicDataChanged = notifyPublicDataChanged;
  window.apiHeaders = window.apiHeaders || function (base) {
    return window.AdminAuth.apiHeaders(base || { 'Content-Type': 'application/json' });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectAdminCloudinaryHelper();
      injectAdminUiFixes();
      repairAdminUi(document);
      watchAdminUi();
    });
  } else {
    injectAdminCloudinaryHelper();
    injectAdminUiFixes();
    repairAdminUi(document);
    watchAdminUi();
  }

  if (!isLoginPage) {
    var token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    verifyToken(token, getIdentifier()).then(function (result) {
      if (!result.authenticated) {
        clearToken();
        redirectToLogin();
      } else {
        // Auth confirmed — reveal the page
        document.documentElement.style.visibility = '';
      }
    }).catch(function () {
      // On network error, show the page anyway (fail open for UX)
      document.documentElement.style.visibility = '';
    });
  }
})();
