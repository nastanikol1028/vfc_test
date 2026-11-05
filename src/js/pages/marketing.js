// pages/marketing.js
const marketplace = () =>
  `<section class="market-hero wrap"><div>${crumb('Маркетплейсы')}<div class="eyebrow">Проверка перед запуском</div><h1>Готовитесь к продаже на маркетплейсах?</h1><p style="color:var(--muted)">Поможем понять, какие документы и сведения подготовить для карточки товара и старта продаж.</p><div class="btnrow"><a class="btn" href="#/request">Обсудить товар</a><a class="btn secondary" href="#/select">Подобрать документы</a></div></div><div class="market-visual"><div class="orb"><div class="cube"><div class="cube-top"></div><div class="cube-left"></div><div class="cube-right"></div><div class="cube-check">✓</div></div></div><span class="market-label l1">Документы проверены</span><span class="market-label l2">Карточка товара готова</span><span class="market-label l3">Маркировка учтена</span></div></section><section class="section soft"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Проверим перед стартом</div><h2>Что важно подготовить</h2></div><p>Требования зависят от категории товара и правил конкретной площадки.</p></div><div class="grid three"><div class="card"><div class="card-body"><div class="service-icon">${siteFeatureIcon('document')}</div><h3>Документы соответствия</h3><p>Проверим, какие обязательные документы могут потребоваться на ваш товар.</p></div></div><div class="card"><div class="card-body"><div class="service-icon">${siteFeatureIcon('label')}</div><h3>Маркировка товара</h3><p>Подскажем, какие сведения и обозначения важно проверить перед продажей.</p></div></div><div class="card"><div class="card-body"><div class="service-icon">${siteFeatureIcon('card')}</div><h3>Сведения для карточки</h3><p>Поможем собрать данные о товаре и подтверждающие материалы.</p></div></div></div></div></section><section class="section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Простой маршрут</div><h2>Как подготовиться к продаже</h2></div></div><div class="steps">${['Расскажите, что продаёте', 'Проверим требования к категории', 'Сверим имеющиеся документы', 'Составим список следующих шагов', 'Поможем пройти оформление'].map((x, i) => `<div class="step"><div class="step-num">0${i + 1}</div><h3>${x}</h3></div>`).join('')}</div><div class="notice">Список требований зависит от товара, страны происхождения и правил площадки. Решение по допуску товара принимает маркетплейс.</div><div style="margin-top:30px">${cta('Планируете запуск товара?', 'Пришлите описание — проверим, с чего начать подготовку.')}</div></div></section>`;

const reviews = () =>
  refWrap(
    `${refCrumb('Отзывы')}<section class="ref-intro"><h1>Отзывы клиентов</h1><p>Отзывы о работе ВФК-ТЕСТ на Яндекс Картах.</p></section><section class="ref-section ref-about-reviews"><div class="yandex-reviews-embed"><iframe src="https://yandex.ru/maps-reviews-widget/189945161397?comments" title="Отзывы о ВФК-ТЕСТ на Яндекс Картах" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><a class="yandex-reviews-attribution" href="https://yandex.ru/maps/org/vfk_test/189945161397/" target="_blank" rel="noopener">Вфк-тест на карте Москвы — Яндекс Карты</a><a class="widget-direct-link" href="https://yandex.ru/maps/org/vfk_test/189945161397/reviews/" target="_blank" rel="noopener">Все отзывы на Яндекс Картах ↗</a></div></section>${refRequest()}`,
  );

const cases = () =>
  `${pageHero('Кейсы', 'Решения для разных товарных групп', 'Каждая продукция требует отдельного анализа. Ниже — типовые примеры того, с чем к нам обращаются.')}<section class="section" style="padding-top:10px"><div class="wrap"><h2>Типовые задачи клиентов</h2><div class="grid three">${[
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
  `${pageHero('Статьи', 'Статьи о сертификации продукции', 'Практические материалы о документах, испытаниях и подготовке продукции к продаже.')}<section class="section"><div class="wrap"><h2>Материалы и памятки</h2><div class="grid three">${VFC_ARTICLES.map((a) => `<article class="card article-card"><time datetime="${a.date}">5 ноября 2026 года</time><h3><a href="/articles/${a.id}/">${a.title}</a></h3><p>${a.intro}</p><a class="textlink" href="/articles/${a.id}/">Читать статью →</a></article>`).join('')}</div>${cta()}</div></section>`;
function articlePage(id) {
  const a = VFC_ARTICLES.find((a) => a.id === id);
  return `<section class="legal-page" lang="ru" data-language-ignore><article class="legal-article"><nav class="crumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span>›</span><a href="/articles/">Статьи</a><span>›</span><span aria-current="page">${a.title}</span></nav><header class="legal-header"><h1>${a.title}</h1><p class="legal-edition"><time datetime="${a.date}">5 ноября 2026 года</time> · Редакция VFC-TEST</p><p>${a.intro}</p></header><div class="legal-document">${a.sections.map((s) => `<section><h2>${s.title}</h2><p>${s.text}</p></section>`).join('')}<aside class="notice-banner">Материал носит справочный характер. Требования к конкретной продукции необходимо проверять по действующим редакциям документов.</aside><section><h2>Полезные материалы</h2><p><a href="/guide/">Гид по документам</a> · <a href="/catalog/">Категории продукции</a></p></section></div><footer class="legal-actions"><a href="/request/">Обсудить вашу продукцию</a><a href="/articles/">Все статьи</a></footer></article></section>`;
}
