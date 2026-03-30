(function () {
  'use strict';

  var DEFAULTS = {
    banner: {
      heading: 'E-Magazine',
      subheading: 'Student voices · School stories · Monthly editions',
      introText: 'The school has planned to bring out the school E-Magazine every month. We are proud and happy to present before you our growing collection of editions — filled with student articles, school news, achievements and more. Read and share!'
    },
    section: {
      heading: 'School E-Magazine Collection',
      yearBadge: 'All Issues — Academic Year 2025–26',
      desc: 'Browse and download all published editions of the Loretto Central School E-Magazine. Each issue is packed with student achievements, school events, articles, and creative writing.'
    },
    noticeBox: {
      show: false,
      icon: '',
      title: 'Contribute to the E-Magazine',
      body: 'Students, parents and staff are invited to contribute articles, photographs, artwork, poems, and stories to the Loretto E-Magazine. Submit your contributions to the school office or email the magazine committee.'
    },
    page: {
      live: true,
      showIntroStrip: true,
      showSectionHeading: true,
      featuredIssue: true,
      showDownloadButton: true,
      showViewOnlineButton: true
    },
    seo: {
      title: 'E-Magazine | Loretto Central School',
      description: 'Browse and download all editions of the Loretto Central School E-Magazine — student voices, school stories, and monthly highlights.'
    }
  };

  var GRADIENTS = [
    'linear-gradient(135deg, #7a1f3d 0%, #b8325a 55%, #e85c87 100%)',
    'linear-gradient(135deg, #1e3a5f 0%, #2d5f8f 55%, #3b82c4 100%)',
    'linear-gradient(135deg, #5c2d00 0%, #92480a 55%, #c8680f 100%)',
    'linear-gradient(135deg, #1a4a2e 0%, #246b42 55%, #2e8c58 100%)',
    'linear-gradient(135deg, #2d1a4f 0%, #4c2d8f 55%, #6b44c8 100%)',
    'linear-gradient(135deg, #20485a 0%, #2d758f 55%, #4cb8c8 100%)'
  ];

  function normalizeText(value) {
    return value == null ? '' : String(value).trim();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function mergeSettings(raw) {
    var source = raw && typeof raw === 'object' ? raw : {};
    var banner = source.banner && typeof source.banner === 'object' ? source.banner : {};
    var section = source.section && typeof source.section === 'object' ? source.section : {};
    var noticeBox = source.noticeBox && typeof source.noticeBox === 'object' ? source.noticeBox : {};
    var page = source.page && typeof source.page === 'object' ? source.page : {};
    var seo = source.seo && typeof source.seo === 'object' ? source.seo : {};

    return {
      banner: {
        heading: normalizeText(banner.heading) || DEFAULTS.banner.heading,
        subheading: normalizeText(banner.subheading) || DEFAULTS.banner.subheading,
        introText: normalizeText(banner.introText) || DEFAULTS.banner.introText
      },
      section: {
        heading: normalizeText(section.heading) || DEFAULTS.section.heading,
        yearBadge: normalizeText(section.yearBadge) || DEFAULTS.section.yearBadge,
        desc: normalizeText(section.desc) || DEFAULTS.section.desc
      },
      noticeBox: {
        show: !!noticeBox.show,
        icon: normalizeText(noticeBox.icon),
        title: normalizeText(noticeBox.title) || DEFAULTS.noticeBox.title,
        body: normalizeText(noticeBox.body) || DEFAULTS.noticeBox.body
      },
      page: {
        live: page.live !== false,
        showIntroStrip: page.showIntroStrip !== false,
        showSectionHeading: page.showSectionHeading !== false,
        featuredIssue: page.featuredIssue !== false,
        showDownloadButton: page.showDownloadButton !== false,
        showViewOnlineButton: page.showViewOnlineButton !== false
      },
      seo: {
        title: normalizeText(seo.title) || DEFAULTS.seo.title,
        description: normalizeText(seo.description) || DEFAULTS.seo.description
      }
    };
  }

  async function fetchJson(endpoint) {
    try {
      if (typeof window.fetchData === 'function') {
        return await window.fetchData(endpoint);
      }

      var base = '/api';
      if (typeof window.resolveApiBase === 'function') {
        base = await window.resolveApiBase();
      }
      var response = await fetch(String(base).replace(/\/+$/, '') + '/' + endpoint.replace(/^\/+/, ''));
      if (!response.ok) return null;
      return await response.json().catch(function () { return null; });
    } catch (error) {
      return null;
    }
  }

  async function loadSettings() {
    if (typeof window.loadSettingData === 'function') {
      var item = await window.loadSettingData('e-magazine');
      return mergeSettings(item && item.data ? item.data : item);
    }
    var payload = await fetchJson('settings/e-magazine');
    return mergeSettings(payload && payload.data ? payload.data : payload);
  }

  async function loadMagazines() {
    var docs = null;
    if (typeof window.loadDocumentsData === 'function') {
      docs = await window.loadDocumentsData();
    }
    if (!Array.isArray(docs)) {
      docs = await fetchJson('documents?category=e-magazine');
    }

    return (Array.isArray(docs) ? docs : [])
      .filter(function (item) {
        return item && item.category === 'e-magazine' && item.url && item.visible !== false;
      })
      .sort(function (a, b) {
        return magazineSortValue(b) - magazineSortValue(a);
      });
  }

  function magazineSortValue(item) {
    var value = item && (item.date || item.createdAt || item.updatedAt) ? (item.date || item.createdAt || item.updatedAt) : '';
    var ts = Date.parse(value);
    if (!Number.isNaN(ts)) return ts;
    var id = item && item._id ? String(item._id) : '';
    var hex = id.slice(0, 8);
    return /^[0-9a-fA-F]{8}$/.test(hex) ? parseInt(hex, 16) * 1000 : 0;
  }

  function splitIssueTitle(item, fallbackIndex) {
    var title = normalizeText(item && (item.title || item.name)) || 'E-Magazine';
    var parts = title.split(' — ');
    var meta = item && item.meta && typeof item.meta === 'object' ? item.meta : {};
    return {
      title: parts[0] || 'E-Magazine',
      issue: normalizeText(meta.issueLabel) || parts[1] || ('Issue No. ' + fallbackIndex)
    };
  }

  function formatDateLabel(item) {
    var value = normalizeText(item && (item.date || item.createdAt || item.updatedAt));
    if (!value) return 'Latest Edition';
    var parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  function formatBannerHeading(text) {
    var value = normalizeText(text) || DEFAULTS.banner.heading;
    if (!value) return '';
    return '<em>' + escapeHtml(value.charAt(0)) + '</em>' + escapeHtml(value.slice(1));
  }

  function updateMeta(settings) {
    if (settings.seo.title) document.title = settings.seo.title;

    var meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = settings.seo.description || DEFAULTS.seo.description;
  }

  function applySettings(settings) {
    var bannerTitle = document.querySelector('.page-banner h1');
    var bannerSub = document.querySelector('.page-banner-sub');
    var introStrip = document.querySelector('.intro-strip');
    var introText = document.querySelector('.intro-strip-text p');
    var sectionHeading = document.querySelector('.section-heading');
    var yearBadge = document.querySelector('.section-heading .issue-badge');
    var sectionTitle = document.querySelector('.section-heading h2');
    var sectionDesc = document.querySelector('.section-heading p');

    if (bannerTitle) bannerTitle.innerHTML = formatBannerHeading(settings.banner.heading);
    if (bannerSub) bannerSub.textContent = settings.banner.subheading;
    if (introText) introText.textContent = settings.banner.introText;
    if (introStrip) introStrip.style.display = settings.page.showIntroStrip ? '' : 'none';
    if (sectionHeading) sectionHeading.style.display = settings.page.showSectionHeading ? '' : 'none';
    if (yearBadge) {
      yearBadge.textContent = settings.section.yearBadge;
      yearBadge.style.display = settings.section.yearBadge ? 'inline-flex' : 'none';
    }
    if (sectionTitle) sectionTitle.textContent = settings.section.heading;
    if (sectionDesc) sectionDesc.textContent = settings.section.desc;

    updateMeta(settings);
    updateNoticeBox(settings);
  }

  function getOrCreateNoticeBox() {
    var existing = document.getElementById('magazine-notice-box');
    if (existing) return existing;

    var grid = document.getElementById('magazine-grid');
    if (!grid || !grid.parentNode) return null;

    var box = document.createElement('div');
    box.id = 'magazine-notice-box';
    box.className = 'notice-box';
    box.style.display = 'none';
    box.innerHTML = '<div class="notice-box-icon"></div><div class="notice-box-text"><h3></h3><p></p></div>';
    grid.insertAdjacentElement('afterend', box);
    return box;
  }

  function updateNoticeBox(settings) {
    var box = getOrCreateNoticeBox();
    if (!box) return;

    var visible = settings.noticeBox.show && (settings.noticeBox.title || settings.noticeBox.body || settings.noticeBox.icon);
    box.style.display = visible ? '' : 'none';
    if (!visible) return;

    var icon = box.querySelector('.notice-box-icon');
    var title = box.querySelector('.notice-box-text h3');
    var body = box.querySelector('.notice-box-text p');

    if (icon) {
      icon.textContent = settings.noticeBox.icon || '';
      icon.style.display = settings.noticeBox.icon ? '' : 'none';
    }
    if (title) title.textContent = settings.noticeBox.title;
    if (body) body.textContent = settings.noticeBox.body;
  }

  function renderActions(item, settings) {
    var url = escapeHtml(item.url || '#');
    var actions = [];

    if (settings.page.showDownloadButton) {
      actions.push(
        '<a href="' + url + '" class="mag-btn-primary" target="_blank" download>'
        + '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M5 7l3 3 3-3M2 12v2h12v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + 'Download PDF'
        + '</a>'
      );
    }

    if (settings.page.showViewOnlineButton) {
      actions.push(
        '<a href="' + url + '" class="mag-btn-outline" target="_blank">'
        + '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>'
        + 'View Online'
        + '</a>'
      );
    }

    return actions.length ? '<div class="mag-actions">' + actions.join('') + '</div>' : '';
  }

  function gradientFor(item, index) {
    var meta = item && item.meta && typeof item.meta === 'object' ? item.meta : {};
    return normalizeText(meta.gradient) || GRADIENTS[index % GRADIENTS.length];
  }

  function renderMagazineCards(items, settings) {
    var grid = document.getElementById('magazine-grid');
    if (!grid || !items.length) return;

    var featuredEnabled = settings.page.featuredIssue !== false;
    grid.innerHTML = items.map(function (item, index) {
      var parts = splitIssueTitle(item, Math.max(items.length - index, 1));
      var dateLabel = formatDateLabel(item);
      var desc = normalizeText(item.description || item.desc) || 'Read the latest edition of the school magazine online or download the PDF.';
      var featured = featuredEnabled && index === 0;

      if (featured) {
        return '<div class="mag-card featured">'
          + '<div class="mag-cover" style="background: ' + escapeHtml(gradientFor(item, index)) + ';">'
          + '<div class="mag-cover-inner">'
          + '<div class="mag-vol">' + escapeHtml(parts.issue) + ' · Latest Edition</div>'
          + '<div class="mag-title">' + escapeHtml(parts.title) + '</div>'
          + '<div class="mag-date-pill">' + escapeHtml(dateLabel) + '</div>'
          + '</div></div>'
          + '<div class="mag-body">'
          + '<div class="featured-badge">Latest Issue</div>'
          + '<div class="mag-title-lg">' + escapeHtml(parts.title) + '</div>'
          + '<div class="mag-desc">' + escapeHtml(desc) + '</div>'
          + renderActions(item, settings)
          + '</div></div>';
      }

      return '<div class="mag-card">'
        + '<div class="mag-cover" style="background: ' + escapeHtml(gradientFor(item, index)) + ';">'
        + '<div class="mag-cover-inner">'
        + '<div class="mag-vol">' + escapeHtml(parts.issue) + '</div>'
        + '<div class="mag-title">' + escapeHtml(parts.title) + '</div>'
        + '<div class="mag-date-pill">' + escapeHtml(dateLabel) + '</div>'
        + '</div></div>'
        + '<div class="mag-body">'
        + '<div class="mag-desc">' + escapeHtml(desc) + '</div>'
        + renderActions(item, settings)
        + '</div></div>';
    }).join('');
  }

  function renderUnavailable(settings) {
    var container = document.querySelector('.page-content .container');
    if (!container) return;

    container.innerHTML = '<div class="section-heading">'
      + '<div class="issue-badge">Page Unavailable</div>'
      + '<h2>' + escapeHtml(settings.section.heading || settings.banner.heading) + '</h2>'
      + '<p>This page is currently hidden from the public site. Please check back later.</p>'
      + '</div>';
  }

  async function init() {
    var settings = await loadSettings();
    applySettings(settings);

    if (!settings.page.live) {
      renderUnavailable(settings);
      return;
    }

    var magazines = await loadMagazines();
    if (magazines.length) {
      renderMagazineCards(magazines, settings);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
