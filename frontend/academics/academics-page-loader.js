(function () {
  var FORMER_HEADS_KEY = 'academics.former-heads';
  var SCHOOL_CIRCULARS_KEY = 'academics.school-circulars';
  var BOOK_LIST_KEY = 'academics.book-list';
  var SCHOOL_CIRCULARS_DEFAULTS = {
    bannerTitle: 'School Circulars',
    badge: 'Internal Notices · Academic Year 2024–25',
    heroTitle: 'School Circulars',
    heroText: "Official circulars, notices, and announcements issued by Loretto Central School's administration to students, parents, and staff are published here. All circulars are organised by date, newest first.",
    academicYear: '2024 – 2025',
    addressedTo: 'Parents · Students · Staff',
    distribution: 'School Diary & Website',
    sectionTitle: 'Recent School Circulars',
    guideTitle: 'How to Receive Circulars',
    guideItems: [
      "All circulars are pasted in the student's school diary — please check daily",
      'Important circulars are posted on this page and the school notice board',
      'Urgent notices may be communicated via SMS or phone call to registered parent numbers',
      'Parents are requested to acknowledge receipt of circulars with signature in the diary'
    ]
  };
  var BOOK_LIST_DEFAULTS = {
    bannerTitle: 'Book List 2024–25',
    heroBadge: 'Academic Year 2024–25 · CBSE Prescribed',
    heroTitle: 'Book List 2024–25',
    heroText: 'The prescribed textbooks and stationery list for all classes at Loretto Central School for the Academic Year 2024–25. All textbooks are NCERT / CBSE approved. Parents are requested to purchase only the books listed below.',
    academicYear: '2024 – 2025',
    sectionTitle: 'Prescribed Book List by Class',
    downloadTitle: 'Download Official Book List — PDF',
    downloadText: "The school's official prescribed book list as shared with parents at the beginning of the academic year.",
    instructionsTitle: 'Important Instructions',
    instructionItems: [
      'Purchase only NCERT and school-approved books — do not buy any additional guides or workbooks without school permission',
      'Second-hand NCERT books in good condition are permitted — verify the correct edition before purchasing',
      "All books must be covered with brown paper and labelled with student's name, class, and roll number",
      'Notebooks and stationery requirements will be communicated separately by class teachers at the start of the year',
      'Book lists are subject to minor revision — final list will be confirmed at the time of admission / re-enrollment'
    ]
  };

  function textOf(node) {
    return node ? String(node.textContent || '').trim() : '';
  }

  function escapeHtml(value) {
    return (value == null ? '' : String(value))
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

  function normalizeText(value) {
    return value == null ? '' : String(value).trim();
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

  async function fetchJson(endpoint) {
    var base = '/api';
    if (typeof window.resolveApiBase === 'function') {
      base = await window.resolveApiBase();
    }
    var response = await fetch(base + '/' + endpoint);
    if (!response.ok) throw new Error('Failed to fetch ' + endpoint);
    return response.json();
  }

  async function loadFormerHeadsContent() {
    if (typeof window.loadContentBlock === 'function') {
      return window.loadContentBlock(FORMER_HEADS_KEY);
    }
    return fetchJson('content/' + FORMER_HEADS_KEY);
  }

  async function loadSchoolCircularsContent() {
    if (typeof window.loadContentBlock === 'function') {
      return window.loadContentBlock(SCHOOL_CIRCULARS_KEY);
    }
    return fetchJson('content/' + SCHOOL_CIRCULARS_KEY);
  }

  async function loadBookListContent() {
    if (typeof window.loadContentBlock === 'function') {
      return window.loadContentBlock(BOOK_LIST_KEY);
    }
    return fetchJson('content/' + BOOK_LIST_KEY);
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

  function collectFormerHeadsFallback(doc) {
    return {
      bannerTitle: textOf(doc.getElementById('formerHeadsBannerTitle')),
      heroBadge: textOf(doc.getElementById('formerHeadsHeroBadge')),
      heroTitle: textOf(doc.getElementById('formerHeadsHeroTitle')),
      heroText: textOf(doc.getElementById('formerHeadsHeroText')),
      legacyTitle: textOf(doc.getElementById('formerHeadsLegacyTitle')),
      legacyText: textOf(doc.getElementById('formerHeadsLegacyText')),
      stats: Array.prototype.map.call(doc.querySelectorAll('#formerHeadsStats .acad-tile'), function (tile, index) {
        return {
          label: textOf(tile.querySelector('.acad-tile-label')),
          value: textOf(tile.querySelector('.acad-tile-value')),
          order: index + 1
        };
      }),
      journeyTitle: textOf(doc.getElementById('formerHeadsJourneyTitle')),
      journeyItems: Array.prototype.map.call(doc.querySelectorAll('#formerHeadsJourneyList li'), function (item, index) {
        return {
          text: textOf(item),
          order: index + 1
        };
      })
    };
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

  function mergeFormerHeadsContent(stored, fallback) {
    var raw = stored && stored.data && typeof stored.data === 'object' ? stored.data : (stored || {});
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || fallback.bannerTitle,
      heroBadge: normalizeText(raw.heroBadge) || fallback.heroBadge,
      heroTitle: normalizeText(raw.heroTitle) || fallback.heroTitle,
      heroText: normalizeText(raw.heroText) || fallback.heroText,
      legacyTitle: normalizeText(raw.legacyTitle) || fallback.legacyTitle,
      legacyText: normalizeText(raw.legacyText) || fallback.legacyText,
      stats: normalizeStats(raw.stats, fallback.stats),
      journeyTitle: normalizeText(raw.journeyTitle) || fallback.journeyTitle,
      journeyItems: normalizeJourney(raw.journeyItems, fallback.journeyItems)
    };
  }

  function collectSchoolCircularsFallback(doc) {
    return {
      bannerTitle: textOf(doc.getElementById('schoolCircularsBannerTitle')) || SCHOOL_CIRCULARS_DEFAULTS.bannerTitle,
      badge: textOf(doc.getElementById('schoolCircularsBadge')) || SCHOOL_CIRCULARS_DEFAULTS.badge,
      heroTitle: textOf(doc.getElementById('schoolCircularsHeroTitle')) || SCHOOL_CIRCULARS_DEFAULTS.heroTitle,
      heroText: textOf(doc.getElementById('schoolCircularsHeroText')) || SCHOOL_CIRCULARS_DEFAULTS.heroText,
      academicYear: textOf(doc.getElementById('schoolCircularsAcademicYear')) || SCHOOL_CIRCULARS_DEFAULTS.academicYear,
      addressedTo: textOf(doc.getElementById('schoolCircularsAddressedTo')) || SCHOOL_CIRCULARS_DEFAULTS.addressedTo,
      distribution: textOf(doc.getElementById('schoolCircularsDistribution')) || SCHOOL_CIRCULARS_DEFAULTS.distribution,
      sectionTitle: textOf(doc.getElementById('schoolCircularsSectionTitle')) || SCHOOL_CIRCULARS_DEFAULTS.sectionTitle,
      guideTitle: textOf(doc.getElementById('schoolCircularsGuideTitle')) || SCHOOL_CIRCULARS_DEFAULTS.guideTitle,
      guideItems: Array.prototype.map.call(doc.querySelectorAll('#schoolCircularsGuideList li'), function (item) {
        return textOf(item);
      }).filter(Boolean)
    };
  }

  function collectBookListFallback(doc) {
    var groups = [];
    var current = null;
    Array.prototype.forEach.call(doc.querySelectorAll('#bookListTableBody tr'), function (row) {
      if (row.classList.contains('book-class-header')) {
        current = {
          title: textOf(row.querySelector('td')),
          rows: []
        };
        groups.push(current);
        return;
      }
      var cells = row.querySelectorAll('td');
      if (!cells.length) return;
      if (!current) {
        current = { title: 'Book List', rows: [] };
        groups.push(current);
      }
      current.rows.push({
        subject: textOf(cells[0]),
        title: textOf(cells[1]),
        publisher: textOf(cells[2]),
        className: textOf(cells[3])
      });
    });
    return {
      bannerTitle: textOf(doc.getElementById('bookListBannerTitle')) || BOOK_LIST_DEFAULTS.bannerTitle,
      heroBadge: textOf(doc.getElementById('bookListHeroBadge')) || BOOK_LIST_DEFAULTS.heroBadge,
      heroTitle: textOf(doc.getElementById('bookListHeroTitle')) || BOOK_LIST_DEFAULTS.heroTitle,
      heroText: textOf(doc.getElementById('bookListHeroText')) || BOOK_LIST_DEFAULTS.heroText,
      academicYear: textOf(doc.getElementById('bookListAcademicYear')) || BOOK_LIST_DEFAULTS.academicYear,
      sectionTitle: textOf(doc.getElementById('bookListSectionTitle')) || BOOK_LIST_DEFAULTS.sectionTitle,
      downloadTitle: textOf(doc.getElementById('bookListDownloadTitle')) || BOOK_LIST_DEFAULTS.downloadTitle,
      downloadText: textOf(doc.getElementById('bookListDownloadText')) || BOOK_LIST_DEFAULTS.downloadText,
      instructionsTitle: textOf(doc.getElementById('bookListInstructionsTitle')) || BOOK_LIST_DEFAULTS.instructionsTitle,
      instructionItems: Array.prototype.map.call(doc.querySelectorAll('#bookListInstructionsList li'), function (item) {
        return textOf(item);
      }).filter(Boolean),
      classes: groups
    };
  }

  function mergeSchoolCircularsContent(stored, fallback) {
    var raw = stored && stored.data && typeof stored.data === 'object' ? stored.data : (stored || {});
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || fallback.bannerTitle,
      badge: normalizeText(raw.badge) || fallback.badge,
      heroTitle: normalizeText(raw.heroTitle) || fallback.heroTitle,
      heroText: normalizeText(raw.heroDesc || raw.heroText) || fallback.heroText,
      academicYear: normalizeText(raw.academicYear) || fallback.academicYear,
      addressedTo: normalizeText(raw.addressedTo) || fallback.addressedTo,
      distribution: normalizeText(raw.distribution) || fallback.distribution,
      sectionTitle: normalizeText(raw.sectionTitle) || fallback.sectionTitle,
      guideTitle: normalizeText(raw.guideTitle) || fallback.guideTitle || SCHOOL_CIRCULARS_DEFAULTS.guideTitle,
      guideItems: Array.isArray(raw.guideItems) && raw.guideItems.length
        ? raw.guideItems.map(normalizeText).filter(Boolean)
        : ((Array.isArray(fallback.guideItems) && fallback.guideItems.length ? fallback.guideItems : SCHOOL_CIRCULARS_DEFAULTS.guideItems).map(normalizeText).filter(Boolean))
    };
  }

  function mergeBookListContent(stored, fallback) {
    var raw = stored && stored.data && typeof stored.data === 'object' ? stored.data : (stored || {});
    return {
      bannerTitle: normalizeText(raw.bannerTitle) || fallback.bannerTitle,
      heroBadge: normalizeText(raw.heroBadge) || fallback.heroBadge,
      heroTitle: normalizeText(raw.heroTitle) || fallback.heroTitle,
      heroText: normalizeText(raw.heroText) || fallback.heroText,
      academicYear: normalizeText(raw.academicYear) || fallback.academicYear,
      sectionTitle: normalizeText(raw.sectionTitle) || fallback.sectionTitle,
      downloadTitle: normalizeText(raw.downloadTitle) || fallback.downloadTitle,
      downloadText: normalizeText(raw.downloadText) || fallback.downloadText,
      instructionsTitle: normalizeText(raw.instructionsTitle) || fallback.instructionsTitle,
      instructionItems: Array.isArray(raw.instructionItems) && raw.instructionItems.length
        ? raw.instructionItems.map(normalizeText).filter(Boolean)
        : (Array.isArray(fallback.instructionItems) && fallback.instructionItems.length ? fallback.instructionItems : BOOK_LIST_DEFAULTS.instructionItems),
      classes: Array.isArray(raw.classes) && raw.classes.length ? raw.classes : fallback.classes
    };
  }

  function renderFormerHeadsStats(container, stats) {
    if (!container) return;
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
    if (!container || !items.length) return;
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
    if (!container || !items.length) return;
    container.innerHTML = items.map(function (item) {
      return '<li>' + escapeHtml(item.text) + '</li>';
    }).join('');
  }

  async function initFormerHeadsPage() {
    if (!//academics/2-former-heads/.test(window.location.pathname)) return;

    var doc = document;
    var fallback = collectFormerHeadsFallback(doc);

    try {
      var content = await loadFormerHeadsContent();
      var merged = mergeFormerHeadsContent(content, fallback);

      if (doc.getElementById('formerHeadsBannerTitle')) doc.getElementById('formerHeadsBannerTitle').textContent = merged.bannerTitle;
      if (doc.getElementById('formerHeadsHeroBadge')) {
        doc.getElementById('formerHeadsHeroBadge').textContent = merged.heroBadge;
        doc.getElementById('formerHeadsHeroBadge').style.display = merged.heroBadge ? 'inline-block' : 'none';
      }
      if (doc.getElementById('formerHeadsHeroTitle')) doc.getElementById('formerHeadsHeroTitle').textContent = merged.heroTitle;
      if (doc.getElementById('formerHeadsHeroText')) doc.getElementById('formerHeadsHeroText').textContent = merged.heroText;
      if (doc.getElementById('formerHeadsLegacyTitle')) doc.getElementById('formerHeadsLegacyTitle').textContent = merged.legacyTitle;
      if (doc.getElementById('formerHeadsLegacyText')) doc.getElementById('formerHeadsLegacyText').textContent = merged.legacyText;
      if (doc.getElementById('formerHeadsJourneyTitle')) doc.getElementById('formerHeadsJourneyTitle').textContent = merged.journeyTitle;
      renderFormerHeadsStats(doc.getElementById('formerHeadsStats'), merged.stats);
      renderFormerHeadsJourney(doc.getElementById('formerHeadsJourneyList'), merged.journeyItems);

      if (merged.bannerTitle) {
        document.title = merged.bannerTitle + ' | Academics | Loretto Central School';
      }
    } catch (error) {
      console.error('Could not load Former Heads page content:', error);
    }

    try {
      var people = await loadFormerHeadsPeople();
      var formerHeads = (Array.isArray(people) ? people : []).filter(function (item) {
        return isFormerHeadRecord(item) && item.visible !== false;
      }).sort(function (a, b) {
        return asNumber(a.order, 9999) - asNumber(b.order, 9999);
      });

      if (formerHeads.length) {
        renderFormerHeadsTimeline(doc.getElementById('formerHeadsTimeline'), formerHeads);
      }
    } catch (error) {
      console.error('Could not load Former Heads timeline data:', error);
    }
  }

  function renderSchoolCircularsList(container, items) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<div class="circular-item" style="cursor:default;"><div class="circ-icon"></div><div class="circ-body"><div class="circ-title">No school circulars published yet</div><div class="circ-meta">Add school circulars from the admin panel to show them here.</div></div><span class="circ-badge">EMPTY</span></div>';
      return;
    }
    container.innerHTML = items.map(function (item) {
      var title = normalizeText(item.title || item.name) || 'Untitled Circular';
      var metaText = normalizeText(item.description || (item.meta && item.meta.source) || 'Loretto Central School');
      var dateText = formatDisplayDate(item.date);
      var badge = normalizeText(item.meta && item.meta.badge) || 'NOTICE';
      var url = normalizeText(item.url);
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
    if (!Array.isArray(groups) || !groups.length) return;
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

  async function initBookListPage() {
    if (!//academics/5-book-list/.test(window.location.pathname)) return;

    var doc = document;
    var fallback = collectBookListFallback(doc);

    try {
      var content = await loadBookListContent();
      var merged = mergeBookListContent(content, fallback);

      if (doc.getElementById('bookListBannerTitle')) doc.getElementById('bookListBannerTitle').textContent = merged.bannerTitle;
      if (doc.getElementById('bookListHeroBadge')) doc.getElementById('bookListHeroBadge').textContent = merged.heroBadge;
      if (doc.getElementById('bookListHeroTitle')) doc.getElementById('bookListHeroTitle').textContent = merged.heroTitle;
      if (doc.getElementById('bookListHeroText')) doc.getElementById('bookListHeroText').textContent = merged.heroText;
      if (doc.getElementById('bookListAcademicYear')) doc.getElementById('bookListAcademicYear').textContent = merged.academicYear;
      if (doc.getElementById('bookListSectionTitle')) doc.getElementById('bookListSectionTitle').textContent = merged.sectionTitle;
      if (doc.getElementById('bookListDownloadTitle')) doc.getElementById('bookListDownloadTitle').textContent = merged.downloadTitle;
      if (doc.getElementById('bookListDownloadText')) doc.getElementById('bookListDownloadText').textContent = merged.downloadText;
      if (doc.getElementById('bookListInstructionsTitle')) doc.getElementById('bookListInstructionsTitle').textContent = merged.instructionsTitle;
      if (doc.getElementById('bookListInstructionsList')) {
        doc.getElementById('bookListInstructionsList').innerHTML = merged.instructionItems.map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('');
      }
      renderBookListTable(doc.getElementById('bookListTableBody'), merged.classes);

      if (merged.bannerTitle) document.title = merged.bannerTitle + ' | Academics | Loretto Central School';
    } catch (error) {
      console.error('Could not load Book List content:', error);
    }

    try {
      var docs = await loadDocuments();
      var pdfDoc = (Array.isArray(docs) ? docs : []).filter(function (item) {
        return item && item.category === 'book-list' && item.visible !== false;
      })[0] || null;

      if (pdfDoc) {
        var academicYear = normalizeText(pdfDoc.meta && pdfDoc.meta.academicYear);
        if (doc.getElementById('bookListBannerTitle') && normalizeText(pdfDoc.title)) doc.getElementById('bookListBannerTitle').textContent = normalizeText(pdfDoc.title);
        if (doc.getElementById('bookListHeroTitle') && normalizeText(pdfDoc.title)) doc.getElementById('bookListHeroTitle').textContent = normalizeText(pdfDoc.title);
        if (doc.getElementById('bookListAcademicYear') && academicYear) doc.getElementById('bookListAcademicYear').textContent = academicYear.replace(/-/g, '–');
        if (doc.getElementById('bookListDownloadTitle') && normalizeText(pdfDoc.title)) doc.getElementById('bookListDownloadTitle').textContent = 'Download ' + normalizeText(pdfDoc.title) + ' — PDF';
        if (doc.getElementById('bookListDownloadLink') && normalizeText(pdfDoc.url)) {
          doc.getElementById('bookListDownloadLink').href = normalizeText(pdfDoc.url);
          doc.getElementById('bookListDownloadLink').target = '_blank';
          doc.getElementById('bookListDownloadLink').rel = 'noopener noreferrer';
        }
      }
    } catch (error) {
      console.error('Could not load Book List PDF:', error);
    }
  }

  async function initSchoolCircularsPage() {
    if (!//academics/4-school-circulars/.test(window.location.pathname)) return;

    var doc = document;
    var fallback = collectSchoolCircularsFallback(doc);

    try {
      var content = await loadSchoolCircularsContent();
      var merged = mergeSchoolCircularsContent(content, fallback);

      if (doc.getElementById('schoolCircularsBannerTitle')) doc.getElementById('schoolCircularsBannerTitle').textContent = merged.bannerTitle;
      if (doc.getElementById('schoolCircularsBadge')) doc.getElementById('schoolCircularsBadge').textContent = merged.badge;
      if (doc.getElementById('schoolCircularsHeroTitle')) doc.getElementById('schoolCircularsHeroTitle').textContent = merged.heroTitle;
      if (doc.getElementById('schoolCircularsHeroText')) doc.getElementById('schoolCircularsHeroText').textContent = merged.heroText;
      if (doc.getElementById('schoolCircularsAcademicYear')) doc.getElementById('schoolCircularsAcademicYear').textContent = merged.academicYear;
      if (doc.getElementById('schoolCircularsAddressedTo')) doc.getElementById('schoolCircularsAddressedTo').textContent = merged.addressedTo;
      if (doc.getElementById('schoolCircularsDistribution')) doc.getElementById('schoolCircularsDistribution').textContent = merged.distribution;
      if (doc.getElementById('schoolCircularsSectionTitle')) doc.getElementById('schoolCircularsSectionTitle').textContent = merged.sectionTitle;
      if (doc.getElementById('schoolCircularsGuideTitle')) {
        doc.getElementById('schoolCircularsGuideTitle').textContent = merged.guideTitle;
        doc.getElementById('schoolCircularsGuideTitle').style.display = merged.guideTitle ? '' : 'none';
      }
      if (doc.getElementById('schoolCircularsGuideList')) {
        var guideItems = Array.isArray(merged.guideItems) ? merged.guideItems.filter(Boolean) : [];
        doc.getElementById('schoolCircularsGuideList').innerHTML = guideItems.map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('');
        doc.getElementById('schoolCircularsGuideList').style.display = guideItems.length ? '' : 'none';
      }
      if (merged.bannerTitle) document.title = merged.bannerTitle + ' | Academics | Loretto Central School';
    } catch (error) {
      console.error('Could not load School Circulars page content:', error);
    }

    try {
      var docs = await loadDocuments();
      var schoolCirculars = (Array.isArray(docs) ? docs : []).filter(function (item) {
        return item && item.category === 'school-circular' && item.visible !== false;
      }).sort(function (a, b) {
        var orderDiff = asNumber(a.order, 9999) - asNumber(b.order, 9999);
        if (orderDiff !== 0) return orderDiff;
        var aTime = a.date ? new Date(a.date).getTime() : 0;
        var bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      });

      if (doc.getElementById('schoolCircularsCount')) {
        doc.getElementById('schoolCircularsCount').textContent = schoolCirculars.length ? String(schoolCirculars.length) : 'Throughout Year';
      }

      renderSchoolCircularsList(doc.getElementById('schoolCircularsList'), schoolCirculars);
    } catch (error) {
      console.error('Could not load School Circulars documents:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFormerHeadsPage();
      initSchoolCircularsPage();
      initBookListPage();
    });
  } else {
    initFormerHeadsPage();
    initSchoolCircularsPage();
    initBookListPage();
  }
})();
