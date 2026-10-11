"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Media } from "@/lib/content";
import { DOMAINS } from "@/app/data/domains";
import { PROJECTS } from "@/app/data/projects";
import { SmartImage } from "./ui";
import { WhatsAppIcon } from "./icons";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

const isFile = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

function VideoPlayer({ media }: { media: Media }) {
  const yt = youtubeId(media.src);
  if (yt) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
        title={media.caption}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="w-full aspect-video max-h-[80dvh] rounded-2xl bg-black"
      />
    );
  }
  if (isFile(media.src)) {
    return (
      <video src={media.src} poster={media.cover || undefined} controls autoPlay playsInline className="max-w-full max-h-[80dvh] rounded-2xl bg-black" />
    );
  }
  // Facebook, Instagram, TikTok : lecture sur la plateforme d'origine
  return (
    <div className="bg-white rounded-3xl p-8 text-center max-w-sm">
      <p className="text-ink font-semibold mb-4">Cette vidéo se regarde sur sa plateforme d&apos;origine.</p>
      <a href={media.src} target="_blank" rel="noopener noreferrer" className="inline-block bg-dc-deep text-white px-6 py-3 rounded-full font-bold">
        Regarder la vidéo
      </a>
    </div>
  );
}

const selectCls =
  "border border-pearl bg-white rounded-full px-4 py-2.5 text-sm font-medium text-ink focus:outline-none focus:border-dc";

/**
 * Galerie à deux onglets : Photos et Vidéos (cahier des charges, 4.6).
 * Avec `filters`, ajoute les filtres de la galerie générale (domaine, projet, année).
 */
export default function MediaGallery({
  media,
  filters = false,
  emptyText = "Les premières images arrivent bientôt.",
}: {
  media: Media[];
  filters?: boolean;
  emptyText?: string;
}) {
  const [tab, setTab] = useState<"photo" | "video">(() => (media.some((m) => m.type === "photo") || !media.length ? "photo" : "video"));
  const [domain, setDomain] = useState("");
  const [project, setProject] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const years = useMemo(() => [...new Set(media.map((m) => m.year).filter(Boolean))].sort().reverse(), [media]);
  const projectOptions = PROJECTS.filter((p) => !domain || p.domainSlug === domain);

  const scoped = media.filter(
    (m) => (!domain || m.domainSlug === domain) && (!project || m.projectSlug === project) && (!year || m.year === year),
  );
  const items = scoped.filter((m) => m.type === tab);
  const counts = { photo: scoped.filter((m) => m.type === "photo").length, video: scoped.filter((m) => m.type === "video").length };

  const go = useCallback(
    (step: number) => setOpen((i) => (i === null || items.length === 0 ? i : (i + step + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const current = open !== null ? items[open] : undefined;
  const shareText = current ? `${current.caption} — Next Step.sn\n${current.type === "photo" ? current.src : current.src}` : "";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div role="tablist" aria-label="Type de média" className="inline-flex bg-white border border-pearl rounded-full p-1">
          {(["photo", "video"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t);
                setOpen(null);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                tab === t ? "bg-dc-deep text-white" : "text-ink hover:bg-dc-light"
              }`}
            >
              {t === "photo" ? "Photos" : "Vidéos"} <span className="font-normal opacity-80">({counts[t]})</span>
            </button>
          ))}
        </div>

        {filters && (
          <>
            <label className="sr-only" htmlFor="f-domain">Domaine</label>
            <select
              id="f-domain"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setProject("");
              }}
              className={selectCls}
            >
              <option value="">Tous les domaines</option>
              {DOMAINS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="f-project">Projet</label>
            <select id="f-project" value={project} onChange={(e) => setProject(e.target.value)} className={selectCls}>
              <option value="">Tous les projets</option>
              {projectOptions.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
            {years.length > 1 && (
              <>
                <label className="sr-only" htmlFor="f-year">Année</label>
                <select id="f-year" value={year} onChange={(e) => setYear(e.target.value)} className={selectCls}>
                  <option value="">Toutes les années</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-pearl bg-white/60 p-10 text-center text-muted">
          {tab === "photo" ? emptyText : "Les premières vidéos arrivent bientôt."}
        </div>
      ) : tab === "photo" ? (
        <ul className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>li]:mb-3">
          {items.map((m, i) => (
            <li key={m.id} className="break-inside-avoid">
              <button
                onClick={() => setOpen(i)}
                className={`group relative block w-full overflow-hidden rounded-2xl bg-dc-light ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
                aria-label={`Agrandir : ${m.caption}`}
              >
                <SmartImage src={m.src} alt={m.caption} sizes="(max-width: 768px) 50vw, 25vw" className="group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-left text-sm font-semibold p-3 pt-8 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                  {m.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m, i) => (
            <li key={m.id}>
              <button onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Lire la vidéo : ${m.caption}`}>
                <span className="relative block aspect-video rounded-2xl overflow-hidden bg-dc-deep">
                  {m.cover && <SmartImage src={m.cover} alt="" sizes="(max-width: 1024px) 50vw, 33vw" className="group-hover:scale-105 transition-transform duration-500" />}
                  <span className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-white text-dc-deep flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </span>
                <span className="block font-semibold text-ink mt-2 leading-snug">{m.caption}</span>
                {m.detail && <span className="block text-sm text-muted">{m.detail}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Agrandissement plein écran : glisser du doigt ou flèches pour passer au suivant */}
      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between p-3 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm tabular-nums">
              {open + 1} / {items.length}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#128C4B] px-4 py-2 rounded-full text-sm font-bold"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Partager
              </a>
              <button onClick={() => setOpen(null)} aria-label="Fermer" className="w-11 h-11 rounded-full bg-white/15 text-2xl leading-none">
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center gap-2 px-2 sm:px-6">
            {items.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Précédent"
                className="hidden sm:flex w-12 h-12 shrink-0 rounded-full bg-white/15 text-white text-2xl items-center justify-center"
              >
                ‹
              </button>
            )}
            <div className="flex-1 min-w-0 h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {current.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.src} alt={current.caption} className="max-w-full max-h-full object-contain rounded-xl" />
              ) : (
                <VideoPlayer key={current.id} media={current} />
              )}
            </div>
            {items.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Suivant"
                className="hidden sm:flex w-12 h-12 shrink-0 rounded-full bg-white/15 text-white text-2xl items-center justify-center"
              >
                ›
              </button>
            )}
          </div>

          <div className="p-4 text-center text-white" onClick={(e) => e.stopPropagation()}>
            <p className="font-semibold">{current.caption}</p>
            {current.detail && <p className="text-sm text-white/80">{current.detail}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/** Partager une page : WhatsApp, Facebook, copie du lien. */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window === "undefined" ? "" : window.location.href);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — Next Step.sn\n${url()}`)}`, "_blank", "noopener")}
        className="inline-flex items-center gap-2 bg-[#128C4B] text-white px-4 py-2.5 rounded-full text-sm font-bold hover:brightness-110"
      >
        <WhatsAppIcon className="w-4 h-4" />
        WhatsApp
      </button>
      <button
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`, "_blank", "noopener")}
        className="bg-[#1558B0] text-white px-4 py-2.5 rounded-full text-sm font-bold hover:brightness-110"
      >
        Facebook
      </button>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // presse-papiers indisponible
          }
        }}
        className="bg-white border border-pearl text-ink px-4 py-2.5 rounded-full text-sm font-bold hover:border-dc"
      >
        {copied ? "Lien copié ✓" : "Copier le lien"}
      </button>
    </div>
  );
}
