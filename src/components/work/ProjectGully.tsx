"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { SplitChars, SplitLines } from "@/components/text/Split";
import { ScrambleText } from "@/components/text/ScrambleText";
import Reel from "@/components/work/Reel";

const TITLE_LINES = ["Visual realities for the underground.", "Directed & generated the raw AI campaign for"];

function Credits() {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70 sm:grid-cols-4">
      <dt className="sr-only">Type</dt>
      <dd>Raw AI campaign</dd>
      <dt className="sr-only">Role</dt>
      <dd>Direction · Generation</dd>
      <dt className="sr-only">Runtime</dt>
      <dd>0:20 · 2:1</dd>
      <dt className="sr-only">Year</dt>
      <dd>2025</dd>
    </dl>
  );
}

/**
 * Chapter 01. The title holds the screen while a small window of the film
 * plays below it; scrolling opens the window to full-bleed (clip-path), the
 * picture settles from a slight zoom, then the credits and sound controls land.
 */
export default function ProjectGully() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useGsap(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;

      gsap.from("[data-g-title] [data-char]", {
        yPercent: 115,
        duration: 1.3,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
      gsap.from("[data-g-title] [data-line]", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });

      // The film window opens just under the title and keeps the film's 2:1
      // shape, whatever the viewport's proportions. Layout values only
      // (offsetTop/offsetHeight), so the title's scroll transform is ignored.
      const stage = section.querySelector<HTMLElement>("[data-g-stage]");
      const title = section.querySelector<HTMLElement>("[data-g-title]");
      const startClip = () => {
        if (!stage || !title) return "inset(57% 32% 8% 32% round 18px)";
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        const narrow = w < 768;
        const top = title.offsetTop + title.offsetHeight + Math.max(20, h * 0.04);
        const bottom = h * 0.07;
        const availableH = Math.max(h - top - bottom, h * 0.18);
        const width = Math.min(availableH * 2, w * (narrow ? 0.88 : 0.4));
        const height = width / 2;
        const side = (w - width) / 2;
        const topPct = (top / h) * 100;
        const bottomPct = ((h - top - height) / h) * 100;
        const sidePct = (side / w) * 100;
        return `inset(${topPct.toFixed(2)}% ${sidePct.toFixed(2)}% ${bottomPct.toFixed(2)}% ${sidePct.toFixed(2)}% round ${narrow ? 12 : 18}px)`;
      };
      const reveal = "[data-g-reveal], [data-g-frame] [data-reel-controls]";
      gsap.set(reveal, { autoAlpha: 0, y: 16 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          "[data-g-frame]",
          { clipPath: startClip },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.55, ease: "power2.inOut" },
          0,
        )
        .fromTo("[data-g-media]", { scale: 1.28 }, { scale: 1, duration: 0.55, ease: "power2.inOut" }, 0)
        .to("[data-g-title]", { yPercent: -35, autoAlpha: 0, duration: 0.32, ease: "power2.in" }, 0.04)
        .to("[data-g-shade]", { autoAlpha: 1, duration: 0.2 }, 0.45)
        .to(reveal, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.04, ease: "power3.out" }, 0.55);
    },
    sectionRef,
    [reduced],
  );

  if (reduced) {
    return (
      <section ref={sectionRef} id="gully-labs" aria-labelledby="gully-title" className="bg-ink px-[var(--gutter)] py-[14vh]">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Chapter 01 — Campaign — 2025</p>
        <p className="mb-2 max-w-3xl text-xl text-bone/80">{TITLE_LINES.join(" ")}</p>
        <h3 id="gully-title" className="mb-10 font-display text-[clamp(4rem,14vw,14rem)] uppercase leading-[0.85] text-bone">
          Gully Labs
        </h3>
        <Reel
          src="/video/gully-labs.mp4"
          poster="/posters/gully-labs.webp"
          title="Gully Labs — raw AI campaign"
          className="aspect-[2/1] w-full overflow-hidden rounded-xl"
          controlsClassName="absolute bottom-4 right-4"
        />
        <div className="mt-6">
          <Credits />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="gully-labs" aria-labelledby="gully-title" className="relative h-[300vh] bg-ink">
      <div data-g-stage className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Title */}
        <div data-g-title className="absolute inset-x-0 top-[12svh] z-10 flex flex-col items-center px-[var(--gutter)] text-center">
          <ScrambleText text="Chapter 01 — Campaign — 2025" className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-mute" />
          <SplitLines
            label={TITLE_LINES.join(" ")}
            className="mb-3 text-[clamp(1rem,1.9vw,1.6rem)] font-medium leading-tight tracking-[-0.01em] text-bone/75"
            lines={TITLE_LINES}
          />
          <SplitChars
            as="h3"
            id="gully-title"
            text="Gully Labs"
            className="font-display text-[clamp(4.2rem,15vw,15rem)] uppercase leading-[0.82] text-bone"
          />
        </div>

        {/* Film window → full-bleed */}
        <div data-g-frame className="absolute inset-0 z-20" style={{ clipPath: "inset(57% 32% 8% 32% round 18px)" }}>
          <div data-g-media className="absolute inset-0">
            <Reel
              src="/video/gully-labs.mp4"
              poster="/posters/gully-labs.webp"
              title="Gully Labs — raw AI campaign"
              className="h-full w-full"
              controlsClassName="absolute bottom-[calc(var(--gutter)*0.8)] right-[var(--gutter)] z-10"
            />
          </div>
          <div
            data-g-shade
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{ background: "linear-gradient(to top, rgba(5,6,8,0.8), transparent 35%)" }}
          />
          <div data-g-reveal className="pointer-events-none absolute bottom-[calc(var(--gutter)*0.8)] left-[var(--gutter)] z-10 max-w-[60%]">
            <p className="mb-3 font-display text-[clamp(2rem,4.5vw,4.5rem)] uppercase leading-none text-bone">Gully Labs</p>
            <Credits />
          </div>
        </div>
      </div>
    </section>
  );
}
