// features/document-quiz.js
function wireQuiz() {
  const root = document.querySelector('.assistant-wizard');
  if (!root) return;
  const panels = Array.from(root.querySelectorAll('[data-question]')),
    answers = ['', '', '', '', ''];
  let step = 0;
  const product = document.getElementById('wizard-product'),
    category = document.getElementById('wizard-category'),
    contact = document.getElementById('wizard-contact'),
    summary = document.getElementById('wizard-summary'),
    list = document.getElementById('wizard-answer-list');
  function applyLanguage() {
    if (typeof vfcApplyLanguage === 'function') vfcApplyLanguage();
  }
  function show(index, focus = true) {
    step = index;
    panels.forEach((panel, i) => (panel.hidden = i !== index));
    summary.hidden = true;
    contact.hidden = true;
    root.querySelector('.wizard-progress-top').hidden = false;
    root.querySelector('.wizard-progress').hidden = false;
    document.getElementById('wizard-progress-text').textContent = `Вопрос ${index + 1} из 5`;
    document.getElementById('wizard-progress-bar').style.width = ((index + 1) / 5) * 100 + '%';
    root.querySelector('[role=progressbar]').setAttribute('aria-valuenow', index + 1);
    applyLanguage();
    if (focus) {
      panels[index].querySelector('h2').focus({ preventScroll: true });
      root.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }
  function finish() {
    panels.forEach((panel) => (panel.hidden = true));
    summary.hidden = false;
    contact.hidden = false;
    root.querySelector('.wizard-progress-top').hidden = true;
    root.querySelector('.wizard-progress').hidden = true;
    list.replaceChildren();
    assistantQuestions.forEach((q, i) => {
      const dt = document.createElement('dt'),
        dd = document.createElement('dd');
      dt.textContent = q.title;
      dd.textContent = answers[i];
      list.append(dt, dd);
    });
    const message = contact.querySelector('[name=message]');
    message.value = assistantQuestions
      .map((q, i) => `${vfcT(q.title)}\n${vfcT(answers[i])}`)
      .join('\n\n');
    if (category.value) {
      const field = contact.querySelector('[name=category]');
      const name = refCategories.find((x) => x[0] === category.value)?.[1];
      if (field && name) {
        let option = Array.from(field.options).find(
          (o) => o.value === name || o.textContent === name || o.textContent === vfcT(name),
        );
        if (option) field.value = option.value;
      }
    }
    applyLanguage();
    summary.querySelector('h2').focus({ preventScroll: true });
    root.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }
  panels.forEach((panel, i) => {
    panel.querySelectorAll('[data-answer]').forEach((button) =>
      button.addEventListener('click', () => {
        answers[i] = button.dataset.answer;
        panel
          .querySelectorAll('[data-answer]')
          .forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
        panel.querySelector('[data-wizard-error]').textContent = '';
      }),
    );
    panel.querySelector('[data-wizard-next]').addEventListener('click', () => {
      if (i === 0) answers[0] = product.value.trim();
      if (!answers[i]) {
        panel.querySelector('[data-wizard-error]').textContent =
          i === 0 ? 'Напишите, что за товар.' : 'Выберите один из вариантов.';
        applyLanguage();
        if (i === 0) product.focus();
        return;
      }
      panel.querySelector('[data-wizard-error]').textContent = '';
      if (i === 4) finish();
      else show(i + 1);
    });
    panel
      .querySelector('[data-wizard-back]')
      .addEventListener('click', () => show(Math.max(0, i - 1)));
  });
  document.getElementById('wizard-edit').addEventListener('click', () => show(0));
  show(0, false);
}
