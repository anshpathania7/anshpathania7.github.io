"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Two bits of theatre that live outside the layout flow.
 *
 * INK DRY — on the first visit of a session, the sheet comes off the press
 * wet: slightly blurred and washed out, sharpening over a second as the ink
 * sets. Class is added post-mount (no SSR mismatch), gated by sessionStorage,
 * skipped for reduced motion.
 *
 * THE FLUTTER — type "flutter" anywhere and a flock of newsprint butterflies
 * lifts off the page. A reward for the one recruiter who tries it.
 */
export default function PressRoom() {
  const [flock, setFlock] = useState(0);

  // ---- ink dry ----
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    try {
      if (sessionStorage.getItem("pp-printed")) return;
      sessionStorage.setItem("pp-printed", "1");
    } catch {
      /* private browsing: dry the ink every visit, no harm done */
    }
    const root = document.documentElement;
    root.classList.add("ink-dry");
    const t = setTimeout(() => root.classList.remove("ink-dry"), 1400);
    return () => clearTimeout(t);
  }, []);

  // ---- the flutter ----
  useEffect(() => {
    const WORD = "flutter";
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /input|textarea/i.test(el.tagName)) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-WORD.length);
      if (buffer === WORD) {
        buffer = "";
        setFlock((n) => n + 1); // keyed remount releases a fresh flock
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>{flock > 0 && <Flock key={flock} />}</AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */

const COUNT = 12;

/** Deterministic pseudo-randoms per butterfly — no Math.random in render. */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function Flock() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 7000);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[85] overflow-hidden">
      {Array.from({ length: COUNT }, (_, i) => {
        const startX = 8 + rnd(i, 1) * 84; // vw
        const drift = (rnd(i, 2) - 0.5) * 44; // vw of lateral wander
        const dur = 4.2 + rnd(i, 3) * 2.4;
        const delay = rnd(i, 4) * 1.1;
        const size = 22 + rnd(i, 5) * 22;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${startX}vw`, top: "104vh" }}
            initial={{ y: 0, x: 0, rotate: (rnd(i, 6) - 0.5) * 40 }}
            animate={{
              y: "-125vh",
              x: [`0vw`, `${drift * 0.4}vw`, `${drift}vw`],
              rotate: [(rnd(i, 6) - 0.5) * 40, (rnd(i, 7) - 0.5) * 60],
            }}
            transition={{ duration: dur, delay, ease: [0.3, 0.6, 0.6, 1] }}
          >
            <Butterfly size={size} flapSeconds={0.22 + rnd(i, 8) * 0.16} />
          </motion.div>
        );
      })}
    </div>
  );
}

/** A butterfly cut from newsprint — two halftone wings flapping in 3D. */
function Butterfly({ size, flapSeconds }: { size: number; flapSeconds: number }) {
  return (
    <div style={{ width: size, height: size * 0.8, perspective: "200px" }} className="relative">
      <motion.div
        className="absolute inset-y-0 left-1/2 w-1/2"
        style={{ transformOrigin: "0% 50%" }}
        animate={{ rotateY: [58, -52, 58] }}
        transition={{ duration: flapSeconds, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wing flip={false} />
      </motion.div>
      <motion.div
        className="absolute inset-y-0 right-1/2 w-1/2"
        style={{ transformOrigin: "100% 50%" }}
        animate={{ rotateY: [-58, 52, -58] }}
        transition={{ duration: flapSeconds, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wing flip />
      </motion.div>
      {/* body */}
      <div className="absolute top-1/2 left-1/2 h-3/5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/80" />
    </div>
  );
}

function Wing({ flip }: { flip: boolean }) {
  return (
    <svg
      viewBox="0 0 50 80"
      className="h-full w-full"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <path
        d="M4 40 C 2 12, 22 2, 38 8 C 50 13, 48 30, 34 38 C 46 44, 48 60, 36 68 C 22 76, 4 66, 4 40 Z"
        fill="var(--color-paper-tint)"
        stroke="var(--art-ink)"
        strokeWidth="2.5"
      />
      <g fill="var(--art-ink)" opacity="0.5">
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 3 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={14 + c * 9} cy={16 + r * 11} r="1.6" />
          ))
        )}
      </g>
    </svg>
  );
}
