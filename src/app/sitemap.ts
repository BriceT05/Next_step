import type { MetadataRoute } from "next";
import { DOMAINS } from "@/app/data/domains";
import { PROJECTS } from "@/app/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nextstep.sn";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/actualites`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/galerie`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/politique-de-confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const domainRoutes: MetadataRoute.Sitemap = DOMAINS.map((d) => ({
    url: `${base}/domaines/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${base}/projets/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...domainRoutes, ...projectRoutes];
}
