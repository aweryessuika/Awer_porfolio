"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, useGsap } from "@/lib/motion";
import { SplitChars } from "@/components/text/Split";
import { ScrambleText } from "@/components/text/ScrambleText";

export const PROJECTS = [
  {
    id: "gully-labs",
    index: "01",
    title: "Gully Labs",
    kind: "Raw AI campaign",
    role: "Direction · AI generation",
    year: "2025",
    poster: "/posters/gully-labs.webp",
  },
  {
    id: "ben-10",
    index: "02",
    title: "Ben 10",
    kind: "Vertical reel",
    role: "Kinetic edit",
    year: "2025",
    poster: "/posters/ben10.webp",
  },
] as const;

/**
 * Section opener + project index. On fine pointers a preview card follows the
 * cursor over the list, swapping stills per row and leaning into the motion.
 */
export default function WorkIndex() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      const preview = previewRef.current;
      if (!section || !preview) return;
      if (prefersReducedMotion()) return;

      gsap.from("[data-work-title] [data-char]", {
        yPercent: 115,
        duration: 1.3,
        stagger: 0.035,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-work-title]", start: "top 85%", once: true },
      });
      gsap.from("[data-work-row]", {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-work-list]", start: "top 85%", once: true },
      });
      gsap.from("[data-row-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-work-list]", start: "top 85%", once: true },
      });

      if (!hasFinePointer()) return;

      const list = section.querySelector<HTMLElement>("[data-work-list]");
      if (!list) return;
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.8, autoAlpha: 0, rotate: 0 });
      const xTo = gsap.quickTo(preview, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3.out" });
      const rotTo = gsap.quickTo(preview, "rotate", { duration: 0.6, ease: "power3.out" });
      let lastX = 0;

      const onMove = (event: PointerEvent) => {
        const rect = list.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        xTo(x);
        yTo(y);
        rotTo(gsap.utils.clamp(-10, 10, (x - lastX) * 0.6));
        lastX = x;
      };
      const show = (event: PointerEvent) => {
        const rect = list.getBoundingClientRect();
        lastX = event.clientX - rect.left;
        gsap.set(preview, { x: lastX, y: event.clientY - rect.top });
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "expo.out", overwrite: "auto" });
      };
      const hide = () => gsap.to(preview, { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: "power3.out", overwrite: "auto" });

      const rows = gsap.utils.toArray<HTMLElement>("[data-work-row]");
      const rowEnter = rows.map((row, index) => {
        const handler = () => {
          preview.querySelectorAll<HTMLElement>("[data-preview-img]").forEach((img, imgIndex) => {
            gsap.to(img, { autoAlpha: imgIndex === index ? 1 : 0, scale: imgIndex === index ? 1 : 1.12, duration: 0.5, ease: "power3.out" });
          });
        };
        row.addEventListener("pointerenter", handler);
        return { row, handler };
      });

      list.addEventListener("pointermove", onMove);
      list.addEventListener("pointerenter", show);
      list.addEventListener("pointerleave", hide);

      return () => {
        list.removeEventListener("pointermove", onMove);
        list.removeEventListener("pointerenter", show);
        list.removeEventListener("pointerleave", hide);
        rowEnter.forEach(({ row, handler }) => row.removeEventListener("pointerenter", handler));
      };
    },
    sectionRef,
  );

  return (
    <section ref={sectionRef} id="work" aria-labelledby="work-title" className="relative bg-ink px-[var(--gutter)] pb-[16vh] pt-[18vh]">
      <div className="mb-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        <ScrambleText text="(02) Selected work" className="text-bone" />
        <span>2025 — 2026</span>
      </div>

      <h2 id="work-title" data-work-title className="mb-16 flex flex-wrap items-end gap-x-[0.18em] leading-[0.82] md:mb-24">
        <SplitChars text="Selected" className="font-display text-[clamp(4.5rem,15vw,17rem)] uppercase text-bone" />
        <span className="font-serif text-[clamp(4rem,13vw,15rem)] italic leading-[0.9] text-flare-soft">work</span>
      </h2>

      <div data-work-list className="relative">
        <ul>
          {PROJECTS.map((project) => (
            <li key={project.id} data-work-row className="relative">
              <a
                href={`#${project.id}`}
                data-cursor="Watch"
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-7 md:grid-cols-[4rem_1fr_auto_auto] md:gap-x-10 md:py-9"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-mute">{project.index}</span>
                <span className="font-display text-[clamp(2.6rem,7vw,7rem)] uppercase leading-none text-bone transition-transform duration-500 ease-out group-hover:translate-x-4 group-focus-visible:translate-x-4">
                  {project.title}
                </span>
                <span className="col-start-2 mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute md:col-start-auto md:mt-0">
                  {project.kind} — {project.role}
                </span>
                <span className="hidden font-mono text-[11px] tracking-[0.2em] text-mute md:block">{project.year}</span>
              </a>
              <span data-row-line className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" aria-hidden="true" />
            </li>
          ))}
        </ul>

        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden aspect-[4/3] w-[min(26vw,22rem)] overflow-hidden rounded-xl opacity-0 md:block"
        >
          {PROJECTS.map((project, index) => (
            <div key={project.id} data-preview-img className="absolute inset-0" style={{ opacity: index === 0 ? 1 : 0 }}>
              <Image src={project.poster} alt="" fill sizes="22rem" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
