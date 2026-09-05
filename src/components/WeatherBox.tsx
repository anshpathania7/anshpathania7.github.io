"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WEATHER_LINES } from "@/data/paper";

/**
 * The weather box every front page carries, forecasting the only weather that
 * matters here. Lines cycle on a split-flap: the old line hinges up and away,
 * the new one drops in, with a spring so it clacks rather than floats.
 *
 * Starts at index 0 (deterministic for SSR) and begins cycling after mount.
 */
export default function WeatherBox() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % WEATHER_LINES.length), 5200);
    return () => clearInterval(id);
  }, []);

  const line = WEATHER_LINES[i];

  return (
    <div className="border border-ink">
      <div className="flex items-center justify-between border-b border-ink bg-paper-tint px-3 py-1.5">
        <span className="kicker">The Weather</span>
        <SunMark />
      </div>
      <div className="relative h-[4.6rem] overflow-hidden px-3" style={{ perspective: "500px" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={i}
            initial={{ rotateX: -92, y: -8, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            exit={{ rotateX: 88, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            style={{ transformOrigin: "50% 0%" }}
            className="flex h-full flex-col justify-center"
          >
            <div className="font-[family-name:var(--font-playfair)] text-[0.98rem] leading-tight font-bold">
              {line.head}
            </div>
            <div className="mt-1 text-[0.74rem] leading-snug text-ink-faint">{line.detail}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SunMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--art-ink)" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="14" r="5" />
      <path d="M12 5v2M5 14H3m18 0h-2M6.6 8.6 5.2 7.2m12.2 1.4 1.4-1.4" strokeLinecap="round" />
      <path d="M4 19h16" strokeLinecap="round" strokeDasharray="2 3" />
    </svg>
  );
}
