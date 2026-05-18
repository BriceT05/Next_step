"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: 100, suffix: "+", label: "Jeunes impactés", sub: "Depuis 2025", pct: 85 },
  { value: 1, suffix: "+", label: "Projets réalisés", sub: "Toutes régions", pct: 75 },
  { value: 1, suffix: "+", label: "Formations", sub: "Organisées", pct: 65 },
  { value: 8, suffix: "+", label: "Partenaires", sub: "Actifs", pct: 60 },
  { value: 1, suffix: "", label: "Régions", sub: "Couvertes", pct: 100 },
];

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function RingCounter({
  value,
  suffix,
  label,
  sub,
  pct,
  color,
}: {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  pct: number;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (!inView) return;
    const duration = 2400;
    const steps = 80;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(Math.round(increment * step), value));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center group">
      {/* SVG ring */}
      <div className="relative mb-4">
        <svg width="100" height="100" viewBox="0 0 100 100" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={`${color}15`}
            strokeWidth="5"
          />
          {/* Progress */}
          <motion.circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 2.2, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        {/* Center icon */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{ color }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
      </div>

      <div className="text-4xl font-bold tracking-tight" style={{ color }}>
        {count.toLocaleString("fr-FR")}
        {suffix}
      </div>
      <div className="text-white font-semibold text-sm mt-1">{label}</div>
      <div className="text-white/60 text-xs mt-0.5">{sub}</div>
    </div>
  );
}

const COLORS = ["#D9A657", "#12A89D", "#D9A657", "#12A89D", "#0A7F78"];

export default function Stats() {
  return (
    <section id="stats" className="py-28 relative overflow-hidden bg-[#182426]">
      {/* Background photo */}
      <Image
        src="/bg-flag.jpg"
        alt="Sénégal"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Teal-branded overlay */}
      <div className="absolute inset-0 bg-[#182426]/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#12A89D]/15 via-transparent to-[#D9A657]/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#D9A657] text-sm font-semibold tracking-widest uppercase">
            Notre impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Des chiffres qui <span className="gradient-text">parlent</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Chaque chiffre représente une vie transformée, une opportunité créée,
            un avenir construit.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <RingCounter
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                sub={s.sub}
                pct={s.pct}
                color={COLORS[i]}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-white/70 text-lg mb-7">
            Rejoignez le mouvement et faites partie de ces statistiques.
          </p>
          <motion.a
            href="#join"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D9A657] to-[#c49040] text-[#182426] px-10 py-4 rounded-full font-bold text-base shadow-xl shadow-[#D9A657]/20"
          >
            Rejoindre Next Step.sn
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
