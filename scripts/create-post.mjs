import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { localDate, SLUG_PATTERN } from './build-content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function createPost(slug, title = '新文章', projectRoot = root) {
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    throw new Error('Invalid slug: use lowercase letters, numbers and hyphens.');
  }
  if (typeof title !== 'string' || !title.trim()) throw new Error('Title must not be empty.');
  const directory = resolve(projectRoot, 'content/posts');
  await mkdir(directory, { recursive: true });
  const destination = resolve(directory, `${slug}.md`);
  const source = [
    '---', `title: ${JSON.stringify(title.trim())}`, `date: "${localDate()}"`,
    'description: "在这里写一句文章简介。"', 'tags: []', 'draft: true', '---', '',
    '在这里开始写作。准备发布时，将顶部的 `draft: true` 改为 `draft: false`。', '',
  ].join('\n');
  await writeFile(destination, source, { encoding: 'utf8', flag: 'wx' });
  return destination;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [slug, ...title] = process.argv.slice(2);
  createPost(slug, title.length ? title.join(' ') : '新文章')
    .then((destination) => process.stdout.write(`Created draft: ${destination}\n`))
    .catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
