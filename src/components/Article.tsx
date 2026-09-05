"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { MASTHEAD, PERSON, type Motif } from "@/data/paper";
import Plate from "./Plate";
import Magnetic from "./Magnetic";
import { TurnLink } from "./PageTurn";
import PageCorner from "./PageCorner";
import EditionToggle from "./EditionToggle";
import { LineReveal, Reveal, RevealGroup, RevealItem } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export type ArticleProps = {
  kicker: string;
  headline: string;
  headlineItalic?: string;
  headlineTail?: string;
  dek: string;
  motif: Motif;
  seed: string;
  image?: string;
  dateline?: string;
  meta?: { label: string; value: string }[];
  body: string[];
  pullQuote?: string;
  recordTitle?: string;
  record?: string[];
  tags?: string[];
  next?: { href: string; label: string; title: string };
};

export default function Article(props: ArticleProps) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 240, damping: 40, mass: 0.4 });

  return (
    <main className="px-0 py-0 lg:px-8 lg:py-8">
      {/* reading progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-stamp"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <article className="sheet mx-auto w-full max-w-[1180px] overflow-hidden">
        {/* ------------------------ folio bar ------------------------ */}
        <div className="flex items-center justify-between gap-4 border-b border-ink px-5 py-3 sm:px-9 lg:px-12">
          <TurnLink href="/" className="group flex items-center gap-2.5">
            <Magnetic strength={0.3}>
              <span className="flex h-8 w-8 items-center justify-center border border-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Magnetic>
            <span className="kicker">The Front Page</span>
          </TurnLink>

          <span className="font-[family-name:var(--font-playfair)] text-[0.92rem] font-semibold tracking-[0.16em] uppercase">
            {MASTHEAD.title}
          </span>

          {/* Readers often arrive straight here from a shared link, so the
              edition switch has to exist off the front page too. */}
          <div className="flex items-center gap-3">
            <span className="kicker hidden text-ink-faint lg:inline">{props.kicker}</span>
            <EditionToggle />
          </div>
        </div>

        {/* -------------------------- header ------------------------- */}
        <header className="px-5 pt-10 pb-8 sm:px-9 lg:px-12">
          <div className="mx-auto max-w-[52rem] text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="kicker text-stamp"
            >
              {props.kicker}
            </motion.div>

            <h1
              className="headline mt-4 text-[clamp(2rem,5vw,3.9rem)]"
              style={{ textWrap: "balance" }}
            >
              <LineReveal>
                <span>
                  {props.headline}{" "}
                  {props.headlineItalic && <em className="italic">{props.headlineItalic}</em>}
                  {props.headlineTail && ` ${props.headlineTail}`}
                </span>
              </LineReveal>
            </h1>

            <Reveal delay={0.25}>
              <p className="mx-auto mt-5 max-w-[46rem] font-[family-name:var(--font-playfair)] text-[1.12rem] leading-relaxed text-ink-soft italic">
                {props.dek}
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mx-auto mt-7 flex max-w-[42rem] flex-wrap items-center justify-center gap-x-3 gap-y-2 border-y border-rule py-3">
                <span className="kicker">By {PERSON.name}</span>
                {props.dateline && (
                  <>
                    <Dot />
                    <span className="kicker text-ink-faint">{props.dateline}</span>
                  </>
                )}
                {props.meta?.map((m) => (
                  <span key={m.label} className="flex items-center gap-3">
                    <Dot />
                    <span className="kicker text-ink-faint">{m.value}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </header>

        {/* -------------------------- the plate ---------------------- */}
        <div className="px-5 sm:px-9 lg:px-12">
          <motion.div
            className="overflow-hidden border border-ink"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.15, delay: 0.2, ease: EASE }}
          >
            <Plate
              motif={props.motif}
              seed={props.seed}
              image={props.image}
              alt={props.headline}
              className="aspect-[21/9] w-full"
            />
          </motion.div>
          <p className="mt-2 text-[0.72rem] text-ink-faint italic">
            Engraved for {MASTHEAD.title}. All plates on this site are generated, not photographed.
          </p>
        </div>

        {/* --------------------------- body -------------------------- */}
        <div className="grid gap-9 px-5 py-10 sm:px-9 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-12 lg:px-12">
          <div>
            <Reveal>
              <div className="prose-column columns-1 gap-9 md:columns-2 [&>p:first-child]:mt-0">
                {props.body.map((para, i) => (
                  <p key={i} className={i === 0 ? "dropcap" : ""}>
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            {props.pullQuote && (
              <motion.blockquote
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="my-10 border-y-2 border-ink py-7 text-center"
              >
                <p className="mx-auto max-w-[34ch] font-[family-name:var(--font-playfair)] text-[clamp(1.3rem,2.4vw,1.9rem)] leading-tight font-bold text-balance">
                  &ldquo;{props.pullQuote}&rdquo;
                </p>
                <footer className="kicker mt-4 text-ink-faint">{PERSON.name}</footer>
              </motion.blockquote>
            )}

            {props.tags && props.tags.length > 0 && (
              <Reveal>
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-rule pt-6">
                  <span className="kicker mr-1 text-ink-faint">Filed under</span>
                  {props.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-rule px-2 py-1 text-[0.68rem] tracking-[0.07em] text-ink-soft uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* ------------------------ the sidebar ---------------------- */}
          <aside className="lg:col-rule-l lg:pl-12">
            {props.record && props.record.length > 0 && (
              <div className="border border-ink bg-paper-tint p-5">
                <div className="kicker mb-3.5 border-b border-ink pb-2.5">
                  {props.recordTitle ?? "From the Record"}
                </div>
                <RevealGroup className="space-y-3.5">
                  {props.record.map((r) => (
                    <RevealItem key={r}>
                      <div className="flex gap-2.5">
                        <span className="mt-[0.5em] h-1 w-1 shrink-0 bg-stamp" />
                        <p className="text-[0.82rem] leading-[1.6] text-ink-soft">{r}</p>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}

            <div className="mt-6 border-t-2 border-ink pt-4">
              <div className="font-[family-name:var(--font-playfair)] text-[1.15rem] font-bold">
                Hiring?
              </div>
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-soft">
                The desk is open for senior Flutter, Dart and Android work.
              </p>
              <Magnetic strength={0.2}>
                <a
                  href={`mailto:${PERSON.email}`}
                  className="kicker mt-4 block border-2 border-ink bg-ink px-4 py-3 text-center text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
                >
                  Write to the editor
                </a>
              </Magnetic>
              <a
                href="/anshuman-pathania-cv.pdf"
                download
                className="kicker mt-2 block border border-rule px-4 py-3 text-center text-ink-soft transition-colors duration-300 hover:border-ink hover:text-ink"
              >
                Download the CV
              </a>
            </div>
          </aside>
        </div>

        {/* ------------------------- continued ----------------------- */}
        {props.next && (
          <TurnLink
            href={props.next.href}
            className="panel-invert group block border-t-2 border-ink bg-ink px-5 py-9 text-paper sm:px-9 lg:px-12"
          >
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="kicker text-paper/50">{props.next.label}</div>
                <div className="mt-2.5 font-[family-name:var(--font-playfair)] text-[clamp(1.3rem,2.6vw,2.1rem)] leading-tight font-bold">
                  {props.next.title}
                </div>
              </div>
              <span className="flex items-center gap-3">
                <span className="kicker text-paper/60">Turn the page</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-paper/60 transition-all duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </div>
          </TurnLink>
        )}
      </article>

      {/* the corner you can actually take hold of */}
      {props.next && <PageCorner href={props.next.href} label={props.next.title} />}
    </main>
  );
}

function Dot() {
  return <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ink-faint" />;
}
