/** Text stays in this tab's session storage; files stay in memory during SPA navigation. */
const leadDraftFiles = new Map();
const leadDraftPrefix = 'vfc-lead-draft:';
function leadDraftKey(form) {
  if (form.closest('.partner-price-dialog')) return 'partner-price';
  if (form.classList.contains('callback-form')) return 'callback';
  const section = getSiteRoute().split('/')[0];
  return section === 'partners' ? 'partners' : section === 'select' ? 'quiz' : 'main';
}
function readLeadDraft(key) {
  try {
    const draft = JSON.parse(sessionStorage.getItem(leadDraftPrefix + key));
    return draft && Date.now() - draft.savedAt < 24 * 60 * 60 * 1000 ? draft : null;
  } catch {
    return null;
  }
}
function captureLeadDraft(form) {
  const key = form.dataset.draftKey;
  if (!key || !form._vfcDraftReady) return;
  const fields = [...form.elements].filter(
    (field) =>
      field.name &&
      !['hidden', 'file', 'checkbox', 'submit'].includes(field.type) &&
      field.name !== '_gotcha',
  );
  const values = Object.fromEntries(fields.map((field) => [field.name, field.value]));
  const attachmentNames = (leadDraftFiles.get(key) || []).map((file) => file.name);
  const meaningful = fields.some((field) =>
    field.tagName === 'SELECT' ? field.selectedIndex > 0 : field.value.trim(),
  );
  try {
    if (!meaningful && !attachmentNames.length) sessionStorage.removeItem(leadDraftPrefix + key);
    else
      sessionStorage.setItem(
        leadDraftPrefix + key,
        JSON.stringify({ values, attachmentNames, savedAt: Date.now() }),
      );
  } catch {
    /* Browsers may disable storage; navigation still keeps attachments in memory. */
  }
}
function captureLeadDrafts() {
  document.querySelectorAll('.lead-form').forEach(captureLeadDraft);
}
function clearLeadDraft(form) {
  const key = form.dataset.draftKey;
  leadDraftFiles.delete(key);
  try {
    sessionStorage.removeItem(leadDraftPrefix + key);
  } catch {}
  form.querySelector('.lead-draft-note')?.remove();
}
function persistLeadFiles(form, files) {
  const key = form.dataset.draftKey;
  if (files.length) leadDraftFiles.set(key, files);
  else leadDraftFiles.delete(key);
  captureLeadDraft(form);
}
function validateLeadContact(form) {
  const field = form.elements.contact;
  if (!field) return true;
  const value = field.value.trim();
  const phone =
    /^\+?[\d\s().-]+$/.test(value) &&
    value.replace(/\D/g, '').length >= 7 &&
    value.replace(/\D/g, '').length <= 15;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const valid =
    !value ||
    (field.type === 'email'
      ? email
      : form.classList.contains('callback-form')
        ? phone
        : phone || email);
  field.setCustomValidity(
    valid
      ? ''
      : vfcT(
          field.type === 'email'
            ? 'Введите корректный e-mail.'
            : form.classList.contains('callback-form')
              ? 'Введите номер телефона: от 7 до 15 цифр, можно с кодом страны.'
              : 'Введите корректный телефон или e-mail.',
        ),
  );
  return valid;
}
function setupLeadDraft(form) {
  form.dataset.draftKey = leadDraftKey(form);
  form._vfcDraftReady = true;
  const draft = readLeadDraft(form.dataset.draftKey);
  if (draft) {
    for (const [name, value] of Object.entries(draft.values || {})) {
      const field = form.elements.namedItem(name);
      if (field && !['hidden', 'file', 'checkbox'].includes(field.type)) field.value = value;
    }
    if (form.querySelector('.clear-optional') && (draft.values.category || draft.values.service))
      form.querySelector('.clear-optional').open = true;
    const note = document.createElement('div');
    note.className = 'lead-draft-note';
    const label = document.createElement('span');
    label.textContent = vfcT(
      draft.attachmentNames?.length && !leadDraftFiles.get(form.dataset.draftKey)?.length
        ? 'Черновик восстановлен. После обновления страницы прикрепите файлы заново.'
        : 'Черновик восстановлен.',
    );
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.textContent = vfcT('Очистить черновик');
    clear.addEventListener('click', () => {
      form.reset();
      form._clearAttachments?.();
      clearLeadDraft(form);
      validateLeadContact(form);
    });
    note.append(label, clear);
    form.prepend(note);
  }
  form.addEventListener('input', () => {
    validateLeadContact(form);
    captureLeadDraft(form);
  });
  form.addEventListener('change', () => captureLeadDraft(form));
  form.elements.contact?.setAttribute(
    'inputmode',
    form.elements.contact.type === 'email'
      ? 'email'
      : form.classList.contains('callback-form')
        ? 'tel'
        : 'text',
  );
  validateLeadContact(form);
}
function initLeadDrafts() {
  window.addEventListener('pagehide', captureLeadDrafts);
  window.addEventListener('beforeunload', (event) => {
    captureLeadDrafts();
    if ([...leadDraftFiles.values()].some((files) => files.length)) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
}
