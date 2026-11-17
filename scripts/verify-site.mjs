import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const dist = resolve('dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
const origin = 'https://kevelmun.dev';
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [match[1], match[2]]),
);
const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
const meta = (name) => metas.find((item) => item.name === name || item.property === name)?.content;
const graph = () => JSON.parse(html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '{}')['@graph'] ?? [];

test('el HTML contiene el portafolio y una sola copia de cada referencia sin JavaScript', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const section of ['sobre-mi', 'experiencia', 'proyectos', 'investigacion', 'skills', 'formacion', 'recomendaciones', 'contacto']) {
    assert.match(html, new RegExp(`id="${section}"`));
  }
  assert.match(html, /Kevin Elihan Muñoz Calva/);
  assert.match(html, /Stereo Vision Techniques/);
  assert.equal((html.match(/class="rec"/g) ?? []).length, 10);
});

test('canonical y metadatos sociales describen la misma URL con imagen PNG válida', async () => {
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag)).find((item) => item.rel === 'canonical');
  assert.equal(canonical?.href, `${origin}/`);
  assert.equal(meta('og:url'), `${origin}/`);
  assert.equal(meta('twitter:card'), 'summary_large_image');
  assert.equal(meta('og:image'), `${origin}/og.png`);
  assert.equal(meta('twitter:image'), meta('og:image'));
  assert.ok(meta('og:image:alt'));
  assert.doesNotMatch(meta('robots') ?? '', /noindex/);
  const png = await readFile(resolve(dist, 'og.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('el grafo mantiene la identidad y enlaza publicaciones sin inventar empleo ni titulaciones', () => {
  const nodes = graph();
  const person = nodes.find((item) => item['@type'] === 'Person');
  assert.equal(person?.['@id'], `${origin}/#person`);
  assert.equal(person?.address.addressLocality, 'Valencia');
  assert.equal(person?.worksFor, undefined);
  assert.equal(person?.telephone, undefined);
  assert.ok(!JSON.stringify(person?.alumniOf).includes('UPV'));
  assert.equal(nodes.find((item) => item['@type'] === 'ProfilePage')?.mainEntity['@id'], person['@id']);
  assert.equal(nodes.find((item) => item['@type'] === 'WebSite')?.url, `${origin}/`);
  const articles = nodes.filter((item) => item['@type'] === 'ScholarlyArticle');
  assert.equal(articles.length, 3);
  for (const article of articles) {
    assert.equal(article.author['@id'], person['@id']);
    assert.match(article.url, /^https:\/\/doi\.org\//);
  }
});

test('los enlaces internos, imágenes, scripts y hojas de estilo apuntan a destinos existentes', async () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, href] of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(ids.has(href), `Ancla inexistente: #${href}`);
  }
  for (const [tag] of html.matchAll(/<(?:img|script|link)\b[^>]*>/g)) {
    const item = attributes(tag);
    const url = item.src ?? item.href;
    if (url?.startsWith('/') && !url.startsWith('//')) {
      await access(resolve(dist, `.${url.split('?')[0]}`));
    }
  }
  for (const path of ['cv-kevin-munoz.pdf', 'site.webmanifest', 'images/Me.PNG', 'apple-touch-icon.png']) {
    await access(resolve(dist, path));
  }
});

test('sitemap y robots conservan el punto de entrada indexado sin fechas artificiales', async () => {
  const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), [`${origin}/`]);
  const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*\s+Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/kevelmun\.dev\/sitemap\.xml/);
  assert.doesNotMatch(sitemap, /workspace|404\.html|410\.html/);
});

test('las páginas de error no publican canonical ni el grafo del perfil', async () => {
  for (const page of ['404.html', '410.html']) {
    const error = await readFile(resolve(dist, page), 'utf8');
    assert.match(error, /noindex/);
    assert.doesNotMatch(error, /rel="canonical"|application\/ld\+json/);
  }
});
