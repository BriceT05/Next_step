import type { MetadataRoute } from "next";
import { DOMAINS } from "@/app/data/domains";
import { getProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://nextstep.sn";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/actualites`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/galerie`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/domaines`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/qui-sommes-nous/notre-histoire`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/qui-sommes-nous/mission-et-valeurs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/qui-sommes-nous/notre-equipe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/qui-sommes-nous/nos-partenaires`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/nous-rejoindre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/politique-de-confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const domainRoutes: MetadataRoute.Sitemap = DOMAINS.map((d) => ({
    url: `${base}/domaines/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = (await getProjects()).map((p) => ({
    url: `${base}/projets/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...domainRoutes, ...projectRoutes];
}
