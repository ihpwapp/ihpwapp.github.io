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

document.querySelector('#year').textContent = new Date().getFullYear();
