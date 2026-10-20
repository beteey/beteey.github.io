import { Link } from 'react-router';
import { PostCard } from '@/components/PostCard';
import { posts } from '@/lib/posts';
import '@/articles.css';

export function RecentArticles() {
  return <section id="articles" className="recent-articles">
    <div className="container-large px-6 lg:px-12">
      <div className="recent-heading"><div><span className="writing-eyebrow">文章与思考</span><h2>一些正在生长的想法</h2></div><Link to="/articles/">全部文章 <span aria-hidden="true">↗</span></Link></div>
      <div className="recent-list">{posts.slice(0, 3).map(post => <PostCard key={post.slug} post={post} />)}</div>
      {posts.length === 0 && <p className="writing-count">文章正在酝酿中，欢迎下次再来。</p>}
    </div>
  </section>;
}
