// features/lead-forms.js
function wirePhotoForm(form) {
  const input = form.querySelector('[data-photo-input]'),
    list = form.querySelector('[data-photo-list]'),
    error = form.querySelector('[data-photo-error]'),
    result = form.querySelector('.success'),
    drop = form.querySelector('.photo-drop'),
    counter = form.querySelector('[data-photo-count]');
  const makeItem = (file) => ({
    file,
    url: /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(file.name) ? URL.createObjectURL(file) : null,
  });
  let files = (leadDraftFiles.get(form.dataset.draftKey) || []).map(makeItem);
  const maxBytes = 20 * 1024 * 1024;
  const extensions = new Set([
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'avif',
    'heic',
    'heif',
    'bmp',
    'tif',
    'tiff',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
    'rtf',
    'odt',
  ]);
  const clearResult = () => {
    result.replaceChildren();
    result.style.display = 'none';
  };
  const release = (file) => {
    if (file.url) URL.revokeObjectURL(file.url);
  };
  function draw() {
    persistLeadFiles(
      form,
      files.map((item) => item.file),
    );
    list.replaceChildren();
    counter.textContent = files.length
      ? vfcT(
          `Файлов: ${files.length} / 10 · ${(files.reduce((n, item) => n + item.file.size, 0) / 1024 / 1024).toFixed(1)} МБ`,
        )
      : vfcT('Можно добавить до 10 файлов');
    files.forEach((item, i) => {
      const li = document.createElement('li'),
        name = document.createElement('span'),
        remove = document.createElement('button');
      if (item.url) {
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.file.name;
        li.append(img);
      } else {
        const badge = document.createElement('span');
        badge.className = 'attachment-file-kind';
        badge.textContent = item.file.name.split('.').pop().toUpperCase().slice(0, 5);
        li.append(badge);
      }
      name.textContent = item.file.name;
      name.title = item.file.name;
      name.setAttribute('data-language-ignore', '');
      name.tabIndex = 0;
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', vfcT('Удалить файл ' + item.file.name));
      remove.addEventListener('click', () => {
        release(item);
        files.splice(i, 1);
        error.textContent = '';
        clearResult();
        draw();
      });
      li.append(name, remove);
      list.append(li);
    });
  }
  function add(selected) {
    clearResult();
    const errors = [];
    for (const file of selected) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!extensions.has(ext)) {
        errors.push(
          vfcT(
            'Этот формат не поддерживается. Выберите фото, PDF, Word, Excel, презентацию или текстовый документ.',
          ),
        );
        continue;
      }
      if (
        files.some(
          (item) =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified,
        )
      )
        continue;
      if (files.length >= 10) {
        errors.push(vfcT('Можно прикрепить не больше 10 файлов.'));
        continue;
      }
      if (files.reduce((n, item) => n + item.file.size, 0) + file.size > maxBytes) {
        errors.push(vfcT('Общий размер файлов должен быть не больше 20 МБ.'));
        continue;
      }
      files.push({
        file,
        url: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'bmp'].includes(ext)
          ? URL.createObjectURL(file)
          : null,
      });
    }
    error.replaceChildren();
    [...new Set(errors)].forEach((message, index) => {
      if (index) error.append(document.createTextNode(' '));
      const span = document.createElement('span');
      span.textContent = message;
      error.append(span);
    });
    input.value = '';
    draw();
  }
  input.addEventListener('change', () => add(Array.from(input.files || [])));
  ['dragenter', 'dragover'].forEach((event) =>
    drop.addEventListener(event, (e) => {
      e.preventDefault();
      drop.classList.add('is-dragging');
    }),
  );
  ['dragleave', 'drop'].forEach((event) =>
    drop.addEventListener(event, (e) => {
      e.preventDefault();
      drop.classList.remove('is-dragging');
      if (event === 'drop' && !form.dataset.submitting) add(Array.from(e.dataTransfer.files || []));
    }),
  );
  form.addEventListener('input', (e) => {
    if (e.target !== input) clearResult();
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (
      await submitLeadForm(
        form,
        files.map((item) => item.file),
      )
    ) {
      files.forEach(release);
      files = [];
      draw();
      error.textContent = '';
    }
  });
  const previous = window._vfcPhotoCleanup;
  window._vfcPhotoCleanup = () => {
    if (previous) previous();
    files.forEach(release);
  };
  form._clearAttachments = () => {
    files.forEach(release);
    files = [];
    input.value = '';
    error.textContent = '';
    draw();
  };
  draw();
}

