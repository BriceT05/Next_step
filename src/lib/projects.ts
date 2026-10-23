import type { SupabaseClient } from "@supabase/supabase-js";
import { PROJECTS, type ProjectData } from "@/app/data/projects";

/**
 * Projets modifiables depuis l'admin (table `projects`).
 * Tant que la table est vide, le site affiche les six projets du cahier des charges (data/projects.ts).
 * Ce fichier n'utilise rien de propre au serveur : il sert au site comme à l'admin.
 */

/** Tout le contenu d'un projet sauf son adresse, rangé dans la colonne `data`. */
export type ProjectContent = Omit<ProjectData, "slug">;

export type ProjectRow = {
  id: string;
  slug: string;
  sort_order: number;
  data: Partial<ProjectContent>;
  created_at?: string;
  updated_at?: string;
};

/** Valeurs d'un projet vide, pour qu'un champ manquant en base n'empêche jamais l'affichage. */
export const BLANK_PROJECT: ProjectContent = {
  title: "",
  subtitle: "",
  domainSlug: "yoonal",
  domainToConfirm: false,
  status: "a-venir",
  period: "",
  location: "",
  featured: false,
  cover: "",
  summary: "",
  facts: [],
  project: "",
  motivation: "",
  objectives: "",
  activities: [],
  results: [],
  calendar: [],
  applyLabel: "S'inscrire",
};

export function rowToProject(row: ProjectRow): ProjectData {
  return { ...BLANK_PROJECT, ...row.data, slug: row.slug };
}

export function projectToRow({ slug, ...data }: ProjectData, sortOrder: number) {
  return { slug, sort_order: sortOrder, data };
}

/** Lit les projets en base ; renvoie les projets par défaut si la table est vide ou injoignable. */
export async function fetchProjects(client: SupabaseClient | null): Promise<ProjectData[]> {
  if (!client) return PROJECTS;
  try {
    const { data, error } = await client.from("projects").select("*").order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return PROJECTS;
    return (data as ProjectRow[]).map(rowToProject);
  } catch {
    return PROJECTS;
  }
}

export const projectsOfDomain = (projects: ProjectData[], domainSlug: string) =>
  projects.filter((p) => p.domainSlug === domainSlug);

export const findProject = (projects: ProjectData[], slug: string) => projects.find((p) => p.slug === slug);

/** « Forum d'Entrepreneuriat » → « forum-d-entrepreneuriat » */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
