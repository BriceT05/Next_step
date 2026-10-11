import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDomainBySlug } from "@/app/data/domains";
import { PROJECTS, getProjectBySlug } from "@/app/data/projects";
import { getMedia, getNews } from "@/lib/content";
import { ProjectView } from "../../../components/views-domains";

export const revalidate = 300;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Projet introuvable" };
  const domain = getDomainBySlug(project.domainSlug);
  const title = domain ? `${project.title} — ${domain.name}` : project.title;
  return {
    title,
    description: project.summary,
    openGraph: { title: `${title} | Next Step.sn`, description: project.summary, images: [{ url: project.cover, alt: project.title }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const [media, news] = await Promise.all([getMedia(), getNews()]);
  return <ProjectView project={project} media={media} news={news} />;
}
