/* =====================================================
   GALERI INVESTASI BEI · FIA UB
   script.js — Main JavaScript
===================================================== */

'use strict';

/* ── DOM SELECTORS ──────────────────────────────── */
const navbar       = document.getElementById('navbar');
const navLinks     = document.getElementById('navLinks');
const navHamburger = document.getElementById('navHamburger');
const announceBar  = document.getElementById('announceBar');
const announceClose= document.getElementById('announceClose');
const backToTop    = document.getElementById('backToTop');
const contactForm  = document.getElementById('contactForm');
const toast        = document.getElementById('toast');
const toastMsg     = document.getElementById('toastMsg');
const heroChart    = document.getElementById('heroChart');
const aboutChart   = document.getElementById('aboutChart');

/* ── ANNOUNCE BAR CLOSE ─────────────────────────── */
if (announceClose) {
  announceClose.addEventListener('click', () => {
    announceBar.style.maxHeight = announceBar.scrollHeight + 'px';
    requestAnimationFrame(() => {
      announceBar.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
      announceBar.style.maxHeight = '0';
      announceBar.style.opacity = '0';
      announceBar.style.overflow = 'hidden';
    });
    setTimeout(() => announceBar.remove(), 350);
  });
}

/* ── NAVBAR: SCROLL + ACTIVE LINK ───────────────── */
const allNavLinks = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');

function onScroll() {
  const scrollY = window.scrollY;

  // Sticky shadow
  navbar.classList.toggle('scrolled', scrollY > 40);

  // Back to top
  backToTop.classList.toggle('visible', scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (scrollY >= top) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── HAMBURGER MENU ─────────────────────────────── */
if (navHamburger) {
  navHamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navHamburger.classList.toggle('open', isOpen);
    navHamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navHamburger.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navHamburger.classList.remove('open');
    }
  });
}

/* ── BACK TO TOP ────────────────────────────────── */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── INTERSECTION OBSERVER: FADE ANIMATIONS ─────── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

/* ── COUNTER ANIMATION ──────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── HERO CHART (BAR CHART) ─────────────────────── */
(function buildHeroChart() {
  if (!heroChart) return;
  const bars = [28, 42, 35, 52, 46, 63, 55, 72, 68, 88];
  heroChart.innerHTML = bars.map((h, i) => {
    const isHi = h > 55;
    return `<div class="pc-bar${isHi ? ' hi' : ''}" style="height:${h}%;animation:barGrow 0.5s ease forwards ${i * 0.07}s;transform-origin:bottom;transform:scaleY(0)"></div>`;
  }).join('');
})();

/* ── ABOUT CHART → replaced by TradingView embed ── */

/* ── ADD KEYFRAMES DYNAMICALLY ───────────────────── */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes barGrow {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ── CONTACT FORM VALIDATION & SUBMIT ────────────── */
const formFields = {
  fname:  { id: 'fname',  errId: 'fnameErr',  msg: 'Nama lengkap wajib diisi.' },
  femail: { id: 'femail', errId: 'femailErr', msg: 'Email wajib diisi.', emailCheck: true },
  ftopic: { id: 'ftopic', errId: 'ftopicErr', msg: 'Pilih topik terlebih dahulu.' },
  fmsg:   { id: 'fmsg',   errId: 'fmsgErr',  msg: 'Pesan wajib diisi.' },
};

function clearErrors() {
  Object.values(formFields).forEach(f => {
    const el = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (el) el.classList.remove('error');
    if (err) err.textContent = '';
  });
}

function validateForm() {
  let valid = true;

  Object.values(formFields).forEach(f => {
    const el  = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el) return;

    const val = el.value.trim();

    if (!val) {
      el.classList.add('error');
      if (err) err.textContent = f.msg;
      valid = false;
      return;
    }

    if (f.emailCheck) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(val)) {
        el.classList.add('error');
        if (err) err.textContent = 'Format email tidak valid.';
        valid = false;
      }
    }
  });

  return valid;
}

function showToast(msg, duration = 4000) {
  toastMsg.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), duration);
}

function setSubmitLoading(loading) {
  const btn  = document.getElementById('submitBtn');
  const text = btn.querySelector('.btn-text');
  if (loading) {
    btn.disabled = true;
    text.textContent = 'Mengirim...';
    btn.style.opacity = '0.7';
  } else {
    btn.disabled = false;
    text.textContent = 'Kirim Pesan';
    btn.style.opacity = '';
  }
}

if (contactForm) {
  // Real-time clear error on input
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = document.getElementById(input.id + 'Err');
      if (errEl) errEl.textContent = '';
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) return;

    setSubmitLoading(true);

    // Simulate async submit (replace with real fetch/AJAX)
    await new Promise(resolve => setTimeout(resolve, 1200));

    setSubmitLoading(false);
    contactForm.reset();
    showToast('✓  Pesan terkirim! Kami akan menghubungimu segera.');
  });
}

/* ── TICKER LIVE SIMULATION (HERO) ──────────────── */
(function liveTickerSim() {
  const stocks = [
    { code: 'BBCA', base: 9500,  change: 1.2 },
    { code: 'TLKM', base: 3750,  change: 0.8 },
    { code: 'ASII', base: 5150,  change: 2.1 },
    { code: 'BBRI', base: 4400,  change: -0.5 },
    { code: 'GOTO', base: 68,    change: 1.9 },
  ];

  const container = document.getElementById('heroTickers');
  if (!container) return;

  // Build initial tickers
  stocks.forEach(s => {
    const el = document.createElement('div');
    el.className = 'ticker-pill';
    el.style.cssText = `
      display:inline-flex;gap:6px;align-items:center;
      background:rgba(201,162,39,0.1);
      border:1px solid rgba(201,162,39,0.2);
      border-radius:6px;padding:5px 10px;margin:2px;
    `;
    el.innerHTML = `
      <span style="font-size:11px;color:#fff;font-weight:600">${s.code}</span>
      <span style="font-size:10px;color:${s.change >= 0 ? '#4ade80' : '#f87171'};font-weight:500">${s.change >= 0 ? '▲' : '▼'} ${Math.abs(s.change)}%</span>
    `;
    container.appendChild(el);
  });

  // Subtle live fluctuation every 3s
  setInterval(() => {
    const pills = container.querySelectorAll('.ticker-pill');
    stocks.forEach((s, i) => {
      const fluctuation = (Math.random() - 0.48) * 0.3;
      s.change = parseFloat((s.change + fluctuation).toFixed(2));
      const pill = pills[i];
      if (!pill) return;
      const span = pill.querySelector('span:last-child');
      const isPositive = s.change >= 0;
      span.style.color = isPositive ? '#4ade80' : '#f87171';
      span.textContent = `${isPositive ? '▲' : '▼'} ${Math.abs(s.change).toFixed(1)}%`;
    });
  }, 3000);
})();

/* ── PROGRAM CARD HOVER: TILT EFFECT ─────────────── */
document.querySelectorAll('.prog-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `
      translateY(-3px)
      rotateX(${(-y * 5).toFixed(1)}deg)
      rotateY(${(x * 5).toFixed(1)}deg)
    `;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ── FLOATING CARD PARALLAX (HERO) ───────────────── */
const floatingCards = document.querySelectorAll('.floating-card');
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  floatingCards.forEach((card, i) => {
    const factor = (i + 1) * 6;
    card.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});