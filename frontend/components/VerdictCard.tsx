"use client";

import { motion } from "framer-motion";

import Mascot from "./Mascot";

interface Props {
  verdict: string;
  delay?: number;
}

export default function VerdictCard({ verdict, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="frame p-6 sm:p-7 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔥</span>
        <div className="heading text-base uppercase tracking-widest">Final Verdict</div>
        <span className="text-xl ml-1">✎</span>
      </div>

      <p className="font-serif text-xl sm:text-2xl leading-snug text-ink max-w-3xl"
         style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
        {verdict}
      </p>

      <div className="absolute -bottom-2 -right-2 hidden sm:block">
        <Mascot size={120} expression="judging" />
      </div>
    </motion.div>
  );
}
