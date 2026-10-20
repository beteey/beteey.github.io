import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { navigationConfig, footerConfig } from '@/config';
import '@/articles.css';

export function ArticleLayout({ children }: { children: ReactNode }) {
  return <div className="writing-site">
    <a className="writing-skip" href="#writing-main">跳到正文</a>
    <header className="writing-header">
      <Link className="writing-brand" to="/">{navigationConfig.logo}</Link>
      <nav aria-label="文章导航">
        <Link to="/">首页</Link>
        <Link to="/articles/" aria-current="page">文章</Link>
        <a href="/#about">关于我</a>
      </nav>
    </header>
    <main id="writing-main" className="writing-main">{children}</main>
    <footer className="writing-footer">
      <span>{footerConfig.copyright}</span>
      <a href="/#contact">联系我 <span aria-hidden="true">↗</span></a>
    </footer>
  </div>;
}
