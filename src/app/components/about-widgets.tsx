"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { DOMAINS, domainTheme, getDomainBySlug } from "@/app/data/domains";
import { findProject } from "@/lib/projects";
import type { HistoryStep, RegionsSettings } from "@/lib/settings";
import { useProjects } from "./SiteDataContext";
import { type Member, REGIONS } from "@/app/data/site";
import { SmartImage } from "./ui";

/* ── L'histoire « pas à pas » (touche 3) ─────────────────────────────────── */

function Footprint({ flip }: { flip: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-6 h-6 ${flip ? "-scale-x-100" : ""}`} fill="currentColor" aria-hidden>
      <ellipse cx="11" cy="15" rx="5" ry="7" />
      <circle cx="7" cy="5" r="1.6" />
      <circle cx="10.500" cy="3.500" r="1.700" />
      <circle cx="14" cy="4.200" r="1.500" />
      <circle cx="16.500" cy="6.300" r="1.300" />
    </svg>
  );
}

export function StepsPath({ steps }: { steps: HistoryStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative max-w-3xl mx-auto">
      {/* Le chemin : il se dessine au fil du défilement */}
      <span className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-pearl" aria-hidden />
      <motion.span
        style={reduce ? undefined : { scaleY, transformOrigin: "top" }}
        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-gold"
        aria-hidden
      />
      {steps.map((step, i) => {
        const right = i % 2 === 1;
        return (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className={`relative pl-16 md:pl-0 pb-10 last:pb-0 md:w-1/2 ${right ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}
          >
            <span
              className={`absolute top-0 left-6 -translate-x-1/2 w-12 h-12 rounded-full bg-ns text-gold border-4 border-cream flex items-center justify-center shadow ${
                right ? "md:left-0" : "md:left-full"
              }`}
            >
              <Footprint flip={right} />
            </span>
            <div className="bg-white rounded-3xl border border-pearl p-5 sm:p-6 shadow-sm text-left">
              {step.image && (
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                  <SmartImage src={step.image} alt={step.title} />
                </div>
              )}
              <p className="text-gold-ink font-bold text-sm uppercase tracking-wide">{step.date}</p>
              <h3 className="font-display font-bold text-xl text-ns mt-1">{step.title}</h3>
              <p className="text-muted leading-relaxed mt-2">{step.text}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

/* ── L'équipe en arbre : titulaire au centre, adjoints en dessous (section 6) ── */

function initials(m: Member) {
  const source = m.name === "Nom à venir" ? m.post : m.name;
  return source
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function MemberCard({ member, lead }: { member: Member; lead: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const domain = member.domainSlug ? getDomainBySlug(member.domainSlug) : undefined;
  const hasBack = Boolean(member.bio || member.quote || member.links);
  const size = lead ? "w-28 h-28 sm:w-32 sm:h-32" : "w-20 h-20 sm:w-24 sm:h-24";
  // anneau doré pour le titulaire, couleur du domaine pour les adjoints
  const ring = lead ? "ring-4 ring-gold" : "ring-4 ring-dc";

  const front = (
    <div className="flip-face flex flex-col items-center text-center px-1 sm:px-2">
      <div className={`relative ${size} rounded-full ${ring} ring-offset-4 ring-offset-cream overflow-hidden bg-dc text-white flex items-center justify-center font-display font-bold ${lead ? "text-3xl" : "text-xl"}`}>
        {member.photo ? <SmartImage src={member.photo} alt={member.name} sizes="128px" /> : <span aria-hidden>{initials(member)}</span>}
      </div>
      <p className={`font-display font-bold text-ink mt-4 leading-tight break-words ${lead ? "text-lg" : "text-[15px] sm:text-base"}`}>{member.name}</p>
      {member.post && <p className="text-muted text-sm leading-snug">{member.post}</p>}
      {domain && (
        <span className="mt-2 inline-block bg-dc-light text-dc-deep text-[11px] font-bold px-2.5 py-0.5 rounded-full">{domain.name}</span>
      )}
    </div>
  );

  // sur mobile, deux adjoints doivent tenir côte à côte, même dans le cadre coloré d'un domaine
  const width = lead ? "w-40 sm:w-44" : "w-32 sm:w-36";
  if (!hasBack) return <div className={width}>{front}</div>;

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      aria-pressed={flipped}
      aria-label={`${member.name}, ${member.post} : voir la biographie`}
      className={`flip ${flipped ? "is-flipped" : ""} ${width}`}
    >
      <div className="flip-inner">
        {front}
        <div className="flip-face flip-back bg-white rounded-2xl border border-pearl shadow p-3 text-left text-sm overflow-auto">
          {member.bio && <p className="text-ink leading-snug">{member.bio}</p>}
          {member.quote && <p className="font-hand text-xl text-gold-ink mt-2 leading-tight">« {member.quote} »</p>}
          {member.links && (
            <p className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-dc-deep">
              {member.links.whatsapp && <a href={`https://wa.me/${member.links.whatsapp}`}>WhatsApp</a>}
              {member.links.linkedin && <a href={member.links.linkedin}>LinkedIn</a>}
              {member.links.email && <a href={`mailto:${member.links.email}`}>E-mail</a>}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function PostTree({ lead, deputies }: { lead: Member; deputies: Member[] }) {
  const reduce = useReducedMotion();
  const n = deputies.length;
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="flex flex-col items-center"
    >
      {/* le titulaire arrive en premier */}
      <motion.div variants={reduce ? undefined : { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }}>
        <MemberCard member={lead} lead />
      </motion.div>

      {n > 0 && (
        <>
          {/* traits courbes dorés : des sentiers qui partent d'un même point */}
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="hidden sm:block h-10 w-full" style={{ maxWidth: `${n * 10}rem` }} aria-hidden>
            {deputies.map((d, i) => {
              const x = ((i + 0.5) / n) * 100;
              return <path key={d.id} d={`M50 0 C50 12 ${x} 8 ${x} 20`} fill="none" stroke="#C49A00" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
          {/* sur mobile, les traits deviennent une ligne verticale */}
          <span className="sm:hidden block w-0.5 h-8 bg-gold" aria-hidden />

          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-6 sm:gap-x-6 max-w-full">
            {deputies.map((d, i) => (
              <motion.li
                key={d.id}
                variants={
                  reduce
                    ? undefined
                    : { hidden: { opacity: 0, y: -16 }, show: { opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.12 } } }
                }
                className="shrink-0"
              >
                <MemberCard member={d} lead={false} />
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}

const byOrder = (a: Member, b: Member) => a.order - b.order;

/** Découpe une section de l'équipe : arbres titulaire → adjoints, puis les autres membres en grille. */
function split(team: Member[], filter: (m: Member) => boolean) {
  const list = team.filter(filter);
  const leads = list.filter((m) => m.role === "titulaire").sort(byOrder);
  const leadIds = new Set(leads.map((l) => l.id));
  return {
    trees: leads.map((lead) => ({ lead, deputies: list.filter((m) => m.role === "adjoint" && m.parent === lead.id).sort(byOrder) })),
    // un adjoint dont le titulaire a été supprimé reste visible parmi les membres
    members: list.filter((m) => m.role === "membre" || (m.role === "adjoint" && !leadIds.has(m.parent ?? ""))).sort(byOrder),
  };
}

function MemberGrid({ members }: { members: Member[] }) {
  if (members.length === 0) return null;
  return (
    <div className="mt-14">
      <p className="text-center font-display font-bold text-lg text-ink mb-6">Les membres</p>
      <ul className="flex flex-wrap justify-center gap-x-2 gap-y-8 sm:gap-x-6">
        {members.map((m) => (
          <li key={m.id}>
            <MemberCard member={m} lead={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bureau exécutif : les postes sans domaine, président et vice-présidente en tête. */
export function BureauTree({ team }: { team: Member[] }) {
  const { trees, members } = split(team, (m) => !m.domainSlug);
  return (
    <>
      <div className="space-y-14">
        {trees.map((t) => (
          <PostTree key={t.lead.id} {...t} />
        ))}
      </div>
      <MemberGrid members={members} />
    </>
  );
}

/** Équipe d'un domaine, dans sa couleur. Sans `slug`, affiche les cinq domaines. */
export function DomainTeams({ team, slug }: { team: Member[]; slug?: string }) {
  const domains = slug ? DOMAINS.filter((d) => d.slug === slug) : DOMAINS;
  return (
    <div className={slug ? "" : "grid lg:grid-cols-2 gap-6"}>
      {domains.map((d) => {
        const { trees, members } = split(team, (m) => m.domainSlug === d.slug);
        if (trees.length === 0 && members.length === 0) {
          return slug ? (
            <p key={d.slug} className="text-center text-muted">Les membres de l&apos;équipe {d.name} seront présentés prochainement.</p>
          ) : null;
        }
        return (
          <section key={d.slug} style={domainTheme(d)} className={slug ? "" : "min-w-0 rounded-3xl bg-dc-light border-t-8 border-dc px-3 py-6 sm:p-8"}>
            {!slug && (
              <h3 className="font-display font-bold text-2xl text-dc-deep text-center mb-8">
                {d.name} <span className="font-sans font-medium text-base">· {d.theme}</span>
              </h3>
            )}
            <div className="space-y-12">
              {trees.map((t) => (
                <PostTree key={t.lead.id} {...t} />
              ))}
            </div>
            <MemberGrid members={members} />
          </section>
        );
      })}
    </div>
  );
}

/* ── La carte des 14 régions (touche 4) ──────────────────────────────────── */

export function RegionMap({ regions }: { regions: RegionsSettings }) {
  const [active, setActive] = useState("Dakar");
  const region = { ...REGIONS.find((r) => r.name === active)!, done: regions[active]?.done ?? [] };
  const allProjects = useProjects();
  const projects = (regions[active]?.projects ?? [])
    .map((s) => findProject(allProjects, s))
    .filter((p) => p !== undefined);

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
      <div>
        <div
          className="flex flex-wrap gap-2 sm:grid sm:grid-cols-5 sm:gap-3"
          role="group"
          aria-label="Les 14 régions du Sénégal (carte schématique)"
        >
          {REGIONS.map((r) => {
            const on = r.name === active;
            return (
              <button
                key={r.name}
                onClick={() => setActive(r.name)}
                aria-pressed={on}
                style={{ gridColumn: r.col, gridRow: r.row }}
                className={`rounded-full sm:rounded-2xl sm:aspect-[4/3] text-sm font-bold leading-tight px-3.5 py-2 sm:px-1 sm:py-0 transition-all ${
                  on
                    ? "bg-gold text-ink scale-105 shadow-lg"
                    : regions[r.name]?.done.length
                      ? "bg-ns text-white hover:bg-ns-dark"
                      : "bg-ns/80 text-white hover:bg-ns"
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>
        <p className="hidden sm:block text-xs text-muted mt-3">Carte schématique : la position des régions est approximative.</p>
      </div>

      <div className="bg-white rounded-3xl border border-pearl p-6 shadow-sm" aria-live="polite">
        <p className="text-gold-ink font-bold text-sm uppercase tracking-wide">Région</p>
        <h3 className="font-display font-bold text-2xl text-ns">{region.name}</h3>
        {region.done.length > 0 && (
          <>
            <p className="font-semibold text-ink mt-4">Déjà réalisé</p>
            <ul className="list-disc pl-5 text-muted mt-1 space-y-1">
              {region.done.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </>
        )}
        <p className="font-semibold text-ink mt-4">Projets prévus</p>
        <ul className="mt-2 space-y-2">
          {projects.map((p) => {
            const d = getDomainBySlug(p.domainSlug)!;
            return (
              <li key={p.slug}>
                <Link
                  href={`/projets/${p.slug}`}
                  style={domainTheme(d)}
                  className="flex items-center gap-3 rounded-2xl bg-dc-light px-4 py-3 font-semibold text-dc-deep hover:brightness-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-dc shrink-0" />
                  {p.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/galerie" className="inline-block mt-5 text-sm font-bold text-ns underline underline-offset-4">
          Voir les photos et vidéos
        </Link>
      </div>
    </div>
  );
}
