// components/page-shell.js
const A = (href, text, cls = 'textlink') => `<a class="${cls}" href="#/${href}">${text}</a>`;

const photo = (file, alt) =>
  `<div class="photo"><img loading="lazy" src="${OLD}${file}" alt="${alt}"></div>`;

const cta = (
  title = 'Готовы обсудить вашу задачу?',
  text = 'Расскажите о продукции — подскажем, с чего начать и какие документы могут понадобиться.',
) =>
  `<div class="cta-band"><div><h2>${title}</h2><p>${text}</p></div><a class="btn" href="#/request">Обсудить задачу <span>→</span></a></div>`;

const crumb = (label) =>
  `<nav class="crumbs" aria-label="Хлебные крошки"><a href="#/">Главная</a><span aria-hidden="true">›</span>${['Декларирование продукции', 'Сертификация продукции', 'Добровольная сертификация', 'Разработка ТУ', 'Маркетплейсы'].includes(label) ? '<a href="#/services">Услуги</a><span aria-hidden="true">›</span>' : ''}<span aria-current="page">${label}</span></nav>`;

const pageHero = (label, title, desc) =>
  `<div class="page-hero"><div class="wrap">${crumb(label)}<div class="page-hero-row"><div><div class="eyebrow">VFC-TEST</div><h1 class="page-title">${title}</h1></div><p>${desc}</p></div></div></div>`;
