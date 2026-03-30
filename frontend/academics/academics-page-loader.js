(function () {
  var doc = document;
  var ACADEMICS_MAIN_KEY = 'academics.main';
  var FACULTY_PAGE_KEY = 'academics.faculty-page';
  var FORMER_HEADS_KEY = 'academics.former-heads';
  var CBSE_CIRCULARS_KEY = 'academics.cbse-circulars';
  var SCHOOL_CIRCULARS_KEY = 'academics.school-circulars';
  var BOOK_LIST_KEY = 'academics.book-list';

  var DEFAULTS = {
    overview: {
      bannerTitle: 'Academics',
      heroBadge: '',
      heroTitle: 'Academics',
      heroDesc: '',
      icons: {
        faculty: '🎓',
        circular: '📢',
        curriculum: '📚',
        calendar: '📅'
      }
    },
    faculty: {
      bannerTitle: 'Faculty',
      pageTitle: 'Faculty',
      introText: '',
      listTitle: 'Teaching Staff'
    },
    formerHeads: {
      bannerTitle: 'Former Heads',
      heroBadge: '',
      heroTitle: 'Former Heads',
      heroText: '',
      legacyTitle: '',
      legacyText: '',
      stats: [],
      journeyTitle: '',
      journeyItems: []
    },
    cbse: {
      bannerTitle: 'CBSE Circulars',
      badge: '',
      heroTitle: 'CBSE Circulars',
      heroText: '',
      sectionTitle: 'CBSE Circulars'
    },
    school: {
      bannerTitle: 'School Circulars',
      badge: '',
      heroTitle: 'School Circulars',
      heroText: '',
      academicYear: '',
      addressedTo: '',
      distribution: '',
      sectionTitle: 'School Circulars',
      guideTitle: '',
      guideItems: []
    },
    bookList: {
      bannerTitle: 'Book List',
      heroBadge: '',
      heroTitle: 'Book List',
      heroText: '',
      academicYear: '',
      sectionTitle: 'Book List',
      downloadTitle: 'Download Book List - PDF',
      downloadText: '',
      instructionsTitle: '',
      instructionItems: [],
      classes: []
    }
  };

  var PAGE_ICONS = {
    faculty: {
      hero: '🎓',
      tiles: []
    },
    'former-heads': {
      hero: '🎓',
      tiles: ['🕊️', '🕰️', '🥇', '📜']
    },
    'cbse-circulars': {
      hero: '📢',
      tiles: []
    },
    'school-circulars': {
      hero: '📢',
      tiles: ['📅', '🗞️', '👨‍👩‍👧‍👦', '📦']
    },
    'book-list': {
      hero: '📚',
      tiles: ['🎒', '📖', '📝', '📍']
    }
  };

  function textOf(node) {
    return node ? String(node.textContent || '').trim() : '';
  }

  function normalizeText(value) {
    return value == null ? '' : String(value).trim();
  }

  function escapeHtml(value) {
    return normalizeText(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function asNumber(value, fallback) {
    var parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : (fallback || 0);
  }

  function formatDisplayDate(value) {
    if (!value) return '';
    var parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return normalizeText(value);
    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  function getDocumentDateValue(item) {
    if (!item || typeof item !== 'object') return '';
    return item.date
      || (item.meta && (item.meta.date || item.meta.publishedAt || item.meta.displayDate))
      || item.updatedAt
      || item.createdAt
      || '';
  }

  function getDocumentTimestamp(item) {
    var value = getDocumentDateValue(item);
    var parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function matchesPath(patterns) {
    var path = normalizeText(window.location.pathname).replace(/\/+$/, '');
    return patterns.some(function (pattern) {
      return pattern.test(path);
    });
  }

  function setTextById(id, value, hideIfEmpty) {
    var node = doc.getElementById(id);
    if (!node) return;
    var text = normalizeText(value);
    node.textContent = text;
    if (hideIfEmpty) {
      node.style.display = text ? '' : 'none';
    }
  }

  function setHtmlById(id, html, hideIfEmpty) {
    var node = doc.getElementById(id);
    if (!node) return;
    var content = normalizeText(html) ? html : '';
    node.innerHTML = content;
    if (hideIfEmpty) {
      node.style.display = content ? '' : 'none';
    }
  }

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeDocumentUrl(value) {
    var url = normalizeText(value);
    if (!url) return '';
    if (/^(https?:)?\/\//i.test(url)) return url;
    return 'https://' + url.replace(/^\/+/, '');
  }

  function getOpenableDocumentUrl(value) {
    var url = normalizeDocumentUrl(value);
    if (!url) return '';
    return 'https://docs.google.com/gview?embedded=1&url=' + encodeURIComponent(url);
  }

  function countBookRows(groups) {
    return (Array.isArray(groups) ? groups : []).reduce(function (total, group) {
      return total + ((group && Array.isArray(group.rows)) ? group.rows.length : 0);
    }, 0);
  }

  function setPageIcons(type) {
    var icons = PAGE_ICONS[type];
    if (!icons) return;

    var heroIcon = doc.querySelector('.acad-hero-icon');
    if (heroIcon && !textOf(heroIcon)) {
      heroIcon.textContent = icons.hero || '';
    }

    Array.prototype.forEach.call(doc.querySelectorAll('.acad-tile-icon'), function (node, index) {
      if (!textOf(node) && icons.tiles[index]) {
        node.textContent = icons.tiles[index];
      }
    });
  }

  function extractContentData(item) {
    return item && item.data && typeof item.data === 'object' ? item.data : (item || {});
  }

  async function fetchJson(endpoint) {
    if (typeof window.fetchData === 'function') {
      return window.fetchData(endpoint);
    }
    var base = '/api';
    if (typeof window.resolveApiBase === 'function') {
      base = await window.resolveApiBase();
    }
    var response = await fetch(base + '/' + endpoint);
    if (!response.ok) throw new Error('Failed to fetch ' + endpoint);
    return response.json();
  }

  async function loadContent(key) {
    if (typeof window.loadContentBlock === 'function') {
      return window.loadContentBlock(key);
    }
    return fetchJson('content/' + key);
  }

  async function loadFaculty() {
    if (typeof window.loadFacultyData === 'function') {
      return window.loadFacultyData();
    }
    return fetchJson('faculty');
  }

  async function loadFormerHeadsPeople() {
    if (typeof window.loadManagementData === 'function') {
      return window.loadManagementData();
    }
    return fetchJson('management');
  }

  async function loadDocuments() {
    if (typeof window.loadDocumentsData === 'function') {
      return window.loadDocumentsData();
    }
    return fetchJson('documents');
  }

  function normalizeStats(items, fallback) {
    var source = Array.isArray(items) && items.length ? items : fallback;
    return source.map(function (item, index) {
      return {
        label: normalizeText(item && item.label),
        value: normalizeText(item && item.value),
        order: asNumber(item && item.order, index + 1)
      };
    }).filter(function (item) {
      return item.label || item.value;
    }).sort(function (a, b) {
      return a.order - b.order;
    });
  }

  function normalizeJourney(items, fallback) {
    var source = Array.isArray(items) && items.length ? items : fallback;
    return source.map(function (item, index) {
      if (typeof item === 'string') {
        return { text: normalizeText(item), order: index + 1 };
      }
      return {
        text: normalizeText(item && item.text),
        order: asNumber(item && item.order, index + 1)
      };
    }).filter(function (item) {
      return item.text;
    }).sort(function (a, b) {
      return a.order - b.order;
    });
  }

  function normalizeOverviewContent(item) {
    var raw = extractContentData(item);
    var defaults = DEFAULTS.overview;
    var rawIcons = raw.icons && typeof raw.icons === 'object' ? raw.icons : {};
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || defaults.bannerTitle,
      heroBadge: normalizeText(raw.heroBadge),
      heroTitle: normalizeText(raw.heroTitle) || defaults.heroTitle,
      heroDesc: normalizeText(raw.heroDesc || raw.heroText),
      icons: {
        faculty: normalizeText(rawIcons.faculty) || defaults.icons.faculty,
        circular: normalizeText(rawIcons.circular) || defaults.icons.circular,
        curriculum: normalizeText(rawIcons.curriculum) || defaults.icons.curriculum,
        calendar: normalizeText(rawIcons.calendar) || defaults.icons.calendar
      }
    };
  }

  function normalizeFacultyPageContent(item) {
    var raw = extractContentData(item);
    var defaults = DEFAULTS.faculty;
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || defaults.bannerTitle,
      pageTitle: normalizeText(raw.pageTitle || raw.heroTitle) || defaults.pageTitle,
      introText: normalizeText(raw.introText || raw.heroText),
      listTitle: normalizeText(raw.listTitle || raw.sectionTitle) || defaults.listTitle
    };
  }

  function normalizeFormerHeadsContent(item) {
    var raw = extractContentData(item);
    var defaults = DEFAULTS.formerHeads;
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || defaults.bannerTitle,
      heroBadge: normalizeText(raw.heroBadge),
      heroTitle: normalizeText(raw.heroTitle) || defaults.heroTitle,
      heroText: normalizeText(raw.heroText),
      legacyTitle: normalizeText(raw.legacyTitle),
      legacyText: normalizeText(raw.legacyText),
      stats: normalizeStats(raw.stats, defaults.stats),
      journeyTitle: normalizeText(raw.journeyTitle),
      journeyItems: normalizeJourney(raw.journeyItems, defaults.journeyItems)
    };
  }

  function normalizeCbseContent(item) {
    var raw = extractContentData(item);
    var defaults = DEFAULTS.cbse;
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || defaults.bannerTitle,
      badge: normalizeText(raw.badge),
      heroTitle: normalizeText(raw.heroTitle) || defaults.heroTitle,
      heroText: normalizeText(raw.heroDesc || raw.heroText),
      sectionTitle: normalizeText(raw.sectionTitle) || defaults.sectionTitle
    };
  }

  function normalizeSchoolCircularsContent(item) {
    var raw = extractContentData(item);
    var defaults = DEFAULTS.school;
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || defaults.bannerTitle,
      badge: normalizeText(raw.badge),
      heroTitle: normalizeText(raw.heroTitle) || defaults.heroTitle,
      heroText: normalizeText(raw.heroDesc || raw.heroText),
      academicYear: normalizeText(raw.academicYear),
      addressedTo: normalizeText(raw.addressedTo),
      distribution: normalizeText(raw.distribution),
      sectionTitle: normalizeText(raw.sectionTitle) || defaults.sectionTitle,
      guideTitle: normalizeText(raw.guideTitle),
      guideItems: Array.isArray(raw.guideItems) ? raw.guideItems.map(normalizeText).filter(Boolean) : defaults.guideItems
    };
  }

  function normalizeBookListContent(item) {
    var raw = extractContentData(item);
    var defaults = DEFAULTS.bookList;
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || defaults.bannerTitle,
      heroBadge: normalizeText(raw.heroBadge),
      heroTitle: normalizeText(raw.heroTitle) || defaults.heroTitle,
      heroText: normalizeText(raw.heroText),
      academicYear: normalizeText(raw.academicYear),
      sectionTitle: normalizeText(raw.sectionTitle) || defaults.sectionTitle,
      downloadTitle: normalizeText(raw.downloadTitle) || defaults.downloadTitle,
      downloadText: normalizeText(raw.downloadText),
      instructionsTitle: normalizeText(raw.instructionsTitle),
      instructionItems: Array.isArray(raw.instructionItems) ? raw.instructionItems.map(normalizeText).filter(Boolean) : defaults.instructionItems,
      classes: Array.isArray(raw.classes) ? raw.classes : defaults.classes
    };
  }

  function renderFormerHeadsStats(container, stats) {
    if (!container) return;
    if (!Array.isArray(stats) || !stats.length) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    container.style.display = '';
    container.innerHTML = stats.map(function (item) {
      return ''
        + '<div class="acad-tile">'
        + '<div class="acad-tile-icon"></div>'
        + '<div class="acad-tile-label">' + escapeHtml(item.label) + '</div>'
        + '<div class="acad-tile-value">' + escapeHtml(item.value) + '</div>'
        + '</div>';
    }).join('');
  }

  function renderFormerHeadsTimeline(container, items) {
    if (!container) return;
    if (!Array.isArray(items) || !items.length) {
      container.innerHTML = '<div class="head-item"><div class="head-name">Former head records will appear here.</div></div>';
      return;
    }

    container.innerHTML = items.map(function (item) {
      var period = normalizeText(item.period || item.role);
      var note = normalizeText(item.bio || item.contact);
      var photo = normalizeText(item.photo);
      var photoHtml = photo
        ? '<div style="width:64px;height:64px;border-radius:50%;overflow:hidden;flex-shrink:0;border:3px solid #c8960c;box-shadow:0 6px 16px rgba(14,107,107,0.12);background:#f9f6ef;"><img src="' + escapeHtml(photo) + '" alt="' + escapeHtml(item.name || 'Former Head') + '" style="width:100%;height:100%;object-fit:cover;" /></div>'
        : '';

      if (photoHtml) {
        return ''
          + '<div class="head-item">'
          + '<div style="display:flex;gap:16px;align-items:flex-start;">'
          + photoHtml
          + '<div>'
          + '<div class="head-period">' + escapeHtml(period) + '</div>'
          + '<div class="head-name">' + escapeHtml(item.name || '') + '</div>'
          + '<div class="head-note">' + escapeHtml(note) + '</div>'
          + '</div>'
          + '</div>'
          + '</div>';
      }

      return ''
        + '<div class="head-item">'
        + '<div class="head-period">' + escapeHtml(period) + '</div>'
        + '<div class="head-name">' + escapeHtml(item.name || '') + '</div>'
        + '<div class="head-note">' + escapeHtml(note) + '</div>'
        + '</div>';
    }).join('');
  }

  function renderFormerHeadsJourney(container, items) {
    if (!container) return;
    if (!Array.isArray(items) || !items.length) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    container.style.display = '';
    container.innerHTML = items.map(function (item) {
      return '<li>' + escapeHtml(item.text) + '</li>';
    }).join('');
  }

  function renderFacultyGrid(container, loading, items) {
    if (!container) return;
    if (!Array.isArray(items) || !items.length) {
      if (loading) {
        loading.textContent = 'Faculty information will appear here soon.';
        loading.style.display = 'block';
      }
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    if (loading) loading.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = items.map(function (item) {
      var name = normalizeText(item.name);
      var initials = name
        ? name.split(/\s+/).map(function (part) { return part.charAt(0); }).join('').substring(0, 2).toUpperCase()
        : '?';
      var photo = normalizeText(item.photo);
      var qualification = normalizeText(item.qualification || item.note);
      var experience = normalizeText(item.experience);
      return ''
        + '<div class="faculty-card">'
        + (photo
            ? '<img class="faculty-avatar faculty-avatar-photo" src="' + escapeHtml(photo) + '" alt="' + escapeHtml(name || 'Faculty') + '" />'
            : '<div class="faculty-avatar faculty-avatar-fallback">' + escapeHtml(initials) + '</div>')
        + '<div class="faculty-name">' + escapeHtml(name) + '</div>'
        + '<div class="faculty-subject">' + escapeHtml(item.subject || '') + '</div>'
        + '<div class="faculty-qual">' + escapeHtml(qualification) + '</div>'
        + '<div class="faculty-exp">' + escapeHtml(experience ? experience + ' Years Experience' : '') + '</div>'
        + '</div>';
    }).join('');
  }

  function renderCbseCircularsList(container, loading, items) {
    if (!container) return;
    if (!Array.isArray(items) || !items.length) {
      if (loading) {
        loading.textContent = 'No CBSE circulars have been published yet.';
        loading.style.display = 'block';
      }
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    if (loading) loading.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = items.map(function (item, index) {
      var sourceUrl = normalizeDocumentUrl(item.url || (item.meta && item.meta.url));
      var docUrl = getOpenableDocumentUrl(sourceUrl) || sourceUrl;
      var badge = normalizeText(item.type || (item.meta && item.meta.badge) || (index === 0 ? 'NEW' : 'CBSE'));
      var source = normalizeText(item.description || (item.meta && item.meta.source));
      var metaParts = [source, formatDisplayDate(getDocumentDateValue(item))].filter(Boolean);
      return ''
        + '<a href="' + escapeHtml(docUrl || '#') + '" target="_blank" rel="noopener noreferrer" class="circular-item" aria-label="Open circular PDF">'
        + '<div class="circ-icon"></div>'
        + '<div class="circ-body">'
        + '<div class="circ-title">' + escapeHtml(item.title || item.name || 'Untitled Circular') + '</div>'
        + '<div class="circ-meta">' + escapeHtml(metaParts.join(' · ')) + '</div>'
        + '</div>'
        + '<span class="circ-badge' + (index === 0 ? ' circ-new' : '') + '">' + escapeHtml(badge) + '</span>'
        + '</a>';
    }).join('');
  }

  function renderSchoolCircularsList(container, items) {
    if (!container) return;
    if (!Array.isArray(items) || !items.length) {
      container.innerHTML = '<div class="circular-item" style="cursor:default;"><div class="circ-icon"></div><div class="circ-body"><div class="circ-title">No school circulars published yet</div><div class="circ-meta">Published circulars will appear here.</div></div><span class="circ-badge">EMPTY</span></div>';
      return;
    }

    container.innerHTML = items.map(function (item) {
      var title = normalizeText(item.title || item.name) || 'Untitled Circular';
      var metaText = normalizeText(item.description || (item.meta && item.meta.source));
      var dateText = formatDisplayDate(getDocumentDateValue(item));
      var badge = normalizeText(item.meta && item.meta.badge) || 'NOTICE';
      var url = normalizeDocumentUrl(item.url);
      var tag = badge.toUpperCase() === 'LATEST' || badge.toUpperCase() === 'RECENT' ? ' circ-new' : '';
      var cardInner = ''
        + '<div class="circ-icon"></div>'
        + '<div class="circ-body">'
        + '<div class="circ-title">' + escapeHtml(title) + '</div>'
        + '<div class="circ-meta">' + escapeHtml([metaText, dateText].filter(Boolean).join(' · ')) + '</div>'
        + '</div>'
        + '<span class="circ-badge' + tag + '">' + escapeHtml(badge) + '</span>';

      if (url) {
        return '<a class="circular-item" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + cardInner + '</a>';
      }

      return '<div class="circular-item" style="cursor:default;">' + cardInner + '</div>';
    }).join('');
  }

  function renderBookListTable(container, groups) {
    if (!container) return;
    if (!Array.isArray(groups) || !groups.length) {
      container.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:18px;color:#5a6e6e;">Book list details will appear here.</td></tr>';
      return;
    }

    container.innerHTML = groups.map(function (group) {
      var rows = Array.isArray(group.rows) ? group.rows : [];
      var header = '<tr class="book-class-header"><td colspan="4"> ' + escapeHtml(group.title || 'Book List') + '</td></tr>';
      var items = rows.map(function (row) {
        return '<tr>'
          + '<td>' + escapeHtml(row.subject || '') + '</td>'
          + '<td>' + escapeHtml(row.title || '') + '</td>'
          + '<td>' + escapeHtml(row.publisher || '') + '</td>'
          + '<td>' + escapeHtml(row.className || '') + '</td>'
          + '</tr>';
      }).join('');
      return header + items;
    }).join('');
  }

  function isFormerHeadRecord(item) {
    if (!item || !normalizeText(item.name)) return false;
    var group = normalizeText(item.group).toLowerCase();
    var designation = normalizeText(item.designation).toLowerCase();
    var period = normalizeText(item.period || item.role);

    if (group === 'former-heads' || group === 'formerheads' || group === 'former_heads') return true;
    if (/former head|former principal|head of institution/.test(designation)) return true;
    if (/\b(19|20)\d{2}\b/.test(period)) return true;
    if (/(founding|present|term|phase|year)/i.test(period)) return true;
    return false;
  }

  async function initAcademicsOverviewPage() {
    if (!matchesPath([/\/academics$/, /\/academics\/index\.html$/])) return;

    var content = normalizeOverviewContent(await loadContent(ACADEMICS_MAIN_KEY));
    setTextById('academicsBannerTitle', content.bannerTitle);
    setTextById('academicsHeroBadge', content.heroBadge, true);
    setTextById('academicsHeroTitle', content.heroTitle, true);
    setTextById('academicsHeroDesc', content.heroDesc, true);

    ['faculty', 'circular', 'curriculum', 'calendar'].forEach(function (key) {
      Array.prototype.forEach.call(doc.querySelectorAll('[data-acad-icon="' + key + '"]'), function (node) {
        node.textContent = content.icons[key] || DEFAULTS.overview.icons[key] || '';
      });
    });

    document.title = (content.bannerTitle || DEFAULTS.overview.bannerTitle) + ' | Loretto Central School';
  }

  async function initFacultyPage() {
    if (!matchesPath([/\/academics\/1-faculty(\.html)?$/])) return;

    var pageContent = normalizeFacultyPageContent(await loadContent(FACULTY_PAGE_KEY));
    var faculty = await loadFaculty();
    console.log('[Academics] Faculty Page Content:', pageContent);
    console.log('[Academics] Faculty List Data:', faculty);

    var visibleFaculty = (Array.isArray(faculty) ? faculty : []).filter(function (item) {
      return item && item.visible !== false;
    }).sort(function (a, b) {
      return asNumber(a.order, 9999) - asNumber(b.order, 9999);
    });

    setTextById('facultyBannerTitle', pageContent.bannerTitle);
    setTextById('facultyPageTitle', pageContent.pageTitle, true);
    setTextById('facultyPageIntro', pageContent.introText, true);
    setTextById('facultyListTitle', pageContent.listTitle, true);
    renderFacultyGrid(doc.getElementById('faculty-grid'), doc.getElementById('faculty-loading'), visibleFaculty);
    document.title = (pageContent.bannerTitle || DEFAULTS.faculty.bannerTitle) + ' | Academics | Loretto Central School';
  }

  async function initFormerHeadsPage() {
    if (!matchesPath([/\/academics\/2-former-heads(\.html)?$/])) return;

    setPageIcons('former-heads');
    var content = normalizeFormerHeadsContent(await loadContent(FORMER_HEADS_KEY));
    var people = await loadFormerHeadsPeople();
    var formerHeads = (Array.isArray(people) ? people : []).filter(function (item) {
      return isFormerHeadRecord(item) && item.visible !== false;
    }).sort(function (a, b) {
      return asNumber(a.order, 9999) - asNumber(b.order, 9999);
    });

    setTextById('formerHeadsBannerTitle', content.bannerTitle);
    setTextById('formerHeadsHeroBadge', content.heroBadge, true);
    setTextById('formerHeadsHeroTitle', content.heroTitle, true);
    setTextById('formerHeadsHeroText', content.heroText, true);
    setTextById('formerHeadsLegacyTitle', content.legacyTitle, true);
    setTextById('formerHeadsLegacyText', content.legacyText, true);
    setTextById('formerHeadsJourneyTitle', content.journeyTitle, true);
    renderFormerHeadsStats(doc.getElementById('formerHeadsStats'), content.stats);
    renderFormerHeadsTimeline(doc.getElementById('formerHeadsTimeline'), formerHeads);
    renderFormerHeadsJourney(doc.getElementById('formerHeadsJourneyList'), content.journeyItems);
    document.title = (content.bannerTitle || DEFAULTS.formerHeads.bannerTitle) + ' | Academics | Loretto Central School';
  }

  async function initCbseCircularsPage() {
    if (!matchesPath([/\/academics\/3-cbse-circulars(\.html)?$/])) return;

    setPageIcons('cbse-circulars');
    var content = normalizeCbseContent(await loadContent(CBSE_CIRCULARS_KEY));
    var docs = await loadDocuments();
    console.log('[Academics] Total Documents fetched:', docs ? docs.length : 0);
    var circulars = (Array.isArray(docs) ? docs : []).filter(function (item) {
      return item && item.category === 'cbse-circular' && item.visible !== false;
    }).sort(function (a, b) {
      var orderDiff = asNumber(a.order, 9999) - asNumber(b.order, 9999);
      if (orderDiff !== 0) return orderDiff;
      return getDocumentTimestamp(b) - getDocumentTimestamp(a);
    });
    console.log('[Academics] Filtered CBSE Circulars:', circulars.length);

    setTextById('cbseBannerTitle', content.bannerTitle);
    setTextById('cbseBadge', content.badge, true);
    setTextById('cbseHeroTitle', content.heroTitle, true);
    setTextById('cbseHeroText', content.heroText, true);
    setTextById('cbseSectionTitle', content.sectionTitle, true);
    renderCbseCircularsList(doc.getElementById('cbseCircularsList'), doc.getElementById('cbseCircularsLoading'), circulars);
    document.title = (content.bannerTitle || DEFAULTS.cbse.bannerTitle) + ' | Academics | Loretto Central School';
  }

  async function initSchoolCircularsPage() {
    if (!matchesPath([/\/academics\/4-school-circulars(\.html)?$/])) return;

    setPageIcons('school-circulars');
    var content = normalizeSchoolCircularsContent(await loadContent(SCHOOL_CIRCULARS_KEY));
    var docs = await loadDocuments();
    var circulars = (Array.isArray(docs) ? docs : []).filter(function (item) {
      return item && item.category === 'school-circular' && item.visible !== false;
    }).sort(function (a, b) {
      var orderDiff = asNumber(a.order, 9999) - asNumber(b.order, 9999);
      if (orderDiff !== 0) return orderDiff;
      return getDocumentTimestamp(b) - getDocumentTimestamp(a);
    });

    setTextById('schoolCircularsBannerTitle', content.bannerTitle);
    setTextById('schoolCircularsBadge', content.badge, true);
    setTextById('schoolCircularsHeroTitle', content.heroTitle, true);
    setTextById('schoolCircularsHeroText', content.heroText, true);
    setTextById('schoolCircularsAcademicYear', content.academicYear);
    setTextById('schoolCircularsAddressedTo', content.addressedTo);
    setTextById('schoolCircularsDistribution', content.distribution);
    setTextById('schoolCircularsSectionTitle', content.sectionTitle, true);
    setTextById('schoolCircularsGuideTitle', content.guideTitle, true);
    setHtmlById('schoolCircularsGuideList', content.guideItems.map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join(''), true);
    setTextById('schoolCircularsCount', circulars.length ? String(circulars.length) : '0');
    renderSchoolCircularsList(doc.getElementById('schoolCircularsList'), circulars);
    document.title = (content.bannerTitle || DEFAULTS.school.bannerTitle) + ' | Academics | Loretto Central School';
  }

  async function initBookListPage() {
    if (!matchesPath([/\/academics\/5-book-list(\.html)?$/])) return;

    setPageIcons('book-list');
    var content = normalizeBookListContent(await loadContent(BOOK_LIST_KEY));
    var docs = await loadDocuments();
    var pdfDoc = (Array.isArray(docs) ? docs : []).filter(function (item) {
      return item && item.category === 'book-list' && item.visible !== false;
    })[0] || null;
    var classGroups = Array.isArray(content.classes) ? content.classes : [];
    var bookCount = countBookRows(classGroups);
    var academicYear = normalizeText(content.academicYear || (pdfDoc && pdfDoc.meta && pdfDoc.meta.academicYear));
    var downloadUrl = normalizeDocumentUrl(pdfDoc && pdfDoc.url);
    var titleFromPdf = normalizeText(pdfDoc && pdfDoc.title);

    setTextById('bookListBannerTitle', titleFromPdf || content.bannerTitle);
    setTextById('bookListHeroBadge', content.heroBadge, true);
    setTextById('bookListHeroTitle', titleFromPdf || content.heroTitle, true);
    setTextById('bookListHeroText', content.heroText, true);
    setTextById('bookListGroupCount', classGroups.length ? String(classGroups.length) : '0');
    setTextById('bookListBookCount', bookCount ? String(bookCount) : '0');
    setTextById('bookListAcademicYear', academicYear);
    setTextById('bookListPdfStatus', downloadUrl ? 'Available' : 'Pending');
    setTextById('bookListSectionTitle', content.sectionTitle, true);
    setTextById('bookListDownloadTitle', titleFromPdf ? 'Download ' + titleFromPdf + ' - PDF' : content.downloadTitle, true);
    setTextById('bookListDownloadText', content.downloadText, true);
    setTextById('bookListInstructionsTitle', content.instructionsTitle, true);
    setHtmlById('bookListInstructionsList', content.instructionItems.map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join(''), true);
    renderBookListTable(doc.getElementById('bookListTableBody'), classGroups);

    var downloadLink = doc.getElementById('bookListDownloadLink');
    if (downloadLink) {
      if (downloadUrl) {
        downloadLink.href = downloadUrl;
        downloadLink.target = '_blank';
        downloadLink.rel = 'noopener noreferrer';
        downloadLink.style.display = '';
      } else {
        downloadLink.removeAttribute('href');
        downloadLink.style.display = 'none';
      }
    }

    document.title = (titleFromPdf || content.bannerTitle || DEFAULTS.bookList.bannerTitle) + ' | Academics | Loretto Central School';
  }

  function boot() {
    Promise.allSettled([
      initAcademicsOverviewPage(),
      initFacultyPage(),
      initFormerHeadsPage(),
      initCbseCircularsPage(),
      initSchoolCircularsPage(),
      initBookListPage()
    ]).then(function (results) {
      results.forEach(function (result) {
        if (result.status === 'rejected') {
          console.error('[academics-page-loader]', result.reason);
        }
      });
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
