"use client";

import { motion } from "framer-motion";

export default function Ben10Statement() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  };

  return (
    <section className="bg-white w-full h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        className="flex flex-col items-center text-center uppercase tracking-normal"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="overflow-hidden mb-1 md:mb-2">
          <motion.h2
            variants={itemVariants}
            className="text-[#050505] font-sans font-medium text-2xl md:text-4xl leading-[1.1]"
          >
            REIMAGINING NOSTALGIA FOR THE VERTICAL ERA.
          </motion.h2>
        </div>
        
        <div className="overflow-hidden mb-2 md:mb-4">
          <motion.h2
            variants={itemVariants}
            className="text-[#050505] font-sans font-medium text-2xl md:text-4xl leading-[1.1]"
          >
            HIGH-PACED, KINETIC REEL EDIT FOR
          </motion.h2>
        </div>

        <div className="overflow-hidden mb-12 md:mb-20">
          <motion.h2
            variants={itemVariants}
            className="text-black font-serif italic tracking-normal text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
          >
            BEN 10
          </motion.h2>
        </div>

        <div className="overflow-hidden">
          <motion.p
            variants={itemVariants}
            className="text-gray-400 font-sans text-xs md:text-sm tracking-widest uppercase mt-4"
          >
            VERTICAL REEL FORMAT // 2025
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
