import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_REGION_PROJECTS, HISTORY, HISTORY_STEPS, MISSION, NEXT_EVENT, REGION_PROJECTS, REGIONS, SITE, SOCIALS, STATS, VALUES, VISION,
} from "@/app/data/site";
import { type DomainOverrides, applyDomainOverrides, clientDomainOverrides } from "@/lib/domains";
import { DEFAULT_MENTIONS, DEFAULT_PRIVACY, type LegalPage } from "@/app/data/legal";

/**
 * Réglages généraux modifiables depuis l'admin (table `site_settings`, une ligne par clé).
 * Une clé absente de la base garde la valeur par défaut de data/site.ts.
 * Ce fichier n'utilise rien de propre au serveur : il sert au site comme à l'admin.
 */

/** Réseaux pour lesquels le site a une icône (voir SocialIcon). */
export const SOCIAL_NETWORKS = ["Facebook", "Instagram", "TikTok", "YouTube", "LinkedIn"] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export type Phone = { display: string; wa: string };
export type Stat = { value: number; suffix: string; label: string };

export type GeneralSettings = {
  slogan: string;
  city: string;
  email: string;
  /** Le premier numéro sert pour WhatsApp */
  phones: Phone[];
  /** Réseau → lien ; un lien vide masque le réseau */
  socials: { name: SocialNetwork; href: string }[];
};

/** Bloc « Prochain événement » de l'accueil, avec compte à rebours. */
export type EventSettings = {
  enabled: boolean;
  title: string;
  subtitle: string;
  /** Date affichée en toutes lettres, ex. « Avril 2027 · Dakar » */
  dateLabel: string;
  /** Date et heure du compte à rebours, au format ISO (heure de Dakar = UTC) */
  date: string;
  /** Domaine dont le bloc prend les couleurs */
  domainSlug: string;
  href: string;
  buttonLabel: string;
};

/** Page Notre histoire (et son résumé sur l'accueil). */
export type HistoryStep = { date: string; title: string; text: string; image?: string };
export type HistorySettings = {
  title: string;
  /** Le 1er paragraphe est mis en avant (et repris sur l'accueil avec le 2e), le dernier est écrit à la main */
  paragraphs: string[];
  steps: HistoryStep[];
};

/** Page Mission et valeurs. */
export type AboutSettings = { mission: string; vision: string; values: { name: string; text: string }[] };

export type SiteSettings = GeneralSettings & {
  stats: Stat[];
  event: EventSettings;
  history: HistorySettings;
  about: AboutSettings;
  /** Textes des domaines modifiés dans l'admin (voir lib/domains.ts) */
  domains: DomainOverrides;
  /** Carte des 14 régions : actions réalisées et projets prévus, par nom de région */
  regions: RegionsSettings;
  /** Pages Mentions légales et Politique de confidentialité */
  legal: LegalSettings;
};

export type LegalSettings = { mentions: LegalPage; privacy: LegalPage };
export const DEFAULT_LEGAL: LegalSettings = { mentions: DEFAULT_MENTIONS, privacy: DEFAULT_PRIVACY };

export type RegionInfo = { done: string[]; projects: string[] };
export type RegionsSettings = Record<string, RegionInfo>;

export const DEFAULT_REGIONS: RegionsSettings = Object.fromEntries(
  REGIONS.map((r) => [r.name, { done: r.done ?? [], projects: REGION_PROJECTS[r.name] ?? DEFAULT_REGION_PROJECTS }]),
);

/** Ce que les composants côté navigateur reçoivent : les longs textes restent sur leurs pages. */
export type ClientSettings = Omit<SiteSettings, "history" | "about" | "regions" | "legal">;

export function toClientSettings(s: SiteSettings): ClientSettings {
  return {
    slogan: s.slogan,
    city: s.city,
    email: s.email,
    phones: s.phones,
    socials: s.socials,
    stats: s.stats,
    event: s.event,
    domains: clientDomainOverrides(s.domains),
  };
}

