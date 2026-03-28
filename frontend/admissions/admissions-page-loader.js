(function () {
  'use strict';

  var DEFAULTS = {
    hero: {
      title: 'Admissions',
      desc: "Begin your child's journey of excellence at Loretto Central School — where every learner is valued, nurtured, and inspired.",
      bgImage: ''
    },
    subnav: ['Overview', 'Admission Enquiry', 'Transfer Certificate Format', 'Fee Structure'],
    status: {
      academicYear: '2025–2026',
      isOpen: true,
      badge: 'Admissions Open for 2025–26',
      notice: 'Admissions for the academic year 2025–26 are now open. Visit the school office or download the application form to begin the process.'
    },
    overview: {
      formsHeading: 'Download Application Forms',
      formsDesc: 'Choose the appropriate application form based on the class you are applying for. Fill in the form carefully and submit it to the school office along with the required documents.',
      stepsTitle: 'Admission Process at a Glance',
      highlights: [
        { order: '1', icon: '🏫', title: 'CBSE Affiliated', desc: 'Fully affiliated to CBSE, New Delhi (Affiliation No. 831368), offering LKG to Class X education.' },
        { order: '2', icon: '🌍', title: 'All Are Welcome', desc: 'Open to boys and girls of all communities — irrespective of caste, creed, or social status.' },
        { order: '3', icon: '📋', title: 'Simple Process', desc: 'Download the application form, fill it with the required documents, and submit to the school office.' }
      ],
      steps: [
        { order: '1', title: 'Download Form', desc: 'Download the relevant application form from this page or collect it from the school office.' },
        { order: '2', title: 'Fill & Prepare', desc: 'Complete the form with accurate details. Gather required documents: TC, birth certificate, photos, etc.' },
        { order: '3', title: 'Submit at Office', desc: 'Submit the filled form with all documents at the school office during working hours.' },
        { order: '4', title: 'Confirmation', desc: 'Pay the prescribed fees upon confirmation. Fee payment can be done in instalments as permitted.' }
      ],
      cta: {
        heading: 'Have Questions About Admissions?',
        desc: 'Visit the school office or explore our detailed Admission Enquiry page for complete rules and guidelines.',
        label: 'Admission Enquiry →',
        link: '2-admission-enquiry.html'
      }
    },
    enquiryPage: {
      formsHeading: 'Download Application Forms',
      formsDesc: "Choose the form that applies to your child's class:",
      intro: 'Committed to our core value of nurturing excellence, we at Loretto Central School ensure that optimum learning happens for your child in an environment that is student-centric, fosters mutual respect, and stimulates innovation. With an intention to serve the student and parent communities and remain completely impartial, the school follows an explicit admission process.',
      rules: [
        'The school, which mainly runs for the Christian minority community, is also open for admission to boys and girls irrespective of caste, creed, or social status.',
        'The child should complete the age prescribed by the Government to be admitted to the 1st standard.',
        'Every student for admission and withdrawal from the school must be introduced by letter or in person by someone responsible to the Head of the School.',
        'Application for admission should be made in the prescribed form, which can be obtained from the office, and must be submitted along with the Transfer Certificate from the school previously attended.',
        'Every pupil on admission shall pay the prescribed fees. No fees shall be refunded for any cause.',
        'The payment may be made in instalments as prescribed by the school management. The entire fee is to be remitted by February end.',
        'Pupils coming from secondary or primary schools should produce a Transfer Certificate and Conduct Certificate issued by the Head of the School concerned.',
        'Pupils coming from schools outside Dakshina Kannada district or outside Karnataka State will be admitted on production of a Transfer Certificate duly countersigned by the concerned authorities of the Department of Education, in strict conformity with the rules and standards issued by the department.',
        'In the case of admission of pupils coming from primary or secondary schools, the date of birth furnished in the Transfer Certificate will be taken as correct.',
        'The admission application must be signed by the father or mother or, in their absence, by the guardian who has been authorized by the parents. The letter of authorization must be filed with the admission form.'
      ],
      documentsIntro: 'Please bring the following documents when submitting your application to the school office:',
      documents: [
        'Completed Application Form (downloaded and filled)',
        'Transfer Certificate (TC) from previous school (for Classes 1–8)',
        'Conduct Certificate from previous school (where applicable)',
        'Original Birth Certificate of the child',
        'Recent passport-size photographs of the student (2–4 copies)',
        'Aadhar Card copy of student and parent/guardian',
        'Caste Certificate / Community Certificate (if applicable)',
        'Previous academic records / report card'
      ],
      officeInfo: {
        heading: 'School Office Information',
        address: 'Loretto Central School\nLoretto Padavu, Bantwal\nDakshina Kannada – 574219',
        phone: 'Please enquire during school working hours',
        website: 'https://lorettocentralschool.edu.in'
      },
      quickTips: [
        'Collect or download forms in advance',
        'Fill all fields accurately and completely',
        'Keep original documents ready for verification',
        'Submit during office working hours only',
        'Fees once paid are non-refundable'
      ]
    },
    feePage: {
      year: '2025–2026',
      intro: 'The fee structure below is applicable for the Academic Year 2025–2026. Fees are to be paid as per the schedule prescribed by the school management. Please download the official fee structure PDF for the most current and complete details.',
      overviewTitle: 'Fee Structure Overview',
      overviewText: 'The official fee structure for the academic year 2025–26 is available for download below. The table below provides a general overview of fee categories applicable across classes.',
      rows: [
        { group: '', feeType: 'Tuition Fee', amount: 'Core academic instruction charges', frequency: 'Annual / Term' },
        { group: '', feeType: 'Admission / Registration Fee', amount: 'One-time fee at the time of new admission', frequency: 'One-time' },
        { group: '', feeType: 'Development Fee', amount: 'Infrastructure and facility development', frequency: 'Annual' },
        { group: '', feeType: 'Library Fee', amount: 'Access to school library and reading resources', frequency: 'Annual' },
        { group: '', feeType: 'Laboratory Fee', amount: 'Science / Computer lab usage charges', frequency: 'Annual' },
        { group: '', feeType: 'Sports & Activities Fee', amount: 'Co-curricular and sports activities', frequency: 'Annual' },
        { group: '', feeType: 'Examination Fee', amount: 'Internal and CBSE board examination charges', frequency: 'Annual' }
      ],
      notes: [
        'The entire fee for the academic year is to be remitted by the end of February.',
        'Fee payment may be made in instalments as prescribed by the school management.',
        'No fees shall be refunded for any cause once paid.',
        'Every pupil on admission shall pay the prescribed admission fees before commencement of classes.',
        'Online fee payment is available. Please visit the Online Fees Payment section for details.',
        'For fee-related queries, kindly contact the school office during working hours.',
        'Fee structure is subject to revision by the management for subsequent academic years.'
      ],
      paymentMethods: [
        { icon: '🏫', title: 'School Office (Cash / DD)', desc: 'Pay in person at the school accounts office during working hours. Demand Drafts are also accepted.', link: '' },
        { icon: '🌐', title: 'Online Payment', desc: 'Pay conveniently through our online payment portal. Secure and instant.', link: 'https://school.edu/online-fees-payment/' },
        { icon: '🏦', title: 'NEFT / Bank Transfer', desc: "Direct bank transfer to the school's bank account. Contact the office for bank details.", link: '' }
      ],
      pdfTitle: 'Download Official Fee Structure PDF',
      pdfDesc: 'Download the complete and up-to-date fee structure for Academic Year 2025–2026, including class-wise breakdowns and all applicable charges.'
    },
    tcPage: {
      intro: 'The Transfer Certificate (TC) is an official document issued by a school to a student upon leaving, confirming their enrollment details, academic standing, and conduct. A TC from the previous school is mandatory for admission to Loretto Central School for students transferring from other institutions.',
      previewIntro: 'The following CBSE-standard Transfer Certificate format is in use for our CBSE-affiliated school:',
      rulesTitle: 'When is TC Required?',
      rules: [
        'Transferring from any other school to Loretto Central School for Classes 1–8',
        'Students coming from schools outside Dakshina Kannada district',
        'Students transferring from schools outside Karnataka State (TC must be countersigned)',
        'When a student leaves Loretto Central School to join another institution'
      ],
      notePrimary: 'The date of birth mentioned in the Transfer Certificate from the previous school will be taken as final and correct for admission purposes.',
      noteSecondary: 'Students from outside Karnataka must have their TC countersigned by the concerned District Education Officer (DEO) before submission.',
      pdfTitle: 'Download Official TC Format',
      pdfDesc: 'Download the official CBSE-standard Transfer Certificate format used by Loretto Central School.'
    },
    seo: {
      title: 'Admissions | Loretto Central School',
      desc: 'Apply for admissions at Loretto Central School. Download application forms, view fee structure, and explore admission guidelines.'
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
    return parts[parts.length - 1] || '1-admissions.html';
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
      infoCard.innerHTML = '<h4>' + escapeHtml(settings.enquiryPage.officeInfo.heading) + '</h4>'
        + '<div class="info-row"><span>📍</span><span>' + formatTextHtml(settings.enquiryPage.officeInfo.address) + '</span></div>'
        + '<div class="info-row"><span>🕒</span><span>' + escapeHtml(settings.enquiryPage.officeInfo.phone) + '</span></div>'
        + '<div class="info-row"><span>🌐</span><span><a href="' + escapeHtml(settings.enquiryPage.officeInfo.website) + '" target="_blank" rel="noopener noreferrer" style="color:var(--gold-light)">' + escapeHtml(settings.enquiryPage.officeInfo.website.replace(/^https?:\/\//, '')) + '</a></span></div>';
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
