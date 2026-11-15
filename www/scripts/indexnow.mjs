// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver) that the site's pages changed.
// Runs after `wrangler deploy`; the key file in public/ proves we own the host.
import { readFileSync } from 'node:fs';

const HOST = 'tiempo.gobrand.app';
const KEY = 'cc4e51ab06b567c89d1187a395d08b78';

const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList })
});

// 200 and 202 both mean accepted; anything else is worth seeing but shouldn't fail a deploy.
console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);
