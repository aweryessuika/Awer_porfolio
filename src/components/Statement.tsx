"use client";

import { motion } from "framer-motion";


export default function Statement() {
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

  const lineVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.19, 1, 0.22, 1],
      },
    },
  };

  return (
    <section className="bg-[#050505] w-full h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        className="flex flex-col items-center text-center uppercase tracking-normal"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div
           variants={lineVariants}
           className="w-[1px] h-32 md:h-48 bg-gradient-to-b from-transparent via-white/30 to-white/10 mb-8 md:mb-12 origin-top"
        />

        <div className="overflow-hidden mb-1 md:mb-2">
          <motion.h2
            variants={itemVariants}
            className="text-[#D4D4D4] font-sans font-medium text-2xl md:text-3xl lg:text-4xl leading-[1.1]"
          >
            VISUAL REALITIES FOR THE UNDERGROUND.
          </motion.h2>
        </div>
        
        <div className="overflow-hidden mb-2 md:mb-4">
          <motion.h2
            variants={itemVariants}
            className="text-[#D4D4D4] font-sans font-medium text-2xl md:text-3xl lg:text-4xl leading-[1.1]"
          >
            DIRECTED AND GENERATED THE RAW AI CAMPAIGN FOR
          </motion.h2>
        </div>

        <div className="overflow-hidden mb-12 md:mb-20">
          <motion.h2
            variants={itemVariants}
            className="text-[#FFFFFF] font-serif italic tracking-normal text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
          >
            GULLY LABS
          </motion.h2>
        </div>

        <div className="overflow-hidden">
          <motion.p
            variants={itemVariants}
            className="text-[#808080] font-sans text-xs md:text-sm tracking-widest uppercase mt-4"
          >
            CAMPAIGN // 2025
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
