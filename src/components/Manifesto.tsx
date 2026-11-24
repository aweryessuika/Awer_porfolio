"use client";

import Image from "next/image";
import { Fragment, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/motion";
import { ScrambleText } from "@/components/text/ScrambleText";

type Token =
  | { kind: "text"; value: string }
  | { kind: "em"; value: string }
  | { kind: "chip"; src: string; alt: string; wide?: boolean };

const COPY: Token[] = [
  { kind: "text", value: "I'm Pranjay Rathore — an" },
  { kind: "em", value: "AI filmmaker" },
  { kind: "chip", src: "/frames/sm/030.webp", alt: "Backlit portrait from the showreel" },
  { kind: "text", value: "and creative developer. I direct generative models the way a director runs a set" },
  { kind: "chip", src: "/posters/gully-labs.webp", alt: "Still from the Gully Labs AI campaign", wide: true },
  { kind: "text", value: "— references, shot lists, take after take — then cut it hard" },
  { kind: "chip", src: "/posters/ben10.webp", alt: "Still from the Ben 10 vertical reel" },
  { kind: "text", value: "until every frame earns its place on a feed built to be" },
  { kind: "em", value: "scrolled past." },
];

const FACTS = [
  { label: "Focus", value: ["AI directing", "Generative video", "Content strategy"] },
  { label: "Craft", value: ["Kinetic edits", "Motion", "Creative code"] },
  { label: "Base", value: ["VIT Bhopal", "→ Bangalore, IN"] },
  { label: "Status", value: ["Open to roles", "& commissions"] },
];

function renderCopy(): ReactNode[] {
  const out: ReactNode[] = [];
  COPY.forEach((token, tokenIndex) => {
    if (token.kind === "chip") {
      out.push(
        <span
          key={`chip-${tokenIndex}`}
          data-chip
          className={`relative mx-[0.12em] inline-block h-[0.78em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline ring-1 ring-bone/20 ${
            token.wide ? "w-[1.9em]" : "w-[1.35em]"
          }`}
        >
          <Image src={token.src} alt={token.alt} fill sizes="120px" className="object-cover" />
        </span>,
      );
      out.push(" ");
      return;
    }
    const words = token.value.split(" ");
    words.forEach((word, wordIndex) => {
      out.push(
        <Fragment key={`${tokenIndex}-${wordIndex}`}>
          <span
            data-mword
            className={token.kind === "em" ? "font-serif font-normal italic tracking-[-0.01em] text-flare-soft" : undefined}
          >
            {word}
          </span>{" "}
        </Fragment>,
      );
    });
  });
  return out;
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(
    () => {
      if (prefersReducedMotion()) return;

      // Words brighten in reading order, paced by scroll.
      gsap.fromTo(
        "[data-mword]",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-manifesto]", start: "top 78%", end: "bottom 55%", scrub: 0.6 },
        },
      );

      gsap.from("[data-chip]", {
        scale: 0.55,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-manifesto]", start: "top 70%", once: true },
      });

      gsap.from("[data-fact]", {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-facts]", start: "top 85%", once: true },
      });
    },
    sectionRef,
  );

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-title" className="relative bg-ink px-[var(--gutter)] pb-[18vh] pt-[22vh]">
      <div className="mb-14 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-mute md:mb-20">
        <ScrambleText text="(01) About" as="h2" className="text-bone" />
        <span aria-hidden="true">Director&apos;s statement</span>
      </div>

      <p
        id="about-title"
        data-manifesto
        className="max-w-[22ch] text-[clamp(2rem,5.4vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.035em] text-bone"
      >
        {renderCopy()}
      </p>

      <dl data-facts className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[var(--line)] pt-8 md:mt-28 md:grid-cols-4">
        {FACTS.map((fact) => (
          <div key={fact.label} data-fact>
            <dt className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">{fact.label}</dt>
            {fact.value.map((line) => (
              <dd key={line} className="text-[15px] leading-snug text-bone md:text-base">
                {line}
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </section>
  );
}
