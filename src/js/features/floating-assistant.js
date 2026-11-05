/** Keep the helper available without covering links or form controls underneath it. */
let floatingAssistantFrame = 0;
function updateFloatingAssistant() {
  floatingAssistantFrame = 0;
  const floating = document.querySelector('.floating');
  if (!floating || floating.classList.contains('hidden')) return;
  const bounds = floating.getBoundingClientRect();
  const editing = document.activeElement?.matches('input,textarea,select');
  const dialogOpen = !!document.querySelector('dialog[open]');
  const targets = document.querySelectorAll(
    '#app a, #app button, #app input, #app textarea, #app select, #app summary, #app label, #app .home-stats, .reference-footer a',
  );
  const overlaps = [...targets].some((target) => {
    const r = target.getBoundingClientRect();
    return (
      r.width > 0 &&
      r.height > 0 &&
      r.right > bounds.left - 8 &&
      r.left < bounds.right + 8 &&
      r.bottom > bounds.top - 8 &&
      r.top < bounds.bottom + 8
    );
  });
  floating.classList.toggle('is-obscuring-control', editing || dialogOpen || overlaps);
}
function scheduleFloatingAssistant() {
  if (!floatingAssistantFrame)
    floatingAssistantFrame = requestAnimationFrame(updateFloatingAssistant);
}
function initFloatingAssistant() {
  window.addEventListener('scroll', scheduleFloatingAssistant, { passive: true });
  window.addEventListener('resize', scheduleFloatingAssistant, { passive: true });
  document.addEventListener('focusin', scheduleFloatingAssistant);
  document.addEventListener('focusout', scheduleFloatingAssistant);
  document.addEventListener('toggle', scheduleFloatingAssistant, true);
  document
    .querySelectorAll('dialog')
    .forEach((dialog) => dialog.addEventListener('close', scheduleFloatingAssistant));
  if ('MutationObserver' in window)
    new MutationObserver(scheduleFloatingAssistant).observe(document.getElementById('app'), {
      childList: true,
      subtree: true,
    });
  scheduleFloatingAssistant();
}
