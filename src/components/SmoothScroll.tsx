"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/lenis";
import { isIntroDone, onIntroDone } from "@/lib/intro";

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger scrubs stay
 * in lockstep with the eased scroll. Reduced-motion visitors keep native
 * scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      anchors: true,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (!isIntroDone()) lenis.stop();
    const offIntro = onIntroDone(() => lenis.start());

    return () => {
      offIntro();
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
