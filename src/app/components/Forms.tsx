"use client";
import { useState } from "react";
import { addSubmission } from "@/app/admin/actions";
import { DOMAINS } from "@/app/data/domains";
import { REGIONS } from "@/app/data/site";
import { whatsappHref } from "@/lib/settings";
import { WhatsAppIcon } from "./icons";
import { useProjects, useSettings } from "./SiteDataContext";

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  half?: boolean;
};

export type FormKind = "benevole" | "partenaire" | "inscription" | "contact";

const REGION_NAMES = REGIONS.map((r) => r.name).sort((a, b) => a.localeCompare(b, "fr"));

const FORMS: Record<FormKind, { title: string; intro: string; submit: string; fields: FieldDef[] }> = {
  benevole: {
    title: "Devenir bénévole",
    intro: "Tu veux donner de ton temps ? Dis-nous qui tu es, on te recontacte.",
    submit: "Envoyer ma demande",
    fields: [
      { name: "name", label: "Prénom et nom", required: true, half: true },
      { name: "age", label: "Âge", type: "number", required: true, half: true },
      { name: "phone", label: "Téléphone (WhatsApp)", type: "tel", required: true, half: true, placeholder: "+221 77 000 00 00" },
      { name: "email", label: "E-mail", type: "email", half: true },
      { name: "region", label: "Ville ou région", type: "select", required: true, options: REGION_NAMES, half: true },
      { name: "domaine", label: "Domaine qui t'intéresse", type: "select", required: true, options: DOMAINS.map((d) => `${d.name} (${d.theme})`), half: true },
      { name: "disponibilites", label: "Tes disponibilités", placeholder: "Par exemple : les week-ends, pendant les vacances…" },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
  partenaire: {
    title: "Devenir partenaire",
    intro: "École, institution, entreprise, ASC : construisons un projet ensemble.",
    submit: "Envoyer la demande",
    fields: [
      { name: "organisation", label: "Organisation", required: true, half: true },
      { name: "name", label: "Nom du contact", required: true, half: true },
      { name: "fonction", label: "Fonction", half: true },
      { name: "type", label: "Type de partenariat", type: "select", required: true, half: true, options: ["Institutionnel", "Technique", "Financier", "Partenaire de terrain (école, ASC…)", "Autre"] },
      { name: "email", label: "E-mail", type: "email", required: true, half: true },
      { name: "phone", label: "Téléphone", type: "tel", half: true },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
  inscription: {
    title: "S'inscrire à un projet",
    intro: "Choisis le projet qui t'intéresse. L'équipe te confirme l'ouverture des candidatures.",
    submit: "Envoyer ma candidature",
    fields: [
      { name: "projet", label: "Projet", type: "select", required: true, options: [] }, // rempli avec les projets en base (SiteForm)
      { name: "name", label: "Prénom et nom", required: true, half: true },
      { name: "age", label: "Âge", type: "number", half: true },
      { name: "phone", label: "Téléphone (WhatsApp)", type: "tel", required: true, half: true, placeholder: "+221 77 000 00 00" },
      { name: "email", label: "E-mail", type: "email", half: true },
      { name: "region", label: "Ville ou région", type: "select", options: REGION_NAMES },
      { name: "message", label: "Pourquoi veux-tu participer ?", type: "textarea" },
    ],
  },
  contact: {
    title: "Nous écrire",
    intro: "Une question, une idée, une demande de la presse ? Écris-nous.",
    submit: "Envoyer le message",
    fields: [
      { name: "name", label: "Prénom et nom", required: true, half: true },
      { name: "email", label: "E-mail", type: "email", required: true, half: true },
      { name: "phone", label: "Téléphone", type: "tel", half: true },
      { name: "sujet", label: "Sujet", half: true },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
};

const inputCls =
  "w-full border border-pearl rounded-2xl px-4 py-3 bg-cream text-ink placeholder:text-muted/70 focus:outline-none focus:border-ns focus:bg-white";

/** Formulaire générique : enregistre la demande dans l'espace d'administration, puis propose WhatsApp. */
export function SiteForm({ kind, defaults = {} }: { kind: FormKind; defaults?: Record<string, string> }) {
  const projects = useProjects();
  const settings = useSettings();
  const def = {
    ...FORMS[kind],
    fields: FORMS[kind].fields.map((f) => (f.name === "projet" ? { ...f, options: projects.map((p) => p.title) } : f)),
  };
  const [values, setValues] = useState<Record<string, string>>(defaults);
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [waHref, setWaHref] = useState("");

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trap) return; // robot
    setState("sending");

    // Les champs propres à chaque formulaire sont regroupés dans le message
    const extras = def.fields
      .filter((f) => !["name", "email", "phone", "message"].includes(f.name) && values[f.name])
      .map((f) => `${f.label} : ${values[f.name]}`);
    const message = [...extras, values.message].filter(Boolean).join("\n");

    try {
      await addSubmission({
        role: kind,
        name: values.name ?? "",
        email: values.email ?? "",
        phone: values.phone || undefined,
        message: message || undefined,
      });
    } catch {
      // WhatsApp reste disponible si l'enregistrement échoue
    }

    const lines = [`${def.title} — Next Step.sn`, "", `Nom : ${values.name ?? ""}`];
    if (values.phone) lines.push(`Téléphone : ${values.phone}`);
    if (values.email) lines.push(`E-mail : ${values.email}`);
    if (message) lines.push(message);
    setWaHref(whatsappHref(settings, lines.join("\n")));
    setState("sent");
  };

  if (state === "sent") {
    return (
      <div className="bg-white rounded-3xl border border-pearl p-6 sm:p-8 text-center shadow-sm" role="status">
        <p className="font-hand text-gold-ink text-4xl leading-none">Merci !</p>
        <h3 className="font-display font-bold text-2xl text-ns mt-2">Ta demande est bien enregistrée</h3>
        <p className="text-muted mt-3">Pour une réponse plus rapide, envoie-la aussi à l&apos;équipe sur WhatsApp.</p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 bg-[#128C4B] text-white px-6 py-3.5 rounded-full font-bold hover:brightness-110"
        >
          <WhatsAppIcon />
          Envoyer sur WhatsApp
        </a>
        <button
          onClick={() => {
            setValues(defaults);
            setState("idle");
          }}
          className="block mx-auto mt-4 text-sm text-muted underline"
        >
          Remplir un autre formulaire
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl border border-pearl p-5 sm:p-8 shadow-sm">
      <h3 className="font-display font-bold text-2xl text-ns">{def.title}</h3>
      <p className="text-muted mt-1 mb-6">{def.intro}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {def.fields.map((f) => {
          const id = `${kind}-${f.name}`;
          const common = {
            id,
            name: f.name,
            required: f.required,
            value: values[f.name] ?? "",
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(f.name, e.target.value),
          };
          return (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="block text-sm font-semibold text-ink mb-1.5">
                {f.label}
                {f.required && <span className="text-[#B3261E]"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea {...common} rows={4} placeholder={f.placeholder} className={`${inputCls} resize-y`} />
              ) : f.type === "select" ? (
                <select {...common} className={inputCls}>
                  <option value="">Choisir…</option>
                  {f.options!.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...common}
                  type={f.type ?? "text"}
                  min={f.type === "number" ? 10 : undefined}
                  max={f.type === "number" ? 99 : undefined}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* champ piège anti-robots */}
      <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="hidden" aria-hidden />
      <p className="text-xs text-muted mt-5">
        Les informations envoyées servent uniquement à traiter ta demande. Voir notre{" "}
        <a href="/politique-de-confidentialite" className="underline">
          politique de confidentialité
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 w-full sm:w-auto bg-ns text-white px-8 py-3.5 rounded-full font-bold hover:bg-ns-dark disabled:opacity-60"
      >
        {state === "sending" ? "Envoi…" : def.submit}
      </button>
    </form>
  );
}

const TABS: { kind: Exclude<FormKind, "contact">; label: string }[] = [
  { kind: "benevole", label: "Devenir bénévole" },
  { kind: "partenaire", label: "Devenir partenaire" },
  { kind: "inscription", label: "S'inscrire à un projet" },
];

/** Les trois formulaires de la page « Nous rejoindre », en onglets. */
export function JoinForms({ initial = "benevole", project }: { initial?: string; project?: string }) {
  const start = TABS.some((t) => t.kind === initial) ? (initial as FormKind) : "benevole";
  const [kind, setKind] = useState<FormKind>(start);
  const projects = useProjects();
  const projectTitle = projects.find((p) => p.slug === project)?.title;

  return (
    <div>
      <div role="tablist" aria-label="Comment veux-tu nous rejoindre ?" className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.kind}
            role="tab"
            aria-selected={kind === t.kind}
            onClick={() => setKind(t.kind)}
            className={`px-5 py-3 rounded-full font-bold text-sm transition-colors ${
              kind === t.kind ? "bg-ns text-white" : "bg-white border border-pearl text-ink hover:border-ns"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <SiteForm key={kind} kind={kind} defaults={kind === "inscription" && projectTitle ? { projet: projectTitle } : {}} />
    </div>
  );
}
