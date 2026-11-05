/** Local static preview with the same clean-URL behavior as nginx. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const port = Number(process.env.PORT || 8773);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
http
  .createServer((request, response) => {
    let name;
    try {
      name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end();
      return;
    }
    const aliases = {
      '/index.html': '/',
      '/declaration': '/services/declaration/',
      '/certification': '/services/certification/',
      '/voluntary': '/services/voluntary/',
      '/specifications': '/services/specifications/',
    };
    const key = name.replace(/\/index\.html$/, '').replace(/\/$/, '');
    const target = aliases[name] || aliases[key];
    if (target) {
      response
        .writeHead(301, { Location: target + new URL(request.url, 'http://localhost').search })
        .end();
      return;
    }
    let file = path.resolve(root, '.' + name);
    if (!file.startsWith(root + path.sep) && file !== root) {
      response.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, 'index.html');
    const found = fs.existsSync(file) && fs.statSync(file).isFile();
    if (!found) file = path.join(root, '404.html');
    response.writeHead(found ? 200 : 404, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
    });
    fs.createReadStream(file).pipe(response);
  })
  .listen(port, '0.0.0.0', () => console.log(`Preview: http://localhost:${port}`));
