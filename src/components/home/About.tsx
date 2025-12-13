import * as React from "react";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 relative bg-muted/20">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7 }}
           className="space-y-8 text-center md:text-left"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
             About Me
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
             Hi, I'm Muhammad Fiaz. <br />
             <span className="text-muted-foreground">Product-focused builder & open-source maintainer.</span>
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            <p>
              I am a <strong className="text-foreground font-semibold">Full-stack developer</strong> based in Madurai, India, architecting software across the stack. My toolkit includes <strong className="text-foreground font-semibold">JavaScript, React, Node.js, Astro, Svelte</strong>, and high-performance backends with <strong className="text-foreground font-semibold">FastAPI, Python, Rust, and Zig</strong>.
            </p>
            <p>
              I don't just write code; I build ecosystems. From maintaining libraries like <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono text-sm">logly</code> and <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono text-sm">zigantic</code> to developing AI-driven applications, my focus is on creating developer tooling that stands the test of time.
            </p>
            <p>
               Every project I undertake is driven by a need to solve real-world problems with efficiency and scale. I am constantly shipping new software, exploring the edges of system performance, and contributing back to the open-source community that empowers us all.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
