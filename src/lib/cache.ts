/**
 * Centralized Cache Configuration
 * All cache durations and utilities in one place for consistency
 */



/**
 * Default cache duration: 1 hour (in milliseconds)
 * This is used for all API data caching across the application
 */
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (60 minutes)

/**
 * Cache duration in human-readable format
 */
export const CACHE_DURATION_TEXT = "1 hour";

/**
 * Cache duration in seconds (for HTTP cache headers)
 */
export const CACHE_DURATION_SECONDS = 3600; // 1 hour



export const CACHE_KEYS = {
  GITHUB_REPOS: "github-repos-cache",
  GITHUB_PROFILE: "github-profile-cache",
  WAKATIME_STATS: "wakatime-stats-cache",
  PROJECTS_STORE: "projects-storage",
} as const;



interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Generic cache utility for localStorage-based caching
 */
export class LocalStorageCache<T> {
  private readonly key: string;
  private readonly duration: number;

  constructor(key: string, duration: number = CACHE_DURATION) {
    this.key = key;
    this.duration = duration;
  }

  /**
   * Get cached data if valid, otherwise return null
   */
  get(): T | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(this.key);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now < entry.expiresAt) {
        return entry.data;
      }

      // Cache expired, remove it
      this.clear();
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Set data in cache with automatic expiration
   */
  set(data: T): void {
    if (typeof window === "undefined") return;

    try {
      const now = Date.now();
      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt: now + this.duration,
      };
      localStorage.setItem(this.key, JSON.stringify(entry));
    } catch {
      // Ignore localStorage errors (quota exceeded, etc.)
    }
  }

  /**
   * Clear cached data
   */
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.key);
  }

  /**
   * Check if cache exists and is valid
   */
  isValid(): boolean {
    return this.get() !== null;
  }

  /**
   * Get the remaining time until cache expires (in milliseconds)
   */
  getRemainingTime(): number {
    if (typeof window === "undefined") return 0;

    try {
      const cached = localStorage.getItem(this.key);
      if (!cached) return 0;

      const entry: CacheEntry<T> = JSON.parse(cached);
      const remaining = entry.expiresAt - Date.now();
      return Math.max(0, remaining);
    } catch {
      return 0;
    }
  }

  /**
   * Get a formatted string of remaining cache time
   */
  getRemainingTimeText(): string {
    const remaining = this.getRemainingTime();
    if (remaining === 0) return "expired";

    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }
}

/**
 * Create a cached fetch function with automatic caching
 * This is useful for wrapping API calls
 */
export function createCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATION
): {
  fetch: (forceRefresh?: boolean) => Promise<T>;
  clear: () => void;
  isValid: () => boolean;
} {
  const cache = new LocalStorageCache<T>(key, duration);

  return {
    fetch: async (forceRefresh = false): Promise<T> => {
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh) {
        const cached = cache.get();
        if (cached !== null) {
          console.log(`[Cache] Using cached data for: ${key}`);
          return cached;
        }
      }

      // Fetch fresh data
      console.log(`[Cache] Fetching fresh data for: ${key}`);
      const data = await fetcher();
      cache.set(data);
      return data;
    },
    clear: () => cache.clear(),
    isValid: () => cache.isValid(),
  };
}

/**
 * Utility to clear all application caches
 */
export function clearAllCaches(): void {
  if (typeof window === "undefined") return;

  Object.values(CACHE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  
  console.log("[Cache] All application caches cleared");
}

/**
 * Get cache status for all keys
 */
export function getCacheStatus(): Record<string, { exists: boolean; remainingTime: string }> {
  if (typeof window === "undefined") {
    return Object.fromEntries(
      Object.keys(CACHE_KEYS).map((key) => [key, { exists: false, remainingTime: "N/A" }])
    );
  }

  const status: Record<string, { exists: boolean; remainingTime: string }> = {};

  for (const [name, key] of Object.entries(CACHE_KEYS)) {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const entry = JSON.parse(cached);
        const remaining = entry.expiresAt - Date.now();
        const isValid = remaining > 0;
        
        if (isValid) {
          const minutes = Math.floor(remaining / (60 * 1000));
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
          status[name] = {
            exists: true,
            remainingTime: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`,
          };
        } else {
          status[name] = { exists: false, remainingTime: "expired" };
        }
      } else {
        status[name] = { exists: false, remainingTime: "not cached" };
      }
    } catch {
      status[name] = { exists: false, remainingTime: "error" };
    }
  }

  return status;
}
