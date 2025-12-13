import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const roles = ["Full-stack Developer", "Open Source Maintainer", "Systems Engineer", "AI Enthusiast"];

export function Hero() {
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center py-20 overflow-hidden z-0">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-70 pointer-events-none" />
      
      <div className="container max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
           className="space-y-6 text-left flex flex-col items-start"
        >
            <div className="space-y-2 w-full">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                  Muhammad Fiaz
                </h1>
                <div className="h-8 md:h-12 overflow-hidden w-full relative">
                   <div className="relative h-full w-full">
                    {roles.map((role, index) => (
                      <motion.div
                        key={role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: index === roleIndex ? 1 : 0,
                          y: index === roleIndex ? 0 : -20 
                        }}
                        transition={{ duration: 0.5 }}
                        className="absolute left-0 top-0 text-xl md:text-3xl font-medium text-primary w-full text-left"
                      >
                        {role}
                      </motion.div>
                    ))}
                  </div>
                </div>
            </div>

            <h2 className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
               I build developer-first tools, software, and applications. <br className="hidden md:block"/>
               Full-stack developer working across systems, AI, and open-source software.
            </h2>
            
            <div className="flex gap-4 flex-wrap pt-4">
              <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow" asChild>
                <a href="#projects">View Work</a>
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                <a href="mailto:contact@muhammadfiaz.com">Contact Me</a>
              </Button>
            </div>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-end"
        >
            <div className="relative inline-block p-1 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 backdrop-blur-sm">
                 <img 
                    src="https://avatars.githubusercontent.com/u/75434191?v=4" 
                    alt="Muhammad Fiaz" 
                    width="320"
                    height="320"
                    loading="eager"
                    decoding="async"
                    className="h-56 w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 rounded-2xl object-cover border-4 border-background shadow-2xl skew-y-0 hover:skew-y-1 transition-transform duration-500 ease-out" 
                 />
            </div>
        </motion.div>
      </div>
    </section>
  );
}
