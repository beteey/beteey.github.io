// ============================================================
// 站点配置 · 所有文案都在这个文件里修改
// 带 【改我】 注释的地方是上线前建议你替换的占位内容
// ============================================================

export interface SiteConfig {
  language: string;
  title: string;
  description: string;
}

export const siteConfig: SiteConfig = {
  language: "zh-CN",
  title: "Xixi · 产品经理", // 【改我】换成你的名字/昵称
  description: "产品经理 Xixi 的个人网站：关注 AI 产品体验、Agent 交互与 AI 技术落地。",
};

// 导航栏
export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  links: NavLink[];
  contactLabel: string;
  contactHref: string;
}

export const navigationConfig: NavigationConfig = {
  logo: "Xixi", // 【改我】
  links: [
    { label: "关于", href: "#about" },
    { label: "专注领域", href: "#services" },
    { label: "项目", href: "#portfolio" },
    { label: "文章", href: "/articles/" },
    { label: "联系", href: "#contact" },
  ],
  contactLabel: "联系我",
  contactHref: "#contact",
};

// 首屏 Hero
export interface HeroConfig {
  name: string;
  roles: string[];
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  name: "XIXI", // 【改我】大号名字，建议 2-6 个字符效果最佳
  roles: ["产品经理", "AI 产品体验"], // 左右两侧的竖排身份标签
  backgroundImage: "/images/hero-bg.jpg",
};

// 关于我
export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface AboutConfig {
  label: string;
  description: string;
  experienceValue: string;
  experienceLabel: string;
  stats: AboutStat[];
  images: AboutImage[];
}

export const aboutConfig: AboutConfig = {
  label: "关于我",
  description:
    "我是一名产品经理，专注于 AI 产品体验与 AI 技术的落地。我关心模型能力的边界，也在意每一个交互细节——相信好的 AI 产品，诞生在技术能力与人文体验的交叉点上。", // 【改我】你的自我介绍
  experienceValue: "", // 留空则不显示大数字徽章
  experienceLabel: "",
  stats: [
    { value: "50+", label: "深度拆解的 AI 产品" }, // 【改我】
    { value: "3", label: "持续追踪的方向" },
    { value: "∞", label: "对体验的好奇心" },
  ],
  images: [
    { src: "/images/about-1.jpg", alt: "工作场景" },
    { src: "/images/about-2.jpg", alt: "灵感瞬间" },
  ],
};

// 专注领域
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesConfig {
  label: string;
  heading: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  label: "专注领域",
  heading: "我在关注什么",
  services: [
    {
      iconName: "Sparkles",
      title: "AI 产品体验",
      description:
        "持续拆解主流 AI 产品的交互细节与体验决策，关注从对话框到多模态、从工具到伙伴的体验演进。",
      image: "/images/service-1.jpg",
    },
    {
      iconName: "Bot",
      title: "Agent 与交互范式",
      description:
        "研究 Agent 产品的任务编排、人机协作的信任边界，以及对话之外正在出现的新交互形态。",
      image: "/images/service-2.jpg",
    },
    {
      iconName: "Gauge",
      title: "模型能力评估",
      description:
        "跟踪前沿模型的能力边界，用产品视角建立评测维度，让技术选型和体验设计有据可依。",
      image: "/images/service-3.jpg",
    },
    {
      iconName: "Compass",
      title: "产品战略与落地",
      description:
        "从需求洞察到 MVP 验证，关注 AI 技术如何真正解决用户问题，并在真实业务中创造可持续的价值。",
      image: "/images/service-4.jpg",
    },
  ],
};

// 项目与实践
// 每个项目可选填 link：
//   - 在线项目：填网址，如 "https://example.com"，点卡片新标签页打开
//   - 本地文件：把文件放进 public/files/（Axure 导出的 HTML 文件夹放 public/prototypes/），
//     然后填站内路径，如 "/files/xxx.pdf" 或 "/prototypes/xxx/index.html"
export interface ProjectItem {
  title: string;
  category: string;
  year: string;
  image: string;
  featured?: boolean;
  link?: string;
}

