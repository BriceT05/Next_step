"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/supabase";
import { PROJECTS } from "@/app/data/projects";

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const STATUS_COLORS: Record<string, string> = {
  "En cours": "#12A89D",
  "Inscriptions ouvertes": "#D9A657",
  "Candidatures ouvertes": "#D9A657",
  "Accompli": "#0A7F78",
  "Permanent": "#74878B",
  "Récurrent": "#74878B",
  "À venir": "#74878B",
};

const STATIC_SLUGS: Record<string, string> = {
  "1": "forum-national-entrepreneurs",
  "2": "un-jeune-un-permis",
  "3": "site-tutorat-etutorat",
  "4": "conference-startup",
  "5": "interview-entrepreneur",
};

interface StaticProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  image_url: string;
  bg?: string;
  icon?: string;
  color?: string;
}

function ProjectCard({
  project,
  index,
  slug,
  wide,
}: {
  project: StaticProject | Project;
  index: number;
  slug: string;
  wide?: boolean;
}) {
  const staticProject = PROJECTS.find((p) => p.slug === slug);
  const bg = staticProject?.bg ?? "";
  const icon = staticProject?.icon ?? "🚀";
  const color = staticProject?.color ?? "#D9A657";
  const statusColor = STATUS_COLORS[project.status] ?? "#74878B";
  const imgUrl = project.image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={wide ? "h-[380px] md:h-[420px]" : "h-[340px] md:h-[380px]"}
    >
      <Link
        href={`/projets/${slug}`}
        className="group relative block w-full h-full rounded-3xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A657]"
      >
        {/* Background */}
        {imgUrl ? (
          <Image src={imgUrl} alt={project.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : bg ? (
          <Image src={bg} alt={project.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}30, #182426 80%)` }} />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1416]/95 via-[#0A1416]/55 to-[#0A1416]/15" />

        {/* Hover color overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${color}88, transparent 60%)` }}
        />

        {/* Top badges */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm"
            style={{ color, borderColor: `${color}45`, background: `${color}18` }}
          >
            {project.category}
          </span>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ color: statusColor, background: `${statusColor}20` }}
          >
            {project.status}
          </span>
        </div>

        {/* Big icon (decorative, faded) */}
        {!imgUrl && (
          <div className="absolute right-4 bottom-20 text-[7rem] opacity-5 select-none pointer-events-none leading-none">
            {icon}
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
          <h3
            className="text-white text-lg sm:text-xl font-bold leading-snug mb-2 transition-colors duration-300"
            style={{ ["--hc" as string]: color }}
          >
            <span className="group-hover:text-[var(--hc)] transition-colors duration-300">
              {project.title}
            </span>
          </h3>
          <p className="text-white/55 text-sm leading-relaxed mb-5 line-clamp-2">{project.description}</p>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
              style={{ color }}
            >
              <span>Voir le projet</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {staticProject?.participants && (
              <span className="text-white/30 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {staticProject.participants} participants
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />

        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent -skew-x-12 pointer-events-none"
          initial={{ x: "-120%" }}
          whileHover={{ x: "220%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </Link>
    </motion.div>
  );
}

interface Props {
  dbProjects?: Project[];
}

export default function Projects({ dbProjects }: Props) {
  const rawProjects: (StaticProject | Project)[] = dbProjects && dbProjects.length > 0
    ? dbProjects
    : PROJECTS.map((p, i) => ({
        id: String(i + 1),
        title: p.title,
        description: p.description,
        category: p.category,
        status: p.status,
        image_url: "",
        bg: p.bg,
        icon: p.icon,
        color: p.color,
      }));

  return (
    <section id="projects" className="py-24 bg-[#F2F5F5] relative overflow-hidden section-divider">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.07]" style={{ background: "#D9A657" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.06]" style={{ background: "#12A89D" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#12A89D] text-xs font-bold tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full border border-[#12A89D]/20 bg-[#12A89D]/8">
            Nos initiatives
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#182426] mt-2 mb-4 leading-tight">
            Nos{" "}
            <span className="relative">
              <span className="gradient-text">Projets</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, #D9A657, #12A89D)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </h2>
          <p className="text-[#5A6A70] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Des projets concrets qui transforment des vies et façonnent l&apos;avenir de l&apos;Afrique.
          </p>
        </motion.div>

        {/* Projects grid — Row 1: 3 cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {rawProjects.slice(0, 3).map((p, i) => {
            const slug = STATIC_SLUGS[p.id] ?? titleToSlug(p.title);
            return <ProjectCard key={p.id} project={p} index={i} slug={slug} />;
          })}
        </div>

        {/* Projects grid — Row 2: 2 wider cards */}
        {rawProjects.length > 3 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {rawProjects.slice(3, 5).map((p, i) => {
              const slug = STATIC_SLUGS[p.id] ?? titleToSlug(p.title);
              return <ProjectCard key={p.id} project={p} index={i + 3} slug={slug} wide />;
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link
            href="/#join"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold border border-[#D9A657]/40 text-[#D9A657] hover:bg-[#D9A657]/8 hover:border-[#D9A657]/70 transition-all duration-300 hover:scale-105"
          >
            Participer à nos projets
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
