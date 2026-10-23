import Link from "next/link";
import type { Partner } from "@/lib/supabase";
import type { Media } from "@/lib/content";
import { DOMAINS, domainTheme } from "@/app/data/domains";
import { type Member, PARTNER_TYPES, PARTNERS, type PartnerType } from "@/app/data/site";
import { type SiteSettings, whatsappHref } from "@/lib/settings";
import { BureauTree, DomainTeams, RegionMap, StepsPath } from "./about-widgets";
import { JoinForms, SiteForm } from "./Forms";
import { ArrowIcon, DomainIcon, SocialIcon, WhatsAppIcon } from "./icons";
import MediaGallery from "./MediaGallery";
import { FinalCta, PageHero, SectionTitle, SmartImage } from "./ui";

const wrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const about = { label: "Qui sommes-nous", href: "/qui-sommes-nous/notre-histoire" };

/* ── Notre histoire ──────────────────────────────────────────────────────── */

export function HistoryView({ settings }: { settings: SiteSettings }) {
  const HISTORY = settings.history;
  return (
    <>
      <PageHero kicker="Notre histoire" title={HISTORY.title} crumbs={[about, { label: "Notre histoire" }]} />
      <section className="compass-watermark overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-6 text-lg text-ink leading-relaxed">
          {HISTORY.paragraphs.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-display font-bold text-2xl sm:text-3xl text-ns leading-snug"
                  : i === HISTORY.paragraphs.length - 1
                    ? "font-hand text-4xl text-gold-ink leading-tight"
                    : ""
              }
            >
              {p}
            </p>
          ))}
        </div>
      </section>
      <section className="bg-white">
        <div className={`${wrap} py-14 sm:py-20`}>
          <SectionTitle kicker="Pas à pas" title="Notre chemin" text="Chaque étape est un pas. Fais défiler pour avancer avec nous." />
          <StepsPath steps={HISTORY.steps} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* ── Mission et valeurs ──────────────────────────────────────────────────── */

