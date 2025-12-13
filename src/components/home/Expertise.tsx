import * as React from "react";
import { motion } from "framer-motion";
import { Layers, Cpu, Terminal, GitBranch, Globe, Database } from "lucide-react";

export function Expertise() {
    const skills = [
        { title: "Full-stack development", icon: Layers },
        { title: "Developer-first tooling", icon: Terminal },
        { title: "Systems & backend software", icon: Database },
        { title: "AI & ML driven apps", icon: Cpu },
        { title: "Open-source maintenance", icon: GitBranch },
    ];

  return (
    <section id="expertise" className="min-h-screen flex items-center justify-center py-20 relative">
       <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
             
             <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
             >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What I Do</h2>
                <div className="grid gap-6">
                    {skills.map((s, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 group"
                        >
                            <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                                <s.icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-xl font-medium">{s.title}</span>
                        </motion.div>
                    ))}
                </div>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-12"
             >
                <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
                        <GitBranch className="h-4 w-4" /> Open Source
                     </div>
                     <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                        I am an <strong className="text-foreground">open-source contributor and maintainer</strong>, focused on building and maintaining tools that developers can rely on long-term.
                     </p>
                </div>

                <div className="space-y-4 pt-8 border-t border-border">
                     <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
                        <Globe className="h-4 w-4" /> Engineering Philosophy
                     </div>
                     <p className="text-lg text-muted-foreground leading-relaxed">
                        I work across <strong className="text-foreground">multiple programming languages and frameworks</strong> (Python, Rust, Zig, Go, TypeScript), choosing the right tool for each problem instead of locking into a single stack.
                     </p>
                </div>
             </motion.div>

          </div>
       </div>
    </section>
  );
}
