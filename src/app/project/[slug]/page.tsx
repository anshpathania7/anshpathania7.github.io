import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article";
import { PERSON, PROJECTS, STORIES, plateFor, projectBySlug } from "@/data/paper";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return { title: "Not in this edition" };

  return {
    title: project.title,
    description: project.dek,
    openGraph: { title: project.title, description: project.dek, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const lead = STORIES[0];

  return (
    <Article
      kicker={`${project.kicker} · ${project.title}`}
      headline="Strangers Gather in Public"
      headlineItalic="Chatrooms"
      headlineTail="as Bonfyr Opens Its Doors"
      dek={project.dek}
      motif={project.motif}
      seed={project.slug}
      image={plateFor(project.slug)}
      dateline={`${PERSON.city} — ${PERSON.region}`}
      meta={[{ label: "stack", value: project.stack.slice(0, 3).join(" · ") }]}
      body={project.body}
      pullQuote="Group chat is a deceptively good exercise: ordering, optimistic sends, and a list that has to stay smooth from both ends at once."
      recordTitle="Built With"
      record={project.stack}
      tags={project.stack}
      next={{
        href: `/story/${lead.slug}/`,
        label: "Continued on the next page",
        title: `${lead.org} — ${lead.role}`,
      }}
    />
  );
}
