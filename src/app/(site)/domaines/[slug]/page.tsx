import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOMAINS, getDomainBySlug } from "@/app/data/domains";
import { getMedia, getProjects, getSettings, getTeam } from "@/lib/content";
import { DomainView } from "../../../components/views-domains";

export const revalidate = 300;

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await getSettings(); // applique les textes du domaine saisis dans l'admin
  const domain = getDomainBySlug(slug);
  if (!domain) return { title: "Domaine introuvable" };
  const title = `${domain.name} — ${domain.theme}`;
  return {
    title,
    description: `${domain.slogan}. ${domain.mission}`,
    openGraph: { title: `${title} | Next Step.sn`, description: domain.mission, images: [{ url: domain.cover, alt: domain.name }] },
  };
}

export default async function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await getSettings(); // applique les textes du domaine saisis dans l'admin
  const domain = getDomainBySlug(slug);
  if (!domain) notFound();
  const [media, team, projects] = await Promise.all([getMedia(), getTeam(), getProjects()]);
  return <DomainView domain={domain} projects={projects} media={media} team={team} />;
}
