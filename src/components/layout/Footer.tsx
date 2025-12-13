import { Github, Linkedin, BookOpenText, Hash, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <a href="https://github.com/muhammad-fiaz" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/muhammad-fiaz-/" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="https://muhammad-fiaz.medium.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
            <BookOpenText className="h-5 w-5" />
            <span className="sr-only">Medium</span>
          </a>
          <a href="https://muhammadfiaz.hashnode.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-muted-foreground transition-colors">
            <Hash className="h-5 w-5" />
            <span className="sr-only">Hashnode</span>
          </a>
        </div>

        <div className="text-sm text-muted-foreground">
             <a href="https://pay.muhammadfiaz.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors duration-200">
                <Heart className="h-4 w-4" />
                Support my work
             </a>
        </div>
      </div>
    </footer>
  );
}
