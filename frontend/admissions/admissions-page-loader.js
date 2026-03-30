(function () {
  'use strict';

  var DEFAULTS = {
    hero: {
      title: 'Admissions',
      desc: '',
      bgImage: ''
    },
    subnav: ['Overview', 'Admission Enquiry', 'Transfer Certificate Format', 'Fee Structure'],
    status: {
      academicYear: '',
      isOpen: true,
      badge: '',
      notice: ''
    },
    overview: {
      formsHeading: 'Application Forms',
      formsDesc: '',
      stepsTitle: '',
      highlights: [],
      steps: [],
      cta: {
        heading: '',
        desc: '',
        label: '',
        link: '2-admission-enquiry.html'
      }
    },
    enquiryPage: {
      formsHeading: 'Application Forms',
      formsDesc: '',
      intro: '',
      rules: [],
      documentsIntro: '',
      documents: [],
      officeInfo: {
        heading: '',
        address: '',
        phone: '',
        website: ''
      },
      quickTips: []
    },
    feePage: {
      year: '',
      intro: '',
      overviewTitle: '',
      overviewText: '',
      rows: [],
      notes: [],
      paymentMethods: [],
      pdfTitle: '',
      pdfDesc: ''
    },
    tcPage: {
      intro: '',
      previewIntro: '',
      rulesTitle: '',
      rules: [],
      notePrimary: '',
      noteSecondary: '',
      pdfTitle: '',
      pdfDesc: ''
    },
    seo: {
      title: '',
      desc: ''
    }
  };

  var PAGE_MAP = {
    '1-admissions.html': { id: 'overview', navIndex: 0, title: function (settings) { return settings.hero.title || 'Admissions'; } },
    '2-admission-enquiry.html': { id: 'enquiry', navIndex: 1, title: function (settings) { return settings.subnav[1] || 'Admission Enquiry'; } },
    '3-transfer-certificate.html': { id: 'tc', navIndex: 2, title: function (settings) { return settings.subnav[2] || 'Transfer Certificate Format'; } },
    '4-fee-structure.html': { id: 'fee', navIndex: 3, title: function (settings) { return settings.subnav[3] || 'Fee Structure'; } }
  };

  function fileName() {
    var parts = window.location.pathname.split('/');
    var f = parts[parts.length - 1] || '1-admissions.html';
    if (f && !/\\.html$/i.test(f) && !/[?#]/.test(f)) f += '.html';
    return f;
  }

  function pageConfig() {
    return PAGE_MAP[fileName()] || PAGE_MAP['1-admissions.html'];
  }

  function hasOwn(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }

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

  function arrayOrDefault(obj, key, fallback) {
    return hasOwn(obj, key) && Array.isArray(obj[key]) ? obj[key] : fallback;
  }

  function mergeSettings(raw) {
    var source = raw && typeof raw === 'object' ? raw : {};
    var overview = source.overview && typeof source.overview === 'object' ? source.overview : {};
    var enquiryPage = source.enquiryPage && typeof source.enquiryPage === 'object' ? source.enquiryPage : {};
    var feePage = source.feePage && typeof source.feePage === 'object' ? source.feePage : {};
    var tcPage = source.tcPage && typeof source.tcPage === 'object' ? source.tcPage : {};
    var officeInfo = enquiryPage.officeInfo && typeof enquiryPage.officeInfo === 'object' ? enquiryPage.officeInfo : {};

    return {
      hero: {
        title: normalizeText(source.hero && source.hero.title) || DEFAULTS.hero.title,
        desc: normalizeText(source.hero && source.hero.desc) || DEFAULTS.hero.desc,
        bgImage: normalizeText(source.hero && source.hero.bgImage) || DEFAULTS.hero.bgImage
      },
      subnav: Array.isArray(source.subnav) && source.subnav.length
        ? DEFAULTS.subnav.map(function (label, index) {
            return normalizeText(source.subnav[index]) || label;
          })
        : DEFAULTS.subnav.slice(),
      status: {
        academicYear: normalizeText(source.status && source.status.academicYear) || DEFAULTS.status.academicYear,
        isOpen: !source.status || source.status.isOpen !== false,
        badge: normalizeText(source.status && source.status.badge) || DEFAULTS.status.badge,
        notice: normalizeText(source.status && source.status.notice) || DEFAULTS.status.notice
      },
      overview: {
        formsHeading: normalizeText(overview.formsHeading) || DEFAULTS.overview.formsHeading,
        formsDesc: normalizeText(overview.formsDesc) || DEFAULTS.overview.formsDesc,
        stepsTitle: normalizeText(overview.stepsTitle) || DEFAULTS.overview.stepsTitle,
        highlights: arrayOrDefault(overview, 'highlights', DEFAULTS.overview.highlights),
        steps: arrayOrDefault(overview, 'steps', DEFAULTS.overview.steps),
        cta: {
          heading: normalizeText(overview.cta && overview.cta.heading) || DEFAULTS.overview.cta.heading,
          desc: normalizeText(overview.cta && overview.cta.desc) || DEFAULTS.overview.cta.desc,
          label: normalizeText(overview.cta && overview.cta.label) || DEFAULTS.overview.cta.label,
          link: normalizeText(overview.cta && overview.cta.link) || DEFAULTS.overview.cta.link
        }
      },
      enquiryPage: {
        formsHeading: normalizeText(enquiryPage.formsHeading) || DEFAULTS.enquiryPage.formsHeading,
        formsDesc: normalizeText(enquiryPage.formsDesc) || DEFAULTS.enquiryPage.formsDesc,
        intro: normalizeText(enquiryPage.intro) || DEFAULTS.enquiryPage.intro,
        rules: arrayOrDefault(enquiryPage, 'rules', DEFAULTS.enquiryPage.rules),
        documentsIntro: normalizeText(enquiryPage.documentsIntro) || DEFAULTS.enquiryPage.documentsIntro,
        documents: arrayOrDefault(enquiryPage, 'documents', DEFAULTS.enquiryPage.documents),
        officeInfo: {
          heading: normalizeText(officeInfo.heading) || DEFAULTS.enquiryPage.officeInfo.heading,
          address: normalizeText(officeInfo.address) || DEFAULTS.enquiryPage.officeInfo.address,
          phone: normalizeText(officeInfo.phone) || DEFAULTS.enquiryPage.officeInfo.phone,
          website: normalizeText(officeInfo.website) || DEFAULTS.enquiryPage.officeInfo.website
        },
        quickTips: arrayOrDefault(enquiryPage, 'quickTips', DEFAULTS.enquiryPage.quickTips)
      },
      feePage: {
        year: normalizeText(feePage.year) || DEFAULTS.feePage.year,
        intro: normalizeText(feePage.intro) || DEFAULTS.feePage.intro,
        overviewTitle: normalizeText(feePage.overviewTitle) || DEFAULTS.feePage.overviewTitle,
        overviewText: normalizeText(feePage.overviewText) || DEFAULTS.feePage.overviewText,
        rows: arrayOrDefault(feePage, 'rows', DEFAULTS.feePage.rows),
        notes: arrayOrDefault(feePage, 'notes', DEFAULTS.feePage.notes),
        paymentMethods: arrayOrDefault(feePage, 'paymentMethods', DEFAULTS.feePage.paymentMethods),
        pdfTitle: normalizeText(feePage.pdfTitle) || DEFAULTS.feePage.pdfTitle,
        pdfDesc: normalizeText(feePage.pdfDesc) || DEFAULTS.feePage.pdfDesc
      },
      tcPage: {
        intro: normalizeText(tcPage.intro) || DEFAULTS.tcPage.intro,
        previewIntro: normalizeText(tcPage.previewIntro) || DEFAULTS.tcPage.previewIntro,
        rulesTitle: normalizeText(tcPage.rulesTitle) || DEFAULTS.tcPage.rulesTitle,
        rules: arrayOrDefault(tcPage, 'rules', DEFAULTS.tcPage.rules),
        notePrimary: normalizeText(tcPage.notePrimary) || DEFAULTS.tcPage.notePrimary,
        noteSecondary: normalizeText(tcPage.noteSecondary) || DEFAULTS.tcPage.noteSecondary,
        pdfTitle: normalizeText(tcPage.pdfTitle) || DEFAULTS.tcPage.pdfTitle,
        pdfDesc: normalizeText(tcPage.pdfDesc) || DEFAULTS.tcPage.pdfDesc
      },
      seo: {
        title: normalizeText(source.seo && source.seo.title) || DEFAULTS.seo.title,
        desc: normalizeText(source.seo && source.seo.desc) || DEFAULTS.seo.desc
      }
    };
  }

  async function fetchJson(endpoint) {
    try {
      var base = '/api';
      if (typeof window.resolveApiBase === 'function') {
        base = await window.resolveApiBase();
      }
      var response = await fetch(String(base).replace(/\/+$/, '') + '/' + String(endpoint).replace(/^\/+/, ''));
      if (!response.ok) return null;
      return await response.json().catch(function () { return null; });
    } catch (error) {
      return null;
    }
  }

  async function loadSettings() {
    var payload = null;
    if (typeof window.loadSettingData === 'function') {
      payload = await window.loadSettingData('admissions');
    }
    if (!payload) {
      payload = await fetchJson('settings/admissions');
    }
    return mergeSettings(payload && payload.data ? payload.data : payload);
  }

  function docTime(item) {
    var value = item && (item.date || item.updatedAt || item.createdAt) ? (item.date || item.updatedAt || item.createdAt) : '';
    var parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function compareDocs(a, b) {
    var orderDiff = (a.order || 0) - (b.order || 0);
    if (orderDiff !== 0) return orderDiff;
    return docTime(b) - docTime(a);
  }

  async function loadDocuments() {
    var docs = null;
    if (typeof window.loadDocumentsData === 'function') {
      docs = await window.loadDocumentsData();
    }
    if (!Array.isArray(docs)) {
      docs = await fetchJson('documents');
    }

    var items = (Array.isArray(docs) ? docs : []).filter(Boolean);
    var forms = items.filter(function (item) {
      return item.category === 'admission-form' && item.url && item.visible !== false;
    }).sort(compareDocs);
    var feeDoc = items.filter(function (item) {
      return item.category === 'fee-structure' && item.url && item.visible !== false;
    }).sort(compareDocs)[0] || null;
    var tcDoc = items.filter(function (item) {
      return item.category === 'tc-format' && item.url && item.visible !== false;
    }).sort(compareDocs)[0] || null;

    return { forms: forms, feeDoc: feeDoc, tcDoc: tcDoc };
  }

  function ensureHeroStyle(url) {
    var clean = normalizeText(url);
    if (!clean) return;
    var style = document.getElementById('admissions-hero-runtime-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'admissions-hero-runtime-style';
      document.head.appendChild(style);
    }
    style.textContent = '.page-banner::before{background:url("' + clean.replace(/"/g, '\\"') + '") center/cover no-repeat !important;opacity:.15;}';
  }

  function updateMeta(settings, currentTitle, currentDesc) {
    if (settings.seo.title && pageConfig().id === 'overview') {
      document.title = settings.seo.title;
    } else if (currentTitle) {
      document.title = currentTitle;
    }

    var meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = settings.seo.desc || currentDesc || DEFAULTS.seo.desc;
  }

  function updateBanner(settings) {
    var config = pageConfig();
    var bannerTitle = document.querySelector('.page-banner h1');
    var bannerText = document.querySelector('.page-banner p');
    var breadcrumb = document.querySelector('.breadcrumb');
    var currentTitle = config.title(settings);

    if (bannerTitle) bannerTitle.textContent = currentTitle;
    if (config.id === 'overview' && bannerText) {
      bannerText.textContent = settings.hero.desc;
    }
    if (breadcrumb && breadcrumb.lastElementChild && breadcrumb.lastElementChild.tagName === 'SPAN') {
      breadcrumb.lastElementChild.textContent = currentTitle;
    }
    ensureHeroStyle(settings.hero.bgImage);
  }

  function updateSubnav(settings) {
    var links = document.querySelectorAll('.adm-subnav-inner a');
    var labels = settings.subnav.slice();
    links.forEach(function (link, index) {
      if (labels[index]) link.textContent = labels[index];
      link.classList.toggle('active', index === pageConfig().navIndex);
    });
  }

  function sortByOrder(list) {
    return (Array.isArray(list) ? list.slice() : []).sort(function (a, b) {
      return (parseInt(a.order, 10) || 0) - (parseInt(b.order, 10) || 0);
    });
  }

  function renderOverviewNotice(settings) {
    var row = document.querySelector('.adm-highlight-row');
    var downloadSection = document.querySelector('.download-section');
    if (!row || !downloadSection) return;

    var title = normalizeText(settings.status.badge) || (settings.status.isOpen ? 'Admissions Open' : 'Admissions Closed');
    var body = normalizeText(settings.status.notice);
    var existing = document.getElementById('admissions-runtime-notice');

    if (!title && !body) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'admissions-runtime-notice';
      existing.className = 'enquiry-notice';
      downloadSection.parentNode.insertBefore(existing, downloadSection);
    }

    existing.innerHTML = '<div class="notice-icon">' + (settings.status.isOpen ? '📢' : '⚠️') + '</div>'
      + '<div><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(body) + '</p></div>';
  }

  function renderOverview(settings, docs) {
    var highlightRow = document.querySelector('.adm-highlight-row');
    if (highlightRow) {
      highlightRow.innerHTML = sortByOrder(settings.overview.highlights).map(function (item) {
        return '<div class="adm-highlight-card">'
          + '<div class="icon">' + escapeHtml(item.icon || '') + '</div>'
          + '<h3>' + escapeHtml(item.title || '') + '</h3>'
          + '<p>' + escapeHtml(item.desc || '') + '</p>'
          + '</div>';
      }).join('');
    }

    renderOverviewNotice(settings);

    var downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
      var heading = downloadSection.querySelector('h3');
      var intro = Array.prototype.slice.call(downloadSection.children).find(function (node) {
        return node.tagName === 'P';
      });
      if (heading) heading.textContent = settings.overview.formsHeading;
      if (intro) intro.textContent = settings.overview.formsDesc;

      if (docs.forms.length) {
        var cards = downloadSection.querySelector('.download-cards');
        if (cards) {
          cards.innerHTML = docs.forms.map(function (item) {
            var meta = item.meta && typeof item.meta === 'object' ? item.meta : {};
            return '<div class="download-card">'
              + '<div class="download-card-top">'
              + '<div class="doc-icon">' + escapeHtml(meta.icon || item.icon || '📄') + '</div>'
              + '<div class="doc-type">' + escapeHtml(item.type || meta.type || 'PDF Form') + '</div>'
              + '</div>'
              + '<div class="download-card-body">'
              + '<h4>' + escapeHtml(item.title || 'Application Form') + '</h4>'
              + '<p>' + escapeHtml(item.description || ('For ' + (meta.forClass || item.forClass || 'admissions') + '.')) + '</p>'
              + '<a href="' + escapeHtml(item.url) + '" class="download-btn" target="_blank" rel="noopener noreferrer" download>'
              + '<span class="btn-icon">⬇</span> Download Form'
              + '</a>'
              + '</div>'
              + '</div>';
          }).join('');
        }
      }
    }

    var stepsSection = document.querySelector('.steps-section');
    if (stepsSection) {
      var title = stepsSection.querySelector('h3');
      if (title) title.textContent = settings.overview.stepsTitle;
      var grid = stepsSection.querySelector('.steps-grid');
      if (grid) {
        grid.innerHTML = sortByOrder(settings.overview.steps).map(function (item) {
          return '<div class="step-card">'
            + '<div class="step-num">' + escapeHtml(item.order || '') + '</div>'
            + '<h4>' + escapeHtml(item.title || '') + '</h4>'
            + '<p>' + escapeHtml(item.desc || '') + '</p>'
            + '</div>';
        }).join('');
      }
    }

    var cta = document.querySelector('.contact-cta');
    if (cta) {
      var ctaTitle = cta.querySelector('h3');
      var ctaDesc = cta.querySelector('p');
      var ctaLink = cta.querySelector('a');
      var hasCtaContent = normalizeText(settings.overview.cta.heading)
        || normalizeText(settings.overview.cta.desc)
        || normalizeText(settings.overview.cta.label);
      cta.style.display = hasCtaContent ? '' : 'none';
      if (ctaTitle) ctaTitle.textContent = settings.overview.cta.heading;
      if (ctaDesc) ctaDesc.textContent = settings.overview.cta.desc;
      if (ctaLink) {
        ctaLink.textContent = settings.overview.cta.label;
        ctaLink.href = settings.overview.cta.link || '2-admission-enquiry.html';
      }
    }
  }

  function numberedListMarkup(items, bulletClass, blankBullet) {
    return (Array.isArray(items) ? items : []).map(function (item, index) {
      return '<li><div class="' + bulletClass + '">' + (blankBullet ? '' : String(index + 1)) + '</div>' + escapeHtml(item || '') + '</li>';
    }).join('');
  }

  function renderFormsSidebar(container, headingText, introText, forms) {
    if (!container) return;
    var heading = container.querySelector('h4');
    var intro = container.querySelector('p');
    if (heading) heading.textContent = headingText;
    if (intro) intro.textContent = introText;
    if (!forms.length) return;

    Array.prototype.slice.call(container.querySelectorAll('.download-link')).forEach(function (node) {
      node.remove();
    });

    var markup = forms.map(function (item) {
      var meta = item.meta && typeof item.meta === 'object' ? item.meta : {};
      return '<a href="' + escapeHtml(item.url) + '" class="download-link" target="_blank" rel="noopener noreferrer" download>'
        + '<div class="dl-icon">' + escapeHtml(meta.icon || item.icon || '📄') + '</div>'
        + '<div class="dl-info">'
        + '<span class="dl-name">' + escapeHtml(item.title || 'Application Form') + '</span>'
        + '<span class="dl-type">' + escapeHtml(item.type || 'PDF') + ' · ' + escapeHtml(meta.forClass || item.forClass || 'Application Form') + '</span>'
        + '</div>'
        + '</a>';
    }).join('');

    container.insertAdjacentHTML('beforeend', markup);
  }

  function renderEnquiryPage(settings, docs) {
    var card = document.querySelector('.content-card');
    if (card) {
      var heading = card.querySelector('h2');
      if (heading) heading.textContent = pageConfig().title(settings);
      var paragraphs = card.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = settings.enquiryPage.intro;
      if (paragraphs[1]) paragraphs[1].textContent = settings.enquiryPage.documentsIntro;

      var headings = card.querySelectorAll('h3');
      if (headings[0]) headings[0].textContent = 'Rules for Admission';
      if (headings[1]) headings[1].textContent = 'Documents Required';

      var lists = card.querySelectorAll('.rules-list');
      if (lists[0]) lists[0].innerHTML = numberedListMarkup(settings.enquiryPage.rules, 'rule-bullet', false);
      if (lists[1]) lists[1].innerHTML = numberedListMarkup(settings.enquiryPage.documents, 'rule-bullet', true);
    }

    var sidebarCards = document.querySelectorAll('.sidebar .sidebar-card');
    renderFormsSidebar(sidebarCards[0], settings.enquiryPage.formsHeading, settings.enquiryPage.formsDesc, docs.forms);

    var infoCard = document.querySelector('.sidebar .info-card');
    if (infoCard) {
      var officeRows = [];
      if (normalizeText(settings.enquiryPage.officeInfo.address)) {
        officeRows.push('<div class="info-row"><span>📍</span><span>' + formatTextHtml(settings.enquiryPage.officeInfo.address) + '</span></div>');
      }
      if (normalizeText(settings.enquiryPage.officeInfo.phone)) {
        officeRows.push('<div class="info-row"><span>🕒</span><span>' + escapeHtml(settings.enquiryPage.officeInfo.phone) + '</span></div>');
      }
      if (normalizeText(settings.enquiryPage.officeInfo.website)) {
        officeRows.push('<div class="info-row"><span>🌐</span><span><a href="' + escapeHtml(settings.enquiryPage.officeInfo.website) + '" target="_blank" rel="noopener noreferrer" style="color:var(--gold-light)">' + escapeHtml(settings.enquiryPage.officeInfo.website.replace(/^https?:\/\//, '')) + '</a></span></div>');
      }
      infoCard.innerHTML = (normalizeText(settings.enquiryPage.officeInfo.heading) ? '<h4>' + escapeHtml(settings.enquiryPage.officeInfo.heading) + '</h4>' : '')
        + officeRows.join('');
    }

    if (sidebarCards[1]) {
      sidebarCards[1].innerHTML = '<h4>Quick Tips</h4>'
        + settings.enquiryPage.quickTips.map(function (item) {
            return '<p>• ' + escapeHtml(item) + '</p>';
          }).join('');
    }
  }

  function renderTransferPage(settings, docs) {
    var title = pageConfig().title(settings);
    var card = document.querySelector('.content-card');
    if (card) {
      var heading = card.querySelector('h2');
      if (heading) heading.textContent = title;
      var paragraphs = card.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = settings.tcPage.intro;
      if (paragraphs[1]) paragraphs[1].textContent = settings.tcPage.previewIntro;

      var feature = card.querySelector('.download-feature-card');
      if (feature) {
        var featureTitle = feature.querySelector('h3');
        var featureDesc = feature.querySelector('p');
        var featureLink = feature.querySelector('a');
        if (featureTitle) featureTitle.textContent = settings.tcPage.pdfTitle;
        if (featureDesc) featureDesc.textContent = settings.tcPage.pdfDesc;
        if (featureLink && docs.tcDoc && docs.tcDoc.url) {
          featureLink.href = docs.tcDoc.url;
        }
      }
    }

    var sidebarCards = document.querySelectorAll('.sidebar .sidebar-card');
    if (sidebarCards[0]) {
      sidebarCards[0].innerHTML = '<h4>' + escapeHtml(settings.tcPage.rulesTitle) + '</h4>'
        + '<ul class="info-steps">'
        + settings.tcPage.rules.map(function (item, index) {
            return '<li><div class="step-n">' + (index + 1) + '</div>' + escapeHtml(item) + '</li>';
          }).join('')
        + '</ul>';
    }

    if (sidebarCards[1]) {
      sidebarCards[1].innerHTML = '<h4>Important Notes</h4>'
        + '<div class="warn-box"><p>' + escapeHtml(settings.tcPage.notePrimary) + '</p></div>'
        + '<p style="margin-top:14px;">' + escapeHtml(settings.tcPage.noteSecondary) + '</p>';
    }
  }

  function feeRowMarkup(item) {
    var group = normalizeText(item.group);
    return '<tr>'
      + '<td>' + escapeHtml(item.feeType || '') + (group ? ' <span class="class-badge">' + escapeHtml(group) + '</span>' : '') + '</td>'
      + '<td>' + escapeHtml(item.amount || '') + '</td>'
      + '<td>' + escapeHtml(item.frequency || '') + '</td>'
      + '</tr>';
  }

  function renderFeePage(settings, docs) {
    var title = pageConfig().title(settings);
    var card = document.querySelector('.content-card');
    if (card) {
      var heading = card.querySelector('h2');
      if (heading) heading.textContent = title;
      var badge = card.querySelector('.ay-badge span');
      if (badge) badge.textContent = settings.feePage.year;
      var paragraphs = card.querySelectorAll('p');
      if (paragraphs[0]) paragraphs[0].textContent = settings.feePage.intro;
      if (paragraphs[1]) paragraphs[1].textContent = settings.feePage.overviewText;

      var headings = card.querySelectorAll('h3');
      if (headings[0]) headings[0].textContent = settings.feePage.overviewTitle;
      if (headings[1]) headings[1].textContent = settings.feePage.pdfTitle;
      if (headings[2]) headings[2].textContent = 'Important Fee Notes';
      if (headings[3]) headings[3].textContent = 'Fee Payment Methods';

      var body = card.querySelector('.fee-table tbody');
      if (body) {
        body.innerHTML = settings.feePage.rows.map(feeRowMarkup).join('');
      }

      var cta = card.querySelector('.fee-download-cta');
      if (cta) {
        var ctaDesc = cta.querySelector('.cta-text p');
        var ctaLink = cta.querySelector('a');
        if (ctaDesc) ctaDesc.textContent = settings.feePage.pdfDesc;
        if (ctaLink && docs.feeDoc && docs.feeDoc.url) {
          ctaLink.href = docs.feeDoc.url;
        }
      }

      var notes = card.querySelector('.fee-note-list');
      if (notes) {
        notes.innerHTML = settings.feePage.notes.map(function (item) {
          return '<li><div class="note-dot"></div>' + escapeHtml(item) + '</li>';
        }).join('');
      }

      var paymentCards = card.querySelector('.payment-cards');
      if (paymentCards) {
        paymentCards.innerHTML = settings.feePage.paymentMethods.map(function (item) {
          var link = normalizeText(item.link);
          return '<div class="payment-card">'
            + '<div class="pay-icon">' + escapeHtml(item.icon || '') + '</div>'
            + '<h4>' + escapeHtml(item.title || '') + '</h4>'
            + '<p>' + escapeHtml(item.desc || '') + '</p>'
            + (link ? '<a href="' + escapeHtml(link) + '" class="online-pay-btn" target="_blank" rel="noopener noreferrer">Pay Online →</a>' : '')
            + '</div>';
        }).join('');
      }
    }
  }

  async function main() {
    var currentTitle = document.title;
    var settings = await loadSettings();
    var docs = await loadDocuments();
    updateBanner(settings);
    updateSubnav(settings);
    updateMeta(settings, currentTitle, settings.hero.desc);

    if (pageConfig().id === 'overview') renderOverview(settings, docs);
    if (pageConfig().id === 'enquiry') renderEnquiryPage(settings, docs);
    if (pageConfig().id === 'tc') renderTransferPage(settings, docs);
    if (pageConfig().id === 'fee') renderFeePage(settings, docs);
  }

  window.addEventListener('DOMContentLoaded', function () {
    main().catch(function () {
      /* Keep static fallback content if runtime loading fails. */
    });
  });
})();
