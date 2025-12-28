/**
 * GitHub GraphQL API utility functions for fetching repositories
 * Uses client-side caching to prevent unnecessary API calls and rate limiting
 * Cache duration: 1 hour (configured in src/lib/cache.ts)
 */

import { siteConfig } from "@/site.config";
import { CACHE_DURATION, CACHE_KEYS } from "@/lib/cache";

// Cache configuration - uses centralized cache settings
const CACHE_KEY = CACHE_KEYS.GITHUB_REPOS;

interface CacheData {
  data: GitHubRepository[];
  timestamp: number;
  expiresAt: number;
}

// Types for GitHub API responses
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  default_branch: string;
  size: number;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface RepositoryStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  languages: Record<string, number>;
  topLanguage: string;
  mostStarred: GitHubRepository | null;
}

// Language colors for badges
export const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Zig: "#ec915c",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Lua: "#000080",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5d01",
  SCSS: "#c6538c",
  Markdown: "#083fa1",
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#6e7681";
  return languageColors[language] || "#6e7681";
}

// Client-side cache functions
function getCache(): CacheData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CacheData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - parsed.timestamp < CACHE_DURATION) {
      return parsed;
    }
    
    // Cache expired
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setCache(data: GitHubRepository[]): void {
  if (typeof window === "undefined") return;
  
  try {
    const now = Date.now();
    const cacheData: CacheData = {
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Fetch all public repositories for a user using REST API with caching
 */
export async function fetchUserRepositories(
  username: string = siteConfig.github.username,
  forceRefresh: boolean = false
): Promise<GitHubRepository[]> {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getCache();
    if (cached) {
      console.log("Using cached GitHub repositories");
      return cached.data;
    }
  }

  console.log("Fetching GitHub repositories from API...");
  
  const allRepos: GitHubRepository[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated&direction=desc&type=owner`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "muhammad-fiaz-portfolio",
        },
      });

      if (!response.ok) {
        // Check rate limit
        const remaining = response.headers.get("X-RateLimit-Remaining");
        if (remaining === "0") {
          console.warn("GitHub API rate limit reached. Using cached data if available.");
          const cached = getCache();
          if (cached) return cached.data;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos: GitHubRepository[] = await response.json();

      if (repos.length === 0) {
        hasMore = false;
      } else {
        allRepos.push(...repos);
        page++;
        if (repos.length < 100) {
          hasMore = false;
        }
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
      // Try to return cached data on error
      const cached = getCache();
      if (cached) {
        console.log("Returning cached data due to API error");
        return cached.data;
      }
      throw error;
    }
  }

  // Filter out excluded repos
  const filteredRepos = allRepos.filter(
    (repo) => !siteConfig.github.excludedRepos.includes(repo.name)
  );

  // Cache the results
  setCache(filteredRepos);
  
  return filteredRepos;
}

/**
 * Fetch user profile information
 */
export async function fetchUserProfile(
  username: string = siteConfig.github.username
): Promise<GitHubUser> {
  const url = `https://api.github.com/users/${username}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "muhammad-fiaz-portfolio",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch README content for a repository
 */
export async function fetchRepoReadme(
  repoName: string,
  username: string = siteConfig.github.username
): Promise<string | null> {
  const url = `https://api.github.com/repos/${username}/${repoName}/readme`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "muhammad-fiaz-portfolio",
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.text();
  } catch {
    return null;
  }
}

/**
 * Calculate repository statistics
 */
export function calculateStats(repos: GitHubRepository[]): RepositoryStats {
  const languages: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  let mostStarred: GitHubRepository | null = null;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    totalWatchers += repo.watchers_count;

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }

    if (!mostStarred || repo.stargazers_count > mostStarred.stargazers_count) {
      mostStarred = repo;
    }
  }

  const topLanguage = Object.entries(languages).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || "Unknown";

  return {
    totalRepos: repos.length,
    totalStars,
    totalForks,
    totalWatchers,
    languages,
    topLanguage,
    mostStarred,
  };
}

/**
 * Filter and sort repositories
 */
export function filterAndSortRepos(
  repos: GitHubRepository[],
  options: {
    search?: string;
    language?: string;
    sort?: "stars" | "forks" | "updated" | "name" | "created";
    direction?: "asc" | "desc";
    showForks?: boolean;
    showArchived?: boolean;
  } = {}
): GitHubRepository[] {
  const {
    search = "",
    language = "",
    sort = "stars",
    direction = "desc",
    showForks = true,
    showArchived = false,
  } = options;

  let filtered = repos;

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(searchLower))
    );
  }

  // Filter by language
  if (language) {
    filtered = filtered.filter(
      (repo) => repo.language?.toLowerCase() === language.toLowerCase()
    );
  }

  // Filter forks
  if (!showForks) {
    filtered = filtered.filter((repo) => !repo.fork);
  }

  // Filter archived
  if (!showArchived) {
    filtered = filtered.filter((repo) => !repo.archived);
  }

  // Sort
  const sortFn = (a: GitHubRepository, b: GitHubRepository): number => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sort) {
      case "stars":
        aVal = a.stargazers_count;
        bVal = b.stargazers_count;
        break;
      case "forks":
        aVal = a.forks_count;
        bVal = b.forks_count;
        break;
      case "updated":
        aVal = new Date(a.updated_at).getTime();
        bVal = new Date(b.updated_at).getTime();
        break;
      case "created":
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
        break;
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      default:
        aVal = a.stargazers_count;
        bVal = b.stargazers_count;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  };

  return [...filtered].sort(sortFn);
}

/**
 * Get unique languages from repositories
 */
export function getUniqueLanguages(repos: GitHubRepository[]): string[] {
  const languages = new Set<string>();
  for (const repo of repos) {
    if (repo.language) {
      languages.add(repo.language);
    }
  }
  return Array.from(languages).sort();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format relative time
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Format number with abbreviation (e.g., 1.2k)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

/**
 * Get repository thumbnail URL (Open Graph image)
 */
export function getRepoThumbnail(fullName: string): string {
  return `https://opengraph.githubassets.com/1/${fullName}`;
}

/**
 * Clear the GitHub cache (useful for force refresh)
 */
export function clearGitHubCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}