export const DEFAULT_HISTORY: HistorySettings = { ...HISTORY, steps: HISTORY_STEPS };
export const DEFAULT_ABOUT: AboutSettings = { mission: MISSION, vision: VISION, values: VALUES };

export const DEFAULT_EVENT: EventSettings = { enabled: true, buttonLabel: "Je m'inscris", ...NEXT_EVENT };

/** L'événement s'affiche s'il est activé et que sa date n'est pas passée. */
export const eventIsUpcoming = (e: EventSettings, now = Date.now()) =>
  e.enabled && Boolean(e.title) && new Date(e.date).getTime() > now;

export const DEFAULT_GENERAL: GeneralSettings = {
  slogan: SITE.slogan,
  city: SITE.city,
  email: SITE.email,
  phones: SITE.phones,
  socials: SOCIALS.map((s) => ({ name: s.name, href: s.href })),
};

export const DEFAULT_SETTINGS: SiteSettings = {
  ...DEFAULT_GENERAL,
  stats: STATS,
  event: DEFAULT_EVENT,
  history: DEFAULT_HISTORY,
  about: DEFAULT_ABOUT,
  domains: {},
  regions: DEFAULT_REGIONS,
  legal: DEFAULT_LEGAL,
};

/** « +221 77 860 51 82 » → « 221778605182 » (format attendu par wa.me et tel:) */
export const phoneDigits = (display: string) => display.replace(/\D/g, "");

/** Remet d'aplomb un réglage lu en base (champ manquant, ancien format…). */
export function normalizeSettings(
  general: Partial<GeneralSettings> | null,
  stats: Stat[] | null,
  event: Partial<EventSettings> | null = null,
  history: Partial<HistorySettings> | null = null,
  about: Partial<AboutSettings> | null = null,
  domains: DomainOverrides | null = null,
  regions: RegionsSettings | null = null,
  legal: Partial<LegalSettings> | null = null,
): SiteSettings {
  const g = { ...DEFAULT_GENERAL, ...(general ?? {}) };
  return {
    slogan: g.slogan,
    city: g.city,
    email: g.email,
    phones: (g.phones ?? []).map((p) => ({ display: p.display, wa: phoneDigits(p.display) })).filter((p) => p.wa),
    socials: (g.socials ?? []).filter((s) => SOCIAL_NETWORKS.includes(s.name) && s.href),
    stats: Array.isArray(stats) ? stats : DEFAULT_SETTINGS.stats,
    event: { ...DEFAULT_EVENT, ...(event ?? {}) },
    history: { ...DEFAULT_HISTORY, ...(history ?? {}) },
    about: { ...DEFAULT_ABOUT, ...(about ?? {}) },
    domains: domains ?? {},
    legal: {
      mentions: { ...DEFAULT_MENTIONS, ...(legal?.mentions ?? {}) },
      privacy: { ...DEFAULT_PRIVACY, ...(legal?.privacy ?? {}) },
    },
    regions: Object.fromEntries(REGIONS.map((r) => [r.name, { ...DEFAULT_REGIONS[r.name], ...(regions?.[r.name] ?? {}) }])),
  };
}

export async function fetchSettings(client: SupabaseClient | null): Promise<SiteSettings> {
  if (!client) return normalizeSettings(null, null);
  try {
    const { data, error } = await client.from("site_settings").select("key, value");
    if (error || !data) return normalizeSettings(null, null);
    const get = (key: string) => data.find((r) => r.key === key)?.value ?? null;
    const settings = normalizeSettings(get("general"), get("stats"), get("event"), get("history"), get("about"), get("domains"), get("regions"), get("legal"));
    applyDomainOverrides(settings.domains);
    return settings;
  } catch {
    return normalizeSettings(null, null);
  }
}

/** Lien WhatsApp vers le premier numéro, avec un message prérempli. */
export function whatsappHref(settings: Pick<SiteSettings, "phones">, text?: string): string {
  const number = settings.phones[0]?.wa ?? phoneDigits(SITE.phones[0].display);
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
