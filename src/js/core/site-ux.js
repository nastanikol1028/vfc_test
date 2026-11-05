/* Shared navigation, accessibility, metadata and lead feedback. */
const VFC_SITE_ORIGIN = 'https://vfc-test.annikol396.chatgpt.site';
const VFC_ROUTE_ROOTS = [
  'services',
  'catalog',
  'partners',
  'about',
  'contacts',
  'how',
  'declaration',
  'certification',
  'voluntary',
  'specifications',
  'marketplaces',
  'request',
  'callback',
  'select',
  'guide',
  'reviews',
  'cases',
  'articles',
  'privacy',
  'terms',
  'cookies',
  'registry',
];
function getSiteRoute() {
  let raw = location.hash.startsWith('#/')
    ? location.hash.slice(2)
    : location.pathname.replace(/^\/+|\/+$/g, '');
  try {
    raw = decodeURIComponent(raw);
  } catch {
    return '__not_found__';
  }
  raw = raw.replace(/^\/+|\/+$/g, '');
  if (raw === 'index.html') return '';
  if (raw === 'pick-services') return 'services';
  return raw;
}
function isKnownSiteRoute(route) {
  if (!route) return true;
  const [root, id, ...rest] = route.split('/');
  if (rest.length)
    return (
      root === 'catalog' &&
      refCategories.some((c) => c[0] === id) &&
      ['requirements', 'products', 'estimate'].includes(rest[0]) &&
      rest.length === 1
    );
  if (!VFC_ROUTE_ROOTS.includes(root)) return false;
  if (root === 'catalog') return !id || refCategories.some((c) => c[0] === id);
  if (root === 'services') return !id || !!serviceDirections[id];
  if (root === 'guide')
    return (
      !id || ['compare', 'start'].includes(id) || VFC_KNOWLEDGE.guideTopics.some((t) => t.id === id)
    );
  if (root === 'partners') return !id || id === 'request';
  if (root === 'registry') return ['ru', 'kg'].includes(id);
  return !id;
}
function cleanSitePath(route) {
  if (route.startsWith('catalog/') && route.split('/').length > 2)
    route = route.split('/').slice(0, 2).join('/');
  return route ? '/' + route.replace(/\/+$/, '') + '/' : '/';
}
function syncLegacyLocation(route) {
  if (location.hash.startsWith('#/') && isKnownSiteRoute(route))
    history.replaceState(null, '', cleanSitePath(route));
}
const VFC_PAGE_META = {
  callback: [
    'Заказать звонок',
    'Оставьте имя и телефон, чтобы обсудить оформление документов со специалистом VFC-TEST. Перезвоним в рабочее время.',
  ],
  '': [
    'Сертификация и декларирование продукции',
    'Помогаем оформить документы на продукцию для России и ЕАЭС: сертификация, декларации, испытания. Подбор требований и сопровождение оформления.',
  ],
  services: [
    'Услуги сертификации — ЕАЭС и ГОСТ Р',
    'Декларирование, сертификация, испытания, разработка ТУ, сертификат СТ-1 и нотификация ФСБ / КНБ. Подберём порядок оформления для вашей продукции.',
  ],
  catalog: [
    'Категории продукции и требования',
    '12 категорий продукции: применимые ТР ТС, ТР ЕАЭС, ГОСТ Р, виды документов и сведения для предварительного расчёта стоимости.',
  ],
  partners: [
    'Сотрудничество в сертификации',
    'Сотрудничество с брокерами, логистами, центрами и органами по сертификации, лабораториями, производителями и агентами. Запрос прайса и партнёрское обращение.',
  ],
  about: [
    'О компании VFC-TEST',
    'Как работает VFC-TEST: сопровождение оформления документов, профильные органы и лаборатории, персональный менеджер, география работы и отзывы.',
  ],
  contacts: [
    'Контакты VFC-TEST',
    'Контакты VFC-TEST: Москва, Смольная 24а, офис 1417. MAX, Telegram, WhatsApp, электронная почта и карта проезда.',
  ],
  how: [
    'Как проходит оформление документов',
    'Пять этапов работы: первичная оценка, расчёт, выбор органа и лаборатории, испытания, проверка документов в реестре и передача результата.',
  ],
  marketplaces: [
    'Документы для маркетплейсов',
    'Подготовка продукции к продажам на маркетплейсах: требования к документам, маркировке и сведениям о товаре. Помощь с выбором следующего шага.',
  ],
  request: [
    'Получить расчёт стоимости оформления',
    'Оставьте имя и контакт для расчёта оформления документов на продукцию. Описание, фотографии, PDF, Word и другие файлы можно приложить при наличии.',
  ],
  select: [
    'Помощь с выбором документов',
    'Ответьте на вопросы о товаре и планах. Поможем понять, какие сведения подготовить и с чего начать оформление документов.',
  ],
  guide: [
    'Гид по сертификации и декларациям',
    'Чем отличаются сертификат, декларация, протокол испытаний, ТУ и другие документы. Объясняем этапы оформления и обязанности участников.',
  ],
  reviews: [
    'Отзывы клиентов VFC-TEST',
    'Отзывы клиентов о сопровождении сертификации и декларирования в VFC-TEST. Читайте отзывы на независимой площадке Яндекс Карты.',
  ],
  cases: [
    'Примеры задач по сертификации',
    'Типовые задачи производителей, импортёров и поставщиков: выбор требований, организация испытаний и подготовка документов на продукцию.',
  ],
  articles: [
    'Материалы о документах на продукцию',
    'Короткие материалы о сертификации, декларировании, технических регламентах, испытаниях и подготовке к продажам.',
  ],
  privacy: [
    'Политика конфиденциальности',
    'Как VFC-TEST использует сведения из обращений и прикреплённые файлы для ответа на заявку. Контакты по вопросам обработки данных.',
  ],
  terms: [
    'Условия использования сайта',
    'Условия использования информации VFC-TEST. Состав услуги, стоимость и сроки оформления согласовываются после анализа продукции.',
  ],
  cookies: [
    'Использование файлов cookie',
    'Информация об использовании cookie и внешних сервисов на сайте VFC-TEST.',
  ],
  registry: [
    'Проверка сертификатов и деклараций',
    'Выберите официальный реестр России или Кыргызстана для проверки сертификата или декларации по регистрационному номеру.',
  ],
};
function routeSeoData(route = getSiteRoute()) {
  const [root, id] = route.split('/');
  if (!isKnownSiteRoute(route))
    return {
      title: vfcT('Страница не найдена'),
      description: vfcT('Проверьте адрес или перейдите в каталог продукции.'),
      noindex: true,
    };
  let [title, description] = VFC_PAGE_META[root || ''] || VFC_PAGE_META[''];
  if (root === 'catalog' && id) {
    title =
      vfcT(refCategories.find((c) => c[0] === id)[1]) + ' — ' + vfcT('документы и требования');
    description = VFC_CATEGORY_DETAILS[id].intro;
  } else if (root === 'services' && id) {
    title = serviceDirections[id].title;
    description = serviceDirections[id].description;
  } else if (['declaration', 'certification', 'voluntary'].includes(root)) {
    title = serviceDirections[root].title;
    description = serviceDirections[root].description;
  } else if (root === 'specifications') {
    title = serviceDirections.specifications.title;
    description = serviceDirections.specifications.description;
  } else if (root === 'guide' && id && !['compare', 'start'].includes(id)) {
    const topic = VFC_KNOWLEDGE.guideTopics.find((t) => t.id === id);
    title = topic.title;
    description = topic.intro;
  } else if (root === 'registry') {
    title = id === 'kg' ? 'Проверка документа Кыргызстана' : 'Проверка документа в Росаккредитации';
    description =
      id === 'kg'
        ? 'Поиск сертификата или декларации ТР ТС в официальном реестре Кыргызстана. Введите полный регистрационный номер документа.'
        : 'Проверка сертификатов и деклараций в реестрах Росаккредитации. Выберите вид документа и перейдите в официальный поиск.';
  } else if (root === 'partners' && id === 'request') {
    title = 'Обсудить партнёрское сотрудничество';
  }
  return {
    title: vfcT(title),
    description: vfcT(description),
    noindex: ['request', 'select', 'callback'].includes(root),
  };
}
function updateSeoMetadata() {
  const route = getSiteRoute(),
    data = routeSeoData(route);
  document.title = data.title + ' — VFC-TEST';
  const set = (key, value, property = false) => {
    let el = document.head.querySelector(`meta[${property ? 'property' : 'name'}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(property ? 'property' : 'name', key);
      document.head.append(el);
    }
    el.content = value;
  };
  set('description', data.description);
  set('robots', data.noindex ? 'noindex,follow' : 'index,follow');
  const canonical =
    VFC_SITE_ORIGIN + (isKnownSiteRoute(route) ? cleanSitePath(route) : '/404.html');
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.append(link);
  }
  link.href = canonical;
  set('og:title', document.title, true);
  set('og:description', data.description, true);
  set('og:type', 'website', true);
  set('og:url', canonical, true);
  set('og:locale', { ru: 'ru_RU', en: 'en_US', zh: 'zh_CN' }[vfcLanguage], true);
  set('twitter:card', 'summary');
  const name = route ? data.title : vfcT('Главная');
  const items = [{ name: vfcT('Главная'), item: VFC_SITE_ORIGIN + '/' }];
  if (route) items.push({ name, item: canonical });
  let schema = document.getElementById('route-structured-data');
  if (!schema) {
    schema = document.createElement('script');
    schema.id = 'route-structured-data';
    schema.type = 'application/ld+json';
    document.head.append(schema);
  }
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      ...item,
    })),
  });
}
function normalizeSiteLinks() {
  document.querySelectorAll('a[href^="#/"]').forEach((link) => {
    const route = link.getAttribute('href').slice(2);
    if (isKnownSiteRoute(route)) link.setAttribute('href', cleanSitePath(route));
  });
}
let vfcTransitionTimer;
function routeTransitionStart() {
  const bar = document.getElementById('route-progress');
  if (!bar) return;
  clearTimeout(vfcTransitionTimer);
  bar.hidden = false;
  bar.classList.remove('is-complete');
  bar.setAttribute('aria-valuenow', '20');
  document.getElementById('app').setAttribute('aria-busy', 'true');
}
function routeTransitionEnd() {
  const bar = document.getElementById('route-progress');
  document.getElementById('app').setAttribute('aria-busy', 'false');
  if (!bar) return;
  requestAnimationFrame(() => {
    bar.classList.add('is-complete');
    bar.setAttribute('aria-valuenow', '100');
    vfcTransitionTimer = setTimeout(() => {
      bar.hidden = true;
    }, 240);
  });
}
let vfcMenuOverflow = null;
function closeMobileMenu() {
  document.getElementById('navlinks').classList.remove('open');
  const button = document.getElementById('menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', vfcT('Открыть меню'));
  if (vfcMenuOverflow !== null) {
    document.body.style.overflow = vfcMenuOverflow;
    vfcMenuOverflow = null;
  }
}
function toggleMobileMenu() {
  const nav = document.getElementById('navlinks');
  if (nav.classList.contains('open')) {
    closeMobileMenu();
    return;
  }
  vfcMenuOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  nav.classList.add('open');
  document.getElementById('menu').setAttribute('aria-expanded', 'true');
  document.getElementById('menu').setAttribute('aria-label', vfcT('Закрыть меню'));
}
function setupLeadProtection(form) {
  if (form.querySelector('[name="_gotcha"]')) return;
  const trap = document.createElement('input');
  trap.type = 'text';
  trap.name = '_gotcha';
  trap.tabIndex = -1;
  trap.autocomplete = 'off';
  trap.className = 'form-bot-field';
  trap.setAttribute('aria-hidden', 'true');
  form.append(trap);
}
function showLeadSuccess() {
  const dialog = document.getElementById('lead-success-dialog');
  if (!dialog) return;
  document.querySelectorAll('dialog[open]').forEach((el) => {
    if (el !== dialog) el.close();
  });
  dialog.querySelector('[data-success-message]').textContent = vfcT(
    'Спасибо! Ваша заявка принята. Мы свяжемся с вами по указанным контактам в рабочее время.',
  );
  if (!dialog.open) dialog.showModal();
}
const VFC_TERM_DEFINITIONS = [
  [
    'Схема подтверждения',
    'Порядок проверки продукции: какие документы, испытания и другие действия нужны для оформления.',
  ],
  [
    'Аккредитация',
    'Подтверждённая компетентность органа или лаборатории выполнять определённые работы. Область аккредитации показывает, с какой продукцией они могут работать.',
  ],
  [
    'Протокол испытаний',
    'Документ лаборатории с результатами проведённых испытаний. Он служит доказательством и сам по себе не заменяет сертификат или декларацию.',
  ],
  [
    'Нотификация',
    'Уведомление о характеристиках товара с функциями шифрования. Необходимость оформления зависит от функций устройства и порядка его ввоза.',
  ],
];
function enhanceTerminology(container = document.getElementById('app')) {
  if (!container || container.querySelector('.term-help-row')) return;
  const route = getSiteRoute().split('/')[0];
  if (!['services', 'declaration', 'certification', 'voluntary', 'guide'].includes(route)) return;
  let target = container.classList.contains('svc-panel')
    ? container.querySelector('.svc-panel-top')
    : container.querySelector('.content');
  if (!target) return;
  const row = document.createElement('div');
  row.className = 'term-help-row';
  row.setAttribute('aria-label', vfcT('Термины простыми словами'));
  row.innerHTML = VFC_TERM_DEFINITIONS.map(
    ([term, text]) =>
      `<details class="term-help"><summary>${vfcT(term)} <span aria-hidden="true">i</span></summary><div>${vfcT(text)}</div></details>`,
  ).join('');
  target.append(row);
}
function finalizeRouteUI() {
  scheduleFloatingAssistant();
  enhanceMessengerLinks();
  closeMobileMenu();
  normalizeSiteLinks();
  enhanceTerminology();
  document.querySelectorAll('img').forEach((img) => {
    img.decoding = 'async';
    if (!img.hasAttribute('alt'))
      img.alt = img.closest('article,section')?.querySelector('h2,h3')?.textContent || 'VFC-TEST';
  });
  updateSeoMetadata();
  routeTransitionEnd();
  document.querySelector('.back-top')?.classList.toggle('is-shown', window.scrollY > 500);
}
function siteNotFound() {
  return `<div class="reference-page home-page"><div class="wrap"><section class="ref-section not-found"><span class="home-kicker">404</span><h1>Страница не найдена</h1><p>Проверьте адрес или перейдите в каталог продукции.</p><a class="btn" href="/catalog/">Открыть каталог</a></section></div></div>`;
}
function initSiteUX() {
  const main = document.getElementById('app');
  main.tabIndex = -1;
  document.querySelector('[data-skip-link]').addEventListener('click', (event) => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView();
  });
  document.getElementById('menu').setAttribute('aria-controls', 'navlinks');
  document
    .getElementById('lead-success-dialog')
    .querySelector('[data-success-close]')
    .addEventListener('click', () => document.getElementById('lead-success-dialog').close());
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (
      link &&
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      (!link.target || link.target === '_self')
    ) {
      const url = new URL(link.href, location.href);
      if (url.origin === location.origin && !url.hash && !link.hasAttribute('download')) {
        const route = url.pathname.replace(/^\/+|\/+$/g, '');
        if (isKnownSiteRoute(route)) {
          event.preventDefault();
          history.pushState(null, '', cleanSitePath(route));
          routeTransitionStart();
          requestAnimationFrame(render);
        }
      }
    }
    if (!event.target.closest('.header')) {
      closeMobileMenu();
      closeHeaderDropdowns();
    }
    if (!event.target.closest('.term-help'))
      document.querySelectorAll('.term-help[open]').forEach((el) => (el.open = false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (document.getElementById('navlinks').classList.contains('open')) {
        closeMobileMenu();
        document.getElementById('menu').focus();
      }
      document.querySelectorAll('.term-help[open]').forEach((el) => {
        el.open = false;
        el.querySelector('summary').focus();
      });
    }
  });
  const measure = () => {
    document.documentElement.style.setProperty(
      '--header-height',
      Math.ceil(document.querySelector('.header').getBoundingClientRect().height) + 'px',
    );
    if (getComputedStyle(document.getElementById('menu')).display === 'none') closeMobileMenu();
  };
  if ('ResizeObserver' in window)
    new ResizeObserver(measure).observe(document.querySelector('.header'));
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('popstate', () => {
    // Hash navigation is handled by hashchange; rendering twice loses lead drafts.
    if (location.hash.startsWith('#/')) return;
    routeTransitionStart();
    render();
  });
  measure();
}
