(function () {
  'use strict';

  var SECTION_BY_FILE = {
    '1-school-profile.html': 'school-profile',
    '2-management.html': 'management',
    '3-manager-speaks.html': 'manager-speaks',
    '4-principals-message.html': 'principals-message',
    '5-pta-executive-body.html': 'pta',
    '6-cbse-details.html': 'cbse-details',
    '7-annual-report.html': 'annual-report'
  };

  function fileName() {
    var parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || '';
  }

  function currentSection() {
    var raw = fileName();
    if (SECTION_BY_FILE[raw]) return SECTION_BY_FILE[raw];
    if (SECTION_BY_FILE[raw + '.html']) return SECTION_BY_FILE[raw + '.html'];
    return '';
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
    return (node.value || node.getAttribute('value') || '').trim();
  }

  function longValue(node) {
    if (!node) return '';
    return String(node.value || node.textContent || node.getAttribute('value') || '').trim();
  }

  function splitParagraphs(value) {
    return String(value || '')
      .replace(/\r\n?/g, '\n')
      .split(/\n\s*\n/)
      .map(function (part) { return part.trim(); })
      .filter(Boolean);
  }

  function formatParagraph(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
  }

  function renderParagraphHtml(paragraphs) {
    return (Array.isArray(paragraphs) ? paragraphs : []).map(function (paragraph) {
      return '<p>' + formatParagraph(paragraph) + '</p>';
    }).join('');
  }

  function checked(node) {
    return !!(node && (node.checked || node.hasAttribute('checked')));
  }

  function yearValue(value) {
    var match = String(value || '').trim().match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : '';
  }

  var PROD_API_BASE = 'https://lcscbse-production.up.railway.app/api';
  var IS_LOCAL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  async function loadAboutBlock(slug) {
    try {
      var base = IS_LOCAL ? 'http://localhost:3000/api' : PROD_API_BASE;
      var response = await fetch(base + '/about/' + slug);
      if (!response.ok) return null;
      var payload = await response.json().catch(function () { return null; });
      return payload && payload.data ? payload.data : null;
    } catch (error) {
      return null;
    }
  }

  function parseHtmlPayload(data) {
    if (!data || typeof data.html !== 'string' || !data.html.trim()) return null;
    var parser = new DOMParser();
    return parser.parseFromString('<div>' + data.html + '</div>', 'text/html');
  }

  function rowsFromTable(doc) {
    return Array.prototype.slice.call(doc.querySelectorAll('tbody tr'));
  }

  function updatePageTitle(title) {
    var bannerTitle = document.querySelector('.page-banner h1');
    if (bannerTitle && title) bannerTitle.textContent = title;
    var cardTitle = document.querySelector('.content-card h2');
    if (cardTitle && title) cardTitle.textContent = title;
    var crumb = document.querySelector('.breadcrumb span:last-child');
    if (crumb && title) crumb.textContent = title;
  }

  function setBannerImage(url) {
    var cleanUrl = String(url || '').trim();
    if (!cleanUrl) return;
    var banner = document.querySelector('.page-banner');
    if (!banner) return;

    var runtimeStyle = document.getElementById('about-banner-runtime-style');
    if (!runtimeStyle) {
      runtimeStyle = document.createElement('style');
      runtimeStyle.id = 'about-banner-runtime-style';
      runtimeStyle.textContent = '.page-banner.dynamic-banner::before{display:none !important;}';
      document.head.appendChild(runtimeStyle);
    }

    banner.classList.add('dynamic-banner');
    banner.style.background = 'linear-gradient(135deg, rgba(9,79,79,0.82) 0%, rgba(14,107,107,0.74) 60%, rgba(18,122,122,0.7) 100%), url("' + cleanUrl.replace(/"/g, '\\"') + '") center/cover no-repeat';
  }

  function extractBannerImageFromDoc(doc) {
    if (!doc) return '';
    var bannerImg = doc.querySelector('#bannerImg');
    var bannerInput = doc.querySelector('#bannerUrlInput');
    return inputValue(bannerInput) || (bannerImg ? (bannerImg.getAttribute('src') || '') : '');
  }

  function renderSchoolProfile(doc) {
    var card = document.querySelector('.content-card');
    if (!card) return;

    var title = inputValue(doc.querySelector('#bannerUrlInput') ? doc.querySelector('.block .f input[type="text"]') : doc.querySelector('input[type="text"]')) || 'School Profile';
    var bannerImg = doc.querySelector('#bannerImg');
    var bannerUrl = inputValue(doc.querySelector('#bannerUrlInput')) || (bannerImg ? (bannerImg.getAttribute('src') || '') : '');
    var gallerySlots = Array.prototype.slice.call(doc.querySelectorAll('.cld-gallery-slot'));
    var gallery = gallerySlots.map(function (slot) {
      var img = slot.querySelector('img');
      var inputs = slot.querySelectorAll('input');
      return {
        image: img && img.getAttribute('src') ? img.getAttribute('src').trim() : inputValue(inputs[1]),
        alt: inputValue(inputs[0]) || 'School image'
      };
    }).filter(function (item) {
      return item.image;
    });

    var paragraphs = [];
    var highlightParagraphs = [];
    Array.prototype.slice.call(doc.querySelectorAll('#paraList .para-item')).forEach(function (item) {
      var value = longValue(item.querySelector('textarea'));
      var parts = splitParagraphs(value);
      if (!parts.length) return;
      if (/highlight box/i.test(text(item))) {
        highlightParagraphs = parts;
      } else {
        paragraphs = paragraphs.concat(parts);
      }
    });

    var facts = Array.prototype.slice.call(doc.querySelectorAll('.kv-row')).map(function (row) {
      var inputs = row.querySelectorAll('input');
      return {
        key: inputValue(inputs[0]),
        value: inputValue(inputs[1])
      };
    }).filter(function (item) {
      return item.key && item.value;
    });

    updatePageTitle(title);
    setBannerImage(bannerUrl);

    var paragraphBlocks = paragraphs.map(function (paragraph, index) {
      var block = '<p>' + formatParagraph(paragraph) + '</p>';
      if (highlightParagraphs.length && index === 1) {
        block += '<div class="highlight-box">' + renderParagraphHtml(highlightParagraphs) + '</div>';
      }
      return block;
    }).join('');

    if (highlightParagraphs.length && paragraphs.length < 2) {
      paragraphBlocks += '<div class="highlight-box">' + renderParagraphHtml(highlightParagraphs) + '</div>';
    }

    card.innerHTML = ''
      + '<h2>' + escapeHtml(title) + '</h2>'
      + (gallery.length ? '<div class="school-gallery">' + gallery.map(function (item) {
          return '<div class="gallery-img">'
            + '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.alt) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"/>'
            + '<div class="gallery-img-placeholder" style="display:none"><span>' + escapeHtml(item.alt) + '</span></div>'
            + '</div>';
        }).join('') + '</div>' : '')
      + paragraphBlocks
      + (facts.length ? '<h2 style="margin-top:40px; font-size:1.4rem;">Key School Facts</h2>'
        + '<table class="info-table">'
        + facts.map(function (item) {
            return '<tr><td>' + escapeHtml(item.key) + '</td><td>' + escapeHtml(item.value) + '</td></tr>';
          }).join('')
        + '</table>' : '');
  }

  function renderManagement(doc) {
    var content = document.getElementById('mgmt-content');
    var loading = document.getElementById('mgmt-loading');
    var intro = longValue(doc.querySelector('#managementIntroText'));
    var introParagraphs = splitParagraphs(intro);
    var rows = rowsFromTable(doc).map(function (row) {
      var cells = row.querySelectorAll('td');
      var photo = row.querySelector('img');
      var orderInput = row.querySelector('input[type="number"]');
      var visibleInput = row.querySelector('input[type="checkbox"]');
      return {
        photo: photo ? (photo.getAttribute('src') || '').trim() : '',
        name: text(cells[1]),
        designation: text(cells[2]),
        order: Number(inputValue(orderInput) || 0),
        visible: visibleInput ? checked(visibleInput) : true
      };
    }).filter(function (item) {
      return item.name && item.visible;
    }).sort(function (a, b) {
      return a.order - b.order;
    });

    if (!content || !rows.length) return;

    if (loading) loading.style.display = 'none';
    content.style.display = 'block';
    updatePageTitle('Management');
    content.innerHTML = (introParagraphs.length ? '<div class="mgmt-intro">' + renderParagraphHtml(introParagraphs) + '</div>' : '')
      + '<h3 class="section-title">Management Team</h3><div class="mgmt-cards">'
      + rows.map(function (item, index) {
          return '<div class="mgmt-card ' + (index === 0 ? 'primary' : '') + '">'
            + (item.photo ? '<img class="photo" src="' + escapeHtml(item.photo) + '" alt="' + escapeHtml(item.name) + '" />' : '')
            + '<div class="role">' + escapeHtml(item.designation || 'Member') + '</div>'
            + '<div class="name">' + escapeHtml(item.name) + '</div>'
            + '</div>';
        }).join('')
      + '</div>';
  }

  function renderMessage(doc, personTitle, orgName) {
    var card = document.querySelector('.content-card');
    if (!card) return;

    var bodyBlock = doc.querySelector('.block-body .fg');
    if (!bodyBlock) return;
    var textInputs = bodyBlock.querySelectorAll('input[type="text"]');
    var message = longValue(doc.querySelector('textarea'));
    var heading = inputValue(textInputs[0]) || personTitle;
    var subHeading = inputValue(textInputs[1]) || '';
    var signature = inputValue(textInputs[2]) || '';
    var photoUrl = inputValue(doc.querySelector('.cld-url-row input[type="url"]'));
    var signatureParts = signature.split(',').map(function (part) { return part.trim(); }).filter(Boolean);
    var personName = signatureParts[0] || personTitle;
    var personRole = signatureParts.slice(1).join(', ') || personTitle;
    var paragraphs = splitParagraphs(message);

    updatePageTitle(heading);

    card.innerHTML = ''
      + '<h2>' + escapeHtml(heading) + '</h2>'
      + '<div class="message-layout">'
      + '<div class="message-photo-col">'
      + (photoUrl ? '<img class="message-photo" src="' + escapeHtml(photoUrl) + '" alt="' + escapeHtml(personName) + '" />' : '')
      + '<div class="message-name-card">'
      + '<div class="person-name">' + escapeHtml(personName) + '</div>'
      + '<div class="person-title">' + escapeHtml(personRole) + '</div>'
      + '<div class="person-org">' + escapeHtml(orgName || 'Loretto Central School') + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="message-text">'
      + '<span class="quote-mark">"</span>'
      + (subHeading ? '<div class="highlight-quote">' + escapeHtml(subHeading) + '</div>' : '')
      + renderParagraphHtml(paragraphs)
      + '<div class="signature"><strong>' + escapeHtml(personName) + '</strong><span>' + escapeHtml(personRole) + '</span></div>'
      + '</div>'
      + '</div>';
  }

  function renderPta(doc) {
    var card = document.querySelector('.content-card');
    if (!card) return;
    var introText = longValue(doc.querySelector('#ptaIntroText'))
      || 'The Parent-Teacher Association (PTA) plays a vital supportive role in the functioning of the school. The main motive of the PTA is to build a strong relationship between the school and the children\'s families, supporting holistic development and a nurturing community. The PTA general body meets once a year. During the year, the executive committee meets regularly. Various activities are conducted under the leadership of the PTA.';
    var introParagraphs = splitParagraphs(introText);
    var rows = rowsFromTable(doc).map(function (row) {
      var cells = row.querySelectorAll('td');
      return {
        name: text(cells[1]),
        role: text(cells[2]),
        contact: text(cells[3]),
        order: Number(inputValue(row.querySelector('input[type="number"]')) || 0)
      };
    }).filter(function (item) {
      return item.name;
    }).sort(function (a, b) {
      return a.order - b.order;
    });
    if (!rows.length) return;

    updatePageTitle('PTA Executive Body');

    card.innerHTML = ''
      + '<h2>PTA Executive Body</h2>'
      + '<div class="pta-intro">' + renderParagraphHtml(introParagraphs) + '</div>'
      + '<div class="pta-leadership">'
      + rows.slice(0, 3).map(function (item) {
          return '<div class="pta-leader-card"><div class="role-tag">' + escapeHtml(item.role || 'Committee Member') + '</div><div class="name">' + escapeHtml(item.name) + '</div></div>';
        }).join('')
      + '</div>'
      + '<div class="members-section"><h3>Executive Committee Members</h3><div class="pta-members-grid">'
      + rows.map(function (item) {
          return '<div class="pta-member"><div class="pta-member-icon"></div><div><div class="pta-member-name">' + escapeHtml(item.name) + '</div>'
            + (item.contact && item.contact !== '—' ? '<div style="font-size:.74rem;color:var(--text-muted);margin-top:2px;">' + escapeHtml(item.contact) + '</div>' : '')
            + '</div></div>';
        }).join('')
      + '</div></div>';
  }

  function renderCbse(doc) {
    var card = document.querySelector('.content-card');
    if (!card) return;
    var inputs = doc.querySelectorAll('.block-body input');
    if (!inputs.length) return;
    var affiliationNo = inputValue(inputs[0]);
    var affiliationType = inputValue(inputs[1]);
    var validFrom = yearValue(inputValue(inputs[2]));
    var validTo = yearValue(inputValue(inputs[3]));
    var schoolCode = inputValue(inputs[4]);
    var notesParagraphs = splitParagraphs(longValue(doc.querySelector('.block-body textarea')));

    updatePageTitle('CBSE Details');
    card.innerHTML = ''
      + '<h2>CBSE Details</h2>'
      + (notesParagraphs.length ? renderParagraphHtml(notesParagraphs) : '')
      + '<div class="cbse-badge-row">'
      + '<div class="cbse-badge"><div class="badge-icon"></div><div class="badge-value">CBSE</div><div class="badge-label">Affiliated Board</div></div>'
      + '<div class="cbse-badge"><div class="badge-icon"></div><div class="badge-value"><span class="p-num">' + escapeHtml(affiliationNo || '—') + '</span></div><div class="badge-label">Affiliation Number</div></div>'
      + '<div class="cbse-badge"><div class="badge-icon"></div><div class="badge-value"><span class="p-num">' + escapeHtml(validFrom && validTo ? (validFrom + ' to ' + validTo) : '—') + '</span></div><div class="badge-label">Affiliation Period</div></div>'
      + '</div>'
      + '<table class="info-table">'
      + '<tr><td>Board</td><td>Central Board of Secondary Education (C.B.S.E.), New Delhi</td></tr>'
      + '<tr><td>Affiliation Number</td><td><strong class="p-num">' + escapeHtml(affiliationNo || '—') + '</strong></td></tr>'
      + '<tr><td>Affiliation Type</td><td>' + escapeHtml(affiliationType || '—') + '</td></tr>'
      + '<tr><td>Affiliation Start Year</td><td><span class="p-num">' + escapeHtml(validFrom || '—') + '</span></td></tr>'
      + '<tr><td>Affiliation End Year</td><td><span class="p-num">' + escapeHtml(validTo || '—') + '</span></td></tr>'
      + '<tr><td>School Code</td><td>' + escapeHtml(schoolCode || '—') + '</td></tr>'
      + '</table>';
  }

  function renderAnnualReport(doc) {
    var card = document.querySelector('.content-card');
    if (!card) return;
    var reports = rowsFromTable(doc).map(function (row) {
      var cells = row.querySelectorAll('td');
      var visibleInput = row.querySelector('input[type="checkbox"]');
      return {
        year: text(cells[0]),
        title: text(cells[1]),
        url: text(cells[2]),
        size: text(cells[3]),
        visible: visibleInput ? checked(visibleInput) : true
      };
    }).filter(function (item) {
      return item.year && item.url && item.visible;
    });
    if (!reports.length) return;

    updatePageTitle('Annual Report');
    card.innerHTML = ''
      + '<h2>Annual Report</h2>'
      + '<p>The Annual Report of Loretto Central School provides a comprehensive overview of the school\'s achievements, academic performance, extracurricular milestones, and institutional summary for each academic year.</p>'
      + '<div class="report-grid">'
      + reports.map(function (item) {
          var reportTitle = item.title || ('Annual Report ' + item.year);
          return '<div class="report-card"><div class="report-card-top"><div class="year-icon"></div><div class="year">' + escapeHtml(item.year) + '</div><div class="year-label">Academic Year</div></div>'
            + '<div class="report-card-body"><p>' + escapeHtml(reportTitle) + (item.size ? ' · ' + escapeHtml(item.size) : '') + '</p>'
            + '<a href="' + escapeHtml(item.url) + '" class="report-download-btn" download target="_blank" rel="noopener noreferrer"> Download PDF</a></div></div>';
        }).join('')
      + '</div>';
  }

  async function boot() {
    var section = currentSection();
    if (!section) return;
    var sharedProfilePayload = await loadAboutBlock('school-profile');
    var sharedProfileDoc = parseHtmlPayload(sharedProfilePayload);
    var sharedBannerImage = extractBannerImageFromDoc(sharedProfileDoc);
    if (sharedBannerImage) setBannerImage(sharedBannerImage);
    var payload = await loadAboutBlock(section);
    var doc = parseHtmlPayload(payload);
    if (!doc) return;

    if (section === 'school-profile') return renderSchoolProfile(doc);
    if (section === 'management') return renderManagement(doc);
    if (section === 'manager-speaks') return renderMessage(doc, 'Manager', 'Loretto Central School, Loretto');
    if (section === 'principals-message') return renderMessage(doc, 'Principal', 'Loretto Central School');
    if (section === 'pta') return renderPta(doc);
    if (section === 'cbse-details') return renderCbse(doc);
    if (section === 'annual-report') return renderAnnualReport(doc);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
