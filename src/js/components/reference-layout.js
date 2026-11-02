// components/reference-layout.js
const refCrumb = (name, parent = '') =>
  `<nav class="ref-crumb" aria-label="Хлебные крошки"><a href="#/">Главная</a><span aria-hidden="true">/</span>${parent ? '<a href="#/catalog">Каталог продукции</a><span aria-hidden="true">/</span>' : ''}<span aria-current="page">${name}</span></nav>`;

const refButton = (text = 'Обсудить задачу', to = 'request') =>
  `<a class="btn ref-button" href="#/${to}">${text} <span aria-hidden="true">↗</span></a>`;

const refWrap = (content) =>
  `<div class="reference-page home-page"><div class="wrap">${content}</div></div>`;

const refMarket = () =>
  `<section class="home-section home-market"><div><h2>Готовитесь к продажам на маркетплейсах?</h2><p>Начнем с товара и вашей задачи — поможем подобрать документы.</p></div><a class="home-pill" href="#/select">Подобрать документы →</a></section>`;

const refRequest = () =>
  `<section class="ref-section ref-request request-route"><div><span class="home-kicker">СЛЕДУЮЩИЙ ШАГ</span><h2>Обсудим вашу задачу</h2><p>Опишите товар и прикрепите документы в одной форме. Мы уточним требования и предложим порядок оформления.</p></div><a class="btn" href="#/request">Расскажите о вашей задаче →</a></section>`;
