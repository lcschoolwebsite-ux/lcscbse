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
      '.notice-box a:hover{color:#fff;text-decoration:underline;}',

      /* ── Calendar PDF Card ── */
      '.cal-pdf-card{',
        'position:relative;overflow:hidden;',
        'background:linear-gradient(135deg,#094f4f 0%,#0e6b6b 45%,#127a7a 100%);',
        'border-radius:18px;padding:40px 44px;margin:32px 0 0;',
        'display:flex;align-items:center;gap:36px;',
        'box-shadow:0 16px 48px rgba(9,79,79,0.30),0 4px 16px rgba(0,0,0,0.12);',
      '}',
      '.cal-pdf-card::before{',
        'content:"";position:absolute;inset:0;',
        'background:radial-gradient(ellipse 80% 80% at 110% -10%,rgba(200,150,12,0.28) 0%,transparent 60%),',
        'radial-gradient(ellipse 60% 60% at -10% 110%,rgba(14,107,107,0.5) 0%,transparent 55%);',
        'pointer-events:none;',
      '}',
      '.cal-pdf-card::after{',
        'content:"";position:absolute;top:-60%;left:-30%;',
        'width:200px;height:300%;',
        'background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);',
        'transform:rotate(15deg);',
        'animation:calShimmer 4s ease-in-out infinite;',
        'pointer-events:none;',
      '}',
      '@keyframes calShimmer{0%,100%{left:-30%}50%{left:120%}}',
      '.cal-pdf-icon-wrap{',
        'flex-shrink:0;width:88px;height:88px;border-radius:50%;',
        'background:rgba(255,255,255,0.10);border:2px solid rgba(255,255,255,0.18);',
        'display:flex;align-items:center;justify-content:center;',
        'font-size:2.6rem;position:relative;z-index:1;',
        'box-shadow:0 0 0 6px rgba(200,150,12,0.15),0 8px 24px rgba(0,0,0,0.20);',
        'animation:calPulse 3s ease-in-out infinite;',
      '}',
      '@keyframes calPulse{0%,100%{box-shadow:0 0 0 6px rgba(200,150,12,0.15),0 8px 24px rgba(0,0,0,0.20)}50%{box-shadow:0 0 0 12px rgba(200,150,12,0.08),0 8px 24px rgba(0,0,0,0.20)}}',
      '.cal-pdf-body{flex:1;position:relative;z-index:1;}',
      '.cal-pdf-tag{display:inline-block;background:rgba(200,150,12,0.20);border:1px solid rgba(200,150,12,0.45);',
        'color:var(--gold-light);font-size:0.68rem;font-weight:800;letter-spacing:0.12em;',
        'text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:12px;}',
      '.cal-pdf-title{font-family:"Playfair Display",serif;font-size:1.65rem;font-weight:800;',
        'color:#fff;margin-bottom:8px;line-height:1.25;letter-spacing:0.01em;}',
      '.cal-pdf-desc{font-size:0.92rem;color:rgba(255,255,255,0.72);line-height:1.65;margin-bottom:24px;}',
      '.cal-pdf-btn{',
        'display:inline-flex;align-items:center;gap:10px;',
        'background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 100%);',
        'color:#094f4f !important;font-weight:800;font-size:0.88rem;letter-spacing:0.04em;',
        'text-transform:uppercase;text-decoration:none !important;',
        'padding:13px 28px;border-radius:10px;',
        'box-shadow:0 6px 20px rgba(200,150,12,0.45),inset 0 1px 0 rgba(255,255,255,0.35);',
        'transition:transform 0.25s cubic-bezier(0.4,0,0.2,1),box-shadow 0.25s,filter 0.25s;',
        'position:relative;overflow:hidden;',
      '}',
      '.cal-pdf-btn::before{content:"";position:absolute;inset:0;',
        'background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.22) 50%,transparent 100%);',
        'transform:translateX(-100%);transition:transform 0.5s ease;}',
      '.cal-pdf-btn:hover::before{transform:translateX(100%);}',
      '.cal-pdf-btn:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(200,150,12,0.55),inset 0 1px 0 rgba(255,255,255,0.35);}',
      '.cal-pdf-btn:active{transform:translateY(0);filter:brightness(0.95);}',
      '.cal-pdf-btn svg{width:18px;height:18px;flex-shrink:0;}',
      '.cal-pdf-divider{width:1px;height:80px;background:rgba(255,255,255,0.14);flex-shrink:0;align-self:center;position:relative;z-index:1;}',
      '.cal-pdf-meta{flex-shrink:0;text-align:center;position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:6px;}',
      '.cal-pdf-meta-icon{font-size:1.4rem;margin-bottom:2px;}',
      '.cal-pdf-meta-label{font-size:0.7rem;color:rgba(255,255,255,0.5);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;}',
      '.cal-pdf-meta-val{font-size:0.88rem;color:rgba(255,255,255,0.88);font-weight:700;}',
      '@media(max-width:680px){',
        '.cal-pdf-card{flex-direction:column;padding:30px 24px;gap:24px;text-align:center;}',
        '.cal-pdf-divider{display:none;}',
        '.cal-pdf-meta{flex-direction:row;justify-content:center;gap:24px;}',
      '}',

      /* ── Uniform Image Card ── */
      '.uni-img-card{margin:0 0 24px;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(14,107,107,0.14);position:relative;}',
      '.uni-img-card img{width:100%;display:block;max-height:340px;object-fit:cover;transition:transform 0.4s ease;}',
      '.uni-img-card:hover img{transform:scale(1.03);}',
      '.uni-img-badge{position:absolute;bottom:12px;left:12px;background:linear-gradient(135deg,rgba(9,79,79,0.9),rgba(14,107,107,0.85));color:#fff;font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:5px 12px;border-radius:6px;backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.15);}'
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

  function extractUniformImage(body) {
    var imgInput = body.querySelector('.blk-uni-img');
    return imgInput ? inputValue(imgInput) : '';
  }

  function renderUniformImage(imgUrl, label) {
    if (!imgUrl) return '';
    return '<div class="uni-img-card">'
      + '<img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(label) + ' uniform photo" loading="lazy"/>'
      + '<div class="uni-img-badge">' + escapeHtml(label) + ' Uniform</div>'
      + '</div>';
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

    var cardTitle = escapeHtml(title || 'School Calendar PDF');
    var safeUrl   = url ? escapeHtml(url) : '';

    var btnHtml = safeUrl
      ? [
          '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" class="cal-pdf-btn">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
              '<path d="M12 15V3"/><path d="M17 10l-5 5-5-5"/><path d="M20 21H4"/>',
            '</svg>',
            'Download Calendar PDF',
          '</a>'
        ].join('')
      : '<span class="cal-pdf-btn" style="opacity:0.55;cursor:default;pointer-events:none;">&#128197; Calendar PDF Coming Soon</span>';

    return [
      '<div class="cal-pdf-card">',
        '<div class="cal-pdf-icon-wrap">&#128197;</div>',
        '<div class="cal-pdf-body">',
          '<span class="cal-pdf-tag">&#128196;&nbsp; Official Document</span>',
          '<div class="cal-pdf-title">' + cardTitle + '</div>',
          '<div class="cal-pdf-desc">Download the complete academic calendar for the current session &mdash; important dates, holidays, events &amp; examinations all in one place.</div>',
          btnHtml,
        '</div>',
        '<div class="cal-pdf-divider"></div>',
        '<div class="cal-pdf-meta">',
          '<div class="cal-pdf-meta-icon">&#128274;</div>',
          '<div class="cal-pdf-meta-label">Format</div>',
          '<div class="cal-pdf-meta-val">PDF</div>',
          '<div class="cal-pdf-meta-icon" style="margin-top:12px">' + (safeUrl ? '&#9989;' : '&#128336;') + '</div>',
          '<div class="cal-pdf-meta-label">' + (safeUrl ? 'Verified' : 'Status') + '</div>',
          '<div class="cal-pdf-meta-val">' + (safeUrl ? 'Official' : 'Pending') + '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderPolicyGrid(title, body) {
    var table = body.querySelector('table.te');
    if (!table) return '';

    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr')).map(function (row) {
      var inputs = row.querySelectorAll('input');
      return {
        title: inputValue(inputs[0]),
        desc: inputValue(inputs[1]),
        url: inputValue(inputs[2])
      };
    }).filter(function (tab) {
      return tab.title || tab.url;
    });

    if (!rows.length) {
      return renderSectionHeading(title) + '<div class="notice-box"><p>Detected the Policy section, but the cards seem empty. Please re-save in Admin.</p></div>';
    }

    var html = renderSectionHeading(title);
    html += '<div class="document-grid">';
    rows.forEach(function (tab) {
      html += '<a href="' + escapeHtml(tab.url) + '" target="_blank" class="doc-card">'
        + '<div class="doc-badge"><i class="fas fa-file-pdf"></i> View File</div>'
        + '<div class="doc-icon-box"><i class="fas fa-file-shield"></i></div>'
        + '<div class="doc-title">' + escapeHtml(tab.title) + '</div>'
        + '<div class="doc-desc">' + escapeHtml(tab.desc || 'Official school policy document') + '</div>'
        + '<div class="doc-meta"><i class="fas fa-check-circle"></i> Official PDF Available</div>'
        + '</a>';
    });
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

    if (/Policy/i.test(title) || /\bTab\b/i.test(title)) {
      return renderPolicyGrid(title, body);
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

    /* ── Uniform image — shown above the list if uploaded ── */
    var isUniformBlock = /boys|girls/i.test(title) && /uniform/i.test(title);
    if (isUniformBlock) {
      var uniLabel = /boys/i.test(title) ? "Boys'" : "Girls'";
      html += renderUniformImage(extractUniformImage(body), uniLabel);
    }

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

    prefetchSiblingSections(section);
  }

  init();
})();
