"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { CLASSIFIEDS, MASTHEAD, PERSON, PROJECTS, SKILL_SCORES, plateFor } from "@/data/paper";
import Plate from "./Plate";
import Magnetic from "./Magnetic";
import { Reveal, RevealGroup, RevealItem, LineReveal } from "./Reveal";
import { TurnLink } from "./PageTurn";

const EASE = [0.22, 1, 0.36, 1] as const;

function SectionFlag({ label, note }: { label: string; note?: string }) {
  return (
    <Reveal>
      <div className="section-rule mb-6">
        <span className="kicker whitespace-nowrap">{label}</span>
      </div>
      {note && <p className="-mt-3 mb-6 text-[0.8rem] text-ink-faint italic">{note}</p>}
    </Reveal>
  );
}

/* ============================== PROJECTS =============================== */

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-16 px-5 py-12 sm:px-9 lg:px-12">
      <SectionFlag label="Projects" />

      {PROJECTS.map((p) => (
        <article key={p.slug} className="group grid gap-7 lg:grid-cols-[1.05fr_1fr]">
          <TurnLink href={`/project/${p.slug}/`} className="block">
            <motion.div
              className="relative overflow-hidden border border-ink"
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Plate
                motif={p.motif}
                seed={p.slug}
                image={plateFor(p.slug)}
                alt={p.title}
                className="aspect-[16/10] w-full"
                imageClassName="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
              />
            </motion.div>
          </TurnLink>

          <div className="flex flex-col justify-center">
            <div className="kicker text-ink-faint">{p.kicker}</div>
            <h3 className="headline mt-2.5" style={{ fontSize: "var(--text-banner)" }}>
              <LineReveal>{p.title}</LineReveal>
            </h3>
            <p className="dek mt-4 max-w-[48ch]">{p.dek}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="border border-rule px-2 py-1 text-[0.66rem] tracking-[0.07em] text-ink-soft uppercase"
                >
                  {s}
                </span>
              ))}
            </div>

            <TurnLink
              href={`/project/${p.slug}/`}
              className="kicker mt-7 flex items-center gap-2.5 text-ink"
            >
              Read the write-up
              <span className="inline-block h-px w-8 bg-ink transition-all duration-300 group-hover:w-14" />
            </TurnLink>
          </div>
        </article>
      ))}
    </section>
  );
}

/* =============================== SKILLS ================================ */

export function SkillsBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="skills"
      className="scroll-mt-16 border-y border-ink bg-paper-tint px-5 py-12 sm:px-9 lg:px-12"
    >
      <SectionFlag
        label="The Standings"
        note="Self-assessed, honestly. The market may differ."
      />

      <div ref={ref} className="grid gap-x-10 gap-y-1 md:grid-cols-2">
        {SKILL_SCORES.map((s, i) => {
          const pct = (parseFloat(s.score) / 10) * 100;
          return (
            <div
              key={s.name}
              className="flex items-center gap-4 border-b border-rule py-3"
            >
              <span className="w-6 shrink-0 text-[0.7rem] text-ink-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="w-[9.5rem] shrink-0 font-[family-name:var(--font-playfair)] text-[1.02rem] font-semibold">
                {s.name}
              </span>
              <span className="relative h-[9px] flex-1 overflow-hidden bg-ink/10">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-ink"
                  initial={{ scaleX: 0 }}
                  animate={seen ? { scaleX: pct / 100 } : {}}
                  transition={{ duration: 1.15, delay: 0.06 * i, ease: EASE }}
                  style={{ transformOrigin: "left", width: "100%" }}
                />
              </span>
              <span className="score-chip shrink-0 text-[0.95rem] leading-none">{s.score}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================= CLASSIFIEDS ============================= */

export function Classifieds() {
  return (
    <section id="classifieds" className="scroll-mt-16 px-5 py-12 sm:px-9 lg:px-12">
      <SectionFlag
        label="Classified Advertisements"
        note="Positions held outside the code, in smaller type."
      />

      <RevealGroup className="grid gap-x-8 gap-y-6 md:grid-cols-3">
        {CLASSIFIEDS.map((c, i) => (
          <RevealItem key={c.head}>
            <div className={`h-full ${i > 0 ? "md:col-rule-l md:pl-8" : ""}`}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-stamp" />
                <span className="kicker text-ink-faint">Wanted</span>
              </div>
              <h4 className="font-[family-name:var(--font-playfair)] text-[1.02rem] leading-snug font-bold uppercase">
                {c.head}
              </h4>
              <p className="mt-2 text-[0.81rem] leading-[1.62] text-ink-soft">{c.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ============================== COLOPHON =============================== */

export function Colophon({ year }: { year: number }) {
  return (
    <footer className="panel-invert border-t-2 border-ink bg-ink px-5 py-12 text-paper sm:px-9 lg:px-12">
      <div className="grid gap-9 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight">
            {MASTHEAD.title}
          </div>
          <p className="mt-3 max-w-[36ch] text-[0.84rem] leading-relaxed text-paper/65">
            An entire curriculum vitae, set as a broadsheet. Written, engraved and printed in{" "}
            {PERSON.city}.
          </p>
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${PERSON.email}`}
              className="kicker mt-6 inline-block border-2 border-paper px-4 py-2.5 transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              Write to the editor
            </a>
          </Magnetic>
        </div>

        <div>
          <div className="kicker mb-3 text-paper/45">The Desk</div>
          <ul className="space-y-2 text-[0.85rem]">
            <li>
              <a href={`mailto:${PERSON.email}`} className="text-paper/80 hover:text-paper">
                {PERSON.email}
              </a>
            </li>
            <li>
              <a href={`tel:${PERSON.phone}`} className="text-paper/80 hover:text-paper">
                {PERSON.phone}
              </a>
            </li>
            <li>
              <a
                href={PERSON.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/80 hover:text-paper"
              >
                github.com/{PERSON.githubHandle}
              </a>
            </li>
            <li>
              <a
                href={PERSON.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/80 hover:text-paper"
              >
                linkedin.com/in/{PERSON.linkedinHandle}
              </a>
            </li>
            <li className="text-paper/55">
              {PERSON.city}, {PERSON.region}
            </li>
          </ul>
        </div>

        <div>
          <div className="kicker mb-3 text-paper/45">Colophon</div>
          <ul className="space-y-2 text-[0.82rem] text-paper/65">
            <li>Headlines set in Playfair Display</li>
            <li>Rules and folios in Oswald</li>
            <li>Body copy in Inter</li>
            <li>Engravings generated, not photographed</li>
            <li>Built with Next.js, Motion, GSAP &amp; Lenis</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-paper/20 pt-5 text-[0.72rem] tracking-[0.07em] text-paper/45 uppercase sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {PERSON.name}. All rights reserved.
        </span>
        <span>{MASTHEAD.price} · Printed daily in {PERSON.city}</span>
      </div>
    </footer>
  );
}
