"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ALL_ITEMS = [
  { id: "1", label: "Membres & Équipe Next Step.sn", sub: "Notre communauté", image_url: "/members.jpg", tag: "Équipe", icon: "👥", gradient: "from-[#D9A657]/35 via-[#0A7F78]/20 to-[#182426]" },
  { id: "2", label: "Leadership Academy", sub: "100 jeunes formés", image_url: "", tag: "Formation", icon: "🎓", gradient: "from-[#12A89D]/35 via-[#005F5A]/20 to-[#182426]" },
  { id: "3", label: "Action Verte", sub: "5 000 arbres plantés", image_url: "", tag: "Environnement", icon: "🌱", gradient: "from-[#005F5A]/45 via-[#0A7F78]/20 to-[#182426]" },
  { id: "4", label: "Digital Training", sub: "200 apprenants", image_url: "", tag: "Tech", icon: "💻", gradient: "from-[#0A7F78]/35 via-[#12A89D]/20 to-[#182426]" },
  { id: "5", label: "Conférence Inspiration", sub: "500+ présents", image_url: "", tag: "Conférence", icon: "🎤", gradient: "from-[#D9A657]/30 via-[#182426] to-[#182426]" },
  { id: "6", label: "Remise de diplômes", sub: "Cérémonie annuelle", image_url: "", tag: "Célébration", icon: "🏆", gradient: "from-[#12A89D]/30 via-[#D9A657]/15 to-[#182426]" },
  { id: "7", label: "Ateliers pratiques", sub: "Chaque weekend", image_url: "", tag: "Atelier", icon: "🛠️", gradient: "from-[#D9A657]/25 via-[#12A89D]/10 to-[#182426]" },
  { id: "8", label: "Networking Jeunesse", sub: "Connexions durables", image_url: "", tag: "Réseau", icon: "🤝", gradient: "from-[#005F5A]/35 via-[#D9A657]/10 to-[#182426]" },
  { id: "9", label: "Forum Entrepreneuriat", sub: "300 participants", image_url: "", tag: "Événement", icon: "🏟️", gradient: "from-[#D9A657]/30 via-[#0A7F78]/15 to-[#182426]" },
  { id: "10", label: "Programme Agriculture", sub: "Jeunes agriculteurs", image_url: "", tag: "Agriculture", icon: "🌾", gradient: "from-[#0A7F78]/35 via-[#005F5A]/20 to-[#182426]" },
  { id: "11", label: "Hackathon Numérique", sub: "48h d'innovation", image_url: "", tag: "Tech", icon: "⚡", gradient: "from-[#12A89D]/30 via-[#D9A657]/10 to-[#182426]" },
  { id: "12", label: "Visite Terrain", sub: "Régions du Sénégal", image_url: "", tag: "Terrain", icon: "🗺️", gradient: "from-[#005F5A]/40 via-[#12A89D]/15 to-[#182426]" },
];

const TAGS = ["Tous", "Équipe", "Formation", "Environnement", "Tech", "Conférence", "Célébration", "Atelier", "Réseau", "Événement", "Agriculture", "Terrain"];

export default function GaleriePage() {
  const [activeTag, setActiveTag] = useState("Tous");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = activeTag === "Tous" ? ALL_ITEMS : ALL_ITEMS.filter((i) => i.tag === activeTag);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight" && selected !== null) setSelected((s) => (s! + 1) % filtered.length);
      if (e.key === "ArrowLeft" && selected !== null) setSelected((s) => (s! - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, filtered.length]);

  return (
    <main className="min-h-screen bg-[#0D1B1D]">
      {/* Navbar */}
      <div className="bg-[#182426] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#D9A657]/30 group-hover:ring-[#D9A657] transition-all flex-shrink-0">
              <Image src="/Logo nextstep.jpeg" alt="Next Step.sn" fill sizes="36px" className="object-cover" />
            </div>
            <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-white/70 text-sm group-hover:text-white transition-colors">Accueil</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-[#D9A657] text-sm font-semibold">Galerie</span>
        </div>
      </div>

      {/* Hero */}
      <div className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10" style={{ background: "#D9A657" }} />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-8" style={{ background: "#12A89D" }} />
        </div>
        <div className="relative">
          <span className="text-[#D9A657] text-xs font-bold tracking-[0.25em] uppercase mb-4 block">En images</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5">
            Galerie <span className="text-[#D9A657]">Média</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Revivez les moments forts de nos événements, formations et actions terrain.
          </p>
        </div>
      </div>

      {/* Filtres par tag */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTag === tag
                  ? "bg-[#D9A657] text-[#182426]"
                  : "border border-white/15 text-white/50 hover:border-[#D9A657]/40 hover:text-[#D9A657]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer h-40 sm:h-52 ${!item.image_url ? `bg-gradient-to-br ${item.gradient}` : ""}`}
              onClick={() => setSelected(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.image_url ? (
                <Image src={item.image_url} alt={item.label} fill className="object-cover transition-transform duration-500 hover:scale-110" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-5xl">{item.icon}</div>
              )}
              <div className="absolute top-3 left-3 bg-[#182426]/60 backdrop-blur-sm text-[#D9A657] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D9A657]/20">
                {item.tag}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="text-white font-bold text-sm">{item.label}</div>
                <div className="text-white/50 text-xs mt-0.5">{item.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            Aucun élément dans cette catégorie.
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A1416]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden ${!filtered[selected].image_url ? `bg-gradient-to-br ${filtered[selected].gradient}` : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80 sm:h-[480px]">
                {filtered[selected].image_url ? (
                  <Image src={filtered[selected].image_url} alt={filtered[selected].label} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-9xl">
                    {filtered[selected].icon}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#182426]/90 to-transparent p-6">
                <div className="text-[#D9A657] text-xs font-bold uppercase tracking-widest mb-1">{filtered[selected].tag}</div>
                <div className="text-white font-bold text-xl">{filtered[selected].label}</div>
                <div className="text-white/50 text-sm mt-1">{filtered[selected].sub}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-[#182426]/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#182426] transition-colors text-lg"
              >
                ×
              </button>
              {/* Navigation prev/next */}
              <button
                onClick={(e) => { e.stopPropagation(); setSelected((s) => (s! - 1 + filtered.length) % filtered.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#182426]/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#182426] transition-colors"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected((s) => (s! + 1) % filtered.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#182426]/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#182426] transition-colors"
              >
                ›
              </button>
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-xs">
              {selected + 1} / {filtered.length} — Échap pour fermer
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
