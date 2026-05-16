"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

import Mascot from "./Mascot";

type MascotExpression = "happy" | "shocked" | "judging" | "dead";

interface Props {
  label: string;
  value: number | string;
  suffix?: string;
  subtitle?: string;
  type?: "number" | "text" | "slider" | "archetype";
  sliderLabel?: string; // for type="slider": Easy/Medium/Hard/Nightmare
  expression?: MascotExpression;
  showMascot?: boolean;
  delay?: number;
}

const SLIDER_POSITIONS: Record<string, number> = {
  Easy: 18,
  Medium: 50,
  Hard: 78,
  Nightmare: 95,
  Low: 18,
  High: 78,
  Extreme: 95,
  "Very Hard": 88,
};

export default function ScoreCard({
  label,
  value,
  suffix = "",
  subtitle,
  type = "number",
  sliderLabel,
  expression = "happy",
  showMascot = true,
  delay = 0,
}: Props) {
  const target = typeof value === "number" ? value : 0;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (n) => Math.round(n));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (type !== "number") return;
    const controls = animate(count, target, { duration: 1.3, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, count, rounded, type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="frame p-5 relative"
    >
      <div className="heading text-xs uppercase tracking-widest mb-2 text-ink">
        {label}
      </div>

      {type === "number" && (
        <div className="number-big text-6xl">
          {display}
          {suffix}
        </div>
      )}

      {type === "text" && (
        <div className="number-big text-5xl">
          {value}
        </div>
      )}

      {type === "slider" && (
        <div className="my-4">
          <div className="slider-track">
            <motion.div
              className="slider-knob"
              initial={{ left: 0 }}
              animate={{ left: `${SLIDER_POSITIONS[sliderLabel || "Medium"] || 50}%` }}
              transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="heading text-3xl mt-3 uppercase">{sliderLabel}</div>
        </div>
      )}

      {type === "archetype" && (
        <div className="display text-2xl text-roast-gold leading-none my-2"
             style={{ WebkitTextStroke: "1.5px #1a1612" }}>
          {value}
        </div>
      )}

      {subtitle && (
        <div className="text-sm text-ink-soft mt-2 leading-tight">{subtitle}</div>
      )}

      {showMascot && (
        <div className="absolute bottom-3 right-3">
          <Mascot size={42} expression={expression} />
        </div>
      )}
    </motion.div>
  );
}
