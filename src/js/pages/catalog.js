// pages/catalog.js
const refCatalog = () =>
  refWrap(
    `${refCrumb('Каталог продукции')}<section class="ref-intro"><h1>Какая у вас продукция?</h1><p>Выберите категорию — расскажем, какие документы могут понадобиться и с чего начать оформление.</p><div class="ref-search-row"><form id="product-smart-form" class="ref-search smart-search-form" role="search"><label class="svc-sr-only" for="ref-catalog-search">Название товара для подбора категории</label><span aria-hidden="true" class="smart-search-icon">✧</span><input id="ref-catalog-search" type="search" placeholder="Напишите товар: например, ваза, свитер или крем" maxlength="400" autocomplete="off" aria-describedby="product-smart-hint ref-catalog-status"><button type="button" id="product-smart-clear" aria-label="Очистить поиск" hidden>×</button><button type="submit" class="smart-search-submit">Подобрать категорию →</button></form><a href="#/request">Не нашли свой товар? Поможем разобраться →</a></div><div class="smart-search-help"><p id="product-smart-hint">Введите обычное название товара — предложим подходящую категорию.</p><div class="smart-example-chips" aria-label="Примеры товаров">${[
      ['ваза', 'Ваза'],
      ['свитер', 'Свитер'],
      ['провод', 'Провод'],
      ['крем', 'Крем'],
    ]
      .map((x) => `<button type="button" data-product-example="${x[0]}">${x[1]}</button>`)
      .join(
        '',
      )}</div></div><div id="product-smart-result" class="smart-product-result" hidden aria-live="polite"></div></section><section class="ref-section"><p id="ref-catalog-status" role="status" aria-live="polite"></p><div class="ref-catalog-grid">${refCategories.map((x) => `<a href="#/catalog/${x[0]}" class="ref-category" data-catalog-search="${x[1]} ${x[2]}"><img src="assets/category-${x[0]}.webp" alt="${x[1]}" loading="lazy" width="418" height="235"><h3>${x[1]} <span>→</span></h3></a>`).join('')}</div><div id="ref-catalog-empty" class="ref-empty" hidden><p>Товар не найден. Пришлите описание — поможем определить требования.</p><a class="home-link" href="#/request">Обсудить задачу →</a></div></section><section class="ref-section ref-missing"><h2>Товара нет в каталоге?</h2><p>Пришлите название, фото или описание. Проверим, можем ли помочь, и предложим порядок работы.</p><a href="#/request" class="home-link">Обсудить задачу →</a></section>${refMarket()}${refRequest()}`,
  );
