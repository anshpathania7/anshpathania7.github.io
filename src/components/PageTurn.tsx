"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import PageLeaf, { type LeafPhase } from "./PageLeaf";

/**
 * Route transitions, choreographed as turning a page.
 *
 * Navigation is intercepted so the turn can play on both sides of it:
 *
 *   1. `closing` — a leaf swings in from the right and lands flat, covering
 *   2. the route is swapped underneath it, out of sight
 *   3. `opening` — the leaf sweeps away to the left, revealing the new page
 *
 * The bending itself lives in <PageLeaf/>; this component only owns the state
 * machine and the safety net for a navigation that never commits.
 */

type DragTurn = {
  /** Begin a pointer-driven turn toward `href`. False = reduced motion, caller
      should navigate plainly instead. */
  start: (href: string) => boolean;
  /** Scrub the leaf to t in [0,1] while the pointer is down. */
  move: (t: number) => void;
  /** Release. Past the threshold (or a plain click) the turn completes and
      navigates; anything else springs back. */
  end: (t: number) => void;
};

type Ctx = { turnTo: (href: string) => void; turning: boolean; dragTurn: DragTurn };
const PageTurnCtx = createContext<Ctx>({
  turnTo: () => {},
  turning: false,
  dragTurn: { start: () => false, move: () => {}, end: () => {} },
});
export const usePageTurn = () => useContext(PageTurnCtx);

const DRAG_COMMIT = 0.38; // release past this and the page turns
const DRAG_CLICK = 0.05; // release under this counts as a click — turn anyway

export function PageTurnProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<LeafPhase | null>(null);
  // The drag-corner turn: t of the scrubbed leaf, or null when not dragging.
  const [drag, setDrag] = useState<number | null>(null);
  const [mirrored, setMirrored] = useState(false);
  const pending = useRef<string | null>(null);
  const dragHref = useRef<string | null>(null);
  const dragRaf = useRef(0);
  const reduced = useRef(false);
  const lastPath = useRef(pathname);
  const bail = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debug: /?leaf=0.5 holds the leaf still so the curl can be tuned by eye.
  const [frozenAt, setFrozenAt] = useState<number | undefined>(undefined);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("leaf");
    if (v !== null && !Number.isNaN(parseFloat(v))) setFrozenAt(parseFloat(v));
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const turnTo = useCallback(
    (href: string) => {
      if (href === pathname) return;
      if (reduced.current) {
        router.push(href);
        return;
      }
      pending.current = href;
      setMirrored(false);
      setPhase("closing");
    },
    [pathname, router]
  );

  /* ---------------- the drag-corner turn ---------------- */

  const animateDrag = useCallback((from: number, to: number, ms: number, then?: () => void) => {
    cancelAnimationFrame(dragRaf.current);
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setDrag(from + (to - from) * e);
      if (p < 1) dragRaf.current = requestAnimationFrame(step);
      else then?.();
    };
    dragRaf.current = requestAnimationFrame(step);
  }, []);

  const dragStart = useCallback((href: string) => {
    if (reduced.current) return false;
    cancelAnimationFrame(dragRaf.current);
    dragHref.current = href;
    setMirrored(true);
    setDrag(0.001);
    return true;
  }, []);

  const dragMove = useCallback((t: number) => {
    setDrag(Math.min(1, Math.max(0.001, t)));
  }, []);

  const dragEnd = useCallback(
    (t: number) => {
      const href = dragHref.current;
      if (!href) return;
      if (t >= DRAG_COMMIT || t <= DRAG_CLICK) {
        // Commit: carry the leaf flat, swap the route behind it. The pathname
        // effect below then releases it into the opening sweep.
        animateDrag(t, 1, Math.max(140, 400 * (1 - t)), () => {
          pending.current = null;
          dragHref.current = null;
          router.push(href);
          bail.current = setTimeout(() => {
            setDrag(null);
            setMirrored(false);
          }, 1600);
        });
      } else {
        dragHref.current = null;
        animateDrag(t, 0, 320, () => {
          setDrag(null);
          setMirrored(false);
        });
      }
    },
    [animateDrag, router]
  );

  // The leaf has landed flat — swap the route while it is hidden behind it.
  const onCovered = useCallback(() => {
    if (!pending.current) return;
    router.push(pending.current);
    pending.current = null;
    // If the route never commits, don't strand the reader behind a blank sheet.
    bail.current = setTimeout(() => setPhase("opening"), 1600);
  }, [router]);

  // Route committed — turn the leaf away and reveal it. Covers both the link
  // turn (phase === "closing") and the drag turn (drag parked flat at 1).
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (bail.current) clearTimeout(bail.current);
    if (phase === "closing" || drag !== null) {
      const t = setTimeout(() => {
        setDrag(null);
        setPhase("opening");
      }, 60);
      return () => clearTimeout(t);
    }
  }, [pathname, phase, drag]);

  const onRevealed = useCallback(() => {
    setPhase(null);
    setMirrored(false);
  }, []);

  // Memoised so per-frame drag renders don't ripple through every TurnLink.
  // dragTurn gets its OWN stable identity: if it were rebuilt whenever
  // `turning` flips, PageCorner's pointer callbacks would be recreated the
  // instant a drag begins — and its cleanup effect would tear the freshly
  // registered window listeners off mid-gesture, leaving the leaf stranded.
  const dragTurn = useMemo(
    () => ({ start: dragStart, move: dragMove, end: dragEnd }),
    [dragStart, dragMove, dragEnd]
  );
  const dragActive = drag !== null;
  const ctx = useMemo(
    () => ({ turnTo, turning: phase !== null || dragActive, dragTurn }),
    [turnTo, phase, dragActive, dragTurn]
  );

  return (
    <PageTurnCtx.Provider value={ctx}>
      {children}
      {frozenAt !== undefined ? (
        <PageLeaf phase={frozenAt <= 1 ? "closing" : "opening"} frozenAt={frozenAt} />
      ) : drag !== null ? (
        <PageLeaf phase="closing" frozenAt={drag} mirrored />
      ) : (
        phase && (
          <PageLeaf
            key={phase}
            phase={phase}
            mirrored={mirrored}
            onDone={phase === "closing" ? onCovered : onRevealed}
          />
        )
      )}
    </PageTurnCtx.Provider>
  );
}

/** A link that turns the page instead of jumping to it. */
export function TurnLink({
  href,
  children,
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { turnTo } = usePageTurn();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        turnTo(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
