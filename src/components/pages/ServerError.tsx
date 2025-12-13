import * as React from "react";
import { Button } from "@/components/ui/button";

export function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-8">
      {/* Large text */}
      <h1 className="text-8xl md:text-[12rem] font-bold text-destructive/20 select-none leading-none">
        500
      </h1>
      
      {/* Foreground content */}
      <div className="space-y-6 max-w-lg mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Server Error
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
            Something went wrong on our end. Please try again later.
        </p>
        <div className="pt-4">
            <Button size="lg" variant="destructive" className="rounded-full shadow-lg" asChild>
                <a href="/">Return Home</a>
            </Button>
        </div>
      </div>
    </div>
  );
}
