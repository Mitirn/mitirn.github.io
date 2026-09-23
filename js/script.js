
const projects = [
  {
    title: 'Task Manager (SPA)',
    stack: 'React · TypeScript · Redux Toolkit · Tailwind',
    bullets: [
      'Реализовал CRUD-операции, фильтрацию и поиск задач',
      'Настроил сохранение состояния в localStorage',
      'Покрыл ключевые компоненты тестами (Jest + RTL)',
    ],
    links: [
      { label: '🔗 Демо', url: '#' },
      { label: '💻 Код', url: '#' },
    ],
  },
  {
    title: 'Weather App',
    stack: 'JavaScript · HTML · CSS · OpenWeather API',
    bullets: [
      'Интегрировал внешний API, обработал ошибки и состояния загрузки',
      'Сделал адаптивную вёрстку под мобильные устройства',
    ],
    links: [
      { label: '🔗 Демо', url: '#' },
      { label: '💻 Код', url: '#' },
    ],
  },
  {
    title: 'Landing Page (коммерческий заказ)',
    stack: 'HTML · SCSS · JavaScript',
    bullets: [
      'Сверстал лендинг по макету Figma (Pixel Perfect)',
      'Оптимизировал скорость загрузки — Lighthouse 95+',
    ],
    links: [{ label: '🔗 Демо', url: '#' }],
  },
];

function renderProjects() {
  const container = document.getElementById('projects');
  if (!container) return;

  const html = projects
    .map(
      (p) => `
      <article class="project">
        <div class="project__head">
          <h3 class="project__title">${p.title}</h3>
          <span class="project__stack">${p.stack}</span>
        </div>
        <ul class="project__list">
          ${p.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
        <div class="project__links">
          ${p.links
            .map(
              (l) =>
                `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`
            )
            .join('')}
        </div>
      </article>`
    )
    .join('');

  container.innerHTML = html;
}


const THEME_KEY = 'resume-theme';

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light', isLight);

  const icon = document.querySelector('.theme-toggle__icon');
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (prefersLight ? 'light' : 'dark');
  applyTheme(theme);
}

function toggleTheme() {
  const next = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}


function renderUpdatedDate() {
  const el = document.getElementById('updated');
  if (!el) return;

  el.textContent = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function initReveal() {
  const targets = document.querySelectorAll('.section, .project');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  // Начальное состояние
  targets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initTheme();
  renderUpdatedDate();
  initReveal();

  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
});