# The Pathania Post

A newspaper-themed portfolio for Anshuman Pathania — the CV set as a broadsheet.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run typecheck
```

`next.config.ts` sets `output: "export"`, so `npm run build` produces a fully static
`out/` directory that can be dropped on any host (Vercel, Netlify, GitHub Pages, S3).

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes automatically on every push to
`main`. One-time setup:

1. **Name the repository `anshpathania7.github.io`.** This matters: a user-site repo
   serves from the domain root, which is what all the internal links and asset paths
   assume. A repo with any other name serves from `/repo-name/` and the site would
   need a `basePath` — don't go there.
2. Push (see below), then in the repo: **Settings → Pages → Source: GitHub Actions**.
3. That's it. The workflow injects `NEXT_PUBLIC_SITE_URL` from the Pages config, so
   the OG share-card URLs resolve correctly with no hand-editing.

Notes already handled in this repo:
- `public/.nojekyll` — without it, Pages' Jekyll pass silently drops the `_next/`
  directory and the deployed site arrives with no CSS or JS.
- `sample-inspiration/` is gitignored: the reference video is third-party content.
- The OG-card fonts in `src/lib/og/` are Google Fonts TTFs (SIL Open Font License),
  which permits redistribution in the repo.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | `next/font` self-hosts and preloads the type with no layout shift — the whole design rides on typography |
| Language | TypeScript | — |
| Styling | Tailwind v4 | Tokens live in `@theme` in `src/app/globals.css` |
| Animation | Motion (Framer Motion) | Declarative reveals, the cycling lead story, magnetic hover, page turns |
| Scroll | Lenis | Inertial smooth scroll; ScrollTrigger reads from it |
| Scroll-driven | GSAP ScrollTrigger | Only for the pinned horizontal career archive |

## Where things are

```
src/
  app/
    page.tsx              front page (server component — computes the edition date)
    story/[slug]/         one article page per post held
    project/[slug]/       one article page per project
    globals.css           design tokens + editorial component classes
  components/
    Masthead, Ticker, NavBar, HeroStory, SideRails, CareerArchive,
    Sections (projects / skills / classifieds / colophon), Article
    PressArt              procedural halftone engravings
    PageTurn              3D page-turn route transition
    SmoothScroll, Grain, CursorLamp, Magnetic, Reveal
  data/paper.ts           ALL content — the CV modelled as newspaper stories
