/** Check source syntax and that every same-origin page link has an output file. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const manifest = require('../src/manifest.json');
for (const file of manifest.javascript)
  new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
let pages = 0;
for (const item of fs.readdirSync(path.join(root, 'dist'), { recursive: true })) {
  if (!item.endsWith('.html')) continue;
  pages++;
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'dist', item), 'utf8'), {
    url: 'https://vfc-test.indigoyew34.chatgpt.site/',
  });
  const document = dom.window.document;
  if (
    !document.querySelector('title')?.textContent ||
    !document.querySelector('meta[name=description]')?.content
  )
    throw new Error(`Missing SEO metadata: ${item}`);
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href);
    if (url.origin !== dom.window.location.origin || url.hash) continue;
    const filename = path.join(
      root,
      'dist',
      decodeURIComponent(url.pathname),
      url.pathname.endsWith('/') ? 'index.html' : '',
    );
    if (!fs.existsSync(filename)) throw new Error(`Broken link in ${item}: ${url.pathname}`);
  }
  dom.window.close();
}
console.log(`Source syntax and internal links checked across ${pages} pages.`);
