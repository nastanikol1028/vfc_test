/** Build the static site from the ordered, shared-scope source files. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const esbuild = require('esbuild');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const manifest = require('../src/manifest.json');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const bundle = (files) => files.map((file) => `/* Source: ${file} */\n${read(file)}`).join('\n\n');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'public'), output, { recursive: true });
const javascript = bundle(manifest.javascript);
new vm.Script(javascript, { filename: 'app.js' });
const shippedJS = esbuild.transformSync(javascript, {
  loader: 'js',
  charset: 'utf8',
  minifyWhitespace: true,
  minifySyntax: true,
  minifyIdentifiers: false,
  legalComments: 'none',
  target: 'es2017',
}).code;
const shippedCSS = esbuild.transformSync(bundle(manifest.styles), {
  loader: 'css',
  charset: 'utf8',
  minify: true,
  legalComments: 'none',
  target: ['chrome80', 'firefox78', 'safari13.1'],
}).code;
const assetName = (prefix, code, extension) =>
  prefix +
  '.' +
  crypto.createHash('sha256').update(code).digest('hex').slice(0, 12) +
  '.' +
  extension;
const jsName = assetName('app', shippedJS, 'js'),
  cssName = assetName('style', shippedCSS, 'css');
fs.writeFileSync(path.join(output, jsName), shippedJS);
fs.writeFileSync(path.join(output, cssName), shippedCSS);
// Old cached HTML can still request the unversioned names and revalidate.
fs.writeFileSync(path.join(output, 'app.js'), shippedJS);
fs.writeFileSync(path.join(output, 'style.css'), shippedCSS);
const template = read('src/index.html')
  .replace('src="app.js"', `src="${jsName}"`)
  .replace('href="style.css"', `href="${cssName}"`);
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) => {
  throw error;
});
const dom = new JSDOM(template, {
  url: 'https://vfc-test.annikol396.chatgpt.site/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = () => {};
    window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
    // The browser performs animations and mutations after hydration.
    window.requestAnimationFrame = () => 0;
    window.MutationObserver = class {
      observe() {}
      disconnect() {}
    };
  },
});
const context = dom.getInternalVMContext();
vm.runInContext(javascript, context, { filename: 'app.js' });
const routes = vm.runInContext(
  `['', ...VFC_ROUTE_ROOTS.filter(x => x !== 'registry'), ...refCategories.map(c => 'catalog/' + c[0]), ...Object.keys(serviceDirections).map(x => 'services/' + x), ...VFC_KNOWLEDGE.guideTopics.map(t => 'guide/' + t.id), 'registry/ru', 'registry/kg', 'partners/request', 'guide/compare', 'guide/start']`,
  context,
);
const sitemap = [];
for (const route of [...new Set(routes), '__not_found__']) {
  dom.reconfigure({
    url: 'https://vfc-test.annikol396.chatgpt.site/' + route + (route ? '/' : ''),
  });
  vm.runInContext('render()', context);
  const { document } = dom.window;
  const clone = document.documentElement.cloneNode(true);
  clone.querySelector('#route-progress').hidden = true;
  clone.querySelector('#app').setAttribute('aria-busy', 'false');
  clone.removeAttribute('style');
  clone
    .querySelectorAll('.reveal-ready,.is-visible')
    .forEach((element) => element.classList.remove('reveal-ready', 'is-visible'));
  const html = '<!doctype html>\n' + clone.outerHTML;
  const destination =
    route === '__not_found__'
      ? path.join(output, '404.html')
      : path.join(output, route, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
  if (
    !vm.runInContext('routeSeoData().noindex', context) &&
    !vm.runInContext('VFC_ROUTE_ALIASES', context)[route]
  )
    sitemap.push(document.querySelector('link[rel=canonical]').href);
}
const origin = vm.runInContext('VFC_SITE_ORIGIN', context);
fs.writeFileSync(
  path.join(output, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    [...new Set(sitemap)].map((url) => '<url><loc>' + url + '</loc></url>').join('') +
    '</urlset>\n',
);
fs.writeFileSync(
  path.join(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
// Keep downloadable legal drafts aligned with the displayed language.
for (const kind of ['privacy', 'consent']) {
  for (const language of ['en', 'zh']) {
    dom.reconfigure({ url: origin + '/' + kind + '/' });
    vm.runInContext(`vfcLanguage = '${language}'; render();`, context);
    const document = dom.window.document;
    const heading = document.querySelector('.legal-header h1').textContent;
    const parts = [...document.querySelector('.legal-document').children].map(
      (element) => (element.tagName === 'H2' ? '## ' : '') + element.textContent.trim(),
    );
    fs.writeFileSync(
      path.join(output, 'documents', `${kind}.${language}.md`),
      '# ' + heading + '\n\n' + parts.join('\n\n') + '\n',
    );
  }
}
dom.window.close();
console.log(`Built ${routes.length + 1} static pages in dist/.`);
