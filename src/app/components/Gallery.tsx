"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/supabase";

const STATIC_ITEMS = [
  { id: "1", label: "Membres & Équipe Next Step.sn", sub: "Notre communauté", image_url: "/members.jpg", tag: "Équipe", gradient: "from-[#D9A657]/35 via-[#0A7F78]/20 to-[#182426]", icon: "🏟️", span: "md:col-span-2 md:row-span-2" },
  { id: "2", label: "Leadership Academy", sub: "100 jeunes formés", image_url: "", tag: "Formation", gradient: "from-[#12A89D]/35 via-[#005F5A]/20 to-[#182426]", icon: "🎓", span: "" },
  { id: "3", label: "Action Verte", sub: "5 000 arbres plantés", image_url: "", tag: "Environnement", gradient: "from-[#005F5A]/45 via-[#0A7F78]/20 to-[#182426]", icon: "🌳", span: "" },
  { id: "4", label: "Digital Training", sub: "200 apprenants", image_url: "", tag: "Tech", gradient: "from-[#0A7F78]/35 via-[#12A89D]/20 to-[#182426]", icon: "💻", span: "" },
  { id: "5", label: "Conférence Inspiration", sub: "500+ présents", image_url: "", tag: "Conférence", gradient: "from-[#D9A657]/30 via-[#182426] to-[#182426]", icon: "🎙️", span: "" },
  { id: "6", label: "Remise de diplômes", sub: "Cérémonie annuelle", image_url: "", tag: "Célébration", gradient: "from-[#12A89D]/30 via-[#D9A657]/15 to-[#182426]", icon: "🏆", span: "md:col-span-2" },
  { id: "7", label: "Ateliers pratiques", sub: "Chaque weekend", image_url: "", tag: "Atelier", gradient: "from-[#D9A657]/25 via-[#12A89D]/10 to-[#182426]", icon: "🛠️", span: "" },
  { id: "8", label: "Networking Jeunesse", sub: "Connexions durables", image_url: "", tag: "Réseau", gradient: "from-[#005F5A]/35 via-[#D9A657]/10 to-[#182426]", icon: "🤝", span: "" },
];

interface DisplayItem { id: string; label: string; sub: string; image_url: string; tag: string; gradient?: string; icon?: string; span?: string }

function toDisplayItems(dbItems: GalleryItem[]): DisplayItem[] {
  return dbItems.map(item => ({ ...item, gradient: "from-[#D9A657]/20 to-[#12A89D]/10", icon: "🖼️", span: "" }))
}

interface Props { dbItems?: GalleryItem[] }

export default function Gallery({ dbItems }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const items: DisplayItem[] = dbItems ? toDisplayItems(dbItems) : STATIC_ITEMS;

  return (
    <section id="gallery" className="py-24 bg-[#F5F7F6] section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#D9A657] text-sm font-semibold tracking-widest uppercase">En images</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#182426] mt-3 mb-4">
            Galerie <span className="gradient-text">Média</span>
          </h2>
          <p className="text-[#5A6A70] max-w-xl mx-auto">
            Revivez les moments forts de nos événements, formations et actions terrain.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer ${item.span ?? ""} ${!item.image_url ? `bg-gradient-to-br ${item.gradient}` : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(i === selected ? null : i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {item.image_url ? (
                <Image src={item.image_url} alt={item.label} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    animate={{ scale: hovered === i ? 1.15 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl"
                  >
                    {item.icon}
                  </motion.span>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-[#182426]/60 backdrop-blur-sm text-[#D9A657] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D9A657]/20">
                {item.tag}
              </div>

              <motion.div
                animate={{ opacity: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-gradient-to-t from-[#182426]/90 via-[#182426]/50 to-transparent flex flex-col justify-end p-4"
              >
                <div className="text-white font-bold text-sm">{item.label}</div>
                <div className="text-[#74878B] text-xs mt-0.5">{item.sub}</div>
              </motion.div>

              {selected === i && <div className="absolute inset-0 rounded-2xl ring-2 ring-[#D9A657]" />}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a href="#" className="inline-flex items-center gap-2 border border-[#74878B]/25 text-[#74878B] px-6 py-3 rounded-full text-sm hover:border-[#D9A657]/40 hover:text-[#D9A657] transition-all">
            Voir toute la galerie
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#182426]/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative w-full max-w-lg h-72 rounded-3xl overflow-hidden ${!items[selected].image_url ? `bg-gradient-to-br ${items[selected].gradient}` : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                {items[selected].image_url ? (
                  <Image src={items[selected].image_url} alt={items[selected].label} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <span className="text-8xl">{items[selected].icon}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#182426]/80 to-transparent p-6">
                  <div className="text-white font-bold text-xl">{items[selected].label}</div>
                  <div className="text-[#74878B] text-sm mt-1">{items[selected].sub}</div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-[#182426]/60 rounded-full flex items-center justify-center text-white hover:bg-[#182426] transition-colors">
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
