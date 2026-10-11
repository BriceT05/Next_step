import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#013A30] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 ">
            <Image src="/logo-emblem.png" alt="Next Step.sn" fill sizes="80px" className="object-contain" />
          </div>
        </div>

        <div className="text-[#C49A00] text-8xl font-black leading-none mb-4 opacity-20">404</div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Page introuvable
        </h1>
        <p className="text-white/80 text-lg leading-relaxed mb-10">
          Cette page n&apos;existe pas ou a été déplacée. Reviens à l&apos;accueil pour trouver ton prochain pas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#C49A00] text-[#013A30] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#A88400] transition-all hover:scale-105"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/actualites"
            className="border border-white/60 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Voir les actualités
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap gap-3 justify-center">
          {[
            { label: "Notre histoire", href: "/qui-sommes-nous/notre-histoire" },
            { label: "Nos domaines", href: "/domaines" },
            { label: "Nous rejoindre", href: "/nous-rejoindre" },
            { label: "Contact", href: "/contact" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-white/70 text-sm hover:text-[#C49A00] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
