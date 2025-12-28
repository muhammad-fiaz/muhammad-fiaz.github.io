/**
 * Site Configuration
 * Single source of truth for all site-wide settings, author information, social links, and analytics.
 */

export const siteConfig = {
  // Site Details
  name: "Muhammad Fiaz",
  title: "Muhammad Fiaz | Full-stack Developer, AI/ML Engineer & Open Source Maintainer",
  description: "Full-stack developer, AI/ML Engineer, and open-source maintainer building developer-first tools, software, and AI applications.",
  url: "https://muhammad-fiaz.github.io",
  ogImage: "https://avatars.githubusercontent.com/u/75434191?v=4",
  locale: "en_US",
  
  // Author Information
  author: {
    name: "Muhammad Fiaz",
    email: "contact@muhammadfiaz.com",
    avatar: "https://avatars.githubusercontent.com/u/75434191?v=4",
    bio: "Full-stack developer, AI/ML Engineer, and open-source maintainer building developer-first tools, software, and AI applications.",
    roles: [
      "Full-stack Developer",
      "Open Source Developer",
      "AI/ML Engineer",
      "Systems Engineer"
    ] as string[],
    location: {
      city: "Madurai",
      region: "Tamil Nadu",
      country: "India"
    }
  },

  // Organization
  organization: {
    name: "Fiaz Technologies",
    url: "https://muhammadfiaz.com",
    logo: "https://avatars.githubusercontent.com/u/75434191?v=4"
  },

  // Social Links
  social: {
    github: "https://github.com/muhammad-fiaz",
    githubUsername: "muhammad-fiaz",
    twitter: "https://x.com/muhammadfiaz_",
    twitterHandle: "@muhammadfiaz_",
    linkedin: "https://www.linkedin.com/in/muhammad-fiaz-",
    medium: "https://muhammad-fiaz.medium.com/",
    hashnode: "https://muhammadfiaz.hashnode.dev/",
    orcid: "https://orcid.org/0009-0001-5935-7878",
    linktree: "https://links.muhammadfiaz.com/",
    portfolio: "https://muhammadfiaz.com",
    sponsors: "https://github.com/sponsors/muhammad-fiaz",
    donate: "https://pay.muhammadfiaz.com/"
  },

  // Analytics & Tracking
  analytics: {
    googleAnalyticsId: "G-6BVYCRK57P",
    googleTagManagerId: "GTM-P4M9T8ZR"
  },

  // Navigation Links
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Works", href: "/works" },
      { name: "Projects", href: "/projects" },
      { name: "Blog", href: "/blog" },
      { name: "About", href: "/#about" }
    ] as Array<{ name: string; href: string }>,
    footer: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Contact", href: "mailto:contact@muhammadfiaz.com" }
    ] as Array<{ name: string; href: string }>
  },

  // GitHub Configuration for Projects
  github: {
    username: "muhammad-fiaz",
    reposPerPage: 30,
    excludedRepos: [] as string[],
    featuredRepos: [
      "zigantic",
      "mcp.zig",
      "logly",
      "logly.zig",
      "portfolio",
      "args.zig"
    ] as string[]
  },

  // WakaTime Configuration
  wakatime: {
    username: "muhammadfiaz",
    // Using WakaTime's public API for stats
    apiBaseUrl: "https://wakatime.com/api/v1"
  },

  // Theme Configuration
  theme: {
    defaultTheme: "dark" as "dark" | "light",
    accentColor: "primary"
  },

  // SEO Defaults
  seo: {
    defaultTitle: "Muhammad Fiaz | Full-stack Developer, AI/ML Engineer & Open Source Maintainer",
    titleTemplate: "%s | Muhammad Fiaz",
    defaultDescription: "Full-stack developer, AI/ML Engineer, and open-source maintainer building developer-first tools, software, and AI applications.",
    keywords: [
      "Muhammad Fiaz",
      "Full-stack Developer",
      "Open Source",
      "AI/ML Engineer",
      "Zig",
      "Python",
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Astro",
      "Software Engineer",
      "Developer Tools",
      "Fiaz Technologies"
    ] as string[],
    robots: "index, follow"
  },

  // External Sitemaps (VitePress documentation sites)
  // These are included in the master sitemap index for comprehensive SEO
  externalSitemaps: [
    // Zig Libraries
    "https://muhammad-fiaz.github.io/args.zig/sitemap.xml",
    "https://muhammad-fiaz.github.io/logly.zig/sitemap.xml",
    "https://muhammad-fiaz.github.io/zon.zig/sitemap.xml",
    "https://muhammad-fiaz.github.io/mcp.zig/sitemap.xml",
    "https://muhammad-fiaz.github.io/updater.zig/sitemap.xml",
    "https://muhammad-fiaz.github.io/zigantic/sitemap.xml",
    
    // Python Libraries  
    "https://muhammad-fiaz.github.io/logly/sitemap.xml",
    "https://muhammad-fiaz.github.io/pywebui/sitemap.xml",
    
    // Other projects with GitHub Pages
    "https://muhammad-fiaz.github.io/portfolio/sitemap.xml",
  ] as string[]
};

// Type exports for TypeScript support
export type SiteConfig = typeof siteConfig;
export type NavItem = (typeof siteConfig.navigation.main)[number];
export type SocialLink = keyof typeof siteConfig.social;

// Helper function to get full URL
export function getFullUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

// Helper function to get page title
export function getPageTitle(title?: string): string {
  if (!title) return siteConfig.seo.defaultTitle;
  return siteConfig.seo.titleTemplate.replace('%s', title);
}

export default siteConfig;
