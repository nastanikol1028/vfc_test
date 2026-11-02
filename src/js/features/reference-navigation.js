// features/reference-navigation.js
function wireReferencePages() {
  if (typeof wireCategoryAI === 'function') wireCategoryAI(refCategories);
  document.querySelectorAll('[data-history]').forEach((b) =>
    b.addEventListener('click', () => {
      const track = document.getElementById('ref-history-track');
      track.scrollBy({
        left: Number(b.dataset.history) * track.clientWidth * 0.7,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }),
  );
  document.querySelectorAll('[data-review-scroll]').forEach((b) =>
    b.addEventListener('click', () => {
      const track = document.getElementById('ref-reviews-track');
      track.scrollBy({
        left: Number(b.dataset.reviewScroll) * track.clientWidth * 0.6,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }),
  );
}
