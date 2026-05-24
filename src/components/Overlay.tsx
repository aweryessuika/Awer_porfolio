"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export default function Overlay({ progress }: { progress: MotionValue<number> }) {
  // Section 1: 0% to 15%. Clamped so it stays at 0 after 15%.
  const opacity1 = useTransform(progress, [0, 0.1, 0.15, 1], [1, 1, 0, 0], { clamp: true });
  const y1 = useTransform(progress, [0, 0.15], ["0vh", "-30vh"]);

  // Section 2: Fades in around 30%, peaks at 35-40%, out by 45%
  const opacity2 = useTransform(progress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const y2 = useTransform(progress, [0.25, 0.45], ["20vh", "-20vh"]);

  // Section 3: Fades in around 60%, peaks at 65-70%, out by 75%
  const opacity3 = useTransform(progress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  const y3 = useTransform(progress, [0.55, 0.75], ["20vh", "-20vh"]);

  return (
    <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-full flex-col md:flex">
      {/* Section 1 */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
        style={{ opacity: opacity1, y: y1 }}
      >
        <h1 className="mb-4 text-4xl font-bold uppercase tracking-tighter text-[#D4D4D4] md:text-6xl">
          PRANJAY RATHORE.
        </h1>
        <p className="text-lg text-[#808080]">
          AI Filmmaker & Creative Developer.
        </p>
      </motion.div>

      {/* Section 2 */}
      <motion.div
        className="absolute inset-0 flex flex-col items-start justify-center p-6 pl-[10vw] text-left"
        style={{ opacity: opacity2, y: y2 }}
      >
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-[#D4D4D4] md:text-6xl">
          Crafting digital experiences with AI and code.
        </h2>
      </motion.div>

      {/* Section 3 */}
      <motion.div
        className="absolute inset-0 flex flex-col items-end justify-center p-6 pr-[10vw] text-right"
        style={{ opacity: opacity3, y: y3 }}
      >
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-[#D4D4D4] md:text-6xl">
          Bridging artificial intelligence and high-end visual design.
        </h2>
      </motion.div>
    </div>
  );
}
