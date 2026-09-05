import { Playfair_Display, Oswald, Inter } from "next/font/google";

/**
 * Three voices, the way a paper sets type:
 *  - Playfair  : the masthead and every headline (has real italics for titles)
 *  - Oswald    : condensed caps for nav, kickers, folios, datelines
 *  - Inter     : neutral sans for deks and running body copy
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
