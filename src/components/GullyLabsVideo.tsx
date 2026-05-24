"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export default function GullyLabsVideo() {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      // Aggressively set default state to unmuted before playing
      videoRef.current.muted = false;
      setIsMuted(false);
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks the play (Autoplay Policy), force mute and play anyway
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true); // Update the button UI to say SOUND OFF
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isInView, isMuted]); // Ensure isMuted is in the dependency array

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center py-24 overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[85%] max-w-[1600px] aspect-video"
      >
        <video ref={videoRef} src="/glad.mp4" loop playsInline className="w-full h-full object-cover" />

        <button
          onClick={toggleSound}
          className="absolute bottom-6 right-6 z-30 px-6 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-full text-sm font-bold tracking-[0.2em] text-white hover:bg-white/20 transition-all duration-300"
        >
          {isMuted ? "[ SOUND OFF ]" : "[ SOUND ON ]"}
        </button>
      </motion.div>
    </section>
  );
}
