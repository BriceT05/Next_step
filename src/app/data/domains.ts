export interface DomainProgram {
  title: string;
  description: string;
  duration?: string;
}

export interface DomainStat {
  value: string;
  label: string;
}

export interface Domain {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  color: string;
  secondaryColor: string;
  gradient: string;
  icon: string;
  bg: string;
  objectives: string[];
  programs: DomainProgram[];
  stats: DomainStat[];
  impact: string;
  relatedProjectSlugs: string[];
}

export const DOMAINS: Domain[] = [
  {
    slug: "entrepreneuriat",
    title: "Entrepreneuriat",
    tagline: "Transformer les idées en impact économique",
    description: "Soutenir la création d'entreprises et l'essor économique des jeunes.",
    longDescription:
      "L'entrepreneuriat est le moteur de la transformation économique africaine. Chez Next Step, nous croyons que chaque jeune porte en lui le potentiel d'un entrepreneur. Nous accompagnons les porteurs de projets à chaque étape : de l'idéation au lancement, du financement à la croissance. Nos programmes combinent mentorat de haut niveau, accès aux réseaux d'affaires et formations pratiques orientées résultats.",
    color: "#D9A657",
    secondaryColor: "#B8862E",
    gradient: "from-[#D9A657]/20 via-[#D9A657]/5 to-transparent",
    icon: "🚀",
    bg: "/domain-entrepreneuriat.jpg",
    objectives: [
      "Accompagner 500 jeunes entrepreneurs par an",
      "Faciliter l'accès au financement et aux investisseurs",
      "Créer un réseau solide d'alumni entrepreneurs",
      "Développer des partenariats avec l'écosystème startup africain",
      "Former aux outils de gestion et au business model canvas",
    ],
    programs: [
      {
        title: "Incubateur Next Step",
        description: "Programme d'incubation de 6 mois pour transformer votre idée en entreprise viable. Coaching individuel, ateliers collectifs et démo day devant des investisseurs.",
        duration: "6 mois",
      },
      {
        title: "Bootcamp Entrepreneur",
        description: "Immersion intensive de 5 jours sur les fondamentaux de l'entrepreneuriat : pitch, business plan, finance, marketing digital.",
        duration: "5 jours",
      },
      {
        title: "Mentorat Pro",
        description: "Mise en relation avec des entrepreneurs expérimentés pour un accompagnement personnalisé sur 3 mois.",
        duration: "3 mois",
      },
    ],
    stats: [
      { value: "200+", label: "Startups accompagnées" },
      { value: "85%", label: "Taux de survie à 2 ans" },
      { value: "1.2Mds", label: "FCFA levés par nos alumni" },
      { value: "850+", label: "Emplois créés" },
    ],
    impact:
      "Nos entrepreneurs ont créé plus de 850 emplois directs et levé collectivement plus d'1,2 milliard de FCFA de financement, contribuant significativement à l'économie sénégalaise.",
    relatedProjectSlugs: ["forum-national-jeunes-entrepreneurs", "incubateur-next-step"],
  },
  {
    slug: "leadership",
    title: "Leadership",
    tagline: "Former les leaders qui changeront l'Afrique",
    description: "Former les leaders visionnaires qui guideront l'Afrique de demain.",
    longDescription:
      "Le leadership est une compétence qui se construit. Dans un contexte africain en pleine mutation, Next Step forme une nouvelle génération de leaders capables d'inspirer, de mobiliser et de transformer. Nos programmes de leadership vont au-delà de la théorie : nous plaçons les jeunes dans des situations réelles de prise de décision, de gestion d'équipe et de résolution de problèmes complexes.",
    color: "#12A89D",
    secondaryColor: "#0A7F78",
    gradient: "from-[#12A89D]/20 via-[#12A89D]/5 to-transparent",
    icon: "⭐",
    bg: "/domain-leadership.jpg",
    objectives: [
      "Développer les compétences en leadership situationnel",
      "Renforcer l'intelligence émotionnelle et la communication",
      "Former à la prise de décision sous pression",
      "Construire des réseaux de leaders engagés",
      "Promouvoir un leadership inclusif et éthique",
    ],
    programs: [
      {
        title: "Leadership Academy NS",
        description: "Programme intensif de 3 mois qui plonge les participants dans des défis réels de leadership. Ateliers, études de cas, simulations et visites de terrain.",
        duration: "3 mois",
      },
      {
        title: "Young Leaders Summit",
        description: "Rassemblement annuel des meilleurs jeunes leaders du Sénégal pour 3 jours d'échanges, de conférences et de réseautage.",
        duration: "3 jours",
      },
      {
        title: "Leadership Circle",
        description: "Groupe de pairs mensuel pour les alumni de la Leadership Academy : partage d'expériences, défis communs et co-développement.",
        duration: "Permanent",
      },
    ],
    stats: [
      { value: "1500+", label: "Leaders formés" },
      { value: "32", label: "Pays représentés" },
      { value: "94%", label: "Recommandent le programme" },
      { value: "8", label: "Promotions diplômées" },
    ],
    impact:
      "Nos alumni occupent des postes de responsabilité dans les secteurs public, privé et associatif. Plusieurs ont été élus aux institutions locales ou dirigent des organisations à fort impact social.",
    relatedProjectSlugs: ["leadership-academy"],
  },
  {
    slug: "innovation",
    title: "Innovation",
    tagline: "Résoudre les défis africains avec créativité",
    description: "Encourager les solutions créatives aux défis africains.",
    longDescription:
      "L'Afrique est un continent de solutions. Chez Next Step, nous croyons que les jeunes africains ont la capacité d'inventer les réponses aux défis de leur continent. Innovation Lab accompagne les porteurs d'idées novatrices de la phase d'idéation au prototype, en utilisant des méthodologies agiles, du design thinking et de l'intelligence artificielle comme outils d'accélération.",
    color: "#D9A657",
    secondaryColor: "#B8862E",
    gradient: "from-[#D9A657]/20 via-[#12A89D]/5 to-transparent",
    icon: "💡",
    bg: "/domain-innovation.jpg",
    objectives: [
      "Stimuler la créativité et la pensée design",
      "Développer des solutions innovantes aux problèmes locaux",
      "Former aux méthodologies agiles et au design thinking",
      "Créer des ponts entre innovation technologique et social",
      "Connecter les innovateurs aux ressources et mentors",
    ],
    programs: [
      {
        title: "Innovation Lab",
        description: "Espace d'expérimentation et de prototypage rapide. Accès à du matériel, des mentors tech et un réseau d'experts pour tester vos idées.",
        duration: "Permanent",
      },
      {
        title: "Hackathon Next Step",
        description: "48h pour résoudre des défis réels proposés par des entreprises et organisations partenaires. Prix et opportunités d'accélération à la clé.",
        duration: "48 heures",
      },
      {
        title: "Design Thinking Workshop",
        description: "Formation intensive à la méthodologie design thinking appliquée aux enjeux africains. Empathie, définition, idéation, prototypage, test.",
        duration: "2 jours",
      },
    ],
    stats: [
      { value: "45+", label: "Solutions prototypées" },
      { value: "12", label: "Hackathons organisés" },
      { value: "320+", label: "Innovateurs formés" },
      { value: "15", label: "Solutions déployées" },
    ],
    impact:
      "15 solutions innovantes issues de nos programmes sont aujourd'hui déployées sur le terrain, touchant des domaines allant de l'agriculture intelligente à la santé mobile.",
    relatedProjectSlugs: ["digital-senegal-2030"],
  },
  {
    slug: "education",
    title: "Éducation",
    tagline: "Le savoir comme premier levier d'émancipation",
    description: "Promouvoir l'apprentissage continu et l'accès au savoir pour tous.",
    longDescription:
      "L'éducation est le fondement de tout changement durable. Next Step s'engage à rendre le savoir accessible à tous les jeunes, indépendamment de leur origine ou situation. Nos programmes éducatifs couvrent les compétences du 21e siècle : esprit critique, communication, collaboration et créativité, en complément des formations académiques traditionnelles.",
    color: "#12A89D",
    secondaryColor: "#0A7F78",
    gradient: "from-[#12A89D]/20 via-[#0A7F78]/5 to-transparent",
    icon: "📚",
    bg: "/domain-education.jpg",
    objectives: [
      "Démocratiser l'accès à une éducation de qualité",
      "Développer les compétences transversales du 21e siècle",
      "Créer des ressources pédagogiques adaptées au contexte africain",
      "Former des jeunes à l'apprentissage autonome",
      "Soutenir les jeunes en décrochage scolaire",
    ],
    programs: [
      {
        title: "Bibliothèque Numérique NS",
        description: "Plateforme d'apprentissage en ligne avec des centaines de cours, tutoriels et ressources en français et langues locales.",
        duration: "Permanent",
      },
      {
        title: "Tutorat Pair-à-Pair",
        description: "Mise en relation d'étudiants performants avec des élèves en difficulté pour un soutien scolaire bénévole et de proximité.",
        duration: "Année scolaire",
      },
      {
        title: "Conférences Académiques",
        description: "Rencontres entre le monde universitaire et professionnel pour préparer les jeunes aux réalités du marché de l'emploi.",
        duration: "Mensuel",
      },
    ],
    stats: [
      { value: "3000+", label: "Bénéficiaires directs" },
      { value: "120+", label: "Ressources pédagogiques" },
      { value: "25", label: "Établissements partenaires" },
      { value: "78%", label: "Amélioration des résultats" },
    ],
    impact:
      "Nos programmes éducatifs ont permis à 78% des participants d'améliorer significativement leurs résultats académiques et leur orientation professionnelle.",
    relatedProjectSlugs: ["leadership-academy", "conferences-inspiration"],
  },
  {
    slug: "environnement",
    title: "Environnement",
    tagline: "Agir maintenant pour un Sénégal vert",
    description: "Agir concrètement pour un développement durable et écologique.",
    longDescription:
      "Les défis environnementaux sont existentiels pour l'Afrique. Sécheresse, déforestation, pollution marine, changement climatique : Next Step mobilise les jeunes pour qu'ils deviennent acteurs de la transition écologique. Nous croyons que la durabilité et le développement économique sont compatibles, et formons les entrepreneurs de demain à intégrer l'impact environnemental au cœur de leurs projets.",
    color: "#0A7F78",
    secondaryColor: "#065F5A",
    gradient: "from-[#0A7F78]/20 via-[#12A89D]/5 to-transparent",
    icon: "🌿",
    bg: "/domain-environnement.jpg",
    objectives: [
      "Mobiliser la jeunesse pour l'action climatique",
      "Planter 1 million d'arbres d'ici 2030",
      "Former des éco-entrepreneurs et agri-preneurs",
      "Sensibiliser aux enjeux de la transition écologique",
      "Créer des projets environnementaux à fort impact local",
    ],
    programs: [
      {
        title: "Action Verte Sénégal",
        description: "Programme de reboisement massif combinant sensibilisation, action collective et suivi scientifique des espèces plantées.",
        duration: "Permanent",
      },
      {
        title: "Éco-Leadership",
        description: "Formation au leadership environnemental pour former des ambassadeurs de l'écologie dans leurs communautés.",
        duration: "6 semaines",
      },
      {
        title: "Green Business",
        description: "Accompagnement pour les entrepreneurs qui souhaitent développer des modèles d'affaires durables et respectueux de l'environnement.",
        duration: "3 mois",
      },
    ],
    stats: [
      { value: "150K+", label: "Arbres plantés" },
      { value: "5000+", label: "Jeunes mobilisés" },
      { value: "12", label: "Régions couvertes" },
      { value: "30+", label: "Partenaires écologiques" },
    ],
    impact:
      "150 000 arbres plantés dans 12 régions du Sénégal, 5 000 jeunes sensibilisés et des dizaines de projets d'éco-entrepreneuriat lancés et accompagnés.",
    relatedProjectSlugs: ["action-verte-senegal"],
  },
  {
    slug: "technologie",
    title: "Technologie",
    tagline: "Construire l'Afrique numérique de demain",
    description: "Accélérer la transformation numérique du continent africain.",
    longDescription:
      "Le numérique est la plus grande opportunité de l'histoire pour l'Afrique. Next Step prépare la jeunesse à saisir cette chance en formant des développeurs, des data scientists, des experts en cybersécurité et des entrepreneurs du numérique. Notre mission : faire du Sénégal un hub tech de référence sur le continent africain.",
    color: "#12A89D",
    secondaryColor: "#0A7F78",
    gradient: "from-[#12A89D]/20 via-[#0A7F78]/5 to-transparent",
    icon: "💻",
    bg: "/domain-technologie.jpg",
    objectives: [
      "Former 10 000 jeunes aux métiers du numérique",
      "Développer l'accès aux outils technologiques",
      "Créer des opportunités dans l'économie numérique",
      "Promouvoir la souveraineté technologique africaine",
      "Former à l'IA, au développement web et à la cybersécurité",
    ],
    programs: [
      {
        title: "Digital Senegal 2030",
        description: "Programme phare de formation aux compétences numériques : développement web, IA, data science et cybersécurité.",
        duration: "6 mois",
      },
      {
        title: "Code Camp",
        description: "Bootcamp intensif de programmation pour débutants. De zéro à développeur junior en 3 mois.",
        duration: "3 mois",
      },
      {
        title: "Tech Talks NS",
        description: "Conférences mensuelles avec des experts tech africains et internationaux pour inspirer et informer la communauté.",
        duration: "Mensuel",
      },
    ],
    stats: [
      { value: "2500+", label: "Jeunes formés au numérique" },
      { value: "180+", label: "Développeurs certifiés" },
      { value: "40+", label: "Entreprises tech partenaires" },
      { value: "75%", label: "Taux d'insertion pro" },
    ],
    impact:
      "75% de nos alumni tech ont trouvé un emploi ou créé leur entreprise dans les 6 mois suivant leur formation. Plusieurs travaillent pour des entreprises internationales.",
    relatedProjectSlugs: ["digital-senegal-2030"],
  },
  {
    slug: "engagement",
    title: "Engagement Citoyen",
    tagline: "Une jeunesse engagée pour une société juste",
    description: "Mobiliser la jeunesse pour une société juste et inclusive.",
    longDescription:
      "La démocratie se construit par l'engagement de ses citoyens. Next Step forme et mobilise une jeunesse consciente de ses droits et de ses devoirs, prête à s'engager activement dans la vie civique, associative et politique. Nous croyons que chaque jeune est un acteur du changement, capable d'influencer positivement sa communauté et son pays.",
    color: "#D9A657",
    secondaryColor: "#B8862E",
    gradient: "from-[#D9A657]/20 via-[#12A89D]/5 to-transparent",
    icon: "🤝",
    bg: "/domain-engagement.jpg",
    objectives: [
      "Renforcer la conscience civique des jeunes",
      "Former aux outils de la démocratie participative",
      "Encourager l'engagement dans la vie associative",
      "Promouvoir la diversité et l'inclusion sociale",
      "Créer des espaces de dialogue intergénérationnel",
    ],
    programs: [
      {
        title: "École de Citoyenneté",
        description: "Programme de 8 semaines sur les droits, devoirs et outils de la citoyenneté active dans le Sénégal contemporain.",
        duration: "8 semaines",
      },
      {
        title: "Volontariat NS",
        description: "Réseau de volontaires pour des projets communautaires à fort impact social dans les quartiers et villages du Sénégal.",
        duration: "Permanent",
      },
      {
        title: "Forum Citoyen",
        description: "Espace annuel de dialogue entre jeunes, élus et société civile pour coconstruire des propositions concrètes.",
        duration: "Annuel",
      },
    ],
    stats: [
      { value: "800+", label: "Citoyens engagés" },
      { value: "60+", label: "Projets communautaires" },
      { value: "15", label: "Communes partenaires" },
      { value: "3500+", label: "Heures de bénévolat" },
    ],
    impact:
      "3 500 heures de bénévolat cumulées, 60 projets communautaires réalisés et une présence dans 15 communes du Sénégal pour un engagement citoyen de terrain.",
    relatedProjectSlugs: ["forum-national-jeunes-entrepreneurs", "conferences-inspiration"],
  },
  {
    slug: "formation",
    title: "Formation",
    tagline: "Des compétences concrètes pour un emploi réel",
    description: "Développer les compétences pratiques pour l'employabilité.",
    longDescription:
      "Le chômage des jeunes est l'un des défis majeurs du Sénégal. Next Step y répond par des formations pratiques, courtes et certifiantes, directement connectées aux besoins du marché de l'emploi. Nos formateurs sont des professionnels en activité qui transmettent des compétences immédiatement applicables.",
    color: "#12A89D",
    secondaryColor: "#0A7F78",
    gradient: "from-[#12A89D]/20 via-[#D9A657]/5 to-transparent",
    icon: "🎓",
    bg: "/bg-graduates.jpg",
    objectives: [
      "Réduire le chômage des jeunes par la formation qualifiante",
      "Créer des parcours certifiants reconnus par les employeurs",
      "Former aux soft skills et compétences transversales",
      "Faciliter l'insertion professionnelle post-formation",
      "Adapter les contenus aux réalités du marché local",
    ],
    programs: [
      {
        title: "Formation Métiers",
        description: "Formations courtes (1-3 mois) dans les secteurs porteurs : marketing digital, comptabilité, logistique, commerce international.",
        duration: "1-3 mois",
      },
      {
        title: "Soft Skills Academy",
        description: "Programme de développement des compétences comportementales : communication, gestion du temps, travail en équipe, négociation.",
        duration: "4 semaines",
      },
      {
        title: "Job Ready",
        description: "Préparation intensive à la recherche d'emploi : CV, lettre de motivation, entretien, LinkedIn, réseau professionnel.",
        duration: "2 semaines",
      },
    ],
    stats: [
      { value: "4000+", label: "Personnes formées" },
      { value: "68%", label: "Taux d'insertion" },
      { value: "50+", label: "Entreprises partenaires" },
      { value: "120+", label: "Certifications délivrées" },
    ],
    impact:
      "68% de nos diplômés trouvent un emploi ou créent leur activité dans les 6 mois. Plus de 50 entreprises partenaires recrutent directement dans notre réseau d'alumni.",
    relatedProjectSlugs: ["leadership-academy", "digital-senegal-2030"],
  },
  {
    slug: "agriculture",
    title: "Agriculture",
    tagline: "L'agri-entrepreneuriat, levier de souveraineté",
    description: "Valoriser l'agri-entrepreneuriat comme levier de croissance.",
    longDescription:
      "L'agriculture emploie plus de 70% de la population rurale sénégalaise mais reste sous-valorisée. Next Step travaille à réconcilier les jeunes avec l'agriculture en la présentant comme un secteur d'avenir, innovant et rentable. Nous formons des agri-entrepreneurs qui allient tradition et modernité pour construire une souveraineté alimentaire durable.",
    color: "#0A7F78",
    secondaryColor: "#065F5A",
    gradient: "from-[#0A7F78]/20 via-[#D9A657]/5 to-transparent",
    icon: "🌾",
    bg: "/domain-agriculture.jpg",
    objectives: [
      "Valoriser l'agriculture comme choix professionnel attractif",
      "Former aux techniques agricoles modernes et durables",
      "Développer l'agri-tech et l'agriculture de précision",
      "Créer des chaînes de valeur agricoles locales",
      "Connecter les jeunes agriculteurs aux marchés",
    ],
    programs: [
      {
        title: "Agri-Entrepreneur",
        description: "Accompagnement complet pour créer et gérer une exploitation agricole rentable : formation technique, accès au financement, commercialisation.",
        duration: "6 mois",
      },
      {
        title: "Agri-Tech Lab",
        description: "Exploration des technologies agricoles : drones, capteurs IoT, agriculture de précision, applications mobiles pour agriculteurs.",
        duration: "3 mois",
      },
      {
        title: "Marchés Verts",
        description: "Plateforme de mise en relation directe entre jeunes producteurs et consommateurs pour des filières courtes et équitables.",
        duration: "Permanent",
      },
    ],
    stats: [
      { value: "250+", label: "Agri-entrepreneurs" },
      { value: "500 ha", label: "Terres valorisées" },
      { value: "20+", label: "Filières développées" },
      { value: "1200+", label: "Familles impactées" },
    ],
    impact:
      "500 hectares de terres valorisées, 1 200 familles dont les revenus ont augmenté et 20 filières agricoles structurées grâce à l'accompagnement Next Step.",
    relatedProjectSlugs: ["action-verte-senegal"],
  },
  {
    slug: "evenementiel",
    title: "Événementiel",
    tagline: "Des espaces d'inspiration et de connexion",
    description: "Créer des espaces d'échanges, d'inspiration et de networking.",
    longDescription:
      "Les événements sont les catalyseurs du changement. Chez Next Step, nous créons des espaces où les idées se rencontrent, où les collaborations naissent et où les jeunes s'inspirent mutuellement. Du grand forum national aux petits cercles d'échanges, chaque événement est conçu pour créer de la valeur et des connexions durables.",
    color: "#D9A657",
    secondaryColor: "#B8862E",
    gradient: "from-[#D9A657]/20 via-[#0A7F78]/5 to-transparent",
    icon: "🎙️",
    bg: "/domain-evenementiel.jpg",
    objectives: [
      "Créer des espaces de networking de qualité",
      "Inspirer par des témoignages et success stories",
      "Faciliter les collaborations entre jeunes talents",
      "Donner de la visibilité aux initiatives jeunes",
      "Connecter l'écosystème entrepreneurial sénégalais",
    ],
    programs: [
      {
        title: "Forum National JE",
        description: "Le plus grand rassemblement annuel de jeunes entrepreneurs du Sénégal. Pitchs, panels, masterclasses et networking.",
        duration: "3 jours",
      },
      {
        title: "Conférences Inspiration",
        description: "Série mensuelle de conférences avec des speakers de haut niveau africains et internationaux.",
        duration: "Mensuel",
      },
      {
        title: "NS Connect",
        description: "Événements de networking ciblés par secteur pour faciliter les rencontres professionnelles et les opportunités d'affaires.",
        duration: "Bimestriel",
      },
    ],
    stats: [
      { value: "50+", label: "Événements organisés" },
      { value: "25K+", label: "Participants cumulés" },
      { value: "200+", label: "Speakers invités" },
      { value: "98%", label: "Satisfaction participants" },
    ],
    impact:
      "25 000 participants cumulés, 200 speakers inspirants et un taux de satisfaction de 98% : nos événements sont devenus les rendez-vous incontournables de la jeunesse sénégalaise.",
    relatedProjectSlugs: ["forum-national-jeunes-entrepreneurs", "conferences-inspiration"],
  },
];

export function getDomainBySlug(slug: string): Domain | undefined {
  return DOMAINS.find((d) => d.slug === slug);
}
