import { Link, useParams } from 'react-router';
import { ArticleLayout } from '@/components/ArticleLayout';
import { formatDate, postHref, posts } from '@/lib/posts';
import { NotFound } from './NotFound';

export function Article() {
  const { slug } = useParams();
  const index = posts.findIndex(post => post.slug === slug);
  const post = posts[index];
  if (!post) return <NotFound />;
  const next = posts[index + 1] ?? (index > 0 ? posts[index - 1] : undefined);
  return <ArticleLayout>
    <article className="reading-page">
      <Link className="writing-back" to="/articles/">← 全部文章</Link>
      <header className="reading-header">
        <div className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>约 {post.readingMinutes} 分钟</span></div>
        <h1>{post.title}</h1><p className="reading-description">{post.description}</p>
        <div className="post-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </header>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
      <nav className="reading-end" aria-label="继续阅读"><Link to="/articles/">← 返回文章列表</Link>{next && <Link to={postHref(next)}><span>继续阅读</span>{next.title} →</Link>}</nav>
    </article>
  </ArticleLayout>;
}
