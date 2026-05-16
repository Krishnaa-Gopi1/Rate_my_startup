"use client";

import { motion } from "framer-motion";
import type { InvestorReactionT } from "@/lib/types";

interface Props {
  reaction: InvestorReactionT;
  index: number;
}

/** Short display name for compact cards (e.g. "VC CHAD"). */
function shortName(persona: string): string {
  const p = persona.toLowerCase();
  if (p.includes("vc")) return "VC Chad";
  if (p.includes("engineer")) return "Angry Engineer";
  if (p.includes("crypto")) return "Crypto Bro";
  if (p.includes("uncle")) return "Indian Uncle";
  return persona;
}

/** Avatar background color per persona. */
function avatarBg(persona: string): string {
  const p = persona.toLowerCase();
  if (p.includes("vc")) return "#8ec5ff";
  if (p.includes("engineer")) return "#f5a35c";
  if (p.includes("crypto")) return "#c5e8a6";
  if (p.includes("uncle")) return "#ffd44d";
  return "#faf3dc";
}

export default function InvestorReaction({ reaction, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.08 }}
      className="frame-sm p-3 flex items-start gap-3"
    >
      {/* Avatar */}
      <div
        className="shrink-0 w-14 h-14 rounded-full border-[3px] border-ink flex items-center justify-center text-2xl"
        style={{ background: avatarBg(reaction.persona) }}
        aria-hidden="true"
      >
        {reaction.emoji}
      </div>
      {/* Content */}
      <div className="min-w-0 flex-1 pt-1">
        <div className="heading text-xs uppercase tracking-wider mb-1">
          {shortName(reaction.persona)}
        </div>
        <p className="text-sm text-ink-soft leading-snug">{reaction.reaction}</p>
      </div>
    </motion.div>
  );
}
