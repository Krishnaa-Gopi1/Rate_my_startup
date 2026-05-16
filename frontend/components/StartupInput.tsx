"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EXAMPLES = [
  "AI-powered fridge therapist",
  "Uber for goats",
  "Tinder but for cofounders",
  "Drone-based tea delivery",
  "LinkedIn but anonymous",
  "Duolingo for cooking",
];

interface Props {
  loading: boolean;
  onSubmit: (idea: string) => void;
}

export default function StartupInput({ loading, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setExampleIdx((i) => (i + 1) % EXAMPLES.length), 3000);
    return () => clearInterval(t);
  }, []);

  function submit() {
    const idea = value.trim();
    if (!idea || loading) return;
    onSubmit(idea);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mt-6"
    >
      <div className="flex items-stretch gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Describe your startup idea..."
          className="input-roast flex-1"
          disabled={loading}
        />
        <button
          onClick={submit}
          disabled={loading || !value.trim()}
          aria-label="Roast my startup"
          className="btn-roast !p-0 w-14 h-auto text-2xl font-display"
          style={{ minWidth: "3.5rem" }}
        >
          {loading ? (
            <span className="animate-spin inline-block">⟳</span>
          ) : (
            <span>→</span>
          )}
        </button>
      </div>
      <p className="type text-sm text-ink-muted italic mt-3">
        Example: &ldquo;{EXAMPLES[exampleIdx]}&rdquo;
      </p>
    </motion.div>
  );
}
