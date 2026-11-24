"use client";

import { useEffect, useRef } from "react";

const formatter =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : null;

/** Live IST clock. Renders a stable placeholder on the server, ticks on the client. */
export default function LiveClock({ className }: { className?: string }) {
  const ref = useRef<HTMLTimeElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !formatter) return;
    const update = () => {
      node.textContent = formatter.format(new Date());
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time ref={ref} className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      --:--:--
    </time>
  );
}
