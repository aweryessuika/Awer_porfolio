"use client";

import { useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, useGsap } from "@/lib/motion";
import { SplitChars, SplitLines } from "@/components/text/Split";
import { ScrambleText } from "@/components/text/ScrambleText";
import Reel from "@/components/work/Reel";

const CREDITS = [
  { label: "Format", value: "9:16 vertical" },
  { label: "Runtime", value: "0:15" },
  { label: "Role", value: "Kinetic edit" },
  { label: "Year", value: "2025" },
];

/**
 * Chapter 02, inverted to bone. The panel opens from a rounded inset as it
 * arrives, the phone rises out of a tilt, and on fine pointers it leans
 * toward the cursor.
 */
export default function ProjectBen10() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-b-panel]",
        { clipPath: "inset(7% 4% 0% 4% round 48px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "top 15%", scrub: 0.8 },
        },
      );

      gsap.from("[data-b-title] [data-char]", {
        yPercent: 115,
        rotate: 6,
        duration: 1.4,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-b-title]", start: "top 85%", once: true },
      });
      gsap.from("[data-b-copy] [data-line]", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-b-copy]", start: "top 85%", once: true },
      });
      gsap.from("[data-b-fade]", {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-b-copy]", start: "top 75%", once: true },
      });

      gsap.fromTo(
        "[data-b-phone]",
        { rotateX: 24, y: 140, scale: 0.9 },
        {
          rotateX: 0,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-b-stage]", start: "top 95%", end: "center 55%", scrub: 1 },
        },
      );
      gsap.fromTo(
        "[data-b-glow]",
        { autoAlpha: 0, scale: 0.7 },
        {
          autoAlpha: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-b-stage]", start: "top 80%", end: "center 50%", scrub: 1 },
        },
      );

      if (!hasFinePointer()) return;
      const tilt = section.querySelector<HTMLElement>("[data-b-tilt]");
      if (!tilt) return;
      const rotY = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3.out" });
      const rotX = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        rotY(nx * 16);
        rotX(ny * -10);
      };
      const onLeave = () => {
        rotY(0);
        rotX(0);
      };
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    },
    sectionRef,
  );

  return (
    <section ref={sectionRef} id="ben-10" aria-labelledby="ben10-title" className="relative bg-ink">
      <div data-b-panel className="bg-bone text-ink">
        <div className="grid min-h-[100svh] items-center gap-16 px-[var(--gutter)] py-[16vh] md:grid-cols-[1.15fr_0.85fr] md:gap-10">
          <div data-b-copy>
            <ScrambleText
              text="Chapter 02 — Vertical reel — 2025"
              className="mb-8 block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55"
            />
            <div data-b-title>
              <SplitChars
                as="h3"
                id="ben10-title"
                text="Ben 10"
                className="mb-8 block font-serif text-[clamp(6.5rem,19vw,19rem)] italic leading-[0.78] tracking-[-0.02em]"
              />
            </div>
            <SplitLines
              label="Reimagining nostalgia for the vertical era."
              className="mb-6 block text-[clamp(1.8rem,3.6vw,3.6rem)] font-medium leading-[1] tracking-[-0.03em]"
              lines={["Reimagining nostalgia", "for the vertical era."]}
            />
            <p data-b-fade className="mb-12 max-w-md text-[17px] leading-relaxed text-ink/65">
              A high-paced, kinetic reel edit for Ben 10 — a cartoon a generation grew up on, recut for 9:16 and for the
              thumb that is one second away from scrolling.
            </p>
            <dl data-b-fade className="grid grid-cols-2 gap-6 border-t border-ink/15 pt-6 sm:grid-cols-4">
              {CREDITS.map((credit) => (
                <div key={credit.label}>
                  <dt className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{credit.label}</dt>
                  <dd className="text-[15px]">{credit.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-b-stage className="relative flex justify-center pb-24 [perspective:1200px]">
            <div
              data-b-glow
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[45%] aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(34,197,94,0.28), rgba(34,197,94,0.08) 55%, transparent)" }}
            />
            <div data-b-phone className="relative [transform-style:preserve-3d]">
              <div data-b-tilt className="[transform-style:preserve-3d]">
                <div className="relative w-[min(70vw,330px)] rounded-[2.7rem] bg-ink p-[9px] shadow-[0_40px_80px_-20px_rgba(5,6,8,0.55),0_0_0_1px_rgba(5,6,8,0.9),inset_0_0_0_1.5px_rgba(236,232,225,0.12)]">
                  <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-[18px] z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-ink"
                  />
                  <Reel
                    src="/video/ben10.mp4"
                    poster="/posters/ben10.webp"
                    title="Ben 10 — vertical reel"
                    tone="dark"
                    className="aspect-[9/16] w-full"
                    videoClassName="rounded-[2.2rem] bg-ink-2"
                    controlsClassName="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
