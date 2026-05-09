import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Next Step.sn",
  description: "Politique de confidentialité de Next Step.sn",
};

export default function PolitiqueConfidentialite() {
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-[#74878B] text-sm mb-12">Dernière mise à jour : mai 2025</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              1. Présentation
            </h2>
            <p>
              Next Step.sn est une organisation de jeunesse basée à Dakar, Sénégal, engagée dans l&apos;accompagnement,
              la formation et la valorisation des jeunes leaders, entrepreneurs et innovateurs africains.
            </p>
            <p className="mt-3">
              La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons
              vos données personnelles lorsque vous utilisez notre site web <strong className="text-white">nextstep.sn</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              2. Données collectées
            </h2>
            <p>Nous collectons uniquement les informations que vous nous fournissez volontairement :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Nom et prénom (formulaire d'inscription)",
                "Adresse email (formulaire d'inscription et newsletter)",
                "Numéro de téléphone (facultatif)",
                "Message libre (formulaire de contact)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#12A89D] mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Nous ne collectons aucune donnée de navigation, cookie de traçage ou donnée sensible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              3. Utilisation des données
            </h2>
            <p>Les informations collectées sont utilisées exclusivement pour :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Traiter votre demande d'adhésion ou de participation",
                "Vous envoyer des informations sur nos activités et événements",
                "Vous recontacter suite à votre demande de partenariat",
                "Gérer notre newsletter",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#12A89D] mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              4. Conservation et sécurité
            </h2>
            <p>
              Vos données sont conservées le temps nécessaire à la finalité pour laquelle elles ont été
              collectées, et au maximum 3 ans après votre dernier contact avec notre organisation.
            </p>
            <p className="mt-3">
              Nous prenons toutes les mesures raisonnables pour protéger vos informations contre tout
              accès non autorisé, modification, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              5. Partage des données
            </h2>
            <p>
              Next Step.sn ne vend, ne loue et ne partage pas vos données personnelles avec des tiers,
              sauf obligation légale ou avec votre consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              6. Vos droits
            </h2>
            <p>Conformément aux réglementations applicables, vous disposez des droits suivants :</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Droit d'accès à vos données personnelles",
                "Droit de rectification en cas d'inexactitude",
                "Droit de suppression (droit à l'oubli)",
                "Droit d'opposition au traitement de vos données",
                "Droit à la portabilité de vos données",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#12A89D] mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à :{" "}
              <a href="mailto:nextstep2k25@gmail.com" className="text-[#D9A657] hover:underline">
                nextstep2k25@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#D9A657] rounded-full inline-block" />
              7. Contact
            </h2>
            <div className="bg-white/3 border border-[#74878B]/20 rounded-2xl p-6 space-y-2">
              <p className="font-semibold text-white">Next Step.sn</p>
              <p>Dakar, Sénégal</p>
              <p>Email : <a href="mailto:nextstep2k25@gmail.com" className="text-[#D9A657] hover:underline">nextstep2k25@gmail.com</a></p>
              <p>Tél : +221 71 050 65 88 / +221 77 860 51 82</p>
            </div>
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
