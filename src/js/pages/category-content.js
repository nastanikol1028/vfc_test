function categoryProductPhoto(product) {
  const drawing = categoryIconDrawings[categoryIconMapping[product.image]];
  return `<div class="category-icon-panel refined-icon-panel"><svg class="category-product-icon refined-product-icon" viewBox="0 0 144 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.title}"><ellipse cx="72" cy="105" rx="34" ry="3" fill="#dceaf5" opacity=".6"/><g transform="translate(24 10)" fill="none" stroke="#377aa9" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">${drawing}</g></svg></div>`;
}

function categoryPage(id) {
  const info = VFC_CATEGORY_DETAILS[id],
    category = refCategories.find((c) => c[0] === id);
  if (!info || !category) return null;
  const photo = (product) =>
    product.image.includes('.')
      ? 'assets/' + product.image
      : 'assets/category-details/' + product.image + '.webp';
  return refWrap(
    `${refCrumb(category[1], true)}<section class="ref-hero ref-clothing-hero"><div><span class="home-kicker">КАТЕГОРИИ ПРОДУКЦИИ</span><h1>${category[1]}</h1><p>${info.intro}</p>${refButton('Получить предварительный расчет')}<small>Для производителей, импортеров и поставщиков</small></div><img src="assets/category-${id}.webp" alt="${category[1]}" width="1536" height="1024"></section><nav class="category-page-nav" aria-label="Разделы категории"><a href="#/catalog/${id}/requirements" data-category-section="requirements">Применимые требования</a><a href="#/catalog/${id}/products" data-category-section="products">С какой продукцией помогаем</a><a href="#/catalog/${id}/estimate" data-category-section="estimate">Что нужно для предварительного расчета</a></nav><section class="ref-section category-requirements" id="category-requirements"><h2>Какие документы могут понадобиться</h2><p class="category-scope-note">Ниже приведены основные документы для этой категории. Не все они применяются одновременно: точный перечень определяем по назначению, составу, возрастной группе и характеристикам товара.</p>${info.note ? `<div class="category-child-note"><h3>Детская мебель</h3><p>${info.note}</p></div>` : ''}<div class="category-regulation-list">${info.regulations
      .map((key) => {
        const r = VFC_CATEGORY_REGULATIONS[key];
        return `<a class="category-regulation" href="${r.url}" target="_blank" rel="noopener noreferrer"><span>${r.code}</span><div><h3>${r.title}</h3><small>Открыть документ ↗</small></div></a>`;
      })
      .join(
        '',
      )}</div><div class="ref-two ref-document-options category-document-grid">${info.documents
      .map((key) => {
        const d = VFC_CATEGORY_DOCUMENTS[key];
        return `<article><h3>${d.title}</h3><p>${info.documentNotes?.[key] || d.text}</p><a class="home-link" href="${d.href}">Подробнее →</a></article>`;
      })
      .join(
        '',
      )}</div></section><section class="ref-section" id="category-products"><h2>С какой продукцией помогаем</h2><div class="ref-three ref-textile-types category-product-types">${info.products
      .map(
        (product, i) =>
          `<article>${categoryProductPhoto(product)}<div class="category-product-body"><span class="category-product-number">0${i + 1}</span><h3>${product.title}</h3><p>${product.description}</p><div class="category-product-regulations">${product.regulations
            .map((key) => {
              const r = VFC_CATEGORY_REGULATIONS[key];
              return `<a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.code} ↗</a>`;
            })
            .join(
              '',
            )}</div><a class="category-product-cta" href="#/request" data-product-request="${product.title}" data-product-category="${id}">Обсудить этот товар <span aria-hidden="true">↗</span></a></div></article>`,
      )
      .join(
        '',
      )}</div><p class="category-products-note">Примеры продукции для предварительного выбора. Точные требования определяем по характеристикам товара.</p><a class="category-official-link" href="https://eec.eaeunion.org/comission/department/deptexreg/tr/TR_general.php" target="_blank" rel="noopener noreferrer">Официальный перечень регламентов ЕЭК ↗</a></section><section class="ref-section category-estimate" id="category-estimate"><h2>Что нужно для<br>предварительного расчета</h2><ul>${info.inputs.map((text) => `<li>${text}</li>`).join('')}</ul><p>Для предварительной оценки достаточно имеющихся сведений. Недостающие документы и образцы согласуем отдельно.</p>${refButton('Обсудить эту продукцию')}</section><section class="ref-section"><h2>Как пройдет работа</h2><div class="ref-four ref-work-steps">${[
      ['Изучим продукцию', 'Определим требования и исходные данные.'],
      ['Согласуем условия', 'Подберем исполнителей, обсудим стоимость и сроки.'],
      ['Оформление документа', 'Проведём необходимые испытания для оформления документа.'],
      ['Готовый документ', 'Выдадим готовый документ с публикацией в реестре.'],
    ]
      .map((x, i) => `<article><strong>0${i + 1}</strong><h3>${x[0]}</h3><p>${x[1]}</p></article>`)
      .join('')}</div></section>${refFaq()}${refMarket()}${refRequest()}`,
  );
}
function wireCategorySections() {
  document.querySelectorAll('[data-product-request]').forEach((link) =>
    link.addEventListener('click', () => {
      const category = refCategories.find((item) => item[0] === link.dataset.productCategory);
      assistantLeadDraft = {
        id: category[0],
        category: category[1],
        goal: link.dataset.productRequest,
        role: 'Нужна консультация',
      };
    }),
  );
  document.querySelectorAll('[data-category-section]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById('category-' + link.dataset.categorySection);
      target?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }),
  );
}
