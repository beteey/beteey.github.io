import publishedPosts from '../generated/posts.json';

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  bodyHtml: string;
  readingMinutes: number;
}

export const posts: Post[] = publishedPosts;
export const postHref = (post: Pick<Post, 'slug'>) => `/articles/${post.slug}/`;
export const formatDate = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Taipei',
}).format(new Date(`${date.slice(0, 10)}T00:00:00+08:00`));
