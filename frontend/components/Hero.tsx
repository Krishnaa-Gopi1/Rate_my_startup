"use client";

import { motion } from "framer-motion";

import Mascot from "./Mascot";

export default function Hero() {
  return (
    <section className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display text-5xl sm:text-6xl lg:text-7xl mb-3">
            PITCH YOUR<br />STARTUP.
          </h1>
          <h2 className="display text-5xl sm:text-6xl lg:text-7xl mb-5">
            <span className="highlight-yellow">GET ROASTED.</span>
          </h2>
          <p className="text-ink-soft text-base sm:text-lg max-w-xl leading-relaxed">
            Get an instant, brutally honest analysis of your genius idea
            from our panel of fake investors, angry engineers and caffeine-fueled VCs.
          </p>
        </motion.div>

        {/* Mascot with speech bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
          className="hidden lg:flex flex-col items-center"
        >
          <div className="bubble heading text-sm mb-4 ml-12">
            LET'S ROAST IT!
          </div>
          <Mascot size={170} wiggle expression="happy" />
        </motion.div>
      </div>
    </section>
  );
}
