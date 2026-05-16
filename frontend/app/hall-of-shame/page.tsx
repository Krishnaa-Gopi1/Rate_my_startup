"use client";

import { motion } from "framer-motion";

import Mascot from "@/components/Mascot";
import Navbar from "@/components/Navbar";

interface Shame {
  idea: string;
  yc: number;
  verdict: string;
  reaction: string;
}

const MOCK_SHAME: Shame[] = [
  {
    idea: "Blockchain-based gym membership with NFT certificates",
    yc: 2,
    verdict: "We will not be writing a check. We will not be returning your call. We will not be remembering your name.",
    reaction: "Bro. Just... no.",
  },
  {
    idea: "Uber, but for goats",
    yc: 4,
    verdict: "There is a 0% chance this needs to exist and a 100% chance you'll learn that on the way.",
    reaction: "Where is the goat-market fit?",
  },
  {
    idea: "AI-powered fridge that judges your food choices",
    yc: 6,
    verdict: "An entire product to make you feel bad in your own kitchen. Inspired. Also: no.",
    reaction: "This is a feature in someone else's product.",
  },
  {
    idea: "Tinder, but only for people who hate Tinder",
    yc: 5,
    verdict: "You've reinvented Tinder with extra steps and worse retention.",
    reaction: "Have you tried therapy instead?",
  },
  {
    idea: "On-chain decentralized laundromat protocol",
    yc: 1,
    verdict: "I have so many questions and zero of them are about laundry.",
    reaction: "Token economics on socks?",
  },
];

export default function HallOfShamePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10">
        <div className="frame p-5 sm:p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <h1 className="display text-4xl sm:text-5xl mb-2">
                <span className="highlight-yellow">HALL OF SHAME</span>
              </h1>
              <p className="text-ink-soft text-base max-w-xl">
                The ideas that broke the panel. Submitted in earnest. Roasted without mercy.
              </p>
            </div>
            <Mascot size={90} expression="dead" wiggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SHAME.map((s, i) => (
              <motion.div
                key={s.idea}
                initial={{ opacity: 0, y: 12, rotate: i % 2 ? 0.5 : -0.5 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 ? 0.4 : -0.4 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="frame p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="heading text-base uppercase leading-tight max-w-[80%]">
                    {s.idea}
                  </div>
                  <div className="frame-sm bg-roast-orange text-paper-cream px-2.5 py-1 heading text-xs uppercase shrink-0">
                    YC {s.yc}%
                  </div>
                </div>
                <p className="font-serif text-base text-ink leading-snug mb-3"
                   style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                  "{s.verdict}"
                </p>
                <div className="type text-xs text-ink-muted italic">
                  Panel reaction: {s.reaction}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="type text-sm text-ink-muted italic mt-6 text-center">
            Want your idea here? You probably already do.
          </p>
        </div>
      </div>
    </main>
  );
}
