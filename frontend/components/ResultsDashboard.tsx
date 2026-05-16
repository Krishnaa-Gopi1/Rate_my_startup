"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import InvestorReaction from "./InvestorReaction";
import ScoreCard from "./ScoreCard";
import VerdictCard from "./VerdictCard";
import type { AnalyzeResponse, Difficulty } from "@/lib/types";

interface Props {
  data: AnalyzeResponse;
  onReset: () => void;
}

/** 0-100 monetization score → discrete label. */
function monetizationLabel(score: number): "Easy" | "Medium" | "Hard" | "Nightmare" {
  if (score < 30) return "Easy";
  if (score < 55) return "Medium";
  if (score < 80) return "Hard";
  return "Nightmare";
}

export default function ResultsDashboard({ data, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const survivalPct = Math.max(0, 100 - data.burnout_risk);
  const monetLabel = monetizationLabel(data.monetization_difficulty);

  function copyShare() {
    const text = [
      `🔥 STARTUP ROAST — "${data.idea}"`,
      ``,
      `📊 YC Chance: ${data.yc_probability}%`,
      `💀 Survival (3mo): ${survivalPct}%`,
      `⚙️  Tech: ${data.technical_difficulty}`,
      `💰 Market: ${data.market_size}`,
      `🏷️  Type: ${data.startup_type}`,
      ``,
      ...data.investor_reactions.slice(0, 2).map((r) => `${r.emoji} "${r.reaction}" — ${r.persona}`),
      ``,
      `🔥 Verdict: ${data.final_verdict}`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="mt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-5 flex-wrap gap-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h2 className="heading text-xl sm:text-2xl uppercase tracking-widest">The Roast Report</h2>
        </div>
        <div className="type text-sm text-ink-muted italic">
          &ldquo;{data.idea}&rdquo;
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* ── Left: 2x3 score grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ScoreCard
            label="YC Acceptance Chance"
            value={data.yc_probability}
            suffix="%"
            subtitle={data.yc_probability < 25 ? "Low chance. High comedy." : data.yc_probability < 50 ? "Possible, but you'll work for it." : "Strong signal. Go apply."}
            expression={data.yc_probability < 30 ? "dead" : "happy"}
            delay={0.05}
          />
          <ScoreCard
            label="Founder Survival (3 months)"
            value={survivalPct}
            suffix="%"
            subtitle={survivalPct < 30 ? "You'll pivot. We know it." : survivalPct < 60 ? "Slim, but possible." : "You might actually make it."}
            expression={survivalPct < 30 ? "dead" : survivalPct < 60 ? "shocked" : "happy"}
            delay={0.1}
          />
          <ScoreCard
            label="Technical Difficulty"
            value=""
            type="slider"
            sliderLabel={data.technical_difficulty}
            subtitle={
              data.technical_difficulty === "Easy" ? "A weekend, max." :
              data.technical_difficulty === "Medium" ? "Doable. With a lot of Stack Overflow." :
              data.technical_difficulty === "Hard" ? "Hope you like long nights." :
              "Don't. Just don't."
            }
            expression={data.technical_difficulty === "Nightmare" ? "dead" : "judging"}
            delay={0.15}
          />
          <ScoreCard
            label="Market Size"
            value={data.market_size}
            type="text"
            subtitle={data.market_size_note}
            expression="judging"
            delay={0.2}
          />
          <ScoreCard
            label="Monetization Difficulty"
            value=""
            type="slider"
            sliderLabel={monetLabel}
            subtitle={
              data.monetization_difficulty < 30 ? "Money is right there." :
              data.monetization_difficulty < 60 ? "How do you even make money?" :
              "Good luck charging anyone."
            }
            expression={data.monetization_difficulty > 70 ? "shocked" : "happy"}
            delay={0.25}
          />
          <ScoreCard
            label="Startup Archetype"
            value={data.startup_type.toUpperCase()}
            type="archetype"
            subtitle={`Powered by AI. Made for hype.`}
            expression="happy"
            delay={0.3}
          />
        </div>

        {/* ── Right: investor reactions ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔥</span>
            <h3 className="heading text-sm uppercase tracking-widest">Investor Reactions</h3>
          </div>
          {data.investor_reactions.map((r, i) => (
            <InvestorReaction key={r.persona} reaction={r} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Final verdict — full width below */}
      <div className="mt-5">
        <VerdictCard verdict={data.final_verdict} delay={0.4} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="type text-sm text-ink-muted">
          Made with 🔥 and questionable life choices.
        </div>
        <div className="flex items-center gap-3">
          <span className="heading text-xs uppercase tracking-widest text-ink-muted hidden sm:block">Share your roast:</span>
          <button onClick={copyShare} className="btn-roast text-sm" aria-label="Copy shareable card">
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button onClick={onReset} className="btn-ghost text-sm">
            Roast Another →
          </button>
        </div>
      </div>
    </div>
  );
}
