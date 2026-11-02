// components/service-documents.js
const voluntaryCertificationTypes = [
  [
    'По нормативному документу производителя',
    'Подтверждает соответствие продукции требованиям и характеристикам, заявленным производителем в ТУ, ГОСТ или СТО.',
  ],
  [
    'Добровольная пожарная сертификация',
    'Подтверждение показателей пожарной безопасности продукции в рамках выбранной системы добровольной сертификации.',
  ],
  [
    'ЭКО, БИО, без ГМО, без консервантов',
    'Подтверждение отдельных экологических характеристик и заявлений о составе продукции. Критерии и возможность подтверждения уточняются для каждого заявления.',
  ],
  [
    'Халяль',
    'Подтверждение соответствия продукции или услуг требованиям выбранного стандарта халяль.',
  ],
  [
    'Кошер',
    'Подтверждение соответствия продукции требованиям кошерности по применимым правилам выбранной системы.',
  ],
  [
    'Сейсмостойкость',
    'Подтверждение характеристик устойчивости продукции и оборудования к сейсмическим воздействиям.',
  ],
];

const voluntaryTypesBlock = () =>
  `<section class="svc-voluntary-types" aria-labelledby="voluntary-types-heading"><h3 id="voluntary-types-heading">Виды добровольной сертификации</h3><div class="svc-voluntary-grid">${voluntaryCertificationTypes.map((item, i) => `<article><span class="svc-type-number">0${i + 1}</span><h4>${item[0]}</h4><p>${item[1]}</p></article>`).join('')}</div><p class="svc-voluntary-note">Подберём систему и порядок подтверждения под вашу продукцию или услугу. Возможность оформления и перечень доказательств уточняем до начала работ.</p></section>`;

const serviceRegistryForm = (kind) =>
  `<div class="svc-mini-registry"><span class="home-kicker">ПРОВЕРКА В РЕЕСТРЕ</span><h3>${kind === 'declaration' ? 'Проверьте декларацию' : 'Проверьте сертификат'}</h3><p>${kind === 'declaration' ? 'Поиск декларации в реестре Росаккредитации' : 'Поиск сертификата в реестре РФ или Киргизии'}</p><form class="registry-form"><input type="hidden" name="registryType" value="${kind === 'declaration' ? 'declaration' : 'certificate'}">${kind === 'declaration' ? '<input type="hidden" name="registryCountry" value="ru">' : `<label>Реестр<select name="registryCountry"><option value="ru">Россия · Росаккредитация</option><option value="kg">Кыргызстан · Единое окно</option></select></label>`}<a class="mini-registry-brand" data-registry-logo href="https://swis.trade.kg/" target="_blank" rel="noopener noreferrer" hidden><img class="tulpar-logo" src="assets/tulpar-system.webp" alt="Tulpar System" width="270" height="154" loading="lazy"></a><label>Полный регистрационный номер<input name="registryNumber" required maxlength="200" placeholder="Введите номер целиком, как в документе" aria-describedby="svc-registry-hint" autocomplete="off" spellcheck="false"></label><p class="registry-hint" id="svc-registry-hint">Введите полный регистрационный номер документа.</p><p class="registry-hint" data-registry-format hidden>Для Кыргызстана введите номер целиком, как в бланке, начиная с «ЕАЭС», если номер начинается с этого обозначения. Сохраните все пробелы, буквы, точки, дефисы и другие знаки.</p><div class="registry-actions"><button class="btn" type="submit">Перейти к проверке ↗</button></div><div class="registry-feedback" role="status" aria-live="polite" hidden></div></form><small>Проверка открывается в официальном реестре. Для РФ введите номер в поиск реестра.</small></div>`;
