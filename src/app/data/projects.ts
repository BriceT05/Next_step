export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  status: string;
  tagline: string;
  description: string;
  longDescription: string;
  objectives: string[];
  date: string;
  location: string;
  color: string;
  statusColor: string;
  gradient: string;
  icon: string;
  bg: string;
  domainSlug: string;
  gallery: string[];
  testimonials: Testimonial[];
  relatedSlugs: string[];
  participants?: string;
  impact?: string;
}

export const PROJECTS: ProjectData[] = [
  {
    slug: "forum-national-entrepreneurs",
    title: "Forum National des Entrepreneurs",
    category: "Événement",
    status: "Inscriptions ouvertes",
    tagline: "Le plus grand rendez-vous entrepreneurial de la jeunesse sénégalaise",
    description:
      "Grand rassemblement annuel d'entrepreneurs, d'investisseurs et de mentors pour 3 jours de pitchs, de networking et de masterclasses.",
    longDescription:
      "Le Forum National des Entrepreneurs est l'événement phare de Next Step. Chaque année, des centaines de jeunes entrepreneurs, investisseurs, mentors et décideurs se réunissent pour trois jours d'échanges intenses, de compétitions de pitch, de masterclasses et de networking. Le forum est un tremplin pour les startups et une plateforme de visibilité pour la jeunesse entrepreneuriale sénégalaise. Il attire des speakers nationaux et internationaux, des médias et des partenaires institutionnels engagés dans le soutien à l'entrepreneuriat jeune.",
    objectives: [
      "Rassembler l'écosystème entrepreneurial sénégalais en un lieu",
      "Offrir une plateforme de pitch devant des investisseurs réels",
      "Créer des opportunités de mentorat avec des experts",
      "Célébrer et récompenser les meilleures initiatives jeunes",
      "Renforcer les partenariats public-privé pour l'entrepreneuriat",
    ],
    date: "Juillet 2025",
    location: "Dakar, Centre de Conférences Abdou Diouf",
    color: "#D9A657",
    statusColor: "#D9A657",
    gradient: "from-[#D9A657]/30 via-[#0A7F78]/20 to-[#182426]",
    icon: "🏟️",
    bg: "/domain-evenementiel.jpg",
    domainSlug: "entrepreneuriat-innovation",
    gallery: [],
    testimonials: [
      {
        name: "Aminata Diallo",
        role: "Fondatrice, AgroTech Sénégal",
        text: "Le forum m'a permis de rencontrer mon premier investisseur. Six mois après, ma startup était financée et en pleine croissance. Next Step a changé ma vie.",
      },
      {
        name: "Ousmane Ndiaye",
        role: "CEO, FinTech Africa",
        text: "J'ai pitché devant 500 personnes, remporté le prix du meilleur pitch tech et signé un partenariat stratégique. Le forum est un accélérateur hors norme.",
      },
      {
        name: "Fatou Seck",
        role: "Entrepreneur & Alumni NS",
        text: "Ce que j'aime dans ce forum, c'est l'énergie collective. Voir des centaines de jeunes ambitieux réunis pour créer, innover et collaborer — c'est électrisant.",
      },
    ],
    relatedSlugs: ["conference-startup", "interview-entrepreneur"],
    participants: "1500+",
    impact: "12 startups financées directement suite au forum, plus de 3 milliards FCFA de deals initiés.",
  },
  {
    slug: "un-jeune-un-permis",
    title: "Un Jeune Un Permis",
    category: "Formation",
    status: "En cours",
    tagline: "Ouvrir l'accès au permis de conduire aux jeunes sénégalais",
    description:
      "Initiative pour faciliter l'accès au permis de conduire aux jeunes à revenus modestes, favorisant leur mobilité et leur employabilité.",
    longDescription:
      "Le projet 'Un Jeune Un Permis' est une initiative sociale innovante de Next Step visant à briser l'une des barrières les plus concrètes à l'insertion professionnelle des jeunes au Sénégal : l'accès au permis de conduire. Dans de nombreux secteurs (transport, logistique, tourisme, entrepreneuriat), le permis est une condition sine qua non pour accéder à un emploi ou développer une activité. Next Step a mis en place un système de partenariat avec des auto-écoles locales, un fonds de solidarité et un accompagnement personnalisé pour permettre à des dizaines de jeunes par an de franchir cette étape cruciale.",
    objectives: [
      "Faciliter l'accès au permis de conduire pour 200 jeunes par an",
      "Réduire les inégalités d'accès à l'emploi liées à la mobilité",
      "Créer des partenariats durables avec les auto-écoles locales",
      "Accompagner les bénéficiaires vers l'emploi post-permis",
      "Développer un fonds de solidarité pérenne pour financer la formation",
    ],
    date: "2024 – 2026",
    location: "Dakar, Thiès, Saint-Louis",
    color: "#12A89D",
    statusColor: "#12A89D",
    gradient: "from-[#12A89D]/30 via-[#005F5A]/20 to-[#182426]",
    icon: "🚗",
    bg: "/bg-boat.jpg",
    domainSlug: "formation-leadership",
    gallery: [],
    testimonials: [
      {
        name: "Ibrahima Diallo",
        role: "Chauffeur, Dakar Dem Dikk",
        text: "Grâce à Next Step, j'ai pu passer mon permis sans dépenser un centime. Aujourd'hui j'ai un emploi stable et je subviens aux besoins de ma famille.",
      },
      {
        name: "Mariama Sarr",
        role: "Auto-entrepreneuse, Thiès",
        text: "Le permis m'a permis de créer mon service de livraison à domicile. Un an après, j'emploie deux personnes et mon activité tourne bien.",
      },
      {
        name: "Cheikh Mbacké",
        role: "Bénéficiaire, Saint-Louis",
        text: "Ce projet, c'est de la dignité rendue aux jeunes. Ne pas avoir le permis, c'était me sentir exclu du marché du travail. Aujourd'hui, je travaille fier.",
      },
    ],
    relatedSlugs: ["forum-national-entrepreneurs", "site-tutorat-etutorat"],
    participants: "200+",
    impact: "200 jeunes accompagnés, 85% ont trouvé un emploi ou créé une activité dans les 3 mois.",
  },
  {
    slug: "site-tutorat-etutorat",
    title: "Site de tutorat (e-tutorat)",
    category: "Éducation",
    status: "En cours",
    tagline: "L'éducation de qualité accessible à tous, partout au Sénégal",
    description:
      "Plateforme numérique de tutorat en ligne connectant des tuteurs bénévoles avec des élèves en difficulté à travers tout le Sénégal.",
    longDescription:
      "Le Site de tutorat e-tutorat de Next Step est une plateforme numérique innovante qui démocratise l'accès au soutien scolaire au Sénégal. En connectant des étudiants performants et des professionnels bénévoles avec des élèves en difficulté, la plateforme brise les barrières géographiques et économiques qui limitent l'accès à l'éducation de qualité. Qu'on soit à Dakar, Ziguinchor ou Matam, tout élève peut bénéficier d'un accompagnement personnalisé en mathématiques, français, sciences et bien d'autres matières. La plateforme intègre des sessions de tutorat en temps réel, des ressources pédagogiques et un suivi de la progression.",
    objectives: [
      "Connecter 500 tuteurs bénévoles avec 3 000 élèves par an",
      "Couvrir toutes les régions du Sénégal grâce au digital",
      "Améliorer les résultats scolaires des bénéficiaires",
      "Créer une bibliothèque de ressources pédagogiques en ligne",
      "Former les tuteurs aux méthodes d'enseignement efficaces",
    ],
    date: "2024 – Permanent",
    location: "Tout le Sénégal (en ligne)",
    color: "#D9A657",
    statusColor: "#12A89D",
    gradient: "from-[#D9A657]/25 via-[#12A89D]/15 to-[#182426]",
    icon: "📱",
    bg: "/domain-education.jpg",
    domainSlug: "education",
    gallery: [],
    testimonials: [
      {
        name: "Aïssatou Faye",
        role: "Élève en Terminale, Kaolack",
        text: "Grâce à e-tutorat, j'ai eu accès à des cours de maths de qualité depuis Kaolack. Mon tuteur m'a aidée à passer le bac avec mention. Merci Next Step !",
      },
      {
        name: "Pape Alioune Ndao",
        role: "Tuteur bénévole, Dakar",
        text: "Tutorer à distance, c'est une expérience enrichissante. La plateforme est simple, efficace et les élèves sont vraiment motivés. Je me sens utile.",
      },
      {
        name: "Pr. Rokhaya Diagne",
        role: "Inspectrice de l'éducation, Dakar",
        text: "E-tutorat répond à un besoin urgent. La qualité des ressources et le suivi des élèves sont remarquables. Un modèle à répliquer dans tout le pays.",
      },
    ],
    relatedSlugs: ["un-jeune-un-permis", "forum-national-entrepreneurs"],
    participants: "3000+",
    impact: "78% des élèves accompagnés ont amélioré leurs notes, 120 ressources pédagogiques disponibles.",
  },
  {
    slug: "conference-startup",
    title: "Conférence sur la Startup",
    category: "Événement",
    status: "Récurrent",
    tagline: "La conférence de référence pour les startups africaines",
    description:
      "Conférence annuelle réunissant les meilleurs entrepreneurs, investisseurs et experts de l'écosystème startup africain.",
    longDescription:
      "La Conférence sur la Startup de Next Step est le rendez-vous intellectuel et stratégique de l'entrepreneuriat tech en Afrique de l'Ouest. Chaque édition réunit des fondateurs de startups, des venture capitalists, des experts en innovation et des décideurs institutionnels pour deux jours de panels, de keynotes et de networking d'exception. La conférence aborde les enjeux les plus actuels : financement de l'innovation en Afrique, scale-up des startups locales, impact de l'IA sur l'entrepreneuriat africain, et stratégies de croissance dans des marchés émergents. Un espace démo permet aux startups participantes de présenter leurs produits à un public de qualité.",
    objectives: [
      "Positionner Dakar comme hub de l'innovation en Afrique de l'Ouest",
      "Connecter les startups africaines aux écosystèmes mondiaux",
      "Faciliter les connexions entre startups et investisseurs",
      "Partager les meilleures pratiques de l'entrepreneuriat africain",
      "Inspirer la prochaine génération de fondateurs de startups",
    ],
    date: "Novembre (annuel)",
    location: "Dakar, Sénégal",
    color: "#0A7F78",
    statusColor: "#74878B",
    gradient: "from-[#0A7F78]/30 via-[#12A89D]/20 to-[#182426]",
    icon: "🎙️",
    bg: "/domain-innovation.jpg",
    domainSlug: "entrepreneuriat-innovation",
    gallery: [],
    testimonials: [
      {
        name: "Seydou Ba",
        role: "Fondateur, AgriTech Sahel",
        text: "La Conférence Startup est une expérience unique. J'ai signé un accord de partenariat avec une startup française et levé mes premiers fonds lors de la dernière édition.",
      },
      {
        name: "Ndéye Coumba Diop",
        role: "Directrice, Hub Innovation CTIC",
        text: "C'est la conférence la plus qualitative de la région. Les speakers, les participants et les débats sont tous à un niveau exceptionnel. Un must-attend.",
      },
      {
        name: "Antoine Moreau",
        role: "Partner, AfricaVC Fund",
        text: "Nous venons à Dakar expressément pour cette conférence. La qualité des startups présentées est impressionnante. Le Sénégal a un vrai écosystème.",
      },
    ],
    relatedSlugs: ["forum-national-entrepreneurs", "interview-entrepreneur"],
    participants: "500+",
    impact: "50+ éditions, 200+ speakers invités, 25 000+ participants cumulés.",
  },
  {
    slug: "interview-entrepreneur",
    title: "Interview Entrepreneur",
    category: "Médias",
    status: "Permanent",
    tagline: "Les histoires vraies qui inspirent la jeunesse africaine",
    description:
      "Série de portraits vidéo et interviews approfondies d'entrepreneurs africains qui racontent leur parcours, leurs défis et leurs succès.",
    longDescription:
      "Interview Entrepreneur est le format média phare de Next Step : une série de portraits authentiques et inspirants de jeunes entrepreneurs africains qui partagent leur parcours sans filtre. Chaque épisode plonge dans l'histoire d'un fondateur ou d'une fondatrice : son déclic, ses doutes, ses erreurs, ses succès et sa vision pour l'avenir. Ces interviews sont diffusées sur les réseaux sociaux de Next Step, sur YouTube et via la newsletter, touchant des dizaines de milliers de jeunes à travers le Sénégal et l'Afrique. Le format humanise l'entrepreneuriat et prouve que le succès est possible, quelle que soit l'origine.",
    objectives: [
      "Humaniser l'entrepreneuriat africain par des témoignages authentiques",
      "Inspirer 50 000+ jeunes par an via les médias sociaux",
      "Valoriser les success stories de la diaspora et du continent",
      "Créer une bibliothèque de référence de l'entrepreneuriat africain",
      "Connecter les jeunes entrepreneurs à une communauté inspirante",
    ],
    date: "Chaque mois (depuis 2022)",
    location: "Sénégal & Afrique (en ligne)",
    color: "#D9A657",
    statusColor: "#74878B",
    gradient: "from-[#D9A657]/25 via-[#005F5A]/15 to-[#182426]",
    icon: "🎬",
    bg: "/domain-entrepreneuriat.jpg",
    domainSlug: "entrepreneuriat-innovation",
    gallery: [],
    testimonials: [
      {
        name: "Awa Gueye",
        role: "Étudiante en Master, UCAD",
        text: "Regarder ces interviews, c'est voir que le succès est possible pour quelqu'un qui me ressemble. Chaque épisode me donne l'énergie pour persévérer dans mon projet.",
      },
      {
        name: "Mamadou Lamine Diallo",
        role: "Entrepreneur interviewé, Ziguinchor",
        text: "Partager mon parcours sur Interview Entrepreneur a été un tournant. J'ai reçu des demandes de partenariat et des messages de jeunes inspirés de tout le Sénégal.",
      },
      {
        name: "Sokhna Badji",
        role: "Community Manager, Next Step",
        text: "Ces interviews génèrent notre meilleur engagement sur les réseaux. Les gens partagent massivement parce que ça les touche vraiment. C'est du contenu qui change des vies.",
      },
    ],
    relatedSlugs: ["forum-national-entrepreneurs", "conference-startup"],
    participants: "50 000+ / épisode",
    impact: "36+ épisodes publiés, 50 000+ vues par épisode, communauté de 100 000+ abonnés.",
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getRelatedProjects(slugs: string[]): ProjectData[] {
  return PROJECTS.filter((p) => slugs.includes(p.slug));
}
