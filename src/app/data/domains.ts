import type { CSSProperties } from "react";

export type DomainIconName = "compass" | "bulb" | "mic" | "leaf" | "star";

export interface Domain {
  slug: string;
  name: string;
  theme: string;
  slogan: string;
  /** Mission en une phrase */
  mission: string;
  /** Texte de présentation : pourquoi le domaine existe */
  presentation: string[];
  /** Couleur du domaine */
  color: string;
  /** Fond clair associé */
  light: string;
  /** Variante foncée, pour les boutons et les petits textes (contraste AA avec le blanc) */
  deep: string;
  icon: DomainIconName;
  cover: string;
  order: number;
}

export const DOMAINS: Domain[] = [
  {
    slug: "yoonal",
    name: "Yoonal",
    theme: "Orientation",
    slogan: "Trouve ta voie",
    mission: "Guider les jeunes dans leur parcours scolaire et professionnel.",
    presentation: [
      "« Et après le bac, je fais quoi ? » C'est la question par laquelle tout a commencé. Yoonal, c'est la branche Orientation de Next Step.sn : elle aide les élèves et les étudiants à découvrir les métiers, les filières et les parcours possibles.",
      "Nos trois salons d'orientation, organisés dans trois départements, ont réuni plus de 1 000 élèves. Ils nous ont montré à quel point les jeunes ont besoin de voir concrètement ce que sont les métiers, près de chez eux et quand ils le souhaitent.",
    ],
    color: "#1F6FB2",
    light: "#E6F0F9",
    deep: "#185A91",
    icon: "compass",
    cover: "/Oriantation.jpg",
    order: 1,
  },
  {
    slug: "yegel",
    name: "Yëgël",
    theme: "Entrepreneuriat",
    slogan: "Ose entreprendre",
    mission: "Éveiller et outiller l'esprit entrepreneurial des jeunes.",
    presentation: [
      "Beaucoup de jeunes ont des idées, mais manquent d'accès à la formation, au mentorat et au réseau qui permettent de les transformer en activité économique.",
      "Yëgël veut lever ces obstacles : former aux fondamentaux de l'entrepreneuriat, apprendre à présenter son projet et accompagner les porteurs d'idées vers un financement ou un incubateur, pour encourager l'auto-emploi et l'initiative économique.",
    ],
    color: "#D9822B",
    light: "#FBEFE0",
    deep: "#A85E14",
    icon: "bulb",
    cover: "/domain-entrepreneuriat.jpg",
    order: 2,
  },
  {
    slug: "la-voix-du-leader",
    name: "La Voix du Leader",
    theme: "Leadership",
    slogan: "Ta voix compte",
    mission: "Former des jeunes leaders responsables et engagés.",
    presentation: [
      "Savoir prendre la parole est la base du leadership, et pourtant le trac et le manque de confiance freinent beaucoup de jeunes.",
      "La Voix du Leader leur donne l'occasion de s'exercer, de se tromper sans risque et de progresser devant un groupe bienveillant, pour devenir des leaders responsables et engagés.",
    ],
    color: "#7B3FA0",
    light: "#F0E8F6",
    deep: "#63308A",
    icon: "mic",
    cover: "/Leadership jeunesse.jpg",
    order: 3,
  },
  {
    slug: "kaddu",
    name: "Kaddu",
    theme: "Engagement communautaire",
    slogan: "Agis pour ta communauté",
    mission: "Mobiliser la jeunesse autour de causes locales.",
    presentation: [
      "Kaddu mobilise la jeunesse autour de causes locales : l'école, l'environnement, la santé et la vie des quartiers.",
      "L'idée est de semer tôt le goût de l'engagement : initier les enfants à la terre et au respect de l'environnement, ou former ceux qui sont déjà sur le terrain aux gestes qui sauvent. Les enfants d'aujourd'hui sont les adultes de demain.",
    ],
    color: "#3C8D4F",
    light: "#E5F2E8",
    deep: "#2F7340",
    icon: "leaf",
    cover: "/domain-engagement.jpg",
    order: 4,
  },
  {
    slug: "sedar",
    name: "SËDAR",
    theme: "Autonomisation de la femme",
    slogan: "Des femmes autonomes, un avenir solide",
    mission: "Renforcer l'autonomie des jeunes femmes.",
    presentation: [
      "L'autonomie d'une femme est à la fois économique et sociale. Une formation sans financement, ou un financement sans accompagnement, a peu de chances de durer.",
      "SËDAR combine donc les trois : apprendre, être accompagnée, puis pouvoir investir, au sein d'un réseau de femmes qui se soutiennent.",
    ],
    color: "#C2386B",
    light: "#F9E6EE",
    deep: "#A02A56",
    icon: "star",
    cover: "/business.jpg",
    order: 5,
  },
];

export function getDomainBySlug(slug: string): Domain | undefined {
  return DOMAINS.find((d) => d.slug === slug);
}

/** Variables CSS à poser sur un conteneur pour qu'il prenne la couleur du domaine. */
export function domainTheme(d: Domain): CSSProperties {
  return { "--dc": d.color, "--dc-light": d.light, "--dc-deep": d.deep } as CSSProperties;
}
