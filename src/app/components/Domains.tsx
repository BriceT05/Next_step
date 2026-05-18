"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { DOMAINS, type Domain } from "@/app/data/domains";

function DomainCard({ domain, index, tall }: { domain: Domain; index: number; tall?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className={tall ? "h-[460px] md:h-[500px]" : "h-[360px] md:h-[400px]"}
    >
      <Link
        href={`/domaines/${domain.slug}`}
        className="group relative block w-full h-full rounded-3xl overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A657]"
      >
        {/* Background image with zoom */}
        <Image
          src={domain.bg}
          alt={domain.title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Permanent dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1416]/95 via-[#0A1416]/50 to-[#0A1416]/10" />

        {/* Colored accent overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${domain.color}99, transparent 65%)` }}
        />

        {/* Top: index number */}
        <div className="absolute top-6 right-6">
          <span className="text-white/20 text-5xl font-black leading-none tabular-nums select-none group-hover:text-white/10 transition-colors">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          {/* Category label */}
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ color: domain.color, background: `${domain.color}20`, border: `1px solid ${domain.color}35` }}
            >
              Domaine d&apos;action
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-white text-xl sm:text-2xl font-bold leading-tight mb-2 transition-colors duration-300"
            style={{ ["--hover-color" as string]: domain.color }}
          >
            <span className="group-hover:text-[var(--hover-color)] transition-colors duration-300">
              {domain.title}
            </span>
          </h3>

          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-2">{domain.description}</p>

          {/* Sub-domains chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {domain.subdomains.slice(0, tall ? 5 : 4).map((sub) => (
              <span
                key={sub.title}
                className="text-xs px-2.5 py-1 rounded-full bg-white/8 backdrop-blur-sm border border-white/12 text-white/65 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/25"
              >
                {sub.title}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div
            className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            style={{ color: domain.color }}
          >
            <span>Explorer ce domaine</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Bottom color accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"
          style={{ background: `linear-gradient(90deg, ${domain.color}, ${domain.secondaryColor})` }}
        />

        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: "-120%" }}
          whileHover={{ x: "220%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </Link>
    </motion.div>
  );
}

export default function Domains() {
  const row1 = DOMAINS.slice(0, 2);
  const row2 = DOMAINS.slice(2, 5);

  return (
    <section id="domains" className="py-24 bg-[#0D1B1D] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
          style={{ background: "#D9A657" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-8"
          style={{ background: "#12A89D" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#D9A657] text-xs font-bold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full border border-[#D9A657]/20 bg-[#D9A657]/8">
            Nos axes stratégiques
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-2 mb-4 leading-tight">
            Nos{" "}
            <span className="relative">
              <span className="text-[#D9A657]">Domaines</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, #D9A657, #12A89D)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>{" "}
            d&apos;Action
          </h2>
          <p className="text-white/45 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            5 grands domaines pour un impact profond et durable sur la jeunesse africaine.
          </p>
        </motion.div>

        {/* Domain grid — Row 1: 2 tall cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {row1.map((domain, i) => (
            <DomainCard key={domain.slug} domain={domain} index={i} tall />
          ))}
        </div>

        {/* Domain grid — Row 2: 3 shorter cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {row2.map((domain, i) => (
            <DomainCard key={domain.slug} domain={domain} index={i + 2} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-white/35 text-sm mb-4">Chaque domaine ouvre vers des projets concrets et des opportunités réelles.</p>
          <Link
            href="/#join"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold border border-[#D9A657]/35 text-[#D9A657] hover:bg-[#D9A657]/10 hover:border-[#D9A657]/60 transition-all duration-300 hover:scale-105"
          >
            Rejoindre le mouvement
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
