(function () {
  'use strict';

  var THEME_KEY = 'resume-theme';
  var root = document.documentElement;

  function reduceMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function finePointer() {
    return !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }

  var projects = [
    {
      title: 'Сайт Хороменской администрации',
      stack: 'HTML · CSS · JavaScript',
      links: [{ label: '🔗 horomnoe.ru', url: 'https://horomnoe.ru' }]
    }
  ];

  function create(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function readStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function storeTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {  }
  }

  function applyTheme(theme) {
    var isLight = theme === 'light';

    root.classList.toggle('light', isLight);
    root.style.colorScheme = isLight ? 'light' : 'dark';

    var icon = document.querySelector('.theme-toggle__icon');
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isLight ? '#f6f7f9' : '#0e1015');

    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(isLight));
      btn.setAttribute('title', isLight ? 'Тёмная тема' : 'Светлая тема');
    }
  }

  function initTheme() {
    var stored = readStoredTheme();
    var prefersLight = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
    applyTheme(stored || (prefersLight ? 'light' : 'dark'));

    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = root.classList.contains('light') ? 'dark' : 'light';
        storeTheme(next);
        applyTheme(next);
      });
    }

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var onSystemChange = function (event) {
        if (!readStoredTheme()) applyTheme(event.matches ? 'light' : 'dark');
      };
      if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
      else if (mq.addListener) mq.addListener(onSystemChange);
    }
  }

  function buildProject(project) {
    var card = create('article', 'card');

    var head = create('div', 'card__head');
    head.appendChild(create('h3', 'card__title', project.title));
    if (project.stack) head.appendChild(create('span', 'card__stack', project.stack));
    card.appendChild(head);

    if (project.bullets && project.bullets.length) {
      var list = create('ul', 'card__list');
      project.bullets.forEach(function (bullet) {
        list.appendChild(create('li', null, bullet));
      });
      card.appendChild(list);
    }

    var links = (project.links || []).filter(function (link) {
      return link && link.url && link.url !== '#';
    });

    if (links.length) {
      var box = create('div', 'card__links');
      links.forEach(function (link) {
        var a = create('a', null, link.label || link.url);
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        box.appendChild(a);
      });
      card.appendChild(box);
    }

    return card;
  }

  function renderProjects() {
    var box = document.getElementById('projects');
    if (!box) return;

    var section = document.getElementById('projectsSection');

    if (!projects.length) {
      if (section) section.remove();
      return;
    }

    var fragment = document.createDocumentFragment();
    projects.forEach(function (project) {
      var wrapper = create('div', 'project-reveal reveal');
      wrapper.appendChild(buildProject(project));
      fragment.appendChild(wrapper);
    });
    box.appendChild(fragment);
  }

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    function showAll() {
      items.forEach(function (item) { item.classList.add('is-visible'); });
    }

    if (reduceMotion() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    items.forEach(function (item) { observer.observe(item); });

    window.setTimeout(function () {
      if (!document.querySelector('.reveal.is-visible')) showAll();
    }, 4000);
  }

  function initStagger() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (group) {
      Array.prototype.forEach.call(group.children, function (child, index) {
        child.style.setProperty('--d', String(Math.min(index, 10)));
      });
    });
  }

  function renderUpdatedDate() {
    var node = document.getElementById('updated');
    if (!node) return;

    node.textContent = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function initScrollUI() {
    var bar = document.getElementById('scrollBar');
    var toTop = document.getElementById('toTop');
    var queued = false;

    function update() {
      queued = false;

      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var y = window.pageYOffset || doc.scrollTop || 0;
      var progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      if (bar) bar.style.transform = 'scaleX(' + progress + ')';
      if (toTop) toTop.classList.toggle('is-visible', y > 320);
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
      });
    }

    update();
  }

  function initSpotlight() {
    if (!finePointer()) return;

    Array.prototype.forEach.call(document.querySelectorAll('.card'), function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        card.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
      });
    });
  }

  function initPrint() {
    var btn = document.getElementById('printBtn');
    if (btn) btn.addEventListener('click', function () { window.print(); });
  }

  function init() {
    renderProjects();
    initTheme();
    renderUpdatedDate();
    initStagger();
    initReveal();
    initScrollUI();
    initSpotlight();
    initPrint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
