"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide sound preference. Videos start muted (browsers block unmuted
 * autoplay); once a visitor turns sound on, every reel they scroll to plays
 * with sound until they turn it off again.
 */
let soundOn = false;
const listeners = new Set<() => void>();

export function setSoundOn(next: boolean) {
  if (soundOn === next) return;
  soundOn = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSoundOn(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => soundOn,
    () => false,
  );
}
