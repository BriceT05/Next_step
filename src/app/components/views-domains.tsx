import Link from "next/link";
import type { NewsArticle } from "@/lib/supabase";
import type { Media } from "@/lib/content";
import { type Domain, DOMAINS, domainTheme, getDomainBySlug } from "@/app/data/domains";
import type { ProjectData } from "@/app/data/projects";
import { projectsOfDomain } from "@/lib/projects";
import type { Member } from "@/app/data/site";
import { DomainTeams } from "./about-widgets";
import { Reveal } from "./home-widgets";
import { ActivityIcon, ArrowIcon, DomainIcon } from "./icons";
import MediaGallery, { ShareButtons } from "./MediaGallery";
import { Breadcrumb, FinalCta, ProjectCard, SectionTitle, SmartImage, StatusBadge, WhatsAppButton } from "./ui";

const wrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

function OtherDomains({ current }: { current: string }) {
  return (
    <nav aria-label="Les autres domaines" className="flex flex-wrap justify-center gap-2">
      {DOMAINS.filter((d) => d.slug !== current).map((d) => (
        <Link
          key={d.slug}
          href={`/domaines/${d.slug}`}
          style={domainTheme(d)}
          className="inline-flex items-center gap-2 bg-dc-deep text-white px-4 py-2.5 rounded-full font-bold text-sm hover:brightness-110"
        >
          <DomainIcon name={d.icon} className="w-4 h-4" />
          {d.name}
        </Link>
      ))}
    </nav>
  );
}

/* ── Nos domaines (page liste) ───────────────────────────────────────────── */

