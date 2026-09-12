const object = document.querySelector('#hero-object');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (object && !reduceMotion) {
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

document.querySelector('#year').textContent = new Date().getFullYear();
