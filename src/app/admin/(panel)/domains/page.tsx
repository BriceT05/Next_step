'use client'
import { useEffect, useState, useTransition } from 'react'
import { DOMAINS } from '@/app/data/domains'
import { DomainIcon } from '@/app/components/icons'
import { supabase } from '@/lib/supabase'
import { fetchSettings } from '@/lib/settings'
import { DEFAULT_DOMAIN_TEXT, type DomainText, currentDomainText } from '@/lib/domains'
import { saveDomain } from '@/app/admin/actions'
import { Field, FileUpload, Loading, PageHeader, btnGhost, btnPrimary, inputCls } from '@/app/admin/ui'

const toText = (paragraphs: string[]) => paragraphs.join('\n\n')
const toParagraphs = (text: string) => text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

export default function DomainsAdmin() {
  const [texts, setTexts] = useState<Record<string, DomainText> | null>(null)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings(supabase).then(s => setTexts(currentDomainText(s.domains)))
  }, [])

  if (!texts) return <Loading />

  return (
    <div>
      <PageHeader title="Domaines"
        intro="Les textes et la photo des cinq domaines : menu, page Nos domaines, page de chaque domaine. Les couleurs et les icônes suivent la charte et ne changent pas ici." />

      <div className="space-y-4">
        {DOMAINS.map(d => (
          <section key={d.slug} className="bg-white border border-pearl rounded-2xl shadow-sm overflow-hidden">
            <button type="button" onClick={() => setOpen(open === d.slug ? null : d.slug)} aria-expanded={open === d.slug}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-cream/60 transition">
              <span className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: d.color }}>
                <DomainIcon name={d.icon} className="w-6 h-6" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display font-semibold text-ink">{texts[d.slug].name} <span className="text-muted font-normal">· {texts[d.slug].theme}</span></span>
                <span className="block text-muted text-sm truncate">{texts[d.slug].slogan}</span>
              </span>
              <span className="text-ns text-sm font-semibold">{open === d.slug ? 'Fermer' : 'Modifier'}</span>
            </button>
            {open === d.slug && (
              <div className="border-t border-pearl p-4 sm:p-6">
                <DomainForm slug={d.slug} initial={texts[d.slug]}
                  onSaved={t => setTexts(all => ({ ...all!, [d.slug]: t }))} />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

function DomainForm({ slug, initial, onSaved }: { slug: string; initial: DomainText; onSaved: (t: DomainText) => void }) {
  const [form, setForm] = useState(initial)
  const [text, setText] = useState(toText(initial.presentation))
  const [resetKey, setResetKey] = useState(0)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const set = (patch: Partial<DomainText>) => { setNotice(null); setForm(f => ({ ...f, ...patch })) }

  const submit = (data: DomainText) =>
    startTransition(async () => {
      const res = await saveDomain(slug, data)
      if (res.error) { setNotice({ ok: false, text: res.error }); return }
      setNotice({ ok: true, text: 'Enregistré. Le site est déjà à jour.' })
      onSaved(data)
    })

  const restore = () => {
    if (!window.confirm('Revenir aux textes et à la photo d\'origine pour ce domaine ?')) return
    const base = DEFAULT_DOMAIN_TEXT[slug]
    setForm(base)
    setText(toText(base.presentation))
    setResetKey(k => k + 1)
    submit(base)
  }

  return (
    <form onSubmit={e => { e.preventDefault(); submit({ ...form, presentation: toParagraphs(text) }) }}>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nom">
          <input value={form.name} onChange={e => set({ name: e.target.value })} className={inputCls} required />
        </Field>
        <Field label="Thème">
          <input value={form.theme} onChange={e => set({ theme: e.target.value })} className={inputCls} placeholder="Ex. : Orientation" required />
        </Field>
        <Field label="Slogan" hint="Affiché en écriture manuscrite.">
          <input value={form.slogan} onChange={e => set({ slogan: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Photo de fond">
          <FileUpload key={resetKey} folder="domains" initialUrl={form.cover} onUploaded={url => set({ cover: url })} />
        </Field>
        <Field label="Mission (une phrase)" full>
          <textarea value={form.mission} onChange={e => set({ mission: e.target.value })} rows={2} className={inputCls} />
        </Field>
        <Field label="Présentation : pourquoi ce domaine ?" full hint="Une ligne vide entre deux paragraphes. Affichée sur la page du domaine.">
          <textarea value={text} onChange={e => { setNotice(null); setText(e.target.value) }} rows={7} className={inputCls} />
        </Field>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isPending} className={btnPrimary}>{isPending ? 'Enregistrement…' : 'Enregistrer'}</button>
        <button type="button" onClick={restore} disabled={isPending} className={btnGhost}>Revenir à l&apos;origine</button>
        <a href={`/domaines/${slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted hover:text-ink">Voir la page ↗</a>
        {notice && <p role="status" className={`text-sm ${notice.ok ? 'text-ns font-medium' : 'text-red-700'}`}>{notice.text}</p>}
      </div>
    </form>
  )
}
