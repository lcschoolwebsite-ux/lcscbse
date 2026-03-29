(function () {
  'use strict';

  var REGISTRY = {
    'western-dance': {
      file: '1-western-dance.html',
      type: 'activity',
      hero: {
        icon: '',
        badge: 'Performing Arts · Dance',
        title: 'Western Dance',
        description: 'Loretto Central School celebrates the joy of movement through its vibrant Western Dance programme. Students learn a variety of contemporary dance styles in a fun, disciplined environment that builds confidence, rhythm, and self-expression.'
      }
    },
    'thinkers-space': {
      file: '2-thinkers-space.html',
      type: 'activity',
      hero: {
        icon: '',
        badge: 'Critical Thinking · Debate',
        title: 'Thinkers Space .In',
        description: 'Thinkers Space .In is a unique intellectual forum at Loretto Central School that encourages students to think critically, question deeply, and articulate their ideas with confidence. Through debates, discussions, and thought experiments, students develop essential 21st-century skills.'
      }
    },
    'classical-dance': {
      file: '3-classical-dance.html',
      type: 'activity',
      hero: {
        icon: '',
        badge: 'Performing Arts · Classical',
        title: 'Classical Dance',
        description: 'The Classical Dance programme at Loretto Central School offers students a gateway into the rich heritage of Indian classical dance traditions. Under the guidance of a trained instructor, students learn the discipline, grace, and storytelling art of classical forms.'
      }
    },
    'karate-class': {
      file: '4-karate-class.html',
      type: 'activity',
      hero: {
        icon: '',
        badge: 'Martial Arts · Self-Defence',
        title: 'Karate Class',
        description: 'The Karate programme at Loretto Central School is conducted by a certified instructor and teaches students the discipline, focus, and self-defence skills of this respected martial art. Students have excelled at national-level competitions.'
      }
    },
    'chess-class': {
      file: '5-chess-class.html',
      type: 'activity',
      hero: {
        icon: '',
        badge: 'Strategy · Mind Sports',
        title: 'Chess Class',
        description: 'Chess at Loretto Central School is more than a game. It is a mental workout that sharpens strategic thinking, patience, and problem-solving for beginners and experienced players alike.'
      }
    },
    'english-club': {
      file: '6-english-club.html',
      type: 'club',
      hero: {
        icon: '',
        badge: 'Language · Literature',
        title: 'English Club',
        description: 'The English Club at Loretto Central School is a vibrant space for students who love language, literature, and creative expression. Through a range of activities, students develop fluency, confidence, and a deep appreciation for the English language.'
      }
    },
    'social-club': {
      file: '7-social-club.html',
      type: 'club',
      hero: {
        icon: '',
        badge: 'Community · Service',
        title: 'Social Club',
        description: 'The Social Club at Loretto Central School nurtures compassion, civic responsibility, and community spirit. Guided by the motto "Love Through Service," students engage in meaningful social activities that make a real difference.'
      }
    },
    'eco-club': {
      file: '8-eco-club.html',
      type: 'club',
      hero: {
        icon: '',
        badge: 'Environment · Sustainability',
        title: 'Eco Club',
        description: 'The Eco Club at Loretto Central School champions environmental awareness and sustainable living. Students are inspired to be guardians of the planet through hands-on activities, green campaigns, and a deep connection with nature.'
      }
    },
    'kannada-club': {
      file: '9-kannada-club.html',
      type: 'club',
      hero: {
        icon: 'ಕ',
        badge: 'Language · Culture',
        title: 'Kannada Club',
        description: 'The Kannada Club at Loretto Central School celebrates the rich language, literature, and culture of Karnataka. The club brings students closer to their regional roots and fosters pride in Kannada heritage.'
      }
    },
    'maths-club': {
      file: '10-maths-club.html',
      type: 'club',
      hero: {
        icon: '',
        badge: 'Mathematics · Logic',
        title: 'Maths Club',
        description: 'The Maths Club at Loretto Central School transforms mathematics from a subject into an adventure. Through puzzles, competitions, and explorations, students discover the beauty, logic, and real-world power of mathematics.'
      }
    },
    'science-club': {
      file: '11-science-club.html',
      type: 'club',
      hero: {
        icon: '',
        badge: 'Science · Innovation',
        title: 'Science Club',
        description: 'The Science Club at Loretto Central School fuels curiosity and a love for discovery. Through experiments, projects, and explorations, students experience science beyond the textbook in a hands-on way.'
      }
    },
    'hindi-club': {
      file: '12-hindi-club.html',
      type: 'club',
      hero: {
        icon: '🇮🇳',
        badge: 'Language · National',
        title: 'Hindi Club',
        description: 'The Hindi Club at Loretto Central School fosters love for India\'s national language and its rich literary traditions. Students develop strong Hindi language skills and a deeper connection to national culture.'
      }
    }
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
        icon: hero.icon != null ? hero.icon : defaults.hero.icon,
        badge: hero.badge || defaults.hero.badge,
        title: hero.title || defaults.hero.title,
        description: hero.description || defaults.hero.description
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
    return '<div class="ac-hero-card"><div class="ac-hero-card-inner"><div class="ac-hero-text">'
      + '<span class="ac-hero-badge">Page Unavailable</span>'
      + '<h2>' + escapeHtml(title) + '</h2>'
      + '<p>This page is currently hidden from the public site. Please check back later.</p>'
      + '</div></div></div>'
      + '<div class="notice-box"><p><strong>Return:</strong> Browse the other activities and clubs from the navigation above.</p></div>';
  }

  function updateDetailShell(data) {
    var bannerTitle = document.querySelector('.page-banner h1');
    if (bannerTitle) bannerTitle.textContent = data.hero.title;

    var crumb = document.querySelector('.breadcrumb span:last-child');
    if (crumb) crumb.textContent = data.hero.title;

    var activeLink = document.querySelector('.ac-subnav-section a.active');
    if (activeLink) activeLink.textContent = data.hero.title;

    updateMeta(
      data.seo.title || (data.hero.title + ' | Activities & Clubs | Loretto Central School'),
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
    var gallery = data.settings.showGallery ? normalizeArray(data.content.gallery).filter(Boolean).slice(0, 4) : [];
    var galleryHtml = gallery.length
      ? '<div class="activity-gallery">' + gallery.map(function (url, index) {
          return '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(data.hero.title) + ' photo ' + (index + 1) + '" loading="lazy" />';
        }).join('') + '</div>'
      : '<div class="activity-placeholder"><span>' + placeholderIcon(data) + '</span></div>';

    return '<a class="activity-card" href="' + escapeHtml(data.file) + '">'
      + galleryHtml
      + '<div class="activity-body">'
      + '<div class="activity-name">' + escapeHtml(data.hero.title) + '</div>'
      + '<div class="activity-meta">'
      + '<span class="activity-badge">' + escapeHtml(data.type === 'club' ? 'Club' : 'Activity') + '</span>'
      + '<span class="activity-badge">' + escapeHtml(data.hero.badge) + '</span>'
      + '</div>'
      + '<p class="activity-desc">' + escapeHtml(data.hero.description) + '</p>'
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
      return item && item.settings.live;
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
