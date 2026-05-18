"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { getProjectBySlug, getRelatedProjects, PROJECTS } from "@/app/data/projects";
import { use } from "react";

const STATUS_COLORS: Record<string, string> = {
  "En cours": "#12A89D",
  "Inscriptions ouvertes": "#D9A657",
  "Candidatures ouvertes": "#D9A657",
  "Accompli": "#0A7F78",
  "Permanent": "#74878B",
  "Récurrent": "#74878B",
  "À venir": "#74878B",
};

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-[#E5EAEB] text-[#5A6A70] hover:border-[#12A89D]/40 hover:text-[#12A89D] transition-all"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Lien copié !
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Partager
        </>
      )}
    </button>
  );
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project.relatedSlugs).slice(0, 3);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const statusColor = STATUS_COLORS[project.status] ?? "#74878B";

  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {/* ── Navbar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#182426]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#D9A657]/30 group-hover:ring-[#D9A657] transition-all flex-shrink-0">
              <Image src="/Logo nextstep.jpeg" alt="Next Step.sn" fill sizes="36px" className="object-cover" />
            </div>
            <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-white/70 text-sm group-hover:text-white transition-colors">Retour à l&apos;accueil</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm">
            <Link href="/#projects" className="hover:text-white transition-colors">Projets</Link>
            <span>/</span>
            <span className="truncate max-w-48 font-semibold" style={{ color: project.color }}>{project.title}</span>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER avec image immersive ── */}
      <div ref={heroRef} className="relative min-h-[90vh] flex items-end overflow-hidden bg-[#182426]">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={project.bg}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,20,22,0.45) 0%, rgba(10,20,22,0.70) 45%, rgba(10,20,22,0.96) 100%)" }} />
          {/* Color radial */}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 0% 100%, ${project.color}22, transparent 60%)` }} />
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Big icon faded */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-8 text-[18rem] opacity-[0.04] select-none pointer-events-none leading-none">
            {project.icon}
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-36 w-full"
        >
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span
              className="text-xs font-bold px-4 py-1.5 rounded-full border backdrop-blur-sm"
              style={{ color: project.color, borderColor: `${project.color}45`, background: `${project.color}18` }}
            >
              {project.category}
            </span>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ color: statusColor, background: `${statusColor}22` }}
            >
              {project.status}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl text-white/55 mb-8 max-w-2xl"
          >
            {project.tagline}
          </motion.p>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-6 text-white/38 text-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {project.date}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {project.location}
            </span>
            {project.participants && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                {project.participants}
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ── STICKY ACTIONS BAR ── */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#E5EAEB] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="text-[#5A6A70] text-sm hidden sm:block truncate font-medium">{project.title}</span>
          <div className="flex items-center gap-3 ml-auto">
            <ShareButton />
            <Link
              href="/#join"
              className="px-6 py-2 rounded-full text-sm font-bold text-white hover:opacity-90 transition-all"
              style={{ background: project.color }}
            >
              Participer
            </Link>
          </div>
        </div>
      </div>

      {/* ── DESCRIPTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.span
              variants={fadeUp}
              className="text-sm font-semibold tracking-widest uppercase block"
              style={{ color: project.color }}
            >
              À propos du projet
            </motion.span>
            <motion.p variants={fadeUp} className="text-[#5A6A70] text-lg leading-relaxed">
              {project.longDescription}
            </motion.p>
            {project.impact && (
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl border-l-4"
                style={{ borderColor: project.color, background: `${project.color}08` }}
              >
                <p className="text-[#182426] font-semibold mb-1">Impact mesuré</p>
                <p className="text-[#5A6A70]">{project.impact}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── OBJECTIFS ── */}
      <section className="py-20 bg-[#F8FAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: project.color }}>Notre feuille de route</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#182426] mt-2">Objectifs du projet</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {project.objectives.map((obj, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E5EAEB] hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: `${project.color}18`, color: project.color }}
                >
                  {i + 1}
                </div>
                <p className="text-[#182426] text-sm font-medium">{obj}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      {project.testimonials.length > 0 && (
        <section className="py-24 bg-[#182426] relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${project.color}08, transparent 70%)` }} />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: project.color }}>Ils témoignent</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Ce qu&apos;ils en disent</h2>
            </motion.div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {project.testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 transition-colors"
                >
                  <svg className="w-8 h-8 mb-4 opacity-25" style={{ color: project.color }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-white/65 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `${project.color}40` }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-white/38 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── PROJETS SIMILAIRES ── */}
      {related.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-sm font-semibold tracking-widest uppercase text-[#12A89D]">Dans le même esprit</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#182426] mt-3">Projets similaires</h2>
            </motion.div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {related.map((p) => (
                <motion.div key={p.slug} variants={fadeUp} whileHover={{ y: -5 }}>
                  <Link href={`/projets/${p.slug}`} className="group block relative rounded-2xl overflow-hidden h-[180px]">
                    <Image src={p.bg} alt={p.title} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-110" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/90 via-[#182426]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block" style={{ color: p.color, background: `${p.color}22` }}>
                        {p.category}
                      </span>
                      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-[#D9A657] transition-colors">{p.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── TOUS LES PROJETS ── */}
      <section className="py-16 bg-[#F8FAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#5A6A70] mb-6 text-sm">Découvrir tous les projets Next Step</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {PROJECTS.filter((p) => p.slug !== slug).map((p) => (
              <Link
                key={p.slug}
                href={`/projets/${p.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}08` }}
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#182426] relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${project.color}15, transparent 70%)` }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-5xl mb-6 block">{project.icon}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Tu veux participer à <span style={{ color: project.color }}>ce projet</span> ?
            </h2>
            <p className="text-white/45 mb-10 text-lg max-w-xl mx-auto">
              Rejoins-nous et deviens acteur du changement. Des opportunités t&apos;attendent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#join"
                className="px-10 py-4 rounded-full font-bold text-[#182426] text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                style={{ background: project.color }}
              >
                Je veux participer
              </Link>
              <Link
                href={`/domaines/${project.domainSlug}`}
                className="px-10 py-4 rounded-full font-semibold text-white/65 text-sm border border-white/20 hover:text-white hover:border-white/40 transition-all"
              >
                Voir le domaine {project.category}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
