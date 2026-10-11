"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { addSubmission } from "@/app/admin/actions";
import { domainTheme, getDomainBySlug } from "@/app/data/domains";
import { DREAMS, NEXT_EVENT, PERSONAS, STATS } from "@/app/data/site";
import { ArrowIcon, DomainIcon } from "./icons";

/** Apparition douce au défilement. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── La boussole « Trouve ton prochain pas » ─────────────────────────────── */

export function Compass() {
  const [selected, setSelected] = useState<string | null>(null);
  const persona = PERSONAS.find((p) => p.id === selected);
  const domain = persona?.domainSlug ? getDomainBySlug(persona.domainSlug) : undefined;
  const angle = persona?.angle ?? -30;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-14 items-center">
      <div className="order-2 lg:order-1 flex flex-col items-center">
        <svg viewBox="0 0 200 200" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-xl" role="img" aria-label="Boussole Next Step">
          <circle cx="100" cy="100" r="98" fill="#014D40" />
          <circle cx="100" cy="100" r="90" fill="none" stroke="#C49A00" strokeWidth="2" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" strokeOpacity=".18" strokeWidth="1" />
          {/* Les six directions, aux couleurs des domaines */}
          {PERSONAS.map((p) => {
            const d = p.domainSlug ? getDomainBySlug(p.domainSlug) : undefined;
            const rad = ((p.angle - 90) * Math.PI) / 180;
            const active = p.id === selected;
            return (
              <circle
                key={p.id}
                cx={100 + 80 * Math.cos(rad)}
                cy={100 + 80 * Math.sin(rad)}
                r={active ? 8 : 5.5}
                fill={d?.color ?? "#C49A00"}
                stroke="#fff"
                strokeWidth={active ? 2.5 : 1.5}
                style={{ transition: "r .3s" }}
              />
            );
          })}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: "100px 100px",
              transition: "transform 0.9s cubic-bezier(.34,1.4,.64,1)",
            }}
          >
            <path d="M100 32 L109 100 L100 108 L91 100 Z" fill="#C49A00" />
            <path d="M100 168 L109 100 L100 92 L91 100 Z" fill="#ffffff" fillOpacity=".85" />
          </g>
          <circle cx="100" cy="100" r="7" fill="#014D40" stroke="#C49A00" strokeWidth="2.5" />
        </svg>

        <div className="mt-6 w-full max-w-md min-h-[11rem]" aria-live="polite">
          {persona ? (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={domain ? domainTheme(domain) : undefined}
              className="rounded-3xl bg-dc text-white p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                {domain && <DomainIcon name={domain.icon} className="w-7 h-7 shrink-0" />}
                <h3 className="font-display font-bold text-xl leading-tight">{persona.title}</h3>
              </div>
              <p className="text-white/95 leading-relaxed">{persona.text}</p>
              <Link
                href={persona.href}
                className="mt-4 inline-flex items-center gap-2 bg-white text-dc-deep px-5 py-2.5 rounded-full font-bold text-sm hover:bg-cream"
              >
                {persona.cta}
                <ArrowIcon />
              </Link>
            </motion.div>
          ) : (
            <p className="text-center text-muted pt-6">Choisis ton profil : l&apos;aiguille te montre ton prochain pas.</p>
          )}
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <p className="font-display font-bold text-ink text-lg mb-4">Qui es-tu ?</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {PERSONAS.map((p) => {
            const d = p.domainSlug ? getDomainBySlug(p.domainSlug) : undefined;
            const active = p.id === selected;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                aria-pressed={active}
                style={d ? domainTheme(d) : undefined}
                className={`flex items-center gap-3 text-left px-4 py-4 rounded-2xl border-2 font-semibold transition-colors ${
                  active ? "bg-dc border-dc text-white" : "bg-white border-pearl text-ink hover:border-dc"
                }`}
              >
                <span className={`w-3 h-3 rounded-full shrink-0 ${active ? "bg-white" : "bg-dc"}`} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Chiffres qui s'animent ──────────────────────────────────────────────── */

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCount(value);
      return;
    }
    const start = performance.now();
    const duration = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

export function StatsCounters() {
  return (
    <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
      {STATS.map((s) => (
        <div key={s.label} className="text-center flex flex-col-reverse">
          <dt className="text-white/90 text-sm mt-1 leading-snug">{s.label}</dt>
          <dd className="font-display font-extrabold text-4xl sm:text-5xl text-gold">
            <Counter value={s.value} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Compte à rebours du prochain événement ──────────────────────────────── */

export function Countdown() {
  const target = new Date(NEXT_EVENT.date).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setLeft(Math.max(0, target - Date.now()));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  const parts =
    left === null
      ? null
      : [
          { label: "jours", value: Math.floor(left / 86_400_000) },
          { label: "heures", value: Math.floor((left / 3_600_000) % 24) },
          { label: "minutes", value: Math.floor((left / 60_000) % 60) },
          { label: "secondes", value: Math.floor((left / 1000) % 60) },
        ];

  return (
    <div className="flex gap-2 sm:gap-4" role="timer" aria-label={`Temps restant avant ${NEXT_EVENT.title}`}>
      {(parts ?? [{ label: "jours" }, { label: "heures" }, { label: "minutes" }, { label: "secondes" }]).map((p) => (
        <div key={p.label} className="bg-white/15 backdrop-blur rounded-2xl px-3 sm:px-5 py-3 text-center min-w-[4.2rem] sm:min-w-[5.5rem]">
          <div className="font-display font-extrabold text-3xl sm:text-5xl tabular-nums leading-none">
            {"value" in p ? String(p.value).padStart(2, "0") : "--"}
          </div>
          <div className="text-xs sm:text-sm text-white/90 mt-1">{p.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Le mur « Ose rêver » ────────────────────────────────────────────────── */

const DREAM_COLORS = ["#1F6FB2", "#A85E14", "#7B3FA0", "#2F7340", "#C2386B", "#014D40"];

function DreamRow({ dreams, reverse = false }: { dreams: string[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <ul className="marquee gap-3 py-1.5" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {[...dreams, ...dreams].map((d, i) => (
          <li
            key={i}
            aria-hidden={i >= dreams.length}
            className="shrink-0 font-hand text-2xl sm:text-3xl text-white px-6 py-2.5 rounded-full"
            style={{ background: DREAM_COLORS[i % DREAM_COLORS.length] }}
          >
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DreamWall() {
  const [dream, setDream] = useState("");
  const [name, setName] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const half = Math.ceil(DREAMS.length / 2);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trap || dream.trim().length < 5) return;
    setState("sending");
    try {
      await addSubmission({ role: "reve", name: name.trim() || "Anonyme", email: "", message: dream.trim() });
    } catch {
      // l'envoi ne doit jamais bloquer le visiteur
    }
    setState("sent");
    setDream("");
    setName("");
  };

  return (
    <div>
      <div className="space-y-2">
        <DreamRow dreams={DREAMS.slice(0, half)} />
        <DreamRow dreams={DREAMS.slice(half)} reverse />
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-10">
        {state === "sent" ? (
          <p className="text-center bg-white rounded-3xl border border-pearl p-6 text-ns font-semibold" role="status">
            Merci ! Ton rêve a bien été envoyé. Il apparaîtra sur le mur après validation par l&apos;équipe.
            <button onClick={() => setState("idle")} className="block mx-auto mt-3 text-sm underline text-muted">
              Envoyer un autre rêve
            </button>
          </p>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-3xl border border-pearl p-5 sm:p-6 shadow-sm">
            <label htmlFor="dream" className="font-display font-bold text-ink text-lg block mb-3">
              Et toi, de quoi rêves-tu ?
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="dream"
                required
                minLength={5}
                maxLength={120}
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="Je rêve de devenir…"
                className="flex-1 border border-pearl rounded-full px-5 py-3 bg-cream focus:outline-none focus:border-ns"
              />
              <label htmlFor="dream-name" className="sr-only">
                Ton prénom (facultatif)
              </label>
              <input
                id="dream-name"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom (facultatif)"
                className="sm:w-48 border border-pearl rounded-full px-5 py-3 bg-cream focus:outline-none focus:border-ns"
              />
              {/* champ piège anti-robots */}
              <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="hidden" aria-hidden />
              <button type="submit" disabled={state === "sending"} className="bg-ns text-white px-6 py-3 rounded-full font-bold hover:bg-ns-dark disabled:opacity-60">
                {state === "sending" ? "Envoi…" : "Envoyer"}
              </button>
            </div>
            <p className="text-xs text-muted mt-3">Ton rêve sera relu par l&apos;équipe avant d&apos;être publié.</p>
          </form>
        )}
      </div>
    </div>
  );
}
