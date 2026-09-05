"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

/**
 * Lenis drives every scroll on the site, and GSAP's ScrollTrigger is told to
 * read from it rather than from the native scroll position. Without that
 * handshake the pinned sections drift a frame behind the content.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    // Expose for anchor navigation elsewhere in the app.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Keep ScrollTrigger in lockstep with Lenis.
    let detach: (() => void) | undefined;
    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      ScrollTrigger.refresh();
      detach = () => lenis.off("scroll", onScroll);
    })();

    return () => {
      cancelAnimationFrame(frame);
      detach?.();
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // A new edition always opens at the top of page one.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
