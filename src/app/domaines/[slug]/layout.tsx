import type { Metadata } from "next";
import { getDomainBySlug } from "@/app/data/domains";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomainBySlug(slug);
  if (!domain) {
    return { title: "Domaine introuvable — Next Step.sn" };
  }
  return {
    title: `${domain.title} — Domaine d'action | Next Step.sn`,
    description: domain.description,
    openGraph: {
      title: `${domain.title} — Next Step.sn`,
      description: domain.description,
      images: [{ url: domain.bg, alt: domain.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${domain.title} — Next Step.sn`,
      description: domain.description,
    },
  };
}

export default function DomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
