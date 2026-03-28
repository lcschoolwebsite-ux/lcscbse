(function () {
  'use strict';

  var PDF_ENABLED_PAGES = {
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
    9: true, 10: true, 12: true, 13: true, 14: true, 15: true, 16: true,
    17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true
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

  function hasOwn(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }

  function fileName() {
    var parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || '';
  }

  function currentPageNumber() {
    var match = fileName().match(/^(\d+)-/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async function resolveApiBase() {
    if (typeof window.resolveApiBase === 'function') {
      try {
        return await window.resolveApiBase();
      } catch (error) {
        /* fall through */
      }
    }

    var candidates = [
      '/api',
      window.location.origin.replace(/\/+$/, '') + '/api',
      'http://localhost:3000/api',
      'http://127.0.0.1:3000/api',
      'https://loretto-cbse-school.onrender.com/api'
    ];

    for (var i = 0; i < candidates.length; i += 1) {
      var base = String(candidates[i] || '').replace(/\/+$/, '');
      if (!base) continue;
      try {
        var response = await fetch(base + '/health');
        if (response.ok) return base;
      } catch (error) {
        /* ignore probe failures */
      }
    }

    return '/api';
  }

  async function fetchJson(endpoint) {
    try {
      var base = await resolveApiBase();
      var response = await fetch(String(base).replace(/\/+$/, '') + '/' + String(endpoint || '').replace(/^\/+/, ''));
      if (!response.ok) return null;
      return await response.json().catch(function () { return null; });
    } catch (error) {
      return null;
    }
  }

  async function loadDisclosureSettings() {
    var payload = await fetchJson('settings/disclosure-pages');
    return payload && payload.data ? payload.data : (payload || {});
  }

  async function loadDisclosureDocument(pageNum) {
    if (!PDF_ENABLED_PAGES[pageNum]) return null;
    var payload = await fetchJson('documents?category=disclosure-' + pageNum);
    var items = Array.isArray(payload) ? payload : [];
    return items.find(function (item) {
      return item && item.category === 'disclosure-' + pageNum && item.url && item.visible !== false;
    }) || null;
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
    var display = card.querySelector('.doc-display[data-runtime-disclosure="true"]') || card.querySelector('.doc-display');

    if (!options || options.show === false || !normalizeText(options.url)) {
      if (display) display.remove();
      return;
    }

    if (!display) {
      display = document.createElement('div');
      display.className = 'doc-display';
      var marker = findPdfMarker(card);
      if (marker && marker.parentNode) {
        marker.parentNode.insertBefore(display, marker);
      } else {
        card.appendChild(display);
      }
    }

    display.setAttribute('data-runtime-disclosure', 'true');
    if (!display.style.marginTop) display.style.marginTop = '32px';

    var url = escapeHtml(options.url);
    var title = escapeHtml(options.title || 'Official PDF');
    var description = escapeHtml(options.description || 'The latest official PDF uploaded from the admin disclosure panel is available below.');
    var actions = [];

    if (options.showDownload !== false) {
      actions.push(
        '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn-doc" download>'
        + '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M8 10L5 7m3 3 3-3M2 12v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        + 'Download PDF'
        + '</a>'
      );
    }

    actions.push(
      '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn-doc btn-doc-gold">'
      + '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 2h12v12H2z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 8h6M5 5h6M5 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
      + 'View Document'
      + '</a>'
    );

    display.innerHTML = ''
      + '<div class="doc-icon"></div>'
      + '<h3>' + title + '</h3>'
      + '<p>' + description + '</p>'
      + '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' + actions.join('') + '</div>';
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

  function resolvePdfUrl(pageData, docItem) {
    if (pageData && hasOwn(pageData, 'pdfUrl')) return normalizeText(pageData.pdfUrl);
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
    var pageNum = currentPageNumber();
    if (!pageNum) return;

    addRuntimeStyles();

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
