document.documentElement.classList.add('js-anim');
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.documentElement.classList.add('is-loaded');
}));

const object = document.querySelector('#hero-object');
const flipToggle = document.querySelector('#flip-toggle');
const flipClose = document.querySelector('#flip-close');
const flipFront = document.querySelector('.flip-card-front');
const flipBack = document.querySelector('#contact-back');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isFlipped = () => object.classList.contains('is-flipped');

const setFlipped = (flipped, returnFocus = true) => {
  object.classList.toggle('is-flipped', flipped);
  flipToggle.setAttribute('aria-expanded', String(flipped));

  if (flipped) {
    flipBack.inert = false;
    flipBack.removeAttribute('aria-hidden');
    flipFront.inert = true;
    flipFront.setAttribute('aria-hidden', 'true');
    const firstLink = flipBack.querySelector('a');
    if (firstLink) firstLink.focus();
  } else {
    flipFront.inert = false;
    flipFront.removeAttribute('aria-hidden');
    flipBack.inert = true;
    flipBack.setAttribute('aria-hidden', 'true');
    if (returnFocus) flipToggle.focus();
  }
};

if (object && flipToggle && flipClose && flipFront && flipBack) {
  flipToggle.addEventListener('click', () => setFlipped(true));
  flipClose.addEventListener('click', () => setFlipped(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isFlipped()) setFlipped(false);
  });

  flipBack.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setFlipped(false, false));
  });

  if (!reduceMotion) {
    object.addEventListener('pointermove', (event) => {
      const box = object.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      object.style.setProperty('--rx', `${-y * 5}deg`);
      object.style.setProperty('--ry', `${x * 5}deg`);
    });
    object.addEventListener('pointerleave', () => {
      object.style.setProperty('--rx', '0deg');
      object.style.setProperty('--ry', '0deg');
    });
  }
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const countUp = (el) => {
  const parts = el.textContent.trim().match(/^([^\d]*)([\d.]+)([^\d.]*)$/);
  if (!parts) return;

  const [, prefix, digits, suffix] = parts;
  const decimals = (digits.split('.')[1] || '').length;
  const target = parseFloat(digits);
  if (!Number.isFinite(target)) return;

  const duration = 1200;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = prefix + (target * easeOutCubic(progress)).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

const statValues = document.querySelectorAll('.stat-value');

if (statValues.length && !reduceMotion) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  statValues.forEach((el) => statObserver.observe(el));
}

const header = document.querySelector('.site-header');

if (header) {
  const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

try {
  if (!reduceMotion) {
    const revealTargets = document.querySelectorAll('[data-reveal]');
    if (revealTargets.length && 'IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealTargets.forEach((el) => revealObserver.observe(el));
    }

    document.querySelectorAll('.project').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        card.style.setProperty('--rx', `${-y * 3}deg`);
        card.style.setProperty('--ry', `${x * 3}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
} catch (error) {
  document.documentElement.classList.remove('js-anim');
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
