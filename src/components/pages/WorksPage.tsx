import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fetchUserRepositories,
  getLanguageColor,
  formatRelativeTime,
  formatNumber,
  type GitHubRepository,
} from "@/lib/github";
import { siteConfig } from "@/site.config";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Star,
  GitFork,
  Eye,
  ExternalLink,
  ArrowRight,
  Github,
  Clock,
  Sparkles,
  Code2,
  BookOpen,
  Zap,
} from "lucide-react";

// Loading Skeleton for Featured Card
function FeaturedCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sm:p-8 flex items-center justify-center min-h-[200px]">
          <Skeleton className="h-32 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Regular Card Skeleton
function WorkCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-4/5 mt-1" />
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/30 mx-6 px-0 pt-4">
        <div className="flex gap-4 w-full">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
      </CardFooter>
    </Card>
  );
}

// Featured Project Card with Thumbnail
function FeaturedProjectCard({
  repo,
  index,
}: {
  repo: GitHubRepository;
  index: number;
}) {
  const langColor = getLanguageColor(repo.language);
  const isEven = index % 2 === 0;
  
  // Generate Open Graph image URL for the repository
  const thumbnailUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div
        className={cn(
          "group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden",
          "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10",
          "hover:border-primary/30"
        )}
      >
        <div
          className={cn(
            "grid md:grid-cols-2 gap-0",
            !isEven && "md:grid-cols-[1fr_1fr] md:direction-rtl"
          )}
        >
          {/* Content Side */}
          <div
            className={cn(
              "p-6 sm:p-8 lg:p-10 flex flex-col justify-center md:direction-ltr",
              isEven ? "order-1" : "order-2"
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className="gap-1.5 text-xs font-medium"
              >
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
              {repo.language && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: langColor }}
                  />
                  {repo.language}
                </Badge>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
              {repo.name}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {repo.description || "No description available"}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{formatNumber(repo.stargazers_count)}</span>
                <span className="hidden sm:inline">stars</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <GitFork className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{formatNumber(repo.forks_count)}</span>
                <span className="hidden sm:inline">forks</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="font-medium">{formatNumber(repo.watchers_count)}</span>
                <span className="hidden sm:inline">watchers</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatRelativeTime(repo.updated_at)}</span>
              </div>
            </div>

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {repo.topics.slice(0, 5).map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full gap-2 group/btn" asChild>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
              {repo.homepage && (
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  asChild
                >
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Thumbnail Side */}
          <div
            className={cn(
              "relative bg-gradient-to-br flex items-center justify-center min-h-[250px] md:min-h-[350px] md:direction-ltr overflow-hidden p-4",
              isEven
                ? "from-primary/5 via-primary/10 to-secondary/5 order-2"
                : "from-secondary/5 via-secondary/10 to-primary/5 order-1"
            )}
          >
            {/* Repository Thumbnail - contains/fits in container */}
            <div className="relative w-full h-full flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src={thumbnailUrl}
                alt={`${repo.name} preview`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xl"
                loading="lazy"
                onError={(e) => {
                  // Fallback to a code icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              {/* Fallback icon (hidden by default) */}
              <div className="hidden flex-col items-center justify-center text-center w-full h-full">
                <div className="rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 p-6 shadow-xl">
                  <Code2 className="h-16 w-16 text-primary" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground font-medium">
                  {repo.language || "Code"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Regular Work Card
function WorkCard({
  repo,
  index,
}: {
  repo: GitHubRepository;
  index: number;
}) {
  const langColor = getLanguageColor(repo.language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full group"
      >
        <Card
          className={cn(
            "h-full flex flex-col transition-all duration-300",
            "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
            "border-border/50 bg-card/50 backdrop-blur-sm",
            "hover:border-primary/50"
          )}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-start gap-2">
              <span className="break-words font-bold tracking-tight text-lg leading-tight group-hover:text-primary transition-colors">
                {repo.name}
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </CardTitle>
            <CardDescription className="text-sm pt-2 min-h-[3rem] line-clamp-2 text-muted-foreground/90 leading-relaxed">
              {repo.description || "No description available"}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 pt-2">
            <div className="flex flex-wrap gap-2">
              {repo.language && (
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: langColor }}
                  />
                  {repo.language}
                </Badge>
              )}
              {repo.topics?.slice(0, 2).map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="font-normal text-xs"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground flex gap-4 mt-auto pt-4 border-t border-border/30 mx-6 px-0">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{formatNumber(repo.stargazers_count)}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              <span>{formatNumber(repo.forks_count)}</span>
            </div>
            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70">
              {formatRelativeTime(repo.updated_at)}
            </span>
          </CardFooter>
        </Card>
      </a>
    </motion.div>
  );
}

// Main Works Page Component
export function WorksPageContent() {
  const [repositories, setRepositories] = React.useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch repositories on mount
  React.useEffect(() => {
    async function fetchRepos() {
      try {
        const repos = await fetchUserRepositories(siteConfig.github.username);
        setRepositories(repos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch repositories"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchRepos();
  }, []);

  // Get featured projects (highest stars, part of featured list or top by stars)
  const featuredRepos = React.useMemo(() => {
    const featuredNames = siteConfig.github.featuredRepos;
    
    // First try to get repos from the featured list
    const fromFeaturedList = repositories
      .filter((repo) => featuredNames.includes(repo.name))
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    // If not enough, get top starred repos
    if (fromFeaturedList.length < 3) {
      const topStarred = repositories
        .filter((repo) => !repo.fork && !featuredNames.includes(repo.name))
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3 - fromFeaturedList.length);
      return [...fromFeaturedList, ...topStarred];
    }
    
    return fromFeaturedList;
  }, [repositories]);

  // Get recent popular projects (recently updated + good stars, not featured)
  const recentPopularProjects = React.useMemo(() => {
    const featuredNames = siteConfig.github.featuredRepos;
    const featuredIds = featuredRepos.map(r => r.id);
    
    return repositories
      .filter((repo) => !repo.fork && !featuredIds.includes(repo.id) && !featuredNames.includes(repo.name))
      .sort((a, b) => {
        // Sort by a combination of recency and popularity
        const aScore = a.stargazers_count + (new Date(a.updated_at).getTime() / 1000000000);
        const bScore = b.stargazers_count + (new Date(b.updated_at).getTime() / 1000000000);
        return bScore - aScore;
      })
      .slice(0, 6);
  }, [repositories, featuredRepos]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4" />
              Featured Work
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              My Works
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              A curated collection of my most impactful open-source projects.
              From developer tools to AI/ML libraries, all dynamically fetched from GitHub.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="pb-16 sm:pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-8 mb-16">
              <FeaturedCardSkeleton />
              <FeaturedCardSkeleton />
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-8"
            >
              <p className="text-destructive text-sm">{error}</p>
            </motion.div>
          )}

          {!isLoading && !error && (
            <>
              {/* Featured Projects */}
              <div className="space-y-8 mb-16">
                {featuredRepos.map((repo, index) => (
                  <FeaturedProjectCard key={repo.id} repo={repo} index={index} />
                ))}
              </div>

              {/* More Projects Section */}
              {recentPopularProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Recent Popular
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Recently updated projects with community traction
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2" asChild>
                      <a href="/projects">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recentPopularProjects.map((repo, index) => (
                      <WorkCard key={repo.id} repo={repo} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full gap-2 shadow-lg shadow-primary/20"
                asChild
              >
                <a href="/projects">
                  <BookOpen className="h-5 w-5" />
                  Explore All Projects
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full gap-2"
                asChild
              >
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  View GitHub Profile
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
