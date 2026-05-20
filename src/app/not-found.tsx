import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#182426] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#D9A657]/30">
            <Image src="/Logo nextstep.jpeg" alt="Next Step.sn" fill sizes="80px" className="object-cover" />
          </div>
        </div>

        <div className="text-[#D9A657] text-8xl font-black leading-none mb-4 opacity-20">404</div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Page introuvable
        </h1>
        <p className="text-white/50 text-lg leading-relaxed mb-10">
          Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil pour explorer Next Step.sn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#D9A657] text-[#182426] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#c49040] transition-all hover:scale-105"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/actualites"
            className="border border-[#12A89D]/40 text-[#12A89D] px-8 py-4 rounded-full font-semibold text-sm hover:bg-[#12A89D]/10 transition-all"
          >
            Voir les actualités
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap gap-3 justify-center">
          {[
            { label: "À propos", href: "/#about" },
            { label: "Nos projets", href: "/#projects" },
            { label: "Rejoindre NS", href: "/#join" },
            { label: "Partenaires", href: "/#partners" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-white/30 text-sm hover:text-[#D9A657] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
