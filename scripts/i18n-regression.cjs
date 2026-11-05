/** Preview must be running. No real forms are submitted. */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');
let browser;
(async () => {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('https://**/*', (route) => route.abort());
  await page.addInitScript(() => {
    if (window === window.top) localStorage.setItem('vfc-language', 'en');
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const routes = fs
    .readdirSync('dist', { recursive: true })
    .filter((f) => f.endsWith('index.html'))
    .map((f) => f.replace(/index.html$/, ''));
  for (const route of routes) {
    await page.goto('http://localhost:8773/' + route);
    for (const language of ['en', 'zh']) {
      await page.evaluate((lang) => {
        vfcLanguage = lang;
        vfcApplyLanguage();
      }, language);
      const remaining = await page.evaluate(() => {
        const english = new Set(
          Object.values(VFC_TRANSLATIONS)
            .filter((t) => t.en !== t.zh)
            .map((t) => vfcNormalize(t.en)),
        );
        const output = [],
          walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const element = node.parentElement,
            text = vfcNormalize(node.textContent);
          if (
            !element ||
            !text ||
            element.closest('script,style,svg,textarea,[data-language-ignore],[aria-hidden=true]')
          )
            continue;
          if (!element.getClientRects().length || getComputedStyle(element).visibility === 'hidden')
            continue;
          const officialCode =
            text.includes('ЕАЭС') &&
            (text.startsWith('For Kyrgyzstan,') || text.startsWith('查询吉尔吉斯斯坦时'));
          if (/[А-Яа-яЁё]/.test(text) && !officialCode) output.push(text);
          if (vfcLanguage === 'zh' && english.has(text)) output.push('English remains: ' + text);
        }
        for (const key of ['title', 'description']) {
          const value =
            key === 'title'
              ? document.title
              : document.querySelector('meta[name=description]').content;
          if (/[А-Яа-яЁё]/.test(value)) output.push(key + ': ' + value);
        }
        for (const img of document.querySelectorAll('#app img[alt]'))
          if (/[А-Яа-яЁё]/.test(img.alt)) output.push('alt: ' + img.alt);
        return [...new Set(output)];
      });
      assert.deepEqual(remaining, [], route + ' / ' + language);
    }
  }
  await page.goto('http://localhost:8773/services/');
  for (const language of ['zh', 'ru', 'en', 'zh']) {
    await page.evaluate((lang) => {
      vfcLanguage = lang;
      vfcApplyLanguage();
    }, language);
    const terms = await page.locator('.term-help-row').innerText();
    assert(
      terms.includes(
        { ru: 'Нотификация', en: 'Encryption notification', zh: '加密产品通报' }[language],
      ),
    );
  }
  await page.goto('http://localhost:8773/request/');
  await page.fill('[name=name]', 'Client name');
  await page.fill('[name=contact]', 'abc');
  await page.locator('input[type=file]').setInputFiles({
    name: 'паспорт.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF local translation test'),
  });
  for (const language of ['zh', 'ru', 'en']) {
    await page.evaluate((lang) => {
      vfcLanguage = lang;
      vfcApplyLanguage();
    }, language);
    assert.equal(await page.locator('[name=name]').inputValue(), 'Client name');
    assert.equal(await page.locator('[name=contact]').inputValue(), 'abc');
    assert((await page.locator('[data-photo-list]').textContent()).includes('паспорт.pdf'));
    assert(
      (await page.locator('[data-photo-count]').textContent()).startsWith(
        { en: 'Files:', ru: 'Файлов:', zh: '文件：' }[language],
      ),
    );
    assert(
      (await page.locator('[data-photo-list] button').getAttribute('aria-label')).startsWith(
        { en: 'Remove file ', ru: 'Удалить файл ', zh: '删除文件 ' }[language],
      ),
    );
  }
  await page.goto('http://localhost:8773/privacy/');
  for (const language of ['en', 'zh']) {
    await page.evaluate((lang) => {
      vfcLanguage = lang;
      vfcApplyLanguage();
    }, language);
    const href = await page.locator('.legal-actions a[download]').getAttribute('href');
    assert(href.endsWith(`/documents/privacy.${language}.md`));
    const response = await page.request.get(
      'http://localhost:8773' + new URL(href, 'http://localhost:8773').pathname,
    );
    assert.equal(response.status(), 200);
    assert((await response.text()).includes(language === 'en' ? 'Draft' : '草案'));
  }
  await page.goto('http://localhost:8773/');
  await page.evaluate(() => {
    vfcLanguage = 'ru';
    vfcApplyLanguage();
  });
  assert.equal(await page.locator('.home-stats strong').nth(0).textContent(), 'Более 10 лет');
  assert.equal(await page.locator('.home-stats strong').nth(1).textContent(), 'Более 40 тыс.');
  assert.equal(
    await page.locator('.home-stats strong').first().getAttribute('title'),
    'По данным компании',
  );
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    `PASS: ${routes.length} routes in EN/ZH, language round-trips, glossary, form/file state, legal downloads and owner-confirmed figures.`,
  );
})().catch(async (error) => {
  if (browser) await browser.close();
  console.error(error);
  process.exitCode = 1;
});
