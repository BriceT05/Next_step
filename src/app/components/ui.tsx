import Image from "next/image";
import Link from "next/link";
import { type Domain, domainTheme, getDomainBySlug } from "@/app/data/domains";
import { type ProjectData, type ProjectStatus, STATUS_LABEL } from "@/app/data/projects";
import { ArrowIcon, DomainIcon, WhatsAppIcon } from "./icons";
import { WhatsAppLink } from "./SiteDataContext";

/** next/image pour les images locales ou Supabase, <img> simple pour les autres hébergeurs. */
export function SmartImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const optimizable = src.startsWith("/") || src.includes(".supabase.co/storage/v1/object/public/");
  if (optimizable) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 w-full h-full object-cover ${className}`} />
  );
}

export function SectionTitle({
  kicker,
  title,
  text,
  align = "center",
  onDark = false,
}: {
  kicker?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "center" | "left";
  onDark?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : ""} max-w-2xl mb-10 sm:mb-12`}>
      {kicker && (
        <p className={`text-sm font-bold tracking-widest uppercase mb-2 ${onDark ? "text-gold" : "text-gold-ink"}`}>
          {kicker}
        </p>
      )}
      <h2 className={`font-display font-bold text-3xl sm:text-4xl leading-tight ${onDark ? "text-white" : "text-ns"}`}>
        {title}
      </h2>
      <span className={`block h-1 w-16 rounded-full bg-gold mt-4 ${align === "center" ? "mx-auto" : ""}`} />
      {text && <p className={`mt-4 text-base sm:text-lg leading-relaxed ${onDark ? "text-white/85" : "text-muted"}`}>{text}</p>}
    </div>
  );
}

const STATUS_STYLE: Record<ProjectStatus, string> = {
  "a-venir": "bg-gold text-ink",
  "en-cours": "bg-white text-dc-deep",
  termine: "bg-ink text-white",
};

export function StatusBadge({ status, className = "" }: { status: ProjectStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${STATUS_STYLE[status]} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function DomainChip({ domain, className = "" }: { domain: Domain; className?: string }) {
  return (
    <Link
      href={`/domaines/${domain.slug}`}
      style={domainTheme(domain)}
      className={`inline-flex items-center gap-1.5 bg-dc-deep text-white text-xs font-bold px-3 py-1 rounded-full hover:brightness-110 ${className}`}
    >
      <DomainIcon name={domain.icon} className="w-3.5 h-3.5" />
      {domain.name}
    </Link>
  );
}

/** Carte projet : hérite de la couleur de son domaine. */
export function ProjectCard({ project }: { project: ProjectData }) {
  const domain = getDomainBySlug(project.domainSlug)!;
  return (
    <article
      style={domainTheme(domain)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-pearl shadow-sm hover:shadow-xl transition-shadow flex flex-col"
    >
      <div className="relative aspect-[16/10] bg-dc-light">
        <SmartImage
          src={project.cover}
          alt={project.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <StatusBadge status={project.status} className="absolute top-3 left-3" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-dc-deep text-white text-xs font-bold px-3 py-1 rounded-full">
          <DomainIcon name={domain.icon} className="w-3.5 h-3.5" />
          {domain.name}
        </span>
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <p className="text-dc-deep text-xs font-bold uppercase tracking-wide mb-1">{project.period}</p>
        <h3 className="font-display font-bold text-xl text-ink leading-snug">
          <Link href={`/projets/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="text-muted text-[15px] leading-relaxed mt-2 line-clamp-3">{project.summary}</p>
        <span className="mt-auto pt-4 inline-flex items-center gap-2 text-dc-deep font-bold text-sm">
          Voir le projet
          <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </article>
  );
}

/** Bandeau de haut de page pour les pages intérieures (vert de la marque). */
export function PageHero({
  kicker,
  title,
  text,
  crumbs = [],
}: {
  kicker?: string;
  title: string;
  text?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="bg-ns text-white compass-watermark on-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-12 lg:pb-16">
        <Breadcrumb crumbs={crumbs} />
        {kicker && <p className="font-hand text-gold text-3xl leading-none mb-2">{kicker}</p>}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight max-w-3xl">{title}</h1>
        {text && <p className="mt-4 text-white/90 text-lg leading-relaxed max-w-2xl">{text}</p>}
      </div>
    </section>
  );
}

export function Breadcrumb({ crumbs }: { crumbs: { label: string; href?: string }[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Fil d'Ariane" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/90">
        <li>
          <Link href="/" className="hover:text-white underline-offset-4 hover:underline">
            Accueil
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span aria-hidden>›</span>
            {c.href ? (
              <Link href={c.href} className="hover:text-white underline-offset-4 hover:underline">
                {c.label}
              </Link>
            ) : (
              <span className="font-semibold text-white" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Bouton WhatsApp flottant, présent sur toutes les pages (touche 7). */
export function WhatsAppFab() {
  return (
    <WhatsAppLink
      text="Bonjour Next Step.sn ! J'aimerais avoir des informations."
      aria-label="Écrire à l'équipe sur WhatsApp"
      className="fixed bottom-5 left-5 z-40 w-14 h-14 rounded-full bg-[#128C4B] text-white flex items-center justify-center shadow-xl shadow-black/20 hover:scale-105 transition-transform"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </WhatsAppLink>
  );
}

export function WhatsAppButton({
  text,
  children,
  className = "",
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <WhatsAppLink
      text={text}
      className={`inline-flex items-center justify-center gap-2 bg-[#128C4B] text-white px-6 py-3.5 rounded-full font-bold hover:brightness-110 transition ${className}`}
    >
      <WhatsAppIcon />
      {children}
    </WhatsAppLink>
  );
}

/** Appel à l'action de bas de page : « Ton prochain pas commence ici ». */
export function FinalCta() {
  return (
    <section className="bg-ns text-white compass-watermark on-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <p className="font-hand text-gold text-4xl leading-none mb-3">Ose rêver</p>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight">Ton prochain pas commence ici</h2>
        <p className="mt-4 text-white/90 text-lg">Rejoins l&apos;équipe, soutiens un projet ou écris-nous : on te répond.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/nous-rejoindre?profil=benevole" className="bg-gold text-ink px-7 py-3.5 rounded-full font-bold hover:brightness-110 transition">
            Devenir bénévole
          </Link>
          <Link href="/nous-rejoindre?profil=partenaire" className="bg-white text-ns px-7 py-3.5 rounded-full font-bold hover:bg-cream transition">
            Devenir partenaire
          </Link>
          <Link href="/contact" className="border-2 border-white/70 text-white px-7 py-3 rounded-full font-bold hover:bg-white/10 transition">
            Nous écrire
          </Link>
        </div>
      </div>
    </section>
  );
}
