// main.js
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
