"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, useGsap } from "@/lib/motion";

const ROWS: { items: string[]; outline: boolean; direction: 1 | -1 }[] = [
  { items: ["AI Directing", "Generative Video", "Kinetic Edits"], outline: false, direction: 1 },
  { items: ["Creative Code", "Content Strategy", "Motion Design"], outline: true, direction: -1 },
];

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-[0.35em] inline-block h-[0.42em] w-[0.42em] shrink-0 fill-flare" aria-hidden="true">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

/**
 * Two infinite rows that drift in opposite directions. Scroll speed feeds in:
 * scrolling faster pushes them faster and skews them, scrolling up reverses
 * them. Pauses while off-screen.
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      const tracks = gsap.utils.toArray<HTMLElement>("[data-track]");
      const wrap = gsap.utils.wrap(-50, 0);
      const rows = tracks.map((track) => ({
        track,
        base: Number(track.dataset.direction) || 1,
        x: Number(track.dataset.direction) === -1 ? -50 : 0,
        setX: gsap.quickSetter(track, "xPercent") as (value: number) => void,
      }));
      const setSkew = gsap.quickSetter(tracks, "skewX", "deg") as (value: number) => void;

      let boost = 0;
      let skew = 0;
      let flip = 1;
      let active = false;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          active = self.isActive;
        },
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          flip = self.direction === -1 ? -1 : 1;
          boost = Math.min(Math.abs(velocity) / 220, 9);
          skew = gsap.utils.clamp(-9, 9, velocity / -260);
        },
      });

      const tick = (_time: number, deltaMs: number) => {
        if (!active) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        boost *= 0.92;
        skew *= 0.88;
        rows.forEach((row) => {
          row.x = wrap(row.x - (1.6 + boost) * row.base * flip * dt * 2);
          row.setX(row.x);
        });
        setSkew(skew);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
      };
    },
    sectionRef,
  );

  return (
    <section ref={sectionRef} aria-label="Disciplines" className="relative overflow-hidden border-y border-[var(--line)] bg-ink py-[6vh]">
      {ROWS.map((row, rowIndex) => {
        const run = (
          <>
            {[...row.items, ...row.items].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center">
                <span>{item}</span>
                <Star />
              </span>
            ))}
          </>
        );
        return (
          <div key={rowIndex} className="whitespace-nowrap py-[0.6vh]" aria-hidden={rowIndex > 0 ? "true" : undefined}>
            <div
              data-track
              data-direction={row.direction}
              className={`inline-flex w-max font-display text-[clamp(3.6rem,10.5vw,11rem)] uppercase leading-[0.9] will-change-transform ${
                row.outline ? "text-outline" : "text-bone"
              }`}
            >
              <span className="inline-flex">{run}</span>
              <span className="inline-flex" aria-hidden="true">
                {run}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
