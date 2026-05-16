"use client";

import { motion } from "framer-motion";

/**
 * Retro cartoon mascot — a "roasted bean" face drawn with SVG.
 * Used as decoration throughout the app.
 */
interface Props {
  size?: number;
  className?: string;
  expression?: "happy" | "shocked" | "judging" | "dead";
  wiggle?: boolean;
}

export default function Mascot({ size = 64, className = "", expression = "happy", wiggle = false }: Props) {
  const eyes = {
    happy: <>
      <circle cx="38" cy="48" r="3.5" fill="#1a1612" />
      <circle cx="62" cy="48" r="3.5" fill="#1a1612" />
    </>,
    shocked: <>
      <circle cx="38" cy="48" r="5" fill="#1a1612" />
      <circle cx="62" cy="48" r="5" fill="#1a1612" />
      <circle cx="36" cy="46" r="1.5" fill="#faf3dc" />
      <circle cx="60" cy="46" r="1.5" fill="#faf3dc" />
    </>,
    judging: <>
      <path d="M33 47 L43 49" stroke="#1a1612" strokeWidth="3" strokeLinecap="round" />
      <path d="M57 49 L67 47" stroke="#1a1612" strokeWidth="3" strokeLinecap="round" />
    </>,
    dead: <>
      <path d="M33 44 L43 52 M43 44 L33 52" stroke="#1a1612" strokeWidth="3" strokeLinecap="round" />
      <path d="M57 44 L67 52 M67 44 L57 52" stroke="#1a1612" strokeWidth="3" strokeLinecap="round" />
    </>,
  };

  const mouth = {
    happy: <path d="M38 62 Q50 72 62 62" stroke="#1a1612" strokeWidth="3" fill="none" strokeLinecap="round" />,
    shocked: <ellipse cx="50" cy="66" rx="5" ry="6" fill="#1a1612" />,
    judging: <path d="M40 66 L60 64" stroke="#1a1612" strokeWidth="3" strokeLinecap="round" />,
    dead: <path d="M40 67 Q50 60 60 67" stroke="#1a1612" strokeWidth="3" fill="none" strokeLinecap="round" />,
  };

  return (
    <motion.svg
      animate={wiggle ? { rotate: [-3, 3, -3] } : {}}
      transition={wiggle ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : {}}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ display: "block" }}
    >
      {/* Outer body */}
      <circle cx="50" cy="50" r="40" fill="#faf3dc" stroke="#1a1612" strokeWidth="3.5" />
      {/* Halftone shading on right */}
      <circle cx="50" cy="50" r="40" fill="url(#dots)" opacity="0.35" />
      <defs>
        <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.9" fill="#1a1612" />
        </pattern>
      </defs>
      {/* Cheeks */}
      <ellipse cx="32" cy="58" rx="5" ry="3" fill="#e85d3a" opacity="0.6" />
      <ellipse cx="68" cy="58" rx="5" ry="3" fill="#e85d3a" opacity="0.6" />
      {/* Eyes */}
      {eyes[expression]}
      {/* Mouth */}
      {mouth[expression]}
      {/* Sparkle */}
      <path d="M75 25 L77 30 L82 32 L77 34 L75 39 L73 34 L68 32 L73 30 Z" fill="#1a1612" />
    </motion.svg>
  );
}
