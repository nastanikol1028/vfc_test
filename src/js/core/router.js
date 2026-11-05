// core/router.js
function render() {
  captureLeadDrafts();
  routeTransitionStart();
  if (window._vfcPhotoCleanup) {
    window._vfcPhotoCleanup();
    window._vfcPhotoCleanup = null;
  }
  const app = document.getElementById('app');
  const path = getSiteRoute();
  let [section, id] = path.split('/');
  if (!isKnownSiteRoute(path)) {
    app.innerHTML = siteNotFound();
    window.scrollTo(0, 0);
    finalizeRouteUI();
    return;
  }
  syncLegacyLocation(path);
  if (!path || path === '') app.innerHTML = home();
  else if (section === 'registry') app.innerHTML = registryPage(id);
  else if (section === 'catalog' && !id) app.innerHTML = refCatalog();
  else if (section === 'catalog' && id === 'textile') app.innerHTML = refClothing();
  else if (section === 'catalog' && refCategories.some((x) => x[0] === id))
    app.innerHTML = refCategoryDetail(id);
  else if (section === 'catalog' && id === 'footwear')
    app.innerHTML = `${pageHero('Обувь и аксессуары', 'Обувь и аксессуары', 'Определим требования к материалам, назначению и возрастной группе продукции.')}<section class="section"><div class="wrap">${formCard('Обсудить оформление документов')}</div></section>`;
  else if (section === 'catalog' && id) app.innerHTML = productPage(id);
  else if (['declaration', 'certification', 'voluntary'].includes(section))
    app.innerHTML = servicePage(section);
  else if (section === 'service-terms') app.innerHTML = serviceTermsPage();
  else if (['privacy', 'consent', 'terms', 'cookies'].includes(section))
    app.innerHTML = legalPage(section);
  else if (section === 'specifications') app.innerHTML = specifications();
  else if (['services', 'pick-services'].includes(section)) app.innerHTML = services();
  else if (section === 'partners') app.innerHTML = partnershipPage();
  else if (section === 'guide') app.innerHTML = knowledgeGuidePage();
  else if (section === 'about') app.innerHTML = refAbout();
  else if (section === 'how') app.innerHTML = refHow();
  else if (section === 'marketplaces') app.innerHTML = marketplace();
  else if (section === 'reviews') app.innerHTML = reviews();
  else if (section === 'cases') app.innerHTML = cases();
  else if (section === 'articles') app.innerHTML = id ? articlePage(id) : articles();
  else if (section === 'contacts') app.innerHTML = refContacts();
  else if (section === 'callback') app.innerHTML = callbackPage();
  else if (section === 'request') app.innerHTML = request();
  else if (section === 'select') app.innerHTML = select();
  else app.innerHTML = siteNotFound();
  refineGuidePage();
  document
    .querySelector('.floating')
    ?.classList.toggle('hidden', ['select', 'request', 'callback'].includes(section));
  document.getElementById('navlinks').classList.remove('open');
  if (typeof closeHeaderDropdowns === 'function') closeHeaderDropdowns();
  document.getElementById('menu').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  wireForms();
  if (section === 'request') applyAssistantLead();
  wireRegistry();
  wireQuiz();
  wireCityMap();
  wireServices();
  wireReferencePages();
  wirePartnerPrice();
  wireCategorySections();
  wirePageMotion();
  if (typeof vfcApplyLanguage === 'function') vfcApplyLanguage();
  finalizeRouteUI();
  if ((section === 'guide' && id) || (section === 'partners' && id === 'request'))
    requestAnimationFrame(() => {
      const target = document.getElementById(
        section === 'guide' ? 'guide-' + id : 'partner-enquiry',
      );
      target?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    });
}
