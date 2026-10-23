"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem("ns_cookie_consent");
    if (!choice) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("ns_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("ns_cookie_consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 inset-x-0 sm:bottom-4 sm:left-auto sm:right-6 sm:max-w-sm z-[60]"
        >
          {/* sur mobile : une barre compacte en bas d'écran, qui ne masque pas le contenu */}
          <div className="bg-[#013A30] border-t sm:border border-[#C49A00]/20 sm:rounded-2xl px-4 py-3 sm:p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <span className="hidden sm:inline text-2xl flex-shrink-0">🍪</span>
              <div>
                <p className="hidden sm:block text-white font-semibold text-sm mb-1">Cookies & confidentialité</p>
                <p className="text-white/80 text-xs leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience.{" "}
                  <Link href="/politique-de-confidentialite" className="text-[#C49A00] hover:underline">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 bg-[#C49A00] text-[#013A30] py-2 sm:py-2.5 rounded-xl font-bold text-sm hover:bg-[#A88400] transition-all"
              >
                Accepter
              </button>
              <button
                onClick={decline}
                className="flex-1 border border-white/25 text-white/80 py-2 sm:py-2.5 rounded-xl text-sm hover:border-white/60 hover:text-white transition-all"
              >
                Refuser
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
