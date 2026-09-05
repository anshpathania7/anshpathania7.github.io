"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { EDITION_KEY, type Edition } from "@/lib/edition";
import Magnetic from "./Magnetic";

/**
 * Morning edition / night edition.
 *
 * The actual theme was already applied by the blocking script in <head>, so
 * this only mirrors that state and writes the reader's choice back. Rendering
 * is deferred until after mount: the server has no way to know which edition
 * this reader takes, and guessing produces a hydration mismatch.
 */
export default function EditionToggle() {
  const [edition, setEdition] = useState<Edition | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setEdition(current === "dark" ? "night" : "morning");
  }, []);

  // Follow the OS while the reader hasn't expressed a preference of their own.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(EDITION_KEY)) return;
      const next: Edition = e.matches ? "night" : "morning";
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      setEdition(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const swap = useCallback(() => {
    setEdition((prev) => {
      const next: Edition = prev === "night" ? "morning" : "night";
      const root = document.documentElement;

      // Paint the change over ~400ms instead of snapping. The class is removed
      // afterwards so it never interferes with the page's own animations.
      root.classList.add("edition-transition");
      root.setAttribute("data-theme", next === "night" ? "dark" : "light");
      window.setTimeout(() => root.classList.remove("edition-transition"), 500);

      try {
        localStorage.setItem(EDITION_KEY, next);
      } catch {
        /* private browsing — the choice just won't persist */
      }
      return next;
    });
  }, []);

  // Reserve the space so the nav doesn't reflow when this appears.
  if (edition === null) return <span aria-hidden className="inline-block h-8 w-[3.9rem]" />;

  const night = edition === "night";

  return (
    <Magnetic strength={0.25}>
      <button
        onClick={swap}
        role="switch"
        aria-checked={night}
        aria-label={night ? "Switch to the morning edition" : "Switch to the night edition"}
        title={night ? "Morning edition" : "Night edition"}
        className="group relative flex h-8 w-[3.9rem] items-center border border-ink px-1"
      >
        {/* the travelling slug */}
        <motion.span
          className="absolute top-1 bottom-1 w-[1.65rem] bg-ink"
          animate={{ x: night ? "1.55rem" : "0rem" }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          aria-hidden
        />
        <span className="relative z-10 flex w-full items-center justify-between">
          <Glyph kind="sun" active={!night} />
          <Glyph kind="moon" active={night} />
        </span>
      </button>
    </Magnetic>
  );
}

function Glyph({ kind, active }: { kind: "sun" | "moon"; active: boolean }) {
  return (
    <span
      className={`flex h-[1.45rem] w-[1.45rem] items-center justify-center transition-colors duration-300 ${
        active ? "text-paper" : "text-ink-faint"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        {kind === "sun" ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              const r1 = 7.2;
              const r2 = 10;
              return (
                <line
                  key={i}
                  x1={round(12 + Math.cos(a) * r1)}
                  y1={round(12 + Math.sin(a) * r1)}
                  x2={round(12 + Math.cos(a) * r2)}
                  y2={round(12 + Math.sin(a) * r2)}
                  strokeLinecap="round"
                />
              );
            })}
          </>
        ) : (
          <path
            d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}

/** Same ulp guard as the other engravings — keep SSR and the client identical. */
const round = (n: number) => Math.round(n * 100) / 100;
