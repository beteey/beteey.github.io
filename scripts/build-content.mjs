import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function localDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

function validateDate(value, rawMatter, filename) {
  // YAML may turn an unquoted ISO date into a Date and normalize invalid days.
  const rawDate = (rawMatter ?? "").match(/^date:\s*(\d{4}-\d{2}-\d{2})(?:\s+#.*)?\s*$/m)?.[1];
  const date = value instanceof Date ? rawDate : value;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${filename}: Invalid date; use YYYY-MM-DD`);
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${filename}: Invalid date ${date}`);
  }
  return date;
}

function sanitizeMarkdown(content) {
  return sanitizeHtml(marked.parse(content, { gfm: true, breaks: false }), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'del', 'input']),
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      th: ['align'], td: ['align'],
      input: ['type', 'checked', 'disabled'],
    },
    allowedClasses: { code: ['language-*'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['https', 'http'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: /^https?:\/\//i.test(attribs.href ?? '')
          ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
          : { href: attribs.href ?? '', ...(attribs.title ? { title: attribs.title } : {}) },
      }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
      input: (tagName, attribs) => ({
        tagName, attribs: { type: 'checkbox', disabled: '', ...(Object.hasOwn(attribs, 'checked') ? { checked: '' } : {}) },
      }),
    },
  });
}

function parsePost({ filename, source }) {
  const { data, content, matter: rawMatter } = matter(source, {});
  for (const field of ['title', 'description']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw new Error(`${filename}: ${field} must be a non-empty string`);
    }
  }
  const date = validateDate(data.date, rawMatter, filename);
  const slug = data.slug ?? filename.replace(/\.md$/i, '');
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) throw new Error(`${filename}: Invalid slug`);
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new Error(`${filename}: draft must be a boolean`);
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string' || !tag.trim()))) {
    throw new Error(`${filename}: tags must be an array of non-empty strings`);
  }
  const chineseCharacters = content.match(/[\p{Script=Han}]/gu)?.length ?? 0;
  const words = content.replace(/[\p{Script=Han}]/gu, '').match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return {
    slug, title: data.title.trim(), date, description: data.description.trim(),
    tags: [...new Set((data.tags ?? []).map((tag) => tag.trim()))],
    draft: data.draft ?? false,
    bodyHtml: sanitizeMarkdown(content),
    readingMinutes: Math.max(1, Math.ceil(chineseCharacters / 400 + words / 200)),
  };
}

export function buildPosts(files, { today = localDate() } = {}) {
  const posts = files.map(parsePost);
  const slugs = new Set();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`Duplicate slug: ${post.slug}`);
    slugs.add(post.slug);
  }
  return posts.filter((post) => !post.draft && post.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export async function generateContent(projectRoot = root) {
  const directory = resolve(projectRoot, 'content/posts');
  const filenames = (await readdir(directory)).filter((name) => name.endsWith('.md')).sort();
  const files = await Promise.all(filenames.map(async (filename) => ({
    filename, source: await readFile(resolve(directory, filename), 'utf8'),
  })));
  const posts = buildPosts(files);
  const destination = resolve(projectRoot, 'src/generated/posts.json');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
  return posts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  generateContent().then((posts) => process.stdout.write(`Generated ${posts.length} published article(s).\n`))
    .catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
