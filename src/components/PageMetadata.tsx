import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { siteConfig } from '@/config';
import { posts } from '@/lib/posts';

export function PageMetadata() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const slug = pathname.match(/^\/articles\/([^/]+)\/?$/)?.[1];
    const post = posts.find(item => item.slug === slug);
    const isHome = pathname === '/';
    const isList = /^\/articles\/?$/.test(pathname);
    const exists = isHome || isList || Boolean(post);
    document.title = post ? `${post.title} · ${siteConfig.title}` : isList ? `文章 · ${siteConfig.title}` : isHome ? siteConfig.title : `页面未找到 · ${siteConfig.title}`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute('content', post?.description ?? siteConfig.description);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (exists) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = `https://beteey.github.io${post ? `/articles/${post.slug}/` : isList ? '/articles/' : '/'}`;
    } else canonical?.remove();
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (exists) robots?.remove();
    else {
      if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
      robots.content = 'noindex';
    }
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    else document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [pathname, hash]);
  return null;
}
