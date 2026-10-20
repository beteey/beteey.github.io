import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPosts } from './build-content.mjs';

const article = (name, metadata = '', body = 'Hello world') => ({
  filename: `${name}.md`,
  source: `---\ntitle: Example\ndate: "2026-10-18"\ndescription: A short summary\n${metadata}\n---\n${body}`,
});
const build = (files) => buildPosts(files, { today: '2026-10-18' });

test('published content excludes drafts and future posts entirely', () => {
  const posts = build([
    article('published'),
    article('private', 'draft: true', 'PRIVATE DRAFT'),
    { filename: 'future.md', source: '---\ntitle: Future\ndate: "2026-10-19"\ndescription: Soon\n---\nFUTURE SECRET' },
  ]);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].slug, 'published');
  assert.doesNotMatch(JSON.stringify(posts), /PRIVATE DRAFT|FUTURE SECRET/);
});

test('rejects duplicates, invalid slugs and impossible or malformed dates', () => {
  assert.throws(() => build([article('one', 'slug: same'), article('two', 'slug: same')]), /Duplicate slug/);
  assert.throws(() => build([article('bad', 'slug: ../escape')]), /Invalid slug/);
  for (const date of ['2026-02-30', '2026-13-01', '18-10-2026']) {
    assert.throws(() => build([{ filename: 'bad-date.md', source: `---\ntitle: Bad\ndate: "${date}"\ndescription: Invalid\n---\nBody` }]), /Invalid date/);
  }
});

test('requires title, date and description and validates metadata types', () => {
  for (const field of ['title', 'date', 'description']) {
    const file = article('missing');
    file.source = file.source.replace(new RegExp(`^${field}:.*\\n`, 'm'), '');
    assert.throws(() => build([file]), new RegExp(field));
  }
  assert.throws(() => build([article('bad-tags', 'tags: hello')]), /tags/);
  assert.throws(() => build([article('bad-draft', 'draft: "false"')]), /draft/);
});

test('sanitizes scripts, event attributes and unsafe links; secures external links', () => {
  const [post] = build([article('safe', '', '<script>alert(1)</script>\n<img src="/images/a.png" onerror="alert(1)">\n<a href="javascript:alert(1)">bad</a>\n\n[External](https://example.com)\n\n[Email](mailto:hello@example.com)')]);
  assert.doesNotMatch(post.bodyHtml, /<script|onerror|javascript:/);
  assert.match(post.bodyHtml, /src="\/images\/a.png"/);
  assert.match(post.bodyHtml, /rel="noopener noreferrer"/);
  assert.match(post.bodyHtml, /mailto:hello@example.com/);
});

test('renders GFM and preserves useful Markdown semantics', () => {
  const [post] = build([article('markdown', 'tags: [writing, notes]', '## Heading\n\n> Quote\n\n- Item\n\n```js\nconst x = 1;\n```\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n![Picture](/images/picture.png)')]);
  for (const tag of ['h2', 'blockquote', 'ul', 'pre', 'table', 'img']) assert.match(post.bodyHtml, new RegExp(`<${tag}[ >]`));
  assert.match(post.bodyHtml, /language-js/);
  assert.deepEqual(post.tags, ['writing', 'notes']);
  assert.equal(post.readingMinutes, 1);
  assert.equal(post.draft, false);
});

test('supports unquoted dates and rejects YAML-normalized invalid dates', () => {
  const valid = article('unquoted');
  assert.equal(build([{ ...valid, source: valid.source.replace('"2026-10-18"', '2026-10-18') }])[0].date, '2026-10-18');
  assert.throws(() => build([{ ...valid, source: valid.source.replace('"2026-10-18"', '2026-02-30') }]), /Invalid date/);
});

test('sorts newest first, deduplicates tags and estimates Chinese reading time', () => {
  const earlier = article('earlier');
  earlier.source = earlier.source.replace('2026-10-18', '2026-10-17');
  const posts = build([earlier, article('newer', 'tags: ["笔记", "笔记"]', '文'.repeat(801))]);
  assert.deepEqual(posts.map(({ slug }) => slug), ['newer', 'earlier']);
  assert.deepEqual(posts[0].tags, ['笔记']);
  assert.equal(posts[0].readingMinutes, 3);
});

test('generates output from Markdown files and omits draft content', async () => {
  const { mkdtemp, mkdir, writeFile, readFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { generateContent } = await import('./build-content.mjs');
  const directory = await mkdtemp(join(tmpdir(), 'personal-site-content-'));
  try {
    await mkdir(join(directory, 'content/posts'), { recursive: true });
    await writeFile(join(directory, 'content/posts/public.md'), article('public').source.replace('2026-10-18', '2020-01-01'));
    await writeFile(join(directory, 'content/posts/draft.md'), article('draft', 'draft: true', 'PRIVATE CONTENT').source);
    await writeFile(join(directory, 'content/posts/ignored.txt'), 'Not Markdown');
    const generated = await generateContent(directory);
    assert.equal(generated.length, 1);
    const output = await readFile(join(directory, 'src/generated/posts.json'), 'utf8');
    assert.equal(JSON.parse(output)[0].slug, 'public');
    assert.doesNotMatch(output, /PRIVATE CONTENT/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('new-post helper creates a safe draft and refuses overwrite or traversal', async () => {
  const { mkdtemp, readFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { createPost } = await import('./create-post.mjs');
  const directory = await mkdtemp(join(tmpdir(), 'personal-site-draft-'));
  try {
    const destination = await createPost('my-note', '标题: "第一篇"', directory);
    const source = await readFile(destination, 'utf8');
    assert.match(source, /draft: true/);
    assert.deepEqual(build([{ filename: 'my-note.md', source }]), []);
    await assert.rejects(createPost('my-note', 'Again', directory), /EEXIST/);
    await assert.rejects(createPost('../bad', 'Bad', directory), /Invalid slug/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
