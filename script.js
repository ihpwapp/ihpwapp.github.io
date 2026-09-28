const object = document.querySelector('#hero-object');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (object) {
  object.addEventListener('click', () => {
    object.classList.toggle('is-flipped');
    const isFlipped = object.classList.contains('is-flipped');
    object.setAttribute('aria-expanded', String(isFlipped));
    object.setAttribute('aria-label', isFlipped ? 'Hide contact details' : 'Show contact details');
  });

  object.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      object.click();
    }
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

  const duration = 5000;
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

document.querySelector('#year').textContent = new Date().getFullYear();
