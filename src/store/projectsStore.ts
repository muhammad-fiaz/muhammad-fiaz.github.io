import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GitHubRepository } from "@/lib/github";
import { CACHE_DURATION } from "@/lib/cache";

type SortOption = "stars" | "forks" | "updated" | "name" | "created";
type SortDirection = "asc" | "desc";

interface ProjectsFilters {
  search: string;
  language: string;
  sort: SortOption;
  direction: SortDirection;
  showForks: boolean;
  showArchived: boolean;
}

interface ProjectsState {
  // Data
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Filters
  filters: ProjectsFilters;

  // Pagination
  currentPage: number;
  perPage: number;

  // Actions
  setRepositories: (repos: GitHubRepository[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastFetched: (timestamp: number) => void;

  // Filter Actions
  setSearch: (search: string) => void;
  setLanguage: (language: string) => void;
  setSort: (sort: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;
  setShowForks: (show: boolean) => void;
  setShowArchived: (show: boolean) => void;
  resetFilters: () => void;

  // Pagination Actions
  setCurrentPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Cache check
  shouldRefetch: () => boolean;
}

const defaultFilters: ProjectsFilters = {
  search: "",
  language: "",
  sort: "stars",
  direction: "desc",
  showForks: true,
  showArchived: false,
};

// Cache duration imported from centralized cache config (1 hour)

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      // Initial state
      repositories: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      filters: defaultFilters,

      currentPage: 1,
      perPage: 12,

      // Data actions
      setRepositories: (repos) =>
        set({ repositories: repos, error: null, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      setLastFetched: (timestamp) => set({ lastFetched: timestamp }),

      // Filter actions
      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
          currentPage: 1,
        })),
      setLanguage: (language) =>
        set((state) => ({
          filters: { ...state.filters, language },
          currentPage: 1,
        })),
      setSort: (sort) =>
        set((state) => ({
          filters: { ...state.filters, sort },
          currentPage: 1,
        })),
      setSortDirection: (direction) =>
        set((state) => ({
          filters: { ...state.filters, direction },
        })),
      toggleSortDirection: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            direction: state.filters.direction === "asc" ? "desc" : "asc",
          },
        })),
      setShowForks: (show) =>
        set((state) => ({
          filters: { ...state.filters, showForks: show },
          currentPage: 1,
        })),
      setShowArchived: (show) =>
        set((state) => ({
          filters: { ...state.filters, showArchived: show },
          currentPage: 1,
        })),
      resetFilters: () =>
        set({
          filters: defaultFilters,
          currentPage: 1,
        }),

      // Pagination actions
      setCurrentPage: (page) => set({ currentPage: page }),
      setPerPage: (perPage) => set({ perPage, currentPage: 1 }),
      nextPage: () =>
        set((state) => ({
          currentPage: state.currentPage + 1,
        })),
      prevPage: () =>
        set((state) => ({
          currentPage: Math.max(1, state.currentPage - 1),
        })),

      // Cache check
      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      },
    }),
    {
      name: "projects-storage",
      partialize: (state) => ({
        repositories: state.repositories,
        lastFetched: state.lastFetched,
        filters: state.filters,
        perPage: state.perPage,
      }),
    }
  )
);

// Selector hooks for computed values
export function useFilteredRepositories() {
  const { repositories, filters } = useProjectsStore();

  return repositories.filter((repo) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower) ||
        repo.topics?.some((topic) => topic.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Language filter
    if (filters.language && repo.language?.toLowerCase() !== filters.language.toLowerCase()) {
      return false;
    }

    // Fork filter
    if (!filters.showForks && repo.fork) {
      return false;
    }

    // Archived filter
    if (!filters.showArchived && repo.archived) {
      return false;
    }

    return true;
  });
}

export function useSortedRepositories() {
  const filteredRepos = useFilteredRepositories();
  const { filters } = useProjectsStore();

  return [...filteredRepos].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (filters.sort) {
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
      return filters.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return filters.direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });
}

export function usePaginatedRepositories() {
  const sortedRepos = useSortedRepositories();
  const { currentPage, perPage } = useProjectsStore();

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    repos: sortedRepos.slice(startIndex, endIndex),
    totalCount: sortedRepos.length,
    totalPages: Math.ceil(sortedRepos.length / perPage),
    hasNextPage: endIndex < sortedRepos.length,
    hasPrevPage: currentPage > 1,
  };
}

export function useRepositoryStats() {
  const { repositories } = useProjectsStore();

  const languages: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;

  for (const repo of repositories) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    totalWatchers += repo.watchers_count;

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }

  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, count]) => ({ language: lang, count }));

  return {
    totalRepos: repositories.length,
    totalStars,
    totalForks,
    totalWatchers,
    languages: sortedLanguages,
    topLanguage: sortedLanguages[0]?.language || "Unknown",
  };
}
