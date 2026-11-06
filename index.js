
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.header');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menu-icon');
  const themeBtn = document.getElementById('darkMode-icon');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-bar a')];
  const desktop = window.matchMedia('(min-width: 992px)');
  const store = {
    get() { try { return localStorage.getItem('theme'); } catch { return null; } },
    set(v) { try { localStorage.setItem('theme', v); } catch {} }
  };

  /* ---------- dark mode ---------- */
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    const dark = t === 'dark';
    themeBtn.setAttribute('aria-pressed', dark);
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeMeta) themeMeta.content = dark ? '#0e1320' : '#fdfdfd';
  }
  applyTheme(root.getAttribute('data-theme') || 'light');

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-transition');
    applyTheme(next);
    store.set(next);
    setTimeout(() => root.classList.remove('theme-transition'), 450);
  });

  // follow the OS setting until the visitor picks a theme themselves
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!store.get()) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ---------- mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
  }
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !header.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });
  desktop.addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- sticky header + active link ---------- */
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('sticky', y > 100);

    let current = sections[0];
    sections.forEach(sec => { if (y >= sec.offsetTop - 150) current = sec; });
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];

    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();