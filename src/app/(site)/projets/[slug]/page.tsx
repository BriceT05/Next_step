import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDomainBySlug } from "@/app/data/domains";
import { getMedia, getNews, getProjects } from "@/lib/content";
import { findProject } from "@/lib/projects";
import { ProjectView } from "../../../components/views-domains";

export const revalidate = 300;

// Un projet créé dans l'admin a sa page tout de suite, sans nouveau déploiement.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(await getProjects(), slug);
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
  const projects = await getProjects();
  const project = findProject(projects, slug);
  if (!project) notFound();
  const [media, news] = await Promise.all([getMedia(), getNews()]);
  return <ProjectView project={project} projects={projects} media={media} news={news} />;
}
