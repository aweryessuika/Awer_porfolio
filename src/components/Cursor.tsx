"use client";

import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type Mode = "idle" | "link" | "label";

/**
 * Two-part cursor: a fast dot and a lagging ring (difference-blended so it
 * reads on dark and light sections). Elements with `data-cursor="Label"`
 * swap the ring for a solid pill with that label. Fine pointers only.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const pill = pillRef.current;
    const pillText = pillTextRef.current;
    if (!dot || !ring || !pill || !pillText) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot, ring, pill], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(pill, { scale: 0.85 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const pillX = gsap.quickTo(pill, "x", { duration: 0.3, ease: "power3.out" });
    const pillY = gsap.quickTo(pill, "y", { duration: 0.3, ease: "power3.out" });

    let visible = false;
    let mode: Mode = "idle";
    let label = "";

    const setMode = (next: Mode, nextLabel: string) => {
      if (next === mode && nextLabel === label) return;
      mode = next;
      label = nextLabel;
      if (next === "label") {
        pillText.textContent = nextLabel;
        gsap.to(pill, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out", overwrite: "auto" });
        gsap.to(ring, { scale: 0.4, autoAlpha: 0, duration: 0.25, ease: "power3.out", overwrite: "auto" });
        gsap.to(dot, { scale: 0, duration: 0.2, ease: "power3.out", overwrite: "auto" });
      } else {
        gsap.to(pill, { autoAlpha: 0, scale: 0.85, duration: 0.2, ease: "power3.out", overwrite: "auto" });
        gsap.to(ring, {
          scale: next === "link" ? 1.7 : 1,
          autoAlpha: visible ? 1 : 0,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(dot, { scale: next === "link" ? 0 : 1, duration: 0.2, ease: "power3.out", overwrite: "auto" });
      }
    };

    let lastX = -1;
    let lastY = -1;
    let scrollQueued = false;

    const resolveMode = (target: Element | null) => {
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) {
        setMode("label", labelled.dataset.cursor);
      } else if (target?.closest("a, button, [role='button']")) {
        setMode("link", "");
      } else {
        setMode("idle", "");
      }
    };

    // Content scrolls under a still pointer, so re-check what it is over.
    const onScroll = () => {
      if (!visible || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        resolveMode(document.elementFromPoint(lastX, lastY));
      });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastX = event.clientX;
      lastY = event.clientY;
      if (!visible) {
        visible = true;
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        gsap.set(pill, { x: event.clientX, y: event.clientY });
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, ease: "power1.out" });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      pillX(event.clientX);
      pillY(event.clientY);

      resolveMode(event.target instanceof Element ? event.target : null);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring, pill], { autoAlpha: 0, duration: 0.2, ease: "power1.out" });
      mode = "idle";
      label = "";
    };

    const onDown = () => gsap.to(ring, { scale: mode === "link" ? 1.45 : 0.8, duration: 0.15, ease: "power3.out" });
    const onUp = () => gsap.to(ring, { scale: mode === "link" ? 1.7 : 1, duration: 0.3, ease: "power3.out" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([dot, ring, pill]);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="pointer-events-none fixed left-0 top-0 z-[140] mix-blend-difference">
        <div ref={dotRef} className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-bone opacity-0" />
        <div ref={ringRef} className="fixed left-0 top-0 h-9 w-9 rounded-full border border-bone opacity-0" />
      </div>
      <div
        ref={pillRef}
        className="pointer-events-none fixed left-0 top-0 z-[141] rounded-full bg-bone px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink opacity-0"
      >
        <span ref={pillTextRef} />
      </div>
    </div>
  );
}
