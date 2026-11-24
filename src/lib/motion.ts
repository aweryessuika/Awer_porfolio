"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

export { gsap, ScrollTrigger };

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Runs GSAP setup inside a gsap.context scoped to `scope`, and reverts every
 * tween / ScrollTrigger it created when deps change or the component unmounts.
 * The setup may return an extra cleanup function for listeners it added.
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void | (() => void),
  scope: RefObject<HTMLElement>,
  deps: DependencyList = [],
) {
  useIsoLayoutEffect(() => {
    let extraCleanup: void | (() => void);
    const ctx = gsap.context((self) => {
      extraCleanup = setup(self);
    }, scope.current ?? undefined);
    return () => {
      if (typeof extraCleanup === "function") extraCleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers pass their own deps list
  }, deps);
}

/** Seconds → film timecode HH:MM:SS:FF at the given frame rate. */
export function toTimecode(seconds: number, fps = 24): string {
  const safe = Math.max(0, seconds);
  const totalFrames = Math.floor(safe * fps);
  const ff = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return [hh, mm, ss, ff].map((n) => String(n).padStart(2, "0")).join(":");
}
