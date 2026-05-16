"use client";

import { motion } from "framer-motion";

import Mascot from "@/components/Mascot";
import Navbar from "@/components/Navbar";

const PANEL = [
  { emoji: "💼", name: "VC Chad", bg: "#8ec5ff", quote: "Talk to me about distribution." },
  { emoji: "😤", name: "Angry Engineer", bg: "#f5a35c", quote: "Your inference bill is going to be massive." },
  { emoji: "🚀", name: "Crypto Bro", bg: "#c5e8a6", quote: "Can this be on-chain?" },
  { emoji: "🤔", name: "Indian Uncle", bg: "#ffd44d", quote: "But when profit?" },
];

const STEPS = [
  {
    n: "01",
    title: "You pitch",
    body: "Type your startup idea in plain English. Be specific, vague, brilliant, or unhinged — the panel doesn't care.",
  },
  {
    n: "02",
    title: "Rules do most of the work",
    body: "A rule engine grades YC chance, technical difficulty, monetization, and burnout from keywords. Fast, cheap, and surprisingly accurate.",
  },
  {
    n: "03",
    title: "AI writes the verdict",
    body: "Groq's Llama-3.3 70B writes the final two-sentence roast. The rest is templated personas reacting to the scores.",
  },
  {
    n: "04",
    title: "You share or cry",
    body: "Copy a shareable card and post it. Or pivot. Or pretend you never saw this.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-8 sm:py-10 space-y-6">
        {/* Header */}
        <div className="frame p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 className="display text-4xl sm:text-5xl mb-3">
                ABOUT
                <br />
                <span className="highlight-yellow">THE ROAST.</span>
              </h1>
              <p className="text-ink-soft text-base max-w-2xl leading-relaxed">
                Startup Roast is a one-input toy that simulates a panel of investors,
                engineers, and the worst founder in your group chat. It's not real
                financial advice. It is real entertainment.
              </p>
            </div>
            <Mascot size={110} expression="happy" wiggle />
          </div>
        </div>

        {/* How it works */}
        <div className="frame p-6 sm:p-8">
          <h2 className="heading text-xl uppercase tracking-widest mb-5 flex items-center gap-2">
            <span>🔥</span> How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="frame-sm p-4 bg-paper-cream"
              >
                <div className="display text-3xl text-roast-gold mb-1"
                     style={{ WebkitTextStroke: "1.5px #1a1612" }}>
                  {step.n}
                </div>
                <div className="heading text-sm uppercase tracking-wider mb-2">{step.title}</div>
                <p className="text-sm text-ink-soft leading-snug">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meet the panel */}
        <div className="frame p-6 sm:p-8">
          <h2 className="heading text-xl uppercase tracking-widest mb-5 flex items-center gap-2">
            <span>🎤</span> Meet the panel
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PANEL.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="frame-sm p-4 bg-paper-cream text-center"
              >
                <div
                  className="mx-auto w-16 h-16 rounded-full border-[3px] border-ink flex items-center justify-center text-3xl mb-3"
                  style={{ background: p.bg }}
                >
                  {p.emoji}
                </div>
                <div className="heading text-sm uppercase mb-2">{p.name}</div>
                <p className="type text-xs text-ink-muted italic">"{p.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="frame p-6 sm:p-8">
          <h2 className="heading text-xl uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>⚙️</span> Built with
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "React", "Tailwind", "Framer Motion", "FastAPI", "Pydantic", "Groq", "Llama 3.3"].map((t) => (
              <span key={t} className="pill pill-medium">{t}</span>
            ))}
          </div>
          <p className="type text-sm text-ink-muted italic mt-4">
            Open source. Built for laughs. No actual investment advice was harmed in the making of this app.
          </p>
        </div>
      </div>
    </main>
  );
}
