(function () {
  'use strict';

  var REGISTRY = {
    'western-dance': { file: '1-western-dance.html', type: 'activity' },
    'thinkers-space': { file: '2-thinkers-space.html', type: 'activity' },
    'classical-dance': { file: '3-classical-dance.html', type: 'activity' },
    'karate-class': { file: '4-karate-class.html', type: 'activity' },
    'chess-class': { file: '5-chess-class.html', type: 'activity' },
    'english-club': { file: '6-english-club.html', type: 'club' },
    'social-club': { file: '7-social-club.html', type: 'club' },
    'eco-club': { file: '8-eco-club.html', type: 'club' },
    'kannada-club': { file: '9-kannada-club.html', type: 'club' },
    'maths-club': { file: '10-maths-club.html', type: 'club' },
    'science-club': { file: '11-science-club.html', type: 'club' },
    'hindi-club': { file: '12-hindi-club.html', type: 'club' }
  };

  var DETAIL_BY_FILE = Object.keys(REGISTRY).reduce(function (map, slug) {
    map[REGISTRY[slug].file] = slug;
    return map;
  }, {});

  function fileName() {
    var parts = window.location.pathname.split('/');
    var f = parts[parts.length - 1] || 'index.html';
    if (f && !/\\.html$/i.test(f) && !/[?#]/.test(f)) f += '.html';
    return f;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function withApiBase(path) {
    return (window.__activitiesApiBase || '/api').replace(/\/+$/, '') + path;
  }

  async function resolveBase() {
    if (typeof window.resolveApiBase === 'function') {
      try {
        window.__activitiesApiBase = await window.resolveApiBase();
        return;
      } catch (error) {
        // Fall back to same-origin API.
      }
    }
    window.__activitiesApiBase = '/api';
  }

  async function loadActivity(slug) {
    try {
      var response = await fetch(withApiBase('/activities-clubs/' + slug));
      if (!response.ok) return null;
      var payload = await response.json().catch(function () { return null; });
      return payload && payload.data ? payload.data : null;
    } catch (error) {
      return null;
    }
  }

  function normalizeActivity(slug, remoteData) {
    var defaults = REGISTRY[slug];
    if (!defaults) return null;

    var hero = (remoteData && remoteData.hero) || {};
    var infoTiles = normalizeArray(remoteData && remoteData.infoTiles).slice(0, 3);
    var content = (remoteData && remoteData.content) || {};
    var section1 = content.section1 || {};
    var section2 = content.section2 || {};
    var noticeBox = content.noticeBox || {};

    return {
      id: slug,
      file: defaults.file,
      type: (remoteData && remoteData.type) || defaults.type,
      hero: {
        icon: hero.icon != null ? hero.icon : '',
        badge: hero.badge || '',
        title: hero.title || '',
        description: hero.description || ''
      },
      infoTiles: infoTiles,
      content: {
        section1: {
          heading: section1.heading || '',
          items: normalizeArray(section1.items)
        },
        section2: {
          heading: section2.heading || '',
          items: normalizeArray(section2.items)
        },
        gallery: normalizeArray(content.gallery),
        noticeBox: {
          text: noticeBox.text || '',
          visible: !!noticeBox.visible
        }
      },
      settings: {
        live: !(remoteData && remoteData.settings && remoteData.settings.live === false),
        showGallery: !(remoteData && remoteData.settings && remoteData.settings.showGallery === false)
      },
      seo: {
        title: remoteData && remoteData.seo && remoteData.seo.title ? remoteData.seo.title : '',
        description: remoteData && remoteData.seo && remoteData.seo.description ? remoteData.seo.description : ''
      },
      hasRemoteData: !!(remoteData && Object.keys(remoteData).length)
    };
  }

  function renderTiles(infoTiles) {
    if (!infoTiles.length) return '';

    return '<div class="ac-info-grid">'
      + infoTiles.map(function (tile) {
          return '<div class="ac-info-tile">'
            + '<div class="tile-icon"></div>'
            + '<div class="tile-label">' + escapeHtml(tile.label || '') + '</div>'
            + '<div class="tile-value">' + escapeHtml(tile.value || '—') + '</div>'
            + '</div>';
        }).join('')
      + '</div>';
  }

  function renderSection(section) {
    if (!section || !section.heading || !normalizeArray(section.items).length) return '';
    return '<h3>' + escapeHtml(section.heading) + '</h3>'
      + '<ul>'
      + normalizeArray(section.items).map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('')
      + '</ul>';
  }

  function renderGallery(images) {
    var list = normalizeArray(images).filter(Boolean);
    if (!list.length) return '';

    return '<div class="school-gallery">'
      + list.slice(0, 6).map(function (url, index) {
          return '<div class="gallery-img">'
            + '<img src="' + escapeHtml(url) + '" alt="Activity photo ' + (index + 1) + '" loading="lazy" />'
            + '</div>';
        }).join('')
      + '</div>';
  }

  function renderNoticeBox(noticeBox) {
    if (!noticeBox || !noticeBox.visible || !noticeBox.text) return '';
    return '<div class="notice-box"><p><strong>Note:</strong> ' + escapeHtml(noticeBox.text) + '</p></div>';
  }

  function updateMeta(title, description) {
    if (title) document.title = title;

    var descValue = description || '';
    if (!descValue) return;

    var meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', descValue);
  }

  function renderUnavailable(title) {
    var heading = title || 'This Page';
    return '<div class="ac-hero-card"><div class="ac-hero-card-inner"><div class="ac-hero-text">'
      + '<span class="ac-hero-badge">Page Unavailable</span>'
      + '<h2>' + escapeHtml(heading) + '</h2>'
      + '<p>This page is currently hidden from the public site. Please check back later.</p>'
      + '</div></div></div>'
      + '<div class="notice-box"><p><strong>Return:</strong> Browse the other activities and clubs from the navigation above.</p></div>';
  }

  function updateDetailShell(data) {
    var bannerTitle = document.querySelector('.page-banner h1');
    if (bannerTitle && data.hero.title) bannerTitle.textContent = data.hero.title;

    var crumb = document.querySelector('.breadcrumb span:last-child');
    if (crumb && data.hero.title) crumb.textContent = data.hero.title;

    var activeLink = document.querySelector('.ac-subnav-section a.active');
    if (activeLink && data.hero.title) activeLink.textContent = data.hero.title;

    updateMeta(
      data.seo.title || (data.hero.title ? data.hero.title + ' | Activities & Clubs | Loretto Central School' : ''),
      data.seo.description || data.hero.description
    );
  }

  function renderDetail(data) {
    return '<div class="ac-hero-card">'
      + '<div class="ac-hero-card-inner">'
      + '<div class="ac-hero-icon">' + escapeHtml(data.hero.icon || '') + '</div>'
      + '<div class="ac-hero-text">'
      + '<span class="ac-hero-badge">' + escapeHtml(data.hero.badge || '') + '</span>'
      + '<h2>' + escapeHtml(data.hero.title || '') + '</h2>'
      + '<p>' + escapeHtml(data.hero.description || '') + '</p>'
      + '</div></div></div>'
      + renderTiles(data.infoTiles)
      + (data.settings.showGallery ? renderGallery(data.content.gallery) : '')
      + renderSection(data.content.section1)
      + renderSection(data.content.section2)
      + renderNoticeBox(data.content.noticeBox);
  }

  function placeholderIcon(data) {
    if (data.hero.icon) return escapeHtml(data.hero.icon);
    return data.type === 'club' ? 'C' : 'A';
  }

  function addRuntimeStyles() {
    if (document.getElementById('activities-runtime-style')) return;

    var style = document.createElement('style');
    style.id = 'activities-runtime-style';
    style.textContent = [
      'a.activity-card{display:block;text-decoration:none;color:inherit;}',
      '.activity-placeholder span{font-size:1rem;font-weight:800;letter-spacing:.08em;}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderIndexCard(data) {
    var title = data.hero.title || 'Activity';
    var badges = [
      '<span class="activity-badge">' + escapeHtml(data.type === 'club' ? 'Club' : 'Activity') + '</span>'
    ];
    if (data.hero.badge) {
      badges.push('<span class="activity-badge">' + escapeHtml(data.hero.badge) + '</span>');
    }
    var gallery = data.settings.showGallery ? normalizeArray(data.content.gallery).filter(Boolean).slice(0, 4) : [];
    var galleryHtml = gallery.length
      ? '<div class="activity-gallery">' + gallery.map(function (url, index) {
          return '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(title) + ' photo ' + (index + 1) + '" loading="lazy" />';
        }).join('') + '</div>'
      : '<div class="activity-placeholder"><span>' + placeholderIcon(data) + '</span></div>';

    return '<a class="activity-card" href="' + escapeHtml(data.file) + '">'
      + galleryHtml
      + '<div class="activity-body">'
      + '<div class="activity-name">' + escapeHtml(title) + '</div>'
      + '<div class="activity-meta">' + badges.join('') + '</div>'
      + (data.hero.description ? '<p class="activity-desc">' + escapeHtml(data.hero.description) + '</p>' : '')
      + '</div>'
      + '</a>';
  }

  async function initDetail(slug) {
    var card = document.querySelector('.content-card');
    if (!card) return;

    var remoteData = await loadActivity(slug);
    var data = normalizeActivity(slug, remoteData);
    if (!data || !data.hasRemoteData) return;

    updateDetailShell(data);
    card.innerHTML = data.settings.live ? renderDetail(data) : renderUnavailable(data.hero.title);
  }

  async function initIndex() {
    var container = document.getElementById('activities-grid');
    var loader = document.getElementById('activities-loading');
    if (!container) return;

    addRuntimeStyles();

    var slugs = Object.keys(REGISTRY);
    var items = await Promise.all(slugs.map(async function (slug) {
      var remoteData = await loadActivity(slug);
      return normalizeActivity(slug, remoteData);
    }));

    var visible = items.filter(function (item) {
      return item && item.hasRemoteData && item.settings.live;
    });

    if (!visible.length) {
      if (loader) loader.textContent = 'No activities or clubs are available right now.';
      return;
    }

    container.innerHTML = visible.map(renderIndexCard).join('');
    container.style.display = 'grid';
    if (loader) loader.style.display = 'none';
  }

  async function init() {
    await resolveBase();

    var currentFile = fileName();
    if (currentFile === 'index.html' || currentFile === '') {
      await initIndex();
      return;
    }

    var slug = DETAIL_BY_FILE[currentFile];
    if (slug) await initDetail(slug);
  }

  init();
})();
