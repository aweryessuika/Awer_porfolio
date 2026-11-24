"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, toTimecode } from "@/lib/motion";
import { FRAME_COUNT, onSequenceProgress, startSequenceLoad } from "@/lib/sequence";
import { markIntroDone } from "@/lib/intro";

const MIN_SHOW_MS = 1500;
const MAX_WAIT_MS = 7000;

/**
 * Film-leader preloader. The counter tracks the real hero frame download
 * (not a fake timer), with a floor so it never flashes and a ceiling so a slow
 * connection never traps the visitor.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.classList.add("is-loading");
    window.scrollTo(0, 0);
    startSequenceLoad();

    const reduce = prefersReducedMotion();
    const begin = performance.now();
    let target = 0;
    let shown = 0;
    let exiting = false;
    let raf = 0;
    let exitTimeline: gsap.core.Timeline | null = null;

    const offProgress = onSequenceProgress((loaded, total) => {
      target = (loaded / total) * 100;
      if (framesRef.current) {
        framesRef.current.textContent = `${String(loaded).padStart(3, "0")}/${String(total).padStart(3, "0")}`;
      }
    });

    const finish = () => {
      document.documentElement.classList.remove("is-loading");
      setGone(true);
    };

    const exit = () => {
      exiting = true;
      if (reduce) {
        markIntroDone();
        exitTimeline = gsap.timeline({ onComplete: finish }).to(root, { autoAlpha: 0, duration: 0.35, ease: "power1.out" });
        return;
      }
      exitTimeline = gsap
        .timeline({ onComplete: finish })
        .to("[data-pl-count]", { yPercent: -110, duration: 0.7, ease: "power3.inOut" })
        .to("[data-pl-meta]", { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, 0)
        .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "power4.inOut" }, 0.35)
        .call(markIntroDone, [], 0.75);
    };

    const loop = (now: number) => {
      const elapsed = now - begin;
      if (elapsed > MAX_WAIT_MS) target = 100;
      shown += (target - shown) * 0.09;
      if (target - shown < 0.4) shown = target;

      if (countRef.current) countRef.current.textContent = String(Math.round(shown)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown / 100})`;
      if (tcRef.current) tcRef.current.textContent = toTimecode(elapsed / 1000);

      if (!exiting && shown >= 100 && elapsed >= (reduce ? 200 : MIN_SHOW_MS)) exit();
      if (!exiting) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      offProgress();
      exitTimeline?.kill();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      role="status"
      aria-live="polite"
      aria-label="Loading the showreel"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink text-bone"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* Academy-leader rings */}
      <div data-pl-meta className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="relative aspect-square w-[min(72vw,30rem)]">
          <div className="absolute inset-0 rounded-full border border-bone/10" />
          <div className="absolute inset-[12%] rounded-full border border-bone/[0.07]" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-bone/[0.07]" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-bone/[0.07]" />
          <div
            className="absolute inset-0 animate-[spin_1.2s_linear_infinite] rounded-full motion-reduce:animate-none"
            style={{
              background: "conic-gradient(from 0deg, rgba(77,141,255,0.22), rgba(77,141,255,0) 22%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <div className="relative overflow-hidden">
        <span
          ref={countRef}
          data-pl-count
          className="block font-display text-[clamp(7rem,26vw,19rem)] leading-[0.82] tabular-nums tracking-tight"
        >
          000
        </span>
      </div>

      <div data-pl-meta className="absolute inset-x-0 top-0 flex justify-between p-[var(--gutter)] font-mono text-[10px] uppercase tracking-[0.22em] text-bone/50">
        <span>Pranjay Rathore — Showreel</span>
        <span>Reel 01 / {FRAME_COUNT} fr</span>
      </div>

      <div data-pl-meta className="absolute inset-x-0 bottom-0 flex items-end justify-between p-[var(--gutter)] pb-7 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/50">
        <span>
          Loading frames <span ref={framesRef}>000/{FRAME_COUNT}</span>
        </span>
        <span>
          TC <span ref={tcRef}>00:00:00:00</span>
        </span>
      </div>

      <div ref={barRef} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-flare" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
