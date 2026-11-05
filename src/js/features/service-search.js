// features/service-search.js
function syncServiceTabOrientation() {
  document
    .querySelector('.svc-tabs')
    ?.setAttribute(
      'aria-orientation',
      window.matchMedia('(max-width: 760px)').matches ? 'vertical' : 'horizontal',
    );
}

function wireServices() {
  const panel = document.getElementById('svc-panel');
  if (!panel) return;
  const tabs = Array.from(document.querySelectorAll('[data-service]'));
  syncServiceTabOrientation();
  function activate(key, focus = false, syncAddress = true) {
    if (syncAddress && getSiteRoute() !== 'services/' + key) {
      history.pushState(null, '', cleanSitePath('services/' + key));
    }
    const d = serviceDirections[key];
    const factors = document.querySelector('.svc-factors');
    if (factors) factors.hidden = key === 'specifications';
    tabs.forEach((t) => {
      const selected = t.dataset.service === key;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      if (selected && focus) t.focus();
    });
    panel.setAttribute('aria-labelledby', 'svc-tab-' + key);
    panel.innerHTML = `<div class="svc-panel-top"><span class="home-kicker">СОПРОВОЖДЕНИЕ НА КАЖДОМ ЭТАПЕ</span><h2>${d.title}</h2><p>${d.description}</p></div>${key === 'voluntary' ? voluntaryTypesBlock() : ''}<div class="svc-detail-grid ${['declaration', 'certification'].includes(key) ? '' : 'svc-detail-text'}">${['declaration', 'certification'].includes(key) ? serviceRegistryForm(key) : ''}<div class="svc-details"><div><h3>Кому подойдет</h3><p>${d.audience}</p></div><div><h3>Что берем на себя</h3><p>${d.work}</p></div><div><h3>Что подготовить</h3><p>${d.documents}</p></div><a href="#/request" class="btn svc-estimate">Получить предварительный расчет ↗</a></div></div>`;
    wireRegistry();
    enhanceTerminology(panel);
    normalizeSiteLinks();
    if (typeof vfcApplyLanguage === 'function') vfcApplyLanguage();
    updateSeoMetadata();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t.dataset.service));
    t.addEventListener('keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault();
      activate(tabs[next].dataset.service, true);
    });
  });
  activate(
    serviceDirections[getSiteRoute().split('/')[1]] ? getSiteRoute().split('/')[1] : 'declaration',
    false,
    false,
  );
  const form = document.getElementById('svc-search'),
    input = document.getElementById('svc-search-input'),
    cards = Array.from(document.querySelectorAll('.svc-product-card')),
    result = document.getElementById('svc-search-results'),
    status = document.getElementById('svc-search-status'),
    links = document.getElementById('svc-search-links'),
    empty = document.getElementById('svc-no-products');
  let revision = 0,
    timer;
  const translate = () => {
    if (typeof vfcApplyLanguage === 'function') vfcApplyLanguage();
  };
  const normal = (text) => text.toLowerCase().replace(/ё/g, 'е').trim();
  const serviceWords = {
    origin: ['ст-1', 'ст 1', 'ст1', 'ct-1', 'st-1', 'происхожд', 'origin certificate', '原产地'],
    notification: [
      'нотификац',
      'фсб',
      'кнб',
      'кмб',
      'гкнб',
      'notification',
      'fsb',
      'knb',
      '加密通知',
    ],
    declaration: ['деклар', 'declar', '声明'],
    certification: ['сертификац', 'сертификат', 'certif', '认证', '证书'],
    voluntary: ['доброволь', 'voluntary', '自愿'],
    testing: ['испытан', 'протокол', 'testing', 'test', '检测'],
    specifications: ['разработка ту', 'технические условия', 'technical specification', '技术规范'],
  };
  async function search() {
    const query = normal(input.value).slice(0, 400),
      token = ++revision;
    links.replaceChildren();
    result.hidden = !query;
    empty.hidden = true;
    if (!query) {
      cards.forEach((card) => (card.hidden = false));
      status.textContent = '';
      return;
    }
    status.textContent = vfcT('Ищем товар или услугу…');
    const direction =
      query.includes('доброволь') || query.includes('voluntary') || query.includes('自愿')
        ? 'voluntary'
        : Object.keys(serviceWords).find((key) =>
            serviceWords[key].some((word) => query.includes(word)),
          );
    let found = cards.filter((card) => vfcProductMatches(card, query, 'search'));
    if (!found.length && !direction && query.length >= 2) {
      try {
        const model = await loadProductCategoryModel();
        if (token !== revision || !input.isConnected) return;
        const predictions = classifyProductCategory(model, query);
        if (predictions[0]?.score >= 0.4) {
          const best = predictions
            .filter((p, i) => i === 0 || (p.score >= 0.15 && p.score >= predictions[0].score * 0.4))
            .slice(0, 3);
          found = cards.filter((card) =>
            best.some((p) => card.getAttribute('href') === '#/catalog/' + p.id),
          );
        }
      } catch {}
    }
    if (token !== revision || !input.isConnected) return;
    const add = (text, href) => {
      const link = document.createElement('a');
      link.className = 'home-link';
      link.textContent = text;
      link.href = href;
      links.append(link);
      return link;
    };
    if (direction) {
      activate(direction);
      const link = add(serviceDirections[direction].title, '#/services');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        activate(direction);
        panel.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        });
      });
    }
    found.forEach((card) =>
      add(
        refCategories.find((c) => card.getAttribute('href') === '#/catalog/' + c[0])[1] + ' →',
        card.getAttribute('href'),
      ),
    );
    cards.forEach(
      (card) => (card.hidden = direction && !found.length ? false : !found.includes(card)),
    );
    empty.hidden = !!(found.length || direction);
    status.textContent = direction
      ? vfcT('Найдено направление. Откройте описание услуги ниже.')
      : found.length
        ? vfcT('Найдено категорий: ' + found.length)
        : vfcT(
            'Не нашли точного совпадения. Уточните название товара или обратитесь к специалисту.',
          );
    if (!found.length && !direction) add('Обсудить продукцию →', '#/request');
    translate();
  }
  input.addEventListener('input', () => {
    revision++;
    clearTimeout(timer);
    if (!input.value.trim()) {
      search();
      return;
    }
    timer = setTimeout(search, 180);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(timer);
    search();
  });
}
