'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase'
import { REGIONS } from '@/app/data/site'
import {
  type AboutSettings, type HistorySettings, type RegionInfo, type RegionsSettings, type SiteSettings, fetchSettings,
} from '@/lib/settings'
import { saveAbout, saveHistory, saveRegions } from '@/app/admin/actions'
import { useAdminProjects } from '@/app/admin/useAdminProjects'
import { Card, Field, FileUpload, ListEditor, Loading, PageHeader, btnPrimary, inputCls } from '@/app/admin/ui'

type Notice = { ok: boolean; text: string } | null

/** Les paragraphes sont saisis dans une seule zone de texte, séparés par une ligne vide. */
const toText = (paragraphs: string[]) => paragraphs.join('\n\n')
const toParagraphs = (text: string) => text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

export default function AboutAdmin() {
  const [loaded, setLoaded] = useState<SiteSettings | null>(null)
  const [history, setHistory] = useState<HistorySettings | null>(null)
  const [historyText, setHistoryText] = useState<string | null>(null)
  const [about, setAbout] = useState<AboutSettings | null>(null)
  const [historyNotice, setHistoryNotice] = useState<Notice>(null)
  const [aboutNotice, setAboutNotice] = useState<Notice>(null)
  const [regions, setRegions] = useState<RegionsSettings | null>(null)
  const [regionsNotice, setRegionsNotice] = useState<Notice>(null)
  const { projects } = useAdminProjects()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchSettings(supabase).then(setLoaded)
  }, [])

  if (!loaded) return <Loading />

  const h = history ?? loaded.history
  const text = historyText ?? toText(h.paragraphs)
  const a = about ?? loaded.about
  const setH = (patch: Partial<HistorySettings>) => { setHistoryNotice(null); setHistory({ ...h, ...patch }) }
  const setA = (patch: Partial<AboutSettings>) => { setAboutNotice(null); setAbout({ ...a, ...patch }) }
  const paragraphCount = toParagraphs(text).length
  const r = regions ?? loaded.regions
  const setR = (name: string, info: RegionInfo) => { setRegionsNotice(null); setRegions({ ...r, [name]: info }) }

  const save = (task: () => Promise<{ error?: string }>, notify: (n: Notice) => void) =>
    startTransition(async () => {
      const res = await task()
      notify(res.error ? { ok: false, text: res.error } : { ok: true, text: 'Enregistré. Le site est déjà à jour.' })
    })

  return (
    <div>
      <PageHeader title="Qui sommes-nous"
        intro="Les textes des pages Notre histoire et Mission et valeurs, et la carte des régions. Le début de l'histoire est aussi repris sur la page d'accueil." />

      <div className="space-y-8">
        <form onSubmit={e => { e.preventDefault(); save(() => saveHistory({ ...h, paragraphs: toParagraphs(text) }), setHistoryNotice) }}>
          <Card title="Notre histoire">
            <div className="grid gap-5">
              <Field label="Titre de la page *">
                <input value={h.title} onChange={e => setH({ title: e.target.value })} required className={inputCls} />
              </Field>
              <Field label={`Le récit (${paragraphCount} paragraphe${paragraphCount > 1 ? 's' : ''})`}
                hint="Une ligne vide entre deux paragraphes. Le 1er est mis en avant en grand, le dernier est écrit à la main. Les deux premiers apparaissent aussi sur l'accueil.">
                <textarea value={text} onChange={e => { setHistoryNotice(null); setHistoryText(e.target.value) }} rows={16} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card title="La frise « Notre chemin »" className="mt-6">
            <p className="text-muted text-sm -mt-2 mb-4">Chaque étape est un « pas » de la frise. Une photo est facultative.</p>
            <ListEditor items={h.steps} onChange={steps => setH({ steps })} newItem={{ date: '', title: '', text: '', image: '' }} addLabel="Ajouter une étape"
              render={(s, update) => (
                <div className="grid sm:grid-cols-[10rem_1fr] gap-3">
                  <input value={s.date} onChange={e => update({ date: e.target.value })} className={inputCls} placeholder="Ex. : 2025" aria-label="Date" />
                  <input value={s.title} onChange={e => update({ title: e.target.value })} className={inputCls} placeholder="Titre de l'étape" aria-label="Titre de l'étape" />
                  <textarea value={s.text} onChange={e => update({ text: e.target.value })} rows={2} className={`${inputCls} sm:col-span-2`}
                    placeholder="Ce qui s'est passé" aria-label="Texte de l'étape" />
                  <div className="sm:col-span-2">
                    <FileUpload folder="history" initialUrl={s.image ?? ''} onUploaded={url => update({ image: url })} />
                  </div>
                </div>
              )} />
          </Card>

          <SaveBar pending={isPending} notice={historyNotice} label="Enregistrer l'histoire" />
        </form>

        <form onSubmit={e => { e.preventDefault(); save(() => saveAbout(a), setAboutNotice) }}>
          <Card title="Mission et vision">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Notre mission *">
                <textarea value={a.mission} onChange={e => setA({ mission: e.target.value })} required rows={5} className={inputCls} />
              </Field>
              <Field label="Notre vision *">
                <textarea value={a.vision} onChange={e => setA({ vision: e.target.value })} required rows={5} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card title="Nos valeurs" className="mt-6">
            <p className="text-muted text-sm -mt-2 mb-4">Cinq valeurs remplissent une ligne sur ordinateur.</p>
            <ListEditor items={a.values} onChange={values => setA({ values })} newItem={{ name: '', text: '' }} addLabel="Ajouter une valeur"
              render={(v, update) => (
                <div className="grid sm:grid-cols-[12rem_1fr] gap-3">
                  <input value={v.name} onChange={e => update({ name: e.target.value })} className={inputCls} placeholder="Ex. : Audace" aria-label="Valeur" />
                  <input value={v.text} onChange={e => update({ text: e.target.value })} className={inputCls} placeholder="Une phrase d'explication" aria-label="Explication" />
                </div>
              )} />
          </Card>

          <SaveBar pending={isPending} notice={aboutNotice} label="Enregistrer la mission et les valeurs" />
        </form>

        <form onSubmit={e => { e.preventDefault(); save(() => saveRegions(r), setRegionsNotice) }}>
          <Card title="Carte des 14 régions (page Mission et valeurs)">
            <p className="text-muted text-sm -mt-2 mb-4">
              Pour chaque région : les actions déjà réalisées (une par ligne) et les projets prévus. Une région avec au moins une action réalisée apparaît en vert foncé sur la carte.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {REGIONS.map(region => {
                const info = r[region.name] ?? { done: [], projects: [] }
                return (
                  <fieldset key={region.name} className="rounded-xl border border-pearl bg-cream/50 p-4">
                    <legend className="px-1 font-display font-semibold text-ns">{region.name}</legend>
                    <label className="block text-xs font-semibold text-muted mb-1" htmlFor={`done-${region.name}`}>Déjà réalisé</label>
                    <textarea id={`done-${region.name}`} rows={2} className={inputCls}
                      value={info.done.join('\n')}
                      onChange={e => setR(region.name, { ...info, done: e.target.value.split('\n') })}
                      placeholder="Ex. : Salon d'orientation (mars 2026)" />
                    <p className="text-xs font-semibold text-muted mt-3 mb-1.5">Projets prévus</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(projects ?? []).map(p => {
                        const on = info.projects.includes(p.slug)
                        return (
                          <button key={p.slug} type="button" aria-pressed={on}
                            onClick={() => setR(region.name, { ...info, projects: on ? info.projects.filter(s => s !== p.slug) : [...info.projects, p.slug] })}
                            className={`text-xs px-2.5 py-1 rounded-full border transition ${on ? 'bg-ns text-white border-ns' : 'bg-white text-ink border-pearl hover:border-ns'}`}>
                            {p.title}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                )
              })}
            </div>
          </Card>

          <SaveBar pending={isPending} notice={regionsNotice} label="Enregistrer la carte" />
        </form>
      </div>
    </div>
  )
}

function SaveBar({ pending, notice, label }: { pending: boolean; notice: Notice; label: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className={btnPrimary}>{pending ? 'Enregistrement…' : label}</button>
      {notice && (
        <p role="status" className={`text-sm ${notice.ok ? 'text-ns font-medium' : 'text-red-700'}`}>{notice.text}</p>
      )}
    </div>
  )
}
