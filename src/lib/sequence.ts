/**
 * Loads the hero image sequence once and shares it between the preloader
 * (which shows real load progress) and the scroll canvas (which draws it).
 * Picks the 960px set on small / low-DPR screens and the 1920px set otherwise.
 */
export const FRAME_COUNT = 91;

type ProgressListener = (loaded: number, total: number) => void;

let images: HTMLImageElement[] = [];
let settled = 0;
let started = false;
const listeners = new Set<ProgressListener>();

function pickVariant(): "lg" | "sm" {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return window.innerWidth * dpr > 1400 ? "lg" : "sm";
}

export function frameSrc(index: number, variant: "lg" | "sm"): string {
  return `/frames/${variant}/${String(index).padStart(3, "0")}.webp`;
}

export function startSequenceLoad(): HTMLImageElement[] {
  if (started) return images;
  started = true;
  const variant = pickVariant();

  images = Array.from({ length: FRAME_COUNT }, (_, index) => {
    const img = new Image();
    img.decoding = "async";
    const settle = () => {
      settled += 1;
      listeners.forEach((listener) => listener(settled, FRAME_COUNT));
    };
    // A failed frame still counts as settled so loading can never hang;
    // the canvas skips frames whose naturalWidth is 0.
    img.addEventListener("load", settle, { once: true });
    img.addEventListener("error", settle, { once: true });
    img.src = frameSrc(index, variant);
    return img;
  });

  return images;
}

export function getSequence(): HTMLImageElement[] {
  return images.length ? images : startSequenceLoad();
}

export function onSequenceProgress(listener: ProgressListener): () => void {
  listeners.add(listener);
  listener(settled, FRAME_COUNT);
  return () => {
    listeners.delete(listener);
  };
}
