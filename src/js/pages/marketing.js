// pages/marketing.js
const marketplace = () =>
  `<section class="market-hero wrap"><div>${crumb('Маркетплейсы')}<div class="eyebrow">Проверка перед запуском</div><h1>Готовитесь к продаже на маркетплейсах?</h1><p style="color:var(--muted)">Поможем понять, какие документы и сведения подготовить для карточки товара и старта продаж.</p><div class="btnrow"><a class="btn" href="#/request">Обсудить товар</a><a class="btn secondary" href="#/select">Подобрать документы</a></div></div><div class="market-visual"><div class="orb"><div class="cube"><div class="cube-top"></div><div class="cube-left"></div><div class="cube-right"></div><div class="cube-check">✓</div></div></div><span class="market-label l1">Документы проверены</span><span class="market-label l2">Карточка товара готова</span><span class="market-label l3">Маркировка учтена</span></div></section><section class="section soft"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Проверим перед стартом</div><h2>Что важно подготовить</h2></div><p>Требования зависят от категории товара и правил конкретной площадки.</p></div><div class="grid three"><div class="card"><div class="card-body"><div class="service-icon">${siteFeatureIcon('document')}</div><h3>Документы соответствия</h3><p>Проверим, какие обязательные документы могут потребоваться на ваш товар.</p></div></div><div class="card"><div class="card-body"><div class="service-icon">${siteFeatureIcon('label')}</div><h3>Маркировка товара</h3><p>Подскажем, какие сведения и обозначения важно проверить перед продажей.</p></div></div><div class="card"><div class="card-body"><div class="service-icon">${siteFeatureIcon('card')}</div><h3>Сведения для карточки</h3><p>Поможем собрать данные о товаре и подтверждающие материалы.</p></div></div></div></div></section><section class="section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Простой маршрут</div><h2>Как подготовиться к продаже</h2></div></div><div class="steps">${['Расскажите, что продаёте', 'Проверим требования к категории', 'Сверим имеющиеся документы', 'Составим список следующих шагов', 'Поможем пройти оформление'].map((x, i) => `<div class="step"><div class="step-num">0${i + 1}</div><h3>${x}</h3></div>`).join('')}</div><div class="notice">Список требований зависит от товара, страны происхождения и правил площадки. Решение по допуску товара принимает маркетплейс.</div><div style="margin-top:30px">${cta('Планируете запуск товара?', 'Пришлите описание — проверим, с чего начать подготовку.')}</div></div></section>`;

const reviews = () =>
  refWrap(
    `${refCrumb('Отзывы')}<section class="ref-intro"><h1>Отзывы клиентов</h1><p>Отзывы о работе ВФК-ТЕСТ на Яндекс Картах.</p></section><section class="ref-section ref-about-reviews"><div class="yandex-reviews-embed"><iframe src="https://yandex.ru/maps-reviews-widget/189945161397?comments" title="Отзывы о ВФК-ТЕСТ на Яндекс Картах" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a class="yandex-reviews-attribution" href="https://yandex.ru/maps/org/vfk_test/189945161397/" target="_blank" rel="noopener">Вфк-тест на карте Москвы — Яндекс Карты</a><a class="widget-direct-link" href="https://yandex.ru/maps/org/vfk_test/189945161397/reviews/" target="_blank" rel="noopener">Все отзывы на Яндекс Картах ↗</a></div></section>${refRequest()}`,
  );

