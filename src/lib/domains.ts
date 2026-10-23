import { DOMAINS, type Domain } from "@/app/data/domains";

/**
 * Textes des 5 domaines modifiables depuis l'admin (clé « domains » de site_settings).
 * Les couleurs, icônes et adresses restent ceux de la charte (data/domains.ts).
 *
 * Les domaines sont lus à plus de 50 endroits du site à partir du tableau DOMAINS.
 * Plutôt que de faire circuler une copie partout, on applique les textes saisis dans l'admin
 * directement sur ce tableau : côté serveur à chaque lecture des réglages (fetchSettings),
 * côté navigateur dans SiteDataProvider, avant l'affichage des composants.
 * Les valeurs d'origine sont gardées pour pouvoir revenir en arrière.
 */

export const DOMAIN_TEXT_FIELDS = ["name", "theme", "slogan", "mission", "presentation", "cover"] as const;
export type DomainText = Pick<Domain, (typeof DOMAIN_TEXT_FIELDS)[number]>;
export type DomainOverrides = Record<string, Partial<DomainText>>;

const pick = (d: Domain): DomainText => ({
  name: d.name,
  theme: d.theme,
  slogan: d.slogan,
  mission: d.mission,
  presentation: [...d.presentation],
  cover: d.cover,
});

/** Textes d'origine, copiés avant toute modification. */
export const DEFAULT_DOMAIN_TEXT: Record<string, DomainText> = Object.fromEntries(DOMAINS.map((d) => [d.slug, pick(d)]));

/** Applique les textes de l'admin sur DOMAINS (un champ absent ou vide reprend sa valeur d'origine). */
export function applyDomainOverrides(overrides: DomainOverrides | null | undefined) {
  for (const d of DOMAINS) {
    const base = DEFAULT_DOMAIN_TEXT[d.slug];
    const o = overrides?.[d.slug] ?? {};
    d.name = o.name || base.name;
    d.theme = o.theme || base.theme;
    d.slogan = o.slogan || base.slogan;
    d.mission = o.mission || base.mission;
    d.cover = o.cover || base.cover;
    // côté navigateur, la présentation n'est pas transmise (elle ne s'affiche que sur la page du domaine)
    if (o.presentation !== undefined) d.presentation = o.presentation.length ? o.presentation : base.presentation;
  }
}

/** Version allégée pour le navigateur : sans les textes de présentation. */
export function clientDomainOverrides(overrides: DomainOverrides): DomainOverrides {
  return Object.fromEntries(
    Object.entries(overrides).map(([slug, o]) => [slug, { name: o.name, theme: o.theme, slogan: o.slogan, mission: o.mission, cover: o.cover }]),
  );
}

/** Textes actuels de chaque domaine (origine + modifications), pour le formulaire de l'admin. */
export function currentDomainText(overrides: DomainOverrides | null | undefined): Record<string, DomainText> {
  return Object.fromEntries(
    DOMAINS.map((d) => {
      const base = DEFAULT_DOMAIN_TEXT[d.slug];
      const o = overrides?.[d.slug] ?? {};
      return [
        d.slug,
        {
          name: o.name || base.name,
          theme: o.theme || base.theme,
          slogan: o.slogan || base.slogan,
          mission: o.mission || base.mission,
          cover: o.cover || base.cover,
          presentation: o.presentation?.length ? o.presentation : base.presentation,
        },
      ];
    }),
  );
}
