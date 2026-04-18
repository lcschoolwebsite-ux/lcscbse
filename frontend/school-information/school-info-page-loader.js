(function () {
  'use strict';

  var SECTION_BY_FILE = {
    '1-curriculum.html': 'curriculum',
    '2-school-uniform.html': 'uniform',
    '3-school-calendar.html': 'calendar',
    '4-office-school-timings.html': 'timings',
    '5-provisions.html': 'provisions',
    '6-facilities.html': 'facilities',
    '7-prevention-sexual-harassment.html': 'harassment',
    '8-child-protection-policy.html': 'child-protection',
    '9-website-privacy-policy.html': 'privacy-policy'
  };

  function fileName() {
    var parts = window.location.pathname.split('/');
    var f = parts[parts.length - 1] || '';
    if (f && !/\\.html$/i.test(f) && !/[?#]/.test(f)) f += '.html';
    return f;
  }

  function currentSection() {
    return SECTION_BY_FILE[fileName()] || '';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function text(node) {
    return node ? (node.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function inputValue(node) {
    if (!node) return '';
    return String(node.value || node.getAttribute('value') || '').trim();
  }

  function longValue(node) {
    if (!node) return '';
    return String(node.value || node.textContent || node.getAttribute('value') || '').trim();
  }

  function formatText(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
  }

  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim())) return value;
    var parsed = new Date(value + 'T00:00:00');
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatFieldValue(value) {
    var clean = String(value || '').trim();
    if (!clean) return '';
    if (/^https?:\/\//i.test(clean)) {
      return '<a href="' + escapeHtml(clean) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(clean) + '</a>';
    }
    return escapeHtml(formatDate(clean));
  }

  function labelText(field) {
    if (!field) return '';
    var label = field.querySelector('label');
    if (!label) return '';
    var clone = label.cloneNode(true);
    clone.querySelectorAll('.dbh').forEach(function (chip) {
      chip.remove();
    });
    return text(clone);
  }

  function scheduleBackground(task) {
    if (typeof task !== 'function') return;
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(task, { timeout: 1500 });
      return;
    }
    window.setTimeout(task, 250);
  }

  async function loadSchoolInfo(slug) {
    if (typeof window.fetchData === 'function') {
      var cachedPayload = await window.fetchData('school-info/' + slug);
      return cachedPayload && cachedPayload.data ? cachedPayload.data : null;
    }

    var base = '/api';

    if (typeof window.resolveApiBase === 'function') {
      try {
        base = await window.resolveApiBase();
      } catch (error) {
        base = '/api';
      }
    }

    base = String(base || '/api').replace(/\/+$/, '');

    try {
      var response = await fetch(base + '/school-info/' + slug);
      if (!response.ok) return null;
      var payload = await response.json().catch(function () { return null; });
      return payload && payload.data ? payload.data : null;
    } catch (error) {
      return null;
    }
  }

  function prefetchSiblingSections(currentSlug) {
    if (typeof window.fetchData !== 'function') return;

    var seen = Object.create(null);
    var slugs = Object.keys(SECTION_BY_FILE).map(function (file) {
      return SECTION_BY_FILE[file];
    }).filter(function (slug) {
      if (!slug || slug === currentSlug || seen[slug]) return false;
      seen[slug] = true;
      return true;
    });

    scheduleBackground(function () {
      slugs.forEach(function (slug, index) {
        window.setTimeout(function () {
          window.fetchData('school-info/' + slug);
        }, index * 150);
      });
    });
  }

  function parseHtmlPayload(data) {
    if (!data || typeof data.html !== 'string' || !data.html.trim()) return null;
    var parser = new DOMParser();
    return parser.parseFromString('<div id="school-info-snapshot">' + data.html + '</div>', 'text/html');
  }

  function pageTitle() {
    return text(document.querySelector('.page-banner h1')) || text(document.querySelector('.content-card h2')) || 'School Information';
  }

  function updatePageTitle(title) {
    var bannerTitle = document.querySelector('.page-banner h1');
    if (bannerTitle && title) bannerTitle.textContent = title;

    var crumb = document.querySelector('.breadcrumb span:last-child');
    if (crumb && title) crumb.textContent = title;

    if (title) {
      document.title = title + ' | School Information | Loretto Central School';
    }
  }

  function addRuntimeStyles() {
    if (document.getElementById('school-info-runtime-style')) return;

    var style = document.createElement('style');
    style.id = 'school-info-runtime-style';
    style.textContent = [
      '.notice-box a{color:var(--gold-light);font-weight:700;text-decoration:none;}',
      '.notice-box a:hover{color:#fff;text-decoration:underline;}'
    ].join('');
    document.head.appendChild(style);
  }

  function blockTitle(block) {
    var titleNode = block.querySelector('.bh .bt');
    if (!titleNode) return '';
    var clone = titleNode.cloneNode(true);
    clone.querySelectorAll('.dbc').forEach(function (badge) {
      badge.remove();
    });
    return text(clone);
  }

  function extractTextEntries(body) {
    return Array.prototype.slice.call(body.querySelectorAll('.f textarea')).map(function (area) {
      return {
        label: labelText(area.closest('.f')),
        value: longValue(area)
      };
    }).filter(function (entry) {
      return entry.value;
    });
  }

  function extractFieldPairs(body) {
    return Array.prototype.slice.call(body.querySelectorAll('.f input')).map(function (input) {
      var wrapper = input.closest('.f');
      var label = labelText(wrapper);
      return {
        label: label,
        value: inputValue(input)
      };
    }).filter(function (entry) {
      return entry.label && entry.value;
    });
  }

  function extractListItems(body) {
    return Array.prototype.slice.call(body.querySelectorAll('.le .lr input')).map(function (input) {
      return inputValue(input);
    }).filter(Boolean);
  }

  function extractCards(body) {
    return Array.prototype.slice.call(body.querySelectorAll('.fcg .fce')).map(function (card) {
      var inputs = card.querySelectorAll('input');
      return {
        icon: inputValue(inputs[0]),
        title: inputValue(inputs[1]),
        description: longValue(card.querySelector('textarea'))
      };
    }).filter(function (card) {
      return card.title || card.description || card.icon;
    });
  }

  function extractTable(body) {
    var table = body.querySelector('table.te');
    if (!table) return null;

    var headers = Array.prototype.slice.call(table.querySelectorAll('thead th')).map(text).filter(Boolean);
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr')).map(function (row) {
      var cells = Array.prototype.slice.call(row.querySelectorAll('td')).slice(0, headers.length);
      return cells.map(function (cell) {
        var field = cell.querySelector('input, select, textarea');
        return field ? longValue(field) : text(cell);
      });
    }).filter(function (row) {
      return row.some(function (value) {
        return String(value || '').trim();
      });
    });

    if (!headers.length || !rows.length) return null;
    return { headers: headers, rows: rows };
  }

  function renderSectionHeading(title) {
    return title ? '<h3>' + escapeHtml(title) + '</h3>' : '';
  }

  function renderTextBlock(title, entries, fields, showHeading) {
    if (!entries.length && !fields.length) return '';

    var html = showHeading ? renderSectionHeading(title) : '';

    entries.forEach(function (entry) {
      if (/highlight/i.test(entry.label)) {
        html += '<div class="highlight-box"><p>' + formatText(entry.value) + '</p></div>';
        return;
      }
      html += '<p>' + formatText(entry.value) + '</p>';
    });

    if (fields.length) {
      html += '<table class="info-table">'
        + fields.map(function (field) {
            return '<tr><td>' + escapeHtml(field.label) + '</td><td>' + formatFieldValue(field.value) + '</td></tr>';
          }).join('')
        + '</table>';
    }

    return html;
  }

  function renderList(title, items) {
    if (!items.length) return '';
    return renderSectionHeading(title)
      + '<ul>'
      + items.map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('')
      + '</ul>';
  }

  function renderCards(title, cards) {
    if (!cards.length) return '';
    return renderSectionHeading(title)
      + '<div class="feat-grid">'
      + cards.map(function (card) {
          return '<div class="feat-card">'
            + (card.icon ? '<div class="icon">' + escapeHtml(card.icon) + '</div>' : '')
            + (card.title ? '<h4>' + escapeHtml(card.title) + '</h4>' : '')
            + (card.description ? '<p>' + formatText(card.description) + '</p>' : '')
            + '</div>';
        }).join('')
      + '</div>';
  }

  function renderTable(title, tableData) {
    if (!tableData) return '';
    return renderSectionHeading(title)
      + '<table class="timing-table">'
      + '<thead><tr>'
      + tableData.headers.map(function (header) {
          return '<th>' + escapeHtml(header) + '</th>';
        }).join('')
      + '</tr></thead>'
      + '<tbody>'
      + tableData.rows.map(function (row) {
          return '<tr>'
            + row.map(function (cell) {
                return '<td>' + escapeHtml(cell) + '</td>';
              }).join('')
            + '</tr>';
        }).join('')
      + '</tbody>'
      + '</table>';
  }

  function renderPolicy(body) {
    var policy = body.querySelector('.pol');
    if (!policy) return '';

    var heading = text(policy.querySelector('h4'));
    var message = longValue(policy.querySelector('textarea'));
    if (!heading && !message) return '';

    return '<div class="policy-section">'
      + (heading ? '<h3>' + escapeHtml(heading) + '</h3>' : '')
      + (message ? '<p>' + formatText(message) + '</p>' : '')
      + '</div>';
  }

  function renderDownloadBox(title, body) {
    var url = inputValue(body.querySelector('#cal-pdf')) || inputValue(body.querySelector('.cld-row input[type="url"]'));
    if (!url) return '';

    return '<div class="notice-box"><p><strong>' + escapeHtml(title || 'Download') + ':</strong> '
      + '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">Open the latest PDF</a>'
      + '</p></div>';
  }

  function renderPolicyTabs(title, body) {
    var table = body.querySelector('table.te');
    if (!table) return '';

    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr')).map(function (row) {
      var inputs = row.querySelectorAll('input');
      return {
        title: inputValue(inputs[0]),
        url: inputValue(inputs[1])
      };
    }).filter(function (tab) {
      return tab.title && tab.url;
    });

    if (!rows.length) return '';

    var html = renderSectionHeading(title);
    html += '<div class="policy-tabs-container">';
    html += '<div class="policy-tabs-list">';
    rows.forEach(function (tab, i) {
      html += '<button class="policy-tab-btn' + (i === 0 ? ' active' : '') + '" data-pdf="' + escapeHtml(tab.url) + '">' + escapeHtml(tab.title) + '</button>';
    });
    html += '</div>';
    html += '<div class="policy-tab-viewer">';
    html += '<iframe src="' + escapeHtml(rows[0].url) + '" width="100%" height="700px" style="border:1px solid var(--border); border-radius:12px; background:var(--light-bg);"></iframe>';
    html += '</div>';
    html += '<div style="text-align:center; margin-top:15px;"><a href="' + escapeHtml(rows[0].url) + '" target="_blank" class="open-pdf-btn" style="display:inline-block; padding:10px 20px; background:var(--navy); color:white; text-decoration:none; border-radius:8px; font-weight:700;">Open PDF in New Tab</a></div>';
    html += '</div>';

    return html;
  }

  function renderBlock(block, index) {
    var title = blockTitle(block);
    var body = block.querySelector('.bb') || block;

    if (body.querySelector('.pol')) {
      return renderPolicy(body);
    }

    if (/pdf/i.test(title) && body.querySelector('.cld-row')) {
      return renderDownloadBox(title, body);
    }

    if (/Policy Tabs/i.test(title)) {
      return renderPolicyTabs(title, body);
    }

    var entries = extractTextEntries(body);
    var fields = extractFieldPairs(body);
    var items = extractListItems(body);
    var cards = extractCards(body);
    var tableData = extractTable(body);
    var html = '';
    var isIntroLike = /^introduction$/i.test(title) || index === 0;

    html += renderTextBlock(title, entries, fields, !isIntroLike && !items.length && !cards.length && !tableData);
    html += renderCards(title, cards);
    html += renderList(title, items);
    html += renderTable(title, tableData);

    return html;
  }

  function renderSnapshot(doc, title) {
    var blocks = Array.prototype.slice.call(doc.querySelectorAll('#school-info-snapshot .block'));
    if (!blocks.length) return '';

    return '<h2>' + escapeHtml(title) + '</h2>' + blocks.map(function (block, index) {
      return renderBlock(block, index);
    }).join('');
  }

  async function init() {
    var section = currentSection();
    var card = document.querySelector('.content-card');
    if (!section || !card) return;

    var savedData = await loadSchoolInfo(section);
    var snapshot = parseHtmlPayload(savedData);
    if (!snapshot) return;

    var title = pageTitle();
    var rendered = renderSnapshot(snapshot, title);
    if (!rendered) return;

    addRuntimeStyles();
    updatePageTitle(title);
    card.innerHTML = rendered;
    
    // Add event listener for policy tabs
    document.querySelectorAll('.policy-tab-btn').forEach(function(btn) {
      btn.onclick = function() {
        var container = this.closest('.policy-tabs-container');
        container.querySelectorAll('.policy-tab-btn').forEach(function(b){ b.classList.remove('active'); });
        this.classList.add('active');
        var pdfUrl = this.getAttribute('data-pdf');
        container.querySelector('iframe').src = pdfUrl;
        container.querySelector('.open-pdf-btn').href = pdfUrl;
      };
    });

    prefetchSiblingSections(section);
  }

  init();
})();
