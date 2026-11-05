/** Build and start preview first. External services are never submitted to. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { chromium } = require('playwright-core');
const origin = 'https://vfc-test.annikol396.chatgpt.site';
const root = path.resolve(__dirname, '../dist');
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith('.html'));
const titles = new Set(),
  descriptions = new Set(),
  canonicalPages = [];
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of files) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'));
  const d = dom.window.document;
  const canonical = d.querySelector('link[rel=canonical]').href;
  const actual = origin + '/' + file.replace(/index.html$/, '');
  const indexable = !d.querySelector('meta[name=robots]').content.includes('noindex');
  assert.equal(d.querySelectorAll('h1').length, 1, file);
  if (indexable && canonical === actual) {
    assert(!titles.has(d.title), 'Duplicate title: ' + file);
    titles.add(d.title);
    const description = d.querySelector('meta[name=description]').content;
    assert(!descriptions.has(description), 'Duplicate description: ' + file);
    descriptions.add(description);
    assert(sitemap.includes('<loc>' + canonical + '</loc>'), 'Missing sitemap URL: ' + file);
    canonicalPages.push(file.replace(/index.html$/, ''));
  }
  const graph = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)[
    '@graph'
  ];
  for (const type of ['Organization', 'WebSite', 'BreadcrumbList'])
    assert(
      graph.some((g) => g['@type'] === type),
      type + ': ' + file,
    );
  assert(d.querySelector('meta[property="og:image"]').content.endsWith('/assets/social-card.png'));
  assert.equal(d.querySelector('meta[property="og:site_name"]').content, 'VFC-TEST');
  const levels = [...d.querySelectorAll('#app h1,#app h2,#app h3,#app h4')].map(
    (e) => +e.tagName[1],
  );
  assert(!levels.some((level, i) => i && level > levels[i - 1] + 1), 'Heading skip: ' + file);
  if (/^(privacy|consent)\//.test(file)) {
    assert(!indexable);
    assert(!sitemap.includes('<loc>' + actual + '</loc>'));
  }
  for (const img of d.querySelectorAll('img[srcset]'))
    for (const source of img.srcset.split(',')) {
      const src = source.trim().split(/\s+/)[0];
      assert(fs.existsSync(path.join(root, src)), 'Missing responsive image: ' + src);
    }
  dom.window.close();
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('https://**/*', (route) => route.abort());
  try {
    for (const [from, to] of [
      ['declaration', 'declaration'],
      ['certification', 'certification'],
      ['voluntary', 'voluntary'],
      ['specifications', 'specifications'],
    ]) {
      const response = await page.request.get('http://localhost:8773/' + from + '/', {
        maxRedirects: 0,
      });
      assert.equal(response.status(), 301);
      assert.equal(response.headers().location, '/services/' + to + '/');
    }
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [...canonicalPages, 'privacy/', 'consent/']) {
        await page.goto('http://localhost:8773/' + route);
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          route + ': overflow at ' + width,
        );
        assert.equal(await page.locator('h1').count(), 1);
      }
    }
    await page.goto('http://localhost:8773/services/');
    await page.locator('[data-service="specifications"]').click();
    await page.waitForURL('**/services/specifications/');
    assert(await page.locator('.documentation-details').isVisible());
    assert((await page.locator('.svc-tabs a[href]').count()) === 7);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto('http://localhost:8773/about/');
    const selected = await page
      .locator('.about-work-photo')
      .first()
      .evaluate(async (img) => {
        if (!img.complete)
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        return img.currentSrc;
      });
    assert(
      /-w(320|640)\.webp$/.test(selected),
      'Mobile did not select a smaller office photo: ' + selected,
    );
    assert.deepEqual(errors, []);
    console.log(
      `PASS: SEO metadata/schema/heading checks on ${files.length} pages; redirects, crawlable service tabs, responsive image selection and ${canonicalPages.length + 2} routes at 320/1280px.`,
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
