"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import type { Project } from "@/lib/supabase";

const STATIC_PROJECTS = [
  { id: "1", title: "Forum National des Jeunes Entrepreneurs", description: "Le plus grand rassemblement annuel de jeunes entrepreneurs du Sénégal. Pitchs, networking, mentorat.", category: "Événement", status: "Inscriptions ouvertes", image_url: "", bg: "from-[#D9A657]/25 via-[#0A7F78]/15 to-[#182426]/80", icon: "🏟️", tagColor: "#D9A657", statusColor: "#D9A657" },
  { id: "2", title: "Leadership Academy NS", description: "Programme intensif de 3 mois pour former la prochaine génération de leaders africains.", category: "Formation", status: "En cours", image_url: "", bg: "from-[#12A89D]/25 via-[#005F5A]/15 to-[#182426]/80", icon: "🎓", tagColor: "#12A89D", statusColor: "#12A89D" },
  { id: "3", title: "Action Verte Sénégal", description: "Initiative de reboisement et de sensibilisation environnementale mobilisant des milliers de jeunes.", category: "Environnement", status: "Accompli", image_url: "", bg: "from-[#005F5A]/35 via-[#0A7F78]/15 to-[#182426]/80", icon: "🌳", tagColor: "#0A7F78", statusColor: "#0A7F78" },
  { id: "4", title: "Digital Senegal 2030", description: "Formation aux compétences numériques — IA, développement web, cybersécurité — pour la jeunesse.", category: "Technologie", status: "En cours", image_url: "", bg: "from-[#0A7F78]/25 via-[#12A89D]/15 to-[#182426]/80", icon: "💻", tagColor: "#12A89D", statusColor: "#12A89D" },
  { id: "5", title: "Incubateur Next Step", description: "Accompagnement sur 6 mois pour les startups fondées par des jeunes : coaching, financement, réseau.", category: "Entrepreneuriat", status: "Candidatures ouvertes", image_url: "", bg: "from-[#D9A657]/20 via-[#005F5A]/15 to-[#182426]/80", icon: "🚀", tagColor: "#D9A657", statusColor: "#D9A657" },
  { id: "6", title: "Conférences Inspiration", description: "Série de conférences mensuelles avec des leaders africains et internationaux pour inspirer la jeunesse.", category: "Événement", status: "Permanent", image_url: "", bg: "from-[#12A89D]/20 via-[#D9A657]/10 to-[#182426]/80", icon: "🎙️", tagColor: "#D9A657", statusColor: "#74878B" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Événement": "#D9A657", "Formation": "#12A89D", "Environnement": "#0A7F78",
  "Technologie": "#12A89D", "Entrepreneuriat": "#D9A657", "Conférence": "#D9A657",
};
const STATUS_COLORS: Record<string, string> = {
  "En cours": "#12A89D", "Inscriptions ouvertes": "#D9A657", "Candidatures ouvertes": "#D9A657",
  "Accompli": "#0A7F78", "Permanent": "#74878B", "À venir": "#74878B",
};
const BG_GRADIENTS = ["from-[#D9A657]/25 via-[#0A7F78]/15","from-[#12A89D]/25 via-[#005F5A]/15","from-[#005F5A]/35 via-[#0A7F78]/15","from-[#0A7F78]/25 via-[#12A89D]/15","from-[#D9A657]/20 via-[#005F5A]/15","from-[#12A89D]/20 via-[#D9A657]/10"];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [12, -12]), { stiffness: 300, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-12, 12]), { stiffness: 300, damping: 40 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div ref={ref} style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.02, z: 20 }} transition={{ scale: { duration: 0.2 } }}>
      {children}
    </motion.div>
  );
}

interface Props { dbProjects?: Project[] }

export default function Projects({ dbProjects }: Props) {
  const projects = dbProjects ?? STATIC_PROJECTS;

  return (
    <section id="projects" className="py-24 bg-white section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#12A89D] text-sm font-semibold tracking-widest uppercase">Nos initiatives</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#182426] mt-3 mb-4">
            Nos <span className="gradient-text">Projets</span>
          </h2>
          <p className="text-[#5A6A70] max-w-2xl mx-auto">
            Des projets concrets qui transforment des vies et façonnent l&apos;avenir de l&apos;Afrique.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => {
            const tagColor = "tagColor" in p ? (p as typeof STATIC_PROJECTS[0]).tagColor : (CATEGORY_COLORS[p.category] ?? "#D9A657");
            const statusColor = "statusColor" in p ? (p as typeof STATIC_PROJECTS[0]).statusColor : (STATUS_COLORS[p.status] ?? "#74878B");
            const bg = "bg" in p ? (p as typeof STATIC_PROJECTS[0]).bg : `${BG_GRADIENTS[i % BG_GRADIENTS.length]} to-[#182426]/80`;
            const icon = "icon" in p ? (p as typeof STATIC_PROJECTS[0]).icon : "🚀";

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard>
                  <div className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#12A89D]/30 transition-all duration-300 h-full">
                    <div className={`relative h-44 flex items-center justify-center overflow-hidden ${!p.image_url ? `bg-gradient-to-br ${bg}` : ''}`}>
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                      ) : (
                        <>
                          <span className="text-6xl">{icon}</span>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/60 via-transparent to-transparent" />
                        </>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ x: "-100%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.6 }}
                      />
                      <div className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm"
                        style={{ color: tagColor, borderColor: `${tagColor}40`, background: `${tagColor}15` }}>
                        {p.category}
                      </div>
                      <div className="absolute bottom-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: statusColor, background: `${statusColor}20` }}>
                        {p.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-[#182426] font-bold text-base leading-snug mb-3 group-hover:text-[#D9A657] transition-colors duration-200">
                        {p.title}
                      </h3>
                      <p className="text-[#5A6A70] text-sm leading-relaxed mb-5">{p.description}</p>
                      <button className="flex items-center gap-2 text-[#12A89D] text-sm font-semibold">
                        <span>Voir plus</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a href="#join"
            className="inline-flex items-center gap-2 border border-[#D9A657]/40 text-[#D9A657] px-8 py-3.5 rounded-full font-semibold hover:bg-[#D9A657]/8 transition-all text-sm">
            Participer à nos projets
          </a>
        </motion.div>
      </div>
    </section>
  );
}
