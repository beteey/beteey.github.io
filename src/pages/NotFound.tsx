import { Link } from 'react-router';
import { ArticleLayout } from '@/components/ArticleLayout';

export function NotFound() {
  return <ArticleLayout><section className="writing-empty"><span className="writing-eyebrow">404</span><h1>这页暂时不在这里</h1><p>链接可能已更改，或者文章还未发布。</p><Link className="writing-back" to="/articles/">查看全部文章 →</Link></section></ArticleLayout>;
}
