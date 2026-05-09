"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type { NewsArticle } from "@/lib/supabase";

const STATIC_ARTICLES = [
  {
    id: "1", category: "Événement", category_color: "#D9A657",
    title: "Forum National des Jeunes Entrepreneurs 2026 — Inscriptions ouvertes",
    excerpt: "La 5e édition du Forum National des Jeunes Entrepreneurs se tiendra à Dakar en juin 2026. Plus de 2 000 jeunes attendus pour 3 jours d'innovation et de networking.",
    date: "8 mai 2026", author: "Équipe Next Step.sn", read_time: "3 min", image_url: "",
    gradient: "from-[#D9A657]/20 to-[#0A7F78]/10",
  },
  {
    id: "2", category: "Formation", category_color: "#12A89D",
    title: "Lancement du Programme de Mentorat 2026 — 100 jeunes sélectionnés",
    excerpt: "Next Step.sn lance son programme de mentorat annuel avec 100 jeunes sélectionnés sur 1 200 candidatures. 12 semaines de coaching intensif avec des leaders africains.",
    date: "2 mai 2026", author: "Direction NS", read_time: "4 min", image_url: "",
    gradient: "from-[#12A89D]/20 to-[#005F5A]/10",
  },
  {
    id: "3", category: "Partenariat", category_color: "#0A7F78",
    title: "Next Step.sn signe un partenariat stratégique avec l'UCAD",
    excerpt: "Un accord de partenariat entre Next Step.sn et l'Université Cheikh Anta Diop de Dakar permettra aux étudiants d'accéder à nos programmes de formation.",
    date: "25 avril 2026", author: "Service Communication", read_time: "2 min", image_url: "",
    gradient: "from-[#0A7F78]/20 to-[#12A89D]/10",
  },
];

const GRADIENTS = [
  "from-[#D9A657]/20 to-[#0A7F78]/10",
  "from-[#12A89D]/20 to-[#005F5A]/10",
  "from-[#0A7F78]/20 to-[#12A89D]/10",
];

interface Props { dbArticles?: NewsArticle[] }

export default function News({ dbArticles }: Props) {
  const articles = dbArticles ?? STATIC_ARTICLES;

  return (
    <section id="news" className="py-24 bg-[#182426] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14"
        >
          <div>
            <span className="text-[#12A89D] text-sm font-semibold tracking-widest uppercase">Restez informé</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
              Actualités & <span className="gradient-text">Blog</span>
            </h2>
          </div>
          <a href="#" className="mt-4 sm:mt-0 text-[#D9A657] text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            Voir tout
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group bg-white/3 border border-[#74878B]/15 rounded-2xl overflow-hidden hover:border-[#12A89D]/30 transition-all duration-300 cursor-pointer"
            >
              <div className={`h-40 relative flex items-center justify-center ${!a.image_url ? `bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}` : ''}`}>
                {a.image_url ? (
                  <Image src={a.image_url} alt={a.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/40 to-transparent" />
                )}
                <div
                  className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full border"
                  style={{ color: a.category_color, borderColor: `${a.category_color}40`, background: `${a.category_color}15` }}
                >
                  {a.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-[#D9A657] transition-colors line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{a.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-[#74878B]/10">
                  <span>{a.date}</span>
                  <span>{a.read_time} de lecture</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
