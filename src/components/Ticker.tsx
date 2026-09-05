"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { SKILL_SCORES } from "@/data/paper";

/**
 * The skills ticker — the film-ratings strip from the source design, re-cast
 * with technologies and scores.
 *
 * It drifts on its own, but scrolling shoves it: scroll down and it speeds up,
 * scroll up and it reverses. That coupling is what stops a marquee from
 * feeling like a decoration bolted onto the page.
 */
export default function Ticker({ baseVelocity = 2.4 }: { baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smooth, [0, 1200], [0, 5], { clamp: false });

  // Four copies: enough that a -25% wrap never exposes an edge.
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    move += direction.current * move * factor;
    baseX.set(baseX.get() + move);
  });

  const strip = (
    <span className="flex shrink-0 items-center">
      {SKILL_SCORES.map((s) => (
        <span key={s.name} className="flex items-center">
          <span className="mx-5 flex items-baseline gap-2 whitespace-nowrap">
            <span className="nav-item text-ink">{s.name}</span>
            <span className="score-chip text-[0.95rem] leading-none">
              {s.score.split(".")[0]}
              <span className="text-[0.62em]">.{s.score.split(".")[1]}</span>
            </span>
          </span>
          <span aria-hidden className="h-5 w-px bg-ink/25" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="relative overflow-hidden border-y border-ink bg-flag/55 py-2.5">
      <motion.div className="flex w-max flex-nowrap" style={{ x }}>
        {strip}
        {strip}
        {strip}
        {strip}
      </motion.div>
    </div>
  );
}