const cases = () =>
  `${pageHero('Кейсы', 'Решения для разных товарных групп', 'Каждая продукция требует отдельного анализа. Ниже — типовые примеры того, с чем к нам обращаются.')}<section class="section" style="padding-top:10px"><div class="wrap"><div class="grid three">${[
    [
      'Производитель мебели',
      'Мебель и товары для дома',
      'Разобрали линейку и назначение мебели, определили требования и согласовали план испытаний.',
    ],
    [
      'Импортёр детской одежды',
      'Одежда и текстиль',
      'Сопоставили возрастные группы и состав ассортимента, подготовили перечень сведений для оформления.',
    ],
    [
      'Продавец пищевой продукции',
      'Пищевая продукция',
      'Проверили характеристики товара и помогли спланировать оформление перед началом продаж.',
    ],
    [
      'Поставщик электроники',
      'Электроника и техника',
      'Разобрали модельный ряд и назначение оборудования, обсудили требования безопасности.',
    ],
    [
      'Бренд косметики',
      'Косметика и парфюмерия',
      'Собрали информацию о продукции и определили порядок проверки требований перед запуском линейки.',
    ],
    [
      'Производитель упаковки',
      'Упаковка и тара',
      'Оценили назначение и материалы упаковки, согласовали состав доказательной базы.',
    ],
  ]
    .map(
      (x) =>
        `<article class="card"><div class="card-body"><div class="eyebrow">${x[1]}</div><h3 style="margin-top:12px">${x[0]}</h3><p>${x[2]}</p><span class="chip">Типовой сценарий</span></div></article>`,
    )
    .join(
      '',
    )}</div><p class="notice-banner">Примеры описывают типовые задачи и не являются подтверждёнными кейсами конкретных клиентов.</p></div></section>`;

const articles = () =>
  `${pageHero('Статьи', 'Разбираемся в требованиях вместе', 'Короткие ответы на вопросы о документах, испытаниях и подготовке продукции к продаже.')}<section class="section" style="padding-top:10px"><div class="wrap"><div class="grid three">${[
    [
      'Как определить, нужен ли сертификат или декларация?',
      'Разбираем, от чего зависит форма подтверждения соответствия и какие сведения собрать перед консультацией.',
      '5 минут',
    ],
    [
      'Что проверить перед выходом на маркетплейс?',
      'Список вопросов о документах, маркировке и карточке товара перед началом продаж.',
      '4 минуты',
    ],
    [
      'Какие сведения подготовить для расчёта?',
      'Что ускорит первичную оценку продукции и поможет составить план работ.',
      '3 минуты',
    ],
    [
      'Зачем нужны испытания продукции?',
      'Как образцы и протоколы испытаний участвуют в подтверждении соответствия.',
      '6 минут',
    ],
    [
      'Что такое технический регламент ЕАЭС?',
      'Объясняем, как регламенты устанавливают требования к отдельным товарным группам.',
      '5 минут',
    ],
    [
      'Можно ли объединить товары в один документ?',
      'От чего зависит область действия документа и как оценивают модельный ряд.',
      '4 минуты',
    ],
  ]
    .map(
      (x) =>
        `<article class="card article-card"><small>Памятка · ${x[2]}</small><h3 style="margin-top:12px">${x[0]}</h3><p>${x[1]}</p><a class="textlink" href="#/request">Задать вопрос</a></article>`,
    )
    .join('')}</div><div style="margin-top:28px">${cta()}</div></div></section>`;

const contacts = () =>
  `${pageHero('Контакты', 'Давайте обсудим вашу задачу', 'Свяжитесь с нами удобным способом или оставьте заявку — уточним детали и подскажем дальнейшие шаги.')}<section class="section" style="padding-top:10px"><div class="wrap"><div class="contact-grid"><div><div class="contact-list"><div class="contact-item"><b>Телефон</b><a href="https://max.ru/u/f9LHodD0cOIsOp47Fkd1RynDYU741JCFP3wpgXuxFMDnc_w0sSP2vFELvwI" target="_blank" rel="noopener noreferrer" title="Написать в MAX">+7 (968) 760-97-22</a></div><div class="contact-item"><b>Электронная почта</b><a href="mailto:info@vfc-test.ru">info@vfc-test.ru</a></div><div class="contact-item"><b>Напишите в мессенджер</b><span style="font-size:13px"><a href="https://wa.me/79687609722" target="_blank" rel="noreferrer">WhatsApp</a> · <a href="https://t.me/vfc_test" target="_blank" rel="noreferrer">Telegram</a></span></div><div class="contact-item"><b>Время работы</b><span style="font-size:14px">Пн–Пт, 09:00–18:00</span></div></div><div style="margin-top:30px"><h3>Наш офис</h3><p style="color:var(--muted);font-size:12px">Адрес офиса уточните у менеджера перед визитом.</p></div></div><div class="mapbox"><div style="position:relative"><div class="map-pin"><span>⌖</span></div><p>Свяжитесь с нами,<br>чтобы получить схему проезда</p></div></div></div><div style="margin-top:35px">${formCard('Давайте обсудим вашу задачу')}</div></div></section>`;
