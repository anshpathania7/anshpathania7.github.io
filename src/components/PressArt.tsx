"use client";

import { useId } from "react";
import type { Motif } from "@/data/paper";

/**
 * Procedural newspaper engravings.
 *
 * There are no photographs in this paper, so the art is set the way a press of
 * the period would have done it: line work plus a halftone dot screen for
 * tone. Every composition is deterministic — seeded, order-independent
 * hashing, no Math.random — so the server and the client draw the same picture.
 */

/**
 * Positional noise: a pure function of (seed, index, salt).
 *
 * Deliberately NOT a sequential generator. A stateful `next()` closure shared
 * between a parent and its motif child is impure with respect to render order,
 * so React's development double-render advances it further on the client than
 * on the server and the two draw different pictures — a hydration mismatch.
 * Hashing the coordinates instead makes every value order-independent.
 */
function noise(seed: number, index: number, salt = 0): number {
  let t = (seed ^ Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), 1 | t);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/* Themed so the plates invert with the edition. CSS custom properties are
   valid in SVG presentation attributes in every current browser. */
const INK = "var(--art-ink)";
const PLATE = "var(--art-paper)";

/**
 * Snap a computed coordinate to 2dp.
 *
 * Math.sin/Math.cos are not required to be correctly rounded, so Node and
 * JavaScriptCore disagree in the final bit. That is enough for the SSR string
 * and the hydrated attribute to differ and for React to report a mismatch.
 * Rounding puts both engines on the same value (and shrinks the markup).
 */
const q = (n: number) => Math.round(n * 100) / 100;

