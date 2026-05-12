"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "À propos", href: "#about" },
  { label: "Domaines", href: "#domains" },
  { label: "Projets", href: "#projects" },
  { label: "Statistiques", href: "#stats" },
  { label: "Actualités", href: "#news" },
  { label: "Galerie", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#D9A657]/40 group-hover:ring-[#D9A657] transition-all shadow-lg shadow-[#D9A657]/10">
              <Image src="/logo.jpg" alt="Next Step.sn" fill sizes="48px" className="object-cover" />
            </div>
            <div>
              <span className="text-white font-bold text-base">Next </span>
              <span className="text-[#D9A657] font-bold text-base">Step.sn</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#4A5868] hover:text-[#D9A657] transition-colors text-sm font-medium tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#join"
              className="bg-[#D9A657] text-[#182426] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#c49040] transition-all hover:scale-105 shadow-lg shadow-[#D9A657]/20"
            >
              Rejoindre
            </a>
          </div>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-[#182426] origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-[#182426]"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-[#182426] origin-center"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white backdrop-blur-md border-t border-gray-200 shadow-md"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#4A5868] hover:text-[#D9A657] py-1 text-base font-medium transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#join"
                className="bg-[#D9A657] text-[#182426] px-5 py-3 rounded-full font-bold text-sm text-center mt-2 hover:bg-[#c49040] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Rejoindre le mouvement
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
