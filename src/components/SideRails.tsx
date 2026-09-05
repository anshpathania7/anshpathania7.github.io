"use client";

import { motion } from "motion/react";
import { EDUCATION, OPEN_SOURCE, PERSON } from "@/data/paper";
import PressArt from "./PressArt";
import Magnetic from "./Magnetic";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { scrollToSection } from "./NavBar";
import WeatherBox from "./WeatherBox";

/* ================================ LEFT ================================= */

export function LeftRail() {
  return (
    <div className="flex flex-col gap-6">
      {/* --- the objective, set as the standing column --- */}
      <Reveal>
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="headline text-[1.42rem] leading-tight">The Objective</h3>
            <p className="mt-2.5 text-[0.83rem] leading-[1.66] text-ink-soft">
              Motivated and innovative <strong className="font-semibold text-ink">Flutter</strong>{" "}
              developer with hands-on experience in Android development. Aiming to apply technical
              knowledge and collaborative skills to build{" "}
              <em className="font-[family-name:var(--font-playfair)] italic">
                high-performance mobile applications
              </em>{" "}
              and contribute to a productive team.
            </p>
            <button
              onClick={() => scrollToSection("experience")}
              className="kicker group mt-3.5 flex items-center gap-2 text-ink"
            >
              Read the record
              <span className="inline-block h-px w-7 bg-ink transition-all duration-300 group-hover:w-11" />
            </button>
          </div>
          <div className="w-[104px] shrink-0 self-start border border-rule">
            <PressArt motif="orbit" seed="objective" className="aspect-[3/4] w-full" />
          </div>
        </div>
      </Reveal>

      {/* --- the forecast --- */}
      <Reveal>
        <WeatherBox />
      </Reveal>

      <hr className="border-rule" />

      {/* --- open source --- */}
      <div id="open-source" className="scroll-mt-24">
        <Reveal>
          <div className="section-rule mb-4">
            <span className="kicker whitespace-nowrap">Open Source</span>
          </div>
        </Reveal>

        <RevealGroup className="flex flex-col gap-5">
          {OPEN_SOURCE.map((o, i) => (
            <RevealItem key={o.project}>
              <div className="flex gap-3.5">
                {i === 0 && (
                  <div className="w-[96px] shrink-0 border border-rule">
                    <PressArt motif="stack" seed={o.project} className="aspect-square w-full" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="headline text-[1.1rem] leading-snug">
                    {o.project}
                  </h4>
                  <div className="mt-0.5 text-[0.7rem] tracking-[0.05em] text-ink-faint uppercase">
                    {o.role}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {o.fixes.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2 text-[0.79rem] leading-[1.5] text-ink-soft"
                      >
                        <span className="mt-[0.42em] h-[3px] w-[3px] shrink-0 rounded-full bg-stamp" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {o.url && (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ink-link mt-2 inline-block text-[0.72rem] text-ink-faint"
                    >
                      github.com/{PERSON.githubHandle}
                    </a>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* --- the résumé advertisement --- */}
      <Reveal>
        <a
          href="/anshuman-pathania-cv.pdf"
          download
          className="panel-invert group relative block overflow-hidden border-2 border-ink bg-ink px-5 py-4 text-paper"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-stamp"
            initial={{ y: "101%" }}
            whileHover={{ y: "0%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="relative flex items-center justify-between gap-3">
            <span>
              <span className="block font-[family-name:var(--font-playfair)] text-[1.35rem] leading-none font-bold italic">
                The Full Record
              </span>
              <span className="kicker mt-1.5 block text-paper/70">
                Download the curriculum vitae
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v13m0 0 5-5m-5 5-5-5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </Reveal>
    </div>
  );
}

/* =============================== RIGHT ================================= */

export function RightRail() {
  return (
    <div className="flex flex-col gap-6">
      {/* --- the standing notice --- */}
      <Reveal>
        <div className="relative overflow-hidden border border-ink bg-notice px-5 py-4">
          <div className="relative z-10 max-w-[70%]">
            <div className="font-[family-name:var(--font-playfair)] text-[1.32rem] leading-tight font-bold">
              Open to Work
            </div>
            <p className="mt-1 text-[0.78rem] leading-snug text-ink-soft">
              Senior Flutter, Dart & Android roles. Navi Mumbai or remote.
            </p>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection("contact")}
                className="kicker mt-3 border-2 border-ink bg-paper px-3.5 py-2 transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                Get in touch
              </button>
            </Magnetic>
          </div>
          <div className="pointer-events-none absolute -right-3 -bottom-2 w-[110px] opacity-90">
            <NewsboyMark />
          </div>
        </div>
      </Reveal>

      {/* --- education, set as the small-story list --- */}
      <div id="education" className="scroll-mt-24">
        <Reveal>
          <div className="section-rule mb-4">
            <span className="kicker whitespace-nowrap">Education</span>
          </div>
        </Reveal>

        <RevealGroup className="flex flex-col">
          {EDUCATION.map((e, i) => (
            <RevealItem key={e.institution}>
              <div
                className={`flex gap-3.5 py-3.5 ${i > 0 ? "border-t border-rule" : ""}`}
              >
                <div className="w-[80px] shrink-0 border border-rule">
                  <PressArt
                    motif={i === 0 ? "grid" : i === 1 ? "ledger" : "signal"}
                    seed={e.institution}
                    className="aspect-[4/3] w-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-[family-name:var(--font-playfair)] text-[0.94rem] leading-snug font-semibold">
                      {e.qualification}
                    </h4>
                    <span className="kicker shrink-0 text-ink-faint">{e.year}</span>
                  </div>
                  <p className="mt-1 text-[0.76rem] leading-snug text-ink-soft">
                    {e.institution}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="score-chip text-[0.8rem] leading-none">{e.result}</span>
                    <span className="text-[0.68rem] tracking-wide text-ink-faint uppercase">
                      {e.board}
                    </span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* --- the subscription box, re-cast as contact --- */}
      <Reveal>
        <div id="contact" className="scroll-mt-24 border-t-2 border-ink pt-4">
          <h3 className="headline text-[1.28rem]">Send a dispatch</h3>
          <p className="mt-1 text-[0.78rem] text-ink-faint">
            The desk is open for roles, contracts and collaborations.
          </p>
          <ContactBlock />
        </div>
      </Reveal>
    </div>
  );
}

function ContactBlock() {
  return (
    <div className="mt-4 flex flex-col gap-2.5">
      <a
        href={`mailto:${PERSON.email}`}
        className="group flex items-center justify-between border-b border-rule pb-2.5"
      >
        <span className="text-[0.86rem] text-ink-soft transition-colors group-hover:text-ink">
          {PERSON.email}
        </span>
        <Arrow />
      </a>
      <a
        href={`tel:${PERSON.phone}`}
        className="group flex items-center justify-between border-b border-rule pb-2.5"
      >
        <span className="text-[0.86rem] text-ink-soft transition-colors group-hover:text-ink">
          {PERSON.phone}
        </span>
        <Arrow />
      </a>
      <a
        href={PERSON.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-b border-rule pb-2.5"
      >
        <span className="text-[0.86rem] text-ink-soft transition-colors group-hover:text-ink">
          github.com/{PERSON.githubHandle}
        </span>
        <Arrow />
      </a>
      <a
        href={PERSON.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-b border-rule pb-2.5"
      >
        <span className="text-[0.86rem] text-ink-soft transition-colors group-hover:text-ink">
          linkedin.com/in/{PERSON.linkedinHandle}
        </span>
        <Arrow />
      </a>

      <Magnetic strength={0.2}>
        <a
          href={`mailto:${PERSON.email}?subject=${encodeURIComponent("A role for you")}`}
          className="kicker mt-2 block w-full border-2 border-ink bg-ink px-4 py-3.5 text-center text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
        >
          Write to the editor
        </a>
      </Magnetic>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* The newsboy from the corner of the notice box. */
function NewsboyMark() {
  return (
    <svg viewBox="0 0 120 120" className="w-full" aria-hidden>
      <g stroke="var(--art-ink)" strokeWidth="2.4" fill="none" strokeLinejoin="round">
        {/* cap */}
        <path d="M34 34 C34 20, 50 14, 62 18 C74 22, 78 30, 76 38 Z" fill="var(--art-ink)" />
        <path d="M28 38 L82 38" strokeWidth="3" />
        {/* head */}
        <circle cx="56" cy="52" r="13" fill="var(--color-paper)" />
        {/* body */}
        <path d="M40 76 C40 66, 48 62, 56 62 C64 62, 72 66, 72 76 L72 108 L40 108 Z" fill="var(--art-ink)" />
        {/* the paper he is selling */}
        <g transform="rotate(-12 88 78)">
          <rect x="74" y="60" width="38" height="46" fill="var(--color-paper)" stroke="var(--art-ink)" strokeWidth="2.4" />
          <g stroke="var(--art-ink)" strokeWidth="2">
            <line x1="80" y1="70" x2="106" y2="70" />
            <line x1="80" y1="78" x2="106" y2="78" />
            <line x1="80" y1="86" x2="100" y2="86" />
            <line x1="80" y1="94" x2="104" y2="94" />
          </g>
        </g>
      </g>
    </svg>
  );
}