export function DomainsListView({ projects }: { projects: ProjectData[] }) {
  return (
    <>
      <section className="bg-ns text-white compass-watermark on-dark overflow-hidden">
        <div className={`${wrap} pt-28 lg:pt-36 pb-12 lg:pb-16`}>
          <Breadcrumb crumbs={[{ label: "Nos domaines" }]} />
          <p className="font-hand text-gold text-3xl leading-none mb-2">Ose rêver</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight max-w-3xl">Nos domaines</h1>
          <p className="mt-4 text-white/90 text-lg leading-relaxed max-w-2xl">
            Cinq domaines, un même rêve : accompagner chaque jeune vers son prochain pas.
          </p>
        </div>
      </section>

      <div className={`${wrap} py-12 sm:py-20 space-y-8 sm:space-y-12`}>
        {DOMAINS.map((d, i) => {
          const count = projectsOfDomain(projects, d.slug).length;
          return (
            <Reveal key={d.slug}>
              <section
                style={domainTheme(d)}
                className={`rounded-[2rem] overflow-hidden bg-dc-light border border-pearl grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div className="relative min-h-56 lg:min-h-80">
                  <SmartImage src={d.cover} alt={`${d.name} — ${d.theme}`} />
                  <div className="absolute inset-0 bg-dc/55 mix-blend-multiply" />
                  <span className="absolute left-5 bottom-5 w-16 h-16 rounded-2xl bg-white text-dc-deep flex items-center justify-center shadow-lg">
                    <DomainIcon name={d.icon} className="w-9 h-9" />
                  </span>
                </div>
                <div className="p-6 sm:p-10 flex flex-col justify-center">
                  <p className="text-dc-deep font-bold text-sm uppercase tracking-widest">{d.theme}</p>
                  <h2 className="font-display font-extrabold text-4xl text-dc-deep leading-tight">{d.name}</h2>
                  <p className="font-hand text-3xl text-dc-deep leading-none mt-2">{d.slogan}</p>
                  <p className="text-ink text-lg leading-relaxed mt-4">{d.mission}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/domaines/${d.slug}`}
                      className="inline-flex items-center gap-2 bg-dc-deep text-white px-6 py-3.5 rounded-full font-bold hover:brightness-110"
                    >
                      Voir les projets
                      <ArrowIcon />
                    </Link>
                    <span className="font-semibold text-dc-deep">
                      {count} projet{count > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>
      <FinalCta />
    </>
  );
}

/* ── Page d'un domaine ───────────────────────────────────────────────────── */

export function DomainView({
  domain,
  projects: allProjects,
  media,
  team,
}: {
  domain: Domain;
  projects: ProjectData[];
  media: Media[];
  team: Member[];
}) {
  const projects = projectsOfDomain(allProjects, domain.slug);
  const domainMedia = media.filter((m) => m.domainSlug === domain.slug).slice(0, 8);

  return (
    <div style={domainTheme(domain)}>
      {/* Bandeau plein largeur dans la couleur du domaine */}
      <section className="relative bg-dc-deep text-white overflow-hidden">
        <SmartImage src={domain.cover} alt="" sizes="100vw" priority className="opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-dc-deep via-dc-deep/85 to-dc/40" />
        <div className={`relative ${wrap} pt-28 lg:pt-36 pb-12 lg:pb-20`}>
          <Breadcrumb crumbs={[{ label: "Nos domaines", href: "/domaines" }, { label: domain.name }]} />
          <span className="w-16 h-16 rounded-2xl bg-white text-dc-deep flex items-center justify-center mb-5 shadow-lg">
            <DomainIcon name={domain.icon} className="w-9 h-9" />
          </span>
          <p className="font-bold uppercase tracking-widest text-sm">{domain.theme}</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-tight">{domain.name}</h1>
          <p className="font-hand text-4xl sm:text-5xl leading-none mt-2">{domain.slogan}</p>
        </div>
      </section>

      {/* Mission et raison d'être */}
      <section className={`${wrap} py-14 sm:py-20 grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-14`}>
        <div className="bg-dc-light rounded-3xl p-7 sm:p-9 border-l-8 border-dc self-start">
          <p className="text-dc-deep font-bold text-sm uppercase tracking-widest mb-2">Notre mission</p>
          <p className="font-display font-bold text-2xl text-ink leading-snug">{domain.mission}</p>
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl text-dc-deep mb-4">Pourquoi {domain.name} ?</h2>
          <div className="space-y-4 text-lg text-ink leading-relaxed">
            {domain.presentation.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Nos projets */}
      <section className="bg-dc-light">
        <div className={`${wrap} py-14 sm:py-20`}>
          <h2 className="font-display font-bold text-3xl text-dc-deep mb-8">
            Nos projets <span className="text-ink/70 font-sans font-medium text-xl">({projects.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Le domaine en images */}
      <section className={`${wrap} py-14 sm:py-20`}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="font-display font-bold text-3xl text-dc-deep">{domain.name} en images</h2>
          <Link href="/galerie" className="font-bold text-dc-deep underline underline-offset-4">
            Voir la galerie complète
          </Link>
        </div>
        <MediaGallery media={domainMedia} emptyText={`Les premières images de ${domain.name} arrivent bientôt.`} />
      </section>

      {/* L'équipe du domaine */}
      <section className="bg-white">
        <div className={`${wrap} py-14 sm:py-20`}>
          <h2 className="font-display font-bold text-3xl text-dc-deep text-center mb-10">L&apos;équipe {domain.name}</h2>
          <DomainTeams team={team} slug={domain.slug} />
        </div>
      </section>

      {/* Navigation vers les autres domaines */}
      <section className={`${wrap} py-12 text-center`}>
        <p className="font-display font-bold text-xl text-ink mb-5">Découvrir les autres domaines</p>
        <OtherDomains current={domain.slug} />
        <Link href="/nous-rejoindre" className="mt-8 inline-flex items-center gap-2 bg-gold text-ink px-7 py-3.5 rounded-full font-bold hover:brightness-110">
          Nous rejoindre
          <ArrowIcon />
        </Link>
      </section>
    </div>
  );
}

/* ── Page d'un projet ────────────────────────────────────────────────────── */

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-dc-deep mb-3 flex items-center gap-3">
        <span className="w-2.5 h-8 rounded-full bg-dc" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Texte saisi dans l'admin : une ligne vide sépare deux paragraphes. */
function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className="text-lg text-ink leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

export function ProjectView({
  project,
  projects,
  media,
  news,
}: {
  project: ProjectData;
  projects: ProjectData[];
  media: Media[];
  news: NewsArticle[];
}) {
  const domain = getDomainBySlug(project.domainSlug)!;
  const projectMedia = media.filter((m) => m.projectSlug === project.slug);
  const similar = projectsOfDomain(projects, domain.slug).filter((p) => p.slug !== project.slug);
  const related = news.filter((a) => `${a.title} ${a.excerpt}`.toLowerCase().includes(project.title.toLowerCase())).slice(0, 3);
  const question = `Bonjour Next Step.sn ! J'ai une question sur le projet « ${project.title} ».`;

  return (
    <div style={domainTheme(domain)}>
      {/* Bandeau */}
      <section className="relative bg-dc-deep text-white overflow-hidden">
        <SmartImage src={project.cover} alt="" sizes="100vw" priority className="opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-dc-deep via-dc-deep/80 to-dc-deep/50" />
        <div className={`relative ${wrap} pt-28 lg:pt-36 pb-10 lg:pb-16`}>
          <Breadcrumb
            crumbs={[
              { label: "Nos domaines", href: "/domaines" },
              { label: domain.name, href: `/domaines/${domain.slug}` },
              { label: project.title },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link href={`/domaines/${domain.slug}`} className="inline-flex items-center gap-1.5 bg-white text-dc-deep text-sm font-bold px-3.5 py-1.5 rounded-full">
              <DomainIcon name={domain.icon} className="w-4 h-4" />
              {domain.name} · {domain.theme}
            </Link>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-4xl">{project.title}</h1>
          <p className="text-xl sm:text-2xl text-white/95 mt-3 max-w-3xl">{project.subtitle}</p>
        </div>
      </section>

      <div className={`${wrap} py-10 sm:py-16 grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-8 lg:gap-12 items-start`}>
        {/* Fiche rapide : en haut sur mobile, en colonne sur ordinateur */}
        <aside className="lg:order-2 lg:sticky lg:top-24 bg-dc-light rounded-3xl p-6 border-t-8 border-dc">
          <h2 className="font-display font-bold text-xl text-dc-deep mb-4">Fiche rapide</h2>
          <dl className="space-y-3">
            {project.facts.map((f, i) => (
              <div key={i}>
                <dt className="text-xs font-bold uppercase tracking-wide text-dc-deep">{f.label}</dt>
                <dd className="text-ink leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
          {project.domainToConfirm && (
            <p className="mt-4 text-xs text-muted">Rattachement au domaine {domain.name} à confirmer.</p>
          )}
          <Link
            href={`/nous-rejoindre?profil=inscription&projet=${project.slug}`}
            className="mt-6 flex items-center justify-center gap-2 bg-dc-deep text-white px-5 py-3.5 rounded-full font-bold hover:brightness-110"
          >
            {project.applyLabel}
            <ArrowIcon />
          </Link>
        </aside>

        <div className="lg:order-1 space-y-12 min-w-0">
          <Block title="Le projet">
            <Paragraphs text={project.project} />
          </Block>

          <Block title="La motivation">
            <Paragraphs text={project.motivation} />
          </Block>

          <Block title="Les objectifs">
            <Paragraphs text={project.objectives} />
          </Block>

          <Block title="Activités clés">
            <ul className="grid sm:grid-cols-2 gap-4 mt-5">
              {project.activities.map((a, i) => (
                <li key={i} className="bg-white rounded-2xl border border-pearl p-5 flex gap-4">
                  <span className="w-12 h-12 shrink-0 rounded-xl bg-dc-light text-dc-deep flex items-center justify-center">
                    <ActivityIcon name={a.icon} />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-ink leading-snug">{a.title}</h3>
                    <p className="text-muted text-[15px] leading-relaxed mt-1">{a.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Résultats attendus">
            <ul className="space-y-3 mt-5">
              {project.results.map((r, i) => (
                <li key={i} className="flex gap-3 text-lg text-ink">
                  <span className="mt-1 w-6 h-6 shrink-0 rounded-full bg-dc text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Calendrier">
            <ol className="relative mt-6 border-l-4 border-dc-light ml-3 space-y-6">
              {project.calendar.map((s, i) => (
                <li key={i} className="relative pl-7">
                  <span className="absolute -left-[14px] top-0.5 w-6 h-6 rounded-full bg-dc border-4 border-cream" aria-hidden />
                  <p className="text-sm font-bold uppercase tracking-wide text-dc-deep">{s.when}</p>
                  <p className="text-ink text-lg leading-snug">{s.label}</p>
                </li>
              ))}
            </ol>
          </Block>
        </div>
      </div>

      {/* Galerie du projet : Photos / Vidéos */}
      <section className="bg-white" id="galerie">
        <div className={`${wrap} py-14 sm:py-20`}>
          <h2 className="font-display font-bold text-3xl text-dc-deep mb-8">Galerie du projet</h2>
          <MediaGallery media={projectMedia} emptyText="Les premières photos du projet arrivent bientôt." />
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${wrap} py-14`}>
          <h2 className="font-display font-bold text-3xl text-dc-deep mb-6">Actualités du projet</h2>
          <ul className="grid md:grid-cols-3 gap-4">
            {related.map((a) => (
              <li key={a.id}>
                <Link href={`/actualites/${a.id}`} className="block bg-white rounded-2xl border border-pearl p-5 hover:border-dc h-full">
                  <p className="text-sm text-muted">{a.date}</p>
                  <p className="font-display font-bold text-ink leading-snug mt-1">{a.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Passer à l'action */}
      <section className="bg-gradient-to-br from-dc-deep to-dc text-white">
        <div className={`${wrap} py-14 sm:py-16 text-center`}>
          <SectionTitle title="Passer à l'action" onDark />
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              href={`/nous-rejoindre?profil=inscription&projet=${project.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-dc-deep px-7 py-3.5 rounded-full font-bold hover:bg-cream"
            >
              {project.applyLabel}
              <ArrowIcon />
            </Link>
            <WhatsAppButton text={question}>Poser une question</WhatsAppButton>
          </div>
          <p className="mt-8 mb-3 font-semibold">Partager ce projet</p>
          <div className="flex justify-center">
            <ShareButtons title={project.title} />
          </div>
        </div>
      </section>

      {/* Projets similaires */}
      {similar.length > 0 && (
        <section className={`${wrap} py-14 sm:py-20`}>
          <h2 className="font-display font-bold text-3xl text-dc-deep mb-8">Autres projets {domain.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <section className={`${wrap} pb-14 text-center`}>
        <p className="font-display font-bold text-xl text-ink mb-5">Découvrir les autres domaines</p>
        <OtherDomains current={domain.slug} />
      </section>
    </div>
  );
}
