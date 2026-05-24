"use client";

import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Project Alpha",
    category: "AI Short Film",
    year: "2025",
  },
  {
    id: 2,
    title: "Neural Engine",
    category: "Creative Dev",
    year: "2024",
  },
  {
    id: 3,
    title: "Synth Vision",
    category: "Visual Design",
    year: "2024",
  },
];

export default function Projects() {
  return (
    <section className="relative z-10 min-h-screen bg-[#050505] px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-4xl font-light tracking-tight text-[#D4D4D4] md:text-6xl uppercase"
        >
          Selected Work
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <div className="flex w-full items-start justify-between">
                <span className="text-xs uppercase tracking-widest text-[#808080]">
                  {project.category}
                </span>
                <span className="text-xs tracking-wider text-[#808080]">{project.year}</span>
              </div>
              
              <div>
                <h3 className="text-3xl font-light text-[#D4D4D4] transition-all duration-500 group-hover:translate-x-3 group-hover:text-white">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
