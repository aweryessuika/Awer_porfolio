"use client";

import { useEffect, useRef, useState } from "react";
import { setSoundOn, useSoundOn } from "@/lib/sound";
import { toTimecode } from "@/lib/motion";

type ReelProps = {
  src: string;
  poster: string;
  title: string;
  /** Classes for the element that wraps the <video> (sizing, rounding). */
  className?: string;
  /** Classes for the controls bar (positioning, colour). */
  controlsClassName?: string;
  videoClassName?: string;
  /** Colour of the controls: light text for dark backdrops, dark text for light ones. */
  tone?: "light" | "dark";
};

const TONES = {
  light: { text: "text-bone", button: "border-bone/30 hover:bg-bone/10", track: "bg-bone/20", fill: "bg-bone" },
  dark: { text: "text-ink", button: "border-ink/25 hover:bg-ink/5", track: "bg-ink/15", fill: "bg-ink" },
} as const;

/**
 * Plays while at least a third of it is on screen, pauses otherwise. Starts
 * muted so autoplay is allowed; the sound button (or clicking the picture)
 * flips a site-wide preference so later reels follow the visitor's choice.
 */
export default function Reel({ src, poster, title, className, controlsClassName, videoClassName, tone = "light" }: ReelProps) {
  const t = TONES[tone];
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const soundOn = useSoundOn();
  const [blocked, setBlocked] = useState(false);
  const inViewRef = useRef(false);

  // Keep the element's muted state in sync with the site-wide preference.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !soundOn;
  }, [soundOn]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const attemptPlay = () => {
      video
        .play()
        .then(() => setBlocked(false))
        .catch(() => {
          // Unmuted autoplay refused: fall back to muted, which browsers allow.
          video.muted = true;
          setSoundOn(false);
          return video.play().then(() => setBlocked(false));
        })
        .catch(() => setBlocked(true));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) attemptPlay();
        else video.pause();
      },
      { threshold: 0.33 },
    );
    observer.observe(wrap);

    let raf = 0;
    const loop = () => {
      const duration = video.duration || 0;
      if (duration > 0) {
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${video.currentTime / duration})`;
        if (tcRef.current) tcRef.current.textContent = toTimecode(video.currentTime, 24);
      }
      raf = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onPause = () => cancelAnimationFrame(raf);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    const next = !soundOn;
    setSoundOn(next);
    if (video) {
      video.muted = !next;
      if (video.paused && inViewRef.current) {
        video
          .play()
          .then(() => setBlocked(false))
          .catch(() => setBlocked(true));
      }
    }
  };

  const playManually = () => {
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => setBlocked(false))
      .catch(() => setBlocked(true));
  };

  return (
    <div ref={wrapRef} className={`group relative ${className ?? ""}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onClick={toggleSound}
        data-cursor={soundOn ? "Mute" : "Sound on"}
        aria-label={`${title} — click to ${soundOn ? "mute" : "turn sound on"}`}
        className={`h-full w-full object-cover ${videoClassName ?? ""}`}
      />

      {blocked ? (
        <button
          type="button"
          onClick={playManually}
          className="pressable absolute inset-0 m-auto h-16 w-16 rounded-full bg-bone font-mono text-[10px] uppercase tracking-[0.18em] text-ink"
        >
          Play
        </button>
      ) : null}

      <div data-reel-controls className={`flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] ${t.text} ${controlsClassName ?? ""}`}>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          className={`pressable inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors duration-200 ${t.button}`}
        >
          <span className="eq" data-on={soundOn} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>{soundOn ? "Sound on" : "Sound off"}</span>
        </button>
        <span className="tabular-nums opacity-70" aria-hidden="true">
          <span ref={tcRef}>00:00:00:00</span>
        </span>
        <span className={`relative hidden h-px w-24 overflow-hidden sm:block ${t.track}`} aria-hidden="true">
          <span ref={progressRef} className={`absolute inset-0 origin-left ${t.fill}`} style={{ transform: "scaleX(0)" }} />
        </span>
      </div>
    </div>
  );
}
