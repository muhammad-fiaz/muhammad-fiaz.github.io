import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-8">
      {/* Large text */}
      <h1 className="text-8xl md:text-[12rem] font-bold text-primary/20 select-none leading-none">
        404
      </h1>
      
      {/* Foreground content */}
      <div className="space-y-6 max-w-lg mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
            The page you are looking for doesn't exist or has been moved. 
            Double-check the URL or navigate back home.
        </p>
        <div className="pt-4">
            <Button size="lg" className="rounded-full shadow-lg" asChild>
                <a href="/">Return Home</a>
            </Button>
        </div>
      </div>
    </div>
  );
}
