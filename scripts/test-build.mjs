import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const posts = JSON.parse(await readFile('src/generated/posts.json', 'utf8'));
for (const path of ['dist/index.html', 'dist/articles/index.html', ...posts.map(post => `dist/articles/${post.slug}/index.html`), 'dist/404.html']) {
  const html = await readFile(path, 'utf8');
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)];
  assert.ok(assets.length >= 2, `${path}: missing client assets`);
  for (const [, asset] of assets) await access(`dist${asset}`);
  assert.ok(!html.includes('src/main.tsx'), `${path}: unbuilt source entry`);
  if (path.includes('/articles/')) assert.match(html, /<h1[ >]/, `${path}: missing server-rendered article content`);
}
for (const post of posts) {
  const html = await readFile(`dist/articles/${post.slug}/index.html`, 'utf8');
  assert.ok(html.includes(post.bodyHtml), `Missing static article body: ${post.slug}`);
}
assert.match(await readFile('dist/404.html', 'utf8'), /noindex/);
console.log('Static routes and direct-link assets verified.');
