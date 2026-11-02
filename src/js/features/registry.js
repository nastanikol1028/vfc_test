// features/registry.js
const registryPage = (country) =>
  `<div class="home-page"><div class="wrap"><section class="registry-intro"><a class="home-link" href="#/">Главная</a><h1>${country === 'kg' ? 'Проверка документа Кыргызстана' : 'Проверка документа в Росаккредитации'}</h1><p>Выберите тип документа и укажите его полный регистрационный номер.</p></section>${registryBlock(country === 'kg' ? 'kg' : 'ru')}</div></div>`;

const registryBlock = (country = '') =>
  `<section class="home-section registry-panel" id="check-document"><span class="eyebrow">ОФИЦИАЛЬНЫЕ РЕЕСТРЫ</span><h2>Проверьте свой документ</h2><p>Оформляемые с нашим сопровождением обязательные сертификаты и декларации регистрируются в официальных реестрах соответствующей страны. ${country ? 'Укажите номер документа для проверки в выбранном официальном реестре.' : 'Здесь можно выбрать реестр и перейти к проверке вашего документа.'}</p><div class="registry-sources ${country ? 'registry-single' : ''}">${country !== 'kg' ? `<a class="registry-source" href="https://fsa.gov.ru/" target="_blank" rel="noopener noreferrer"><img src="assets/rosaccreditation-clean.webp" alt="Логотип Росаккредитации" loading="lazy"><span><b>Росаккредитация ↗</b><small>Россия · сертификаты и декларации</small></span></a>` : ''}${country !== 'ru' ? `<a class="registry-source" href="https://swis.trade.kg/" target="_blank" rel="noopener noreferrer"><img class="tulpar-logo" src="assets/tulpar-system.webp" alt="Tulpar System" width="270" height="154" loading="lazy"><span><b>Единое окно Кыргызстана ↗</b><small>Документы ТР ТС / ЕАЭС</small></span></a>` : ''}</div><form class="registry-form"><div class="registry-fields">${country ? `<input type="hidden" name="registryCountry" value="${country}">` : `<label>Страна регистрации<select name="registryCountry"><option value="ru">Россия · Росаккредитация</option><option value="kg">Кыргызстан · Единое окно</option></select></label>`}<label>Тип документа<select name="registryType"><option value="declaration">Декларация о соответствии</option><option value="certificate">Сертификат соответствия</option></select></label><label class="registry-number">Полный регистрационный номер<input name="registryNumber" required maxlength="200" placeholder="Введите номер целиком, как в документе" aria-describedby="registry-hint" autocomplete="off" spellcheck="false"></label></div><p class="registry-hint" id="registry-hint">Введите полный регистрационный номер документа.</p><p class="registry-hint" data-registry-format hidden>Для Кыргызстана введите номер целиком, как в бланке, начиная с «ЕАЭС», если номер начинается с этого обозначения. Сохраните все пробелы, буквы, точки, дефисы и другие знаки.</p><div class="registry-actions"><button class="btn" type="submit">Перейти к проверке ↗</button></div><div class="registry-feedback" role="status" aria-live="polite" hidden></div></form><p class="registry-hint">Результат и актуальный статус документа отображаются на сайте официального реестра. VFC-TEST не является государственным реестром. Отсутствие записи в поиске само по себе не означает аннулирование документа.</p><div class="registry-help"><p>Документ аннулирован, приостановлен или срок действия истёк? Бесплатно проконсультируем, разберёмся в ситуации и поможем оформить новый документ, если это необходимо.</p><a class="home-link" href="#/request">Получить бесплатную консультацию →</a></div></section>`;

function wireRegistry() {
  const form = document.querySelector('.registry-form');
  if (!form || form.dataset.registryWired) return;
  form.dataset.registryWired = 'true';
  const number = form.elements.registryNumber,
    country = form.elements.registryCountry,
    type = form.elements.registryType,
    result = form.querySelector('[role=status]');
  const route = getSiteRoute().split('/');
  if (route[0] === 'registry') country.value = route[1] === 'kg' ? 'kg' : 'ru';
  const updateCountry = () => {
    form
      .querySelectorAll('[data-registry-format],[data-registry-logo]')
      .forEach((el) => (el.hidden = country.value !== 'kg'));
  };
  updateCountry();
  country.addEventListener('change', updateCountry);
  const show = (text) => {
    result.hidden = false;
    result.textContent = vfcT(text);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const value = number.value;
    if (!value.trim()) {
      number.setCustomValidity(vfcT('Введите регистрационный номер документа.'));
      number.reportValidity();
      return;
    }
    let url;
    if (country.value === 'kg') {
      url = new URL(
        type.value === 'certificate'
          ? 'https://swis.trade.kg/Registry/CertificateOfConformity'
          : 'https://swis.trade.kg/Registry/DeclarationOfConformity',
      );
      url.search = new URLSearchParams({
        RegisterNumber: value,
        Status: 'Все',
        Agency: 'Все',
        PageNumber: '1',
        submitButton: 'Найти',
      }).toString();
      show(
        'Поиск откроется в реестре Кыргызстана. Проверьте номер, статус и сведения о продукции в найденной записи.',
      );
    } else {
      url = new URL(
        type.value === 'certificate'
          ? 'https://pub.fsa.gov.ru/rss/certificate'
          : 'https://pub.fsa.gov.ru/rds/declaration',
      );
      show(
        'Откроется реестр Росаккредитации. Введите номер в поиск по регистрационному номеру. Статус смотрите в карточке документа.',
      );
    }
    const link = document.createElement('a');
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'home-link';
    link.style.display = 'block';
    link.textContent = vfcT('Открыть официальный реестр ↗');
    result.append(link);
    window.open(url.href, '_blank', 'noopener,noreferrer');
  });
  number.addEventListener('input', () => {
    number.setCustomValidity('');
    result.hidden = true;
  });
  [country, type].forEach((field) =>
    field.addEventListener('change', () => {
      result.hidden = true;
    }),
  );
}
