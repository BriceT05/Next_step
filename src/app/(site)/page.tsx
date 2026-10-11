import Image from "next/image";
import Link from "next/link";
import { DOMAINS, domainTheme, getDomainBySlug } from "@/app/data/domains";
import { PROJECTS, getProjectsByDomain } from "@/app/data/projects";
import { HISTORY, NEXT_EVENT, PARTNERS } from "@/app/data/site";
import { getDbPartners, getMedia, getNews } from "@/lib/content";
import { ArrowIcon, DomainIcon } from "../components/icons";
import { Compass, Countdown, DreamWall, Reveal, StatsCounters } from "../components/home-widgets";
import { FinalCta, ProjectCard, SectionTitle, SmartImage } from "../components/ui";

// Les contenus gérés dans l'espace d'administration sont relus toutes les 5 minutes
export const revalidate = 300;

// Photos affichées tant que la galerie de l'administration est vide
const FALLBACK_PHOTOS = [
  { src: "/members.jpg", caption: "L'équipe Next Step.sn" },
  { src: "/bg-students.jpg", caption: "Avec les élèves" },
  { src: "/Oriantation.jpg", caption: "Orientation" },
  { src: "/bg-graduates.jpg", caption: "Après le bac" },
  { src: "/Leadership jeunesse.jpg", caption: "Leadership" },
  { src: "/Mentorat.jpg", caption: "Mentorat" },
];

