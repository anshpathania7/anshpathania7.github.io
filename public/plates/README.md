# Plates

Real screenshots go here. Anything absent falls back to its generated engraving,
so you can add them one at a time.

## Adding one

1. Drop the image in this folder, e.g. `inscripts-sdk.png`.
2. Add a line to `PLATES` in `src/data/paper.ts`:

   ```ts
   export const PLATES: Record<string, string> = {
     "inscripts-flutter-sdk": "/plates/inscripts-sdk.png",
   };
   ```

The keys are story and project slugs:

| Slug | Post |
| --- | --- |
| `inscripts-flutter-sdk` | Inscripts — Senior Software Developer |
| `scogo-location-stack` | Scogo Networks — Flutter Developer |
| `appx-mobile-developer` | Appx — Mobile Developer |
| `appx-junior-developer` | Appx — Junior Mobile Developer |
| `sortizy-crash-reduction` | Sortizy — Internship |
| `camp-yellow-payments` | Camp Yellow — Internship |
| `platos-virtual-architecture` | Platos Virtual — Intern |
| `kidaura-first-build` | Kidaura — Internship |
| `bonfyr` | Bonfyr (project) |

## What to supply

- **Full colour.** Do not pre-convert to greyscale — the page desaturates and
  applies a halftone screen automatically, and a pre-flattened image screens badly.
- **Landscape, roughly 16:10.** The lead slot and archive cards crop to 16:10;
  the article header crops to 21:9. Centre the subject.
- **1600px wide or more**, PNG or JPG.
- A single phone screenshot works better composed on a backdrop — three portrait
  screens side by side, or one device at an angle — than stretched to fill a
  landscape frame.

## Before you publish client work

Screenshots of Inscripts / Scogo / Appx products may be covered by an NDA or
contract. Check before putting them on a public site; the generated engravings
exist precisely so the paper reads well without them.
