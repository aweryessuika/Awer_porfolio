"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, toTimecode, useGsap } from "@/lib/motion";
import { FRAME_COUNT, getSequence, onSequenceProgress } from "@/lib/sequence";
import { onIntroDone } from "@/lib/intro";
import { SplitChars, SplitLines } from "@/components/text/Split";
import { ScrambleText } from "@/components/text/ScrambleText";

const STILL_FRAME = 60;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const frRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useGsap(
    () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;
      if (!section || !canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const images = getSequence();
      let current = reduced ? STILL_FRAME : 0;
      let drawQueued = false;

      const nearestReady = (index: number): HTMLImageElement | null => {
        for (let d = 0; d < FRAME_COUNT; d += 1) {
          const before = images[index - d];
          if (before && before.complete && before.naturalWidth > 0) return before;
          const after = images[index + d];
          if (after && after.complete && after.naturalWidth > 0) return after;
        }
        return null;
      };

      const draw = () => {
        drawQueued = false;
        const { width, height } = canvas;
        ctx.fillStyle = "#050608";
        ctx.fillRect(0, 0, width, height);
        const img = nearestReady(current);
        if (!img) return;
        const canvasRatio = width / height;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let drawW = width;
        let drawH = height;
        if (canvasRatio > imgRatio) drawH = width / imgRatio;
        else drawW = height * imgRatio;
        ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
      };

      const queueDraw = () => {
        if (drawQueued) return;
        drawQueued = true;
        requestAnimationFrame(draw);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        draw();
      };

      const setFrame = (index: number) => {
        const next = Math.max(0, Math.min(FRAME_COUNT - 1, index));
        if (next === current) return;
        current = next;
        if (frRef.current) frRef.current.textContent = String(next + 1).padStart(3, "0");
        if (tcRef.current) tcRef.current.textContent = toTimecode(next / 24);
        queueDraw();
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      const offProgress = onSequenceProgress(queueDraw);

      if (reduced) {
        return () => {
          resizeObserver.disconnect();
          offProgress();
        };
      }

      // ── Intro: plays when the preloader curtain lifts ──
      gsap.set("[data-hero-name] [data-char]", { yPercent: 115 });
      gsap.set(canvas, { scale: 1.14, autoAlpha: 0 });
      gsap.set("[data-hero-meta]", { autoAlpha: 0, y: 14 });
      const offIntro = onIntroDone(() => {
        gsap
          .timeline()
          .to(canvas, { scale: 1, autoAlpha: 1, duration: 2.2, ease: "expo.out" }, 0)
          .to("[data-hero-name] [data-char]", { yPercent: 0, duration: 1.4, stagger: 0.04, ease: "expo.out" }, 0.15)
          .to("[data-hero-meta]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.7);
      });

      // ── Scroll film: frames, scenes, letterbox shutter ──
      const state = { frame: 0 };
      const scenes = ["01", "02", "03"];
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            const scene = p < 0.22 ? 0 : p < 0.52 ? 1 : 2;
            if (sceneRef.current) sceneRef.current.textContent = scenes[scene];
          },
        },
      });

      tl.to(state, { frame: FRAME_COUNT - 1, duration: 1, onUpdate: () => setFrame(Math.round(state.frame)) }, 0)
        // scene 1: name tracks out from the centre
        .to(
          "[data-hero-name] .mask",
          {
            x: (i: number, _el: Element, all: Element[]) => (i - (all.length - 1) / 2) * 26,
            autoAlpha: 0,
            duration: 0.14,
            ease: "power2.in",
            stagger: { each: 0.003, from: "center" },
          },
          0.05,
        )
        .to("[data-hero-fade]", { autoAlpha: 0, y: -20, duration: 0.08 }, 0.04)
        // letterbox closes to 2.39:1 for the "film" scenes
        .fromTo("[data-bar]", { scaleY: 0 }, { scaleY: 1, duration: 0.1, ease: "power2.out" }, 0.16)
        // scene 2
        .fromTo("[data-scene='2'] [data-line]", { yPercent: 110 }, { yPercent: 0, duration: 0.08, stagger: 0.025, ease: "power3.out" }, 0.24)
        .to("[data-scene='2'] [data-line]", { yPercent: -110, duration: 0.07, stagger: 0.02, ease: "power2.in" }, 0.44)
        // scene 3
        .fromTo("[data-scene='3'] [data-line]", { yPercent: 110 }, { yPercent: 0, duration: 0.08, stagger: 0.025, ease: "power3.out" }, 0.55)
        .to("[data-scene='3'] [data-line]", { yPercent: -110, duration: 0.07, stagger: 0.02, ease: "power2.in" }, 0.78)
        // shutter: bars close over the frame and hand off to the next section
        .to("[data-bar]", { scaleY: 4.7, duration: 0.12, ease: "power3.inOut" }, 0.88)
        .to("[data-hero-hud]", { autoAlpha: 0, duration: 0.06 }, 0.9);
      gsap.set("[data-scene]", { autoAlpha: 1 });

      return () => {
        offIntro();
        resizeObserver.disconnect();
        offProgress();
      };
    },
    sectionRef,
    [reduced],
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className={reduced ? "relative h-[100svh]" : "relative h-[420vh]"}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* legibility: vignette + floor gradient (static, no backdrop filters) */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(5,6,8,0.75) 100%), linear-gradient(to top, rgba(5,6,8,0.85), transparent 38%)",
          }}
        />

        {/* letterbox bars */}
        <div data-bar className="absolute inset-x-0 top-0 z-20 h-[10.6svh] origin-top bg-ink" style={{ transform: "scaleY(0)" }} aria-hidden="true" />
        <div data-bar className="absolute inset-x-0 bottom-0 z-20 h-[10.6svh] origin-bottom bg-ink" style={{ transform: "scaleY(0)" }} aria-hidden="true" />

        {/* Scene 1 — name */}
        <h1 data-hero-name className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-[var(--gutter)] pb-[14svh] pt-[13svh] font-display uppercase leading-[0.8] text-bone md:pb-[12svh] md:pt-[11svh]">
          <SplitChars text="Pranjay" className="block self-start text-[clamp(5rem,27vw,24rem)] md:text-[clamp(5rem,19.5vw,24rem)]" />
          <SplitChars text="Rathore" className="block self-end text-[clamp(5rem,27vw,24rem)] md:text-[clamp(5rem,19.5vw,24rem)]" />
        </h1>

        {/* Scene 2 */}
        <div data-scene="2" className="pointer-events-none absolute inset-0 z-10 flex items-center px-[var(--gutter)]">
          <SplitLines
            as="p"
            label="I direct machines like a film crew."
            className="max-w-[16ch] text-[clamp(2.4rem,6.2vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.035em]"
            lines={[
              "I direct machines",
              <span key="em" className="font-serif font-normal italic tracking-[-0.01em] text-flare-soft">
                like a film crew.
              </span>,
            ]}
          />
        </div>

        {/* Scene 3 */}
        <div data-scene="3" className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end px-[var(--gutter)] text-right">
          <SplitLines
            as="p"
            label="Generative video, cut for the attention economy."
            className="max-w-[18ch] text-[clamp(2.4rem,6.2vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.035em]"
            lines={[
              "Generative video,",
              "cut for the",
              <span key="em" className="font-serif font-normal italic tracking-[-0.01em] text-flare-soft">
                attention economy.
              </span>,
            ]}
          />
        </div>

        {/* HUD */}
        <div data-hero-hud className="absolute inset-0 z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60 md:text-[11px]">
          <div data-hero-meta className="absolute right-[var(--gutter)] top-[calc(var(--gutter)+3.2rem)] hidden md:block">
            Scene <span ref={sceneRef}>01</span>/03
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-[var(--gutter)] pb-6">
            <div data-hero-meta>
              <div data-hero-fade>
                <ScrambleText text="AI filmmaker &" trigger="intro" delay={0.9} className="block text-bone" />
                <ScrambleText text="Creative developer" trigger="intro" delay={1} className="block text-bone" />
              </div>
            </div>
            <div data-hero-meta className="hidden flex-col items-center gap-2 sm:flex" aria-hidden="true">
              <span data-hero-fade>Scroll</span>
              <span className="relative block h-10 w-px overflow-hidden bg-bone/15">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(0.77,0,0.175,1)_infinite] bg-bone motion-reduce:animate-none" />
              </span>
            </div>
            <div data-hero-meta className="text-right tabular-nums">
              <div>
                TC <span ref={tcRef}>00:00:00:00</span>
              </div>
              <div className="text-bone/40">
                FR <span ref={frRef}>001</span>/{FRAME_COUNT}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
