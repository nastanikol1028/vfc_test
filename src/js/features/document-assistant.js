// features/document-assistant.js
let assistantLeadDraft = null;

function applyAssistantLead() {
  if (!assistantLeadDraft) return;
  const form = document.querySelector('.photo-lead-form');
  if (!form) return;
  const data = assistantLeadDraft;
  const message = form.querySelector('[name=message]');
  if (message)
    message.value = [
      vfcT('Подбор документов'),
      vfcT('Категория:') + ' ' + vfcT(data.category),
      ...(data.product ? [vfcT('Товар:') + ' ' + data.product] : []),
      vfcT(data.goal),
      vfcT(data.role),
    ].join('\n');
  const category = form.querySelector('[name=category]');
  if (category) {
    const match = Array.from(category.options || []).find(
      (option) =>
        option.value === data.id ||
        option.value === data.category ||
        option.textContent === vfcT(data.category),
    );
    if (match) category.value = match.value;
  }
  assistantLeadDraft = null;
}

function initDocumentAssistant() {
  const dialog = document.getElementById('document-assistant'),
    open = document.getElementById('document-assistant-open');
  if (!dialog || !open) return;
  const body = dialog.querySelector('.document-assistant-body'),
    footer = dialog.querySelector('footer'),
    progress = dialog.querySelector('[role=progressbar]');
  let step = 0,
    answers = ['', '', ''],
    productName = '',
    savedOverflow = '';
  const goals = [
      'Продажа в России и ЕАЭС',
      'Запуск на маркетплейсе',
      'Проверка готовых документов',
    ],
    roles = ['Производим сами', 'Импортируем', 'Покупаем у поставщика', 'Пока изучаем вопрос'];
  const categories = () => [...refCategories, ['other', 'Другая продукция']];
  const label = () => categories().find((c) => c[0] === answers[0])?.[1] || 'Другая продукция';
  const translate = () => {
    if (typeof vfcApplyLanguage === 'function') vfcApplyLanguage();
  };
  const close = () => dialog.close();
  function button(text, action, className = '') {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = text;
    el.className = className;
    el.addEventListener('click', action);
    return el;
  }
  function navigate(href) {
    close();
    location.hash = href;
  }
  function draw() {
    body.replaceChildren();
    footer.replaceChildren();
    body.scrollTop = 0;
    progress.setAttribute('aria-valuenow', String(Math.min(step + 1, 3)));
    progress.firstElementChild.style.width = (step === 3 ? 100 : ((step + 1) / 4) * 100) + '%';
    const title = document.createElement('h2');
    title.id = 'assistant-modal-title';
    title.tabIndex = -1;
    title.textContent = [
      'Какая у вас продукция?',
      'Что планируете сделать?',
      'Как вы работаете с товаром?',
      'У вас уже есть отправная точка',
    ][step];
    const hint = document.createElement('p');
    hint.className = 'document-assistant-hint';
    hint.textContent = [
      'Напишите конкретный товар или выберите ближайшую категорию. Если не знаете категорию — выберите «Другая продукция».',
      'Так мы предложим подходящий раздел и следующий шаг.',
      'Подскажем, какие исходные сведения подготовить.',
      'Вот что поможет начать разговор со специалистом.',
    ][step];
    body.append(title, hint);
    if (step === 0) {
      const entry = document.createElement('div');
      entry.className = 'assistant-product-entry';
      const label = document.createElement('label');
      label.htmlFor = 'assistant-specific-product';
      label.textContent = 'Какой именно у вас товар?';
      const input = document.createElement('input');
      input.id = 'assistant-specific-product';
      input.type = 'text';
      input.maxLength = 500;
      input.autocomplete = 'off';
      input.placeholder = 'Например: керамическая ваза или детский стул';
      input.value = productName;
      const next = button(
        'Продолжить с этим товаром →',
        () => {
          productName = input.value.trim();
          if (!productName) return;
          if (!answers[0]) answers[0] = 'other';
          step = 1;
          draw();
        },
        'btn assistant-product-next',
      );
      next.disabled = !productName.trim();
      input.addEventListener('input', () => {
        productName = input.value;
        next.disabled = !productName.trim();
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && productName.trim()) {
          event.preventDefault();
          next.click();
        }
      });
      const note = document.createElement('small');
      note.textContent = 'Или выберите подходящую категорию ниже.';
      entry.append(label, input, next, note);
      body.append(entry);
    }
    if (step < 3) {
      const options = document.createElement('div');
      options.className = 'document-assistant-options' + (step === 0 ? ' is-categories' : '');
      const values = step === 0 ? categories() : (step === 1 ? goals : roles).map((x) => [x, x]);
      values.forEach(([value, text]) => {
        const option = button(
          text,
          () => {
            answers[step] = value;
            step++;
            draw();
          },
          'document-assistant-option',
        );
        option.setAttribute('aria-pressed', String(answers[step] === value));
        const arrow = document.createElement('span');
        arrow.textContent = '↗';
        arrow.setAttribute('aria-hidden', 'true');
        option.append(arrow);
        options.append(option);
      });
      body.append(options);
    } else {
      const summary = document.createElement('div');
      summary.className = 'document-assistant-summary';
      const kicker = document.createElement('small');
      kicker.textContent = 'ВАША ПРОДУКЦИЯ';
      const name = document.createElement('h3');
      name.textContent = productName.trim() || label();
      const goal = document.createElement('p');
      goal.textContent = answers[1];
      const role = document.createElement('p');
      role.textContent = answers[2];
      summary.append(kicker, name, goal, role);
      if (productName.trim()) {
        const category = document.createElement('small');
        category.textContent = label();
        summary.insertBefore(category, goal);
      }
      body.append(summary);
      const heading = document.createElement('h3');
      heading.textContent = 'Подготовьте для консультации';
      body.append(heading);
      const details = {
        packaging: [
          'Материал и назначение упаковки',
          'Контакт с пищевой продукцией',
          'Сведения об изготовителе',
        ],
        food: [
          'Наименование и состав продукции',
          'Условия хранения и срок годности',
          'Сведения об изготовителе',
        ],
        beauty: [
          'Назначение и состав продукции',
          'Этикетка и сведения об изготовителе',
          'Фотографии упаковки',
        ],
        furniture: [
          'Назначение и материалы мебели',
          'Возрастная группа: взрослая или детская',
          'Модельный ряд и сведения об изготовителе',
        ],
      };
      let needs =
        answers[1] === goals[2]
          ? [
              'Полный номер сертификата или декларации',
              'Копия документа или ссылка на запись в реестре',
              'Сведения о продукции и изготовителе',
            ]
          : details[answers[0]] || [
              'Наименование, назначение и код ТН ВЭД — если известен',
              'Описание, паспорт, этикетка или фотографии',
              'Сведения об изготовителе',
            ];
      const list = document.createElement('ul');
      needs.forEach((text) => {
        const li = document.createElement('li');
        li.textContent = text;
        list.append(li);
      });
      body.append(list);
      body.append(
        button(
          'Обсудить мой товар',
          () => {
            assistantLeadDraft = {
              id: answers[0],
              category: label(),
              product: productName.trim(),
              goal: answers[1],
              role: answers[2],
            };
            step = 0;
            answers = ['', '', ''];
            productName = '';
            navigate('#/request');
          },
          'btn document-assistant-primary',
        ),
      );
      if (answers[1] === goals[2]) {
        const link = document.createElement('a');
        link.href = '#/registry/ru';
        link.textContent = 'Перейти к проверке документа →';
        link.className = 'document-assistant-link';
        link.addEventListener('click', close);
        body.append(link);
      } else if (answers[0] !== 'other') {
        const link = document.createElement('a');
        link.href = '#/catalog/' + answers[0];
        link.textContent = 'Открыть страницу моей продукции';
        link.className = 'document-assistant-link';
        link.addEventListener('click', close);
        body.append(link);
      }
      const note = document.createElement('p');
      note.className = 'document-assistant-note';
      note.textContent =
        'Предварительный маршрут по вашим ответам. Перечень документов, стоимость и сроки уточнит специалист.';
      body.append(note);
    }
    if (step > 0)
      footer.append(
        button('← Назад', () => {
          step--;
          draw();
        }),
      );
    const count = document.createElement('span');
    count.textContent = step === 3 ? 'Ваш следующий шаг' : `Вопрос ${step + 1} / 3`;
    footer.append(count);
    if (step === 3)
      footer.append(
        button('Начать заново', () => {
          step = 0;
          answers = ['', '', ''];
          productName = '';
          draw();
        }),
      );
    translate();
    title.focus({ preventScroll: true });
  }
  open.addEventListener('click', () => {
    if (dialog.open) return;
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    draw();
  });
  dialog.querySelector('[data-assistant-close]').addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = savedOverflow;
    open.focus({ preventScroll: true });
  });
}
