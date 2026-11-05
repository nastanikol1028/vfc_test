const kbEscape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
function knowledgePartnerPreview() {
  const d = VFC_KNOWLEDGE;
  return `<section class="home-section kb-partner-preview"><div><span class="home-kicker">${d.partnerKicker}</span><h2>${d.partnerTitle}</h2><p>${d.partnerShort}</p><a class="btn kb-primary" href="#/partners">${d.partnerLink}</a></div><div class="kb-audience-tags">${d.partnerCards.map((x, i) => `<a href="#/partners"><span>0${i + 1}</span><strong>${x[0]}</strong><b aria-hidden="true">↗</b></a>`).join('')}</div></section>`;
}
function knowledgeGuidePreview() {
  const d = VFC_KNOWLEDGE;
  return `<section class="home-section kb-guide-preview"><div class="kb-section-heading"><div><span class="home-kicker">${d.guideKicker}</span><h2>${d.previewGuideTitle}</h2><p>${d.previewGuideIntro}</p></div><a class="home-link" href="#/guide">${d.guideButton}</a></div><div class="kb-preview-grid">${d.previewCards.map((x, i) => `<a class="kb-preview-card" href="#/guide/${x[2]}"><span class="kb-card-number">0${i + 1}</span><h3>${x[0]}</h3><p>${x[1]}</p><span class="kb-card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
}
function knowledgeGuideBanner(topic = '') {
  const d = VFC_KNOWLEDGE;
  return `<section class="kb-guide-banner"><div><span class="home-kicker">${d.guideKicker}</span><p>${d.previewGuideIntro}</p></div><a href="#/guide${topic ? '/' + topic : ''}" class="home-link">${d.guideButton}</a></section>`;
}
function partnershipPage() {
  const d = VFC_KNOWLEDGE;
  let enquiry = formCard(d.partnerRequestTitle);
  enquiry = enquiry.replace(
    'Не нужно разбираться в документах заранее. Напишите, что за товар и где вы планируете его продавать — поможем сориентироваться.',
    d.partnerRequestHint,
  );
  enquiry = enquiry.replace(
    '<div class="clear-form-grid">',
    '<div class="clear-form-grid"><label>Компания<input name="company" placeholder="Необязательно" autocomplete="organization" maxlength="200"></label><label>Ваша роль в проекте<select name="role"><option value="">Выберите, если хотите уточнить</option><option>Таможенный брокер</option><option>Логистическая компания</option><option>Центр по сертификации</option><option>Орган по сертификации или лаборатория</option><option>Агент или специалист по сертификации</option><option>Производитель или импортёр</option><option>Другое</option></select></label>',
  );
  return refWrap(
    `${refCrumb(d.newPartnersLabel)}<div class="knowledge-page"><section class="kb-hero"><span class="home-kicker">${d.partnerKicker}</span><h1>${d.partnerTitle}</h1><p>${d.partnerIntro}</p><div class="kb-hero-actions"><a class="btn kb-primary" href="#/partners/request">${d.partnerButton}</a><button class="btn secondary" type="button" data-partner-price>Запросить оптовый прайс</button><a class="home-link" href="#/guide">${d.guideButton}</a></div></section><section class="ref-section"><div class="kb-partner-cards">${d.partnerCards.map((x, i) => `<article><span class="kb-card-number">0${i + 1}</span><h2>${x[0]}</h2><p>${x[1]}</p></article>`).join('')}</div></section><section class="ref-section"><h2>${d.partnerFlowTitle}</h2><div class="kb-workflow">${d.partnerFlow.map((x, i) => `<article><strong>0${i + 1}</strong><div><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join('')}</div></section><section class="ref-section"><h2>${d.rolesTitle}</h2><div class="kb-role-grid">${d.roles.map((x) => `<article><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</div></section><section class="ref-section kb-checklist-panel"><h2>${d.partnerStart}</h2><ul>${d.partnerInputs.map((x) => `<li>${x}</li>`).join('')}</ul><p class="kb-panel-note">${d.partnerNotice}</p></section><section class="ref-section" id="partner-enquiry">${enquiry}</section>${partnerPriceDialog()}</div>`,
  );
}
function knowledgeGuidePage() {
  const d = VFC_KNOWLEDGE;
  return refWrap(
    `${refCrumb(d.newGuideLabel)}<div class="knowledge-page"><section class="kb-hero"><span class="home-kicker">${d.guideKicker}</span><h1>${d.guideTitle}</h1><p>${d.guideIntro}</p></section><div class="kb-guide-layout"><nav class="kb-guide-toc" aria-label="${d.guideNav}"><strong>${d.guideNav}</strong><a href="#/guide/compare">${d.guideCompare}</a>${d.guideTopics.map((x) => `<a href="#/guide/${x.id}">${x.title}</a>`).join('')}<a href="#/guide/start">${d.guideRouteTitle}</a></nav><div class="kb-guide-body"><section class="ref-section kb-first-step"><h2>${d.guideFirstTitle}</h2><p>${d.guideFirst}</p></section><section class="ref-section" id="guide-compare"><h2>${d.guideCompare}</h2><p>${d.guideCompareIntro}</p><div class="kb-comparison" role="region" aria-label="${d.guideCompare}" tabindex="0"><table><thead><tr><th></th><th>${d.previewCards[0][0]}</th><th>${d.previewCards[1][0]}</th></tr></thead><tbody>${d.compareRows.map((x) => `<tr><th scope="row">${x[0]}</th><td><span class="kb-cell-label">${d.previewCards[0][0]}</span>${x[1]}</td><td><span class="kb-cell-label">${d.previewCards[1][0]}</span>${x[2]}</td></tr>`).join('')}</tbody></table></div></section>${d.guideTopics.map((x, i) => `<section class="ref-section kb-chapter" id="guide-${x.id}"><span class="kb-card-number">0${i + 1}</span><h2>${x.title}</h2><p class="kb-definition">${x.intro}</p>${x.paragraphs.map((p) => `<p>${p}</p>`).join('')}</section>`).join('')}<section class="ref-section" id="guide-start"><h2>${d.guideRouteTitle}</h2><div class="kb-workflow">${d.guideRoute.map((x, i) => `<article><strong>0${i + 1}</strong><div><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join('')}</div></section><section class="ref-section kb-checklist-panel"><h2>${d.guideChecklistTitle}</h2><ul>${d.guideChecklist.map((x) => `<li>${x}</li>`).join('')}</ul><p class="kb-panel-note">${d.guideFinal}</p></section><section class="ref-section kb-source-note"><p>${d.guideSources}</p><a href="https://www.rosguard.gov.ru/document/article/federalnyj-zakon-ot-27-dekabrya-2002-g-184fz" target="_blank" rel="noopener">${d.guideSourceLink} ↗</a></section></div></div><section class="ref-section">${formCard(d.guideRequestTitle)}</section></div>`,
  );
}

function partnerPriceDialog() {
  return `<dialog class="partner-price-dialog" aria-labelledby="partner-price-title"><div class="partner-price-head"><h2 id="partner-price-title">Запросить оптовый прайс</h2><button type="button" data-partner-price-close aria-label="Закрыть">×</button></div><p>Расскажите о товаре — подготовим стоимость услуг под вашу задачу и ответим по указанным контактам.</p><form class="lead-form"><input type="hidden" name="service" value="Запрос оптового прайса для партнёра"><div class="partner-price-fields"><label>Ваше имя<input name="name" required autocomplete="name" maxlength="100" placeholder="Как к вам обращаться"></label><label>Компания<input name="company" autocomplete="organization" maxlength="200" placeholder="Необязательно"></label><label>E-mail для ответа<input name="contact" type="email" required autocomplete="email" maxlength="150" placeholder="you@company.ru"></label><label>О товаре и задаче<textarea name="message" maxlength="5000" placeholder="Наименование, код ТН ВЭД (если известен), страна изготовления и что нужно оформить"></textarea></label></div><label class="ref-consent"><input type="checkbox" name="personal_data_consent" value="yes" required><span>Даю <a href="#/consent">согласие на обработку персональных данных</a> для ответа на обращение. <a href="#/privacy">Политика обработки персональных данных</a>.</span></label><button type="submit" class="btn">Получить оптовый прайс →</button><div class="success" role="status" aria-live="polite"></div></form></dialog>`;
}
function wirePartnerPrice() {
  const trigger = document.querySelector('[data-partner-price]'),
    dialog = document.querySelector('.partner-price-dialog');
  if (!trigger || !dialog) return;
  ensureDialogSupport(dialog);
  let overflow = '';
  trigger.addEventListener('click', () => {
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  });
  dialog
    .querySelector('[data-partner-price-close]')
    .addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.style.overflow = overflow;
    trigger.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog
    .querySelectorAll('a[href="#/privacy"], a[href="#/consent"]')
    .forEach((link) => link.addEventListener('click', () => dialog.close()));
}
