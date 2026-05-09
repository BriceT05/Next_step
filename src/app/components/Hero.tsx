"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#182426]"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 hero-dots opacity-60" />

      {/* Animated blobs — parallax with scroll */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -50, 25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-[480px] h-[480px] bg-[#12A89D]/7 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 35, -25, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[10%] w-[420px] h-[420px] bg-[#D9A657]/6 rounded-full blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, 25, -15, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-[#005F5A]/9 rounded-full blur-[90px]"
        />
      </motion.div>

      {/* Grid frame lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#74878B]/10 to-transparent" />
        <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#74878B]/10 to-transparent" />
        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#74878B]/8 to-transparent" />
        <div className="absolute bottom-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#74878B]/8 to-transparent" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-20 pb-16">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#D9A657]/10 to-[#12A89D]/8 border border-[#D9A657]/25 rounded-full px-4 py-2 mb-7"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-[#D9A657] rounded-full shadow-lg shadow-[#D9A657]/50"
              />
              <span className="text-[#D9A657] text-sm font-semibold tracking-widest uppercase">
                Jeunesse · Innovation · Leadership
              </span>
            </motion.div>

            {/* Title — words staggered in */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="text-4xl sm:text-5xl xl:text-[64px] font-bold text-white leading-[1.1] tracking-tight mb-7"
            >
              {["Construisons", "la"].map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6 } },
                  }}
                  className="inline-block mr-3"
                >
                  {w}
                </motion.span>
              ))}
              <br />
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7 } },
                }}
                className="inline-block shimmer-text"
              >
                prochaine génération
              </motion.span>
              <br />
              {["de", "leaders", "africains."].map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6 } },
                  }}
                  className="inline-block mr-3"
                >
                  {w}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="text-[#74878B] text-lg leading-relaxed max-w-xl mb-10"
            >
              Next Step.sn accompagne les jeunes entrepreneurs, leaders et innovateurs
              du Sénégal et d&apos;Afrique vers la prochaine étape de leur réussite.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#join"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden bg-[#D9A657] text-[#182426] px-8 py-4 rounded-full font-bold text-base shadow-xl shadow-[#D9A657]/25 text-center"
              >
                <span className="relative z-10">Rejoindre le mouvement</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%", skewX: -15 }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.a>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, borderColor: "rgba(18,168,157,0.8)" }}
                whileTap={{ scale: 0.97 }}
                className="border-2 border-[#12A89D]/50 text-[#12A89D] px-8 py-4 rounded-full font-bold text-base hover:bg-[#12A89D]/8 transition-colors text-center"
              >
                Découvrir nos projets
              </motion.a>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex gap-8 mt-12 pt-8 border-t border-[#74878B]/15"
            >
              {[
                { n: "5 000+", l: "Jeunes impactés" },
                { n: "50+", l: "Projets réalisés" },
                { n: "14", l: "Régions touchées" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.12 }}
                >
                  <div className="text-2xl font-bold text-[#D9A657] tracking-tight">{s.n}</div>
                  <div className="text-[#74878B] text-xs mt-0.5 tracking-wide">{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Logo with orbit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center items-center"
          >
            <div className="relative w-72 h-72 lg:w-[400px] lg:h-[400px]">
              {/* Outer glow */}
              <div className="absolute inset-[-20px] rounded-full bg-[#12A89D]/6 blur-3xl pulse-ring" />

              {/* Orbit ring 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-24px] rounded-full border border-dashed border-[#D9A657]/20"
              >
                <div className="w-3 h-3 bg-[#D9A657] rounded-full absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 shadow-md shadow-[#D9A657]/60" />
              </motion.div>

              {/* Orbit ring 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-52px] rounded-full border border-[#12A89D]/15"
              >
                <div className="w-2.5 h-2.5 bg-[#12A89D] rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md shadow-[#12A89D]/60" />
                <div className="w-2 h-2 bg-[#74878B]/60 rounded-full absolute bottom-0 right-1/4 translate-y-1/2 shadow-sm" />
              </motion.div>

              {/* Logo */}
              <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-[#D9A657]/30 shadow-2xl shadow-[#12A89D]/15">
                <Image
                  src="/logo.jpg"
                  alt="Next Step.sn"
                  fill
                  priority
                  sizes="(max-width: 768px) 288px, 400px"
                  className="object-cover"
                />
              </div>

              {/* Floating tag */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-[#182426] border border-[#D9A657]/30 rounded-2xl px-4 py-2.5 shadow-xl"
              >
                <div className="text-[#D9A657] font-bold text-sm">Next Step.sn</div>
                <div className="text-[#74878B] text-xs">Dakar, Sénégal 🇸🇳</div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -left-6 bg-[#182426] border border-[#12A89D]/30 rounded-2xl px-4 py-2.5 shadow-xl"
              >
                <div className="text-[#12A89D] font-bold text-sm">5 000+</div>
                <div className="text-[#74878B] text-xs">Jeunes impactés</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#74878B] text-[10px] tracking-[0.3em] uppercase">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-[#74878B]/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-[#74878B]/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
