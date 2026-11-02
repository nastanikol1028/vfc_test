/* Browser-local trained text classifier. Inference never sends product queries to a server. */
let vfcProductModelPromise = null;
async function loadProductCategoryModel() {
  if (!vfcProductModelPromise)
    vfcProductModelPromise = (async () => {
      const response = await fetch('assets/product-category-model.json', {
        cache: 'force-cache',
      });
      if (!response.ok) throw Error('model_unavailable');
      const data = await response.json();
      if (
        data.version !== 1 ||
        !Array.isArray(data.classes) ||
        data.weights.length !== data.terms.length
      )
        throw Error('invalid_model');
      return {
        ...data,
        index: new Map(data.terms.map((term, i) => [term, i])),
        stops: new Set(data.stopWords),
      };
    })().catch((error) => {
      vfcProductModelPromise = null;
      throw error;
    });
  return vfcProductModelPromise;
}
function classifyProductCategory(model, text) {
  const words = (
      text
        .toLowerCase()
        .replace(/ё/g, 'е')
        .match(/[a-zа-я0-9\u3400-\u9fff]+/g) || []
    ).filter((word) => !model.stops.has(word)),
    counts = new Map();
  const add = (term) => {
    const index = model.index.get(term);
    if (index !== undefined) counts.set(index, (counts.get(index) || 0) + 1);
  };
  for (const word of words) {
    add('w:' + word);
    const padded = ' ' + word + ' ';
    for (const n of [2, 3, 4])
      for (let i = 0; i + n <= padded.length; i++) add(padded.slice(i, i + n));
  }
  if (!counts.size) return [];
  const vector = [];
  let norm = 0;
  for (const [index, count] of counts) {
    const value = (1 + Math.log(count)) * model.idf[index];
    vector.push([index, value]);
    norm += value * value;
  }
  norm = Math.sqrt(norm);
  const scores = model.bias.slice();
  for (const [index, value] of vector)
    for (let c = 0; c < scores.length; c++) scores[c] += (value / norm) * model.weights[index][c];
  const max = Math.max(...scores),
    exps = scores.map((score) => Math.exp(score - max)),
    total = exps.reduce((a, b) => a + b, 0);
  return model.classes
    .map((id, i) => ({ id, score: exps[i] / total }))
    .sort((a, b) => b.score - a.score);
}
function wireCategoryAI(categories) {
  const input = document.getElementById('ref-catalog-search');
  if (!input) return;
  const form = document.getElementById('product-smart-form'),
    result = document.getElementById('product-smart-result'),
    status = document.getElementById('ref-catalog-status'),
    empty = document.getElementById('ref-catalog-empty'),
    cards = Array.from(document.querySelectorAll('[data-catalog-search]')),
    clear = document.getElementById('product-smart-clear'),
    button = form.querySelector('button[type=submit]');
  let timer = null,
    revision = 0;
  const translate = () => {
    if (typeof vfcApplyLanguage === 'function') vfcApplyLanguage();
  };
  function showAll() {
    cards.forEach((card) => (card.hidden = false));
    empty.hidden = true;
  }
  function reset() {
    revision++;
    clear.hidden = true;
    result.replaceChildren();
    result.hidden = true;
    status.textContent = '';
    button.disabled = false;
    showAll();
    translate();
  }
  function renderSuggestions(predictions, mode) {
    result.replaceChildren();
    if (!predictions.length) {
      showAll();
      status.textContent =
        'Не удалось уверенно определить категорию. Уточните название или спросите специалиста.';
      const link = document.createElement('a');
      link.href = '#/request';
      link.className = 'home-link';
      link.textContent = 'Спросить специалиста →';
      result.append(link);
      result.hidden = false;
      translate();
      return;
    }
    const certain =
      mode === 'model' &&
      predictions[0].score >= 0.65 &&
      predictions[0].score - (predictions[1]?.score || 0) >= 0.2;
    const selected = certain
      ? predictions.slice(0, 1)
      : predictions
          .filter((p, i) => i === 0 || (p.score >= 0.15 && p.score >= predictions[0].score * 0.4))
          .slice(0, 3);
    const heading = document.createElement('h3'),
      note = document.createElement('p'),
      links = document.createElement('div'),
      all = document.createElement('button');
    heading.textContent =
      mode === 'fallback'
        ? 'Найденные категории'
        : certain
          ? 'Рекомендуемая категория'
          : selected.length === 1
            ? 'Возможная категория'
            : 'Возможные категории';
    note.textContent = certain
      ? 'Предварительный подбор по названию товара. Требования к документам уточнит специалист.'
      : 'Сравните варианты или уточните материал и назначение товара.';
    links.className = 'smart-category-links';
    for (const prediction of selected) {
      const category = categories.find((c) => c[0] === prediction.id);
      if (!category) continue;
      const link = document.createElement('a');
      link.href = '#/catalog/' + category[0];
      link.className = 'smart-category-link';
      const name = document.createElement('strong'),
        arrow = document.createElement('span');
      name.textContent = category[1];
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(name, arrow);
      links.append(link);
    }
    all.type = 'button';
    all.className = 'smart-show-all';
    all.textContent = 'Показать весь каталог';
    all.addEventListener('click', () => {
      showAll();
      status.textContent = 'Вы можете выбрать другую категорию из каталога.';
      translate();
    });
    result.append(heading, links, note, all);
    result.hidden = false;
    const chosen = new Set(selected.map((x) => x.id));
    cards.forEach(
      (card) => (card.hidden = !chosen.has(card.getAttribute('href').split('/').pop())),
    );
    empty.hidden = true;
    status.textContent = '';
    translate();
  }
  async function search() {
    const query = input.value.trim().slice(0, 400),
      token = ++revision;
    clear.hidden = !query;
    if (!query) {
      reset();
      return;
    }
    if (query.length < 2 && !/[\u3400-\u9fff]/.test(query)) {
      reset();
      return;
    }
    status.textContent = 'Подбираем категорию по названию…';
    button.disabled = true;
    result.hidden = true;
    empty.hidden = true;
    showAll();
    translate();
    try {
      const model = await loadProductCategoryModel();
      if (token !== revision || !input.isConnected) return;
      const predictions = classifyProductCategory(model, query);
      renderSuggestions(predictions[0]?.score >= 0.3 ? predictions : [], 'model');
    } catch (error) {
      if (token !== revision || !input.isConnected) return;
      const matches = cards
        .filter((card) =>
          vfcProductMatches(
            card,
            query.toLocaleLowerCase('ru').replace(/ё/g, 'е'),
            'catalogSearch',
          ),
        )
        .map((card) => ({
          id: card.getAttribute('href').split('/').pop(),
          score: 1,
        }));
      renderSuggestions(matches, 'fallback');
      if (!matches.length) {
        status.textContent =
          'Умный подбор временно недоступен. Выберите категорию из каталога или обратитесь к нам.';
        translate();
      }
    } finally {
      if (token === revision) button.disabled = false;
    }
  }
  input.addEventListener('input', () => {
    clearTimeout(timer);
    revision++;
    if (!input.value.trim()) {
      reset();
      return;
    }
    timer = setTimeout(search, 220);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(timer);
    search();
  });
  clear.addEventListener('click', () => {
    clearTimeout(timer);
    input.value = '';
    reset();
    input.focus();
  });
  document.querySelectorAll('[data-product-example]').forEach((chip) =>
    chip.addEventListener('click', () => {
      input.value = vfcT(chip.dataset.productExample);
      clearTimeout(timer);
      search();
      input.focus();
    }),
  );
}
