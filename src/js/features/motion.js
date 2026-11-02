// features/motion.js
function wirePageMotion() {
  if (window._vfcRevealObserver) window._vfcRevealObserver.disconnect();
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;
  const blocks = document.querySelectorAll(
    '.home-section,.home-stats,.home-copy,.home-art,.svc-task,.svc-panel,.svc-factors,.svc-products,.ref-section,.kb-guide-preview,.kb-partner-preview',
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
  );
  blocks.forEach((block, i) => {
    block.classList.add('reveal-ready');
    block.style.setProperty('--reveal-delay', i < 2 ? `${i * 90}ms` : '0ms');
    observer.observe(block);
  });
  window._vfcRevealObserver = observer;
}
