"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { STORIES, plateFor } from "@/data/paper";
import Plate from "./Plate";
import Magnetic from "./Magnetic";
import { TurnLink } from "./PageTurn";

const CYCLE_MS = 7000;
const EASE = [0.22, 1, 0.36, 1] as const;

/** The three most recent posts rotate through the lead slot. */
const LEAD = STORIES.slice(0, 3);

export default function HeroStory() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback((step: number) => {
    setDir(step);
    setI((v) => (v + step + LEAD.length) % LEAD.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => advance(1), CYCLE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, advance, i]);

  const story = LEAD[i];

  return (
    <article
      className="flex h-full flex-col border border-rule bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ---- the plate ---- */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-rule bg-paper-tint">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={story.slug}
            className="absolute inset-0"
            initial={{ clipPath: "inset(0% 0% 100% 0%)", scale: 1.08, filter: "blur(6px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 1.05, ease: EASE }}
          >
            <Plate
              motif={story.motif}
              seed={story.slug}
              image={plateFor(story.slug)}
              alt={`${story.org} — ${story.role}`}
              className="h-full w-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* auto-advance progress, drawn as a rule filling across the plate */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/10">
          <motion.div
            key={`${story.slug}-${paused}`}
            className="h-full bg-ink"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? 0 : 1 }}
            transition={{ duration: paused ? 0.3 : CYCLE_MS / 1000, ease: "linear" }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* forward arrow, as in the source design */}
        <TurnLink
          href={`/story/${story.slug}/`}
          className="absolute right-4 bottom-4 z-10"
          aria-label={`Read: ${story.headline}`}
        >
          <Magnetic strength={0.4}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-flag-deep bg-paper transition-colors duration-300 hover:bg-flag">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-stamp" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Magnetic>
        </TurnLink>
      </div>

      {/* ---- the copy ---- */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={story.slug}
            initial={{ opacity: 0, y: dir * 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir * -12 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex flex-1 flex-col"
          >
            <div className="kicker mb-3 text-ink-faint">{story.kicker}</div>

            <TurnLink href={`/story/${story.slug}/`} className="group block">
              <h2
                className="headline text-ink"
                style={{ fontSize: "var(--text-hero)" }}
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-[0%_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {story.headline}{" "}
                  {story.headlineItalic && <em className="italic">{story.headlineItalic}</em>}
                  {story.headlineTail && ` ${story.headlineTail}`}
                </span>
              </h2>
            </TurnLink>

            <p className="dek mt-4 max-w-[46ch]">{story.dek}</p>

            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-ink bg-ink font-[family-name:var(--font-playfair)] text-sm font-bold text-paper">
                  {story.org.slice(0, 2).toUpperCase()}
                </span>
                <div className="leading-tight">
                  <div className="font-[family-name:var(--font-playfair)] text-[1.02rem] font-semibold">
                    {story.org}
                  </div>
                  <div className="mt-0.5 text-[0.74rem] text-ink-faint">{story.period}</div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <ArrowButton dir="prev" onClick={() => advance(-1)} />
                <ArrowButton dir="next" onClick={() => advance(1)} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* slot indicators */}
        <div className="mt-4 flex items-center gap-1.5 border-t border-rule pt-3">
          {LEAD.map((s, idx) => (
            <button
              key={s.slug}
              onClick={() => {
                setDir(idx > i ? 1 : -1);
                setI(idx);
              }}
              aria-label={`Show story ${idx + 1}`}
              className={`h-[3px] flex-1 transition-colors duration-500 ${
                idx === i ? "bg-ink" : "bg-rule hover:bg-rule-mid"
              }`}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <Magnetic strength={0.35}>
      <button
        onClick={onClick}
        aria-label={dir === "prev" ? "Previous story" : "Next story"}
        className="flex h-9 w-9 items-center justify-center border border-ink bg-ink text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
          {dir === "prev" ? (
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>
    </Magnetic>
  );
}
