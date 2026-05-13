"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { getDomainBySlug, DOMAINS } from "@/app/data/domains";
import { getRelatedProjects } from "@/app/data/projects";
import { use } from "react";

/* ─── Animated counter ─────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const num = parseFloat(target.replace(/[^\d.]/g, ""));
  const prefix = target.match(/^[^\d]*/)?.[0] ?? "";
  const postfix = target.replace(/^[^\d]*[\d.]+/, "");
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isNaN(num)) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [num]);

  useEffect(() => {
    if (!started || isNaN(num)) return;
    const dur = 1800;
    const step = 16;
    const inc = num / (dur / step);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + inc, num);
      setCount(cur);
      if (cur >= num) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [started, num]);

  const display = isNaN(num) ? target : `${prefix}${num >= 1000 ? Math.round(count).toLocaleString("fr-FR") : count % 1 === 0 ? Math.round(count) : count.toFixed(1)}${postfix}${suffix}`;

  return <span ref={ref}>{display}</span>;
}

/* ─── Domain icon (reused from Domains.tsx) ────────────────────── */
function DomainIcon({ type, className = "w-10 h-10" }: { type: string; className?: string }) {
  const props = { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
  switch (type) {
    case "entrepreneuriat":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>;
    case "leadership":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
    case "innovation":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>;
    case "education":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>;
    case "environnement":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
    case "technologie":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>;
    case "engagement":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
    case "formation":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
    case "agriculture":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
    case "evenementiel":
      return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>;
    default:
      return null;
  }
}

export default function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const domain = getDomainBySlug(slug);
  if (!domain) notFound();

  const related = getRelatedProjects(domain.relatedProjectSlugs);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
      {/* ── Navbar back ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#182426]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: domain.color }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-white/70 text-sm group-hover:text-white transition-colors">Retour à l&apos;accueil</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm">
            <Link href="/#domains" className="hover:text-white transition-colors">Domaines</Link>
            <span>/</span>
            <span style={{ color: domain.color }}>{domain.title}</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#182426]">
        {/* Photo de fond avec parallaxe */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={domain.bg}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Voile sombre pour lisibilité du texte blanc */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(24,36,38,0.55) 0%, rgba(24,36,38,0.75) 50%, rgba(24,36,38,0.92) 100%)" }} />
          {/* Halo couleur du domaine */}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${domain.color}30, transparent 70%)` }} />
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${6 + i * 4}px`,
              height: `${6 + i * 4}px`,
              background: `${domain.color}${30 + i * 8}`,
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: `${domain.color}20`, border: `1.5px solid ${domain.color}40` }}>
                <DomainIcon type={slug} className="w-12 h-12" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{ border: `2px solid ${domain.color}` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-sm font-semibold tracking-widest uppercase mb-4 block" style={{ color: domain.color }}>
              Domaine d&apos;action
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              {domain.title}
            </h1>
            <p className="text-xl sm:text-2xl text-white/60 font-light mb-4">{domain.tagline}</p>
            <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">{domain.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Link href="/#join"
              className="px-8 py-4 rounded-full font-bold text-[#182426] text-sm tracking-wide hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              style={{ background: domain.color }}>
              Rejoindre ce domaine
            </Link>
            <Link href="/#projects"
              className="px-8 py-4 rounded-full font-semibold text-white text-sm border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
              Voir les projets liés
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 rounded-full bg-white/50" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 bg-[#182426] relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 100% at 50% 50%, ${domain.color}08, transparent 70%)` }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {domain.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-white/8 bg-white/3"
              >
                <div className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: domain.color }}>
                  <Counter target={stat.value} />
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.span variants={fadeUp} className="text-sm font-semibold tracking-widest uppercase block" style={{ color: domain.color }}>
              Notre approche
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-[#182426]">
              Pourquoi ce domaine est stratégique
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#5A6A70] text-lg leading-relaxed">
              {domain.longDescription}
            </motion.p>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl border-l-4" style={{ borderColor: domain.color, background: `${domain.color}08` }}>
              <p className="text-[#182426] font-medium leading-relaxed">{domain.impact}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── OBJECTIVES ── */}
      <section className="py-24 bg-[#F8FAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: domain.color }}>Ce que nous visons</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#182426] mt-3">Nos objectifs</h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {domain.objectives.map((obj, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E5EAEB] hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${domain.color}15` }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: domain.color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-[#182426] font-medium leading-snug">{obj}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: domain.color }}>Nos programmes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#182426] mt-3">Programmes associés</h2>
            <p className="text-[#5A6A70] mt-3 max-w-xl mx-auto">Des programmes concrets pour atteindre nos objectifs dans ce domaine.</p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {domain.programs.map((prog, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-2xl border border-[#E5EAEB] hover:border-opacity-50 hover:shadow-lg transition-all relative overflow-hidden"
                style={{ ["--hover-border" as string]: domain.color }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${domain.color}08, transparent 70%)` }} />
                <div className="relative">
                  {prog.duration && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block" style={{ color: domain.color, background: `${domain.color}15` }}>
                      {prog.duration}
                    </span>
                  )}
                  <h3 className="text-[#182426] font-bold text-base mb-3 group-hover:text-[#D9A657] transition-colors">{prog.title}</h3>
                  <p className="text-[#5A6A70] text-sm leading-relaxed">{prog.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RELATED PROJECTS ── */}
      {related.length > 0 && (
        <section className="py-24 bg-[#F8FAFA]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: domain.color }}>Initiatives concrètes</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#182426] mt-3">Projets liés</h2>
            </motion.div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-6"
            >
              {related.map((proj) => (
                <motion.div key={proj.slug} variants={fadeUp}>
                  <Link href={`/projets/${proj.slug}`}
                    className="group block p-6 bg-white rounded-2xl border border-[#E5EAEB] hover:border-[#12A89D]/30 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{proj.icon}</span>
                      <div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: proj.color, background: `${proj.color}15` }}>{proj.category}</span>
                        <h3 className="font-bold text-[#182426] mt-1 group-hover:text-[#D9A657] transition-colors leading-snug">{proj.title}</h3>
                      </div>
                    </div>
                    <p className="text-[#5A6A70] text-sm leading-relaxed mb-4">{proj.description}</p>
                    <span className="inline-flex items-center gap-2 text-[#12A89D] text-sm font-semibold">
                      Voir le projet
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── ALL DOMAINS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-[#182426] mb-8 text-center"
          >
            Découvrir les autres domaines
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {DOMAINS.filter((d) => d.slug !== slug).map((d) => (
              <motion.div key={d.slug} variants={fadeUp}>
                <Link
                  href={`/domaines/${d.slug}`}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 hover:shadow-md"
                  style={{ color: d.color, borderColor: `${d.color}40`, background: `${d.color}08` }}
                >
                  {d.title}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#182426] relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${domain.color}15, transparent 70%)` }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à rejoindre le domaine <span style={{ color: domain.color }}>{domain.title}</span> ?
            </h2>
            <p className="text-white/50 mb-10 text-lg">
              Rejoins des centaines de jeunes engagés qui construisent l&apos;Afrique de demain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#join"
                className="px-10 py-4 rounded-full font-bold text-[#182426] text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                style={{ background: domain.color }}>
                Je veux m&apos;engager
              </Link>
              <Link href="/"
                className="px-10 py-4 rounded-full font-semibold text-white/70 text-sm border border-white/20 hover:text-white hover:border-white/40 transition-all">
                Retour à l&apos;accueil
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
