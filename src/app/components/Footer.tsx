"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DOMAINS } from "@/app/data/domains";
import { whatsappHref } from "@/lib/settings";
import { SocialIcon, WhatsAppIcon } from "./icons";
import { useSettings } from "./SiteDataContext";

const quickLinks = [
  { label: "Notre histoire", href: "/qui-sommes-nous/notre-histoire" },
  { label: "Mission et valeurs", href: "/qui-sommes-nous/mission-et-valeurs" },
  { label: "Notre équipe", href: "/qui-sommes-nous/notre-equipe" },
  { label: "Nos partenaires", href: "/qui-sommes-nous/nos-partenaires" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const SITE = useSettings();
  const SOCIALS = SITE.socials;
  const whatsappLink = (text: string) => whatsappHref(SITE, text);
  const [email, setEmail] = useState("");
  const [waHref, setWaHref] = useState<string | null>(null);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setWaHref(whatsappLink(`Inscription à la lettre d'information — Next Step.sn\n\nE-mail : ${email}`));
    setEmail("");
  };

  return (
    <footer className="bg-ns-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Image src="/logo-nextstep.png" alt="Next Step.sn — Ose rêver" width={1268} height={351} className="h-14 w-auto mb-4" />
            <p className="font-hand text-gold text-3xl leading-none mb-3">{SITE.slogan}</p>
            <p className="text-white/80 text-sm leading-relaxed mb-5">
              Association sénégalaise de jeunesse, créée en 2025 et présente dans les 14 régions du pays.
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-ink transition-colors"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-gold mb-4">Nos domaines</h3>
            <ul className="space-y-2.5">
              {DOMAINS.map((d) => (
                <li key={d.slug}>
                  <Link href={`/domaines/${d.slug}`} className="group flex items-center gap-2.5 text-sm text-white/85 hover:text-white">
                    <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white/30" style={{ background: d.color }} />
                    <span>
                      <span className="font-semibold">{d.name}</span> · {d.theme}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-display font-bold text-gold mt-7 mb-4">Liens rapides</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/85 hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-gold mb-4">Coordonnées</h3>
            <ul className="space-y-3 text-sm text-white/85">
              <li>{SITE.city}</li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-gold break-all">
                  {SITE.email}
                </a>
              </li>
              {SITE.phones.map((p) => (
                <li key={p.wa}>
                  <a href={`tel:+${p.wa}`} className="hover:text-gold">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink("Bonjour Next Step.sn !")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-[#128C4B] text-white px-5 py-3 rounded-full font-bold text-sm hover:brightness-110"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Écrire sur WhatsApp
            </a>
          </div>

          <div>
            <h3 className="font-display font-bold text-gold mb-2">Lettre d&apos;information</h3>
            <p className="text-white/80 text-sm mb-4">Reçois nos actualités, nos événements et nos appels à candidatures.</p>
            {waHref ? (
              <div>
                <p className="text-sm text-white/90 mb-3">Dernière étape : confirme ton inscription sur WhatsApp.</p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#128C4B] text-white py-3 rounded-full font-bold text-sm hover:brightness-110"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Confirmer sur WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  Ton adresse e-mail
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  className="w-full bg-white/10 border border-white/25 rounded-full px-5 py-3 text-white text-sm placeholder-white/60 focus:outline-none focus:border-gold"
                />
                <button type="submit" className="w-full bg-gold text-ink py-3 rounded-full font-bold text-sm hover:brightness-110 transition">
                  Je m&apos;inscris
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/75 text-xs">
          <span>© {new Date().getFullYear()} Next Step.sn. Tous droits réservés.</span>
          <div className="flex gap-6">
            <Link href="/politique-de-confidentialite" className="hover:text-gold">
              Politique de confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-gold">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
