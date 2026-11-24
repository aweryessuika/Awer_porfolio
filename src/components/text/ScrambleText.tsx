"use client";

import { useEffect, useRef, type ElementType } from "react";
import { onIntroDone } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-+*";

type ScrambleTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "view": decode when scrolled into view. "intro": decode when the preloader lifts. */
  trigger?: "view" | "intro";
  delay?: number;
  /** Re-decode on pointer hover (fine pointers only). */
  replayOnHover?: boolean;
};

/**
 * Mono label that "decodes" from random glyphs into its final text, like a
 * render finishing. The server renders the final text, so it reads correctly
 * with no JavaScript and for screen readers (aria-label stays constant).
 */
export function ScrambleText({
  text,
  as: Tag = "span",
  className,
  trigger = "view",
  delay = 0,
  replayOnHover = false,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let frame = 0;
    let timeout = 0;
    const chars = Array.from(text);

    const run = () => {
      cancelAnimationFrame(frame);
      const duration = Math.min(1100, 380 + chars.length * 28);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const settledCount = Math.floor(progress * chars.length);
        let out = "";
        for (let i = 0; i < chars.length; i += 1) {
          const ch = chars[i];
          if (ch === " " || i < settledCount) out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        node.textContent = out;
        if (progress < 1) frame = requestAnimationFrame(tick);
        else node.textContent = text;
      };
      frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      timeout = window.setTimeout(run, delay * 1000);
    };

    let cleanupTrigger: () => void = () => undefined;
    if (trigger === "intro") {
      cleanupTrigger = onIntroDone(schedule);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            schedule();
            observer.disconnect();
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      observer.observe(node);
      cleanupTrigger = () => observer.disconnect();
    }

    const onEnter = () => run();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (replayOnHover && fine) node.addEventListener("pointerenter", onEnter);

    return () => {
      cleanupTrigger();
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
      node.removeEventListener("pointerenter", onEnter);
      node.textContent = text;
    };
  }, [text, trigger, delay, replayOnHover]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
