import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://127.0.0.1:8080';
const checks = [
  ['/', 200, 'text/html'],
  ['/robots.txt', 200, 'text/plain'],
  ['/sitemap.xml', 200, 'application/xml'],
  ['/llms.txt', 200, 'text/plain'],
  ['/og.png', 200, 'image/png'],
  ['/site.webmanifest', 200, 'application/manifest+json'],
  ['/images/retrato.webp', 200, 'image/webp'],
  ['/cv-kevin-munoz.pdf', 200, 'application/pdf'],
  ['/workspace', 410, 'text/html'],
  ['/workspace/', 410, 'text/html'],
  ['/ruta-inexistente-auditoria', 404, 'text/html'],
  ['/_astro/no-existe.js', 404, 'text/html'],
];

for (const [path, status, type] of checks) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  assert.equal(response.status, status, `${path}: estado HTTP`);
  assert.ok(response.headers.get('content-type')?.includes(type), `${path}: Content-Type`);
  if (status >= 400) {
    assert.match(await response.text(), /noindex/);
    assert.doesNotMatch(response.headers.get('cache-control') ?? '', /immutable/);
  }
  console.log(`${status} ${path}`);
}

const home = await fetch(base);
assert.match(home.headers.get('cache-control') ?? '', /no-cache/);
assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
assert.ok(home.headers.get('content-security-policy'));
const html = await home.text();
const assets = [...new Set([...html.matchAll(/(?:src|href)="(\/_astro\/[^"#]+)"/g)].map((match) => match[1]))];
assert.ok(assets.length > 0, 'La home debe enlazar sus recursos compilados');
for (const asset of assets) {
  const response = await fetch(new URL(asset, base));
  assert.equal(response.status, 200, asset);
  assert.match(response.headers.get('cache-control') ?? '', /immutable/);
  const type = asset.endsWith('.css') ? 'text/css' : asset.endsWith('.js') ? 'javascript' : '';
  if (type) assert.ok(response.headers.get('content-type')?.includes(type), asset);
}
for (const path of ['/index.html?ref=test', '/index.htm?ref=test']) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  assert.equal(response.status, 301, path);
  assert.equal(new URL(response.headers.get('location'), base).pathname, '/');
  assert.equal(new URL(response.headers.get('location'), base).search, '?ref=test');
}
console.log(`HTTP correcto; ${assets.length} recursos compilados con caché inmutable.`);
