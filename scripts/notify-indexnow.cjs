/** Notify after a successful deployment: npm run indexnow. --dry-run makes no requests. */
const fs = require('node:fs');
const { key } = require('./indexnow-key.json');
const xml = fs.readFileSync('dist/sitemap.xml', 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = new URL(urlList[0]).host;
const payload = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList };
if (process.argv.includes('--dry-run')) console.log(JSON.stringify(payload, null, 2));
else
  fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  })
    .then(async (response) => {
      if (![200, 202].includes(response.status))
        throw new Error(
          `IndexNow HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`,
        );
      console.log(
        `IndexNow accepted ${urlList.length} URLs (HTTP ${response.status}); indexing is not guaranteed.`,
      );
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
