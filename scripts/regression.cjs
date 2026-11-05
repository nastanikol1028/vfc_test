/** Regression checks for navigation, drafts, input validation and mobile controls. No real emails. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8773';
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let posts = 0,
    lastBody = '';
  await page.route('https://formspree.io/**', async (route) => {
    posts++;
    lastBody = route.request().postDataBuffer().toString('utf8');
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto(base + '/');
  for (const language of ['ru', 'en', 'zh']) {
    await page.evaluate((lang) => {
      vfcLanguage = lang;
      vfcApplyLanguage();
    }, language);
    for (const width of [1440, 1280, 768, 390, 360, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${language} overflows at ${width}`,
      );
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(base + '/request/');
  const categoryValues = await page
    .locator('[name=category] option')
    .evaluateAll((options) => options.map((option) => option.value));
  assert.equal(categoryValues.filter((value) => value && value !== 'Другое').length, 12);
  for (const category of ['dishes', 'chemicals', 'protection', 'footwear'])
    assert(categoryValues.includes(category));
  const services = await page
    .locator('[name=service] option')
    .evaluateAll((options) => options.map((option) => option.value));
  for (const service of ['testing', 'origin', 'notification']) assert(services.includes(service));
  await page.fill('[name=name]', 'Тест черновика');
  await page.fill('[name=contact]', 'test@example.com');
  await page.fill('[name=message]', 'Нужны документы на стеклянную посуду');
  await page.locator('.clear-optional summary').click();
  await page.selectOption('[name=category]', 'dishes');
  await page.selectOption('[name=service]', 'testing');
  await page.locator('[data-photo-input]').setInputFiles({
    name: 'specification.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\nMock test document'),
  });
  await page.locator('.header .logo').click();
  await page.waitForURL(base + '/');
  await page.goBack();
  await page.waitForURL(base + '/request/');
  await page.waitForFunction(() =>
    document.querySelector('[name=message]')?.value.includes('стеклянную'),
  );
  assert.equal(await page.locator('[name=category]').inputValue(), 'dishes');
  assert.equal(await page.locator('[name=service]').inputValue(), 'testing');
  assert((await page.locator('[data-photo-list]').innerText()).includes('specification.pdf'));
  await page.locator('.lead-form input[type=checkbox]').check();
  await page.locator('.lead-form button[type=submit]').click();
  await page.locator('#lead-success-dialog').waitFor({ state: 'visible' });
  assert.equal(posts, 1);
  assert(lastBody.includes('specification.pdf'));
  assert(lastBody.includes('Посуда и товары для дома'));
  assert.equal(await page.evaluate(() => sessionStorage.getItem('vfc-lead-draft:main')), null);
  await page.locator('[data-success-close]').click();
  await page.fill('[name=message]', 'Текст сохраняется после обновления');
  await page.reload();
  assert.equal(
    await page.locator('[name=message]').inputValue(),
    'Текст сохраняется после обновления',
  );
  await page.getByRole('button', { name: 'Очистить черновик' }).click();
  assert.equal(await page.locator('[name=message]').inputValue(), '');
  await page.goto(base + '/callback/');
  await page.fill('[name=name]', 'QA');
  await page.fill('[name=contact]', 'abc');
  await page.locator('.callback-form input[type=checkbox]').check();
  assert.equal(
    await page.locator('.callback-form').evaluate((form) => form.checkValidity()),
    false,
  );
  await page.fill('[name=contact]', '+44 20 7946 0958');
  assert.equal(await page.locator('.callback-form').evaluate((form) => form.checkValidity()), true);
  await page.goto(base + '/services/');
  await page.locator('[data-service=notification]').click();
  await page.waitForURL(base + '/services/notification/');
  await page.reload();
  assert.equal(
    await page.locator('[data-service=notification]').getAttribute('aria-selected'),
    'true',
  );
  await page.locator('[data-service=testing]').click();
  await page.waitForURL(base + '/services/testing/');
  await page.goBack();
  await page.waitForFunction(
    () =>
      document.querySelector('[data-service=notification]')?.getAttribute('aria-selected') ===
      'true',
  );
  const ids = await page.evaluate(() => refCategories.map((category) => category[0]));
  for (const id of ids) {
    await page.goto(base + '/catalog/' + id + '/');
    for (const lang of ['en', 'zh']) {
      await page.evaluate((lang) => {
        vfcLanguage = lang;
        vfcApplyLanguage();
      }, lang);
      assert(!/[А-Яа-яЁё]/.test(await page.title()), id + ' has Russian SEO title in ' + lang);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/partners/');
  await page.locator('.kb-hero-actions').scrollIntoViewIfNeeded();
  await page.evaluate(() => updateFloatingAssistant());
  const obstruction = await page.evaluate(() => {
    const floating = document.querySelector('.floating');
    if (getComputedStyle(floating).visibility === 'hidden') return false;
    const r = floating.getBoundingClientRect();
    return [...document.querySelectorAll('.kb-hero-actions a,.kb-hero-actions button')].some(
      (target) => {
        const t = target.getBoundingClientRect();
        return t.right > r.left && t.left < r.right && t.bottom > r.top && t.top < r.bottom;
      },
    );
  });
  assert.equal(obstruction, false);
  await page.goto(base + '/contacts/');
  const phone = page.locator('.ref-contact-list a[href="tel:+79687609722"]');
  assert.equal(await phone.count(), 1);
  assert.equal(await phone.locator('img').count(), 0);
  assert.equal(await page.locator('.reference-footer a[href="tel:+79687609722"] img').count(), 0);
  assert.equal(await page.locator('.footer-messengers .messenger-icon').count(), 3);
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    'PASS: all seven audit fixes, draft attachments, callback validation, phone labels and footer messenger icons.',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
