import { useState } from 'react';
import { ArticleLayout } from '@/components/ArticleLayout';
import { PostCard } from '@/components/PostCard';
import { posts } from '@/lib/posts';

export function Articles() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('全部');
  const tags = [...new Set(posts.flatMap(post => post.tags))];
  const matches = posts.filter(post => (tag === '全部' || post.tags.includes(tag)) &&
    `${post.title} ${post.description} ${post.tags.join(' ')}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <ArticleLayout>
    <header className="writing-intro"><span className="writing-eyebrow">NOTES & IDEAS</span>
      <h1>文章与思考<span className="writing-dot">.</span></h1>
      <p>记录实践，也给想法留一个慢慢生长的地方。</p>
    </header>
    <div className="writing-tools">
      <div className="writing-filters" aria-label="按标签筛选">
        {['全部', ...tags].map(item => <button key={item} type="button" aria-pressed={tag === item} onClick={() => setTag(item)}>{item}</button>)}
      </div>
      <label className="writing-search"><span className="sr-only">搜索文章</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索文章…" /></label>
    </div>
    <p className="writing-count" role="status">{matches.length} 篇文章</p>
    <div className="writing-list">{matches.map(post => <PostCard key={post.slug} post={post} />)}</div>
    {matches.length === 0 && <div className="writing-empty"><h2>{posts.length === 0 ? '文章正在酝酿中' : '没有找到相关的文章'}</h2><p>{posts.length === 0 ? '下次来看看，也许就有新的想法。' : '试试其他关键词，或者查看全部文章。'}</p>{posts.length > 0 && <button onClick={() => { setQuery(''); setTag('全部'); }}>查看全部文章</button>}</div>}
  </ArticleLayout>;
}
