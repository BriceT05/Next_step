import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Next Step.sn",
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#013A30] text-white">

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mentions légales</h1>
        <p className="text-[#B9C7C4] text-sm mb-12">Dernière mise à jour : mai 2025</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
              1. Éditeur du site
            </h2>
            <div className="bg-white/3 border border-[#B9C7C4]/20 rounded-2xl p-6 space-y-2">
              <p><span className="text-[#B9C7C4]">Nom :</span> <strong className="text-white">Next Step.sn</strong></p>
              <p><span className="text-[#B9C7C4]">Nature :</span> Organisation de jeunesse à but non lucratif</p>
              <p><span className="text-[#B9C7C4]">Siège social :</span> Dakar, Sénégal</p>
              <p><span className="text-[#B9C7C4]">Email :</span>{" "}
                <a href="mailto:nextstep2k25@gmail.com" className="text-[#C49A00] hover:underline">
                  nextstep2k25@gmail.com
                </a>
              </p>
              <p><span className="text-[#B9C7C4]">Téléphone :</span> +221 71 050 65 88 / +221 77 860 51 82</p>
              <p><span className="text-[#B9C7C4]">Année de création :</span> 2025</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
              2. Hébergement
            </h2>
            <div className="bg-white/3 border border-[#B9C7C4]/20 rounded-2xl p-6 space-y-2">
              <p><span className="text-[#B9C7C4]">Hébergeur :</span> <strong className="text-white">Vercel Inc.</strong></p>
              <p><span className="text-[#B9C7C4]">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><span className="text-[#B9C7C4]">Site :</span>{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#C49A00] hover:underline">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
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
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
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
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
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
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
              6. Données personnelles
            </h2>
            <p>
              Le traitement de vos données personnelles est décrit dans notre{" "}
              <Link href="/politique-de-confidentialite" className="text-[#C49A00] hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#3FBFA6] rounded-full inline-block" />
              7. Droit applicable
            </h2>
            <p>
              Les présentes mentions légales sont régies par le droit sénégalais. Tout litige relatif
              à l&apos;utilisation de ce site sera soumis à la compétence exclusive des tribunaux de Dakar,
              Sénégal.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
