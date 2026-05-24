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
    if (typeof window === 'undefined') return;

    // We attach images to the window object so ScrollyCanvas can instantly grab them
    // @ts-ignore
    window.__SEQUENCE_IMAGES__ = window.__SEQUENCE_IMAGES__ || [];
    
    // @ts-ignore
    if (window.__SEQUENCE_IMAGES__.length === 91 && window.__SEQUENCE_IMAGES__[90].complete) {
      setProgress(100);
      setIsLoading(false);
      return;
    }

    // @ts-ignore
    window.__SEQUENCE_IMAGES__ = [];
    
    let loadedCount = 0;
    const totalFrames = 91;
    const pad = (num: number) => num.toString().padStart(3, "0");

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      
      const handleLoad = () => {
        loadedCount++;
        const currentProgress = Math.floor((loadedCount / totalFrames) * 100);
        setProgress(currentProgress);

        // Cycle text based on real loading intervals
        if (currentProgress < 25) setTextIndex(0);
        else if (currentProgress < 60) setTextIndex(1);
        else if (currentProgress < 90) setTextIndex(2);
        else setTextIndex(3);

        if (loadedCount === totalFrames) {
          setTimeout(() => {
            setIsLoading(false);
          }, 600); // Give it a slight beat at 100% before dismissing
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad; // Ensure we don't infinitely hang if 1 image fails

      img.src = `/sequence/frame_${pad(i)}_delay-0.07s.png`;
      // @ts-ignore
      window.__SEQUENCE_IMAGES__.push(img);
    }
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
