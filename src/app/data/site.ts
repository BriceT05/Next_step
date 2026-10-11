/** Contenus généraux du site (cahier des charges, octobre 2026). */

export const SITE = {
  name: "Next Step.sn",
  slogan: "Ose rêver",
  url: "https://nextstep.sn",
  city: "Dakar, Sénégal",
  email: "Nextstep2k25@gmail.com",
  phones: [
    { display: "+221 77 860 51 82", wa: "221778605182" },
    { display: "+221 71 050 65 88", wa: "221710506588" },
  ],
};

export function whatsappLink(text?: string, index = 0): string {
  const base = `https://wa.me/${SITE.phones[index].wa}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const SOCIALS = [
  { name: "Facebook", href: "https://www.facebook.com/nextstepsn" },
  { name: "Instagram", href: "https://www.instagram.com/next_step_sn" },
  { name: "TikTok", href: "https://www.tiktok.com/@nextstepsn" },
  { name: "YouTube", href: "https://www.youtube.com/@nextstep-sn" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/nextstepsn" },
] as const;

export const NAV = [
  { label: "Accueil", href: "/" },
  {
    label: "Qui sommes-nous",
    href: "/qui-sommes-nous/notre-histoire",
    children: [
      { label: "Notre histoire", href: "/qui-sommes-nous/notre-histoire" },
      { label: "Mission et valeurs", href: "/qui-sommes-nous/mission-et-valeurs" },
      { label: "Notre équipe", href: "/qui-sommes-nous/notre-equipe" },
      { label: "Nos partenaires", href: "/qui-sommes-nous/nos-partenaires" },
    ],
  },
  { label: "Nos domaines", href: "/domaines", mega: true },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

/** Chiffres clés animés (touche 5) */
export const STATS = [
  { value: 3, suffix: "", label: "Salons d'orientation organisés" },
  { value: 3, suffix: "", label: "Départements touchés" },
  { value: 1000, suffix: "+", label: "Élèves réunis" },
  { value: 14, suffix: "", label: "Régions" },
  { value: 5, suffix: "", label: "Domaines" },
  { value: 6, suffix: "", label: "Projets" },
];

/** Notre histoire (texte proposé, section 5) */
export const HISTORY = {
  title: "Tout a commencé par un pas",
  paragraphs: [
    "Tout a commencé par une question que des milliers de jeunes se posent en silence : « Et après le bac, je fais quoi ? »",
    "En 2025, des jeunes Sénégalais décident de ne plus laisser cette question sans réponse. Ils n'ont pas de grands moyens, seulement une conviction : un jeune bien orienté, bien entouré, qui ose rêver, peut changer sa vie et celle de sa communauté. Ainsi naît Next Step.sn, avec une boussole pour emblème et trois mots pour guide : Ose rêver.",
    "Le premier pas est un salon d'orientation. Puis un deuxième, puis un troisième, dans trois départements. Plus de mille élèves y reçoivent des informations, des conseils et, surtout, de la confiance. Le 15 novembre 2025, à Keur Massar, des élèves de terminale se pressent autour des stands pour préparer leur après-bac.",
    "Très vite, l'évidence s'impose : l'orientation n'est que le premier pas. Pour avancer, un jeune doit aussi apprendre à entreprendre, à prendre la parole, à s'engager pour sa communauté. Et les jeunes femmes ont besoin d'être soutenues pour s'autonomiser. Cinq domaines naissent : Yoonal, Yëgël, La Voix du Leader, Kaddu et SËDAR.",
    "Aujourd'hui, Next Step.sn est présente dans les 14 régions du Sénégal. Des jeunes en tee-shirt bleu parcourent le pays pour filmer des parcours inspirants, former à l'entrepreneuriat, planter des graines dans les cours d'école ou accompagner des femmes vers leur autonomie.",
    "Chaque pas compte. Le prochain, c'est le vôtre.",
  ],
};

/** Les « pas » de la frise (touche 3). Pour ajouter une étape : ajouter une entrée ici. */
export const HISTORY_STEPS: { date: string; title: string; text: string; image?: string }[] = [
  {
    date: "2025",
    title: "Naissance de Next Step.sn",
    text: "Des jeunes Sénégalais créent l'association, avec une boussole pour emblème et trois mots pour guide : Ose rêver.",
  },
  {
    date: "2025",
    title: "Les premiers salons d'orientation",
    text: "Un premier salon, puis un deuxième, puis un troisième, dans trois départements. Plus de 1 000 élèves y reçoivent des informations, des conseils et de la confiance.",
  },
  {
    date: "15 novembre 2025",
    title: "Salon de Keur Massar",
    text: "Des élèves de terminale se pressent autour des stands pour préparer leur après-bac.",
  },
  {
    date: "Ensuite",
    title: "Cinq domaines naissent",
    text: "L'orientation n'est que le premier pas : Yoonal, Yëgël, La Voix du Leader, Kaddu et SËDAR voient le jour.",
  },
  {
    date: "2027",
    title: "Un programme riche en projets",
    text: "Next Step Inside, le Forum d'Entrepreneuriat, les ateliers de prise de parole, Ñaan Yaram, le programme SËDAR et le secourisme pour les ASC.",
  },
];

/** Valeurs (à valider par l'association) */
export const VALUES = [
  { name: "Audace", text: "Oser rêver, puis oser faire le premier pas." },
  { name: "Solidarité", text: "Avancer ensemble, personne ne reste seul face à ses questions." },
  { name: "Engagement", text: "Agir concrètement pour sa communauté, sur le terrain." },
  { name: "Égalité", text: "Les mêmes chances pour toutes et tous, dans les 14 régions." },
  { name: "Excellence", text: "Faire les choses sérieusement, pour mériter la confiance des jeunes." },
];

export const MISSION =
  "Accompagner chaque jeune vers son prochain pas : s'orienter, entreprendre, prendre la parole, s'engager pour sa communauté et, pour les jeunes femmes, gagner en autonomie.";

export const VISION =
  "Un Sénégal où un jeune bien orienté, bien entouré, qui ose rêver, peut changer sa vie et celle de sa communauté.";

/** La boussole « Trouve ton prochain pas » (touche 1) */
export const PERSONAS: {
  id: string;
  label: string;
  angle: number;
  domainSlug?: string;
  href: string;
  title: string;
  text: string;
  cta: string;
}[] = [
  {
    id: "eleve",
    label: "Je suis élève",
    angle: 0,
    domainSlug: "yoonal",
    href: "/domaines/yoonal",
    title: "Yoonal — Trouve ta voie",
    text: "Découvre les métiers, les filières et des parcours réels, près de chez toi.",
    cta: "Découvrir Yoonal",
  },
  {
    id: "etudiant",
    label: "Je suis étudiant",
    angle: 60,
    domainSlug: "la-voix-du-leader",
    href: "/domaines/la-voix-du-leader",
    title: "La Voix du Leader — Ta voix compte",
    text: "Apprends à prendre la parole, à convaincre et à gagner en confiance.",
    cta: "Découvrir La Voix du Leader",
  },
  {
    id: "entrepreneur",
    label: "Je suis jeune entrepreneur",
    angle: 120,
    domainSlug: "yegel",
    href: "/projets/forum-entrepreneuriat",
    title: "Yëgël — Ose entreprendre",
    text: "Forme-toi, pitche ton projet devant un jury et sois suivi par un mentor.",
    cta: "Voir le Forum d'Entrepreneuriat",
  },
  {
    id: "femme",
    label: "Je suis une femme qui veut se lancer",
    angle: 180,
    domainSlug: "sedar",
    href: "/projets/leadership-feminin-et-autonomisation",
    title: "SËDAR — Des femmes autonomes, un avenir solide",
    text: "Formation, mentorat et microfinancement pour développer ton activité.",
    cta: "Voir le programme SËDAR",
  },
  {
    id: "benevole",
    label: "Je veux être bénévole",
    angle: 240,
    domainSlug: "kaddu",
    href: "/nous-rejoindre?profil=benevole",
    title: "Kaddu — Agis pour ta communauté",
    text: "Rejoins l'équipe et participe aux projets de terrain, près de chez toi.",
    cta: "Devenir bénévole",
  },
  {
    id: "partenaire",
    label: "Je suis un partenaire",
    angle: 300,
    href: "/nous-rejoindre?profil=partenaire",
    title: "Construisons ensemble",
    text: "École, institution, entreprise ou ASC : soutenez un projet ou accueillez une action.",
    cta: "Devenir partenaire",
  },
];

/**
 * Mur « Ose rêver » (touche 6).
 * Exemples de départ, à remplacer par les rêves envoyés par les visiteurs et validés par l'administrateur.
 */
export const DREAMS = [
  "Je rêve de devenir médecin dans ma région",
  "Je rêve de créer mon entreprise",
  "Je rêve de devenir ingénieure",
  "Je rêve de parler devant mille personnes sans trembler",
  "Je rêve d'ouvrir une école dans mon village",
  "Je rêve de devenir pilote",
  "Je rêve de nourrir mon quartier avec mon jardin",
  "Je rêve de devenir journaliste",
  "Je rêve d'être la première diplômée de ma famille",
  "Je rêve de devenir enseignant",
];

/** Compte à rebours du prochain événement (touche 9). Jour exact à préciser. */
export const NEXT_EVENT = {
  title: "Forum d'Entrepreneuriat",
  subtitle: "Badge de bois — 1re édition",
  dateLabel: "Avril 2027 · Dakar",
  date: "2027-04-01T09:00:00Z",
  href: "/projets/forum-entrepreneuriat",
  domainSlug: "yegel",
};

export type PartnerType = "institution" | "technique-financier" | "terrain";

export const PARTNER_TYPES: Record<PartnerType, string> = {
  institution: "Institutions",
  "technique-financier": "Partenaires techniques et financiers",
  terrain: "Partenaires de terrain",
};

/** Liste issue de l'affiche du salon du 15 novembre 2025 — à confirmer par l'association. */
export const PARTNERS: { name: string; type: PartnerType; logo?: string; website?: string }[] = [
  { name: "Ministère chargé de la Famille et des Solidarités", type: "institution" },
  { name: "Commune de Keur Massar Sud", type: "institution" },
  { name: "PASNEEG 2", type: "technique-financier" },
  { name: "Agenzia Italiana per la Cooperazione allo Sviluppo", type: "technique-financier" },
  { name: "Consortium Jeunesse Sénégal", type: "terrain" },
  { name: "Scouts du Sénégal", type: "terrain" },
];

/**
 * Équipe (section 6). Les postes, noms et photos sont à fournir par l'association.
 * Un adjoint se rattache à son titulaire par `parent`. Le site recompose l'arbre tout seul.
 */
export interface Member {
  id: string;
  name: string;
  post: string;
  role: "titulaire" | "adjoint";
  parent?: string;
  domainSlug?: string;
  photo?: string;
  bio?: string;
  quote?: string;
  links?: { whatsapp?: string; linkedin?: string; email?: string };
  order: number;
}

const TBD = "Nom à venir";

export const TEAM: Member[] = [
  { id: "coord", name: TBD, post: "Coordinateur général", role: "titulaire", order: 1 },
  { id: "coord-a1", name: TBD, post: "Coordinateur adjoint", role: "adjoint", parent: "coord", order: 1 },
  { id: "coord-a2", name: TBD, post: "Coordinateur adjoint", role: "adjoint", parent: "coord", order: 2 },
  { id: "sec", name: TBD, post: "Secrétariat", role: "titulaire", order: 2 },
  { id: "sec-a1", name: TBD, post: "Secrétaire adjoint", role: "adjoint", parent: "sec", order: 1 },
  { id: "tres", name: TBD, post: "Trésorerie", role: "titulaire", order: 3 },
  { id: "tres-a1", name: TBD, post: "Trésorier adjoint", role: "adjoint", parent: "tres", order: 1 },
  { id: "com", name: TBD, post: "Communication", role: "titulaire", order: 4 },
  { id: "com-a1", name: TBD, post: "Adjoint communication", role: "adjoint", parent: "com", order: 1 },
  { id: "com-a2", name: TBD, post: "Adjoint communication", role: "adjoint", parent: "com", order: 2 },

  { id: "yoonal", name: TBD, post: "Responsable Yoonal", role: "titulaire", domainSlug: "yoonal", order: 10 },
  { id: "yoonal-a1", name: TBD, post: "Adjoint", role: "adjoint", parent: "yoonal", domainSlug: "yoonal", order: 1 },
  { id: "yoonal-a2", name: TBD, post: "Adjoint", role: "adjoint", parent: "yoonal", domainSlug: "yoonal", order: 2 },
  { id: "yegel", name: TBD, post: "Responsable Yëgël", role: "titulaire", domainSlug: "yegel", order: 11 },
  { id: "yegel-a1", name: TBD, post: "Adjoint", role: "adjoint", parent: "yegel", domainSlug: "yegel", order: 1 },
  { id: "yegel-a2", name: TBD, post: "Adjoint", role: "adjoint", parent: "yegel", domainSlug: "yegel", order: 2 },
  { id: "voix", name: TBD, post: "Responsable La Voix du Leader", role: "titulaire", domainSlug: "la-voix-du-leader", order: 12 },
  { id: "voix-a1", name: TBD, post: "Adjoint", role: "adjoint", parent: "voix", domainSlug: "la-voix-du-leader", order: 1 },
  { id: "voix-a2", name: TBD, post: "Adjoint", role: "adjoint", parent: "voix", domainSlug: "la-voix-du-leader", order: 2 },
  { id: "kaddu", name: TBD, post: "Responsable Kaddu", role: "titulaire", domainSlug: "kaddu", order: 13 },
  { id: "kaddu-a1", name: TBD, post: "Adjoint", role: "adjoint", parent: "kaddu", domainSlug: "kaddu", order: 1 },
  { id: "kaddu-a2", name: TBD, post: "Adjoint", role: "adjoint", parent: "kaddu", domainSlug: "kaddu", order: 2 },
  { id: "sedar", name: TBD, post: "Responsable SËDAR", role: "titulaire", domainSlug: "sedar", order: 14 },
  { id: "sedar-a1", name: TBD, post: "Adjointe", role: "adjoint", parent: "sedar", domainSlug: "sedar", order: 1 },
  { id: "sedar-a2", name: TBD, post: "Adjointe", role: "adjoint", parent: "sedar", domainSlug: "sedar", order: 2 },
];

/** Carte schématique des 14 régions (touche 4) : position sur une grille 5 × 4. */
export const REGIONS: { name: string; col: number; row: number; done?: string[] }[] = [
  { name: "Saint-Louis", col: 2, row: 1 },
  { name: "Louga", col: 3, row: 1 },
  { name: "Matam", col: 4, row: 1 },
  { name: "Dakar", col: 1, row: 2, done: ["Salon d'orientation de Keur Massar (15 novembre 2025)"] },
  { name: "Thiès", col: 2, row: 2 },
  { name: "Diourbel", col: 3, row: 2 },
  { name: "Kaffrine", col: 4, row: 2 },
  { name: "Tambacounda", col: 5, row: 2 },
  { name: "Fatick", col: 2, row: 3 },
  { name: "Kaolack", col: 3, row: 3 },
  { name: "Kédougou", col: 5, row: 3 },
  { name: "Ziguinchor", col: 1, row: 4 },
  { name: "Sédhiou", col: 2, row: 4 },
  { name: "Kolda", col: 3, row: 4 },
];

/** Projets prévus par région. Next Step Inside couvre les 14 régions. */
export const REGION_PROJECTS: Record<string, string[]> = {
  Dakar: ["next-step-inside", "forum-entrepreneuriat"],
};
export const DEFAULT_REGION_PROJECTS = ["next-step-inside"];
