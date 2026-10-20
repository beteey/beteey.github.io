import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { render } from '../node_modules/.cache/site-ssr/entry-server.js';

const siteUrl = 'https://beteey.github.io';
const posts = JSON.parse(await readFile('src/generated/posts.json', 'utf8'));
const template = await readFile('dist/index.html', 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const routes = [
  { path: '/articles/', title: '文章与思考 · Xixi', description: '记录关于 AI 产品体验、实践与日常的思考。' },
  ...posts.map(post => ({ path: `/articles/${post.slug}/`, title: `${post.title} · Xixi`, description: post.description })),
  { path: '/404', title: '页面未找到 · Xixi', description: '链接可能已更改，或者文章还未发布。' },
];
for (const route of routes) {
  const html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(route.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(route.description)}" />`)
    .replace('</head>', `${route.path === '/404' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${siteUrl}${route.path}" />`}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`);
  const target = resolve('dist', route.path === '/404' ? '404.html' : `${route.path.slice(1)}index.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}
await writeFile('dist/.nojekyll', '');
const urls = ['/', ...routes.filter(route => route.path !== '/404').map(route => route.path)];
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${siteUrl}${path}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Generated ${routes.length} static routes, sitemap and 404 page.`);
