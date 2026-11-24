"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, useGsap } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";
import { RollText } from "@/components/text/RollText";
import LiveClock from "@/components/LiveClock";

const LINKS = [
  { href: "#about", label: "About", index: "01" },
  { href: "#work", label: "Work", index: "02" },
  { href: "#contact", label: "Contact", index: "03" },
];

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const header = headerRef.current;
      const bar = barRef.current;
      if (!header || !bar) return;

      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      if (prefersReducedMotion()) return;

      gsap.set("[data-nav-item]", { yPercent: -120, autoAlpha: 0 });
      const offIntro = onIntroDone(() => {
        gsap.to("[data-nav-item]", { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.06, ease: "expo.out", delay: 0.35 });
      });

      // Hide while reading down, return the moment the visitor scrolls up.
      let hidden = false;
      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const shouldHide = self.direction === 1 && self.scroll() > 160;
          if (shouldHide === hidden) return;
          hidden = shouldHide;
          gsap.to(header, { yPercent: shouldHide ? -110 : 0, duration: 0.5, ease: "power3.out", overwrite: true });
        },
      });

      return () => {
        offIntro();
        trigger.kill();
      };
    },
    headerRef,
  );

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-[100] text-bone mix-blend-difference">
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 px-[var(--gutter)] py-5 font-mono text-[11px] uppercase tracking-[0.18em] md:grid-cols-3">
        <a href="#top" data-nav-item className="roll-trigger pressable flex items-center gap-3 justify-self-start" aria-label="Pranjay Rathore — back to top">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-current font-display text-[11px] tracking-normal">
            PR
          </span>
          <span className="hidden sm:inline-flex">
            <RollText text="Pranjay Rathore" />
          </span>
        </a>

        <div data-nav-item className="hidden items-center justify-self-center gap-3 text-bone/70 md:flex">
          <span className="live-dot" aria-hidden="true" />
          <span>Open to work</span>
          <span className="text-bone/30" aria-hidden="true">
            /
          </span>
          <span>
            BLR <LiveClock />
          </span>
        </div>

        <nav aria-label="Primary" className="justify-self-end">
          <ul className="flex items-center gap-5 md:gap-8">
            {LINKS.map((link) => (
              <li key={link.href} data-nav-item>
                <a href={link.href} className="roll-trigger pressable flex items-baseline gap-1.5">
                  <span className="hidden text-[9px] text-bone/40 lg:inline" aria-hidden="true">
                    {link.index}
                  </span>
                  <RollText text={link.label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div ref={barRef} className="h-px w-full origin-left bg-bone/60" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
    </header>
  );
}
