'use client'
import { use, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DOMAINS } from '@/app/data/domains'
import { type ActivityIcon as ActivityIconName, type ProjectData, type ProjectStatus, STATUS_LABEL } from '@/app/data/projects'
import { ActivityIcon } from '@/app/components/icons'
import { BLANK_PROJECT, slugify } from '@/lib/projects'
import { saveProject } from '@/app/admin/actions'
import { useAdminProjects } from '@/app/admin/useAdminProjects'
import { Card, Field, FileUpload, ListEditor, Loading, PageHeader, btnGhost, btnPrimary, inputCls } from '@/app/admin/ui'

const NEW = 'nouveau'

const ICONS: Record<ActivityIconName, string> = {
  camera: 'Caméra, tournage', play: 'Vidéo', book: 'Livre, ressources', map: 'Carte, terrain', talk: 'Échange, discussion',
  tools: 'Atelier, outils', trophy: 'Trophée, concours', handshake: 'Partenariat', voice: 'Prise de parole', structure: 'Organisation',
  stage: 'Scène, événement', sprout: 'Pousse, environnement', teacher: 'Formation', water: 'Eau', family: 'Famille',
  school: 'École', coins: 'Argent, finances', network: 'Réseau', alert: 'Alerte', heart: 'Santé, solidarité', shield: 'Protection',
}

const textHint = 'Laisse une ligne vide entre deux paragraphes.'

