"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingTexts = [
  "INITIALIZING NEURAL NETS...",
  "BUFFERING SCROLL CANVAS...",
  "RENDERING VEO 3 ASSETS...",
  "AWAITING DIRECTOR CUE..."
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();
    let isCurrentlyPaused = false;
    let pauseStartTime = 0;
    const duration = 3000; // Total duration ~ 3s

    const updateProgress = () => {
      const now = Date.now();
      let elapsed = now - startTime;

      if (isCurrentlyPaused) {
        if (now - pauseStartTime >= 800) {
          isCurrentlyPaused = false;
          // Shift start time to account for the pause duration
          startTime += 800;
          elapsed = now - startTime;
        } else {
          animationFrameId = requestAnimationFrame(updateProgress);
          return;
        }
      }

      let rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Fast start easing (cubic easeOut)
      let currentProgress = (1 - Math.pow(1 - rawProgress / 100, 3)) * 100;

      // Trigger pause around 45%
      if (currentProgress >= 45 && currentProgress < 50 && !isCurrentlyPaused && pauseStartTime === 0) {
        isCurrentlyPaused = true;
        pauseStartTime = now;
        animationFrameId = requestAnimationFrame(updateProgress);
        return;
      }

      setProgress(Math.floor(currentProgress));

      if (currentProgress < 25) setTextIndex(0);
      else if (currentProgress < 50) setTextIndex(1);
      else if (currentProgress < 75) setTextIndex(2);
      else setTextIndex(3);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 600); // Slight delay at 100% before exit
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
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
          <div className="font-sans font-black text-9xl md:text-[12rem] tracking-tighter tabular-nums z-10 text-white mt-12 leading-none">
            {formattedProgress}%
          </div>

          {/* Background Ambient Glow for flair */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

          {/* Razor-thin Loading Bar */}
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-white origin-left" 
            style={{ width: `${progress}%`, transition: 'width 0.1s ease-out' }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