```

**To change any content, edit `src/data/paper.ts`.** Nothing else hard-codes copy —
including the STOP PRESS strip (`STOP_PRESS`) and the weather box lines (`WEATHER_LINES`).

## The extras

- **Stop press** — breaking-news strip under the ticker; edit `STOP_PRESS` and redeploy.
  Empty message = strip doesn't render.
- **The weather** — split-flap forecast box in the left rail, cycling `WEATHER_LINES`.
- **Drag the corner** — on article pages, the bottom-right corner peels; drag it left and
  the next story turns over under your hand (same segmented leaf as link turns, scrubbed
  by the pointer — see `PageCorner` + the `dragTurn` API in `PageTurn`). A plain click
  turns too. Reduced motion navigates plainly.
- **Ink dry** — first visit per session, the sheet sharpens like setting ink (`PressRoom`).
- **Type `flutter`** anywhere — newsprint butterflies. (`PressRoom`)
- **⌘P** — the print stylesheet flattens the whole site into an actual printable
  newspaper: no chrome, morning palette, archive unrolled vertically.
- **OG cards** — every page ships a broadsheet share card, generated at build from
  vendored TTFs (`src/lib/og/`). Set `NEXT_PUBLIC_SITE_URL` when the domain exists so
  `og:image` URLs are absolute and correct.
- **JSON-LD** — `Person` schema in the layout for search engines.

## The night edition

Two themes: **morning** (light) and **night** (dark), toggled from the nav and from
each article's folio bar, remembered in `localStorage`, defaulting to the reader's OS
preference.

How it hangs together:

- `src/lib/edition.ts` holds the palette key and a blocking init script.
- `globals.css` re-declares the `@theme` tokens under `html[data-theme="dark"]`. Because
  Tailwind v4 compiles `bg-paper` to `var(--color-paper)`, re-skinning is one block —
  individual components need no `dark:` variants at all.
- The SVG engravings read `--art-ink` / `--art-paper`, so the plates invert with the page.
- `.panel-invert` marks the reverse panels (colophon, CV advert, next-story bar). At
  night it redefines `--color-ink` / `--color-paper` *for its own subtree* so the panel
  becomes lifted charcoal rather than a glaring cream slab — and every `text-paper/65`
  inside follows, because Tailwind's opacity modifiers are `color-mix()` over those
  same variables.

## Plates (screenshots)

Story and project artwork comes from `PLATES` in `src/data/paper.ts`; anything
unlisted falls back to its generated engraving. See `public/plates/README.md` for the
slug table and image guidance. Supply screenshots **in full colour** — `.plate-img`
desaturates them and `.plate-screen` lays a halftone dot screen over the top, so a
pre-flattened greyscale image screens badly.

## The page turn

`PageLeaf.tsx` is a sheet that genuinely bends. CSS cannot curve a plane, so the leaf
is a chain of thirty slices, each a child of the last, each stepped one slice-width out
and rotated a few degrees further. Under `preserve-3d` that articulated chain
approximates a curve, and the free edge trails the hinge the way paper does.

- **The hinge stays on the left for the whole turn** (+180° → 0° → -180°, one
  continuous rotation). This is load-bearing: the chain accumulates bend outward from
  slice 0, so slice 0 has to *be* the hinge. Hinging right for the first half puts the
  trailing edge on the wrong side and it goes straight back to looking like a rigid board.
- Each slice carries a full-width copy of the sheet, offset by its index, so the printing
  runs continuously across the leaf instead of being clipped inside one slice.
- Shading is `(1 - |cos θ|)` raised to a power, not linear — a linear ramp tints the whole
  sheet evenly and it stops reading as paper. There's a soft-light sheen on the slices
  still facing the reader.
- Do **not** draw a seam per slice. An early version did and the curl read as a venetian
  blind; real paper has one fold.
- Everything is written straight to the DOM from a single rAF loop. Thirty nested
  elements re-rendering through React state per frame drops frames.

**Tuning it:** append `?leaf=<0..2>` to any URL to freeze the leaf at that point in the
turn — `0` and `2` are edge-on, `1` is flat and covering, `0.5` and `1.5` are peak curl.
Adjust `SEGMENTS`, `MAX_CURL` and `DURATION` at the top of the file.

## Notes for future edits

- **The art is generated, not photographed.** `PressArt` draws SVG line work plus a
  halftone dot screen. It is deterministic: values come from `noise(seed, index, salt)`,
  a *pure* hash rather than a sequential generator. Do not replace it with a stateful
  `next()` closure — one shared across a parent and its child renders differently under
  React's development double-render and causes a hydration mismatch.
- **Trig output is rounded** via `q()`. `Math.sin`/`Math.cos` are not required to be
  correctly rounded, so Node and the browser's engine disagree in the last bit — enough
  for React to report a hydration mismatch on SVG coordinates.
- **Anything time-based must be computed on the server** and passed down as a prop (see
  the `edition` prop on `Masthead`). A `new Date()` inside a client component disagrees
  with the prerendered HTML.
- **`LineReveal` puts its viewport trigger on the outer wrapper**, not the element that
  moves. The inner span starts translated below an `overflow-hidden` clip box, so an
  observer on it would report zero intersection forever and the line would never appear.
- **Never render a `<head>` element in `src/app/layout.tsx`.** App Router manages the
  head itself; a manual one breaks the RSC tree and the whole page silently stops
  hydrating — no error, just dead animations and dead buttons. The edition script lives
  at the top of `<body>` for exactly this reason. If you hit this, also delete `.next`,
  since the broken build stays cached.
- The CV PDF is served from `public/anshuman-pathania-cv.pdf`. Replace that file to
  update the download.

## Still to do

- Swap in real photography if wanted — `PressArt` can be replaced per story.
- Add LinkedIn / X links to `PERSON` in `src/data/paper.ts`.
