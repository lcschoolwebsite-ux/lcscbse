(function () {
  'use strict';

  var API = '/api';
  var state = {
    heroImage: '',
    aboutImage: '',
    logo: '',
    testimonialModalImage: '',
    testimonialUploadPromise: null,
    testimonialUploadInProgress: false,
    testimonials: [],
    health: null
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function panel(id) {
    return document.getElementById('panel-' + id);
  }

  function toast(message, isError) {
    var el = document.getElementById('saveToast');
    if (!el) return;
    el.textContent = ' ' + message;
    el.style.borderLeft = isError ? '4px solid #e74c3c' : '4px solid #c8960c';
    el.classList.add('show');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 3200);
  }

  async function apiJson(path, options) {
    var init = Object.assign({}, options || {});
    init.headers = Object.assign(
      { 'Content-Type': 'application/json' },
      init.headers || {}
    );
    if (!init.body) {
      delete init.headers['Content-Type'];
    }

    var response = await fetch(API + path, init);
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      throw new Error(data.error || data.message || ('Request failed: ' + response.status));
    }
    return data;
  }

  async function uploadFile(file) {
    var formData = new FormData();
    formData.append('file', file);
    var response = await fetch(API + '/upload', {
      method: 'POST',
      body: formData
    });
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data;
  }

  function setUploadZoneMessage(zone, title, subtitle) {
    if (!zone) return;
    var titleEl = qs('.uz-title', zone);
    var subEl = qs('.uz-sub', zone);
    if (titleEl && title) titleEl.textContent = title;
    if (subEl && subtitle) subEl.innerHTML = subtitle;
  }

  function setButtonBusy(button, isBusy, busyLabel, idleLabel) {
    if (!button) return;
    button.disabled = !!isBusy;
    if (isBusy && busyLabel) button.textContent = busyLabel;
    if (!isBusy && idleLabel) button.textContent = idleLabel;
  }

  function escapeAttr(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setImagePreview(box, url, altText, fallbackText) {
    if (!box) return;
    var cleanUrl = String(url || '').trim();
    if (!cleanUrl) {
      box.innerHTML = fallbackText || 'IMG';
      return;
    }
    box.innerHTML = '<img src="' + escapeAttr(cleanUrl) + '" alt="' + escapeAttr(altText || 'Preview') + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.textContent=\'' + escapeAttr(fallbackText || 'IMG').replace(/'/g, '&#39;') + '\'" />';
  }

  function galleryRowHtml(item) {
    var image = item && (item.image || item.url) ? (item.image || item.url) : '';
    var label = item && item.label ? item.label : '';
    var visible = !item || item.visible !== false;
    return ''
      + '<tr>'
      + '<td>'
      + '<div style="display:flex;align-items:center;gap:10px;">'
      + '<div style="width:54px;height:42px;border-radius:8px;overflow:hidden;background:var(--bg2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.68rem;color:var(--text-muted);">'
      + (image ? '<img src="' + escapeAttr(image) + '" alt="' + escapeAttr(label || 'Gallery image') + '" style="width:100%;height:100%;object-fit:cover;" />' : 'IMG')
      + '</div>'
      + '<div style="display:grid;gap:6px;width:100%;">'
      + '<input type="url" value="' + escapeAttr(image) + '" placeholder="Cloudinary image URL" style="border:1px solid var(--border);border-radius:6px;padding:6px 10px;font-family:Nunito;font-size:0.8rem;"/>'
      + '<button class="btn-sm outline" type="button" data-action="upload-gallery">Upload</button>'
      + '</div>'
      + '</div>'
      + '</td>'
      + '<td><input type="text" value="' + escapeAttr(label) + '" style="border:1px solid var(--border);border-radius:6px;padding:6px 10px;font-family:Nunito;"/></td>'
      + '<td><label class="toggle"><input type="checkbox"' + (visible ? ' checked' : '') + '/><span class="toggle-track"></span></label></td>'
      + '<td><div class="action-btns"><button class="act-btn del" data-action="delete-gallery-row"></button></div></td>'
      + '</tr>';
  }

  function addGalleryImageRow(item) {
    var host = document.getElementById('galleryImageRows');
    if (!host) return;
    host.insertAdjacentHTML('beforeend', galleryRowHtml(item || {}));
    bindDynamicActions();
  }

  async function getContentBlock(key) {
    var item = await apiJson('/content/' + key);
    return item && item.data ? item.data : {};
  }

  async function saveContentBlock(key, data) {
    return apiJson('/content/' + key, {
      method: 'PUT',
      body: JSON.stringify({ data: data })
    });
  }

  async function getSetting(key) {
    var item = await apiJson('/settings/' + key);
    return item && item.data ? item.data : {};
  }

  async function saveSetting(key, data) {
    return apiJson('/settings/' + key, {
      method: 'PUT',
      body: JSON.stringify({ data: data })
    });
  }

  function parseList(value, separator) {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || '')
      .split(separator)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function currentPanelId() {
    var active = qs('.panel.active');
    return active ? active.id.replace('panel-', '') : 'dashboard';
  }

  function updateDashboardCards() {
    var values = qsa('.stats-row .stat-card .val');
    if (values[0]) values[0].textContent = state.health && state.health.db && state.health.db.state === 'connected' ? 'Live' : 'Pending';
    if (values[1]) values[1].textContent = state.health && state.health.cloudinary && state.health.cloudinary.configured ? 'Ready' : 'Setup';
    if (values[2]) values[2].textContent = String(state.testimonials.length);
    if (values[3]) values[3].textContent = state.health && state.health.authConfigured ? 'Secure' : 'Token';
  }

  function wireTypewriterRows() {
    qsa('.del-row').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function () {
        var row = btn.closest('.tw-edit-row');
        if (row) row.remove();
      });
    });
  }

  function addTypewriterRowWithValues(item) {
    var container = document.getElementById('typewriterRows');
    if (!container) return;
    var row = document.createElement('div');
    row.className = 'tw-edit-row';
    row.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;align-items:end;margin-bottom:10px;';
    row.innerHTML = ''
      + '<div class="form-field"><label>Prefix Text</label><input type="text" value="' + (item && item.text ? item.text.replace(/"/g, '&quot;') : '') + '" /></div>'
      + '<div class="form-field"><label>Bold / Gold Part</label><input type="text" value="' + (item && item.em ? item.em.replace(/"/g, '&quot;') : '') + '" style="border-color:var(--gold);"/></div>'
      + '<div class="form-field"><label>Suffix Text</label><input type="text" value="' + (item && item.suffix ? item.suffix.replace(/"/g, '&quot;') : '') + '" /></div>'
      + '<button class="btn-sm outline del-row" style="align-self:flex-end;height:38px;"></button>';
    container.appendChild(row);
    wireTypewriterRows();
  }

  function collectHeroData() {
    var heroPanel = panel('hero');
    var blocks = qsa('.section-block', heroPanel);
    var contentInputs = qsa('input[type="text"]', blocks[2]);
    var statInputs = qsa('input[type="text"]', blocks[3]);
    var toggles = qsa('input[type="checkbox"]', blocks[4]);

    return {
      backgroundImage: state.heroImage,
      badgeText: contentInputs[0] ? contentInputs[0].value.trim() : '',
      subtitle: qs('#heroSubtext', heroPanel) ? qs('#heroSubtext', heroPanel).value.trim() : '',
      primaryButton: {
        text: contentInputs[1] ? contentInputs[1].value.trim() : '',
        link: contentInputs[2] ? contentInputs[2].value.trim() : ''
      },
      secondaryButton: {
        text: contentInputs[3] ? contentInputs[3].value.trim() : '',
        link: contentInputs[4] ? contentInputs[4].value.trim() : ''
      },
      typewriter: qsa('#typewriterRows .tw-edit-row').map(function (row) {
        var inputs = qsa('input', row);
        return {
          text: inputs[0] ? inputs[0].value.trim() : '',
          em: inputs[1] ? inputs[1].value.trim() : '',
          suffix: inputs[2] ? inputs[2].value.trim() : ''
        };
      }).filter(function (item) {
        return item.text || item.em || item.suffix;
      }),
      stats: [
        { value: statInputs[0] ? statInputs[0].value.trim() : '', label: statInputs[1] ? statInputs[1].value.trim() : '' },
        { value: statInputs[2] ? statInputs[2].value.trim() : '', label: statInputs[3] ? statInputs[3].value.trim() : '' },
        { value: statInputs[4] ? statInputs[4].value.trim() : '', label: statInputs[5] ? statInputs[5].value.trim() : '' },
        { value: statInputs[6] ? statInputs[6].value.trim() : '', label: statInputs[7] ? statInputs[7].value.trim() : '' }
      ],
      effects: {
        stars: !!(toggles[0] && toggles[0].checked),
        particles: !!(toggles[1] && toggles[1].checked),
        gridFloor: !!(toggles[2] && toggles[2].checked),
        rings: !!(toggles[3] && toggles[3].checked),
        scrollHint: !!(toggles[4] && toggles[4].checked)
      }
    };
  }

  function populateHero(data) {
    var heroPanel = panel('hero');
    var blocks = qsa('.section-block', heroPanel);
    var contentInputs = qsa('input[type="text"]', blocks[2]);
    var statInputs = qsa('input[type="text"]', blocks[3]);
    var toggles = qsa('input[type="checkbox"]', blocks[4]);

    state.heroImage = data.backgroundImage || state.heroImage || '';
    setUploadZoneMessage(
      qs('.upload-zone', blocks[0]),
      state.heroImage ? 'Hero background connected to Cloudinary' : 'Click to upload hero background photo',
      state.heroImage ? 'Stored in MongoDB and delivered from Cloudinary.<br><strong>' + state.heroImage + '</strong>' : 'Recommended: 1920x1080px'
    );

    if (contentInputs[0]) contentInputs[0].value = data.badgeText || contentInputs[0].value;
    if (qs('#heroSubtext', heroPanel)) qs('#heroSubtext', heroPanel).value = data.subtitle || qs('#heroSubtext', heroPanel).value;
    if (contentInputs[1]) contentInputs[1].value = data.primaryButton && data.primaryButton.text || contentInputs[1].value;
    if (contentInputs[2]) contentInputs[2].value = data.primaryButton && data.primaryButton.link || contentInputs[2].value;
    if (contentInputs[3]) contentInputs[3].value = data.secondaryButton && data.secondaryButton.text || contentInputs[3].value;
    if (contentInputs[4]) contentInputs[4].value = data.secondaryButton && data.secondaryButton.link || contentInputs[4].value;

    var typewriterHost = document.getElementById('typewriterRows');
    if (typewriterHost && Array.isArray(data.typewriter) && data.typewriter.length) {
      typewriterHost.innerHTML = '';
      data.typewriter.forEach(addTypewriterRowWithValues);
    }

    (data.stats || []).forEach(function (item, index) {
      var base = index * 2;
      if (statInputs[base]) statInputs[base].value = item.value || statInputs[base].value;
      if (statInputs[base + 1]) statInputs[base + 1].value = item.label || statInputs[base + 1].value;
    });

    if (data.effects) {
      if (toggles[0]) toggles[0].checked = data.effects.stars !== false;
      if (toggles[1]) toggles[1].checked = data.effects.particles !== false;
      if (toggles[2]) toggles[2].checked = data.effects.gridFloor !== false;
      if (toggles[3]) toggles[3].checked = data.effects.rings !== false;
      if (toggles[4]) toggles[4].checked = data.effects.scrollHint !== false;
    }
  }

  function collectAboutData() {
    var aboutPanel = panel('about');
    var blocks = qsa('.section-block', aboutPanel);
    var contentInputs = qsa('input, textarea', blocks[0]);
    var featureRows = qsa('#featPillList > div', blocks[1]);
    var miniInputs = qsa('input[type="text"]', blocks[3]);

    return {
      tag: contentInputs[0] ? contentInputs[0].value.trim() : '',
      establishedYear: contentInputs[1] ? contentInputs[1].value.trim() : '',
      heading: contentInputs[2] ? contentInputs[2].value.trim() : '',
      paragraphs: [
        contentInputs[3] ? contentInputs[3].value.trim() : '',
        contentInputs[4] ? contentInputs[4].value.trim() : ''
      ].filter(Boolean),
      badgeValue: contentInputs[5] ? contentInputs[5].value.trim() : '',
      badgeLabel: contentInputs[6] ? contentInputs[6].value.trim() : '',
      features: featureRows.map(function (row) {
        var inputs = qsa('input', row);
        return inputs[1] ? inputs[1].value.trim() : '';
      }).filter(Boolean),
      image: state.aboutImage,
      miniCards: [
        { icon: miniInputs[0] ? miniInputs[0].value.trim() : '', text: miniInputs[1] ? miniInputs[1].value.trim() : '' },
        { icon: miniInputs[2] ? miniInputs[2].value.trim() : '', text: miniInputs[3] ? miniInputs[3].value.trim() : '' }
      ]
    };
  }

  function populateAbout(data) {
    var aboutPanel = panel('about');
    var blocks = qsa('.section-block', aboutPanel);
    var contentInputs = qsa('input, textarea', blocks[0]);
    var miniInputs = qsa('input[type="text"]', blocks[3]);

    state.aboutImage = data.image || state.aboutImage || '';
    if (contentInputs[0]) contentInputs[0].value = data.tag || contentInputs[0].value;
    if (contentInputs[1]) contentInputs[1].value = data.establishedYear || contentInputs[1].value;
    if (contentInputs[2]) contentInputs[2].value = data.heading || contentInputs[2].value;
    if (contentInputs[3]) contentInputs[3].value = data.paragraphs && data.paragraphs[0] || contentInputs[3].value;
    if (contentInputs[4]) contentInputs[4].value = data.paragraphs && data.paragraphs[1] || contentInputs[4].value;
    if (contentInputs[5]) contentInputs[5].value = data.badgeValue || contentInputs[5].value;
    if (contentInputs[6]) contentInputs[6].value = data.badgeLabel || contentInputs[6].value;

    if (Array.isArray(data.features) && data.features.length) {
      var host = document.getElementById('featPillList');
      if (host) {
        host.innerHTML = data.features.map(function (feature) {
          return ''
            + '<div style="display:grid;grid-template-columns:2rem 1fr auto;gap:10px;align-items:center;margin-bottom:8px;">'
            + '<div class="form-field"><input type="text" value="" style="text-align:center;padding:6px 4px;"/></div>'
            + '<div class="form-field"><input type="text" value="' + feature.replace(/"/g, '&quot;') + '"/></div>'
            + '<button class="act-btn del"></button>'
            + '</div>';
        }).join('');
      }
    }

    setUploadZoneMessage(
      qs('.upload-zone', blocks[2]),
      state.aboutImage ? 'About image connected to Cloudinary' : 'About Section Photo',
      state.aboutImage ? 'Stored in MongoDB and delivered from Cloudinary.<br><strong>' + state.aboutImage + '</strong>' : 'Current: IMGS/school img.webp'
    );

    if (Array.isArray(data.miniCards)) {
      if (miniInputs[0]) miniInputs[0].value = data.miniCards[0] && data.miniCards[0].icon || miniInputs[0].value;
      if (miniInputs[1]) miniInputs[1].value = data.miniCards[0] && data.miniCards[0].text || miniInputs[1].value;
      if (miniInputs[2]) miniInputs[2].value = data.miniCards[1] && data.miniCards[1].icon || miniInputs[2].value;
      if (miniInputs[3]) miniInputs[3].value = data.miniCards[1] && data.miniCards[1].text || miniInputs[3].value;
    }
  }

  function collectWhyUsData() {
    return {
      tag: 'Why Choose Us',
      heading: 'What Makes Loretto Special',
      description: 'Six reasons why thousands of families trust Loretto Central School.',
      cards: qsa('#whyUsCards > div').map(function (card) {
        var inputs = qsa('input, textarea', card);
        return {
          title: inputs[0] ? inputs[0].value.trim() : '',
          text: inputs[1] ? inputs[1].value.trim() : '',
          icon: inputs[2] ? inputs[2].value.trim() : '',
          kicker: qs('[style*="font-size:0.8rem"]', card) ? qs('[style*="font-size:0.8rem"]', card).textContent.trim() : ''
        };
      }).filter(function (card) {
        return card.title || card.text || card.icon;
      })
    };
  }

  function populateWhyUs(data) {
    if (!Array.isArray(data.cards) || !data.cards.length) return;
    var host = document.getElementById('whyUsCards');
    if (!host) return;
    host.innerHTML = data.cards.map(function (card, index) {
      return ''
        + '<div style="background:var(--bg);border-radius:10px;padding:16px;border:1.5px solid var(--border);">'
        + '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;">'
        + '<div style="font-size:1.2rem;"></div>'
        + '<div style="font-size:0.8rem;font-weight:700;color:var(--navy);">' + (card.kicker || ('Card ' + (index + 1))) + '</div>'
        + '<button class="act-btn" style="margin-left:auto;" title="Edit"></button>'
        + '<button class="act-btn del" title="Delete" onclick="this.parentElement.parentElement.remove()"></button>'
        + '</div>'
        + '<div class="form-grid">'
        + '<div class="form-field"><label>Title</label><input type="text" value="' + (card.title || '').replace(/"/g, '&quot;') + '"/></div>'
        + '<div class="form-field"><label>Description</label><textarea style="min-height:60px;">' + (card.text || '') + '</textarea></div>'
        + '<div class="form-field"><label>Icon / Class</label><input type="text" value="' + (card.icon || '').replace(/"/g, '&quot;') + '"/></div>'
        + '</div>'
        + '</div>';
    }).join('');
  }

  window.addWhyUsCard = function () {
    var host = document.getElementById('whyUsCards');
    if (!host) return;
    var index = qsa('div[style*="border-radius:10px"]', host).length + 1;
    var html = ''
      + '<div style="background:var(--bg);border-radius:10px;padding:16px;border:1.5px solid var(--border);">'
      + '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;">'
      + '<div style="font-size:1.2rem;"></div>'
      + '<div style="font-size:0.8rem;font-weight:700;color:var(--navy);">Card ' + index + '</div>'
      + '<button class="act-btn" style="margin-left:auto;" title="Edit"></button>'
      + '<button class="act-btn del" title="Delete" onclick="this.parentElement.parentElement.remove()"></button>'
      + '</div>'
      + '<div class="form-grid">'
      + '<div class="form-field"><label>Title</label><input type="text" value="New Feature"/></div>'
      + '<div class="form-field"><label>Description</label><textarea style="min-height:60px;"></textarea></div>'
      + '<div class="form-field"><label>Icon / Class</label><input type="text" value=""/></div>'
      + '</div>'
      + '</div>';
    host.insertAdjacentHTML('beforeend', html);
  };

  function collectGalleryData() {
    var rows = qsa('#panel-gallery tbody tr');
    return {
      tag: 'School Gallery',
      heading: 'Life at Loretto Central School',
      description: 'A glimpse into our vibrant campus life, events, achievements, and everyday moments.',
      images: rows.map(function (row) {
        var inputs = qsa('input', row);
        return {
          image: inputs[0] ? inputs[0].value.trim() : '',
          label: inputs[1] ? inputs[1].value.trim() : '',
          visible: !!(inputs[2] && inputs[2].checked)
        };
      }).filter(function (item) {
        return item.image;
      }),
      counters: qsa('#galCounter .gal-counter-item').map(function (item) {
        return {
          value: qs('.gal-counter-num', item) ? qs('.gal-counter-num', item).textContent.trim() : '',
          label: item.textContent.replace((qs('.gal-counter-num', item) ? qs('.gal-counter-num', item).textContent : ''), '').trim()
        };
      })
    };
  }

  function populateGallery(data) {
    var host = document.getElementById('galleryImageRows');
    if (!host) return;
    if (!Array.isArray(data.images) || !data.images.length) return;
    host.innerHTML = data.images.map(function (item) {
      return galleryRowHtml(item);
    }).join('');
    bindDynamicActions();
  }

  function collectCtaData() {
    var inputs = qsa('#panel-cta input, #panel-cta textarea');
    return {
      heading: inputs[0] ? inputs[0].value.trim() : '',
      text: inputs[1] ? inputs[1].value.trim() : '',
      primaryButton: {
        text: inputs[2] ? inputs[2].value.trim() : '',
        link: inputs[3] ? inputs[3].value.trim() : ''
      },
      secondaryButton: {
        text: inputs[4] ? inputs[4].value.trim() : '',
        link: inputs[5] ? inputs[5].value.trim() : ''
      }
    };
  }

  function populateCta(data) {
    var inputs = qsa('#panel-cta input, #panel-cta textarea');
    if (inputs[0]) inputs[0].value = data.heading || inputs[0].value;
    if (inputs[1]) inputs[1].value = data.text || inputs[1].value;
    if (inputs[2]) inputs[2].value = data.primaryButton && data.primaryButton.text || inputs[2].value;
    if (inputs[3]) inputs[3].value = data.primaryButton && data.primaryButton.link || inputs[3].value;
    if (inputs[4]) inputs[4].value = data.secondaryButton && data.secondaryButton.text || inputs[4].value;
    if (inputs[5]) inputs[5].value = data.secondaryButton && data.secondaryButton.link || inputs[5].value;
  }

  function collectContactData() {
    var blocks = qsa('#panel-contact .section-block');
    var infoInputs = qsa('input, textarea', blocks[0]);
    var settingsInputs = qsa('input', blocks[1]);
    return {
      address: infoInputs[0] ? infoInputs[0].value.trim() : '',
      phones: parseList(infoInputs[1] ? infoInputs[1].value : '', '|'),
      emails: parseList(infoInputs[2] ? infoInputs[2].value : '', ','),
      officeHours: infoInputs[3] ? infoInputs[3].value.trim() : '',
      holidayHours: infoInputs[4] ? infoInputs[4].value.trim() : '',
      mapEmbedUrl: infoInputs[5] ? infoInputs[5].value.trim() : '',
      formEnabled: !!(qs('input[type="checkbox"]', blocks[1]) && qs('input[type="checkbox"]', blocks[1]).checked),
      emailNotifications: !!(qsa('input[type="checkbox"]', blocks[1])[1] && qsa('input[type="checkbox"]', blocks[1])[1].checked),
      recipientEmail: settingsInputs[2] ? settingsInputs[2].value.trim() : ''
    };
  }

  function populateContact(data) {
    var blocks = qsa('#panel-contact .section-block');
    var infoInputs = qsa('input, textarea', blocks[0]);
    var settingsChecks = qsa('input[type="checkbox"]', blocks[1]);
    var recipient = qsa('input', blocks[1])[2];

    if (infoInputs[0]) infoInputs[0].value = data.address || infoInputs[0].value;
    if (infoInputs[1]) infoInputs[1].value = (data.phones || []).join(' | ') || infoInputs[1].value;
    if (infoInputs[2]) infoInputs[2].value = (data.emails || []).join(', ') || infoInputs[2].value;
    if (infoInputs[3]) infoInputs[3].value = data.officeHours || infoInputs[3].value;
    if (infoInputs[4]) infoInputs[4].value = data.holidayHours || infoInputs[4].value;
    if (infoInputs[5]) infoInputs[5].value = data.mapEmbedUrl || infoInputs[5].value;
    if (settingsChecks[0]) settingsChecks[0].checked = data.formEnabled !== false;
    if (settingsChecks[1]) settingsChecks[1].checked = data.emailNotifications !== false;
    if (recipient) recipient.value = data.recipientEmail || data.email || recipient.value;
  }

  function collectFooterData() {
    var blocks = qsa('#panel-footer .section-block');
    var contentInputs = qsa('input, textarea', blocks[0]);
    var socialInputs = qsa('input', blocks[1]);
    var linkRows = qsa('#footerLinks > div');
    return {
      description: contentInputs[0] ? contentInputs[0].value.trim() : '',
      copyright: contentInputs[1] ? contentInputs[1].value.trim() : '',
      socialLinks: {
        facebook: socialInputs[0] ? socialInputs[0].value.trim() : '',
        instagram: socialInputs[1] ? socialInputs[1].value.trim() : '',
        youtube: socialInputs[2] ? socialInputs[2].value.trim() : '',
        twitter: socialInputs[3] ? socialInputs[3].value.trim() : ''
      },
      quickLinks: linkRows.map(function (row) {
        var inputs = qsa('input', row);
        return {
          text: inputs[0] ? inputs[0].value.trim() : '',
          url: inputs[1] ? inputs[1].value.trim() : ''
        };
      }).filter(function (item) {
        return item.text && item.url;
      })
    };
  }

  function populateFooter(data) {
    var blocks = qsa('#panel-footer .section-block');
    var contentInputs = qsa('input, textarea', blocks[0]);
    var socialInputs = qsa('input', blocks[1]);

    if (contentInputs[0]) contentInputs[0].value = data.description || contentInputs[0].value;
    if (contentInputs[1]) contentInputs[1].value = data.copyright || contentInputs[1].value;
    if (socialInputs[0]) socialInputs[0].value = data.socialLinks && data.socialLinks.facebook || socialInputs[0].value;
    if (socialInputs[1]) socialInputs[1].value = data.socialLinks && data.socialLinks.instagram || socialInputs[1].value;
    if (socialInputs[2]) socialInputs[2].value = data.socialLinks && data.socialLinks.youtube || socialInputs[2].value;
    if (socialInputs[3]) socialInputs[3].value = data.socialLinks && data.socialLinks.twitter || socialInputs[3].value;
  }

  function collectSeoData() {
    var inputs = qsa('#panel-seo input, #panel-seo textarea');
    return {
      pageTitle: inputs[0] ? inputs[0].value.trim() : '',
      metaDescription: inputs[1] ? inputs[1].value.trim() : '',
      metaKeywords: inputs[2] ? inputs[2].value.trim() : '',
      canonicalUrl: inputs[3] ? inputs[3].value.trim() : '',
      ogImage: inputs[4] ? inputs[4].value.trim() : '',
      favicon: inputs[5] ? inputs[5].value.trim() : ''
    };
  }

  function populateSeo(data) {
    var inputs = qsa('#panel-seo input, #panel-seo textarea');
    if (inputs[0]) inputs[0].value = data.pageTitle || inputs[0].value;
    if (inputs[1]) inputs[1].value = data.metaDescription || inputs[1].value;
    if (inputs[2]) inputs[2].value = data.metaKeywords || inputs[2].value;
    if (inputs[3]) inputs[3].value = data.canonicalUrl || inputs[3].value;
    if (inputs[4]) inputs[4].value = data.ogImage || inputs[4].value;
    if (inputs[5]) inputs[5].value = data.favicon || inputs[5].value;
  }

  function collectSettingsData() {
    var blocks = qsa('#panel-settings .section-block');
    var generalInputs = qsa('input[type="text"]', blocks[0]);
    var noticeChecks = qsa('input[type="checkbox"]', blocks[1]);
    var noticeInput = qs('input[type="text"]', blocks[1]);
    var colorInputs = qsa('input[type="color"]', blocks[2]);

    return {
      schoolName: generalInputs[0] ? generalInputs[0].value.trim() : '',
      tagline: generalInputs[1] ? generalInputs[1].value.trim() : '',
      affiliation: generalInputs[2] ? generalInputs[2].value.trim() : '',
      logo: state.logo,
      showNoticeBar: !!(noticeChecks[0] && noticeChecks[0].checked),
      noticeText: noticeInput ? noticeInput.value.trim() : '',
      colors: {
        primary: colorInputs[0] ? colorInputs[0].value : '',
        secondary: colorInputs[1] ? colorInputs[1].value : '',
        accent: colorInputs[2] ? colorInputs[2].value : ''
      }
    };
  }

  function populateSettings(data) {
    var blocks = qsa('#panel-settings .section-block');
    var generalInputs = qsa('input[type="text"]', blocks[0]);
    var noticeChecks = qsa('input[type="checkbox"]', blocks[1]);
    var noticeInput = qs('input[type="text"]', blocks[1]);
    var colorInputs = qsa('input[type="color"]', blocks[2]);

    state.logo = data.logo || state.logo || '';
    if (generalInputs[0]) generalInputs[0].value = data.schoolName || generalInputs[0].value;
    if (generalInputs[1]) generalInputs[1].value = data.tagline || generalInputs[1].value;
    if (generalInputs[2]) generalInputs[2].value = data.affiliation || generalInputs[2].value;
    if (noticeChecks[0]) noticeChecks[0].checked = data.showNoticeBar !== false;
    if (noticeInput) noticeInput.value = data.noticeText || noticeInput.value;
    if (colorInputs[0]) colorInputs[0].value = data.colors && data.colors.primary || colorInputs[0].value;
    if (colorInputs[1]) colorInputs[1].value = data.colors && data.colors.secondary || colorInputs[1].value;
    if (colorInputs[2]) colorInputs[2].value = data.colors && data.colors.accent || colorInputs[2].value;

    setUploadZoneMessage(
      qs('.upload-zone', blocks[0]),
      state.logo ? 'Logo connected to Cloudinary' : 'Upload Logo',
      state.logo ? 'Stored in MongoDB and delivered from Cloudinary.<br><strong>' + state.logo + '</strong>' : 'PNG with transparent bg'
    );
  }

  function renderTestimonialsTable() {
    var tbody = qs('#panel-testimonials tbody');
    if (!tbody) return;

    if (!state.testimonials.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="padding:18px;color:var(--text-muted);">No testimonials in MongoDB yet.</td></tr>';
      return;
    }

    tbody.innerHTML = state.testimonials.map(function (item, index) {
      var stars = new Array(Math.max(1, Math.min(5, Number(item.rating) || 5)) + 1).join('★');
      return ''
        + '<tr data-id="' + item._id + '">'
        + '<td>'
        + '<div style="display:flex;align-items:center;gap:10px;">'
        + '<div data-role="testimonial-photo-preview" style="width:42px;height:42px;border-radius:50%;overflow:hidden;background:var(--bg2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--text-muted);flex-shrink:0;">'
        + (item.image ? '<img src="' + escapeAttr(item.image) + '" alt="' + escapeAttr(item.name || 'Testimonial') + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.textContent=\'IMG\'" />' : 'IMG')
        + '</div>'
        + '<input type="url" data-role="testimonial-photo-url" value="' + escapeAttr(item.image || '') + '" placeholder="Cloudinary photo URL" style="border:none;background:transparent;font-family:Nunito;font-size:0.74rem;width:100%;color:var(--text-muted);"/>'
        + '</div>'
        + '</td>'
        + '<td><input type="text" value="' + (item.name || '').replace(/"/g, '&quot;') + '" style="border:none;background:transparent;font-family:Nunito;font-size:0.82rem;width:100%;font-weight:700;"/></td>'
        + '<td><input type="text" value="' + (item.role || '').replace(/"/g, '&quot;') + '" style="border:none;background:transparent;font-family:Nunito;font-size:0.82rem;width:100%;"/></td>'
        + '<td><input type="text" value="' + (item.text || '').replace(/"/g, '&quot;') + '" style="border:none;background:transparent;font-family:Nunito;font-size:0.78rem;width:100%;color:var(--text-muted);"/></td>'
        + '<td><input type="number" min="1" max="5" value="' + (item.rating || 5) + '" title="' + stars + '" style="border:none;background:transparent;font-family:Nunito;font-size:0.82rem;width:60px;"/></td>'
        + '<td><label class="toggle"><input type="checkbox"' + (item.visible !== false ? ' checked' : '') + '/><span class="toggle-track"></span></label></td>'
        + '<td><div class="action-btns"><button class="act-btn" data-action="save-testimonial"></button><button class="act-btn del" data-action="delete-testimonial"></button></div></td>'
        + '</tr>';
    }).join('');
  }

  function bindTestimonialPreviewInputs() {
    qsa('input[data-role="testimonial-photo-url"]').forEach(function (input) {
      if (input.dataset.bound === 'true') return;
      input.dataset.bound = 'true';
      var row = input.closest('tr');
      var previewBox = row ? qs('[data-role="testimonial-photo-preview"]', row) : null;
      input.addEventListener('input', function () {
        var nameInput = row ? qsa('input', row)[1] : null;
        setImagePreview(previewBox, input.value, nameInput ? nameInput.value : 'Testimonial', 'IMG');
      });
      input.addEventListener('change', function () {
        var nameInput = row ? qsa('input', row)[1] : null;
        setImagePreview(previewBox, input.value, nameInput ? nameInput.value : 'Testimonial', 'IMG');
      });
    });
  }

  function bindDynamicActions() {
    bindTestimonialPreviewInputs();

    qsa('[data-action="upload-gallery"]').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function () {
        var row = btn.closest('tr');
        if (!row) return;
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', async function () {
          if (!input.files || !input.files[0]) return;
          try {
            toast('Uploading gallery image to Cloudinary...');
            var result = await uploadFile(input.files[0]);
            var urlInput = qsa('input', row)[0];
            if (urlInput) urlInput.value = result.url;
            var preview = row.querySelector('img');
            if (preview) {
              preview.src = result.url;
            } else {
              var previewBox = row.querySelector('td div div');
              if (previewBox) {
                previewBox.innerHTML = '<img src="' + escapeAttr(result.url) + '" alt="Gallery image" style="width:100%;height:100%;object-fit:cover;" />';
              }
            }
            toast('Gallery image uploaded.');
          } catch (error) {
            toast(error.message, true);
          }
        });
        input.click();
      });
    });

    qsa('[data-action="delete-gallery-row"]').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function () {
        var row = btn.closest('tr');
        if (row) row.remove();
      });
    });

    qsa('[data-action="save-testimonial"]').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', async function () {
        var row = btn.closest('tr');
        if (!row) return;
        var inputs = qsa('input', row);
        try {
          await apiJson('/testimonials/' + row.dataset.id, {
            method: 'PUT',
            body: JSON.stringify({
              image: inputs[0] ? inputs[0].value.trim() : '',
              name: inputs[1] ? inputs[1].value.trim() : '',
              role: inputs[2] ? inputs[2].value.trim() : '',
              text: inputs[3] ? inputs[3].value.trim() : '',
              rating: Number(inputs[4] ? inputs[4].value : 5) || 5,
              visible: !!(inputs[5] && inputs[5].checked),
              order: qsa('#panel-testimonials tbody tr[data-id]').indexOf(row)
            })
          });
          state.testimonials = await apiJson('/testimonials');
          renderTestimonialsTable();
          bindDynamicActions();
          updateDashboardCards();
          toast('Testimonial visibility saved.');
        } catch (error) {
          toast(error.message, true);
        }
      });
    });

    qsa('[data-action="delete-testimonial"]').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', async function () {
        var row = btn.closest('tr');
        if (!row) return;
        try {
          await apiJson('/testimonials/' + row.dataset.id, { method: 'DELETE' });
          state.testimonials = state.testimonials.filter(function (item) { return item._id !== row.dataset.id; });
          renderTestimonialsTable();
          bindDynamicActions();
          updateDashboardCards();
          toast('Testimonial deleted from MongoDB.');
        } catch (error) {
          toast(error.message, true);
        }
      });
    });
  }

  async function saveTestimonials() {
    var rows = qsa('#panel-testimonials tbody tr[data-id]');
    for (var index = 0; index < rows.length; index += 1) {
      var row = rows[index];
      var inputs = qsa('input', row);
      await apiJson('/testimonials/' + row.dataset.id, {
        method: 'PUT',
        body: JSON.stringify({
          image: inputs[0] ? inputs[0].value.trim() : '',
          name: inputs[1] ? inputs[1].value.trim() : '',
          role: inputs[2] ? inputs[2].value.trim() : '',
          text: inputs[3] ? inputs[3].value.trim() : '',
          rating: Number(inputs[4] ? inputs[4].value : 5) || 5,
          visible: !!(inputs[5] && inputs[5].checked),
          order: index
        })
      });
    }
    state.testimonials = await apiJson('/testimonials');
    renderTestimonialsTable();
    bindDynamicActions();
    updateDashboardCards();
  }

  async function saveSectionByPanel(id) {
    if (id === 'hero') {
      await saveContentBlock('homepage.hero', collectHeroData());
      return 'Hero section synced with index.html.';
    }
    if (id === 'about') {
      await saveContentBlock('homepage.about', collectAboutData());
      return 'About section synced with index.html.';
    }
    if (id === 'whyus') {
      await saveContentBlock('homepage.whyus', collectWhyUsData());
      return 'Why Choose Us cards synced with index.html.';
    }
    if (id === 'stats') {
      var heroData = collectHeroData();
      await saveContentBlock('homepage.hero', heroData);
      return 'Hero stats saved to MongoDB.';
    }
    if (id === 'testimonials') {
      await saveTestimonials();
      return 'Testimonials synced with MongoDB.';
    }
    if (id === 'gallery') {
      await saveContentBlock('homepage.gallery', collectGalleryData());
      return 'Gallery settings saved.';
    }
    if (id === 'cta') {
      await saveContentBlock('homepage.cta', collectCtaData());
      return 'Admissions CTA synced with index.html.';
    }
    if (id === 'contact') {
      await apiJson('/contact', {
        method: 'PUT',
        body: JSON.stringify(collectContactData())
      });
      return 'Contact block synced with index.html.';
    }
    if (id === 'footer') {
      await saveContentBlock('homepage.footer', collectFooterData());
      return 'Footer content saved.';
    }
    if (id === 'seo') {
      await saveSetting('site-seo', collectSeoData());
      return 'SEO settings saved.';
    }
    if (id === 'settings') {
      await saveSetting('site', collectSettingsData());
      return 'Site settings saved.';
    }
    return 'Nothing to save on this panel.';
  }

  async function saveEverything() {
    var ids = ['hero', 'about', 'whyus', 'gallery', 'cta', 'contact', 'footer', 'seo', 'settings'];
    for (var i = 0; i < ids.length; i += 1) {
      await saveSectionByPanel(ids[i]);
    }
    await saveTestimonials();
    toast('Homepage admin synced with MongoDB and Cloudinary.');
  }

  async function handleFileUpload(file, kind) {
    var result = await uploadFile(file);
    if (kind === 'hero') {
      state.heroImage = result.url;
      populateHero({ backgroundImage: result.url });
      return;
    }
    if (kind === 'about') {
      state.aboutImage = result.url;
      populateAbout({ image: result.url });
      return;
    }
    if (kind === 'logo') {
      state.logo = result.url;
      populateSettings({ logo: result.url });
    }
  }

  function attachUploads() {
    var heroInput = document.getElementById('heroImg');
    if (heroInput) {
      heroInput.addEventListener('change', async function () {
        if (!heroInput.files || !heroInput.files[0]) return;
        try {
          toast('Uploading hero image to Cloudinary...');
          await handleFileUpload(heroInput.files[0], 'hero');
          toast('Hero image uploaded to Cloudinary.');
        } catch (error) {
          toast(error.message, true);
        }
      });
    }

    var aboutZone = qsa('#panel-about .upload-zone')[0];
    if (aboutZone) {
      aboutZone.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', async function () {
          if (!input.files || !input.files[0]) return;
          try {
            toast('Uploading about image to Cloudinary...');
            await handleFileUpload(input.files[0], 'about');
            toast('About image uploaded to Cloudinary.');
          } catch (error) {
            toast(error.message, true);
          }
        });
        input.click();
      });
    }

    var logoZone = qsa('#panel-settings .upload-zone')[0];
    if (logoZone) {
      logoZone.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', async function () {
          if (!input.files || !input.files[0]) return;
          try {
            toast('Uploading logo to Cloudinary...');
            await handleFileUpload(input.files[0], 'logo');
            toast('Logo uploaded to Cloudinary.');
          } catch (error) {
            toast(error.message, true);
          }
        });
        input.click();
      });
    }

    var testimonialPhotoInput = document.getElementById('testiPhotoFile');
    if (testimonialPhotoInput) {
      testimonialPhotoInput.addEventListener('change', async function () {
        if (!testimonialPhotoInput.files || !testimonialPhotoInput.files[0]) return;
        var saveButton = document.getElementById('testiModalSaveBtn');
        state.testimonialUploadInProgress = true;
        setButtonBusy(saveButton, true, ' Uploading Photo...', ' Add Testimonial');
        try {
          toast('Uploading testimonial photo to Cloudinary...');
          state.testimonialUploadPromise = uploadFile(testimonialPhotoInput.files[0]);
          var result = await state.testimonialUploadPromise;
          state.testimonialModalImage = result.url;
          var urlInput = document.getElementById('testiPhotoUrl');
          if (urlInput) urlInput.value = result.url;
          setImagePreview(document.getElementById('testiPhotoZone'), result.url, 'Testimonial photo', 'IMG');
          toast('Testimonial photo uploaded.');
        } catch (error) {
          toast(error.message, true);
        } finally {
          state.testimonialUploadPromise = null;
          state.testimonialUploadInProgress = false;
          setButtonBusy(saveButton, false, ' Uploading Photo...', ' Add Testimonial');
        }
      });
    }

    var testimonialPhotoUrl = document.getElementById('testiPhotoUrl');
    if (testimonialPhotoUrl && testimonialPhotoUrl.dataset.bound !== 'true') {
      testimonialPhotoUrl.dataset.bound = 'true';
      var syncModalPreview = function () {
        var value = testimonialPhotoUrl.value.trim();
        if (value) {
          state.testimonialModalImage = value;
          setImagePreview(document.getElementById('testiPhotoZone'), value, 'Testimonial photo', 'IMG');
        } else {
          setUploadZoneMessage(
            document.getElementById('testiPhotoZone'),
            'Upload testimonial photo',
            'JPG, PNG or WEBP via Cloudinary'
          );
        }
      };
      testimonialPhotoUrl.addEventListener('input', syncModalPreview);
      testimonialPhotoUrl.addEventListener('change', syncModalPreview);
    }
  }

  async function loadAllData() {
    state.health = await apiJson('/health');
    state.testimonials = await apiJson('/testimonials');

    populateHero(await getContentBlock('homepage.hero'));
    populateAbout(await getContentBlock('homepage.about'));
    populateWhyUs(await getContentBlock('homepage.whyus'));
    populateGallery(await getContentBlock('homepage.gallery'));
    populateCta(await getContentBlock('homepage.cta'));
    populateFooter(await getContentBlock('homepage.footer'));
    populateSeo(await getSetting('site-seo'));
    populateSettings(await getSetting('site'));
    populateContact(await apiJson('/contact'));

    renderTestimonialsTable();
    bindDynamicActions();
    updateDashboardCards();
  }

  window.saveSection = async function (sectionName) {
    try {
      var panelMap = {
        Hero: 'hero',
        About: 'about',
        'Why Us': 'whyus',
        Stats: 'stats',
        Testimonials: 'testimonials',
        Gallery: 'gallery',
        CTA: 'cta',
        Contact: 'contact',
        Footer: 'footer',
        SEO: 'seo',
        Settings: 'settings'
      };
      var id = panelMap[sectionName] || currentPanelId();
      var message = await saveSectionByPanel(id);
      toast(message);
    } catch (error) {
      toast(error.message, true);
    }
  };

  window.saveAll = async function () {
    try {
      await saveEverything();
    } catch (error) {
      toast(error.message, true);
    }
  };

  window.addTypewriterRow = function () {
    addTypewriterRowWithValues({ text: '', em: '', suffix: '' });
  };

  window.addGalleryImageRow = function () {
    addGalleryImageRow({});
  };

  window.triggerUpload = function (id) {
    var input = document.getElementById(id);
    if (input) input.click();
  };

  window.openTestiModal = function () {
    var modal = document.getElementById('testiModal');
    state.testimonialModalImage = '';
    state.testimonialUploadPromise = null;
    state.testimonialUploadInProgress = false;
    if (modal) {
      var nameField = document.getElementById('testiName');
      var roleField = document.getElementById('testiRole');
      var photoFileField = document.getElementById('testiPhotoFile');
      var photoUrlField = document.getElementById('testiPhotoUrl');
      var textField = document.getElementById('testiText');
      var ratingField = document.getElementById('testiRating');

      if (nameField) nameField.value = '';
      if (roleField) roleField.value = '';
      if (photoFileField) photoFileField.value = '';
      if (photoUrlField) photoUrlField.value = '';
      if (textField) textField.value = '';
      if (ratingField) ratingField.selectedIndex = 0;
      setButtonBusy(document.getElementById('testiModalSaveBtn'), false, ' Uploading Photo...', ' Add Testimonial');
      setUploadZoneMessage(
        document.getElementById('testiPhotoZone'),
        'Upload testimonial photo',
        'JPG, PNG or WEBP via Cloudinary'
      );
      modal.classList.add('open');
    }
  };

  window.closeTestiModal = function () {
    var modal = document.getElementById('testiModal');
    if (modal) modal.classList.remove('open');
  };

  async function createTestimonialFromModal() {
    // Wait for any in-progress upload to complete
    if (state.testimonialUploadInProgress || state.testimonialUploadPromise) {
      toast('Waiting for image upload to finish...');
      // Poll until upload completes (max 30 seconds)
      var waitStart = Date.now();
      while ((state.testimonialUploadInProgress || state.testimonialUploadPromise) && (Date.now() - waitStart < 30000)) {
        try {
          if (state.testimonialUploadPromise) {
            await state.testimonialUploadPromise;
          } else {
            await new Promise(function(r) { setTimeout(r, 200); });
          }
        } catch (error) {
          toast('Photo upload failed. Please try uploading again.', true);
          return;
        }
      }
    }

    var nameField = document.getElementById('testiName');
    var roleField = document.getElementById('testiRole');
    var photoUrlField = document.getElementById('testiPhotoUrl');
    var textField = document.getElementById('testiText');
    var ratingField = document.getElementById('testiRating');
    var explicitPhotoUrl = photoUrlField ? photoUrlField.value.trim() : '';
    var resolvedImage = explicitPhotoUrl || state.testimonialModalImage || '';

    console.log('[Testimonial] Creating with image:', resolvedImage, '| photoUrlField:', explicitPhotoUrl, '| stateImage:', state.testimonialModalImage);

    var payload = {
      name: nameField ? nameField.value.trim() : '',
      role: roleField ? roleField.value.trim() : '',
      image: resolvedImage,
      text: textField ? textField.value.trim() : '',
      rating: Math.max(1, Math.min(5, Number((ratingField ? ratingField.value : '5').replace(/\D/g, '')) || 5)),
      visible: true,
      order: state.testimonials.length
    };

    if (!payload.name || !payload.text) {
      toast('Name and testimonial text are required.', true);
      return;
    }

    console.log('[Testimonial] Sending payload:', JSON.stringify(payload));

    await apiJson('/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.testimonials = await apiJson('/testimonials');
    renderTestimonialsTable();
    bindDynamicActions();
    updateDashboardCards();
    window.closeTestiModal();
    toast(resolvedImage ? 'Testimonial added with photo.' : 'Testimonial added (no photo).');
  }

  window.createTestimonialFromModal = function () {
    return createTestimonialFromModal().catch(function (error) {
      toast(error.message, true);
      throw error;
    });
  };

  function bindModalSaveButton() {
    var button = document.getElementById('testiModalSaveBtn');
    if (button && button.dataset.bound !== 'true') {
      button.dataset.bound = 'true';
      button.addEventListener('click', function () {
        window.createTestimonialFromModal();
      });
    }
  }

  function initCounters() {
    var heroSub = document.getElementById('heroSubtext');
    var heroCount = document.getElementById('heroSubCount');
    if (!heroSub || !heroCount) return;
    function sync() {
      heroCount.textContent = heroSub.value.length + ' / 200 chars';
      heroCount.style.color = heroSub.value.length > 180 ? '#e74c3c' : 'var(--text-muted)';
    }
    heroSub.addEventListener('input', sync);
    sync();
  }

  async function boot() {
    wireTypewriterRows();
    attachUploads();
    bindModalSaveButton();
    initCounters();

    document.addEventListener('lcs-admin-save', function () {
      window.saveAll();
    });

    try {
      await loadAllData();
    } catch (error) {
      toast(error.message, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
