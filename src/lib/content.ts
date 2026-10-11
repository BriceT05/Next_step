import { createClient } from "@supabase/supabase-js";
import type { GalleryItem, NewsArticle, Partner } from "@/lib/supabase";
import { DOMAINS } from "@/app/data/domains";
import { PROJECTS } from "@/app/data/projects";

/** Média affiché sur le site, relié si possible à un projet et à un domaine. */
export interface Media {
  id: string;
  type: "photo" | "video";
  src: string;
  /** Image de couverture (pour une vidéo) */
  cover: string;
  caption: string;
  detail: string;
  tag: string;
  projectSlug?: string;
  domainSlug?: string;
  year: string;
}

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Dans l'espace d'administration, le champ « tag » d'un média porte le nom du projet
 * (ou du domaine). C'est ce qui range le média dans la galerie du bon projet.
 */
export function toMedia(item: GalleryItem): Media {
  const tag = norm(item.tag ?? "");
  const project = PROJECTS.find((p) => norm(p.title) === tag || p.slug === tag);
  const domain = project
    ? DOMAINS.find((d) => d.slug === project.domainSlug)
    : DOMAINS.find((d) => norm(d.name) === tag || d.slug === tag);
  const isVideo = Boolean(item.video_url);
  return {
    id: item.id,
    type: isVideo ? "video" : "photo",
    src: isVideo ? item.video_url! : item.image_url,
    cover: item.image_url,
    caption: item.label,
    detail: item.sub,
    tag: item.tag,
    projectSlug: project?.slug,
    domainSlug: domain?.slug,
    year: item.created_at ? item.created_at.slice(0, 4) : "",
  };
}

export async function getMedia(): Promise<Media[]> {
  const client = db();
  if (!client) return [];
  try {
    const { data } = await client.from("gallery_items").select("*").order("created_at", { ascending: false });
    return ((data ?? []) as GalleryItem[]).filter((i) => i.image_url || i.video_url).map(toMedia);
  } catch {
    return [];
  }
}

export async function getNews(limit?: number): Promise<NewsArticle[]> {
  const client = db();
  if (!client) return [];
  try {
    let q = client.from("news_articles").select("*").order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return (data ?? []) as NewsArticle[];
  } catch {
    return [];
  }
}

export async function getDbPartners(): Promise<Partner[]> {
  const client = db();
  if (!client) return [];
  try {
    const { data } = await client.from("partners").select("*").order("created_at", { ascending: true });
    return (data ?? []) as Partner[];
  } catch {
    return [];
  }
}
