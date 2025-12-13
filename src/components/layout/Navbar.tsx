import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between px-4 max-w-screen-xl mx-auto">
        <div className="font-bold text-xl tracking-tight">
          <a href="/" className="hover:text-primary transition-colors duration-200">Muhammad Fiaz</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" className="hidden sm:flex gap-2 rounded-full font-medium" asChild>
            <a href="https://pay.muhammadfiaz.com" target="_blank" rel="noreferrer">
               <Heart className="h-4 w-4 fill-current" /> Donate
            </a>
          </Button>
          <Button variant="default" size="icon" className="sm:hidden rounded-full" asChild>
            <a href="https://pay.muhammadfiaz.com" target="_blank" rel="noreferrer">
               <Heart className="h-4 w-4 fill-current" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
