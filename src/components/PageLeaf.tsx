"use client";

import { useEffect, useMemo, useRef } from "react";
import { MASTHEAD } from "@/data/paper";

/**
 * A sheet of paper that actually bends.
 *
 * A single rotating <div> reads as a rigid board, because that is what it is —
 * CSS cannot curve a plane. So the leaf is built as a chain: thirty slices,
 * each one a child of the last, each translated to the previous slice's far
 * edge and rotated a few degrees more. Under `preserve-3d` that articulated
 * chain approximates a curved surface, and the free edge trails the hinge the
 * way real paper does.
 *
 * The whole transition is one uninterrupted rotation about a hinge at the left
 * edge, from +180° to -180°:
 *
 *   closing  +180° → 0°   the leaf swings up and settles flat over the page
 *   (route swaps here, hidden behind the flat sheet)
 *   opening     0° → -180° the leaf carries on and falls away, revealing it
 *
 * The hinge stays on the left for both halves. That is load-bearing: the slice
 * chain accumulates bend outward from slice 0, so slice 0 has to be the hinge.
 * Hinging on the right for the first half puts the trailing edge on the wrong
 * side and the sheet goes back to reading like a rigid board.
 *
 * Everything is written straight to the DOM from one rAF loop rather than
 * going through React state: thirty nested elements re-rendering per frame
 * would drop frames on exactly the mid-range hardware this needs to look good on.
 */

const SEGMENTS = 30;
const MAX_CURL = 44; // total degrees of bend across the leaf at peak
const DURATION = 660; // ms per phase

export type LeafPhase = "closing" | "opening";

