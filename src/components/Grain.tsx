"use client";

/**
 * Two overlays that sell the paper: a fixed grain screen, and a soft vignette
 * that keeps the corners of the sheet from feeling like a flat rectangle.
 * Both are pointer-events-none and sit above everything.
 */
export default function Grain() {
  return (
    <>
      <div
        aria-hidden
        className="grain-layer pointer-events-none fixed inset-0 z-[70] opacity-[0.16] mix-blend-multiply"
        style={{ backgroundSize: "180px 180px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[69]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(18,16,14,0.10) 100%)",
        }}
      />
    </>
  );
}
