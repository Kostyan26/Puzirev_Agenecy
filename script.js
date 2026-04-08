/* ================================================
   PUZIREV AGENCY — script.js
   ================================================ */

'use strict';

/* ---- Cached elements ---- */
const nav      = document.getElementById('nav');
const burger   = document.getElementById('burger');
const mmenu    = document.getElementById('mmenu');
const toast    = document.getElementById('toast');
const cookie   = document.getElementById('cookie');
const cookieOk = document.getElementById('cookieOk');

/* ================================================
   NAV — scroll glass effect
   ================================================ */
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 72);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ================================================
   MOBILE MENU
   ================================================ */
burger.addEventListener('click', () => {
  const isOpen = mmenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mmenu__link').forEach(link => {
  link.addEventListener('click', () => {
    mmenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ================================================
   SMOOTH SCROLL (offset for fixed nav)
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ================================================
   INTERSECTION OBSERVER — scroll reveals
   ================================================ */
const revealObs = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: '0px 0px 0px 0px' }
);

const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
revealEls.forEach(el => revealObs.observe(el));

// Safety fallback: if observer never fires (e.g. element already in view on load),
// force-show all unrevealed elements after a short delay
setTimeout(() => {
  revealEls.forEach(el => el.classList.add('visible'));
}, 300);

/* ================================================
   HERO ENTRY ANIMATIONS (on load)
   ================================================ */
window.addEventListener('load', () => {
  document.querySelectorAll('.anim-up, .anim-right').forEach(el => {
    el.classList.add('loaded');
  });
  runCounters();
});

/* ================================================
   COUNTER ANIMATION
   ================================================ */
function runCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = target > 1000 ? 2400 : 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const val = Math.round(target * eased);
      el.textContent = val >= 1000 ? val.toLocaleString('ru-RU') : val;
      if (p < 1) requestAnimationFrame(tick);
    }

    setTimeout(() => requestAnimationFrame(tick), 700);
  });
}

/* ================================================
   FAQ ACCORDION
   ================================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn  = item.querySelector('.faq-item__btn');
  const body = item.querySelector('.faq-item__body');

  btn.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('is-open');
      i.querySelector('.faq-item__body').classList.remove('is-open');
    });

    // Open this one if it was closed
    if (!wasOpen) {
      item.classList.add('is-open');
      body.classList.add('is-open');
    }
  });
});

/* ================================================
   PORTFOLIO CARD TOGGLES
   ================================================ */
document.querySelectorAll('.pcard__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const id      = btn.dataset.card;
    const details = document.getElementById(`card-${id}`);
    const textEl  = btn.querySelector('.pcard__toggle-text');
    const isOpen  = details.classList.contains('is-open');

    details.classList.toggle('is-open', !isOpen);
    btn.classList.toggle('is-open', !isOpen);
    textEl.textContent = isOpen ? 'Подробнее о кейсе' : 'Свернуть';
  });
});

/* ================================================
   FORM SUBMISSIONS
   ================================================ */
function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

function handleForm(e) {
  e.preventDefault();
  const form  = e.currentTarget;
  const name  = form.querySelector('[name="name"]').value.trim();
  const phone = form.querySelector('[name="phone"]').value.trim();
  if (!name || phone.length < 6) return;

  const btn  = form.querySelector('[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Отправляем…';
  btn.disabled = true;

  // Simulate async submit
  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
    form.reset();
    showToast();
  }, 1100);
}

document.getElementById('heroForm').addEventListener('submit', handleForm);
document.getElementById('ctaForm').addEventListener('submit', handleForm);

/* ================================================
   PHONE INPUT MASK
   ================================================ */
function applyMask(input) {
  input.addEventListener('input', function () {
    let raw = this.value.replace(/\D/g, '');
    // Normalise leading 8 → 7
    if (raw.startsWith('8')) raw = '7' + raw.slice(1);
    if (!raw.startsWith('7') && raw.length > 0) raw = '7' + raw;

    const d = raw.slice(1); // digits after country code

    let out = '';
    if (d.length > 0)  out  = '+7';
    if (d.length > 0)  out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ') ' + d.slice(3, 6);
    if (d.length >= 6) out += '-' + d.slice(6, 8);
    if (d.length >= 8) out += '-' + d.slice(8, 10);

    this.value = out;
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && (this.value === '+7' || this.value === '+')) {
      this.value = '';
      e.preventDefault();
    }
  });
}

document.querySelectorAll('input[type="tel"]').forEach(applyMask);

/* ================================================
   COOKIE BANNER
   ================================================ */
if (localStorage.getItem('pa_cookie')) {
  cookie.classList.add('hidden');
}
cookieOk.addEventListener('click', () => {
  localStorage.setItem('pa_cookie', '1');
  cookie.classList.add('hidden');
});
