import { ImageResponse } from "next/og";
import { Chrome, INK_SOFT, OG_SIZE, ogOptions } from "@/lib/og/card";
import { STORIES, storyBySlug } from "@/data/paper";

// Required for `output: "export"` — render at build, never on demand.
export const dynamic = "force-static";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = storyBySlug(slug);
  const headline = story
    ? [story.headline, story.headlineItalic, story.headlineTail].filter(Boolean).join(" ")
    : "The Pathania Post";

  return new ImageResponse(
    (
      <Chrome
        kicker={story?.kicker ?? "Story"}
        footer={story ? `${story.org} · ${story.period}` : ""}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: headline.length > 46 ? 62 : 74,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1,
              display: "flex",
            }}
          >
            {headline}
          </div>
          {story && (
            <div
              style={{
                marginTop: 26,
                fontSize: 29,
                fontStyle: "italic",
                lineHeight: 1.4,
                color: INK_SOFT,
                display: "flex",
              }}
            >
              {story.dek.length > 150 ? story.dek.slice(0, 147) + "…" : story.dek}
            </div>
          )}
        </div>
      </Chrome>
    ),
    await ogOptions()
  );
}
