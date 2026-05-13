"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Partner } from "@/lib/supabase";

const STATIC_PARTNERS = [
  { id: "1", name: "UCAD", full_name: "Université Cheikh Anta Diop", logo_url: "/partners/ucad.png", website: "https://www.ucad.sn" },
  { id: "2", name: "ANPEJ", full_name: "Agence Nationale Pour l'Emploi des Jeunes", logo_url: "/partners/anpej.jpg", website: "https://www.anpej.sn" },
  { id: "3", name: "CTIC", full_name: "Centre TIC Dakar", logo_url: "/partners/ctic.jpg", website: "https://www.cticdakar.com" },
  { id: "4", name: "FONGIP", full_name: "Fonds de Garantie des Investissements Prioritaires", logo_url: "/partners/fongip.jpg", website: "https://www.fongip.sn" },
  { id: "5", name: "Orange SN", full_name: "Orange Sénégal", logo_url: "/partners/orange.jpg", website: "https://www.orange.sn" },
  { id: "6", name: "DER/FJ", full_name: "Délégation Générale à l'Entrepreneuriat Rapide", logo_url: "/partners/der.jpg", website: "https://www.der.gouv.sn" },
  { id: "7", name: "MESRI", full_name: "Ministère de l'Enseignement Supérieur et de la Recherche", logo_url: "/partners/mesri.jpg", website: "https://www.enseignementsup.gouv.sn" },
  { id: "8", name: "ADEPME", full_name: "Agence de Développement et d'Encadrement des PME", logo_url: "/partners/adepme.jpg", website: "https://www.adepme.sn" },
];

interface Props { dbPartners?: Partner[] }

export default function Partners({ dbPartners }: Props) {
  const partners = dbPartners ?? STATIC_PARTNERS;

  return (
    <section id="partners" className="py-24 bg-white section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#12A89D] text-sm font-semibold tracking-widest uppercase">Ils nous font confiance</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#182426] mt-3 mb-4">
            Partenaires & <span className="gradient-text">Sponsors</span>
          </h2>
          <p className="text-[#5A6A70] max-w-xl mx-auto">
            Des institutions publiques, entreprises privées et organisations internationales qui croient en notre mission.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.website ?? "#"}
              target={p.website ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.04 }}
              className="group bg-[#F5F7F6] border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-[#D9A657]/30 transition-all cursor-pointer"
            >
              <div className="w-20 h-16 rounded-xl bg-white flex items-center justify-center mb-3 overflow-hidden p-1.5">
                {p.logo_url ? (
                  <Image src={p.logo_url} alt={p.name} width={72} height={56} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-[#D9A657] font-bold text-xl">{p.name.charAt(0)}</span>
                )}
              </div>
              <div className="text-[#182426] font-bold text-sm group-hover:text-[#D9A657] transition-colors">{p.name}</div>
              <div className="text-[#5A6A70] text-xs mt-1 leading-tight">{p.full_name}</div>
              {p.website && (
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#12A89D] text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Visiter le site
                </div>
              )}
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 p-8 border border-dashed border-gray-300 rounded-2xl"
        >
          <p className="text-[#5A6A70] mb-4">Vous souhaitez devenir partenaire de Next Step.sn ?</p>
          <a href="#join"
            className="inline-flex items-center gap-2 bg-transparent border border-[#D9A657]/50 text-[#D9A657] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#D9A657]/10 transition-all">
            Nous contacter
          </a>
        </motion.div>
      </div>
    </section>
  );
}
