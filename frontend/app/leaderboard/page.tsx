"use client";

import { motion } from "framer-motion";

import Mascot from "@/components/Mascot";
import Navbar from "@/components/Navbar";

interface Entry {
  rank: number;
  idea: string;
  yc: number;
  archetype: string;
  verdict: string;
}

const MOCK_TOP: Entry[] = [
  { rank: 1, idea: "Open-source developer ergonomics tool",     yc: 88, archetype: "Indie Hacker Goldmine", verdict: "Actually compelling. Apply to YC." },
  { rank: 2, idea: "B2B vertical SaaS for dental clinics",      yc: 82, archetype: "Classic YC SaaS",       verdict: "Boring. In a good way." },
  { rank: 3, idea: "AI agent for legal contract review",        yc: 76, archetype: "Actually Genius",      verdict: "Real moat if the data is yours." },
  { rank: 4, idea: "Fintech infra for emerging-market remit.",  yc: 71, archetype: "Classic YC SaaS",       verdict: "Hard, slow, and probably worth it." },
  { rank: 5, idea: "Devtools for ML observability",             yc: 67, archetype: "Indie Hacker Goldmine", verdict: "Crowded — but the buyers pay." },
  { rank: 6, idea: "Healthcare ops automation for clinics",     yc: 64, archetype: "Vertical SaaS Play",    verdict: "Painful sales cycle, real ACV." },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10">
        <div className="frame p-5 sm:p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="display text-4xl sm:text-5xl mb-2">
                <span className="highlight-yellow">LEADERBOARD</span>
              </h1>
              <p className="text-ink-soft text-base max-w-xl">
                Highest-rated startup ideas from this week. The roast panel only respects a handful.
              </p>
            </div>
            <Mascot size={90} expression="happy" />
          </div>

          {/* Table */}
          <div className="frame-flat overflow-hidden bg-paper-cream">
            <div className="hidden sm:grid grid-cols-[60px_1fr_100px_180px] gap-3 px-5 py-3 border-b-[3px] border-ink bg-roast-yellow heading text-xs uppercase tracking-widest">
              <div>#</div>
              <div>Idea</div>
              <div className="text-right">YC %</div>
              <div>Archetype</div>
            </div>

            {MOCK_TOP.map((e, i) => (
              <motion.div
                key={e.rank}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="grid grid-cols-[40px_1fr] sm:grid-cols-[60px_1fr_100px_180px] gap-3 px-5 py-4 border-b-2 border-ink last:border-b-0 items-center hover:bg-paper-warm transition-colors"
              >
                <div className={`heading text-2xl ${e.rank <= 3 ? "text-roast-gold" : "text-ink"}`}
                     style={e.rank <= 3 ? { WebkitTextStroke: "1.5px #1a1612" } : {}}>
                  {e.rank}
                </div>
                <div>
                  <div className="font-medium text-ink">{e.idea}</div>
                  <div className="type text-xs text-ink-muted mt-0.5 italic">"{e.verdict}"</div>
                </div>
                <div className="hidden sm:block text-right heading text-xl text-ink">{e.yc}%</div>
                <div className="hidden sm:block">
                  <span className="pill pill-easy text-[10px]">{e.archetype}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="type text-sm text-ink-muted italic mt-5 text-center">
            Submissions are seeded with mock data — the real leaderboard ships in Phase 3.
          </p>
        </div>
      </div>
    </main>
  );
}
