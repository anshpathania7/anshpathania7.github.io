"use client";

import { motion } from "motion/react";
import { STOP_PRESS } from "@/data/paper";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The breaking-news strip. The label thuds in like a rubber stamp — scale
 * overshoot, slight rotation, settling hard — and the message wipes out from
 * behind it. Content lives in `STOP_PRESS` in paper.ts.
 */
export default function StopPress() {
  if (!STOP_PRESS.message) return null;

  return (
    <div className="relative flex items-center gap-3 overflow-hidden border-b border-ink bg-paper-tint px-5 py-2 sm:px-9 lg:px-12">
      <motion.span
        initial={{ scale: 2.6, rotate: -14, opacity: 0 }}
        animate={{ scale: 1, rotate: -2, opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
        className="kicker relative z-10 shrink-0 border-2 border-stamp px-2 py-1 text-stamp"
      >
        {STOP_PRESS.label}
      </motion.span>

      <motion.p
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ delay: 1.5, duration: 0.9, ease: EASE }}
        className="min-w-0 truncate text-[0.8rem] tracking-[0.02em] text-ink-soft"
      >
        {STOP_PRESS.message}
      </motion.p>

      {/* the ghost of the stamp's impact */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: 0, scale: 2.2 }}
        transition={{ delay: 1.5, duration: 0.7, ease: "easeOut" }}
        className="absolute left-5 h-8 w-24 rounded-full bg-stamp/30 sm:left-9 lg:left-12"
      />
    </div>
  );
}
