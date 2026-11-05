function refineGuidePage() {
  const [root, id] = getSiteRoute().split('/');
  if (root !== 'guide' || !id) return;
  const body = document.querySelector('.kb-guide-body');
  const selected = body?.querySelector('#guide-' + id);
  if (!selected) return;
  const title = selected.querySelector('h2').textContent;
  document.querySelector('.kb-hero h1').textContent = title;
  document.querySelector('.kb-hero > p').textContent = routeSeoData().description;
  body.replaceChildren(selected);
  const heading = document.createElement('h2');
  heading.textContent = vfcT('Другие материалы');
  const link = document.createElement('a');
  link.href = '/guide/';
  link.className = 'home-link';
  link.textContent = vfcT('Гид по сертификации');
  body.append(heading, link);
}
function technicalDocumentationDetails() {
  return `<section class="documentation-details"><h3>ТУ, СТО и эксплуатационные документы</h3><p>Технические условия описывают требования к конкретной продукции и её контролю. Стандарт организации устанавливает принятые в организации требования. Паспорт содержит сведения об изделии, а руководство по эксплуатации — правила безопасного применения, обслуживания и хранения. Состав документов выбирают по продукции и задаче: один документ не заменяет все остальные.</p><h3>Что нужно для подготовки</h3><ul><li>Назначение, модели, состав или материалы и технические характеристики;</li><li>Сведения об изготовителе, производстве и контроле качества;</li><li>Требования к упаковке, маркировке, хранению и перевозке;</li><li>Чертежи, существующие паспорта, руководства и другие исходные материалы при наличии.</li></ul><h3>Как проходит работа</h3><p>Уточняем назначение документа, согласуем исходные сведения, состав работ и стоимость. Подготавливаем проект, обсуждаем замечания и передаём согласованный результат. Разработка технической документации сама по себе не заменяет обязательное подтверждение соответствия.</p></section>`;
}
function applyResponsiveImages() {
  document.querySelectorAll('#app img').forEach((img) => {
    const source = img.getAttribute('src')?.replace(/^\//, '');
    const data = VFC_RESPONSIVE_IMAGES[source];
    if (!data) return;
    img.srcset = data.sources;
    img.sizes = img.closest('.ref-category,.svc-product-card,.home-category')
      ? '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 45vw, 380px'
      : '(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) 50vw, 720px';
  });
}
