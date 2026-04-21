const THEME_KEY = 'portfolio-theme';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getProjectBySlug(slug) {
  const list = window.PORTFOLIO_PROJECTS || [];
  return list.find((p) => p.slug === slug) || null;
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

function renderProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id');
  const notFound = document.getElementById('detail-not-found');
  const article = document.getElementById('detail-article');

  if (!slug || !notFound || !article) return;

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound.hidden = false;
    article.hidden = true;
    document.title = 'Project not found | Thatcher Pacholl';
    return;
  }

  notFound.hidden = true;
  article.hidden = false;

  document.title = `${project.title} | Thatcher Pacholl`;

  const titleEl = document.getElementById('detail-title');
  if (titleEl) titleEl.textContent = project.title;

  const tagsEl = document.getElementById('detail-tags');
  if (tagsEl) {
    tagsEl.textContent = project.tags.join(', ');
  }

  const img = document.getElementById('detail-hero-img');
  if (img) {
    img.src = project.image[0];
    img.alt = project.imageAlt || project.title;
  }

  const overviewEl = document.getElementById('detail-overview');
  if (overviewEl && project.overviewParagraphs) {
    overviewEl.innerHTML = project.overviewParagraphs
      .map((html) => `<p class="detail-overview-p">${html}</p>`)
      .join('');
  }

  const highlightsEl = document.getElementById('detail-highlights');
  if (highlightsEl && project.highlights) {
    highlightsEl.innerHTML = project.highlights
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');
  }

  const techEl = document.getElementById('detail-tech');
  if (techEl && project.technologies) {
    techEl.innerHTML = project.technologies
      .map((t) => `<li>${escapeHtml(t)}</li>`)
      .join('');
  }

  const yearEl = document.getElementById('detail-year');
  if (yearEl) yearEl.textContent = project.year || '';

  const gh = document.getElementById('detail-github');
  const modal = document.getElementById('image-modal');
  const modalImages = document.getElementById('modal-images');
  const closeBtn = document.getElementById('modal-close');

  gh.addEventListener('click', function (e) {
    const url = (project.githubUrl || '').trim().toLowerCase();
    console.log(url);
    if (url === 'none') {
      e.preventDefault(); // STOP link navigation

      // Clear old images
      modalImages.innerHTML = '';

      project.image.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        modalImages.appendChild(img);
      });

      modal.style.display = 'block';
    }

  });
  closeBtn.onclick = () => (modal.style.display = 'none');

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };

  if ((project.githubUrl || '').trim().toLowerCase() === 'none') {
    gh.innerText = 'View Images';
  } else {
    gh.innerText = 'View Source Code';
    gh.href = project.githubUrl;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupYear();
  setupHeaderScroll();
  setupMobileNav();
  setupThemeToggle();
  renderProjectDetail();
});
