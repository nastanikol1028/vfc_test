// pages/services.js
const services = () =>
  `<div class="services-view home-page"><div class="wrap"><nav class="svc-breadcrumb" aria-label="Хлебные крошки"><a href="#/">Главная</a><span aria-hidden="true">/</span><span aria-current="page">Услуги</span></nav><section class="svc-intro"><span class="home-kicker">УСЛУГИ VFC-TEST</span><h1>Подберем документы<br>для вашей продукции</h1><p>Помогаем производителям, импортёрам и поставщикам разобраться с требованиями к продукции. Подбираем профильные органы и лаборатории, готовим документы и сопровождаем работу на каждом этапе.</p><div class="svc-search-row"><form role="search" id="svc-search"><label for="svc-search-input" class="svc-sr-only">Товар или услуга: например, ваза, крем, декларация</label><span aria-hidden="true">⌕</span><input id="svc-search-input" type="search" placeholder="Товар или услуга: например, ваза, крем, декларация" autocomplete="off"><button type="submit" aria-label="Найти продукцию">→</button></form><a class="home-link" href="#/select">Не знаю, какие документы нужны →</a></div><div id="svc-search-results" class="svc-search-results" hidden><p id="svc-search-status" class="svc-search-status" role="status" aria-live="polite"></p><div id="svc-search-links"></div></div></section>${knowledgeGuideBanner()}<section class="svc-task"><h2 id="svc-task-heading">Какая задача у вас сейчас?</h2><div class="svc-tabs" role="tablist" aria-labelledby="svc-task-heading">${[
    ['declaration', 'Декларирование · ЕАЭС / ГОСТ Р'],
    ['certification', 'Сертификация · ЕАЭС / ГОСТ Р'],
    ['voluntary', 'Добровольная сертификация'],
    ['testing', 'Испытания'],
    ['specifications', 'Разработка ТУ'],
    ['origin', 'Сертификат СТ-1'],
    ['notification', 'Нотификация ФСБ / КНБ'],
  ]
    .map(
      (x, i) =>
        `<a href="/services/${x[0]}/" role="tab" id="svc-tab-${x[0]}" aria-controls="svc-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-service="${x[0]}">${x[1]}</a>`,
    )
    .join(
      '',
    )}</div><p class="svc-hint">Выберите направление — информация откроется здесь</p></section><section class="svc-panel" id="svc-panel" role="tabpanel" aria-labelledby="svc-tab-declaration" tabindex="0"></section><section class="svc-factors"><h2>От чего зависят стоимость и сроки</h2><div class="svc-factor-grid">${[
    [
      '01',
      'Характеристики продукции',
      'Учитываем назначение, состав, материалы и количество наименований товара.',
    ],
    [
      '02',
      'Объём испытаний',
      'Определяем, какие показатели нужно проверить и сколько образцов потребуется.',
    ],
    [
      '03',
      'Готовность документов',
      'Проверяем исходные данные и уточняем, что нужно дополнить или подготовить.',
    ],
  ]
    .map((x) => `<article><span>${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`)
    .join(
      '',
    )}</div></section><section class="svc-products" id="svc-products"><div class="svc-products-heading"><h2>Выберите вашу продукцию</h2><a class="home-link" href="#/catalog">Весь каталог →</a></div><div class="svc-product-grid">${refCategories.map((x) => `<a class="svc-product-card" href="#/catalog/${x[0]}" data-search="${x[2]}"><img src="assets/category-${x[0]}.webp" alt="${x[1]}" loading="lazy"><h3>${x[1]} <span>→</span></h3></a>`).join('')}</div><div id="svc-no-products" class="svc-no-products" hidden><p>Такого товара пока нет среди представленных категорий. Оставьте название — поможем разобраться.</p><a class="home-link" href="#/request">Обсудить продукцию →</a></div><a class="btn home-catalog" href="#/catalog">Перейти к каталогу продукции</a></section><section class="home-section home-market"><div><h2>Готовитесь к продажам на маркетплейсах?</h2><p>Начнем с товара и вашей задачи — поможем подобрать документы.</p></div><a class="home-pill" href="#/select">Подобрать документы →</a></section>${refRequest()}</div></div>`;
