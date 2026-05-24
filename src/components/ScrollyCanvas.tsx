"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 91; // 000 to 090
const URL_PREFIX = "/sequence/frame_";
const URL_SUFFIX = "_delay-0.07s.png";

function pad(number: number, length: number) {
  let str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.__SEQUENCE_IMAGES__ && window.__SEQUENCE_IMAGES__.length === FRAME_COUNT) {
      // @ts-ignore
      setImages(window.__SEQUENCE_IMAGES__);
    } else {
      const loadedImages: HTMLImageElement[] = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `${URL_PREFIX}${pad(i, 3)}${URL_SUFFIX}`;
        loadedImages.push(img);
      }
      setImages(loadedImages);
    }
  }, []);

  // Draw setup & scroll mapping
  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let currentFrame = 0;

    // Responsive Canvas Resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrame); 
    };
    
    // Draw based on object-fit: cover logic
    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img) return;
      
      // If the image hasn't downloaded yet, tell it to draw itself once it finishes
      // ONLY if it's still the active frame.
      if (!img.complete) {
        img.onload = () => {
          if (currentFrame === index) {
            renderFrame(index);
          }
        };
        return;
      }
      
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener("resize", resizeCanvas);

    const unsubscribe = smoothProgress.on("change", (latest) => {
      currentFrame = Math.min(
        FRAME_COUNT - 1,
        Math.floor(latest * FRAME_COUNT)
      );
      requestAnimationFrame(() => renderFrame(currentFrame));
    });

    // Initial sync
    currentFrame = Math.min(
      FRAME_COUNT - 1,
      Math.floor(smoothProgress.get() * FRAME_COUNT)
    );
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      unsubscribe();
    };
  }, [images, smoothProgress]);

  return (
    <div ref={containerRef} className="relative h-[350vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-80"
        />
        <div className="absolute inset-0 z-0 bg-black/40 bg-blend-multiply flex flex-col justify-end pb-8 text-center" /> 
        <Overlay progress={scrollYProgress} />
      </div>
    </div>
  );
}
