/**
 * WakaTime API utility functions
 * Fetches coding statistics from WakaTime with client-side caching
 * Cache duration: 1 hour (configured in src/lib/cache.ts)
 */

import { siteConfig } from "@/site.config";
import { CACHE_DURATION, CACHE_KEYS } from "@/lib/cache";

// Cache configuration - uses centralized cache settings
const WAKATIME_CACHE_KEY = CACHE_KEYS.WAKATIME_STATS;
const WAKATIME_CACHE_DURATION = CACHE_DURATION;

// Types for WakaTime API responses
export interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
  hours: number;
  minutes: number;
  digital: string;
}

export interface WakaTimeStats {
  totalSeconds: number;
  totalHours: number;
  totalText: string;
  dailyAverage: string;
  dailyAverageSeconds: number;
  languages: WakaTimeLanguage[];
  editors: { name: string; percent: number; text: string }[];
  operatingSystems: { name: string; percent: number; text: string }[];
  bestDay: { date: string; text: string; total_seconds: number } | null;
  range: { start: string; end: string; text: string };
}

interface CacheData {
  data: WakaTimeStats;
  timestamp: number;
  expiresAt: number;
}

// Get cached WakaTime data
function getCache(): CacheData | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(WAKATIME_CACHE_KEY);
    if (!cached) return null;

    const parsed: CacheData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid using expiresAt or fallback to timestamp
    if (parsed.expiresAt ? now < parsed.expiresAt : now - parsed.timestamp < WAKATIME_CACHE_DURATION) {
      return parsed;
    }

    localStorage.removeItem(WAKATIME_CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

// Set WakaTime cache
function setCache(data: WakaTimeStats): void {
  if (typeof window === "undefined") return;

  try {
    const now = Date.now();
    const cacheData: CacheData = {
      data,
      timestamp: now,
      expiresAt: now + WAKATIME_CACHE_DURATION,
    };
    localStorage.setItem(WAKATIME_CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Ignore localStorage errors
  }
}

// Format seconds to readable time
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k hrs`;
  }
  if (hours > 0) {
    return `${hours} hrs ${minutes} mins`;
  }
  return `${minutes} mins`;
}

// Get language color based on name
export function getWakaTimeLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Zig: "#ec915c",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Bash: "#89e051",
    JSON: "#292929",
    YAML: "#cb171e",
    Markdown: "#083fa1",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Astro: "#ff5d01",
    Other: "#6e7681",
  };

  return colors[language] || colors.Other;
}

/**
 * Fetch WakaTime stats using the public embed API
 * Note: This uses the public stats embed which doesn't require API key
 */
export async function fetchWakaTimeStats(
  forceRefresh: boolean = false
): Promise<WakaTimeStats> {
  // Check cache first
  if (!forceRefresh) {
    const cached = getCache();
    if (cached) {
      console.log("Using cached WakaTime stats");
      return cached.data;
    }
  }

  console.log("Fetching WakaTime stats from API...");

  const username = siteConfig.wakatime.username;

  try {
    // Use the WakaTime share endpoint which is publicly accessible
    const response = await fetch(
      `https://wakatime.com/share/@${username}/3deeedce-ab0e-4f1e-8f0a-5c7c1cd55d41.json`,
      { mode: "cors" }
    );

    if (!response.ok) {
      // Fallback to mock data if API fails
      console.warn("WakaTime API not available, using cached/fallback data");
      const cached = getCache();
      if (cached) return cached.data;
      return getFallbackStats();
    }

    const data = await response.json();

    const stats: WakaTimeStats = {
      totalSeconds: data.data?.grand_total?.total_seconds || 0,
      totalHours: Math.floor((data.data?.grand_total?.total_seconds || 0) / 3600),
      totalText: data.data?.grand_total?.text || "0 hrs",
      dailyAverage: data.data?.daily_average?.text || "0 hrs",
      dailyAverageSeconds: data.data?.daily_average?.seconds || 0,
      languages: (data.data?.languages || []).slice(0, 8).map((lang: any) => ({
        name: lang.name,
        total_seconds: lang.total_seconds,
        percent: lang.percent,
        text: lang.text,
        hours: Math.floor(lang.total_seconds / 3600),
        minutes: Math.floor((lang.total_seconds % 3600) / 60),
        digital: lang.digital,
      })),
      editors: (data.data?.editors || []).map((editor: any) => ({
        name: editor.name,
        percent: editor.percent,
        text: editor.text,
      })),
      operatingSystems: (data.data?.operating_systems || []).map((os: any) => ({
        name: os.name,
        percent: os.percent,
        text: os.text,
      })),
      bestDay: data.data?.best_day
        ? {
            date: data.data.best_day.date,
            text: data.data.best_day.text,
            total_seconds: data.data.best_day.total_seconds,
          }
        : null,
      range: {
        start: data.data?.range?.start || "",
        end: data.data?.range?.end || "",
        text: data.data?.range?.text || "Last 7 Days",
      },
    };

    setCache(stats);
    return stats;
  } catch (error) {
    console.error("Error fetching WakaTime stats:", error);
    const cached = getCache();
    if (cached) return cached.data;
    return getFallbackStats();
  }
}

// Fallback stats when API is unavailable
function getFallbackStats(): WakaTimeStats {
  return {
    totalSeconds: 500000,
    totalHours: 138,
    totalText: "138 hrs",
    dailyAverage: "4 hrs 30 mins",
    dailyAverageSeconds: 16200,
    languages: [
      { name: "Python", total_seconds: 150000, percent: 30, text: "41 hrs", hours: 41, minutes: 0, digital: "41:00" },
      { name: "TypeScript", total_seconds: 120000, percent: 24, text: "33 hrs", hours: 33, minutes: 0, digital: "33:00" },
      { name: "Zig", total_seconds: 100000, percent: 20, text: "27 hrs", hours: 27, minutes: 0, digital: "27:00" },
      { name: "JavaScript", total_seconds: 80000, percent: 16, text: "22 hrs", hours: 22, minutes: 0, digital: "22:00" },
      { name: "Rust", total_seconds: 50000, percent: 10, text: "13 hrs", hours: 13, minutes: 0, digital: "13:00" },
    ],
    editors: [
      { name: "VS Code", percent: 85, text: "117 hrs" },
      { name: "Neovim", percent: 15, text: "21 hrs" },
    ],
    operatingSystems: [
      { name: "Linux", percent: 70, text: "96 hrs" },
      { name: "Windows", percent: 30, text: "42 hrs" },
    ],
    bestDay: { date: "2024-12-25", text: "8 hrs 30 mins", total_seconds: 30600 },
    range: { start: "2024-12-21", end: "2024-12-28", text: "Last 7 Days" },
  };
}

// Clear WakaTime cache
export function clearWakaTimeCache(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WAKATIME_CACHE_KEY);
}
