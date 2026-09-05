import { ImageResponse } from "next/og";
import { Chrome, INK_SOFT, OG_SIZE, ogOptions } from "@/lib/og/card";
import { PERSON } from "@/data/paper";

// Required for `output: "export"` — render at build, never on demand.
export const dynamic = "force-static";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${PERSON.name} — ${PERSON.title}`;

export default async function Image() {
  return new ImageResponse(
    (
      <Chrome kicker="Front Page" footer={`${PERSON.city} · Flutter · Android · Dart`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 108, fontWeight: 700, letterSpacing: 2, display: "flex" }}>
            {PERSON.name.toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 33,
              fontStyle: "italic",
              color: INK_SOFT,
              display: "flex",
            }}
          >
            Mobile Engineering · Architecture · Developer Experience
          </div>
        </div>
      </Chrome>
    ),
    await ogOptions()
  );
}
