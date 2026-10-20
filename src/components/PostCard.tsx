import { Link } from 'react-router';
import { formatDate, postHref, type Post } from '@/lib/posts';

export function PostCard({ post }: { post: Post }) {
  return <article className="post-card">
    <div className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>约 {post.readingMinutes} 分钟</span></div>
    <h2><Link to={postHref(post)}>{post.title}<span aria-hidden="true">↗</span></Link></h2>
    <p>{post.description}</p>
    {post.tags.length > 0 && <div className="post-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
  </article>;
}
