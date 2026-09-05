import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponse } from "next/og";

/** next/og doesn't export its options type; derive it from the constructor. */
type ImageResponseOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;

/**
 * Shared scaffolding for the OG cards — the mini front page that shows up
 * when the site is dropped into Slack, LinkedIn or WhatsApp.
 *
 * Fonts are vendored TTFs read from disk at build time, so generation never
 * depends on the network. Everything renders through Satori, which supports a
 * flexbox subset only — no grid, no CSS variables, colours inlined.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const INK = "#12100e";
export const PAPER = "#fcfbf7";
export const PAPER_TINT = "#f4f2ec";
export const INK_SOFT = "#46423c";
export const INK_FAINT = "#7d776e";
export const FLAG = "#f9d3df";

const fontDir = join(process.cwd(), "src", "lib", "og");

export async function ogOptions(): Promise<ImageResponseOptions> {
  const [playfair, playfairItalic, oswald] = await Promise.all([
    readFile(join(fontDir, "playfair-700.ttf")),
    readFile(join(fontDir, "playfair-italic-500.ttf")),
    readFile(join(fontDir, "oswald-500.ttf")),
  ]);
  return {
    ...OG_SIZE,
    fonts: [
      { name: "Playfair", data: playfair, weight: 700, style: "normal" },
      { name: "Playfair", data: playfairItalic, weight: 500, style: "italic" },
      { name: "Oswald", data: oswald, weight: 500, style: "normal" },
    ],
  };
}

/** The rules-and-kicker chrome every card shares. */
export function Chrome({
  kicker,
  children,
  footer,
}: {
  kicker: string;
  children: React.ReactNode;
  footer: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: PAPER,
        padding: "44px 64px",
        fontFamily: "Playfair",
        color: INK,
      }}
    >
      {/* top rules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ height: 6, backgroundColor: INK, display: "flex" }} />
        <div style={{ height: 2, backgroundColor: INK, display: "flex" }} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 22,
          fontFamily: "Oswald",
          fontSize: 22,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: INK_SOFT,
        }}
      >
        <span>The Pathania Post</span>
        <span
          style={{
            backgroundColor: FLAG,
            padding: "4px 14px",
            color: INK,
          }}
        >
          {kicker}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `2px solid ${INK}`,
          paddingTop: 18,
          fontFamily: "Oswald",
          fontSize: 19,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: INK_FAINT,
        }}
      >
        <span>{footer}</span>
        <span>Price: One Interview</span>
      </div>
    </div>
  );
}
