(function () {
  'use strict';

  var REGISTRY = {
    'western-dance': {
      file: '1-western-dance.html',
      type: 'activity',
      hero: { icon: '💃', badge: 'Performing Arts · Dance', title: 'Western Dance', description: 'Loretto Central School celebrates the joy of movement through its vibrant Western Dance programme. Students learn a variety of contemporary dance styles in a fun, disciplined environment that builds confidence, rhythm, and self-expression.' },
      infoTiles: [
        { label: 'Schedule', value: 'Every Friday, 3:30–4:30 PM' },
        { label: 'Open To', value: 'Classes V to X' },
        { label: 'Venue', value: 'School Auditorium' }
      ],
      content: {
        section1: { heading: 'What Students Learn', items: ['Contemporary and freestyle dance techniques', 'Hip-hop, jazz, and salsa fundamentals', 'Choreography and stage performance skills', 'Teamwork and synchronised group routines', 'Expression, body language, and stage presence'] },
        section2: { heading: 'Highlights & Achievements', items: ['Annual Day showcase performances', 'Inter-school dance competitions', 'School cultural fest performances'] },
        noticeBox: { text: 'To enrol in Western Dance, contact the class teacher or visit the school office.', visible: true }
      }
    },
    'thinkers-space': {
      file: '2-thinkers-space.html',
      type: 'activity',
      hero: { icon: '🧠', badge: 'Critical Thinking · Debate', title: 'Thinkers Space .In', description: 'Thinkers Space .In is a unique intellectual forum at Loretto Central School that encourages students to think critically, question deeply, and articulate their ideas with confidence. Through debates, discussions, and thought experiments, students develop essential 21st-century skills.' },
      infoTiles: [
        { label: 'Schedule', value: 'Every Wednesday, 3:30–4:30 PM' },
        { label: 'Open To', value: 'Classes VII to X' },
        { label: 'Venue', value: 'Library / Seminar Room' }
      ],
      content: {
        section1: { heading: 'What We Do', items: ['Structured debates and group discussions', 'Critical thinking puzzles and brain teasers', 'Current affairs analysis and group presentations', 'Public speaking and argumentation training', 'Model United Nations (MUN) preparation sessions'] },
        section2: { heading: 'Benefits for Students', items: ['Develops logical reasoning and analytical thinking', 'Builds confidence in public speaking', 'Improves research, reading, and writing skills'] }
      }
    },
    'classical-dance': {
      file: '3-classical-dance.html',
      type: 'activity',
      hero: { icon: '✨', badge: 'Performing Arts · Classical', title: 'Classical Dance', description: 'The Classical Dance programme at Loretto Central School offers students a gateway into the rich heritage of Indian classical dance traditions. Under the guidance of a trained instructor, students learn the discipline, grace, and storytelling art of classical forms.' },
      infoTiles: [
        { label: 'Schedule', value: 'Every Tuesday, 3:30–4:30 PM' },
        { label: 'Open To', value: 'Classes III to IX' },
        { label: 'Venue', value: 'Dance Room / Auditorium' }
      ],
      content: {
        section1: { heading: 'Dance Forms Taught', items: ['Bharatanatyam — fundamentals of adavus and mudras', 'Classical folk dance forms of Karnataka', 'Expressive storytelling through movement (abhinaya)', 'Group choreography for school cultural events', 'Stage performance training and costume knowledge'] },
        section2: { heading: 'Why Classical Dance?', items: ["Develops physical fitness, flexibility, and coordination", "Instils patience, discipline, and focus", "Connects students to India's cultural heritage"] }
      }
    },
    'karate-class': {
      file: '4-karate-class.html',
      type: 'activity',
      hero: { icon: '🥋', badge: 'Martial Arts · Self-Defence', title: 'Karate Class', description: 'The Karate programme at Loretto Central School is conducted by a certified instructor and teaches students the discipline, focus, and self-defence skills of this respected martial art. Students have excelled at national-level competitions.' },
      infoTiles: [
        { label: 'Schedule', value: 'Mon & Thu, 3:30–4:30 PM' },
        { label: 'Open To', value: 'Classes I to X' },
        { label: 'Venue', value: 'School Ground / Hall' }
      ],
      content: {
        section1: { heading: 'What Students Learn', items: ['Basic kata (forms) and kumite (sparring techniques)', 'Stances, blocks, punches, and kicks with precision', 'Belt grading system from white to advanced belts', 'Discipline, respect, and the code of martial arts', 'Self-defence skills and situational awareness'] },
        section2: { heading: 'Achievements & Recognition', items: ['Students have won medals at state-level karate championships', 'National-level open karate competition participants', 'Regular participation in belt grading examinations'] }
      }
    },
    'chess-class': {
      file: '5-chess-class.html',
      type: 'activity',
      hero: { icon: '♟️', badge: 'Strategy · Mind Sports', title: 'Chess Class', description: "Chess at Loretto Central School is more than a game — it is a mental workout that sharpens strategic thinking, patience, and problem-solving. Open to beginners and experienced players alike." },
      infoTiles: [
        { label: 'Schedule', value: 'Every Friday, 3:30–4:30 PM' },
        { label: 'Open To', value: 'Classes III to X' },
        { label: 'Venue', value: 'Library / Activity Room' }
      ],
      content: {
        section1: { heading: 'What Students Learn', items: ['Rules, board setup, and piece movements for beginners', 'Opening theory and key strategies for intermediate players', 'Tactics: pins, forks, skewers, and discovered attacks', 'Endgame technique and time management', 'Tournament etiquette and competitive play'] },
        section2: { heading: 'Benefits of Chess', items: ['Develops critical thinking and forward planning', 'Improves concentration and patience', 'Builds resilience — learning from losses'] }
      }
    },
    'english-club': {
      file: '6-english-club.html',
      type: 'club',
      hero: { icon: '📚', badge: 'Language · Literature', title: 'English Club', description: 'The English Club at Loretto Central School is a vibrant space for students who love language, literature, and creative expression. Through a range of activities, students develop fluency, confidence, and a deep appreciation for the English language.' },
      infoTiles: [
        { label: 'Meets', value: 'Every Monday, Lunch Break' },
        { label: 'Open To', value: 'Classes V to X' },
        { label: 'Venue', value: 'Library' }
      ],
      content: {
        section1: { heading: 'Club Activities', items: ['Creative writing workshops — stories, poems, essays', 'Vocabulary enrichment and word games', 'Public speaking and oral storytelling sessions', 'Literary discussions on books, poems, and short stories', 'Wall magazine and school newsletter contributions'] },
        section2: { heading: 'Annual Events', items: ['Elocution and recitation competitions', 'English Week celebrations with themed events', 'Inter-house elocution and debate competitions'] }
      }
    },
    'social-club': {
      file: '7-social-club.html',
      type: 'club',
      hero: { icon: '🤝', badge: 'Community · Service', title: 'Social Club', description: 'The Social Club at Loretto Central School nurtures compassion, civic responsibility, and community spirit. Guided by the motto "Love Through Service," students engage in meaningful social activities that make a real difference.' },
      infoTiles: [
        { label: 'Meets', value: 'Bi-weekly, Thursdays' },
        { label: 'Open To', value: 'Classes VI to X' },
        { label: 'Venue', value: 'Activity Room' }
      ],
      content: {
        section1: { heading: 'What We Do', items: ['Community outreach and awareness drives', 'Fundraising for charitable causes', 'Environmental cleanliness and plantation drives', 'Visits to care homes and community centres', 'Social awareness campaigns on key issues', 'Collaboration with local NGOs and community groups'] },
        section2: { heading: 'Values We Build', items: ["Empathy and understanding for others' perspectives", 'Teamwork, leadership, and organisational skills'] }
      }
    },
    'eco-club': {
      file: '8-eco-club.html',
      type: 'club',
      hero: { icon: '🌿', badge: 'Environment · Sustainability', title: 'Eco Club', description: 'The Eco Club at Loretto Central School champions environmental awareness and sustainable living. Students are inspired to be guardians of the planet through hands-on activities, green campaigns, and a deep connection with nature.' },
      infoTiles: [
        { label: 'Meets', value: 'Every Wednesday, Lunch Break' },
        { label: 'Open To', value: 'All Classes' },
        { label: 'Venue', value: 'School Garden / Ground' }
      ],
      content: {
        section1: { heading: 'Club Activities', items: ['Campus plantation drives and garden maintenance', 'Waste segregation and composting projects', 'Rainwater harvesting awareness campaigns', 'Nature walks and biodiversity documentation', 'World Environment Day and Earth Day celebrations', 'No-plastic and reduce-reuse-recycle campaigns'] },
        section2: { heading: 'Achievements', items: ['Maintained and expanded school garden', 'Organised inter-class eco quiz and poster competitions'] }
      }
    },
    'kannada-club': {
      file: '9-kannada-club.html',
      type: 'club',
      hero: { icon: 'ಕ', badge: 'Language · Culture', title: 'Kannada Club', description: "The Kannada Club at Loretto Central School celebrates the rich language, literature, and culture of Karnataka. The club brings students closer to their regional roots, fostering pride in Kannada heritage." },
      infoTiles: [
        { label: 'Meets', value: 'Every Tuesday, Lunch Break' },
        { label: 'Open To', value: 'All Classes' },
        { label: 'Venue', value: 'Classroom / Hall' }
      ],
      content: {
        section1: { heading: 'Club Activities', items: ['Kannada poem recitation and creative writing', 'Folk song and traditional story sessions', 'Rajyotsava Day and cultural celebrations', 'Kannada calligraphy and script appreciation', 'Debates and discussions in Kannada', 'Wall magazine contributions in Kannada'] },
        section2: { heading: 'Why the Kannada Club?', items: ["Strengthens spoken and written Kannada skills", "Connects students to Karnataka's cultural heritage"] }
      }
    },
    'maths-club': {
      file: '10-maths-club.html',
      type: 'club',
      hero: { icon: '📐', badge: 'Mathematics · Logic', title: 'Maths Club', description: 'The Maths Club at Loretto Central School transforms mathematics from a subject into an adventure. Through puzzles, competitions, and explorations, students discover the beauty, logic, and real-world power of mathematics.' },
      infoTiles: [
        { label: 'Meets', value: 'Every Thursday, Lunch Break' },
        { label: 'Open To', value: 'Classes IV to X' },
        { label: 'Venue', value: 'Maths Lab / Classroom' }
      ],
      content: {
        section1: { heading: 'Club Activities', items: ['Maths puzzles, riddles, and brain teasers', 'Mental maths competitions and timed challenges', 'Olympiad preparation — AMO, IMO, and state-level', 'Real-world maths applications (finance, architecture, nature)', 'Historical stories of great mathematicians', 'Math card games, Sudoku, and strategy games'] },
        section2: { heading: 'Competitions & Achievements', items: ['Annual Maths Olympiad participation', 'Inter-school Maths quiz and problem-solving challenges'] }
      }
    },
    'science-club': {
      file: '11-science-club.html',
      type: 'club',
      hero: { icon: '🔬', badge: 'Science · Innovation', title: 'Science Club', description: 'The Science Club at Loretto Central School fuels curiosity and a love for discovery. Through experiments, projects, and explorations, students experience science beyond the textbook — hands-on.' },
      infoTiles: [
        { label: 'Meets', value: 'Every Friday, 3:30–4:30 PM' },
        { label: 'Open To', value: 'Classes V to X' },
        { label: 'Venue', value: 'Science Laboratory' }
      ],
      content: {
        section1: { heading: 'Club Activities', items: ['Live science experiments and demonstrations', 'Science fair project development and mentorship', 'Science quiz competitions — inter-class and inter-school', 'ISRO / NASA model-making and space science sessions', 'Environmental science field studies on campus', 'Innovation challenges and prototype building'] },
        section2: { heading: 'Events & Achievements', items: ['Annual Science Exhibition — open to parents and community', 'National Science Day celebrations with live demonstrations'] }
      }
    },
    'hindi-club': {
      file: '12-hindi-club.html',
      type: 'club',
      hero: { icon: '🇮🇳', badge: 'Language · National', title: 'Hindi Club', description: "The Hindi Club at Loretto Central School fosters love for India's national language and its rich literary traditions. Students develop strong Hindi language skills and a deeper connection to national culture." },
      infoTiles: [
        { label: 'Meets', value: 'Every Wednesday, Lunch Break' },
        { label: 'Open To', value: 'All Classes' },
        { label: 'Venue', value: 'Classroom / Library' }
      ],
      content: {
        section1: { heading: 'Club Activities', items: ['Hindi poem recitation and creative story writing', 'Hindi Diwas celebrations and cultural programme', 'Debates, discussions, and elocution in Hindi', 'Hindi calligraphy and letter-writing sessions', 'Wall magazine and school notice-board in Hindi', 'Participation in Hindi language competitions'] },
        section2: { heading: 'Benefits', items: ['Strengthens spoken and written Hindi proficiency', 'Builds confidence in using Hindi in daily communication'] }
      }
    }
  };

  var DETAIL_BY_FILE = Object.keys(REGISTRY).reduce(function (map, slug) {
    map[REGISTRY[slug].file] = slug;
    return map;
  }, {});

  function fileName() {
    var parts = window.location.pathname.split('/');
    var f = parts[parts.length - 1] || 'index.html';
    if (f && !/\\.html$/i.test(f) && !/[?#]/.test(f)) f += '.html';
    return f;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function scheduleBackground(task) {
    if (typeof task !== 'function') return;
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(task, { timeout: 1500 });
      return;
    }
    window.setTimeout(task, 250);
  }

  function withApiBase(path) {
    return (window.__activitiesApiBase || '/api').replace(/\/+$/, '') + path;
  }

  async function resolveBase() {
    if (typeof window.resolveApiBase === 'function') {
      try {
        window.__activitiesApiBase = await window.resolveApiBase();
        return;
      } catch (error) {
        // Fall back to same-origin API.
      }
    }
    window.__activitiesApiBase = '/api';
  }

  async function loadActivity(slug) {
    try {
      if (typeof window.fetchData === 'function') {
        var cachedPayload = await window.fetchData('activities-clubs/' + slug);
        return cachedPayload && cachedPayload.data ? cachedPayload.data : null;
      }
      var response = await fetch(withApiBase('/activities-clubs/' + slug));
      if (!response.ok) return null;
      var payload = await response.json().catch(function () { return null; });
      return payload && payload.data ? payload.data : null;
    } catch (error) {
      return null;
    }
  }

  function prefetchSiblingActivities(currentSlug) {
    if (typeof window.fetchData !== 'function') return;

    var slugs = Object.keys(REGISTRY).filter(function (slug) {
      return slug && slug !== currentSlug;
    });

    scheduleBackground(function () {
      slugs.forEach(function (slug, index) {
        window.setTimeout(function () {
          window.fetchData('activities-clubs/' + slug);
        }, index * 150);
      });
    });
  }

  function normalizeActivity(slug, remoteData) {
    var defaults = REGISTRY[slug];
    if (!defaults) return null;

    var remoteHero = (remoteData && remoteData.hero) || {};
    var remoteContent = (remoteData && remoteData.content) || {};
    var remoteMeta = (remoteData && remoteData.meta) || (remoteData && remoteData.settings) || {};

    return {
      id: slug,
      file: defaults.file,
      type: (remoteData && remoteData.type) || defaults.type,
      hero: {
        icon: remoteHero.icon != null ? remoteHero.icon : (defaults.hero && defaults.hero.icon) || '',
        badge: remoteHero.badge || (defaults.hero && defaults.hero.badge) || '',
        title: remoteHero.title || (defaults.hero && defaults.hero.title) || '',
        description: remoteHero.description || (defaults.hero && defaults.hero.description) || ''
      },
      infoTiles: normalizeArray(remoteData && remoteData.infoTiles).length 
        ? normalizeArray(remoteData.infoTiles).slice(0, 3) 
        : normalizeArray(defaults.infoTiles),
      content: {
        section1: {
          heading: (remoteContent.section1 && remoteContent.section1.heading) || (defaults.content && defaults.content.section1 && defaults.content.section1.heading) || '',
          items: normalizeArray(remoteContent.section1 && remoteContent.section1.items).length
            ? normalizeArray(remoteContent.section1.items)
            : normalizeArray(defaults.content && defaults.content.section1 && defaults.content.section1.items)
        },
        section2: {
          heading: (remoteContent.section2 && remoteContent.section2.heading) || (defaults.content && defaults.content.section2 && defaults.content.section2.heading) || '',
          items: normalizeArray(remoteContent.section2 && remoteContent.section2.items).length
            ? normalizeArray(remoteContent.section2.items)
            : normalizeArray(defaults.content && defaults.content.section2 && defaults.content.section2.items)
        },
        gallery: normalizeArray(remoteContent.gallery).length
          ? normalizeArray(remoteContent.gallery)
          : normalizeArray(defaults.content && defaults.content.gallery),
        noticeBox: {
          text: (remoteContent.noticeBox && remoteContent.noticeBox.text) || (defaults.content && defaults.content.noticeBox && defaults.content.noticeBox.text) || '',
          visible: remoteContent.noticeBox ? !!remoteContent.noticeBox.visible : !!(defaults.content && defaults.content.noticeBox && defaults.content.noticeBox.visible)
        }
      },
      settings: {
        live: remoteMeta.live !== undefined ? !!remoteMeta.live : true,
        showGallery: remoteMeta.showGallery !== undefined ? !!remoteMeta.showGallery : true
      },
      seo: {
        title: remoteData && remoteData.seo && remoteData.seo.title ? remoteData.seo.title : '',
        description: remoteData && remoteData.seo && remoteData.seo.description ? remoteData.seo.description : ''
      },
      hasRemoteData: !!(remoteData && Object.keys(remoteData).length > 0)
    };
  }

  function renderTiles(infoTiles) {
    if (!infoTiles.length) return '';

    return '<div class="ac-info-grid">'
      + infoTiles.map(function (tile) {
          return '<div class="ac-info-tile">'
            + '<div class="tile-icon"></div>'
            + '<div class="tile-label">' + escapeHtml(tile.label || '') + '</div>'
            + '<div class="tile-value">' + escapeHtml(tile.value || '—') + '</div>'
            + '</div>';
        }).join('')
      + '</div>';
  }

  function renderSection(section) {
    if (!section || !section.heading || !normalizeArray(section.items).length) return '';
    return '<h3>' + escapeHtml(section.heading) + '</h3>'
      + '<ul>'
      + normalizeArray(section.items).map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        }).join('')
      + '</ul>';
  }

  function renderGallery(images) {
    var list = normalizeArray(images).filter(Boolean);
    if (!list.length) return '';

    return '<div class="school-gallery">'
      + list.slice(0, 6).map(function (url, index) {
          return '<div class="gallery-img">'
            + '<img src="' + escapeHtml(url) + '" alt="Activity photo ' + (index + 1) + '" loading="lazy" />'
            + '</div>';
        }).join('')
      + '</div>';
  }

  function renderNoticeBox(noticeBox) {
    if (!noticeBox || !noticeBox.visible || !noticeBox.text) return '';
    return '<div class="notice-box"><p><strong>Note:</strong> ' + escapeHtml(noticeBox.text) + '</p></div>';
  }

  function updateMeta(title, description) {
    if (title) document.title = title;

    var descValue = description || '';
    if (!descValue) return;

    var meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', descValue);
  }

  function renderUnavailable(title) {
    var heading = title || 'This Page';
    return '<div class="ac-hero-card"><div class="ac-hero-card-inner"><div class="ac-hero-text">'
      + '<span class="ac-hero-badge">Page Unavailable</span>'
      + '<h2>' + escapeHtml(heading) + '</h2>'
      + '<p>This page is currently hidden from the public site. Please check back later.</p>'
      + '</div></div></div>'
      + '<div class="notice-box"><p><strong>Return:</strong> Browse the other activities and clubs from the navigation above.</p></div>';
  }

  function updateDetailShell(data) {
    var bannerTitle = document.querySelector('.page-banner h1');
    if (bannerTitle && data.hero.title) bannerTitle.textContent = data.hero.title;

    var crumb = document.querySelector('.breadcrumb span:last-child');
    if (crumb && data.hero.title) crumb.textContent = data.hero.title;

    var activeLink = document.querySelector('.ac-subnav-section a.active');
    if (activeLink && data.hero.title) activeLink.textContent = data.hero.title;

    updateMeta(
      data.seo.title || (data.hero.title ? data.hero.title + ' | Activities & Clubs | Loretto Central School' : ''),
      data.seo.description || data.hero.description
    );
  }

  function renderDetail(data) {
    return '<div class="ac-hero-card">'
      + '<div class="ac-hero-card-inner">'
      + '<div class="ac-hero-icon">' + escapeHtml(data.hero.icon || '') + '</div>'
      + '<div class="ac-hero-text">'
      + '<span class="ac-hero-badge">' + escapeHtml(data.hero.badge || '') + '</span>'
      + '<h2>' + escapeHtml(data.hero.title || '') + '</h2>'
      + '<p>' + escapeHtml(data.hero.description || '') + '</p>'
      + '</div></div></div>'
      + renderTiles(data.infoTiles)
      + (data.settings.showGallery ? renderGallery(data.content.gallery) : '')
      + renderSection(data.content.section1)
      + renderSection(data.content.section2)
      + renderNoticeBox(data.content.noticeBox);
  }

  function placeholderIcon(data) {
    if (data.hero.icon) return escapeHtml(data.hero.icon);
    return data.type === 'club' ? 'C' : 'A';
  }

  function addRuntimeStyles() {
    if (document.getElementById('activities-runtime-style')) return;

    var style = document.createElement('style');
    style.id = 'activities-runtime-style';
    style.textContent = [
      'a.activity-card{display:block;text-decoration:none;color:inherit;}',
      '.activity-placeholder span{font-size:1rem;font-weight:800;letter-spacing:.08em;}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderIndexCard(data) {
    var title = data.hero.title || 'Activity';
    var badges = [
      '<span class="activity-badge">' + escapeHtml(data.type === 'club' ? 'Club' : 'Activity') + '</span>'
    ];
    if (data.hero.badge) {
      badges.push('<span class="activity-badge">' + escapeHtml(data.hero.badge) + '</span>');
    }
    var gallery = data.settings.showGallery ? normalizeArray(data.content.gallery).filter(Boolean).slice(0, 4) : [];
    var galleryHtml = gallery.length
      ? '<div class="activity-gallery">' + gallery.map(function (url, index) {
          return '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(title) + ' photo ' + (index + 1) + '" loading="lazy" />';
        }).join('') + '</div>'
      : '<div class="activity-placeholder"><span>' + placeholderIcon(data) + '</span></div>';

    return '<a class="activity-card" href="' + escapeHtml(data.file) + '">'
      + galleryHtml
      + '<div class="activity-body">'
      + '<div class="activity-name">' + escapeHtml(title) + '</div>'
      + '<div class="activity-meta">' + badges.join('') + '</div>'
      + (data.hero.description ? '<p class="activity-desc">' + escapeHtml(data.hero.description) + '</p>' : '')
      + '</div>'
      + '</a>';
  }

  async function initDetail(slug) {
    var card = document.querySelector('.content-card');
    if (!card) return;

    var remoteData = await loadActivity(slug);
    var data = normalizeActivity(slug, remoteData);
    if (!data) return;

    // Even if no remote data, we still update the shell and render the default content
    updateDetailShell(data);
    card.innerHTML = data.settings.live ? renderDetail(data) : renderUnavailable(data.hero.title);
    prefetchSiblingActivities(slug);
  }

  async function initIndex() {
    var container = document.getElementById('activities-grid');
    var loader = document.getElementById('activities-loading');
    if (!container) return;

    addRuntimeStyles();

    var slugs = Object.keys(REGISTRY);
    var items = await Promise.all(slugs.map(async function (slug) {
      var remoteData = await loadActivity(slug);
      return normalizeActivity(slug, remoteData);
    }));

    var visible = items.filter(function (item) {
      // Show if it's marked live, even if it only has default data
      return item && item.settings.live;
    });

    if (!visible.length) {
      if (loader) loader.textContent = 'No activities or clubs are available right now.';
      return;
    }

    container.innerHTML = visible.map(renderIndexCard).join('');
    container.style.display = 'grid';
    if (loader) loader.style.display = 'none';
  }

  function fillEmptySubnav() {
    document.querySelectorAll('.ac-subnav-section a').forEach(function (link) {
      if (link.textContent.trim() === '') {
        var href = link.getAttribute('href') || '';
        var parts = href.split('/');
        var file = parts[parts.length - 1];
        var slug = DETAIL_BY_FILE[file];
        if (slug && REGISTRY[slug] && REGISTRY[slug].hero) {
          link.textContent = REGISTRY[slug].hero.title;
        }
      }
    });
  }

  async function init() {
    await resolveBase();
    fillEmptySubnav();

    var currentFile = fileName();
    if (currentFile === 'index.html' || currentFile === '') {
      await initIndex();
      return;
    }

    var slug = DETAIL_BY_FILE[currentFile];
    if (slug) await initDetail(slug);
  }

  init();
})();
