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
  domainSlug: string;
  gallery: string[];
  testimonials: Testimonial[];
  relatedSlugs: string[];
  participants?: string;
  impact?: string;
}

export const PROJECTS: ProjectData[] = [
  {
    slug: "forum-national-jeunes-entrepreneurs",
    title: "Forum National des Jeunes Entrepreneurs",
    category: "Événement",
    status: "Inscriptions ouvertes",
    tagline: "Le plus grand rendez-vous entrepreneurial de la jeunesse sénégalaise",
    description:
      "Le plus grand rassemblement annuel de jeunes entrepreneurs du Sénégal. Pitchs, networking, mentorat.",
    longDescription:
      "Le Forum National des Jeunes Entrepreneurs est l'événement phare de Next Step. Chaque année, des centaines de jeunes entrepreneurs, investisseurs, mentors et décideurs se réunissent pour trois jours d'échanges intenses, de compétitions de pitch, de masterclasses et de networking. Le forum est un tremplin pour les startups et une plateforme de visibilité pour la jeunesse entrepreneuriale sénégalaise. Il attire des speakers nationaux et internationaux, des médias et des partenaires institutionnels engagés dans le soutien à l'entrepreneuriat jeune.",
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
    domainSlug: "entrepreneuriat",
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
        text: "J'ai pitché devant 500 personnes, remporté le prix du meilleur pitch tech et signé un partenariat stratégique. Le FNJE est un accélérateur hors norme.",
      },
      {
        name: "Fatou Seck",
        role: "Entrepreneur & Alumni NS",
        text: "Ce que j'aime dans ce forum, c'est l'énergie collective. Voir des centaines de jeunes ambitieux réunis pour créer, innover et collaborer — c'est électrisant.",
      },
    ],
    relatedSlugs: ["incubateur-next-step", "conferences-inspiration"],
    participants: "1500+",
    impact: "12 startups financées directement suite au forum, plus de 3 milliards FCFA de deals initiés.",
  },
  {
    slug: "leadership-academy",
    title: "Leadership Academy NS",
    category: "Formation",
    status: "En cours",
    tagline: "Forge tes compétences, forge ton impact",
    description:
      "Programme intensif de 3 mois pour former la prochaine génération de leaders africains.",
    longDescription:
      "La Leadership Academy est un programme de transformation personnelle et professionnelle pour les jeunes à fort potentiel. Pendant 3 mois, les participants vivent une expérience immersive combinant ateliers de leadership, études de cas, missions de terrain, mentorat individuel et rencontres avec des leaders inspirants. Le programme est conçu pour développer une vision claire, une capacité à mobiliser les équipes et une résilience face aux défis. Chaque promotion est constituée de 30 participants soigneusement sélectionnés, garantissant un apprentissage de qualité et des liens forts au sein de la promotion.",
    objectives: [
      "Développer le leadership personnel et la vision stratégique",
      "Renforcer les capacités de gestion d'équipe et de prise de décision",
      "Construire un réseau solide de leaders engagés",
      "Former à la communication impactante et à l'influence positive",
      "Ancrer un leadership éthique et responsable",
    ],
    date: "Janvier – Mars 2025 (Promotion 9)",
    location: "Dakar & régions du Sénégal",
    color: "#12A89D",
    statusColor: "#12A89D",
    gradient: "from-[#12A89D]/30 via-[#005F5A]/20 to-[#182426]",
    icon: "🎓",
    domainSlug: "leadership",
    gallery: [],
    testimonials: [
      {
        name: "Ibrahima Fall",
        role: "Directeur Régional, Banque de l'Habitat",
        text: "La Leadership Academy m'a donné les outils pour passer de manager à vrai leader. Ma façon de gérer les équipes, de communiquer et de décider a fondamentalement changé.",
      },
      {
        name: "Mariama Ba",
        role: "Responsable RSE, Groupe Sonatel",
        text: "Trois mois qui valent dix ans d'expérience professionnelle. L'intensité du programme, la qualité des intervenants et la force du groupe — une expérience hors norme.",
      },
      {
        name: "Cheikh Tidiane Mbaye",
        role: "Fondateur, Impact Sénégal",
        text: "Ce programme m'a réconcilié avec ma mission de vie. J'ai quitté un poste confortable pour créer mon ONG. Six mois plus tard, nous avons impacté 2 000 personnes.",
      },
    ],
    relatedSlugs: ["forum-national-jeunes-entrepreneurs", "conferences-inspiration"],
    participants: "30 par promotion",
    impact: "8 promotions formées, 240 leaders diplômés, présents dans 32 pays.",
  },
  {
    slug: "action-verte-senegal",
    title: "Action Verte Sénégal",
    category: "Environnement",
    status: "Accompli",
    tagline: "Planter aujourd'hui pour un Sénégal vert demain",
    description:
      "Initiative de reboisement et de sensibilisation environnementale mobilisant des milliers de jeunes.",
    longDescription:
      "Action Verte Sénégal est l'initiative environnementale phare de Next Step. Lancée en réponse à la déforestation croissante et aux effets du changement climatique au Sénégal, cette initiative a mobilisé des milliers de jeunes volontaires pour des campagnes de reboisement à travers tout le pays. Au-delà de la plantation d'arbres, Action Verte Sénégal forme les communautés à l'entretien des espaces verts, à la gestion durable des terres et à l'agro-foresterie. Le projet a reçu le soutien du Ministère de l'Environnement et de plusieurs organisations internationales.",
    objectives: [
      "Planter 150 000 arbres dans les zones les plus touchées par la désertification",
      "Former 500 jeunes éco-volontaires aux techniques de reboisement",
      "Sensibiliser 50 000 personnes aux enjeux environnementaux",
      "Créer des partenariats avec les communautés rurales",
      "Documenter et mesurer l'impact écologique du projet",
    ],
    date: "2022 – 2024",
    location: "Dakar, Thiès, Kaolack, Saint-Louis, Ziguinchor",
    color: "#0A7F78",
    statusColor: "#0A7F78",
    gradient: "from-[#005F5A]/40 via-[#0A7F78]/20 to-[#182426]",
    icon: "🌳",
    domainSlug: "environnement",
    gallery: [],
    testimonials: [
      {
        name: "Rokhaya Diop",
        role: "Éco-volontaire, Saint-Louis",
        text: "J'ai planté mes premiers arbres à Saint-Louis avec Action Verte. Aujourd'hui, ces arbres poussent et notre quartier est plus frais. Je suis fière d'avoir participé.",
      },
      {
        name: "Dr. Moussa Camara",
        role: "Expert environnement, UCAD",
        text: "Action Verte Sénégal est un modèle de mobilisation citoyenne. La rigueur scientifique combinée à l'énergie des jeunes a produit des résultats vraiment impressionnants.",
      },
      {
        name: "Aïssatou Niang",
        role: "Coordinatrice régionale, Kaolack",
        text: "En 18 mois, notre équipe a planté 25 000 arbres à Kaolack. Les communautés locales ont été impliquées dès le départ, ce qui garantit que les arbres survivent.",
      },
    ],
    relatedSlugs: ["forum-national-jeunes-entrepreneurs", "digital-senegal-2030"],
    participants: "5000+",
    impact: "150 000 arbres plantés, 12 régions couvertes, 5 000 volontaires mobilisés.",
  },
  {
    slug: "digital-senegal-2030",
    title: "Digital Senegal 2030",
    category: "Technologie",
    status: "En cours",
    tagline: "Coder l'avenir numérique du Sénégal",
    description:
      "Formation aux compétences numériques — IA, développement web, cybersécurité — pour la jeunesse.",
    longDescription:
      "Digital Senegal 2030 est le programme le plus ambitieux de Next Step dans le domaine technologique. Face à la révolution numérique qui transforme l'économie mondiale, ce programme forme massivement les jeunes sénégalais aux compétences du futur : développement web et mobile, intelligence artificielle, data science, cybersécurité et entrepreneuriat numérique. Le programme est structuré en plusieurs niveaux, de l'initiation à la spécialisation avancée, permettant à chaque participant de progresser à son rythme. Des partenariats avec des entreprises tech permettent des stages et des opportunités d'embauche directe.",
    objectives: [
      "Former 10 000 jeunes aux compétences numériques d'ici 2030",
      "Certifier des développeurs compétitifs à l'échelle internationale",
      "Créer 500 emplois dans le secteur tech au Sénégal",
      "Développer un écosystème startup tech local robuste",
      "Positionner le Sénégal comme hub tech africain",
    ],
    date: "2023 – 2030",
    location: "Dakar & en ligne (tout le Sénégal)",
    color: "#12A89D",
    statusColor: "#12A89D",
    gradient: "from-[#0A7F78]/30 via-[#12A89D]/20 to-[#182426]",
    icon: "💻",
    domainSlug: "technologie",
    gallery: [],
    testimonials: [
      {
        name: "Pape Demba Sarr",
        role: "Développeur Full-Stack, Dakar",
        text: "Grâce à Digital Senegal, je suis passé de comptable à développeur en 6 mois. Aujourd'hui, je travaille pour une startup tech et je gagne 3 fois mon ancien salaire.",
      },
      {
        name: "Ndéye Fatou Diagne",
        role: "Data Scientist, AfriData",
        text: "Le programme m'a donné des bases solides en IA et data science. J'ai créé ma startup 4 mois après la fin de ma formation. Le soutien du réseau NS est précieux.",
      },
      {
        name: "Mor Talla Gueye",
        role: "Expert cybersécurité",
        text: "La qualité des formateurs et la rigueur du programme m'ont permis d'obtenir des certifications internationales. Digital Senegal, c'est du concret.",
      },
    ],
    relatedSlugs: ["incubateur-next-step", "leadership-academy"],
    participants: "2500+",
    impact: "75% d'insertion professionnelle, 180 développeurs certifiés, 40 startups tech créées.",
  },
  {
    slug: "incubateur-next-step",
    title: "Incubateur Next Step",
    category: "Entrepreneuriat",
    status: "Candidatures ouvertes",
    tagline: "De l'idée à l'entreprise en 6 mois",
    description:
      "Accompagnement sur 6 mois pour les startups fondées par des jeunes : coaching, financement, réseau.",
    longDescription:
      "L'Incubateur Next Step est le programme d'accompagnement intensif pour transformer les meilleures idées en entreprises viables. Pendant 6 mois, les startups sélectionnées bénéficient d'un accompagnement complet : coaching individuel hebdomadaire, ateliers collectifs, accès à un espace de travail, mise en relation avec des investisseurs et partenaires, participation à des compétitions internationales. Chaque promotion accueille 15 startups soigneusement sélectionnées pour leur potentiel et l'engagement de leurs fondateurs. Le programme se conclut par un Demo Day devant plus de 200 investisseurs et décideurs.",
    objectives: [
      "Accompagner 15 startups prometteuses par promotion",
      "Faciliter l'accès à des financements entre 5 et 50 millions FCFA",
      "Connecter les startups à des mentors experts de leur secteur",
      "Préparer les fondateurs à la levée de fonds",
      "Créer une communauté d'entraide entre alumni fondateurs",
    ],
    date: "Prochain démarrage : Septembre 2025",
    location: "Dakar, Silicon Falaise (Hub Next Step)",
    color: "#D9A657",
    statusColor: "#D9A657",
    gradient: "from-[#D9A657]/25 via-[#005F5A]/20 to-[#182426]",
    icon: "🚀",
    domainSlug: "entrepreneuriat",
    gallery: [],
    testimonials: [
      {
        name: "Khadidiatou Sy",
        role: "CEO, MedTech Sénégal",
        text: "L'incubateur Next Step m'a donné bien plus qu'un accompagnement : une famille entrepreneuriale. Grâce au réseau NS, j'ai levé 20 millions FCFA auprès d'investisseurs locaux.",
      },
      {
        name: "Babacar Ndiaye",
        role: "Fondateur, EduMobile",
        text: "En 6 mois, j'ai transformé une idée sur papier en une application utilisée par 5 000 élèves. Le coaching individualisé fait toute la différence.",
      },
      {
        name: "Sokhna Diallo",
        role: "CEO, GreenPack Africa",
        text: "Le Demo Day a été le tournant de mon parcours entrepreneurial. J'ai rencontré mon associé, mon premier client B2B et mon investisseur le même jour.",
      },
    ],
    relatedSlugs: ["forum-national-jeunes-entrepreneurs", "digital-senegal-2030"],
    participants: "15 startups / promotion",
    impact: "12 promotions, 180 startups accompagnées, 85% encore actives après 2 ans.",
  },
  {
    slug: "conferences-inspiration",
    title: "Conférences Inspiration",
    category: "Événement",
    status: "Permanent",
    tagline: "Des paroles qui allument des vocations",
    description:
      "Série de conférences mensuelles avec des leaders africains et internationaux pour inspirer la jeunesse.",
    longDescription:
      "Les Conférences Inspiration sont un rendez-vous mensuel incontournable pour la jeunesse sénégalaise en quête d'inspiration et de guidance. Chaque mois, Next Step invite un leader africain ou international — entrepreneur, artiste, scientifique, activiste — pour partager son parcours, ses défis et ses leçons de vie. Ces conférences sont conçues pour briser le plafond de verre et montrer aux jeunes que le succès est possible, quelle que soit l'origine. Diffusées en live et archivées en ligne, elles touchent des dizaines de milliers de personnes au-delà des murs de la salle.",
    objectives: [
      "Inspirer par des témoignages authentiques de réussite africaine",
      "Créer des moments de connexion entre speakers et audience",
      "Diffuser l'inspiration au-delà de Dakar via le digital",
      "Diversifier les profils inspirants (genre, secteur, région)",
      "Constituer une bibliothèque de conférences inspirantes africaines",
    ],
    date: "Chaque premier jeudi du mois",
    location: "Dakar (salle) + Streaming en direct",
    color: "#D9A657",
    statusColor: "#74878B",
    gradient: "from-[#12A89D]/25 via-[#D9A657]/15 to-[#182426]",
    icon: "🎙️",
    domainSlug: "evenementiel",
    gallery: [],
    testimonials: [
      {
        name: "Awa Diop",
        role: "Étudiante en Master, UCAD",
        text: "La conférence de la fondatrice de Marème Tech m'a tellement inspirée que j'ai changé de parcours professionnel. Ces témoignages ont une valeur incroyable.",
      },
      {
        name: "Seydou Coulibaly",
        role: "Lycéen, Saint-Louis",
        text: "Je suis la conférence en streaming depuis Saint-Louis. Voir des gens qui ressemblent à qui je veux être, parler de leur parcours — ça me donne de l'énergie pour mes études.",
      },
      {
        name: "Professeur Alioune Badara Diop",
        role: "Économiste, UADB",
        text: "Ces conférences comblent un vide énorme dans l'écosystème éducatif sénégalais. La qualité des speakers et la profondeur des échanges sont remarquables.",
      },
    ],
    relatedSlugs: ["forum-national-jeunes-entrepreneurs", "leadership-academy"],
    participants: "300 / conférence (+ streaming)",
    impact: "50+ conférences, 200+ speakers, 25 000+ participants cumulés, 98% de satisfaction.",
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getRelatedProjects(slugs: string[]): ProjectData[] {
  return PROJECTS.filter((p) => slugs.includes(p.slug));
}