export default function ProjectEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: routeSlug } = use(params)
  const isNew = routeSlug === NEW
  const router = useRouter()
  const { projects, reload } = useAdminProjects()
  const [form, setForm] = useState<ProjectData | null>(null)
  const [savedJson, setSavedJson] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const original = projects?.find(p => p.slug === routeSlug)
  const initial: ProjectData | undefined = isNew ? { ...BLANK_PROJECT, slug: '' } : original
  const current = form ?? initial
  const dirty = Boolean(form) && JSON.stringify(form) !== (savedJson ?? JSON.stringify(initial))

  // Prévenir avant de quitter la page avec des modifications non enregistrées
  useEffect(() => {
    if (!dirty) return
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  if (projects === null) return <Loading />
  if (!current) {
    return (
      <div>
        <PageHeader title="Projet introuvable" intro={`Aucun projet n'a l'adresse « ${routeSlug} ».`} />
        <Link href="/admin/projects" className={btnGhost}>← Retour aux projets</Link>
      </div>
    )
  }

  const set = (patch: Partial<ProjectData>) => {
    setMessage(null)
    setForm(f => {
      const next = { ...(f ?? current), ...patch }
      // Pour un nouveau projet, l'adresse suit le titre tant qu'on ne l'a pas modifiée à la main
      if (patch.title !== undefined && !slugTouched) next.slug = slugify(patch.title)
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = current
    startTransition(async () => {
      const res = await saveProject(isNew ? null : routeSlug, data)
      if (res.error || !res.slug) {
        setMessage({ ok: false, text: res.error ?? 'Enregistrement impossible.' })
        return
      }
      setSavedJson(JSON.stringify(data))
      setMessage({ ok: true, text: 'Enregistré. Le site est déjà à jour.' })
      if (res.slug !== routeSlug) router.replace(`/admin/projects/${res.slug}`)
      else await reload()
    })
  }

  const domain = DOMAINS.find(d => d.slug === current.domainSlug)

  return (
    <form onSubmit={handleSubmit} className="pb-28">
      <Link href="/admin/projects" className="text-sm font-semibold text-muted hover:text-ns">← Tous les projets</Link>
      <div className="mt-3">
        <PageHeader title={isNew ? 'Nouveau projet' : current.title || 'Projet sans titre'}
          intro={isNew ? 'Remplis au moins le titre et le domaine ; le reste peut être complété plus tard.' : 'Chaque champ correspond à une partie de la page projet du site.'}>
          {!isNew && (
            <a href={`/projets/${routeSlug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>Voir la page ↗</a>
          )}
        </PageHeader>
      </div>

      <div className="space-y-6">
        <Card title="L'essentiel">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Titre *">
              <input value={current.title} onChange={e => set({ title: e.target.value })} required className={inputCls}
                placeholder="Ex. : Forum d'Entrepreneuriat" />
            </Field>
            <Field label="Sous-titre" hint="Affiché sous le titre, en haut de la page projet.">
              <input value={current.subtitle} onChange={e => set({ subtitle: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Domaine *">
              <select value={current.domainSlug} onChange={e => set({ domainSlug: e.target.value })} className={inputCls}>
                {DOMAINS.map(d => <option key={d.slug} value={d.slug}>{d.name} · {d.theme}</option>)}
              </select>
              <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={Boolean(current.domainToConfirm)} onChange={e => set({ domainToConfirm: e.target.checked })}
                  className="w-4 h-4 accent-ns" />
                Rattachement au domaine encore à confirmer
              </label>
            </Field>
            <Field label="Statut">
              <select value={current.status} onChange={e => set({ status: e.target.value as ProjectStatus })} className={inputCls}>
                {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
              <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={current.featured} onChange={e => set({ featured: e.target.checked })}
                  className="w-4 h-4 accent-ns" />
                Mettre à la une sur la page d&apos;accueil
              </label>
            </Field>
            <Field label="Période" hint="Ex. : Avril 2027, Programme 2027, Depuis 2025.">
              <input value={current.period} onChange={e => set({ period: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Lieu">
              <input value={current.location} onChange={e => set({ location: e.target.value })} className={inputCls}
                placeholder="Ex. : Dakar, Les 14 régions du Sénégal" />
            </Field>
            <Field label="Texte du bouton d'inscription" hint="Bouton principal de la page, qui ouvre le formulaire d'inscription.">
              <input value={current.applyLabel} onChange={e => set({ applyLabel: e.target.value })} className={inputCls}
                placeholder="Ex. : Je m'inscris au forum" />
            </Field>
            <Field label="Adresse de la page *"
              hint={isNew ? 'Créée à partir du titre. Lettres minuscules, chiffres et tirets.' : 'Attention : changer l\'adresse casse les liens déjà partagés.'}>
              <div className="flex items-center rounded-xl border border-pearl bg-cream overflow-hidden focus-within:border-ns">
                <span className="pl-3 pr-1 text-muted text-sm shrink-0">/projets/</span>
                <input value={current.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  onChange={e => { setSlugTouched(true); set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }) }}
                  className="flex-1 min-w-0 bg-white px-2 py-2.5 text-sm text-ink focus:outline-none" />
              </div>
            </Field>
          </div>
        </Card>

        <Card title="Photo et résumé">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Photo de couverture" hint="Format paysage. Elle sert de fond en haut de la page et sur la carte du projet.">
              <FileUpload folder="projects" initialUrl={current.cover} onUploaded={url => set({ cover: url })} />
            </Field>
            <Field label="Résumé (carte du projet)" hint="Deux ou trois phrases, affichées sur les cartes et dans Google.">
              <textarea value={current.summary} onChange={e => set({ summary: e.target.value })} rows={4} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="Textes de la page">
          <div className="grid gap-5">
            <Field label="Le projet" hint={textHint}>
              <textarea value={current.project} onChange={e => set({ project: e.target.value })} rows={6} className={inputCls} />
            </Field>
            <Field label="La motivation" hint={textHint}>
              <textarea value={current.motivation} onChange={e => set({ motivation: e.target.value })} rows={5} className={inputCls} />
            </Field>
            <Field label="Les objectifs" hint={textHint}>
              <textarea value={current.objectives} onChange={e => set({ objectives: e.target.value })} rows={5} className={inputCls} />
            </Field>
          </div>
        </Card>

        <Card title="Fiche rapide">
          <p className="text-muted text-sm -mt-2 mb-4">L&apos;encadré à côté du texte : porteur, public, date, lieu, participation…</p>
          <ListEditor items={current.facts} onChange={facts => set({ facts })} newItem={{ label: '', value: '' }} addLabel="Ajouter une ligne"
            render={(f, update) => (
              <div className="grid sm:grid-cols-[12rem_1fr] gap-3">
                <input value={f.label} onChange={e => update({ label: e.target.value })} className={inputCls} placeholder="Ex. : Public cible" aria-label="Intitulé" />
                <input value={f.value} onChange={e => update({ value: e.target.value })} className={inputCls} placeholder="Ex. : 30 jeunes de 15 à 30 ans" aria-label="Valeur" />
              </div>
            )} />
        </Card>

        <Card title="Activités clés">
          <ListEditor items={current.activities} onChange={activities => set({ activities })}
            newItem={{ icon: 'tools' as ActivityIconName, title: '', text: '' }} addLabel="Ajouter une activité"
            render={(a, update) => (
              <div className="grid sm:grid-cols-[auto_14rem_1fr] gap-3 items-start">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ background: domain?.color ?? '#014D40' }} aria-hidden>
                  <ActivityIcon name={a.icon} className="w-6 h-6" />
                </span>
                <select value={a.icon} onChange={e => update({ icon: e.target.value as ActivityIconName })} className={inputCls} aria-label="Icône">
                  {(Object.keys(ICONS) as ActivityIconName[]).map(k => <option key={k} value={k}>{ICONS[k]}</option>)}
                </select>
                <div className="grid gap-2">
                  <input value={a.title} onChange={e => update({ title: e.target.value })} className={inputCls} placeholder="Titre de l'activité" aria-label="Titre de l'activité" />
                  <textarea value={a.text} onChange={e => update({ text: e.target.value })} rows={2} className={inputCls} placeholder="Une phrase d'explication" aria-label="Description" />
                </div>
              </div>
            )} />
        </Card>

        <Card title="Résultats attendus">
          <ListEditor items={current.results} onChange={results => set({ results })} newItem="" addLabel="Ajouter un résultat"
            render={(r, update) => (
              <input value={r} onChange={e => update(e.target.value)} className={inputCls} placeholder="Ex. : 30 jeunes formés au pitch" aria-label="Résultat" />
            )} />
        </Card>

        <Card title="Calendrier">
          <ListEditor items={current.calendar} onChange={calendar => set({ calendar })} newItem={{ when: '', label: '' }} addLabel="Ajouter une étape"
            render={(s, update) => (
              <div className="grid sm:grid-cols-[12rem_1fr] gap-3">
                <input value={s.when} onChange={e => update({ when: e.target.value })} className={inputCls} placeholder="Ex. : Avril 2027" aria-label="Quand" />
                <input value={s.label} onChange={e => update({ label: e.target.value })} className={inputCls} placeholder="Ex. : Journée du forum à Dakar" aria-label="Étape" />
              </div>
            )} />
        </Card>
      </div>

      {/* Barre d'enregistrement, toujours visible */}
      <div className="fixed bottom-0 inset-x-0 md:left-64 z-30 bg-white/95 backdrop-blur border-t border-pearl">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isPending || !current.title.trim()} className={btnPrimary}>
            {isPending ? 'Enregistrement…' : isNew ? 'Créer le projet' : 'Enregistrer'}
          </button>
          <Link href="/admin/projects" className={btnGhost}>Retour</Link>
          <p role="status" className={`text-sm ${message ? (message.ok ? 'text-ns font-medium' : 'text-red-700') : 'text-muted'}`}>
            {message?.text ?? (dirty ? 'Modifications non enregistrées' : '')}
          </p>
        </div>
      </div>
    </form>
  )
}
