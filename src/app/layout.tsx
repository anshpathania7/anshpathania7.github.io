import type { Metadata } from "next";
import { inter, oswald, playfair } from "@/lib/fonts";
import { MASTHEAD, PERSON } from "@/data/paper";
import SmoothScroll from "@/components/SmoothScroll";
import { PageTurnProvider } from "@/components/PageTurn";
import Grain from "@/components/Grain";
import CursorLamp from "@/components/CursorLamp";
import PressRoom from "@/components/PressRoom";
import { EDITION_INIT_SCRIPT } from "@/lib/edition";
import "./globals.css";

export const metadata: Metadata = {
  // Absolute base for og:image and canonical URLs. Set NEXT_PUBLIC_SITE_URL
  // at build time once the real domain exists; the fallback keeps share
  // images working rather than pointing at localhost.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://anshpathania7.github.io"),
  title: {
    default: `${PERSON.name} — ${PERSON.title}`,
    template: `%s — ${MASTHEAD.title}`,
  },
  description:
    "Senior Software Developer specialising in Flutter, Dart and Android. SDK architecture, developer experience and cross-platform delivery — set as a newspaper.",
  keywords: [
    "Flutter developer",
    "Dart",
    "Android developer",
    "Kotlin",
    "mobile engineer",
    "SDK architecture",
    "Navi Mumbai",
    PERSON.name,
  ],
  authors: [{ name: PERSON.name }],
  openGraph: {
    title: `${PERSON.name} — ${PERSON.title}`,
    description:
      "Flutter · Dart · Android. SDK architecture and developer experience, set as a broadsheet.",
    type: "profile",
  },
};

/** Person schema, so search engines index the byline and not just the page. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  jobTitle: PERSON.title,
  email: `mailto:${PERSON.email}`,
  telephone: PERSON.phone,
  url: PERSON.github,
  sameAs: [PERSON.github, PERSON.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: PERSON.city,
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  knowsAbout: ["Flutter", "Dart", "Android", "Kotlin", "Firebase", "Mobile SDK architecture"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${oswald.variable} ${inter.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Sets the edition before the first paint of any content. Must stay
            blocking and inline — deferring it reintroduces the white flash it
            exists to prevent. It also must NOT be wrapped in a manual <head>:
            rendering <head> yourself in an App Router root layout breaks the
            RSC tree and the page never hydrates at all. */}
        <script dangerouslySetInnerHTML={{ __html: EDITION_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <SmoothScroll>
          <PageTurnProvider>{children}</PageTurnProvider>
        </SmoothScroll>
        <CursorLamp />
        <Grain />
        <PressRoom />
      </body>
    </html>
  );
}
