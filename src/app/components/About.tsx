"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const pillars = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Notre Vision",
    text: "Une génération de jeunes leaders africains qui bâtissent le continent de demain avec ambition, créativité et intégrité.",
    color: "#D9A657",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Notre Mission",
    text: "Accompagner, former et valoriser les jeunes leaders, entrepreneurs et innovateurs du Sénégal et d'Afrique en créant des opportunités concrètes.",
    color: "#12A89D",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Nos Valeurs",
    text: "Excellence, Impact, Solidarité, Innovation et Leadership sont les piliers qui guident chacune de nos actions et décisions.",
    color: "#D9A657",
  },
];

const impactStats = [
  { n: "2019", l: "Année de création" },
  { n: "14", l: "Régions couvertes" },
  { n: "5 000+", l: "Jeunes accompagnés" },
  { n: "100%", l: "Impact terrain" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#12A89D] text-sm font-semibold tracking-widest uppercase">
            Qui sommes-nous
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#182426] mt-3 mb-5">
            À propos de{" "}
            <span className="gradient-text">Next Step.sn</span>
          </h2>
          <p className="text-[#5A6A70] text-lg max-w-3xl mx-auto leading-relaxed">
            Next Step.sn est une organisation de jeunesse engagée, fondée pour connecter,
            inspirer et outiller les jeunes du Sénégal et d&apos;Afrique. Nous croyons que
            chaque jeune porte en lui le potentiel de changer le monde.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="group relative glass-card rounded-2xl p-8 hover:shadow-lg hover:border-[#D9A657]/35 transition-all duration-300 overflow-hidden"
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(225deg, ${p.color}12, transparent)` }}
              />

              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${p.color}15`, color: p.color }}
              >
                {p.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-[#182426] mb-3 group-hover:text-[#D9A657] transition-colors">
                {p.title}
              </h3>
              <p className="text-[#5A6A70] leading-relaxed">{p.text}</p>

              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Impact banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden min-h-[320px]"
        >
          {/* Members photo background */}
          <Image
            src="/members.jpg"
            alt="Membres Next Step.sn"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 1280px"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#182426]/92 via-[#182426]/80 to-[#182426]/60" />
          <div className="absolute inset-0 border border-[#12A89D]/20 rounded-3xl" />

          <div className="relative z-10 p-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-md">
                La jeunesse vers la{" "}
                <span className="text-[#D9A657]">prochaine étape</span>
              </h3>
              <p className="text-white/80 leading-relaxed">
                Depuis notre création, nous avons accompagné des milliers de jeunes dans
                leur parcours entrepreneurial, académique et personnel à travers le
                Sénégal et au-delà des frontières.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {impactStats.map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-[#D9A657]">{s.n}</div>
                  <div className="text-white/70 text-xs mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
