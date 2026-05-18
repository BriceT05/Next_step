"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const pillars = [
  {
    img: "/Notre vision.jpg",
    title: "Notre Vision",
    text: "Une génération de jeunes leaders africains qui bâtissent le continent de demain avec ambition, créativité et intégrité.",
    color: "#D9A657",
  },
  {
    img: "/Notre mission.jpg",
    title: "Notre Mission",
    text: "Accompagner, former et valoriser les jeunes leaders, entrepreneurs et innovateurs du Sénégal et d'Afrique en créant des opportunités concrètes.",
    color: "#12A89D",
  },
  {
    img: "/Nos valeurs.jpg",
    title: "Nos Valeurs",
    text: "Excellence, Impact, Solidarité, Innovation et Leadership sont les piliers qui guident chacune de nos actions et décisions.",
    color: "#D9A657",
  },
];

const impactStats = [
  { n: "2025", l: "Année de création" },
  { n: "1+", l: "Région couverte" },
  { n: "100+", l: "Jeunes impactés" },
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
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden border border-[#E5EAEB] hover:shadow-xl hover:border-opacity-0 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/60 via-transparent to-transparent" />
                {/* Color badge */}
                <div
                  className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: p.color, color: "#182426" }}
                >
                  {p.title}
                </div>
              </div>

              {/* Text */}
              <div className="p-6 bg-white">
                <h3
                  className="text-lg font-bold text-[#182426] mb-2 transition-colors duration-200"
                  style={{ ["--hc" as string]: p.color }}
                >
                  <span className="group-hover:text-[var(--hc)] transition-colors">{p.title}</span>
                </h3>
                <p className="text-[#5A6A70] text-sm leading-relaxed">{p.text}</p>
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
                style={{ background: p.color }}
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
          {/* Graduates photo background */}
          <Image
            src="/bg-graduates.jpg"
            alt="Jeunes diplômés"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1280px"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#182426]/90 via-[#182426]/75 to-[#182426]/55" />
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