export interface PortfolioCTA {
  label: string;
  heading: string;
  linkText: string;
  linkHref: string;
}

export interface PortfolioConfig {
  label: string;
  heading: string;
  description: string;
  projects: ProjectItem[];
  cta: PortfolioCTA;
  viewAllLabel: string;
}

export const portfolioConfig: PortfolioConfig = {
  label: "项目与实践",
  heading: "做过和正在做的事",
  description: "一些代表性实践的剪影，更多细节脱敏后会在博客里持续更新。", // 【改我】
  projects: [
    {
      title: "AI 对话产品体验拆解库", // 【改我】换成你的真实项目
      category: "产品研究",
      year: "2026",
      image: "/images/portfolio-1.jpg",
      featured: true,
    },
    {
      title: "Agent 任务流交互原型",
      category: "交互设计",
      year: "2026",
      image: "/images/portfolio-2.jpg",
    },
    {
      title: "大模型评测维度体系",
      category: "模型评测",
      year: "2025",
      image: "/images/portfolio-3.jpg",
    },
    {
      title: "AI 产品观察 · 写作计划",
      category: "内容输出",
      year: "2025",
      image: "/images/portfolio-4.jpg",
    },
  ],
  cta: {
    label: "更多",
    heading: "更多实践与思考，欢迎来交流",
    linkText: "联系我",
    linkHref: "#contact",
  },
  viewAllLabel: "",
};

// 推荐语（个人网站用不上，留空即不渲染）
export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

export interface TestimonialsConfig {
  label: string;
  heading: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  label: "",
  heading: "",
  testimonials: [],
};

// 联系版块
export interface CTAConfig {
  tags: string[];
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  email: string;
  backgroundImage: string;
}

export const ctaConfig: CTAConfig = {
  tags: ["产品经理", "AI 产品体验", "Agent", "模型评测"],
  heading: "一起聊聊 AI 产品的可能性",
  description: "无论是合作机会、观点交流，还是单纯打个招呼——都欢迎写信给我。",
  buttonText: "给我写邮件",
  buttonHref: "mailto:lcq2412545687@163.com", // 【改我】你的邮箱
  email: "lcq2412545687@163.com", // 【改我】
  backgroundImage: "/images/cta-bg.jpg",
};

// 页脚
export interface FooterLinkColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterConfig {
  logo: string;
  description: string;
  columns: FooterLinkColumn[];
  socialLinks: SocialLink[];
  newsletterHeading: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  newsletterPlaceholder: string;
  copyright: string;
  credit: string;
}

export const footerConfig: FooterConfig = {
  logo: "Xixi", // 【改我】
  description: "产品经理，关注 AI 产品体验与 AI 技术。这里记录我的实践与思考。",
  columns: [
    {
      title: "导航",
      links: [
        { label: "关于", href: "#about" },
        { label: "专注领域", href: "#services" },
        { label: "项目", href: "#portfolio" },
        { label: "文章", href: "/articles/" },
        { label: "联系", href: "#contact" },
      ],
    },
    {
      title: "常去的地方",
      links: [
        { label: "即刻", href: "https://m.okjike.com/" }, // 【改我】你的主页链接
        { label: "微信公众号", href: "#" },
        { label: "X（推特）", href: "https://x.com/" },
      ],
    },
  ],
  socialLinks: [
    { iconName: "Mail", href: "mailto:lcq2412545687@163.com", label: "邮箱" }, // 【改我】
    { iconName: "Github", href: "https://github.com/", label: "GitHub" },
    { iconName: "X", href: "https://x.com/", label: "X" },
    { iconName: "Linkedin", href: "https://www.linkedin.com/", label: "LinkedIn" },
  ],
  newsletterHeading: "",
  newsletterDescription: "",
  newsletterButtonText: "",
  newsletterPlaceholder: "",
  copyright: "© 2026 Xixi. 保留所有权利。", // 【改我】备案后在这里加 ICP 备案号
  credit: "Built with React · Published on GitHub Pages",
};
