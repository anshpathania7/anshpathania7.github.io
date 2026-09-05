"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A reading lamp that follows the pointer — warms the newsprint slightly and
 * grows when hovering anything interactive. Disabled on touch and for anyone
 * who has asked for reduced motion.
 */
export default function CursorLamp() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 380, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 380, damping: 40, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // target can be window/document for synthetic or retargeted events,
      // and those have no .closest.
      const el = e.target instanceof Element ? e.target : null;
      setHot(!!el?.closest("a, button, [data-lamp]"));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="cursor-lamp pointer-events-none fixed z-[68]"
      style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{ width: hot ? 460 : 300, height: hot ? 460 : 300, opacity: hot ? 0.5 : 0.32 }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
        style={{
          background:
            "radial-gradient(circle, var(--lamp-core) 0%, var(--lamp-mid) 42%, transparent 70%)",
        }}
        className="rounded-full"
      />
    </motion.div>
  );
}
