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
function Counter({ target }: { target: string }) {
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

  const display = isNaN(num)
    ? target
    : `${prefix}${num >= 1000 ? Math.round(count).toLocaleString("fr-FR") : count % 1 === 0 ? Math.round(count) : count.toFixed(1)}${postfix}`;

  return <span ref={ref}>{display}</span>;
}

/* ─── Subdomain card ────────────────────────────────────────────── */
function SubdomainCard({
  sub,
  index,
  color,
  tall,
}: {
  sub: { title: string; icon: string; img: string };
  index: number;
  color: string;
  tall?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={tall ? "h-[320px]" : "h-[240px]"}
    >
      <div className="group relative block w-full h-full rounded-2xl overflow-hidden cursor-default">
        {/* Background image */}
        <Image
          src={sub.img}
          alt={sub.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, 50vw"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1416]/95 via-[#0A1416]/45 to-[#0A1416]/10" />

        {/* Color hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${color}99, transparent 60%)` }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="text-white font-bold text-base sm:text-lg leading-snug transition-colors duration-300 group-hover:text-[var(--hc)]"
            style={{ ["--hc" as string]: color }}
          >
            {sub.title}
          </h3>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
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
            <Link href="/#domains" className="hover:text-white transition-colors">Domaines</Link>
            <span>/</span>
            <span style={{ color: domain.color }} className="font-semibold">{domain.title}</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#182426]">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={domain.bg}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,20,22,0.55) 0%, rgba(10,20,22,0.78) 55%, rgba(10,20,22,0.96) 100%)" }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${domain.color}28, transparent 70%)` }} />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${8 + i * 5}px`,
              height: `${8 + i * 5}px`,
              background: `${domain.color}${25 + i * 10}`,
              left: `${8 + i * 15}%`,
              top: `${25 + (i % 3) * 22}%`,
            }}
            animate={{ y: [0, -22, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-28 pb-24">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl"
                style={{ background: `${domain.color}20`, border: `1.5px solid ${domain.color}45` }}
              >
                {domain.icon}
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{ border: `2px solid ${domain.color}` }}
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <span className="text-xs font-bold tracking-[0.25em] uppercase mb-5 block" style={{ color: domain.color }}>
              Domaine d&apos;action — Next Step.sn
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-tight">
              {domain.title}
            </h1>
            <p className="text-xl sm:text-2xl text-white/55 font-light mb-4">{domain.tagline}</p>
            <p className="text-base text-white/38 max-w-2xl mx-auto leading-relaxed">{domain.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Link
              href="/#join"
              className="px-8 py-4 rounded-full font-bold text-[#182426] text-sm tracking-wide hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              style={{ background: domain.color }}
            >
              Rejoindre ce domaine
            </Link>
            <Link
              href="/#projects"
              className="px-8 py-4 rounded-full font-semibold text-white text-sm border border-white/20 hover:border-white/40 hover:bg-white/6 transition-all"
            >
              Voir les projets liés
            </Link>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 rounded-full bg-white/40" />
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
                className="text-center p-6 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: domain.color }}>
                  <Counter target={stat.value} />
                </div>
                <div className="text-white/45 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOUS-DOMAINES ── */}
      <section className="py-24 bg-[#0D1B1D] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10" style={{ background: domain.color }} />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[100px] opacity-8" style={{ background: domain.secondaryColor }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full border" style={{ color: domain.color, borderColor: `${domain.color}30`, background: `${domain.color}10` }}>
              Périmètre d&apos;intervention
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-3">Nos Sous-domaines</h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Ce domaine couvre plusieurs axes complémentaires pour un impact maximal.
            </p>
          </motion.div>

          {/* Row 1 — 2 grandes cartes */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {domain.subdomains.slice(0, 2).map((sub, i) => (
              <SubdomainCard key={sub.title} sub={sub} index={i} color={domain.color} tall />
            ))}
          </div>

          {/* Row 2 — reste des cartes */}
          {domain.subdomains.length > 2 && (
            <div className={`grid gap-4 ${domain.subdomains.length - 2 === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {domain.subdomains.slice(2).map((sub, i) => (
                <SubdomainCard key={sub.title} sub={sub} index={i + 2} color={domain.color} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      <section className="py-24 bg-[#F8FAFA]">
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
            <motion.div
              variants={fadeUp}
              className="p-6 rounded-2xl border-l-4"
              style={{ borderColor: domain.color, background: `${domain.color}08` }}
            >
              <p className="text-[#182426] font-medium leading-relaxed">{domain.impact}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── OBJECTIFS ── */}
      <section className="py-24 bg-white">
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
                className="flex items-start gap-4 p-5 bg-[#F8FAFA] rounded-2xl border border-[#E5EAEB] hover:shadow-md hover:border-opacity-50 transition-all"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-extrabold"
                  style={{ background: `${domain.color}18`, color: domain.color }}
                >
                  {i + 1}
                </div>
                <p className="text-[#182426] font-medium leading-snug">{obj}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROGRAMMES ── */}
      <section className="py-24 bg-[#182426] relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${domain.color}06, transparent 70%)` }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: domain.color }}>Nos programmes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Programmes associés</h2>
            <p className="text-white/40 mt-3 max-w-xl mx-auto">Des programmes concrets pour atteindre nos objectifs dans ce domaine.</p>
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
                className="group p-6 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${domain.color}10, transparent 70%)` }}
                />
                <div className="relative">
                  {prog.duration && (
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block"
                      style={{ color: domain.color, background: `${domain.color}18` }}
                    >
                      {prog.duration}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-base mb-3 group-hover:text-[var(--hc)] transition-colors" style={{ ["--hc" as string]: domain.color }}>
                    {prog.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{prog.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJETS LIÉS ── */}
      {related.length > 0 && (
        <section className="py-24 bg-white">
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
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {related.map((proj) => (
                <motion.div key={proj.slug} variants={fadeUp} whileHover={{ y: -6 }}>
                  <Link
                    href={`/projets/${proj.slug}`}
                    className="group block relative rounded-2xl overflow-hidden h-[200px]"
                  >
                    <Image src={proj.bg} alt={proj.title} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-110" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#182426]/90 via-[#182426]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                        style={{ color: proj.color, background: `${proj.color}20` }}
                      >
                        {proj.category}
                      </span>
                      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-[#D9A657] transition-colors">{proj.title}</h3>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
                      style={{ background: proj.color }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── AUTRES DOMAINES ── */}
      <section className="py-20 bg-[#F8FAFA]">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 hover:shadow-md"
                  style={{ color: d.color, borderColor: `${d.color}40`, background: `${d.color}08` }}
                >
                  <span>{d.icon}</span>
                  <span>{d.title}</span>
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
            <span className="text-5xl mb-6 block">{domain.icon}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à rejoindre le domaine <span style={{ color: domain.color }}>{domain.title}</span> ?
            </h2>
            <p className="text-white/45 mb-10 text-lg">
              Rejoins des centaines de jeunes engagés qui construisent l&apos;Afrique de demain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#join"
                className="px-10 py-4 rounded-full font-bold text-[#182426] text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                style={{ background: domain.color }}
              >
                Je veux m&apos;engager
              </Link>
              <Link
                href="/"
                className="px-10 py-4 rounded-full font-semibold text-white/65 text-sm border border-white/20 hover:text-white hover:border-white/40 transition-all"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