export function MissionView({ settings }: { settings: SiteSettings }) {
  const { mission: MISSION, vision: VISION, values: VALUES } = settings.about;
  return (
    <>
      <PageHero
        kicker="Ose rêver"
        title="Mission et valeurs"
        text="Ce qui nous guide, et ce que nous voulons pour la jeunesse sénégalaise."
        crumbs={[about, { label: "Mission et valeurs" }]}
      />
      <section className="compass-watermark overflow-hidden">
        <div className={`${wrap} py-14 sm:py-20 grid md:grid-cols-2 gap-6`}>
          <div className="bg-white rounded-3xl border border-pearl p-7 sm:p-10 border-t-8 border-t-ns">
            <p className="text-gold-ink font-bold text-sm uppercase tracking-widest mb-3">Notre mission</p>
            <p className="font-display font-bold text-2xl text-ns leading-snug">{MISSION}</p>
          </div>
          <div className="bg-ns text-white rounded-3xl p-7 sm:p-10">
            <p className="text-gold font-bold text-sm uppercase tracking-widest mb-3">Notre vision</p>
            <p className="font-display font-bold text-2xl leading-snug">{VISION}</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${wrap} py-14 sm:py-20`}>
          <SectionTitle kicker="Nos valeurs" title="Ce en quoi nous croyons" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {VALUES.map((v, i) => (
              <li key={i} className="bg-cream rounded-3xl border border-pearl p-6 text-center">
                <span className="mx-auto w-12 h-12 rounded-full bg-gold text-ink font-display font-extrabold text-xl flex items-center justify-center mb-3">
                  {i + 1}
                </span>
                <h3 className="font-display font-bold text-xl text-ns">{v.name}</h3>
                <p className="text-muted text-[15px] leading-relaxed mt-2">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className={`${wrap} py-14 sm:py-20`}>
          <SectionTitle kicker="Nos 5 domaines" title="Cinq façons d'avancer" />
          <ul className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {DOMAINS.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/domaines/${d.slug}`}
                  style={domainTheme(d)}
                  className="block h-full bg-dc-light rounded-3xl p-6 border-t-8 border-dc hover:shadow-lg transition-shadow"
                >
                  <DomainIcon name={d.icon} className="w-9 h-9 text-dc-deep mb-3" />
                  <h3 className="font-display font-bold text-xl text-dc-deep">{d.name}</h3>
                  <p className="text-sm font-semibold text-dc-deep">{d.theme}</p>
                  <p className="text-ink text-[15px] leading-relaxed mt-2">{d.mission}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${wrap} py-14 sm:py-20`}>
          <SectionTitle
            kicker="Sur le terrain"
            title="Présente dans les 14 régions"
            text="Touche une région pour voir les actions réalisées et les projets prévus."
          />
          <RegionMap />
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* ── Notre équipe ────────────────────────────────────────────────────────── */

export function TeamView({ team }: { team: Member[] }) {
  const incomplete = team.some((m) => m.name === "Nom à venir");
  return (
    <>
      <PageHero
        kicker="Les visages de Next Step.sn"
        title="Notre équipe"
        text="Le président et la vice-présidente sont à la tête de l'association. Chaque poste a son titulaire, entouré de ses adjoints. Ensemble, ils font avancer Next Step.sn."
        crumbs={[about, { label: "Notre équipe" }]}
      />
      <section className="compass-watermark overflow-hidden">
        <div className={`${wrap} py-14 sm:py-20`}>
          <SectionTitle kicker="Bureau exécutif" title="Le bureau" />
          <BureauTree team={team} />
        </div>
      </section>
      <section className="bg-white">
        <div className={`${wrap} py-14 sm:py-20`}>
          <SectionTitle kicker="Responsables de domaine" title="Les cinq domaines" />
          <DomainTeams team={team} />
          {incomplete && <p className="text-center text-muted text-sm mt-10">Les noms et les photos de l&apos;équipe seront ajoutés prochainement.</p>}
        </div>
      </section>
      <FinalCta />
    </>
  );
}

/* ── Nos partenaires ─────────────────────────────────────────────────────── */

export function PartnersView({ dbPartners }: { dbPartners: Partner[] }) {
  const types = Object.keys(PARTNER_TYPES) as PartnerType[];
  // Dès qu'un partenaire est saisi dans l'admin, la base remplace la liste par défaut.
  const partners =
    dbPartners.length > 0
      ? dbPartners.map((p) => ({
          key: p.id,
          name: p.full_name || p.name,
          type: (p.type && p.type in PARTNER_TYPES ? p.type : "terrain") as PartnerType,
          logo: p.logo_url || undefined,
          website: p.website || undefined,
        }))
      : PARTNERS.map((p) => ({ ...p, key: p.name }));
  return (
    <>
      <PageHero
        kicker="Ensemble"
        title="Nos partenaires"
        text="Des institutions, des partenaires techniques et financiers et des partenaires de terrain qui croient en la jeunesse."
        crumbs={[about, { label: "Nos partenaires" }]}
      />
      <div className={`${wrap} py-14 sm:py-20 space-y-12`}>
        {types.map((t) => {
          const list = partners.filter((p) => p.type === t);
          if (list.length === 0) return null;
          return (
            <section key={t}>
              <h2 className="font-display font-bold text-2xl text-ns mb-5">{PARTNER_TYPES[t]}</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((p) => (
                  <li key={p.key} className="bg-white rounded-3xl border border-pearl p-6 flex items-center gap-4">
                    <span className="relative w-14 h-14 shrink-0 rounded-2xl bg-cream border border-pearl overflow-hidden flex items-center justify-center font-display font-bold text-ns text-xl">
                      {p.logo ? <SmartImage src={p.logo} alt="" sizes="56px" className="!object-contain p-1" /> : p.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-display font-bold text-ink leading-snug">{p.name}</span>
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-ns underline underline-offset-4">
                          Visiter le site
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <div className="bg-ns text-white rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Vous souhaitez soutenir la jeunesse sénégalaise ?</h2>
          <p className="text-white/90 mt-2">Écoles, institutions, entreprises, ASC : parlons de votre projet.</p>
          <Link
            href="/nous-rejoindre?profil=partenaire"
            className="mt-6 inline-flex items-center gap-2 bg-gold text-ink px-7 py-3.5 rounded-full font-bold hover:brightness-110"
          >
            Devenir partenaire
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </>
  );
}

/* ── Galerie générale ────────────────────────────────────────────────────── */

export function GalleryView({ media }: { media: Media[] }) {
  return (
    <>
      <PageHero
        kicker="En images"
        title="Galerie"
        text="Toutes les photos et vidéos de nos actions. Filtre par domaine, par projet ou par année."
        crumbs={[{ label: "Galerie" }]}
      />
      <div className={`${wrap} py-12 sm:py-16`}>
        <MediaGallery media={media} filters emptyText="Les premières photos arrivent bientôt. Reviens vite !" />
      </div>
    </>
  );
}

/* ── Nous rejoindre ──────────────────────────────────────────────────────── */

export function JoinView({ profil, projet, settings: SITE }: { profil?: string; projet?: string; settings: SiteSettings }) {
  const whatsappLink = (text: string) => whatsappHref(SITE, text);
  return (
    <>
      <PageHero
        kicker="Ton prochain pas commence ici"
        title="Nous rejoindre"
        text="Deviens bénévole, deviens partenaire ou inscris-toi à un projet."
        crumbs={[{ label: "Nous rejoindre" }]}
      />
      <div className={`${wrap} py-12 sm:py-16 grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-10 items-start`}>
        <JoinForms initial={profil} project={projet} />
        <aside className="bg-ns text-white rounded-3xl p-7">
          <h2 className="font-display font-bold text-xl">Une question avant de te lancer ?</h2>
          <p className="text-white/90 mt-2">L&apos;équipe te répond sur WhatsApp.</p>
          <a
            href={whatsappLink("Bonjour Next Step.sn ! J'aimerais vous rejoindre.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 bg-[#128C4B] px-5 py-3.5 rounded-full font-bold hover:brightness-110"
          >
            <WhatsAppIcon />
            Écrire sur WhatsApp
          </a>
          <ul className="mt-6 space-y-2 text-white/90 text-sm">
            {SITE.phones.map((p) => (
              <li key={p.wa}>{p.display}</li>
            ))}
            <li className="break-all">{SITE.email}</li>
          </ul>
        </aside>
      </div>
    </>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────── */

export function ContactView({ settings: SITE }: { settings: SiteSettings }) {
  const SOCIALS = SITE.socials;
  const whatsappLink = (text: string) => whatsappHref(SITE, text);
  return (
    <>
      <PageHero kicker="On t'écoute" title="Contact" text="Écris-nous, appelle-nous ou passe par WhatsApp." crumbs={[{ label: "Contact" }]} />
      <div className={`${wrap} py-12 sm:py-16 grid lg:grid-cols-[minmax(0,1fr)_24rem] gap-10 items-start`}>
        <SiteForm kind="contact" />
        <aside className="space-y-5">
          <div className="bg-white rounded-3xl border border-pearl p-7">
            <h2 className="font-display font-bold text-xl text-ns mb-4">Coordonnées</h2>
            <ul className="space-y-3 text-ink">
              {SITE.phones.map((p) => (
                <li key={p.wa}>
                  <a href={`tel:+${p.wa}`} className="font-semibold hover:text-ns">
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`} className="font-semibold hover:text-ns break-all">
                  {SITE.email}
                </a>
              </li>
              <li className="text-muted">{SITE.city}</li>
            </ul>
            <a
              href={whatsappLink("Bonjour Next Step.sn !")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 bg-[#128C4B] text-white px-5 py-3.5 rounded-full font-bold hover:brightness-110"
            >
              <WhatsAppIcon />
              Écrire sur WhatsApp
            </a>
            <div className="flex flex-wrap gap-2 mt-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-11 h-11 rounded-full bg-ns text-white flex items-center justify-center hover:bg-gold hover:text-ink transition-colors"
                >
                  <SocialIcon name={s.name} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-pearl bg-white">
            <iframe
              title="Carte : Dakar, Sénégal"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-17.56%2C14.62%2C-17.20%2C14.82&layer=mapnik"
              loading="lazy"
              className="w-full h-64 border-0"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
