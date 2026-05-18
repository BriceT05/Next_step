export interface Subdomain {
  title: string;
  icon: string;
  img: string;
}

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
  subdomains: Subdomain[];
  objectives: string[];
  programs: DomainProgram[];
  stats: DomainStat[];
  impact: string;
  relatedProjectSlugs: string[];
}

export const DOMAINS: Domain[] = [
  {
    slug: "entrepreneuriat-innovation",
    title: "Entrepreneuriat & Innovation",
    tagline: "Transformer les idées en impact économique durable",
    description: "Soutenir la création d'entreprises et stimuler l'innovation pour révolutionner l'économie africaine.",
    longDescription:
      "L'entrepreneuriat et l'innovation sont les moteurs de la transformation économique africaine. Chez Next Step, nous croyons que chaque jeune porte en lui le potentiel d'un entrepreneur et d'un innovateur. Nous accompagnons les porteurs de projets à chaque étape : de l'idéation au lancement, du financement à la croissance. Nos programmes combinent mentorat de haut niveau, accès aux réseaux d'affaires et formations pratiques orientées résultats, en intégrant les dernières tendances en matière d'innovation digitale et de design thinking.",
    color: "#D9A657",
    secondaryColor: "#B8862E",
    gradient: "from-[#D9A657]/20 via-[#D9A657]/5 to-transparent",
    icon: "🚀",
    bg: "/domain-entrepreneuriat.jpg",
    subdomains: [
      { title: "Startup", icon: "🏢", img: "/Startup.jpg" },
      { title: "Business", icon: "💼", img: "/business.jpg" },
      { title: "Leadership entrepreneurial", icon: "⭐", img: "/Leardership entreprenarial.jpg" },
      { title: "Incubation", icon: "🌱", img: "/Incubation.jpg" },
      { title: "Innovation digitale", icon: "💡", img: "/Innovation digitale.jpg" },
    ],
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
        description:
          "Programme d'incubation de 6 mois pour transformer votre idée en entreprise viable. Coaching individuel, ateliers collectifs et démo day devant des investisseurs.",
        duration: "6 mois",
      },
      {
        title: "Innovation Lab",
        description:
          "Espace d'expérimentation et de prototypage rapide. Accès à du matériel, des mentors tech et un réseau d'experts pour tester vos idées novatrices.",
        duration: "Permanent",
      },
      {
        title: "Bootcamp Entrepreneur",
        description:
          "Immersion intensive de 5 jours sur les fondamentaux de l'entrepreneuriat : pitch, business plan, finance, marketing digital.",
        duration: "5 jours",
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
    relatedProjectSlugs: ["forum-national-entrepreneurs", "conference-startup", "interview-entrepreneur"],
  },
  {
    slug: "formation-leadership",
    title: "Formation & Leadership",
    tagline: "Former les leaders et professionnels de demain",
    description:
      "Développer les compétences pratiques et le leadership pour renforcer l'employabilité et l'impact des jeunes.",
    longDescription:
      "La formation et le leadership sont deux piliers indissociables du développement des jeunes en Afrique. Next Step propose une approche globale : former des leaders capables de transformer leur secteur et développer des compétences pratiques directement connectées aux besoins du marché. Nos programmes forment les jeunes à être à la fois des leaders inspirants et des professionnels hautement qualifiés, prêts à saisir les opportunités d'un continent en pleine croissance.",
    color: "#12A89D",
    secondaryColor: "#0A7F78",
    gradient: "from-[#12A89D]/20 via-[#12A89D]/5 to-transparent",
    icon: "🎓",
    bg: "/bg-graduates.jpg",
    subdomains: [
      { title: "Leadership jeunesse", icon: "⭐", img: "/Leadership jeunesse.jpg" },
      { title: "Développement personnel", icon: "🎯", img: "/Développement personnel.jpg" },
      { title: "Employabilité", icon: "💼", img: "/Employabilité.jpg" },
      { title: "Soft skills", icon: "🤝", img: "/Soft skill.jpg" },
      { title: "Mentorat", icon: "🧭", img: "/Mentorat.jpg" },
    ],
    objectives: [
      "Former des leaders communautaires et professionnels visionnaires",
      "Réduire le chômage des jeunes par la formation qualifiante",
      "Développer les compétences transversales du 21e siècle",
      "Faciliter l'insertion professionnelle post-formation",
      "Construire un réseau de leaders engagés à travers le Sénégal",
    ],
    programs: [
      {
        title: "Leadership Academy NS",
        description:
          "Programme intensif de 3 mois qui plonge les participants dans des défis réels de leadership. Ateliers, études de cas, simulations et visites de terrain.",
        duration: "3 mois",
      },
      {
        title: "Formation Métiers",
        description:
          "Formations courtes dans les secteurs porteurs : marketing digital, comptabilité, logistique, commerce international.",
        duration: "1–3 mois",
      },
      {
        title: "Soft Skills Academy",
        description:
          "Programme de développement des compétences comportementales : communication, gestion du temps, travail en équipe, négociation.",
        duration: "4 semaines",
      },
    ],
    stats: [
      { value: "1500+", label: "Leaders formés" },
      { value: "4000+", label: "Personnes formées" },
      { value: "68%", label: "Taux d'insertion pro" },
      { value: "32", label: "Pays représentés" },
    ],
    impact:
      "1 500 leaders formés dans 32 pays, 68% de taux d'insertion professionnelle pour nos diplômés, 50+ entreprises partenaires recrutant directement dans notre réseau.",
    relatedProjectSlugs: ["un-jeune-un-permis"],
  },
  {
    slug: "education",
    title: "Éducation",
    tagline: "Le savoir comme premier levier d'émancipation",
    description: "Promouvoir l'apprentissage continu et l'accès au savoir pour tous, partout au Sénégal.",
    longDescription:
      "L'éducation est le fondement de tout changement durable. Next Step s'engage à rendre le savoir accessible à tous les jeunes, indépendamment de leur origine ou situation. Nos programmes éducatifs couvrent les compétences du 21e siècle : esprit critique, communication, collaboration et créativité, en complément des formations académiques traditionnelles. Du tutorat pair-à-pair à l'e-learning avancé, en passant par l'orientation scolaire et l'inclusion numérique, nous construisons un écosystème éducatif complet pour la jeunesse sénégalaise.",
    color: "#D9A657",
    secondaryColor: "#B8862E",
    gradient: "from-[#D9A657]/20 via-[#D9A657]/5 to-transparent",
    icon: "📚",
    bg: "/domain-education.jpg",
    subdomains: [
      { title: "E-learning", icon: "💻", img: "/e-learnig.jpg" },
      { title: "Tutorat", icon: "🎓", img: "/tutorat.jpg" },
      { title: "Orientation", icon: "🧭", img: "/Oriantation.jpg" },
      { title: "Inclusion numérique", icon: "🌐", img: "/inclusion numérique.jpg" },
    ],
    objectives: [
      "Démocratiser l'accès à une éducation de qualité",
      "Développer les compétences transversales du 21e siècle",
      "Créer des ressources pédagogiques adaptées au contexte africain",
      "Former des jeunes à l'apprentissage autonome et au numérique",
      "Soutenir les jeunes en décrochage scolaire",
    ],
    programs: [
      {
        title: "Plateforme e-Tutorat NS",
        description:
          "Plateforme d'apprentissage en ligne avec des centaines de cours, tutoriels et ressources en français et langues locales.",
        duration: "Permanent",
      },
      {
        title: "Tutorat Pair-à-Pair",
        description:
          "Mise en relation d'étudiants performants avec des élèves en difficulté pour un soutien scolaire bénévole et de proximité.",
        duration: "Année scolaire",
      },
      {
        title: "Orientation & Coaching",
        description:
          "Accompagnement des jeunes dans leur parcours académique et professionnel, du lycée à l'insertion.",
        duration: "3 mois",
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
    relatedProjectSlugs: ["site-tutorat-etutorat"],
  },
  {
    slug: "environnement-agriculture",
    title: "Environnement & Agriculture",
    tagline: "Agir maintenant pour un Sénégal vert et durable",
    description: "Mobiliser la jeunesse pour la transition écologique et l'agriculture durable au Sénégal.",
    longDescription:
      "Les défis environnementaux sont existentiels pour l'Afrique. Sécheresse, déforestation, pollution marine, changement climatique : Next Step mobilise les jeunes pour qu'ils deviennent acteurs de la transition écologique. Nous croyons que la durabilité et le développement économique sont compatibles, et formons les entrepreneurs de demain à intégrer l'impact environnemental au cœur de leurs projets. L'agriculture verte et le reboisement sont des leviers essentiels pour la souveraineté alimentaire et la résilience climatique du Sénégal.",
    color: "#0A7F78",
    secondaryColor: "#065F5A",
    gradient: "from-[#0A7F78]/20 via-[#12A89D]/5 to-transparent",
    icon: "🌿",
    bg: "/domain-environnement.jpg",
    subdomains: [
      { title: "Reboisement", icon: "🌳", img: "/Reboisement.jpg" },
      { title: "Sensibilisation écologique", icon: "🌍", img: "/Sensibilisation écologique.jpg" },
      { title: "Développement durable", icon: "♻️", img: "/Développement durable.jpg" },
      { title: "Agriculture verte", icon: "🌾", img: "/Agriculture verte.jpg" },
    ],
    objectives: [
      "Mobiliser la jeunesse pour l'action climatique",
      "Planter 1 million d'arbres d'ici 2030",
      "Former des éco-entrepreneurs et agri-preneurs verts",
      "Sensibiliser aux enjeux de la transition écologique",
      "Créer des projets environnementaux à fort impact local",
    ],
    programs: [
      {
        title: "Action Verte Sénégal",
        description:
          "Programme de reboisement massif combinant sensibilisation, action collective et suivi scientifique des espèces plantées.",
        duration: "Permanent",
      },
      {
        title: "Agriculture Verte",
        description:
          "Accompagnement pour développer des modèles agricoles durables : agroforesterie, permaculture, agriculture de précision.",
        duration: "6 mois",
      },
      {
        title: "Éco-Leadership",
        description:
          "Formation au leadership environnemental pour former des ambassadeurs de l'écologie dans leurs communautés.",
        duration: "6 semaines",
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
    relatedProjectSlugs: ["forum-national-entrepreneurs"],
  },
  {
    slug: "technologie",
    title: "Technologie",
    tagline: "Construire l'Afrique numérique de demain",
    description: "Accélérer la transformation numérique du continent africain par la formation et l'innovation tech.",
    longDescription:
      "Le numérique est la plus grande opportunité de l'histoire pour l'Afrique. Next Step prépare la jeunesse à saisir cette chance en formant des développeurs, des experts en intelligence artificielle, des spécialistes en cybersécurité et des entrepreneurs du numérique. Notre mission : faire du Sénégal un hub tech de référence sur le continent africain. Nous accompagnons les jeunes de la découverte du code jusqu'à la création de leur startup tech, avec des programmes certifiants reconnus par les employeurs.",
    color: "#12A89D",
    secondaryColor: "#0A7F78",
    gradient: "from-[#12A89D]/20 via-[#0A7F78]/5 to-transparent",
    icon: "💻",
    bg: "/domain-technologie.jpg",
    subdomains: [
      { title: "Développement web", icon: "🌐", img: "/Developpement web.jpg" },
      { title: "Intelligence artificielle", icon: "🤖", img: "/Intelligence artificielle.jpg" },
      { title: "Cybersécurité", icon: "🔒", img: "/Cyber Sécurité.jpg" },
      { title: "Innovation numérique", icon: "⚡", img: "/Innovation numérique.jpg" },
    ],
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
        description:
          "Programme phare de formation aux compétences numériques : développement web, IA, data science et cybersécurité.",
        duration: "6 mois",
      },
      {
        title: "Code Camp NS",
        description: "Bootcamp intensif de programmation pour débutants. De zéro à développeur junior en 3 mois.",
        duration: "3 mois",
      },
      {
        title: "AI Lab",
        description:
          "Formation avancée en intelligence artificielle, machine learning et applications pour les défis africains.",
        duration: "4 mois",
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
    relatedProjectSlugs: ["interview-entrepreneur"],
  },
];

export function getDomainBySlug(slug: string): Domain | undefined {
  return DOMAINS.find((d) => d.slug === slug);
}
