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
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50"
        >
          <div className="bg-[#013A30] border border-[#C49A00]/20 rounded-2xl p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl flex-shrink-0">🍪</span>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Cookies & confidentialité</p>
                <p className="text-white/50 text-xs leading-relaxed">
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
                className="flex-1 bg-[#C49A00] text-[#013A30] py-2.5 rounded-xl font-bold text-sm hover:bg-[#A88400] transition-all"
              >
                Accepter
              </button>
              <button
                onClick={decline}
                className="flex-1 border border-[#74878B]/30 text-[#74878B] py-2.5 rounded-xl text-sm hover:border-[#74878B]/60 hover:text-white transition-all"
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