function buildLeadBody(data, photoCount) {
  return [
    vfcT('Здравствуйте!'),
    '',
    vfcT('Имя:') + ' ' + data.get('name'),
    vfcT('Контакт:') + ' ' + data.get('contact'),
    vfcT('Компания:') + ' ' + (data.get('company') || vfcT('не указана')),
    ...(data.get('role') ? [vfcT('Ваша роль в проекте') + ': ' + vfcT(data.get('role'))] : []),
    vfcT('Категория:') + ' ' + vfcT(data.get('category') || 'не указана'),
    vfcT('Запрос:') + ' ' + vfcT(data.get('service') || 'Нужна консультация'),
    '',
    vfcT('Описание:') + '\n' + (data.get('message') || vfcT('не указано')),
    ...(typeof photoCount === 'number' ? ['', vfcT('Фото:') + ' ' + photoCount] : []),
  ].join('\n');
}

async function submitLeadForm(form, files = []) {
  validateLeadContact(form);
  if (form.dataset.submitting || !form.reportValidity()) return false;
  const data = new FormData(form),
    result = form.querySelector('.success');
  if (String(data.get('_gotcha') || '').trim()) return false;
  const categoryInfo = refCategories.find(([id]) => id === data.get('category'));
  if (categoryInfo) {
    data.set('category_id', categoryInfo[0]);
    data.set('category', categoryInfo[1]);
  }
  const serviceInfo = serviceDirections[data.get('service')];
  if (serviceInfo) {
    data.set('service_id', data.get('service'));
    data.set('service', serviceInfo.title);
  }
  if (data.get('service') === 'marketplaces') data.set('service', 'Подготовка к маркетплейсу');
  data.set('consent_version', '2026-11-05-draft-1');
  data.set('consent_submitted_at', new Date().toISOString());
  data.set('consent_document', new URL('/consent/', location.origin).href);
  data.set('_subject', 'Заявка с сайта VFC-TEST');
  data.set('source_page', location.href);
  data.set('attachment_count', String(files.length));
  const contact = String(data.get('contact') || '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) data.set('email', contact);
  files.forEach((file) => data.append('attachment', file, file.name));
  const controls = Array.from(form.querySelectorAll('input,select,textarea,button')),
    states = controls.map((c) => c.disabled),
    button = form.querySelector('[type=submit]'),
    label = button.textContent;
  form.dataset.submitting = 'true';
  form.setAttribute('aria-busy', 'true');
  controls.forEach((c) => (c.disabled = true));
  button.textContent = vfcT('Отправляем…');
  result.style.display = 'block';
  result.textContent = vfcT('Отправляем…');
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch('https://formspree.io/f/maeelyvj', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload || payload.errors || payload.error || payload.ok === false) {
      const detail = JSON.stringify(payload || {});
      const message = /NO_FILE_UPLOADS|file uploads.*not|upgrade|paid plan/i.test(detail)
        ? 'Сервис не принял вложения. Файлы остались в форме. Можно отправить заявку без вложений и согласовать их передачу с менеджером.'
        : response.status === 429
          ? 'Слишком много заявок. Подождите немного и повторите отправку.'
          : 'Не удалось отправить заявку. Данные сохранены — попробуйте ещё раз или напишите на m1@vfc-test.ru.';
      throw new Error(message);
    }
    form.reset();
    clearLeadDraft(form);
    result.textContent = vfcT('Заявка отправлена! Мы свяжемся с вами по указанным контактам.');
    showLeadSuccess();
    return true;
  } catch (err) {
    result.textContent = vfcT(
      err.name === 'AbortError'
        ? 'Время ожидания истекло. Данные сохранены. Перед повторной отправкой проверьте, не пришло ли подтверждение.'
        : err instanceof TypeError
          ? 'Нет связи с сервисом отправки. Данные сохранены — проверьте интернет и попробуйте ещё раз.'
          : err.message,
    );
    return false;
  } finally {
    clearTimeout(timer);
    controls.forEach((c, i) => (c.disabled = states[i]));
    button.textContent = label;
    delete form.dataset.submitting;
    form.removeAttribute('aria-busy');
  }
}

function wireForms() {
  document.querySelectorAll('.lead-form').forEach((form) => {
    setupLeadProtection(form);
    setupLeadDraft(form);
    form.action = 'https://formspree.io/f/maeelyvj';
    form.method = 'post';
    form.enctype = 'multipart/form-data';
    if (form.querySelector('[data-photo-input]')) {
      wirePhotoForm(form);
      return;
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitLeadForm(form);
    });
  });
}