/** Slow at both ends, quick through the middle — a hand turning a page. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function PageLeaf({
  phase,
  onDone,
  frozenAt,
  mirrored = false,
}: {
  phase: LeafPhase;
  onDone?: () => void;
  /** Hold the leaf at a fixed t in [0,2] instead of animating — used both for
      debugging (/?leaf=0.5) and to let a pointer drag scrub the turn. */
  frozenAt?: number;
  /** Flip the whole rig so the hinge reads as the RIGHT edge. Used by the
      drag-corner, where the reader pulls the next page over from the right.
      Mirroring the container preserves the slice chain's hinge-at-slice-0
      invariant; only the printed mark needs counter-flipping to stay legible. */
  mirrored?: boolean;
}) {
  const joints = useRef<(HTMLDivElement | null)[]>([]);
  const faces = useRef<(HTMLDivElement | null)[]>([]);
  const sheens = useRef<(HTMLDivElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  /** Position every joint, face and shadow for a given t in [0, 2]. */
  const paint = useMemo(
    () => (t: number) => {
      // One continuous rotation about the left hinge: +180 (off-screen) →
      // 0 (flat, covering) → -180 (off-screen again). Hinging left for the
      // whole turn matters: the slice chain accumulates its bend away from
      // slice 0, so the hinge has to BE slice 0 or the trailing edge ends up
      // on the wrong side and the leaf reads as a rigid slab.
      const angle = 180 - 180 * t;

      // Bend peaks at each half-turn and is zero whenever the leaf lies flat.
      const curl = MAX_CURL * Math.abs(Math.sin(Math.PI * t));
      const joint = curl / (SEGMENTS - 1);

      if (root.current) {
        root.current.style.transform = `rotateY(${angle.toFixed(3)}deg)`;
      }

      for (let i = 0; i < SEGMENTS; i++) {
        const j = joints.current[i];
        if (j && i > 0) {
          j.style.transform = `translateX(${(100 / SEGMENTS).toFixed(4)}%) rotateY(${joint.toFixed(3)}deg)`;
        }

        const face = faces.current[i];
        const sheen = sheens.current[i];
        if (face || sheen) {
          const cum = (angle + i * joint) * (Math.PI / 180);
          const lambert = Math.abs(Math.cos(cum));
          // Raised to a power so slices still facing the reader stay bright
          // and only the strongly turned ones fall into shade. A linear ramp
          // tints the whole sheet evenly and it stops looking like paper.
          if (face) face.style.opacity = (0.62 * Math.pow(1 - lambert, 1.7)).toFixed(3);
          // A little specular along the part of the curve facing the light.
          if (sheen) sheen.style.opacity = (0.5 * Math.pow(lambert, 3)).toFixed(3);
        }
      }

      // Contact shadow thrown onto whatever is underneath.
      if (shadow.current) {
        const lift = Math.abs(Math.sin(Math.PI * t));
        shadow.current.style.opacity = (lift * 0.5).toFixed(3);
        shadow.current.style.transform = `scaleX(${(1 - lift * 0.25).toFixed(3)})`;
      }
    },
    []
  );

  useEffect(() => {
    if (frozenAt !== undefined) {
      paint(frozenAt);
      return;
    }

    const from = phase === "closing" ? 0 : 1;
    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / DURATION);
      paint(from + easeInOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(step);
      else done.current?.();
    };

    paint(from);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, paint, frozenAt]);

  // Build the nested chain once. Memoised because during a pointer drag this
  // component re-renders every frame — the chain itself never changes, only
  // the styles paint() writes into it.
  const chain = useMemo(() => {
    let acc: React.ReactNode = null;
    for (let i = SEGMENTS - 1; i >= 0; i--) {
      const inner = acc;
      const index = i;
      acc = (
      <div
        ref={(el) => {
          joints.current[index] = el;
        }}
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "0% 50%",
          // The first slice sits at the hinge; every later one steps out by
          // one slice width and adds its share of the bend.
          transform: index === 0 ? undefined : `translateX(${100 / SEGMENTS}%)`,
        }}
      >
        {/* the visible slice of paper */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${100 / SEGMENTS}%` }}
        >
          {/* One continuous sheet, shifted so each slice shows its own portion.
              Without this the printing would be clipped inside a single slice
              instead of running across the whole leaf. */}
          <div
            className="absolute inset-y-0 bg-paper"
            style={{ width: `${SEGMENTS * 100}%`, left: `${-index * 100}%` }}
          >
            <div className="grain-layer absolute inset-0" />
            <LeafMark mirrored={mirrored} />
          </div>

          {/* per-slice shading and sheen, both driven from the rAF loop */}
          <div
            ref={(el) => {
              faces.current[index] = el;
            }}
            className="absolute inset-0 bg-ink"
            style={{ opacity: 0 }}
          />
          <div
            ref={(el) => {
              sheens.current[index] = el;
            }}
            className="absolute inset-0 bg-white"
            style={{ opacity: 0, mixBlendMode: "soft-light" }}
          />
        </div>
        {inner}
      </div>
      );
    }
    return acc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirrored]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{
        perspective: "2200px",
        perspectiveOrigin: "50% 50%",
        // The mirror lives on the outermost element so hinge, chain and
        // shadow all flip together and the slice maths stays untouched.
        transform: mirrored ? "scaleX(-1)" : undefined,
      }}
    >
      {/* shadow cast on the page below the leaf */}
      <div
        ref={shadow}
        className="absolute inset-0 origin-center"
        style={{
          opacity: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.10) 16%, rgba(0,0,0,0) 38%)",
        }}
      />
      <div
        ref={root}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", transformOrigin: "0% 50%" }}
      >
        {chain}
      </div>
    </div>
  );
}

/** The flag printed across the middle of the turning sheet. */
function LeafMark({ mirrored }: { mirrored: boolean }) {
  return (
    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 whitespace-nowrap">
      {/* counter-flip so the printing reads correctly on a mirrored leaf */}
      <div
        className="flex flex-col items-center gap-3"
        style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
      >
        <span className="h-px w-32 bg-ink/30" />
        <span
          className="font-[family-name:var(--font-playfair)] text-xl tracking-[0.34em] text-ink/70 uppercase"
          style={{ fontWeight: 500 }}
        >
          {MASTHEAD.title}
        </span>
        <span className="h-px w-32 bg-ink/30" />
      </div>
    </div>
  );
}
