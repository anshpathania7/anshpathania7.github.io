"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { usePageTurn } from "./PageTurn";

/**
 * The bottom-right corner of an article, standing slightly proud of the page.
 * Grab it and pull left and the next story turns over in your hand — the same
 * segmented leaf as the link transition, scrubbed by the pointer instead of
 * the clock. A plain click turns the page too.
 *
 * The corner breathes a little on idle so readers notice it exists.
 */
export default function PageCorner({ href, label }: { href: string; label: string }) {
  const { dragTurn, turning } = usePageTurn();
  const router = useRouter();
  const [held, setHeld] = useState(false);
  const [hover, setHover] = useState(false);
  const startX = useRef(0);
  const t = useRef(0);
  const active = useRef(false);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!active.current) return;
      // Most of a viewport's width of pull = a full turn; feels 1:1 in hand.
      t.current = (startX.current - e.clientX) / (window.innerWidth * 0.55);
      dragTurn.move(t.current);
    },
    [dragTurn]
  );

  const onUp = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    setHeld(false);
    window.removeEventListener("pointermove", onMove);
    dragTurn.end(t.current);
  }, [dragTurn, onMove]);

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      if (turning || active.current) return;
      e.preventDefault();
      if (!dragTurn.start(href)) {
        // Reduced motion: no theatre, just go.
        router.push(href);
        return;
      }
      active.current = true;
      setHeld(true);
      startX.current = e.clientX;
      t.current = 0;
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp, { once: true });
    },
    [turning, dragTurn, href, router, onMove, onUp]
  );

  useEffect(
    () => () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    },
    [onMove, onUp]
  );

  return (
    <div className="print-hidden fixed right-0 bottom-0 z-[62]">
      {/* the whispered instruction */}
      <motion.div
        initial={false}
        animate={{ opacity: hover && !held ? 1 : 0, x: hover && !held ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute right-20 bottom-7 flex items-center gap-2 whitespace-nowrap"
      >
        <span className="kicker bg-paper/90 px-2 py-1 text-ink-soft">
          Drag to turn · {label}
        </span>
        <span className="h-px w-6 bg-ink/40" />
      </motion.div>

      <motion.button
        aria-label={`Turn the page: ${label}`}
        onPointerDown={onDown}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative block h-20 w-20 touch-none"
        style={{ cursor: held ? "grabbing" : "grab" }}
        // the idle breath — a corner that lifts a couple of pixels and settles
        animate={
          held
            ? { scale: 1 }
            : hover
              ? { scale: 1.16 }
              : { scale: [1, 1.06, 1] }
        }
        transition={
          held || hover
            ? { type: "spring", stiffness: 300, damping: 22 }
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8 }
        }
      >
        {/* the next page showing through the notch */}
        <span
          aria-hidden
          className="absolute inset-0 bg-ink/15"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
        {/* the lifted corner — the back of this very sheet */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 100%, 100% 0, 0 0)",
            background:
              "linear-gradient(135deg, var(--color-paper) 55%, var(--color-paper-tint) 78%, rgba(18,16,14,0.16) 100%)",
            filter: "drop-shadow(3px 3px 4px rgba(18,16,14,0.28))",
          }}
        />
        {/* crease line along the fold */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 48%, rgba(18,16,14,0.22) 50%, transparent 52%)",
          }}
        />
      </motion.button>
    </div>
  );
}
