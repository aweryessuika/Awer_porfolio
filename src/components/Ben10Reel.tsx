"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export default function Ben10Reel() {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      videoRef.current.pause();
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [isInView]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden py-24">
      {/* Cinematic 3D Scroll Reveal Wrapper */}
      <motion.div
        initial={{ y: 200, scale: 0.85, rotateX: 20, opacity: 0 }}
        whileInView={{ y: 0, scale: 1, rotateX: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 1.5 }}
        className="relative flex items-center justify-center"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        {/* Ambient "Omnitrix" Glow */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 z-0 bg-[#10b981] blur-[100px] rounded-full scale-110 pointer-events-none"
        />

        {/* 3D Glassmorphism iPhone Mockup */}
        <div className="relative w-full max-w-[320px] md:max-w-[380px] aspect-[9/16] mx-auto z-10 border-[6px] border-white/10 rounded-[3rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-3xl p-1">
          {/* Dynamic Island (Notch) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 flex items-center justify-center shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">
            {/* Camera lens reflection detail */}
            <div className="w-2 h-2 rounded-full bg-[#050505] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)] ml-auto mr-2" />
          </div>

          {/* Video Player */}
          <video
            ref={videoRef}
            src="/I am not Ben 10..mp4"
            className="w-full h-full object-cover rounded-[2.5rem] bg-[#0a0a0a]"
            loop
            playsInline
          />

          {/* Audio Controls */}
          <button
            onClick={toggleSound}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 sm:left-auto sm:-right-8 sm:top-[60%] sm:translate-x-full z-30 px-5 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full text-[10px] tracking-widest text-white/80 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap shadow-xl"
          >
            {isMuted ? "[ SOUND OFF ]" : "[ SOUND ON ]"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