export default async function Home() {
  const [media, news, dbPartners] = await Promise.all([getMedia(), getNews(3), getDbPartners()]);

  const photos = media.filter((m) => m.type === "photo").slice(0, 6);
  const video = media.find((m) => m.type === "video");
  const mosaic = photos.length >= 3 ? photos.map((p) => ({ src: p.src, caption: p.caption })) : FALLBACK_PHOTOS;
  const featured = PROJECTS.filter((p) => p.featured);
  const partnerList = dbPartners.length > 0 ? dbPartners.map((p) => p.full_name || p.name) : PARTNERS.map((p) => p.name);
  // répété pour que le bandeau défilant remplisse toujours la largeur de l'écran
  const partnerNames = Array.from({ length: Math.ceil(12 / partnerList.length) }, () => partnerList).flat();
  const eventDomain = getDomainBySlug(NEXT_EVENT.domainSlug)!;

  return (
    <>
      {/* 1. Bandeau d'ouverture */}
      <section className="relative min-h-[100svh] flex items-end sm:items-center bg-ns-dark text-white overflow-hidden">
        <Image src="/members.jpg" alt="Des jeunes de Next Step.sn sur le terrain" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-ns-dark via-ns-dark/75 to-ns-dark/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-14 sm:pb-20">
          <p className="inline-block bg-white/15 backdrop-blur text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Association sénégalaise de jeunesse · 14 régions
          </p>
          <h1 className="font-hand text-gold text-7xl sm:text-8xl lg:text-9xl leading-[0.9]">Ose rêver</h1>
          <p className="mt-5 text-lg sm:text-xl text-white/95 max-w-xl leading-relaxed">
            Next Step.sn t&apos;accompagne vers ton prochain pas : t&apos;orienter, entreprendre, prendre la parole et agir pour ta communauté.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/domaines" className="inline-flex items-center justify-center gap-2 bg-gold text-ink px-7 py-4 rounded-full font-bold hover:brightness-110 transition">
              Découvrir nos domaines
              <ArrowIcon />
            </Link>
            <Link href="/nous-rejoindre" className="inline-flex items-center justify-center border-2 border-white text-white px-7 py-3.5 rounded-full font-bold hover:bg-white hover:text-ns transition">
              Nous rejoindre
            </Link>
          </div>
        </div>
      </section>

      {/* 2. La boussole « Trouve ton prochain pas » */}
      <section className="compass-watermark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <SectionTitle
            kicker="La boussole"
            title="Trouve ton prochain pas"
            text="Dis-nous qui tu es : l'aiguille pointe vers le domaine ou le projet fait pour toi."
          />
          <Compass />
        </div>
      </section>

      {/* 3. Chiffres clés */}
      <section className="bg-ns text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="sr-only">Nos chiffres clés</h2>
          <StatsCounters />
        </div>
      </section>

      {/* 4. Nos 5 domaines */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <SectionTitle
            kicker="Nos 5 domaines"
            title="Cinq domaines, un même rêve"
            text="Accompagner chaque jeune vers son prochain pas."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5">
            {DOMAINS.map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.06} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                <Link
                  href={`/domaines/${d.slug}`}
                  style={domainTheme(d)}
                  className="group relative block h-full rounded-3xl overflow-hidden bg-gradient-to-br from-dc to-dc-deep text-white p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <DomainIcon name={d.icon} className="absolute -right-6 -bottom-6 w-40 h-40 opacity-15" />
                  <span className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                    <DomainIcon name={d.icon} className="w-8 h-8" />
                  </span>
                  <p className="text-sm font-semibold text-white/95">{d.theme}</p>
                  <h3 className="font-display font-extrabold text-3xl leading-tight">{d.name}</h3>
                  <p className="font-hand text-3xl leading-none mt-2">{d.slogan}</p>
                  <p className="mt-3 text-white/95 leading-relaxed">{d.mission}</p>
                  <span className="mt-5 inline-flex items-center gap-2 bg-white text-dc-deep px-5 py-2.5 rounded-full font-bold text-sm">
                    Découvrir
                    <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute top-6 right-6 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    {getProjectsByDomain(d.slug).length} projet{getProjectsByDomain(d.slug).length > 1 ? "s" : ""}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Projets à la une */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <SectionTitle kicker="Projets à la une" title="Ce que nous préparons" text="Les projets en cours et à venir, avec leur statut et leur période." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Notre histoire en bref */}
      <section className="compass-watermark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
            <SmartImage src="/bg-students.jpg" alt="Des élèves lors d'un salon d'orientation" />
            <span className="absolute left-4 bottom-4 bg-gold text-ink font-display font-extrabold text-xl px-5 py-2 rounded-full">Depuis 2025</span>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionTitle kicker="Notre histoire" title={HISTORY.title} align="left" />
            <p className="text-lg text-ink leading-relaxed font-semibold">{HISTORY.paragraphs[0]}</p>
            <p className="mt-4 text-muted leading-relaxed">{HISTORY.paragraphs[1]}</p>
            <Link
              href="/qui-sommes-nous/notre-histoire"
              className="mt-7 inline-flex items-center gap-2 bg-ns text-white px-7 py-3.5 rounded-full font-bold hover:bg-ns-dark transition"
            >
              Lire notre histoire
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 7. En images */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <SectionTitle kicker="En images" title="Sur le terrain" text="Ce que nos projets changent, en photos et en vidéos." />
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9rem] sm:auto-rows-[11rem] gap-3">
            {mosaic.slice(0, 5).map((m, i) => (
              <Link
                key={m.src}
                href="/galerie"
                className={`group relative rounded-2xl overflow-hidden bg-pearl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <SmartImage src={m.src} alt={m.caption} sizes="(max-width: 768px) 50vw, 25vw" className="group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-semibold p-3 pt-8">
                  {m.caption}
                </span>
              </Link>
            ))}
            {video && (
              <Link href="/galerie" className="group relative rounded-2xl overflow-hidden bg-ns col-span-2 md:col-span-4">
                {video.cover && <SmartImage src={video.cover} alt="" sizes="50vw" />}
                <span className="absolute inset-0 bg-black/35 flex items-center justify-center gap-3 text-white font-bold px-4 text-center">
                  <span className="w-12 h-12 rounded-full bg-white text-ns flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  {video.caption}
                </span>
              </Link>
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/galerie" className="inline-flex items-center gap-2 border-2 border-ns text-ns px-7 py-3 rounded-full font-bold hover:bg-ns hover:text-white transition">
              Voir toute la galerie
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Prochain événement, avec compte à rebours */}
      <section style={domainTheme(eventDomain)} className="bg-gradient-to-br from-dc-deep to-dc text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white/95">Prochain événement · {eventDomain.name}</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-1">{NEXT_EVENT.title}</h2>
            <p className="text-white/95 mt-1">
              {NEXT_EVENT.subtitle} · {NEXT_EVENT.dateLabel}
            </p>
          </div>
          <Countdown />
          <Link href={NEXT_EVENT.href} className="shrink-0 bg-white text-dc-deep px-7 py-3.5 rounded-full font-bold hover:bg-cream transition">
            Je m&apos;inscris
          </Link>
        </div>
      </section>

      {/* 9. Le mur « Ose rêver » */}
      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="px-4">
          <SectionTitle kicker="Le mur" title="Ose rêver" text="Des rêves de jeunes, d'un bout à l'autre du Sénégal. Ajoute le tien." />
        </div>
        <DreamWall />
      </section>

      {/* Actualités récentes (si l'administration en a publié) */}
      {news.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <SectionTitle kicker="Actualités" title="Les dernières nouvelles" />
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((a) => (
                <article key={a.id} className="group relative bg-cream rounded-3xl overflow-hidden border border-pearl hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-ns">
                    {a.image_url && <SmartImage src={a.image_url} alt="" sizes="(max-width: 768px) 100vw, 33vw" />}
                    <span className="absolute top-3 left-3 bg-gold text-ink text-xs font-bold px-3 py-1 rounded-full">{a.category}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted">{a.date}</p>
                    <h3 className="font-display font-bold text-lg text-ink leading-snug mt-1">
                      <Link href={`/actualites/${a.id}`} className="after:absolute after:inset-0">
                        {a.title}
                      </Link>
                    </h3>
                    <p className="text-muted text-sm mt-2 line-clamp-3">{a.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/actualites" className="font-bold text-ns underline underline-offset-4">
                Toutes les actualités
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 10. Partenaires en défilement */}
      <section className="bg-white border-t border-pearl py-12 overflow-hidden">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-gold-ink mb-6">Ils nous accompagnent</p>
        <ul className="marquee gap-4">
          {[...partnerNames, ...partnerNames].map((name, i) => (
            <li
              key={i}
              aria-hidden={i >= partnerList.length}
              className="shrink-0 bg-cream border border-pearl text-ns font-display font-bold px-6 py-3 rounded-full"
            >
              {name}
            </li>
          ))}
        </ul>
        <div className="text-center mt-6">
          <Link href="/qui-sommes-nous/nos-partenaires" className="text-sm font-bold text-ns underline underline-offset-4">
            Voir tous nos partenaires
          </Link>
        </div>
      </section>

      {/* 11. Appel à l'action */}
      <FinalCta />
    </>
  );
}