export default function PressArt({
  motif,
  seed = "press",
  className,
}: {
  motif: Motif;
  seed?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const p = (n: string) => `${n}-${uid}`;
  const s = hash(seed);

  return (
    <svg
      viewBox="0 0 800 520"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Engraving: ${motif}`}
    >
      <defs>
        {/* Halftone screens, coarse to fine. */}
        <pattern id={p("dot-c")} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.6" fill={INK} />
        </pattern>
        <pattern id={p("dot-m")} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.7" fill={INK} />
        </pattern>
        <pattern id={p("dot-f")} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="0.95" fill={INK} />
        </pattern>
        <pattern
          id={p("hatch")}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke={INK} strokeWidth="1.5" />
        </pattern>

        {/* Tonal ramp — lets a flat dot screen fall off like real ink. */}
        <linearGradient id={p("ramp")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={p("fade")}>
          <rect width="800" height="520" fill={`url(#${p("ramp")})`} />
        </mask>

        <radialGradient id={p("glow")} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={p("vig")}>
          <rect width="800" height="520" fill={`url(#${p("glow")})`} />
        </mask>
      </defs>

      <rect width="800" height="520" fill={PLATE} />

      {motif === "device" && <Device p={p} s={s} />}
      {motif === "map" && <Map p={p} s={s} />}
      {motif === "grid" && <Grid p={p} s={s} />}
      {motif === "stack" && <Stack p={p} s={s} />}
      {motif === "signal" && <Signal p={p} s={s} />}
      {motif === "ledger" && <Ledger p={p} s={s} />}
      {motif === "orbit" && <Orbit p={p} s={s} />}
      {motif === "flame" && <Flame p={p} s={s} />}

      {/* Screen the whole plate so it reads as printed, not drawn. */}
      <rect
        width="800"
        height="520"
        fill={`url(#${p("dot-f")})`}
        opacity="0.22"
        mask={`url(#${p("fade")})`}
      />
    </svg>
  );
}

type Sub = { p: (n: string) => string; s: number };

/* ---------------- device: an SDK reaching across platforms --------------- */
function Device({ p, s }: Sub) {
  const rings = [110, 158, 206, 254, 302];
  return (
    <g>
      <rect
        width="800"
        height="520"
        fill={`url(#${p("dot-m")})`}
        opacity="0.5"
        mask={`url(#${p("vig")})`}
      />
      <g fill="none" stroke={INK} strokeWidth="1.25" opacity="0.55">
        {rings.map((rad, i) => (
          <circle key={rad} cx="400" cy="262" r={rad} strokeDasharray={i % 2 ? "3 7" : undefined} />
        ))}
      </g>
      {/* handset */}
      <g transform="translate(400 262)">
        <rect x="-84" y="-150" width="168" height="300" rx="22" fill={PLATE} stroke={INK} strokeWidth="3.5" />
        <rect x="-68" y="-126" width="136" height="228" fill={`url(#${p("dot-c")})`} opacity="0.85" />
        <rect x="-68" y="-126" width="136" height="228" fill="none" stroke={INK} strokeWidth="1.5" />
        <rect x="-20" y="-142" width="40" height="6" rx="3" fill={INK} />
        <rect x="-26" y="112" width="52" height="6" rx="3" fill={INK} />
      </g>
      {/* code brackets, the API surface */}
      <g stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M196 178 L146 262 L196 346" />
        <path d="M604 178 L654 262 L604 346" />
      </g>
      {/* connection nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + 0.4 + noise(s, i, 0) * 0.15;
        return (
          <circle key={i} cx={q(400 + Math.cos(a) * 302)} cy={q(262 + Math.sin(a) * 302)} r="7" fill={INK} />
        );
      })}
    </g>
  );
}

/* ---------------- map: contour country with a field route --------------- */
function Map({ p, s }: Sub) {
  const contours = Array.from({ length: 9 }, (_, i) => {
    const k = i * 26;
    const wob = 18 + noise(s, i, 1) * 12;
    return [
      `M-40 ${150 + k}`,
      `C 140 ${110 + k - wob}, 250 ${210 + k + wob}, 400 ${168 + k}`,
      `S 660 ${120 + k - wob}, 840 ${186 + k}`,
    ].join(" ");
  });
  return (
    <g>
      <rect width="800" height="520" fill={`url(#${p("dot-f")})`} opacity="0.45" />
      <g fill="none" stroke={INK} strokeWidth="1.5" opacity="0.6">
        {contours.map((d, i) => (
          <path key={i} d={d} opacity={1 - i * 0.07} />
        ))}
      </g>
      {/* route */}
      <path
        d="M120 420 L232 330 L318 358 L432 236 L556 268 L668 150"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 10"
      />
      {[
        [120, 420],
        [318, 358],
        [556, 268],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="9" fill={PLATE} stroke={INK} strokeWidth="3.5" />
      ))}
      {/* destination pin */}
      <g transform="translate(668 150)">
        <path
          d="M0 22 C -26 -12, -34 -30, -18 -44 C -6 -55, 6 -55, 18 -44 C 34 -30, 26 -12, 0 22 Z"
          fill={INK}
        />
        <circle cx="0" cy="-34" r="8.5" fill={PLATE} />
        <g fill="none" stroke={INK} strokeWidth="2" opacity="0.7">
          <circle cx="0" cy="22" r="34" />
          <circle cx="0" cy="22" r="58" strokeDasharray="4 8" />
        </g>
      </g>
    </g>
  );
}

/* ---------------- grid: an estate of applications ----------------------- */
function Grid({ p, s }: Sub) {
  const cells: { x: number; y: number; fill: string }[] = [];
  const cols = 6;
  const rows = 4;
  for (let c = 0; c < cols; c++) {
    for (let ro = 0; ro < rows; ro++) {
      const v = noise(s, c * rows + ro, 2);
      cells.push({
        x: 70 + c * 112,
        y: 66 + ro * 100,
        fill: v > 0.72 ? p("dot-c") : v > 0.4 ? p("dot-m") : p("dot-f"),
      });
    }
  }
  return (
    <g>
      {cells.map((cell, i) => (
        <g key={i} transform={`translate(${cell.x} ${cell.y})`}>
          <rect width="86" height="76" rx="12" fill={PLATE} stroke={INK} strokeWidth="2.5" />
          <rect width="86" height="76" rx="12" fill={`url(#${cell.fill})`} opacity="0.8" />
        </g>
      ))}
      <rect
        width="800"
        height="520"
        fill={PLATE}
        opacity="0.55"
        mask={`url(#${p("fade")})`}
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  );
}

/* ---------------- stack: sheets coming off the press -------------------- */
function Stack({ p, s }: Sub) {
  const layers = Array.from({ length: 7 }, (_, i) => i);
  return (
    <g>
      <rect width="800" height="520" fill={`url(#${p("dot-f")})`} opacity="0.35" />
      {layers.map((i) => {
        const y = 400 - i * 44;
        const skew = (noise(s, i, 3) - 0.5) * 26;
        return (
          <g key={i} transform={`translate(${skew} 0)`} opacity={0.35 + i * 0.09}>
            <path
              d={`M180 ${y} L400 ${y - 56} L620 ${y} L400 ${y + 56} Z`}
              fill={PLATE}
              stroke={INK}
              strokeWidth="2.5"
            />
            <path
              d={`M180 ${y} L400 ${y - 56} L620 ${y} L400 ${y + 56} Z`}
              fill={`url(#${i % 2 ? p("dot-m") : p("dot-f")})`}
              opacity="0.55"
            />
          </g>
        );
      })}
    </g>
  );
}

/* ---------------- signal: the 73 per cent fall -------------------------- */
function Signal({ p, s }: Sub) {
  const bars = [0.94, 0.88, 0.97, 0.82, 0.9, 0.86, 0.44, 0.3, 0.26, 0.22, 0.25, 0.19];
  return (
    <g>
      <rect width="800" height="520" fill={`url(#${p("dot-f")})`} opacity="0.4" />
      {/* baseline grid */}
      <g stroke={INK} strokeWidth="1" opacity="0.28">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="70" y1={110 + i * 78} x2="730" y2={110 + i * 78} />
        ))}
      </g>
      {bars.map((v, i) => {
        const w = 40;
        const x = 82 + i * 54;
        const h = v * 300;
        return (
          <g key={i}>
            <rect x={x} y={422 - h} width={w} height={h} fill={`url(#${p(i < 6 ? "dot-c" : "dot-f")})`} />
            <rect
              x={x}
              y={422 - h}
              width={w}
              height={h}
              fill="none"
              stroke={INK}
              strokeWidth="2.25"
            />
          </g>
        );
      })}
      <line x1="70" y1="422" x2="730" y2="422" stroke={INK} strokeWidth="3.5" />
      {/* the drop, called out */}
      <g transform={`translate(${400 + (noise(s, 0, 4) - 0.5) * 6} 96)`}>
        <path d="M0 -18 L0 74" stroke={INK} strokeWidth="2.5" strokeDasharray="6 6" />
        <path d="M-13 58 L0 78 L13 58 Z" fill={INK} />
      </g>
    </g>
  );
}

/* ---------------- ledger: money moving through the books ---------------- */
function Ledger({ p, s }: Sub) {
  const rows = Array.from({ length: 11 }, (_, i) => 92 + i * 34);
  return (
    <g>
      <rect x="90" y="52" width="620" height="416" fill={PLATE} stroke={INK} strokeWidth="3" />
      <g stroke={INK} strokeWidth="1" opacity="0.42">
        {rows.map((y) => (
          <line key={y} x1="90" y1={y} x2="710" y2={y} />
        ))}
        <line x1="470" y1="52" x2="470" y2="468" strokeWidth="1.5" />
        <line x1="590" y1="52" x2="590" y2="468" strokeWidth="1.5" />
      </g>
      {/* entries */}
      {rows.slice(0, 10).map((y, i) => {
        const w = 120 + noise(s, i, 5) * 220;
        return (
          <g key={y}>
            <rect x="112" y={y + 9} width={w} height="12" fill={`url(#${p("dot-m")})`} opacity="0.75" />
            <rect x="492" y={y + 9} width={noise(s, i, 6) > 0.5 ? 62 : 44} height="12" fill={INK} opacity="0.72" />
            {i % 3 === 0 && <circle cx="640" cy={y + 15} r="8" fill={INK} />}
          </g>
        );
      })}
      <rect x="90" y="52" width="620" height="34" fill={INK} />
      <line x1="90" y1="440" x2="710" y2="440" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------------- orbit: decoupled modules ------------------------------ */
function Orbit({ p, s }: Sub) {
  const shells = [96, 158, 222, 288];
  return (
    <g>
      <rect
        width="800"
        height="520"
        fill={`url(#${p("dot-f")})`}
        opacity="0.4"
        mask={`url(#${p("vig")})`}
      />
      <g fill="none" stroke={INK} strokeWidth="1.75" opacity="0.6">
        {shells.map((rad, i) => (
          <ellipse
            key={rad}
            cx="400"
            cy="262"
            rx={rad}
            ry={rad * (0.62 + i * 0.06)}
            strokeDasharray={i % 2 ? "5 9" : undefined}
          />
        ))}
      </g>
      {/* core */}
      <circle cx="400" cy="262" r="52" fill={`url(#${p("dot-c")})`} />
      <circle cx="400" cy="262" r="52" fill="none" stroke={INK} strokeWidth="3.5" />
      {/* modules */}
      {shells.flatMap((rad, si) =>
        Array.from({ length: si + 2 }, (_, i) => {
          const a = (i / (si + 2)) * Math.PI * 2 + si * 0.7 + noise(s, si * 16 + i, 7) * 0.3;
          const cx = q(400 + Math.cos(a) * rad);
          const cy = q(262 + Math.sin(a) * rad * (0.62 + si * 0.06));
          const size = 15 - si * 1.6;
          return (
            <g key={`${si}-${i}`}>
              <rect
                x={cx - size}
                y={cy - size}
                width={size * 2}
                height={size * 2}
                fill={PLATE}
                stroke={INK}
                strokeWidth="2.5"
                transform={`rotate(45 ${cx} ${cy})`}
              />
              <circle cx={cx} cy={cy} r={size * 0.42} fill={INK} />
            </g>
          );
        })
      )}
    </g>
  );
}

/* ---------------- flame: something started from nothing ----------------- */
function Flame({ p, s }: Sub) {
  const rays = Array.from({ length: 22 }, (_, i) => i);
  return (
    <g>
      <rect width="800" height="520" fill={`url(#${p("dot-f")})`} opacity="0.35" />
      <g stroke={INK} strokeWidth="2" opacity="0.5">
        {rays.map((i) => {
          const a = (i / rays.length) * Math.PI * 2;
          const inner = 92 + noise(s, i, 8) * 16;
          const outer = 210 + noise(s, i, 9) * 130;
          return (
            <line
              key={i}
              x1={q(400 + Math.cos(a) * inner)}
              y1={q(262 + Math.sin(a) * inner)}
              x2={q(400 + Math.cos(a) * outer)}
              y2={q(262 + Math.sin(a) * outer)}
            />
          );
        })}
      </g>
      <g transform="translate(400 272)">
        <path
          d="M0 -122 C 46 -62, 84 -34, 84 24 C 84 82, 40 118, 0 118 C -40 118, -84 82, -84 24 C -84 -34, -46 -62, 0 -122 Z"
          fill={`url(#${p("dot-c")})`}
        />
        <path
          d="M0 -122 C 46 -62, 84 -34, 84 24 C 84 82, 40 118, 0 118 C -40 118, -84 82, -84 24 C -84 -34, -46 -62, 0 -122 Z"
          fill="none"
          stroke={INK}
          strokeWidth="3.5"
        />
        <path
          d="M0 -46 C 24 -12, 40 4, 40 34 C 40 66, 20 84, 0 84 C -20 84, -40 66, -40 34 C -40 4, -24 -12, 0 -46 Z"
          fill={PLATE}
          stroke={INK}
          strokeWidth="2.5"
        />
      </g>
    </g>
  );
}
