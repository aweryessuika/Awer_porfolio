"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function FinalCredits() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

  const rotateX = useTransform(smoothY, [-1, 1], [30, -30]);
  const rotateY = useTransform(smoothX, [-1, 1], [-30, 30]);

  const xOffset = useTransform(smoothX, [-1, 1], [-20, 20]);
  const yOffset = useTransform(smoothY, [-1, 1], [-20, 20]);

  const skills = [
    "Midjourney",
    "Google Veo 3",
    "Sora 2",
    "Generative AI",
    "AI Directing",
    "Prompt Engineering",
    "DaVinci Resolve"
  ];

  const links = [
    { label: "INITIATE EMAIL", href: "mailto:your.email@gmail.com" },
    { label: "INSTAGRAM", href: "https://instagram.com/yourhandle" },
    { label: "+91 COMM LINK", href: "tel:+910000000000" }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        
        @keyframes gradientMesh {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-mesh {
          background-size: 400% 400%;
          animation: gradientMesh 15s ease infinite;
        }
      `}} />

      <section className="h-screen w-full bg-[#050505] relative overflow-hidden flex items-center justify-center p-4 md:p-8">
        {/* Background ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 max-w-[90rem] mx-auto items-center relative z-10 w-full h-full max-h-[900px]"
        >
          
          {/* Left Column: The 100x "Awer Core" */}
          <div 
            className="w-full h-full relative flex items-center justify-center perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <motion.div 
              style={{ 
                rotateX, 
                rotateY,
                x: xOffset,
                y: yOffset
              }}
              className="relative w-[70%] max-w-[450px] aspect-square [transform-style:preserve-3d] flex items-center justify-center"
            >
              {/* Vibrant Liquid Mesh Orb */}
              <motion.div
                animate={{
                  borderRadius: [
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                    "30% 70% 70% 30% / 30% 30% 70% 70%",
                    "50% 50% 20% 80% / 25% 80% 20% 75%",
                    "60% 40% 30% 70% / 60% 30% 70% 40%"
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-full h-full bg-[linear-gradient(-45deg,#6b21a8,#10b981,#1e3a8a,#000000,#4c1d95)] animate-gradient-mesh shadow-[0_0_120px_rgba(16,185,129,0.25)] opacity-90 mix-blend-screen"
              />
              {/* Inner Iridescent Core */}
              <motion.div
                animate={{
                  borderRadius: [
                    "40% 60% 70% 30% / 40% 70% 30% 60%",
                    "70% 30% 30% 70% / 70% 70% 30% 30%",
                    "30% 70% 50% 50% / 50% 30% 70% 50%",
                    "40% 60% 70% 30% / 40% 70% 30% 60%"
                  ],
                  rotate: [0, -90, -180, -360]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-[15%] w-[70%] h-[70%] border-[1px] border-[#10b981]/40 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)] backdrop-blur-md"
              />
              {/* Outer Energy Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[115%] h-[115%] rounded-full border border-white/5 border-t-[#10b981]/50 border-b-[#6b21a8]/50 mix-blend-screen"
              />
            </motion.div>
          </div>

          {/* Right Column: The Director's Breakdown */}
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-5xl md:text-7xl xl:text-8xl tracking-tighter text-white font-black font-syne uppercase leading-[0.9]">
              PRANJAY RATHORE
            </h1>
            <h2 className="italic font-playfair text-lg md:text-xl text-[#10b981] mt-3">
              AI FILMMAKER & CONTENT STRATEGIST.
            </h2>
            
            <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-lg mt-6 font-sans">
              Curious and passionate. I’ve always been interested in how visuals can shape the way people feel and think. Over time, that curiosity led me to generative AI and content strategy—a space where technical execution meets raw storytelling. Through this portfolio, I aim to show my approach as a director who values clarity, edge, and meaning in every frame.
            </p>

            <div className="border-t border-white/10 mt-8 pt-8">
              <p className="text-[10px] md:text-xs tracking-[0.2em] text-white/40 mb-4 uppercase font-syne">
                THE ARSENAL // 2025
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {skills.map((skill) => (
                  <div 
                    key={skill} 
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-[#10b981]/5 border border-[#10b981]/30 rounded-full text-xs md:text-sm font-syne text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-md uppercase tracking-wide"
                  >
                    [ {skill} ]
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 md:gap-5">
              {links.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover="hover"
                  initial="initial"
                  className="text-3xl md:text-4xl xl:text-5xl font-black font-syne uppercase tracking-tighter text-white/40 flex items-center group transition-colors duration-300 w-max cursor-pointer"
                >
                  <motion.span 
                    variants={{
                      initial: { color: "rgba(255, 255, 255, 0.4)", x: 0 },
                      hover: { color: "#10b981", x: 10 }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    [
                  </motion.span>
                  <motion.span 
                    variants={{
                      initial: { color: "rgba(255, 255, 255, 0.4)", x: 0 },
                      hover: { color: "#ffffff", x: 10 }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mx-3 md:mx-4"
                  >
                    {link.label}
                  </motion.span>
                  <motion.span 
                    variants={{
                      initial: { color: "rgba(255, 255, 255, 0.4)", x: 0 },
                      hover: { color: "#10b981", x: 10 }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    ]
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </div>

        </motion.div>

        {/* The Creator Credit (Easter Egg) */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono animate-pulse">
            {"// ARCHITECTURE, CODE, AND CREATIVE DIRECTION BY PRANJAY RATHORE //"}
          </p>
        </div>
      </section>
    </>
  );
}
