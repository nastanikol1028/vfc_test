/** Preserve the regular presentation while providing older engines with dialog methods. */
function ensureDialogSupport(dialog) {
  if (!dialog || typeof dialog.showModal === 'function') return;
  dialog.classList.add('legacy-dialog');
  if (!Object.getOwnPropertyDescriptor(dialog, 'open'))
    Object.defineProperty(dialog, 'open', {
      get() {
        return this.hasAttribute('open');
      },
      set(value) {
        this.toggleAttribute('open', !!value);
      },
    });
  let previous, backdrop;
  const focusable = () =>
    Array.from(dialog.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')).filter(
      (e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length,
    );
  const onKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (dialog.dispatchEvent(new Event('cancel', { cancelable: true }))) dialog.close();
    }
    if (event.key === 'Tab') {
      const items = focusable(),
        first = items[0],
        last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  dialog.showModal = function () {
    if (this.open) return;
    previous = document.activeElement;
    backdrop = document.createElement('div');
    backdrop.className = 'legacy-dialog-backdrop';
    backdrop.addEventListener('click', () => this.close());
    document.body.appendChild(backdrop);
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('open', '');
    this.tabIndex = -1;
    document.addEventListener('keydown', onKey, true);
    (focusable()[0] || this).focus();
  };
  dialog.close = function () {
    if (!this.open) return;
    this.removeAttribute('open');
    if (backdrop) backdrop.remove();
    document.removeEventListener('keydown', onKey, true);
    this.dispatchEvent(new Event('close'));
    if (previous && previous.getClientRects().length) previous.focus();
  };
}
function ensureAllDialogs() {
  document.querySelectorAll('dialog').forEach(ensureDialogSupport);
}
function applyLegacyCssClasses() {
  document
    .querySelectorAll('.ref-search-row')
    .forEach((e) =>
      e.classList.toggle('has-smart-search', !!e.querySelector('.smart-search-form')),
    );
  document
    .querySelectorAll('.category-product-types article')
    .forEach((e) =>
      e.classList.toggle('has-category-icon', !!e.querySelector('.category-icon-panel')),
    );
  document
    .querySelectorAll('.page-hero-row')
    .forEach((e) =>
      e.classList.toggle('has-request-after', !!e.nextElementSibling?.matches('.clear-request')),
    );
}
