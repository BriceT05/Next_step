export type ProjectStatus = "a-venir" | "en-cours" | "termine";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  "a-venir": "À venir",
  "en-cours": "En cours",
  termine: "Terminé",
};

export type ActivityIcon =
  | "camera" | "play" | "book" | "map" | "talk" | "tools" | "trophy" | "handshake"
  | "voice" | "structure" | "stage" | "sprout" | "teacher" | "water" | "family"
  | "school" | "coins" | "network" | "alert" | "heart" | "shield";

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectActivity {
  icon: ActivityIcon;
  title: string;
  text: string;
}

export interface ProjectStep {
  when: string;
  label: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  domainSlug: string;
  /** Rattachement au domaine encore à confirmer par l'association */
  domainToConfirm?: boolean;
  status: ProjectStatus;
  period: string;
  location: string;
  featured: boolean;
  cover: string;
  /** Résumé en deux lignes pour les cartes */
  summary: string;
  facts: ProjectFact[];
  project: string;
  motivation: string;
  objectives: string;
  activities: ProjectActivity[];
  results: string[];
  calendar: ProjectStep[];
  /** Libellé du bouton principal de la page projet */
  applyLabel: string;
}

export const PROJECTS: ProjectData[] = [
  {
    slug: "next-step-inside",
    title: "Next Step Inside",
    subtitle: "Découvrir les métiers et l'entrepreneuriat",
    domainSlug: "yoonal",
    status: "a-venir",
    period: "Programme 2027",
    location: "Les 14 régions du Sénégal",
    featured: true,
    cover: "/bg-students.jpg",
    summary:
      "Une série d'interviews et de mini-documentaires : des professionnels et des entrepreneurs des 14 régions racontent leur métier et leur parcours.",
    facts: [
      { label: "Porteur", value: "Branche Yoonal de Next Step.sn" },
      { label: "Public cible", value: "Élèves et étudiants" },
      { label: "Format", value: "Épisodes longs (30 minutes à 1 heure) et extraits courts" },
      { label: "Lieu", value: "Les 14 régions du Sénégal" },
      { label: "Diffusion", value: "YouTube, Instagram, TikTok et le site de l'association" },
    ],
    project:
      "Next Step Inside est une série d'interviews et de mini-documentaires portée par la branche Yoonal. Nous allons à la rencontre de professionnels et d'entrepreneurs dans les 14 régions du Sénégal, qui racontent leur métier et leur parcours. Les contenus sont produits en format long (30 minutes à 1 heure) et en extraits courts pour les réseaux sociaux, diffusés sur YouTube, Instagram, TikTok et le site de l'association, puis rassemblés dans une bibliothèque de ressources accessible aux élèves et aux étudiants.",
    motivation:
      "Nos trois salons d'orientation, qui ont réuni plus de 1 000 élèves, nous ont montré à quel point les jeunes ont besoin de voir concrètement ce que sont les métiers. Mais un salon ne touche que ceux qui sont présents ce jour-là. Avec Next Step Inside, nous voulons prolonger cette action et la rendre durable, en laissant les jeunes découvrir des parcours réels, près de chez eux, quand ils le souhaitent.",
    objectives:
      "Le projet veut donner aux jeunes une vision concrète des métiers, des parcours professionnels et de l'entrepreneuriat. Il vise à valoriser la diversité des métiers et des parcours locaux, à créer une communauté engagée autour de l'orientation et à constituer une base de contenus éducatifs qui restera utile bien après la fin du projet.",
    activities: [
      { icon: "map", title: "Rencontres dans les 14 régions", text: "Aller à la rencontre de professionnels et d'entrepreneurs, là où ils travaillent." },
      { icon: "camera", title: "Interviews et mini-documentaires", text: "Des épisodes longs, de 30 minutes à 1 heure, pour raconter un métier et un parcours." },
      { icon: "play", title: "Extraits courts", text: "Des formats pensés pour YouTube, Instagram et TikTok." },
      { icon: "book", title: "Bibliothèque de ressources", text: "Tous les contenus rassemblés et accessibles aux élèves et aux étudiants." },
    ],
    results: [
      "Une vision concrète des métiers, des parcours professionnels et de l'entrepreneuriat pour les jeunes.",
      "La diversité des métiers et des parcours locaux mise en valeur.",
      "Une communauté engagée autour de l'orientation.",
      "Une base de contenus éducatifs qui reste utile bien après la fin du projet.",
    ],
    calendar: [
      { when: "Étape 1", label: "Tournages dans les régions" },
      { when: "Étape 2", label: "Diffusion des épisodes et des extraits" },
      { when: "Étape 3", label: "Mise en ligne de la bibliothèque de ressources" },
    ],
    applyLabel: "Proposer un parcours à filmer",
  },
  {
    slug: "forum-entrepreneuriat",
    title: "Forum d'Entrepreneuriat",
    subtitle: "Badge de bois — 1re édition, avril 2027",
    domainSlug: "yegel",
    status: "a-venir",
    period: "Avril 2027",
    location: "Dakar",
    featured: true,
    cover: "/Startup.jpg",
    summary:
      "30 jeunes de 15 à 30 ans formés à l'entrepreneuriat, un pitch devant un jury, puis trois mois de mentorat. Première édition en avril 2027 à Dakar.",
    facts: [
      { label: "Porteur", value: "Scouts du Sénégal, avec l'équipe Next Step.sn" },
      { label: "Public cible", value: "30 jeunes de 15 à 30 ans, scouts et non-scouts, dont au moins la moitié de jeunes femmes" },
      { label: "Date", value: "Avril 2027 (1re édition), suivie de 3 mois de mentorat" },
      { label: "Lieu", value: "Dakar" },
      { label: "Participation", value: "Gratuite" },
    ],
    project:
      "Le Forum d'Entrepreneuriat est porté par les Scouts du Sénégal, avec l'équipe Next Step.sn. Sa première édition aura lieu en avril 2027 à Dakar et réunira 30 jeunes de 15 à 30 ans, scouts et non-scouts, dont au moins la moitié de jeunes femmes. Le forum se déroule en deux temps : une phase d'inspiration et de formation (conférences, panel, ateliers sur le plan d'affaires, le pitch et la gestion financière), puis une phase de pitch devant un jury. Les participants sont ensuite suivis par un mentorat mensuel pendant trois mois.",
    motivation:
      "Beaucoup de jeunes ont des idées mais manquent d'accès à la formation, au mentorat et au réseau qui permettent de les transformer en activité économique. Le forum veut lever ces obstacles en offrant gratuitement cet accompagnement, pour encourager l'auto-emploi et l'initiative économique chez les jeunes. Il est pensé comme un rendez-vous annuel, reconductible.",
    objectives:
      "Former 30 jeunes aux fondamentaux de l'entrepreneuriat, les amener à élaborer et à pitcher leur projet d'entreprise, et accompagner au moins trois projets vers un financement ou un incubateur (fonds d'appui jeunes comme la DER/FJ, partenaires privés). Le forum doit aussi laisser une base de données des jeunes entrepreneurs scouts et un rapport annuel.",
    activities: [
      { icon: "talk", title: "Inspiration", text: "Conférences et panel avec des entrepreneurs." },
      { icon: "tools", title: "Ateliers pratiques", text: "Plan d'affaires, pitch et gestion financière." },
      { icon: "trophy", title: "Pitch devant un jury", text: "Chaque participant présente son projet d'entreprise." },
      { icon: "handshake", title: "Mentorat", text: "Un suivi mensuel pendant trois mois après le forum." },
    ],
    results: [
      "30 jeunes formés aux fondamentaux de l'entrepreneuriat.",
      "Des projets d'entreprise élaborés et pitchés devant un jury.",
      "Au moins trois projets accompagnés vers un financement ou un incubateur.",
      "Une base de données des jeunes entrepreneurs scouts et un rapport annuel.",
    ],
    calendar: [
      { when: "Avril 2027", label: "Inspiration et formation : conférences, panel, ateliers" },
      { when: "Avril 2027", label: "Pitch devant le jury" },
      { when: "Les 3 mois suivants", label: "Mentorat mensuel des participants" },
    ],
    applyLabel: "Candidater au forum",
  },
  {
    slug: "prise-de-parole-en-public",
    title: "Prise de parole en public et confiance en soi",
    subtitle: "Un cycle de 3 ateliers pratiques",
    domainSlug: "la-voix-du-leader",
    status: "a-venir",
    period: "Cycle annuel",
    location: "Lieu communiqué à l'inscription",
    featured: true,
    cover: "/Soft skill.jpg",
    summary:
      "Trois ateliers 100 % pratiques, animés par un coach, pour vaincre le trac, structurer son discours et réussir son grand oral.",
    facts: [
      { label: "Porteur", value: "Branche Leadership (La Voix du Leader)" },
      { label: "Public cible", value: "20 à 30 jeunes par session" },
      { label: "Durée", value: "3 ateliers d'une demi-journée à une journée chacun" },
      { label: "Rythme", value: "Cycle annuel" },
      { label: "Animation", value: "Un coach" },
    ],
    project:
      "Ce projet de la branche Leadership est un cycle annuel de trois ateliers 100 % pratiques, de une demi-journée à une journée chacun, pour 20 à 30 jeunes par session. Animés par un coach, ils suivent une progression simple : vaincre le trac et poser sa voix, structurer et convaincre, puis le grand oral, avec un passage filmé et une évaluation individuelle.",
    motivation:
      "Savoir prendre la parole est la base du leadership, et pourtant le trac et le manque de confiance freinent beaucoup de jeunes. Notre branche a pour mission de former des leaders responsables et engagés : ce cycle leur donne l'occasion de s'exercer, de se tromper sans risque et de progresser devant un groupe bienveillant.",
    objectives:
      "Réduire le trac, transmettre les techniques de communication orale, apprendre à structurer un discours et développer la confiance en soi. Concrètement, chaque participant prend la parole seul devant le groupe dès le premier atelier, et sa progression doit être visible entre le début et la fin de chaque session.",
    activities: [
      { icon: "voice", title: "Atelier 1 : vaincre le trac", text: "Poser sa voix et prendre la parole seul devant le groupe." },
      { icon: "structure", title: "Atelier 2 : structurer et convaincre", text: "Construire un discours clair et le défendre." },
      { icon: "stage", title: "Atelier 3 : le grand oral", text: "Un passage filmé, suivi d'une évaluation individuelle." },
    ],
    results: [
      "Moins de trac et plus de confiance en soi.",
      "Les techniques de communication orale acquises.",
      "Des discours mieux structurés.",
      "Une progression visible entre le début et la fin de chaque session.",
    ],
    calendar: [
      { when: "Atelier 1", label: "Vaincre le trac et poser sa voix" },
      { when: "Atelier 2", label: "Structurer et convaincre" },
      { when: "Atelier 3", label: "Le grand oral, filmé et évalué" },
    ],
    applyLabel: "S'inscrire au cycle",
  },
  {
    slug: "naan-yaram",
    title: "Ñaan Yaram",
    subtitle: "« Semer aujourd'hui, construire demain »",
    domainSlug: "kaddu",
    status: "a-venir",
    period: "Phase pilote de 12 mois",
    location: "Écoles primaires",
    featured: true,
    cover: "/Agriculture verte.jpg",
    summary:
      "Des tables de micro-jardinage dans des écoles primaires : les enseignants sont formés, puis les élèves sèment, entretiennent et récoltent.",
    facts: [
      { label: "Porteur", value: "Branche Kaddu de Next Step.sn" },
      { label: "Public cible", value: "Garçons des écoles primaires et leurs enseignants" },
      { label: "Durée", value: "Phase pilote de 12 mois" },
      { label: "Lieu", value: "Écoles primaires" },
    ],
    project:
      "Ñaan Yaram installe des tables de micro-jardinage dans des écoles primaires pour initier les garçons à l'agriculture. Les enseignants sont formés, puis les élèves assurent eux-mêmes les semis, l'entretien et la récolte au fil des mois. Le projet comprend aussi des activités sur l'eau, l'environnement et le recyclage, et se termine par des journées de démonstration avec les familles. Il démarre par une phase pilote de 12 mois.",
    motivation:
      "La branche Kaddu mobilise la jeunesse autour de causes locales. Ici, l'idée est de semer tôt, à l'école, le goût de la terre, le respect de l'environnement et les premières notions d'entrepreneuriat. Les enfants d'aujourd'hui sont les adultes de demain : c'est le sens du titre du projet. Le pilote permet de tester l'approche avant de l'étendre.",
    objectives:
      "Initier les garçons du primaire au micro-jardinage et à l'agriculture, doter les écoles d'espaces de culture pédagogiques fonctionnels et former des enseignants capables d'accompagner le jardinage scolaire. À la fin du pilote, le modèle sera documenté dans un guide pédagogique, pour pouvoir être reproduit dans d'autres écoles.",
    activities: [
      { icon: "school", title: "Tables de micro-jardinage", text: "Installation d'espaces de culture dans les écoles primaires." },
      { icon: "teacher", title: "Formation des enseignants", text: "Pour qu'ils accompagnent le jardinage scolaire." },
      { icon: "sprout", title: "Semis, entretien, récolte", text: "Assurés par les élèves eux-mêmes, au fil des mois." },
      { icon: "water", title: "Eau, environnement, recyclage", text: "Des activités de sensibilisation tout au long du projet." },
      { icon: "family", title: "Journées de démonstration", text: "Avec les familles, pour clôturer le pilote." },
    ],
    results: [
      "Des garçons du primaire initiés au micro-jardinage et à l'agriculture.",
      "Des écoles dotées d'espaces de culture pédagogiques fonctionnels.",
      "Des enseignants formés, capables d'accompagner le jardinage scolaire.",
      "Un guide pédagogique pour reproduire le modèle dans d'autres écoles.",
    ],
    calendar: [
      { when: "Début du pilote", label: "Installation des tables et formation des enseignants" },
      { when: "Au fil des 12 mois", label: "Semis, entretien et récoltes par les élèves ; activités eau, environnement et recyclage" },
      { when: "Fin du pilote", label: "Journées de démonstration avec les familles et guide pédagogique" },
    ],
    applyLabel: "Proposer mon école",
  },
  {
    slug: "leadership-feminin-et-autonomisation",
    title: "Leadership Féminin et Autonomisation",
    subtitle: "Formation, mentorat et microfinancement",
    domainSlug: "sedar",
    status: "a-venir",
    period: "12 mois par cohorte",
    location: "Sénégal",
    featured: true,
    cover: "/business.jpg",
    summary:
      "Un programme de 12 mois pour des femmes de 18 à 45 ans : formation, mentorat individualisé et microfinancement par un fonds rotatif.",
    facts: [
      { label: "Porteur", value: "Branche SËDAR de Next Step.sn" },
      { label: "Public cible", value: "Femmes de 18 à 45 ans, porteuses d'un projet ou d'une activité économique, ou désireuses de développer leur leadership" },
      { label: "Durée", value: "12 mois par cohorte, puis un suivi après financement" },
      { label: "Mentorat", value: "Individualisé, de 6 à 12 mois" },
      { label: "Financement", value: "Microfinancement par un fonds rotatif" },
    ],
    project:
      "Ce programme accompagne des femmes de 18 à 45 ans, porteuses d'un projet ou d'une activité économique, ou désireuses de développer leur leadership. Il repose sur trois piliers : une formation (leadership, gestion de projet et financière, entrepreneuriat, gouvernance, outils numériques), un mentorat individualisé de 6 à 12 mois et un microfinancement par un fonds rotatif. Il dure 12 mois par cohorte et se prolonge par un suivi après financement.",
    motivation:
      "L'autonomie d'une femme est à la fois économique et sociale. Une formation sans financement, ou un financement sans accompagnement, a peu de chances de durer. SËDAR combine donc les trois : apprendre, être accompagnée, puis pouvoir investir, au sein d'un réseau de femmes qui se soutiennent.",
    objectives:
      "Renforcer le leadership et l'autonomisation économique et sociale des femmes. Les objectifs sont de couvrir 100 % des bénéficiaires par le mentorat, de financer leurs plans d'affaires avec un taux de remboursement du fonds rotatif d'au moins 80 %, et de constituer un réseau de femmes leaders capable de s'auto-soutenir.",
    activities: [
      { icon: "book", title: "Formation", text: "Leadership, gestion de projet et financière, entrepreneuriat, gouvernance, outils numériques." },
      { icon: "handshake", title: "Mentorat individualisé", text: "Un accompagnement personnel de 6 à 12 mois." },
      { icon: "coins", title: "Microfinancement", text: "Le financement des plans d'affaires par un fonds rotatif." },
      { icon: "network", title: "Réseau de femmes leaders", text: "Un réseau qui se soutient, avec un suivi après financement." },
    ],
    results: [
      "100 % des bénéficiaires couvertes par le mentorat.",
      "Des plans d'affaires financés par le fonds rotatif.",
      "Un taux de remboursement du fonds rotatif d'au moins 80 %.",
      "Un réseau de femmes leaders capable de s'auto-soutenir.",
    ],
    calendar: [
      { when: "Pilier 1", label: "Formation de la cohorte" },
      { when: "Pilier 2", label: "Mentorat individualisé, de 6 à 12 mois" },
      { when: "Pilier 3", label: "Microfinancement par le fonds rotatif" },
      { when: "Après les 12 mois", label: "Suivi après financement" },
    ],
    applyLabel: "Candidater au programme",
  },
  {
    slug: "secourisme-pour-les-asc",
    title: "Secourisme pour les ASC",
    subtitle: "Des gestes qui sauvent au cœur des quartiers",
    domainSlug: "kaddu",
    domainToConfirm: true,
    status: "a-venir",
    period: "Sessions pratiques",
    location: "Dans les quartiers, auprès des ASC",
    featured: true,
    cover: "/domain-engagement.jpg",
    summary:
      "Former les membres des ASC aux gestes de premiers secours, pour qu'elles deviennent des relais dans leur quartier.",
    facts: [
      { label: "Porteur", value: "Next Step.sn" },
      { label: "Public cible", value: "Membres des ASC (Associations Sportives et Culturelles)" },
      { label: "Format", value: "Sessions pratiques" },
      { label: "Lieu", value: "Dans les quartiers, auprès des ASC" },
    ],
    project:
      "Ce projet forme les membres des ASC (Associations Sportives et Culturelles) aux gestes de premiers secours. Par des sessions pratiques, les participants apprennent à alerter les secours, à protéger une victime et à réagir face aux situations les plus courantes : malaise, hémorragie, étouffement, brûlure, blessure sportive ou arrêt cardiaque. Comme les ASC ont des activités régulières (entraînements, matchs, tournois, événements culturels), elles deviennent des relais de premiers secours dans leur quartier.",
    motivation:
      "Les ASC rassemblent chaque semaine de nombreux jeunes, sur les terrains comme lors des tournois et des événements. Un accident ou un malaise peut survenir à tout moment, et les premières minutes sont décisives, souvent avant l'arrivée des secours. Tous les membres ne savent pas forcément quoi faire dans ces moments-là. Former ceux qui sont déjà sur place permet de réagir vite et de sauver des vies. Le projet s'inscrit dans l'engagement de Next Step.sn auprès de la jeunesse et des communautés locales.",
    objectives:
      "Faire acquérir aux membres des ASC les gestes de base du secourisme et la confiance nécessaire pour les appliquer. Le projet vise à ce qu'au moins une personne formée soit présente lors des activités de chaque ASC, à sensibiliser les jeunes à la prévention des accidents et à constituer un réseau de jeunes secouristes dans les quartiers.",
    activities: [
      { icon: "alert", title: "Alerter les secours", text: "Savoir qui appeler et quoi dire." },
      { icon: "shield", title: "Protéger une victime", text: "Sécuriser les lieux et la personne." },
      { icon: "heart", title: "Réagir aux situations courantes", text: "Malaise, hémorragie, étouffement, brûlure, blessure sportive, arrêt cardiaque." },
      { icon: "network", title: "Relais dans les quartiers", text: "Un réseau de jeunes secouristes au sein des ASC." },
    ],
    results: [
      "Des membres d'ASC qui maîtrisent les gestes de base du secourisme.",
      "Au moins une personne formée présente lors des activités de chaque ASC.",
      "Des jeunes sensibilisés à la prévention des accidents.",
      "Un réseau de jeunes secouristes dans les quartiers.",
    ],
    calendar: [
      { when: "Étape 1", label: "Sessions pratiques avec les ASC" },
      { when: "Étape 2", label: "Présence de secouristes formés lors des activités des ASC" },
      { when: "Étape 3", label: "Constitution du réseau de jeunes secouristes" },
    ],
    applyLabel: "Inscrire mon ASC",
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByDomain(domainSlug: string): ProjectData[] {
  return PROJECTS.filter((p) => p.domainSlug === domainSlug);
}
