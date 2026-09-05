"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PERSON, STORIES, PROJECTS } from "@/data/paper";
import { TurnLink } from "./PageTurn";
import Magnetic from "./Magnetic";
import EditionToggle from "./EditionToggle";
import type Lenis from "lenis";

const SECTIONS = [
  { label: "Latest", id: "latest" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Open Source", id: "open-source" },
  { label: "Education", id: "education" },
  { label: "Skills", id: "skills" },
  { label: "Classifieds", id: "classifieds" },
  { label: "Contact", id: "contact" },
];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function NavBar() {
  const [stuck, setStuck] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [active, setActive] = useState("latest");

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 340);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section is under the fold line?
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.3, 0.6] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && /input|textarea/i.test((e.target as HTMLElement)?.tagName ?? "")) return;
        e.preventDefault();
        setIndexOpen((v) => !v);
      }
      if (e.key === "Escape") setIndexOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback((id: string) => {
    setIndexOpen(false);
    scrollToSection(id);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b border-ink bg-paper/95 backdrop-blur-sm transition-shadow duration-500 ${
          stuck ? "shadow-[0_10px_24px_-18px_rgba(18,16,14,0.55)]" : ""
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-2.5 sm:px-9 lg:px-12">
          {/* condensed flag, appears once the masthead is out of view */}
          <AnimatePresence>
            {stuck && (
              <motion.button
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => go("latest")}
                className="overflow-hidden font-[family-name:var(--font-playfair)] text-sm font-bold whitespace-nowrap"
              >
                <span className="pr-4">{PERSON.initials}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="scrollbar-none -mx-1 flex flex-1 items-center gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <Magnetic key={s.id} strength={0.22}>
                <button
                  onClick={() => go(s.id)}
                  className={`nav-item relative rounded-none px-3 py-1.5 whitespace-nowrap transition-colors duration-300 ${
                    active === s.id ? "text-ink" : "text-ink-faint hover:text-ink"
                  }`}
                >
                  {s.label}
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-px h-[2px] bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    />
                  )}
                </button>
              </Magnetic>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Magnetic strength={0.3}>
              <button
                onClick={() => setIndexOpen(true)}
                aria-label="Open the index"
                className="flex items-center gap-2 px-2 py-1.5 text-ink-soft transition-colors hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M16.5 16.5 21 21" strokeLinecap="round" />
                </svg>
                <span className="kicker hidden lg:inline">Index</span>
              </button>
            </Magnetic>
            <EditionToggle />
          </div>
        </div>
      </nav>

      <IndexOverlay open={indexOpen} onClose={() => setIndexOpen(false)} onGo={go} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function IndexOverlay({
  open,
  onClose,
  onGo,
}: {
  open: boolean;
  onClose: () => void;
  onGo: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const stories = STORIES.filter(
    (s) =>
      !needle ||
      s.org.toLowerCase().includes(needle) ||
      s.role.toLowerCase().includes(needle) ||
      s.headline.toLowerCase().includes(needle) ||
      s.tags.some((t) => t.toLowerCase().includes(needle))
  );
  const projects = PROJECTS.filter(
    (p) => !needle || p.title.toLowerCase().includes(needle) || p.dek.toLowerCase().includes(needle)
  );
  const sections = SECTIONS.filter((s) => !needle || s.label.toLowerCase().includes(needle));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            initial={{ y: -22, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -14, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="sheet relative w-full max-w-2xl border-2 border-ink"
          >
            <div className="flex items-center gap-3 border-b border-ink px-5 py-3.5">
              <span className="kicker text-ink-faint">Index</span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the paper…"
                className="flex-1 bg-transparent font-[family-name:var(--font-playfair)] text-lg outline-none placeholder:text-ink-faint/60"
              />
              <kbd className="kicker border border-rule px-1.5 py-1 text-ink-faint">Esc</kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto px-5 py-4">
              {sections.length > 0 && (
                <IndexGroup label="Sections">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onGo(s.id)}
                      className="ink-link block w-full py-1.5 text-left font-[family-name:var(--font-playfair)] text-[1.05rem]"
                    >
                      {s.label}
                    </button>
                  ))}
                </IndexGroup>
              )}

              {stories.length > 0 && (
                <IndexGroup label="Stories">
                  {stories.map((s) => (
                    <TurnLink
                      key={s.slug}
                      href={`/story/${s.slug}/`}
                      onClick={onClose}
                      className="block py-1.5"
                    >
                      <span className="ink-link font-[family-name:var(--font-playfair)] text-[1.05rem]">
                        {s.org}
                      </span>
                      <span className="ml-2 text-[0.78rem] text-ink-faint">{s.role}</span>
                    </TurnLink>
                  ))}
                </IndexGroup>
              )}

              {projects.length > 0 && (
                <IndexGroup label="Projects">
                  {projects.map((p) => (
                    <TurnLink
                      key={p.slug}
                      href={`/project/${p.slug}/`}
                      onClick={onClose}
                      className="ink-link block py-1.5 font-[family-name:var(--font-playfair)] text-[1.05rem]"
                    >
                      {p.title}
                    </TurnLink>
                  ))}
                </IndexGroup>
              )}

              {!sections.length && !stories.length && !projects.length && (
                <p className="py-8 text-center text-sm text-ink-faint italic">
                  No entry under that heading.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IndexGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="kicker mb-2 border-b border-rule pb-1.5 text-ink-faint">{label}</div>
      {children}
    </div>
  );
}
