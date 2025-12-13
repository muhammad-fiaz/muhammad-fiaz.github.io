import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ExternalLink } from "lucide-react";

const FEATURED_PROJECTS = [
    {
        name: "zigantic",
        description: "zigantic brings Pydantic-style data validation to Zig, using the type system for compile-time guarantees. Define validation rules as types, parse JSON with automatic error handling, and serialize with zero runtime overhead for unused features.",
        language: "Zig",
        stargazers_count: 4,
        forks_count: 0,
        updated_at: "2025-12-13",
        html_url: "https://github.com/muhammad-fiaz/zigantic"
    },
    {
        name: "mcp.zig",
        description: "A comprehensive Model Context Protocol (MCP) library for Zig — bringing MCP support to the Zig ecosystem.",
        language: "Zig",
        stargazers_count: 4,
        forks_count: 0,
        updated_at: "2025-12-13",
        html_url: "https://github.com/muhammad-fiaz/mcp.zig"
    },
    {
        name: "logly",
        description: "Logly is a Rust-powered, Loguru-like logging library for Python that combines the familiarity of Python’s standard logging API with high-performance logging capabilities.",
        language: "Python",
        stargazers_count: 352,
        forks_count: 7,
        updated_at: "2025-12-13",
        html_url: "https://github.com/muhammad-fiaz/logly"
    },
    {
        name: "logly.zig",
        description: "A production-ready, high-performance structured logging library for Zig with a clean, simplified API.",
        language: "Zig",
        stargazers_count: 26,
        forks_count: 1,
        updated_at: "2025-12-13",
        html_url: "https://github.com/muhammad-fiaz/logly.zig"
    },
    {
        name: "portfolio",
        description: "Welcome to my portfolio repository! This open-source project, built with Next.js and TypeScript, creates a dynamic and responsive portfolio. Explore the code to perfect your showcase of skills!",
        language: "TypeScript",
        stargazers_count: 210,
        forks_count: 53,
        updated_at: "2025-12-12",
        html_url: "https://github.com/muhammad-fiaz/portfolio"
    },
    {
        name: "zig-project-starter",
        description: "a minimal starter template for Zig projects, including build script, source structure, and testing setup.",
        language: "Zig",
        stargazers_count: 1,
        forks_count: 0,
        updated_at: "2025-12-12", // Inferred date or use 12/12/2025
        html_url: "https://github.com/muhammad-fiaz/zig-project-starter"
    }
];

export function Projects() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURED_PROJECTS.map((repo, idx) => (
                    <motion.div
                        key={repo.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        viewport={{ once: true }}
                        className="h-full"
                    >
                    <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="block h-full"
                    >
                        <Card 
                            className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer ring-offset-background transition-colors hover:border-primary/50"
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between items-start gap-2 leading-tight">
                                    <span className="break-words font-bold tracking-tight pb-1 pr-1 text-lg">{repo.name}</span>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50 flex-shrink-0 mt-1" />
                                </CardTitle>
                                <CardDescription className="text-sm pt-2 h-24 overflow-hidden text-muted-foreground/90 leading-relaxed block">
                                    {repo.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pt-2">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {repo.language && <Badge variant="secondary" className="font-normal">{repo.language}</Badge>}
                                    <Badge variant="outline" className="font-normal">Open Source</Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="text-xs text-muted-foreground flex gap-4 mt-auto pt-4 border-t border-border/30 mx-6 px-0">
                                <div className="flex items-center gap-1"><Star className="h-3 w-3" /> {repo.stargazers_count}</div>
                                <div className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {repo.forks_count}</div>
                                <div className="ml-auto text-[10px] uppercase tracking-wider opacity-70">
                                    {new Date(repo.updated_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </div>
                            </CardFooter>
                        </Card>
                    </a>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-center mt-12 w-full">
                <Button variant="outline" className="gap-2" asChild>
                    <a href="https://github.com/muhammad-fiaz?tab=repositories" target="_blank" rel="noreferrer">
                        View all repositories 
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </Button>
            </div>
        </>
    )
}
