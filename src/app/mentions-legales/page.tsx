import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Next Step.sn",
  description: "Mentions légales de Next Step.sn",
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#182426] text-white">
      {/* Header */}
      <header className="border-b border-[#74878B]/15 py-5 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D9A657]/30">
              <Image src="/logo.jpg" alt="Next Step.sn" fill sizes="40px" className="object-cover" />
            </div>
            <span className="font-bold text-white">Next Step.sn</span>
          </Link>
          <Link href="/" className="text-[#74878B] text-sm hover:text-[#D9A657] transition-colors">
            ← Retour au site
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mentions légales</h1>
        <p className="text-[#74878B] text-sm mb-12">Dernière mise à jour : mai 2025</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              1. Éditeur du site
            </h2>
            <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 space-y-2">
              <p><span className="text-[#74878B]">Nom :</span> <strong className="text-white">Next Step.sn</strong></p>
              <p><span className="text-[#74878B]">Nature :</span> Organisation de jeunesse à but non lucratif</p>
              <p><span className="text-[#74878B]">Siège social :</span> Dakar, Sénégal</p>
              <p><span className="text-[#74878B]">Email :</span>{" "}
                <a href="mailto:nextstep2k25@gmail.com" className="text-[#D9A657] hover:underline">
                  nextstep2k25@gmail.com
                </a>
              </p>
              <p><span className="text-[#74878B]">Téléphone :</span> +221 71 050 65 88 / +221 77 860 51 82</p>
              <p><span className="text-[#74878B]">Année de création :</span> 2025</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              2. Hébergement
            </h2>
            <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 space-y-2">
              <p><span className="text-[#74878B]">Hébergeur :</span> <strong className="text-white">Vercel Inc.</strong></p>
              <p><span className="text-[#74878B]">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><span className="text-[#74878B]">Site :</span>{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#D9A657] hover:underline">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              3. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes, vidéos) est la propriété
              exclusive de Next Step.sn, sauf mention contraire. Toute reproduction, distribution ou
              utilisation sans autorisation écrite préalable est strictement interdite.
            </p>
            <p className="mt-3">
              Les logos des partenaires affichés sur ce site restent la propriété de leurs organisations
              respectives et sont utilisés avec leur accord.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              4. Responsabilité
            </h2>
            <p>
              Next Step.sn s&apos;efforce de maintenir les informations de ce site à jour et exactes.
              Cependant, nous ne pouvons garantir l&apos;exactitude, l&apos;exhaustivité ou l&apos;actualité
              des informations diffusées.
            </p>
            <p className="mt-3">
              Next Step.sn ne saurait être tenu responsable des dommages directs ou indirects résultant
              de l&apos;utilisation de ce site ou de l&apos;impossibilité d&apos;y accéder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              5. Liens externes
            </h2>
            <p>
              Ce site peut contenir des liens vers des sites tiers. Next Step.sn n&apos;exerce aucun
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs
              pratiques en matière de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              6. Données personnelles
            </h2>
            <p>
              Le traitement de vos données personnelles est décrit dans notre{" "}
              <Link href="/politique-de-confidentialite" className="text-[#D9A657] hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#12A89D] rounded-full inline-block" />
              7. Droit applicable
            </h2>
            <p>
              Les présentes mentions légales sont régies par le droit sénégalais. Tout litige relatif
              à l&apos;utilisation de ce site sera soumis à la compétence exclusive des tribunaux de Dakar,
              Sénégal.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#74878B]/10 py-6 px-6 text-center text-[#74878B] text-sm">
        <p>© 2025 Next Step.sn. Tous droits réservés.</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/politique-de-confidentialite" className="hover:text-[#D9A657] transition-colors">Politique de confidentialité</Link>
          <Link href="/mentions-legales" className="hover:text-[#D9A657] transition-colors">Mentions légales</Link>
        </div>
      </footer>
    </div>
  );
}
