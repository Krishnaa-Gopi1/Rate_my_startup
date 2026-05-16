"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ResultsDashboard from "@/components/ResultsDashboard";
import StartupInput from "@/components/StartupInput";
import Mascot from "@/components/Mascot";
import { analyzeStartup } from "@/lib/api";
import type { AnalyzeResponse } from "@/lib/types";

const LOADING_MSGS = [
  "Heating up the roast…",
  "Calling the VC chad…",
  "Waking up the angry engineer…",
  "Calculating failure probability…",
  "Writing your obituary…",
  "Detecting AI wrapper patterns…",
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loadingIdx, setLoadingIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingIdx((i) => (i + 1) % LOADING_MSGS.length), 1500);
    return () => clearInterval(t);
  }, [loading]);

  async function handleSubmit(idea: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingIdx(0);
    try {
      const data = await analyzeStartup(idea);
      setResult(data);
      setTimeout(() => {
        document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10">
        {/* Hero + input frame */}
        <div className="frame p-5 sm:p-8">
          <Hero />
          <StartupInput loading={loading} onSubmit={handleSubmit} />
        </div>

        {/* Loading state */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 frame p-6 text-center max-w-md mx-auto"
            >
              <div className="flex justify-center mb-3">
                <Mascot size={60} expression="shocked" wiggle />
              </div>
              <div className="heading text-base uppercase tracking-widest mb-1">
                {LOADING_MSGS[loadingIdx]}
              </div>
              <div className="type text-xs text-ink-muted">Usually a few seconds</div>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 frame p-4 max-w-2xl"
              style={{ background: "#fff1ec", borderColor: "#c83d2a" }}
            >
              <div className="heading text-sm uppercase text-roast-red mb-1">⚠ Roast Failed</div>
              <div className="type text-sm text-ink-soft">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="results-anchor" />

        {result && !loading && <ResultsDashboard data={result} onReset={reset} />}
      </div>
    </main>
  );
}
