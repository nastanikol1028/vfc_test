// features/city-map.js
function wireCityMap() {
  const points = document.querySelectorAll('.city-point');
  points.forEach((point) => {
    const x = parseFloat(point.style.getPropertyValue('--city-x'));
    point.classList.toggle('city-align-left', x < 20);
    point.classList.toggle('city-align-right', x > 75);
    point.addEventListener('click', () => {
      const open = point.getAttribute('aria-expanded') !== 'true';
      points.forEach((p) => p.setAttribute('aria-expanded', 'false'));
      point.setAttribute('aria-expanded', String(open));
    });
    point.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') point.setAttribute('aria-expanded', 'false');
    });
  });
}
