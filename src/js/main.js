// main.js
window.addEventListener('resize', syncServiceTabOrientation, { passive: true });
initLeadDrafts();
initFloatingAssistant();
initDocumentAssistant();

initSiteUX();
document.getElementById('menu').addEventListener('click', toggleMobileMenu);
window.addEventListener('hashchange', render);
initLanguageUI();
window.addEventListener(
  'scroll',
  () => document.querySelector('.back-top')?.classList.toggle('is-shown', window.scrollY > 500),
  { passive: true },
);
render();
