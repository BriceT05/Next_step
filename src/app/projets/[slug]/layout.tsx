import type { Metadata } from "next";
import { getProjectBySlug } from "@/app/data/projects";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Projet introuvable — Next Step.sn" };
  }
  return {
    title: `${project.title} — Projet | Next Step.sn`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Next Step.sn`,
      description: project.description,
      images: [{ url: project.bg, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Next Step.sn`,
      description: project.description,
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
