/** Apply the same local brand assets to every messenger link, including phone links. */
function enhanceMessengerLinks() {
  const brands = [
    ['max.ru', 'max'],
    ['t.me', 'telegram'],
    ['wa.me', 'whatsapp'],
  ];
  document.querySelectorAll('a[href]').forEach((link) => {
    let url;
    try {
      url = new URL(link.href, location.href);
    } catch {
      return;
    }
    const brand = brands.find(([host]) => url.hostname === host);
    if (!brand) return;
    link.classList.add('messenger-link');
    if (link.querySelector('.messenger-icon')) return;
    if (link.closest('.header-messengers'))
      link.querySelectorAll('svg').forEach((icon) => icon.remove());
    const icon = document.createElement('img');
    icon.className = 'messenger-icon';
    icon.src = `assets/messengers/${brand[1]}.svg`;
    icon.alt = '';
    icon.width = 28;
    icon.height = 28;
    icon.setAttribute('aria-hidden', 'true');
    link.prepend(icon);
  });
}
