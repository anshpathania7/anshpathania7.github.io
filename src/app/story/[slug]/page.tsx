import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article";
import { PERSON, STORIES, plateFor, storyBySlug } from "@/data/paper";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = storyBySlug(slug);
  if (!story) return { title: "Not in this edition" };

  const title = [story.headline, story.headlineItalic, story.headlineTail]
    .filter(Boolean)
    .join(" ");

  return {
    title: `${story.org} — ${story.role}`,
    description: story.dek,
    openGraph: { title, description: story.dek, type: "article" },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = storyBySlug(slug);
  if (!story) notFound();

  const idx = STORIES.findIndex((s) => s.slug === slug);
  const next = STORIES[(idx + 1) % STORIES.length];

  return (
    <Article
      kicker={`${story.kicker} · ${story.org}`}
      headline={story.headline}
      headlineItalic={story.headlineItalic}
      headlineTail={story.headlineTail}
      dek={story.dek}
      motif={story.motif}
      seed={story.slug}
      image={plateFor(story.slug)}
      dateline={`${story.dateline} — ${PERSON.region}`}
      meta={[
        { label: "role", value: story.role },
        { label: "period", value: story.period },
      ]}
      body={story.body}
      pullQuote={story.pullQuote}
      recordTitle="From the Record"
      record={story.bullets}
      tags={story.tags}
      next={{
        href: `/story/${next.slug}/`,
        label: "Continued on the next page",
        title: `${next.org} — ${next.role}`,
      }}
    />
  );
}
