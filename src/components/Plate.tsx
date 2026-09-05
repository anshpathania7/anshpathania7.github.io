"use client";

import { useState } from "react";
import PressArt from "./PressArt";
import type { Motif } from "@/data/paper";

/**
 * A plate in the paper — a real screenshot where one exists, the generated
 * engraving where one doesn't.
 *
 * Screenshots are put through the press rather than dropped in raw: a full-page
 * app screenshot in its native colour would be the only saturated thing in a
 * black-and-white broadsheet and would read as a mistake. `.plate-img`
 * desaturates and lifts contrast, and `.plate-screen` lays a dot screen over
 * the top so it resolves the way newsprint photography does.
 *
 * A missing or broken file falls back to the engraving instead of leaving a
 * hole, so images can be added one at a time.
 */
export default function Plate({
  motif,
  seed,
  image,
  alt,
  className,
  imageClassName,
}: {
  motif: Motif;
  seed: string;
  image?: string;
  alt?: string;
  className?: string;
  /** Extra classes for the <img> itself — e.g. the hover scale on cards. */
  imageClassName?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!image || broken) {
    return <PressArt motif={motif} seed={seed} className={className} />;
  }

  return (
    <div className={`plate relative overflow-hidden ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
        className={`plate-img absolute inset-0 h-full w-full object-cover ${imageClassName ?? ""}`}
      />
      <span aria-hidden className="plate-screen absolute inset-0" />
    </div>
  );
}
