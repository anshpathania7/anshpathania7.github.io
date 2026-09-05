"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { STORIES, plateFor, type Story } from "@/data/paper";
import Plate from "./Plate";
import { TurnLink } from "./PageTurn";
import Magnetic from "./Magnetic";

/**
 * The career archive, laid out as a run of the press.
 *
 * On a wide screen the section pins and the whole run tracks sideways as you
 * scroll — a reel of plates going past. On narrow screens that gesture is
 * hostile, so it degrades to an ordinary vertical stack.
 */
export default function CareerArchive() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setHorizontal(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    if (!horizontal || !section.current || !track.current) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const el = track.current!;
        // The track lives inside the sheet, which is narrower than the window.
        const frame = () => el.parentElement?.clientWidth ?? window.innerWidth;
        const distance = () => Math.max(0, el.scrollWidth - frame() + 96);

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        // Plates lift slightly as they cross the centre of the frame.
        gsap.utils.toArray<HTMLElement>("[data-plate]").forEach((plate) => {
          gsap.fromTo(
            plate,
            { y: 34, rotate: -0.6 },
            {
              y: -34,
              rotate: 0.6,
              ease: "none",
              scrollTrigger: {
                trigger: plate,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      }, section);

      ScrollTrigger.refresh();
      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [horizontal]);

  return (
    <section
      ref={section}
      id="experience"
      className="relative scroll-mt-16 border-t-2 border-ink bg-paper-tint"
    >
      {/* section flag */}
      <div className="px-5 pt-8 pb-6 sm:px-9 lg:px-12">
        <div className="section-rule">
          <span className="kicker whitespace-nowrap">The Record · Eight Postings</span>
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="headline max-w-[18ch]" style={{ fontSize: "var(--text-banner)" }}>
            Five years, set in <em className="italic">column inches</em>
          </h2>
          <p className="max-w-[38ch] text-[0.82rem] text-ink-faint">
            {horizontal
              ? "Keep scrolling — the archive runs sideways."
              : "Every post held, most recent first."}
          </p>
        </div>
      </div>

      {/* pt-5 on the frame leaves room for the folio badges: they sit above
          each plate and ride up further still as the parallax lifts them */}
      {horizontal ? (
        <div className="overflow-hidden pt-5 pb-14">
          <div ref={track} data-print-flow className="flex w-max gap-6 px-5 sm:px-9 lg:px-12">
            {STORIES.map((s, i) => (
              <ArchiveCard key={s.slug} story={s} index={i} horizontal />
            ))}
            <EndPlate />
          </div>
          {/* progress rail */}
          <div className="mx-5 mt-8 h-[3px] bg-ink/12 sm:mx-9 lg:mx-12">
            <div
              ref={fill}
              className="h-full origin-left scale-x-0 bg-ink"
              style={{ willChange: "transform" }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-5 pb-14 sm:px-9">
          {STORIES.map((s, i) => (
            <ArchiveCard key={s.slug} story={s} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function ArchiveCard({
  story,
  index,
  horizontal = false,
}: {
  story: Story;
  index: number;
  horizontal?: boolean;
}) {
  return (
    <article
      data-plate
      className={`group relative flex flex-col border border-ink bg-paper ${
        horizontal ? "w-[27rem] shrink-0" : "w-full"
      }`}
    >
      {/* folio number */}
      <div className="absolute -top-3 left-4 z-10 flex h-7 items-center border border-ink bg-paper px-2">
        <span className="kicker">No. {String(STORIES.length - index).padStart(2, "0")}</span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border-b border-ink">
        <Plate
          motif={story.motif}
          seed={story.slug}
          image={plateFor(story.slug)}
          alt={`${story.org} — ${story.role}`}
          className="h-full w-full"
          imageClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 right-3 border border-ink bg-paper px-2 py-1">
          <span className="kicker">{story.years}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="kicker text-ink-faint">{story.kicker}</div>

        <TurnLink href={`/story/${story.slug}/`} className="mt-2 block">
          <h3 className="headline text-[1.32rem] leading-[1.15]">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-[0%_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
              {story.headline}{" "}
              {story.headlineItalic && <em className="italic">{story.headlineItalic}</em>}
              {story.headlineTail && ` ${story.headlineTail}`}
            </span>
          </h3>
        </TurnLink>

        <div className="mt-3 flex items-baseline gap-2 border-y border-rule py-2">
          <span className="font-[family-name:var(--font-playfair)] text-[0.95rem] font-semibold">
            {story.org}
          </span>
          <span className="text-[0.72rem] text-ink-faint">{story.period}</span>
        </div>

        <p className="mt-3 line-clamp-3 text-[0.83rem] leading-[1.6] text-ink-soft">{story.dek}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {story.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="border border-rule px-1.5 py-0.5 text-[0.63rem] tracking-[0.06em] text-ink-faint uppercase"
            >
              {t}
            </span>
          ))}
        </div>

        <TurnLink
          href={`/story/${story.slug}/`}
          className="kicker mt-auto flex items-center gap-2 pt-5 text-ink"
        >
          Read the full column
          <span className="inline-block h-px w-7 bg-ink transition-all duration-300 group-hover:w-12" />
        </TurnLink>
      </div>
    </article>
  );
}

/* Closing plate at the end of the run. */
function EndPlate() {
  return (
    <div
      data-plate
      className="flex w-[22rem] shrink-0 flex-col items-center justify-center border border-dashed border-ink/40 bg-paper/50 p-8 text-center"
    >
      <div className="font-[family-name:var(--font-playfair)] text-5xl font-bold">—30—</div>
      <p className="mt-3 max-w-[24ch] text-[0.8rem] leading-relaxed text-ink-faint">
        The printer&apos;s mark for the end of a story. The next one is still being set.
      </p>
      <Magnetic strength={0.25}>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="kicker mt-5 border-2 border-ink px-4 py-2.5 transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Commission the next
        </a>
      </Magnetic>
    </div>
  );
}
