// pages/request.js
const request = () =>
  `${pageHero('Заявка', 'Обсудим вашу задачу', 'Опишите продукцию и цель — поможем разобраться в требованиях и составим план следующих действий.')}<section class="section" style="padding-top:10px"><div class="wrap" style="max-width:850px">${formCard()}<div class="notice">Если пока не знаете, какой документ нужен, выберите «Нужна консультация» — разберёмся вместе.</div></div></section>`;

/** A short callback version of the existing lead form, using the same delivery flow. */
function callbackPage() {
  let form = formCard('Заказать звонок');
  form = form.replace(
    'Не нужно разбираться в документах заранее. Напишите, что за товар и где вы планируете его продавать — поможем сориентироваться.',
    'Оставьте имя и номер телефона — мы перезвоним вам в рабочее время.',
  );
  form = form.replace(/<label class="clear-form-wide">[\s\S]*?<\/label>/, '');
  form = form.replace(
    /<div class="photo-upload-section">[\s\S]*?<details class="clear-optional">[\s\S]*?<\/details>/,
    '',
  );
  form = form
    .replace('Телефон или e-mail', 'Номер телефона')
    .replace('name="contact"', 'name="contact" type="tel" autocomplete="tel"')
    .replace('Куда ответить на ваш вопрос', '+7 (___) ___-__-__');
  form = form.replace(
    '<form class="lead-form photo-lead-form">',
    '<form class="lead-form callback-form"><input type="hidden" name="service" value="Заказ обратного звонка">',
  );
  form = form.replace('Получить расчёт стоимости →', 'Заказать звонок →');
  return (
    pageHero(
      'Заказать звонок',
      'Обсудим вашу задачу по телефону',
      'Оставьте контакт, и специалист свяжется с вами в рабочее время.',
    ) +
    '<section class="section"><div class="wrap">' +
    form +
    '</div></section>'
  );
}
