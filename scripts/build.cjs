/** Build the static site from the ordered, shared-scope source files. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
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
fs.writeFileSync(path.join(output, 'app.js'), javascript);
fs.writeFileSync(path.join(output, 'style.css'), bundle(manifest.styles));
const template = read('src/index.html');
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
  if (!vm.runInContext('routeSeoData().noindex', context))
    sitemap.push(document.querySelector('link[rel=canonical]').href);
}
const origin = vm.runInContext('VFC_SITE_ORIGIN', context);
fs.writeFileSync(
  path.join(output, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    sitemap.map((url) => '<url><loc>' + url + '</loc></url>').join('') +
    '</urlset>\n',
);
fs.writeFileSync(
  path.join(output, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
dom.window.close();
console.log(`Built ${routes.length + 1} static pages in dist/.`);
