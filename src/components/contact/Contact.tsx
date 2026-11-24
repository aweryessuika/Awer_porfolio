"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { scrollToTarget } from "@/lib/lenis";
import { SplitLines } from "@/components/text/Split";
import { ScrambleText } from "@/components/text/ScrambleText";
import { RollText } from "@/components/text/RollText";
import LiveClock from "@/components/LiveClock";
import FlareCanvas from "@/components/contact/FlareCanvas";

const EMAIL = "awer.mov@gmail.com";
const PHONE_DISPLAY = "+91 91093 00253";
const PHONE_HREF = "tel:+919109300253";

const CREDITS = [
  { role: "Directed by", name: "Pranjay Rathore" },
  { role: "Generated & edited by", name: "Pranjay Rathore" },
  { role: "Designed & coded by", name: "Pranjay Rathore" },
  { role: "Academic base", name: "VIT Bhopal" },
  { role: "Next location", name: "Bangalore, India" },
];

type CopyState = "idle" | "copied" | "failed";

function CopyEmail() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    window.clearTimeout(timer.current);
    if (!navigator.clipboard) {
      setState("failed");
      timer.current = window.setTimeout(() => setState("idle"), 2400);
      return;
    }
    navigator.clipboard
      .writeText(EMAIL)
      .then(() => setState("copied"))
      .catch(() => setState("failed"))
      .finally(() => {
        timer.current = window.setTimeout(() => setState("idle"), 2000);
      });
  };

  const label = state === "copied" ? "Copied ✓" : state === "failed" ? "Select & copy" : "Copy";

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="Copy email"
      className="pressable relative inline-flex h-10 min-w-[7.5rem] items-center justify-center rounded-full border border-bone/25 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors duration-200 hover:bg-bone hover:text-ink"
    >
      <span key={state} className="animate-[swap_260ms_cubic-bezier(0.23,1,0.32,1)]">
        {label}
      </span>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(
    () => {
      if (prefersReducedMotion()) return;

      // End credits drift up a little faster than the page, like a crawl.
      gsap.fromTo(
        "[data-crawl]",
        { y: 120 },
        {
          y: -120,
          ease: "none",
          scrollTrigger: { trigger: "[data-credits]", start: "top bottom", end: "bottom top", scrub: 1.2 },
        },
      );
      gsap.from("[data-credit]", {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-credits]", start: "top 75%", once: true },
      });

      gsap.from("[data-cta] [data-line]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-cta]", start: "top 70%", once: true },
      });
      gsap.from("[data-cta-fade]", {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-cta]", start: "top 55%", once: true },
      });
    },
    sectionRef,
  );

  return (
    <section ref={sectionRef} id="contact" aria-labelledby="contact-title" className="relative bg-ink">
      {/* End credits */}
      <div data-credits className="relative overflow-hidden px-[var(--gutter)] py-[24vh]">
        <div className="mb-16 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
          <ScrambleText text="(03) End credits" />
        </div>
        <dl data-crawl className="mx-auto grid max-w-3xl gap-y-7">
          {CREDITS.map((credit) => (
            <div key={credit.role} data-credit className="grid grid-cols-2 items-baseline gap-6 md:gap-10">
              <dt className="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-mute md:text-[11px]">{credit.role}</dt>
              <dd className="font-serif text-[clamp(1.6rem,3.4vw,2.8rem)] italic leading-none text-bone">{credit.name}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* CTA */}
      <div
        data-cta
        className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden px-[var(--gutter)] pb-8 pt-[14vh]"
        style={{ background: "radial-gradient(80% 50% at 62% 45%, rgba(77,141,255,0.22), transparent 70%), #050608" }}
      >
        <FlareCanvas className="absolute inset-0 -z-10 h-full w-full" />

        <div>
          <ScrambleText text="(04) Contact" className="mb-8 block font-mono text-[11px] uppercase tracking-[0.2em] text-bone/60" />
          <SplitLines
            as="h2"
            label="Let's make the next frame."
            className="text-bone"
            lines={[
              <span key="a" id="contact-title" className="font-display text-[clamp(4.2rem,13.5vw,15rem)] uppercase leading-[0.84]">
                Let&apos;s make
              </span>,
              <span key="b" className="font-serif text-[clamp(3.8rem,12.5vw,14rem)] italic leading-[0.9] tracking-[-0.02em] text-flare-soft">
                the next frame.
              </span>,
            ]}
          />
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div data-cta-fade>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/55">Write to me</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                data-cursor="Say hello"
                className="roll-trigger pressable text-[clamp(1.6rem,4.2vw,3.6rem)] font-medium leading-none tracking-[-0.03em] text-bone"
              >
                <RollText text={EMAIL} />
              </a>
              <CopyEmail />
            </div>
          </div>

          <dl data-cta-fade className="grid grid-cols-2 gap-x-6 gap-y-6 font-mono text-[10px] uppercase tracking-[0.2em] md:text-[11px]">
            <div>
              <dt className="mb-1.5 text-bone/45">Phone</dt>
              <dd>
                <a href={PHONE_HREF} className="roll-trigger text-bone">
                  <RollText text={PHONE_DISPLAY} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 text-bone/45">Status</dt>
              <dd className="flex items-center gap-2 text-bone">
                <span className="live-dot text-flare-soft" aria-hidden="true" />
                Open to roles
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 text-bone/45">Location</dt>
              <dd className="text-bone">
                Bangalore, IN
                <span className="block text-bone/50">Relocation / on-site OK</span>
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 text-bone/45">Local time</dt>
              <dd className="text-bone">
                IST <LiveClock />
              </dd>
            </div>
          </dl>
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-bone/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Pranjay Rathore</span>
          <span>Designed &amp; coded by Pranjay Rathore — precision prompting</span>
          <button type="button" onClick={() => scrollToTarget(0)} className="roll-trigger pressable self-start text-bone sm:self-auto">
            <RollText text="Back to top ↑" />
          </button>
        </footer>
      </div>
    </section>
  );
}
