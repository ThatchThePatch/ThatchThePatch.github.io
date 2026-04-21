/**
 * Project cards use window.PORTFOLIO_PROJECTS from projects-data.js
 */
const PROJECTS = window.PORTFOLIO_PROJECTS || [];

const THEME_KEY = 'portfolio-theme';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderProjects() {
  const list = document.getElementById('project-list');
  if (!list) return;

  list.innerHTML = PROJECTS.map((p) => {
    const meta = p.tags.map((t) => escapeHtml(t)).join(', ');
    const alt = escapeHtml(p.imageAlt || p.title);
    const detailHref = `project.html?id=${encodeURIComponent(p.slug)}`;
    return `<li>
        <a class="project-card" href="${escapeHtml(detailHref)}">
          <figure class="project-card-figure">
            <img src="${escapeHtml(p.image[0])}" alt="${alt}" width="900" height="560" loading="lazy" decoding="async" />
          </figure>
          <div class="project-card-body">
            <h3 class="project-card-title">${escapeHtml(p.title)}</h3>
            <p class="project-card-meta">${meta}</p>
          </div>
        </a>
      </li>`;
  }).join('');
}

function setupYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.hidden = true;
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 768px)').matches) closeMenu();
  });
}

function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch (e) {
    void e;
  }
  return null;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    void e;
  }
}

function setupThemeToggle() {
  const stored = getStoredTheme();
  const prefersLight =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  if (stored) applyTheme(stored);
  else if (prefersLight) applyTheme('light');

  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next =
      document.documentElement.getAttribute('data-theme') === 'light'
        ? 'dark'
        : 'light';
    applyTheme(next);
  });
}

function setupScrollSpy() {
  const sectionIds = ['home', 'about', 'projects', 'contact'];
  const navLinks = document.querySelectorAll('[data-nav]');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-nav') === id);
    });
  };

  const onScroll = () => {
    const probe = window.scrollY + window.innerHeight * 0.32;
    let current = sectionIds[0];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = id;
      }
    }
    setActive(current);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  setupYear();
  setupHeaderScroll();
  setupMobileNav();
  setupThemeToggle();
  setupScrollSpy();
});
