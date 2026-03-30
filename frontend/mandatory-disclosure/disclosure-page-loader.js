(function () {
  'use strict';

  var PDF_ENABLED_PAGES = {
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
    9: true, 10: true, 12: true, 13: true, 14: true, 15: true, 16: true,
    17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true
  };
  var DISCLOSURE_PAGES = {
    1: { title: 'School Name Change Order', file: '1-school-name-change-order.html' },
    2: { title: 'Affiliation Letter', file: '2-affiliation-letter.html' },
    3: { title: 'SARAS Mandatory Document', file: '3-saras-mandatory-document.html' },
    4: { title: 'Building Plan', file: '4-building-plan.html' },
    5: { title: 'Affidavit', file: '5-affidavit.html' },
    6: { title: 'Building Safety Certificate', file: '6-building-safety.html' },
    7: { title: 'Land Certificate', file: '7-land-certificate.html' },
    8: { title: 'Fire Safety Certificate', file: '8-fire-safety.html' },
    9: { title: 'DEO Certificate', file: '9-deo-certificate.html' },
    10: { title: 'Recognition Renewal Certificate', file: '10-recognition-renewal-certificate.html' },
    11: { title: 'Mandatory Disclosure Link', file: '11-mandatory-disclosure-link.html' },
    12: { title: 'No Objection Certificate', file: '12-no-objection-certificate.html' },
    13: { title: 'Lease Deed Certificate', file: '13-lease-deed-certificate.html' },
    14: { title: 'Safe Drinking Water Certificate', file: '14-safe-drinking-water.html' },
    15: { title: 'Society Registration Certificate', file: '15-society-registration.html' },
    16: { title: 'Water Health & Sanitation', file: '16-water-health-sanitation.html' },
    17: { title: 'Academic Calendar', file: '17-calendar.html' },
    18: { title: 'Management Committee', file: '18-management-committee.html' },
    19: { title: 'PTA Committee', file: '19-pta-committee.html' },
    20: { title: 'School Fee Structure', file: '20-school-fee-structure.html' },
    21: { title: 'SSLC / Board Results', file: '21-sslc-results.html' },
    22: { title: 'Local Mgmt Committee', file: '22-school-local-management-committee.html' },
    23: { title: 'Teachers Information', file: '23-teachers-information.html' }
  };

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

  function formatTextHtml(value) {
    return escapeHtml(normalizeText(value)).replace(/\n/g, '<br>');
  }

  function normalizeDocumentUrl(value) {
    var url = normalizeText(value);
    if (!url) return '';
    if (/^(https?:)?\/\//i.test(url)) return url;
    return 'https://' + url.replace(/^\/+/, '');
  }

  function fileExtension(url) {
    var clean = normalizeDocumentUrl(url).split('?')[0].split('#')[0];
    var parts = clean.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  }

  function buildCloudinaryAttachmentUrl(url) {
    var clean = normalizeDocumentUrl(url);
    if (!clean) return '';
    if (!/res\.cloudinary\.com/i.test(clean)) return clean;
    if (/\/fl_attachment(?:\/|,)/i.test(clean)) return clean;
    return clean.replace(/\/((?:image|raw|video)\/upload\/)/i, '/$1fl_attachment/');
  }

  function getViewableDocumentUrl(url) {
    var clean = normalizeDocumentUrl(url);
    if (!clean) return '';
    // User requested direct Cloudinary links, so we bypass the embedded viewer
    return clean;
  }

  function getDownloadableDocumentUrl(url) {
    var clean = normalizeDocumentUrl(url);
    if (!clean) return '';
    return buildCloudinaryAttachmentUrl(clean);
  }

  function hasOwn(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }

  function fileName() {
    var parts = window.location.pathname.split('/');
    var f = parts[parts.length - 1] || '';
    if (f && !/\\.html$/i.test(f) && !/[?#]/.test(f)) f += '.html';
    return f;
  }

  function currentPageNumber() {
    var match = fileName().match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function isDisclosureOverviewPage() {
    var name = fileName().toLowerCase();
    return name === 'mandatory-disclosure.html' || name === 'disclosure.html';
  }

  function pageMeta(pageNum) {
    return DISCLOSURE_PAGES[pageNum] || null;
  }

  async function resolveApiBase() {
    if (typeof window.resolveApiBase === 'function') {
      try {
        return await window.resolveApiBase();
      } catch (error) {
        /* fall through */
      }
    }

    var origin = window.location.origin.replace(/\/+$/, '');
    var candidates = [
      '/api',
      origin + '/api',
      'https://lcscbse-production.up.railway.app/api',
      'http://localhost:3000/api',
      'http://127.0.0.1:3000/api'
    ];

    for (var i = 0; i < candidates.length; i += 1) {
      var base = String(candidates[i] || '').replace(/\/+$/, '');
      if (!base) continue;
      try {
        var response = await fetch(base + '/health', { method: 'GET', mode: 'cors' });
        if (response.ok) return base;
      } catch (error) {
        /* ignore probe failures */
      }
    }

    return '/api';
  }

  async function fetchJson(endpoint) {
    try {
      if (typeof window.fetchData === 'function') {
        return await window.fetchData(endpoint);
      }
      var base = await resolveApiBase();
      var response = await fetch(String(base).replace(/\/+$/, '') + '/' + String(endpoint || '').replace(/^\/+/, ''));
      if (!response.ok) return null;
      return await response.json().catch(function () { return null; });
    } catch (error) {
      return null;
    }
  }

  async function loadDisclosureSettings() {
    if (typeof window.loadSettingData === 'function') {
      var settingsPayload = await window.loadSettingData('disclosure-pages');
      return settingsPayload && settingsPayload.data ? settingsPayload.data : (settingsPayload || {});
    }
    var payload = await fetchJson('settings/disclosure-pages');
    return payload && payload.data ? payload.data : (payload || {});
  }

  async function loadDisclosureDocumentsCollection() {
    var payload = null;
    if (typeof window.loadDocumentsData === 'function') {
      payload = await window.loadDocumentsData();
    } else {
      payload = await fetchJson('documents');
    }
    return Array.isArray(payload) ? payload : [];
  }

  async function loadDisclosureDocument(pageNum) {
    if (!PDF_ENABLED_PAGES[pageNum]) return null;

    var items = await loadDisclosureDocumentsCollection();

    // Try primary category first (e.g. disclosure-1)
    var primaryCat = 'disclosure-' + pageNum;
    var doc = items.find(function (item) {
      return item && item.category === primaryCat && item.url && item.visible !== false;
    });

    if (doc) return doc;

    // Fallback to padded category (e.g. disclosure-01) if applicable
    if (pageNum < 10) {
      var paddedCat = 'disclosure-0' + pageNum;
      doc = items.find(function (item) {
        return item && item.category === paddedCat && item.url && item.visible !== false;
      });
      if (doc) return doc;
    }

    return null;
  }

  async function loadAllDisclosureDocuments() {
    var items = await loadDisclosureDocumentsCollection();
    return items.filter(function (item) {
      return item
        && /^disclosure-\d+$/.test(normalizeText(item.category))
        && normalizeText(item.url)
        && item.visible !== false;
    });
  }

  function contentCard() {
    return document.querySelector('.content-card');
  }

  function addRuntimeStyles() {
    if (document.getElementById('disclosure-runtime-style')) return;
    var style = document.createElement('style');
    style.id = 'disclosure-runtime-style';
    style.textContent = [
      '.disclosure-runtime-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:#0e6b6b;color:#fff;font-size:.8rem;font-weight:700;letter-spacing:.02em;margin-bottom:18px;}',
      '.disclosure-unavailable{padding:22px 24px;border-radius:18px;background:#f8f5ee;border:1px solid rgba(184,140,52,.2);color:#29443f;font-size:1rem;line-height:1.7;}',
      '.disclosure-inline-link{color:var(--navy);font-weight:700;text-decoration:none;}',
      '.disclosure-inline-link:hover{text-decoration:underline;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureBadge(card, text) {
    if (!card) return;
    var badge = card.querySelector('.disclosure-runtime-badge');
    var clean = normalizeText(text);
    if (!clean) {
      if (badge) badge.remove();
      return;
    }

    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'disclosure-runtime-badge';
      var heading = card.querySelector('h2');
      if (heading) {
        card.insertBefore(badge, heading);
      } else {
        card.insertBefore(badge, card.firstChild);
      }
    }
    badge.textContent = clean;
  }

  function firstIntroParagraph(card) {
    var heading = card ? card.querySelector('h2') : null;
    var node = heading ? heading.nextElementSibling : null;
    while (node) {
      if (node.tagName === 'P') return node;
      node = node.nextElementSibling;
    }
    return null;
  }

  function paragraphAfterHeading(card, matcher) {
    var headings = card ? card.querySelectorAll('h3') : [];
    for (var i = 0; i < headings.length; i += 1) {
      var text = normalizeText(headings[i].textContent).toLowerCase();
      if (!matcher(text)) continue;
      var node = headings[i].nextElementSibling;
      while (node) {
        if (node.tagName === 'P') return node;
        if (node.tagName === 'H3') break;
        node = node.nextElementSibling;
      }
    }
    return null;
  }

  function tableByIndex(card, index) {
    var tables = card ? card.querySelectorAll('table.info-table') : [];
    return tables[index] || null;
  }

  function replaceTableRows(table, rows, formatter) {
    if (!table || !Array.isArray(rows)) return;
    var body = table.querySelector('tbody');
    if (!body) {
      body = document.createElement('tbody');
      table.appendChild(body);
    }
    body.innerHTML = rows.map(function (row) {
      var values = Array.isArray(row) ? row : [];
      return '<tr>' + values.map(function (value, index) {
        var rendered = formatter ? formatter(value, index, values) : formatTextHtml(value);
        return '<td>' + rendered + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function findPdfMarker(card) {
    if (!card || !document.createTreeWalker) return null;
    var walker = document.createTreeWalker(card, NodeFilter.SHOW_COMMENT, null);
    var node = walker.nextNode();
    while (node) {
      if (String(node.nodeValue || '').indexOf('PDF-DOWNLOAD-INJECTED') !== -1) return node;
      node = walker.nextNode();
    }
    return null;
  }

  function renderPdfDisplay(card, options) {
    if (!card) return;
    
    // Identifiers for doc-displays
    var displays = Array.prototype.slice.call(card.querySelectorAll('.doc-display'));
    var dynamicDisplay = card.querySelector('.doc-display[data-runtime-disclosure="true"]');

    if (!options || options.show === false || !normalizeText(options.url)) {
      // If no dynamic URL found, keep the legacy blocks but we might want them hidden if they are broken
      // For now, we only remove the dynamic one if it existed from a previous logic run
      if (dynamicDisplay) dynamicDisplay.remove();
      return;
    }

    // Since we have a dynamic PDF, we want to ensure only ONE display is visible and it's updated
    // We remove all OTHER legacy doc-displays to prevent duplicates (e.g. 5-affidavit.html)
    displays.forEach(function (d) {
      if (d !== dynamicDisplay) d.remove();
    });

    if (!dynamicDisplay) {
      dynamicDisplay = document.createElement('div');
      dynamicDisplay.className = 'doc-display';
      dynamicDisplay.setAttribute('data-runtime-disclosure', 'true');
      var marker = findPdfMarker(card);
      if (marker && marker.parentNode) {
        marker.parentNode.insertBefore(dynamicDisplay, marker);
      } else {
        card.appendChild(dynamicDisplay);
      }
    }
    
    if (!dynamicDisplay.style.marginTop) dynamicDisplay.style.marginTop = '32px';

    var sourceUrl = normalizeDocumentUrl(options.url);
    var downloadUrl = getDownloadableDocumentUrl(sourceUrl);
    var viewUrl = getViewableDocumentUrl(sourceUrl);
    var allowDownload = options.showDownload !== false;
    var title = escapeHtml(options.title || 'Official PDF');
    var description = escapeHtml(options.description || 'The latest official PDF uploaded from the admin disclosure panel is available below.');
    var actions = [];

    if (allowDownload) {
      actions.push(
        '<a href="' + escapeHtml(downloadUrl) + '" rel="noopener noreferrer" class="btn-doc">'
        + '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M8 10L5 7m3 3 3-3M2 12v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + 'Download PDF'
        + '</a>'
      );
    }

    actions.push(
      '<a href="' + escapeHtml(viewUrl) + '" target="_blank" rel="noopener noreferrer" class="btn-doc btn-doc-gold">'
      + '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 2h12v12H2z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 8h6M5 5h6M5 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
      + 'View Document'
      + '</a>'
    );

    dynamicDisplay.innerHTML = ''
      + '<div class="doc-icon"></div>'
      + '<h3>' + title + '</h3>'
      + '<p>' + description + '</p>'
      + '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' + actions.join('') + '</div>';

    // Global cleanup: find any a.btn-doc candidates ACROSS THE ENTIRE CARD and update them
    // This catches links that might have been hardcoded outside the main box
    Array.prototype.forEach.call(card.querySelectorAll('a.btn-doc'), function (link) {
      var label = normalizeText(link.textContent).toLowerCase();
      var isDownload = label.indexOf('download') !== -1;
      
      link.href = isDownload ? downloadUrl : viewUrl;
      link.setAttribute('rel', 'noopener noreferrer');
      if (isDownload) {
        link.removeAttribute('target');
      } else {
        link.setAttribute('target', '_blank');
      }
    });
  }

  function renderUnavailable(card) {
    if (!card) return;
    var title = normalizeText((card.querySelector('h2') || {}).textContent) || 'Mandatory Disclosure';
    card.innerHTML = '<h2>' + escapeHtml(title) + '</h2>'
      + '<div class="disclosure-unavailable">This disclosure page is temporarily hidden from the admin panel while updates are in progress.</div>';
  }

  function linkCellMarkup(value) {
    var clean = normalizeText(value);
    if (!clean) return '—';
    if (/^https?:\/\//i.test(clean) || /\.html?(?:[#?].*)?$/i.test(clean)) {
      return '<a href="' + escapeHtml(clean) + '" target="_blank" rel="noopener noreferrer" class="disclosure-inline-link">View →</a>';
    }
    return formatTextHtml(clean);
  }

  function overviewPageNumberFromHref(href) {
    var match = normalizeText(href).match(/(?:^|\/)(\d+)-/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function overviewCards() {
    return Array.prototype.slice.call(document.querySelectorAll('.document-grid .doc-card[href]'));
  }

  function disclosureDocumentMap(items) {
    return (Array.isArray(items) ? items : []).reduce(function (acc, item) {
      var match = normalizeText(item && item.category).match(/^disclosure-(\d+)$/);
      if (!match) return acc;
      var pageNum = parseInt(match[1], 10);
      if (!pageNum || acc[pageNum]) return acc;
      acc[pageNum] = item;
      return acc;
    }, {});
  }

  function truncateText(value, maxLength) {
    var clean = normalizeText(value).replace(/\s+/g, ' ');
    var limit = maxLength || 140;
    if (clean.length <= limit) return clean;
    return clean.slice(0, Math.max(0, limit - 1)).trim() + '…';
  }

  function overviewDescription(pageNum, pageData, fallback) {
    var raw = '';
    if (pageNum === 11) {
      raw = pageData && pageData.intro;
    } else if (pageNum >= 1 && pageNum <= 16) {
      raw = pageData && pageData.description;
    } else {
      raw = pageData && pageData.intro;
    }

    var clean = truncateText(raw, 130);
    return clean || fallback;
  }

  function renderOverviewInfoGrid(rows) {
    var grid = document.getElementById('disclosureInfoGrid');
    if (!grid || !Array.isArray(rows) || !rows.length) return;

    grid.innerHTML = rows.map(function (row) {
      var label = normalizeText(row && row[1]);
      var value = normalizeText(row && row[2]);
      if (!label && !value) return '';
      return ''
        + '<div class="info-card">'
        + '<div class="info-label">' + escapeHtml(label || 'Information') + '</div>'
        + '<div class="info-value">' + formatTextHtml(value || '—') + '</div>'
        + '</div>';
    }).join('');
  }

  function updateOverviewCard(card, pageNum, pageData, docItem) {
    if (!card || !pageNum) return;

    var meta = pageMeta(pageNum);
    var title = card.querySelector('.doc-title');
    var desc = card.querySelector('.doc-desc');
    var badge = card.querySelector('.doc-meta');
    var isLive = !(pageData && pageData.page && pageData.page.live === false);

    card.hidden = !isLive;
    if (!isLive) return;

    if (title && meta && meta.title) title.textContent = meta.title;
    if (desc) desc.textContent = overviewDescription(pageNum, pageData, normalizeText(desc.textContent));

    if (docItem && normalizeText(docItem.url)) {
      card.classList.add('has-live-pdf');
      card.setAttribute('title', 'Official PDF available on this disclosure page');
      
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'doc-meta';
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Official PDF Available';
        if (desc && desc.parentNode) {
          desc.parentNode.insertBefore(badge, desc.nextSibling);
        } else {
          card.appendChild(badge);
        }
      }

      // Add a small floating button for direct PDF access if not present
      var directBtn = card.querySelector('.direct-pdf-link');
      if (!directBtn) {
        directBtn = document.createElement('div');
        directBtn.className = 'direct-pdf-link';
        directBtn.innerHTML = '<i class="fas fa-file-pdf"></i> View File';
        // Basic styling via JS to avoid CSS changes to the main file if possible
        Object.assign(directBtn.style, {
          position: 'absolute', top: '10px', right: '10px',
          background: 'var(--navy)', color: '#fff',
          padding: '4px 8px', borderRadius: '6px',
          fontSize: '0.65rem', fontWeight: '800',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          zIndex: '10'
        });
        card.appendChild(directBtn);
        
        directBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.open(getViewableDocumentUrl(docItem.url), '_blank');
        });
      }
    } else {
      card.classList.remove('has-live-pdf');
      card.removeAttribute('title');
      if (badge) badge.remove();
      var oldBtn = card.querySelector('.direct-pdf-link');
      if (oldBtn) oldBtn.remove();
    }
  }

  async function initOverviewPage() {
    if (!isDisclosureOverviewPage()) return;

    var result = await Promise.all([
      loadDisclosureSettings(),
      loadAllDisclosureDocuments()
    ]);

    var settings = result[0] && typeof result[0] === 'object' ? result[0] : {};
    var docs = disclosureDocumentMap(result[1]);
    var pages = settings.pages && typeof settings.pages === 'object' ? settings.pages : {};
    var page11 = pages['11'] || null;
    var intro = document.getElementById('disclosureSectionIntro');

    if (page11) {
      renderOverviewInfoGrid(Array.isArray(page11.generalInfo) ? page11.generalInfo : []);
      if (intro && normalizeText(page11.intro)) intro.textContent = normalizeText(page11.intro);
    }

    overviewCards().forEach(function (card) {
      var pageNum = overviewPageNumberFromHref(card.getAttribute('href'));
      if (!pageNum) return;
      updateOverviewCard(card, pageNum, pages[String(pageNum)] || null, docs[pageNum] || null);
    });
  }

  function resolvePdfUrl(pageData, docItem) {
    var pageUrl = pageData && hasOwn(pageData, 'pdfUrl') ? normalizeText(pageData.pdfUrl) : '';
    if (pageUrl) return pageUrl;
    return docItem && docItem.url ? normalizeText(docItem.url) : '';
  }

  function applyDocumentPage(card, pageData, pdfUrl) {
    var intro = firstIntroParagraph(card);
    if (intro && normalizeText(pageData.description)) intro.textContent = normalizeText(pageData.description);
    ensureBadge(card, pageData.badge);
    replaceTableRows(tableByIndex(card, 0), pageData.details || []);
    renderPdfDisplay(card, {
      show: !!pdfUrl,
      url: pdfUrl,
      title: normalizeText((card.querySelector('h2') || {}).textContent) || 'Official PDF',
      description: normalizeText(pageData.description) || 'The official PDF for this disclosure page is available below.',
      showDownload: !(pageData.page && pageData.page.showDownloadButton === false)
    });
  }

  function applyPage11(card, pageData) {
    var intro = firstIntroParagraph(card);
    if (intro && normalizeText(pageData.intro)) intro.textContent = normalizeText(pageData.intro);
    replaceTableRows(tableByIndex(card, 0), pageData.generalInfo || []);
    replaceTableRows(tableByIndex(card, 1), pageData.documentLinks || [], function (value, index) {
      return index === 2 ? linkCellMarkup(value) : formatTextHtml(value);
    });
  }

  function applyPage17(card, pageData, pdfUrl) {
    var intro = firstIntroParagraph(card);
    var holidays = paragraphAfterHeading(card, function (text) {
      return text.indexOf('public holidays') !== -1;
    });

    if (intro && normalizeText(pageData.intro)) intro.textContent = normalizeText(pageData.intro);
    if (holidays && normalizeText(pageData.holidaysNote)) holidays.textContent = normalizeText(pageData.holidaysNote);
    replaceTableRows(tableByIndex(card, 0), pageData.events || []);
    renderPdfDisplay(card, {
      show: !!pdfUrl,
      url: pdfUrl,
      title: 'Academic Calendar PDF',
      description: 'Download or view the latest academic calendar uploaded from the admin disclosure panel.',
      showDownload: !(pageData.page && pageData.page.showDownloadButton === false)
    });
  }

  function renderSpecialPagePdf(card, pageData, pdfUrl, title, description) {
    renderPdfDisplay(card, {
      show: !!pdfUrl,
      url: pdfUrl,
      title: title,
      description: description,
      showDownload: !(pageData.page && pageData.page.showDownloadButton === false)
    });
  }

  function applyPage18(card, pageData, pdfUrl) {
    var intro = firstIntroParagraph(card);
    if (intro && normalizeText(pageData.intro)) intro.textContent = normalizeText(pageData.intro);
    replaceTableRows(tableByIndex(card, 0), pageData.members || []);
    renderSpecialPagePdf(
      card,
      pageData,
      pdfUrl,
      'Management Committee PDF',
      'Download or view the latest management committee PDF uploaded from the admin disclosure panel.'
    );
  }

  function applyPage19(card, pageData, pdfUrl) {
    var intro = firstIntroParagraph(card);
    if (intro && normalizeText(pageData.intro)) intro.textContent = normalizeText(pageData.intro);
    replaceTableRows(tableByIndex(card, 0), pageData.members || []);
    renderSpecialPagePdf(
      card,
      pageData,
      pdfUrl,
      'PTA Committee PDF',
      'Download or view the latest PTA committee PDF uploaded from the admin disclosure panel.'
    );
  }

  function applyPage20(card, pageData, pdfUrl) {
    replaceTableRows(tableByIndex(card, 0), pageData.feeRows || []);
    replaceTableRows(tableByIndex(card, 1), pageData.components || []);
    replaceTableRows(tableByIndex(card, 2), pageData.policies || []);
    renderSpecialPagePdf(
      card,
      pageData,
      pdfUrl,
      'Fee Structure PDF',
      'Download or view the latest fee structure PDF uploaded from the admin disclosure panel.'
    );
  }

  function applyPage21(card, pageData, pdfUrl) {
    replaceTableRows(tableByIndex(card, 0), pageData.results || []);
    replaceTableRows(tableByIndex(card, 1), pageData.subjectResults || []);
    renderSpecialPagePdf(
      card,
      pageData,
      pdfUrl,
      'Board Results PDF',
      'Download or view the latest board results PDF uploaded from the admin disclosure panel.'
    );
  }

  function applyPage22(card, pageData, pdfUrl) {
    var intro = firstIntroParagraph(card);
    if (intro && normalizeText(pageData.intro)) intro.textContent = normalizeText(pageData.intro);
    replaceTableRows(tableByIndex(card, 0), pageData.members || []);
    renderSpecialPagePdf(
      card,
      pageData,
      pdfUrl,
      'Local Management Committee PDF',
      'Download or view the latest local management committee PDF uploaded from the admin disclosure panel.'
    );
  }

  function applyPage23(card, pageData, pdfUrl) {
    var intro = firstIntroParagraph(card);
    if (intro && normalizeText(pageData.intro)) intro.textContent = normalizeText(pageData.intro);
    replaceTableRows(tableByIndex(card, 0), pageData.summary || []);
    replaceTableRows(tableByIndex(card, 1), pageData.subjects || []);
    replaceTableRows(tableByIndex(card, 2), pageData.qualifications || []);
    renderSpecialPagePdf(
      card,
      pageData,
      pdfUrl,
      'Teachers Information PDF',
      'Download or view the latest teachers information PDF uploaded from the admin disclosure panel.'
    );
  }

  function applyStoredData(pageNum, pageData, pdfUrl) {
    var card = contentCard();
    if (!card || !pageData || typeof pageData !== 'object') return;

    if (pageData.page && pageData.page.live === false) {
      renderUnavailable(card);
      return;
    }

    if (pageNum >= 1 && pageNum <= 16 && pageNum !== 11) {
      applyDocumentPage(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 11) {
      applyPage11(card, pageData);
      return;
    }
    if (pageNum === 17) {
      applyPage17(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 18) {
      applyPage18(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 19) {
      applyPage19(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 20) {
      applyPage20(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 21) {
      applyPage21(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 22) {
      applyPage22(card, pageData, pdfUrl);
      return;
    }
    if (pageNum === 23) {
      applyPage23(card, pageData, pdfUrl);
    }
  }

  function applyPdfFallback(pdfUrl) {
    var card = contentCard();
    if (!card || !normalizeText(pdfUrl)) return;
    renderPdfDisplay(card, {
      show: true,
      url: pdfUrl,
      title: normalizeText((card.querySelector('h2') || {}).textContent) || 'Official PDF',
      description: 'The latest official PDF uploaded for this disclosure page is available below.',
      showDownload: true
    });
  }

  async function init() {
    addRuntimeStyles();

    if (isDisclosureOverviewPage()) {
      await initOverviewPage();
      return;
    }

    var pageNum = currentPageNumber();
    if (!pageNum) return;

    var result = await Promise.all([
      loadDisclosureSettings(),
      loadDisclosureDocument(pageNum)
    ]);

    var settings = result[0] && typeof result[0] === 'object' ? result[0] : {};
    var docItem = result[1];
    var pages = settings.pages && typeof settings.pages === 'object' ? settings.pages : {};
    var pageData = pages[String(pageNum)] || null;
    var pdfUrl = resolvePdfUrl(pageData, docItem);

    if (pageData) {
      applyStoredData(pageNum, pageData, pdfUrl);
      return;
    }

    applyPdfFallback(pdfUrl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
