# Xixi · 个人网站与文章

保留原有个人首页，增加文章列表、搜索、标签筛选和 Markdown 阅读页。

- 首页：https://beteey.github.io/
- 文章：https://beteey.github.io/articles/
- 技术：React、TypeScript、Vite；构建时转换 Markdown，并预生成每篇文章的 HTML。

## 写一篇文章

在 `content/posts/` 新建文件，例如 `my-first-post.md`：

```markdown
---
title: "我的第一篇文章"
date: "2026-10-18"
description: "用一句话介绍这篇文章。"
tags: ["随笔", "产品思考"]
draft: false
---

这里开始写正文。

## 一个小标题

可以写 **加粗文字**、列表、引用、代码、表格和图片。
```

文件名使用小写英文字母、数字和连字符；上面的文章地址是 `/articles/my-first-post/`。也可以在顶部设置 `slug: my-first-post`，此后保持 slug 不变就能保留文章链接。标题、日期和摘要必填；日期使用 `YYYY-MM-DD`。

图片放入 `public/images/`，在文章里写 `![图片说明](/images/文件名.jpg)`。不要使用本机绝对路径。

### 在 GitHub 网页上写

1. 打开仓库的 `content/posts` 文件夹。
2. 点击 **Add file → Create new file**，填写文件名和上述内容。
3. 确认 `draft: false`，日期不晚于今天，点击 **Commit changes** 提交到 `main`。
4. **Actions** 中的 `Publish personal website` 成功后，网站自动更新。

修改现有文章：打开对应 `.md` 文件，点击铅笔，编辑后提交。保留文件名或 slug，旧链接就不会改变。

### 在电脑上写

```sh
npm ci
npm run new:post -- my-first-post "我的第一篇文章"
npm run dev
```

新建文章默认为草稿。在编辑器中打开生成的文件，填写摘要和正文，准备好后把 `draft: true` 改为 `false`。开发预览会监听 Markdown 文件变化，保存后自动更新。格式不合法时，终端会显示错误。

发布：

```sh
git add content/posts public/images
git commit -m "docs: publish a new article"
git push origin main
```

### 草稿与日期

- `draft: true` 的文章不会进入网站的列表、静态页面或浏览器 JavaScript。
- 日期晚于构建当天（Asia/Taipei）的文章也不进入网站；到日期后需要再次提交或在 Actions 手动运行，**没有自动定时发布**。
- **这个仓库是公开的：草稿只隐藏于网站，提交到仓库的 Markdown 源文件仍然公开。私密笔记请保留在仓库之外。**
- `welcome.md` 是公开的写作指南示例，可改写或删除；`draft-example.md` 是不展示在网站中的草稿示例。

## 修改个人首页

名字、自我介绍、项目和联系方式集中在 `src/config.ts`，图片在 `public/images/`。原有首页设计和内容保持保留；首页增加了最新文章区和文章导航。

## 构建与验证

```sh
npm test
npm run build
npm run test:build
npm run preview
```

`npm run build` 会校验并生成文章内容，检查 TypeScript，构建前端，再预生成 `/articles/` 和每篇文章的 `index.html`。因此 GitHub Pages 上直接打开或刷新文章链接也能正常工作，文章正文在 HTML 中即可读取。

找不到的文章显示 404 页面。GitHub Pages 无需自定义域名，Vite 的 `base` 为 `/`，对应用户主页仓库 `beteey.github.io`。

## GitHub Pages

仓库 **Settings → Pages → Source** 设置为 **GitHub Actions**。工作流位于 `.github/workflows/pages.yml`，提交到 `main` 后依次安装依赖、运行测试、构建并部署。发布目录是 `dist`，不用手动上传该目录。

本地 `.claude` 配置、环境变量文件、依赖和构建缓存不进入 Git。文章目录属于公开网站源代码。
