"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingTexts = [
  "INITIALIZING NEURAL NETWORKS...",
  "BUFFERING SCROLL CANVAS...",
  "RENDERING VEO 3 ASSETS...",
  "AWAITING DIRECTOR CUE..."
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Easing simulation: fast -> slow -> fast snap
    let start = Date.now();
    const duration = 2800; // 2.8 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const rawT = Math.min(elapsed / duration, 1);
      
      // easeInOutCubic equivalent for a cinematic feel
      const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
      
      const currentProgress = Math.floor(t * 100);
      setProgress(currentProgress);

      // Cycle text based on progress intervals
      if (currentProgress < 25) setTextIndex(0);
      else if (currentProgress < 60) setTextIndex(1);
      else if (currentProgress < 90) setTextIndex(2);
      else setTextIndex(3);

      if (rawT < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  // Format progress strictly as 00% to 100%
  const formattedProgress = progress.toString().padStart(2, "0");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ y: "-100vh", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center text-white overflow-hidden"
        >
          {/* Metadata String */}
          <div className="absolute top-[40%] flex justify-center w-full">
            <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">
              {loadingTexts[textIndex]}
            </p>
          </div>

          {/* Massive Counter */}
          <div className="font-sans font-black text-8xl md:text-[9rem] tracking-tighter tabular-nums z-10 text-white mt-12">
            {formattedProgress}%
          </div>

          {/* Background Ambient Glow for flair */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

          {/* Razor-thin Loading Bar */}
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-[#10b981] origin-left" 
            style={{ width: `${progress}%`, transition: 'width 0.1s ease-out' }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
