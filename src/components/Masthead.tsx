"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { MASTHEAD, PERSON } from "@/data/paper";
import Magnetic from "./Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Trig differs by an ulp between Node and JavaScriptCore; round so SSR matches. */
const q = (n: number) => Math.round(n * 100) / 100;

/**
 * The edition date is passed in from the server component rather than read
 * from `new Date()` here. A client-side clock disagrees with the prerendered
 * HTML and React reports a hydration mismatch — and semantically, the date on
 * a masthead is the date the edition was printed, which is the build.
 */
export default function Masthead({ edition }: { edition: string }) {
  const name = PERSON.name.toUpperCase();

  // The seal turns like a press wheel as the sheet is fed through.
  const { scrollY } = useScroll();
  const sealRotate = useSpring(useTransform(scrollY, [0, 900], [0, 180]), {
    stiffness: 60,
    damping: 18,
  });

  return (
    <header className="px-5 pt-8 pb-4 sm:px-9 lg:px-12">
      {/* The centre column is `auto` so the flag sets its own width; the side
          columns need a floor or the lockups get squeezed into ragged wraps. */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(11.5rem,1fr)_auto_minmax(11.5rem,1fr)]">
        {/* ---- left: the seal ---- */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="flex items-center gap-3.5"
        >
          {/* Only the toothed ring turns — the monogram stays upright. */}
          <div className="relative h-14 w-14 shrink-0">
            <motion.div style={{ rotate: sealRotate }} className="absolute inset-0">
              <SealRing />
            </motion.div>
            <SealFace />
          </div>
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-playfair)] text-[0.98rem] font-bold tracking-tight">
              {MASTHEAD.title}
            </div>
            <div className="kicker mt-1 text-ink-soft">
              {PERSON.disciplines.join(" · ")}
            </div>
            <div className="mt-1 text-[0.62rem] tracking-[0.09em] text-ink-faint uppercase">
              {PERSON.city} — Remote — India
            </div>
            {/* the wire desk: where to reach the byline */}
            <div className="mt-1.5 flex items-center gap-2.5">
              <a
                href={PERSON.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link flex items-center gap-1 text-[0.66rem] font-medium tracking-[0.08em] text-ink-soft uppercase hover:text-ink"
              >
                <GitHubMark />
                GitHub
              </a>
              <span aria-hidden className="h-2.5 w-px bg-rule-mid" />
              <a
                href={PERSON.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link flex items-center gap-1 text-[0.66rem] font-medium tracking-[0.08em] text-ink-soft uppercase hover:text-ink"
              >
                <LinkedInMark />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

        {/* ---- centre: the flag ---- */}
        <div className="text-center">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="mx-auto mb-3 h-px w-full max-w-[30rem] bg-ink"
          />

          <h1
            className="font-[family-name:var(--font-playfair)] leading-[0.92] font-medium tracking-[0.055em] text-ink"
            style={{ fontSize: "var(--text-masthead)" }}
            aria-label={PERSON.name}
          >
            {name.split(" ").map((word, wi) => (
              <span key={wi} className="mr-[0.18em] inline-block whitespace-nowrap last:mr-0">
                {word.split("").map((ch, ci) => (
                  <motion.span
                    key={ci}
                    aria-hidden
                    className="inline-block"
                    initial={{ y: "70%", opacity: 0, rotateX: -70 }}
                    animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.28 + (wi * 9 + ci) * 0.035,
                      ease: EASE,
                    }}
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mx-auto mt-3.5 flex max-w-[34rem] items-center gap-3"
          >
            <span className="h-px flex-1 bg-ink/45" />
            <span className="kicker whitespace-nowrap text-ink-soft">
              {MASTHEAD.volume} · {MASTHEAD.issue} · {edition}
            </span>
            <span className="h-px flex-1 bg-ink/45" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mt-2 font-[family-name:var(--font-playfair)] text-[0.9rem] tracking-wide text-ink-faint italic"
          >
            {MASTHEAD.strapline}
          </motion.p>
        </div>

        {/* ---- right: the standing notice ---- */}
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="flex items-center justify-start gap-4 md:justify-end"
        >
          <div className="text-right leading-tight">
            <div className="font-[family-name:var(--font-playfair)] text-[0.95rem] font-semibold">
              The desk is open
            </div>
            <div className="mt-1 font-[family-name:var(--font-playfair)] text-2xl font-bold">
              <span className="score-chip">Available</span>
            </div>
            <a
              href={`tel:${PERSON.phone}`}
              className="ink-link mt-1.5 block text-[0.72rem] tracking-[0.06em] text-ink-soft"
            >
              {PERSON.phone}
            </a>
          </div>
          <Magnetic strength={0.25}>
            <Telephone />
          </Magnetic>
        </motion.div>
      </div>

      <div className="rule-double mt-6" />
    </header>
  );
}

/* Wire-desk marks, drawn in the house line weight rather than brand colours. */
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
      <path d="M13.63 13.63h-2.37V9.92c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.96v3.78H6.22V6h2.28v1.04h.03a2.5 2.5 0 0 1 2.25-1.24c2.4 0 2.85 1.58 2.85 3.64v4.19ZM3.55 4.95a1.38 1.38 0 1 1 0-2.75 1.38 1.38 0 0 1 0 2.75Zm1.19 8.68H2.36V6h2.38v7.63ZM14.82 0H1.18C.53 0 0 .52 0 1.16v13.68C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.16V1.16C16 .52 15.47 0 14.82 0Z" />
    </svg>
  );
}

/* The engraved seal's toothed ring — this part spins with the scroll. */
function SealRing() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <circle cx="50" cy="50" r="47" fill="none" stroke="var(--art-ink)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="var(--art-ink)" strokeWidth="1" />
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={q(50 + Math.cos(a) * 41)}
            y1={q(50 + Math.sin(a) * 41)}
            x2={q(50 + Math.cos(a) * 46)}
            y2={q(50 + Math.sin(a) * 46)}
            stroke="var(--art-ink)"
            strokeWidth="1.4"
          />
        );
      })}
    </svg>
  );
}

/* The monogram disc, fixed upright over the ring. */
function SealFace() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="50" cy="50" r="33" fill="var(--art-ink)" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-paper)"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="1"
      >
        AP
      </text>
    </svg>
  );
}

/* The candlestick telephone from the source design. */
function Telephone() {
  return (
    <svg viewBox="0 0 120 100" className="hidden h-16 w-20 sm:block" aria-hidden>
      <g stroke="var(--art-ink)" strokeWidth="2.6" fill="none" strokeLinecap="round">
        <rect x="18" y="58" width="74" height="30" rx="4" fill="var(--art-ink)" />
        <path d="M30 58 L30 40 C30 22, 44 12, 62 12 C80 12, 94 22, 94 40" />
        <ellipse cx="55" cy="46" rx="20" ry="13" fill="var(--color-paper)" />
        <circle cx="55" cy="46" r="5" fill="var(--art-ink)" />
        <path d="M94 40 L94 58" />
        <path d="M100 44 C112 44, 116 56, 108 66" strokeDasharray="3 5" />
      </g>
      <g fill="var(--color-paper)">
        <circle cx="34" cy="73" r="3" />
        <circle cx="46" cy="73" r="3" />
      </g>
    </svg>
  );
}
