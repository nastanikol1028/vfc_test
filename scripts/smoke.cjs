// Run npm run preview first. Requests to Formspree are mocked.
const { chromium } = require('playwright-core');
const assert = require('assert');
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const p = await b.newPage();
  let errors = [],
    posts = 0;
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('https://formspree.io/**', (r) => {
    posts++;
    r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await p.goto('http://127.0.0.1:8773/#/request');
  await p.waitForTimeout(200);
  assert.equal(new URL(p.url()).pathname, '/request/');
  await p.fill('[name=name]', 'QA');
  await p.fill('[name=contact]', 'qa@example.com');
  await p.locator('.lead-form input[type=checkbox]').check();
  assert(await p.locator('.lead-form').evaluate((f) => f.checkValidity()));
  await p.locator('.lead-form button[type=submit]').click();
  await p.locator('#lead-success-dialog').waitFor({ state: 'visible' });
  assert.equal(posts, 1);
  await p.locator('[data-success-close]').click();
  await p.goto('http://127.0.0.1:8773/#/services');
  await p.waitForTimeout(200);
  assert((await p.locator('.term-help').count()) > 0);
  await p.locator('.term-help summary').first().click();
  assert((await p.locator('.term-help[open]').count()) === 1);
  await p.keyboard.press('Escape');
  assert.equal(await p.locator('.term-help[open]').count(), 0);
  await p.goto('http://127.0.0.1:8773/partners/');
  await p.locator('#document-assistant-open').click();
  const dialog = p.locator('#document-assistant');
  await dialog.locator('#assistant-specific-product').fill('Керамическая ваза 20 см');
  await dialog.getByRole('button', { name: 'Продолжить с этим товаром' }).click();
  await dialog.getByRole('button', { name: 'Продажа в России и ЕАЭС' }).click();
  await dialog.getByRole('button', { name: 'Импортируем' }).click();
  await dialog.getByRole('button', { name: 'Обсудить мой товар' }).click();
  await p.waitForURL('**/request/');
  assert(
    (await p.locator('.photo-lead-form [name=message]').inputValue()).includes(
      'Керамическая ваза 20 см',
    ),
  );
  await p.goto('http://127.0.0.1:8773/#/select');
  await p.fill('#wizard-product', 'Детская мебель');
  for (let i = 0; i < 5; i++) {
    const panel = p.locator(`[data-question="${i}"]`);
    if (i) await panel.locator('[data-answer]').first().click();
    await panel.locator('[data-wizard-next]').click();
  }
  assert(await p.locator('#wizard-summary').isVisible());
  assert(
    (await p.locator('#wizard-contact [name=message]').inputValue()).includes('Детская мебель'),
  );
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:8773/');
  await p.locator('#menu').click();
  assert.equal(await p.locator('#menu').getAttribute('aria-expanded'), 'true');
  await p.locator('.header .navdrop>button').first().click();
  assert(await p.locator('.header .navdrop .dropmenu:not([hidden])').count());
  await p.keyboard.press('Escape');
  await p.keyboard.press('Escape');
  assert.equal(await p.locator('#menu').getAttribute('aria-expanded'), 'false');
  assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  for (const lang of ['en', 'zh', 'ru']) {
    await p.evaluate((l) => {
      vfcLanguage = l;
      vfcApplyLanguage();
    }, lang);
    assert.equal(await p.locator('html').getAttribute('lang'), lang === 'zh' ? 'zh-CN' : lang);
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS: clean routes, optional fields, mocked submission/success, terminology, quiz all 5 steps, mobile menu, 3 languages, no JS errors',
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
