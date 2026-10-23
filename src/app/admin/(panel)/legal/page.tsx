'use client'
import { useEffect, useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase'
import { type LegalSettings, fetchSettings } from '@/lib/settings'
import { saveLegal } from '@/app/admin/actions'
import { Card, Field, Loading, PageHeader, btnPrimary, inputCls } from '@/app/admin/ui'

const PAGES = [
  { key: 'mentions', label: 'Mentions légales', href: '/mentions-legales' },
  { key: 'privacy', label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
] as const

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const thisMonth = () => { const d = new Date(); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}` }

export default function LegalAdmin() {
  const [legal, setLegal] = useState<LegalSettings | null>(null)
  const [tab, setTab] = useState<'mentions' | 'privacy'>('mentions')
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { fetchSettings(supabase).then(s => setLegal(s.legal)) }, [])

  if (!legal) return <Loading />

  const page = legal[tab]
  const set = (patch: Partial<typeof page>) => { setNotice(null); setLegal({ ...legal, [tab]: { ...page, ...patch } }) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await saveLegal(legal)
      setNotice(res.error ? { ok: false, text: res.error } : { ok: true, text: 'Enregistré. Le site est déjà à jour.' })
    })
  }

  return (
    <div>
      <PageHeader title="Pages légales"
        intro="Les mentions légales et la politique de confidentialité, liées depuis le pied de page, les formulaires et le bandeau cookies." />

      <div className="flex gap-2 mb-5" role="tablist">
        {PAGES.map(p => (
          <button key={p.key} type="button" role="tab" aria-selected={tab === p.key} onClick={() => setTab(p.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${tab === p.key ? 'bg-ns text-white border-ns' : 'bg-white text-ink border-pearl hover:border-ns'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card title={PAGES.find(p => p.key === tab)!.label}>
          <div className="grid gap-5">
            <Field label="Dernière mise à jour" hint="Affichée sous le titre de la page.">
              <div className="flex flex-wrap gap-2">
                <input value={page.updated} onChange={e => set({ updated: e.target.value })} className={`${inputCls} sm:max-w-xs`} placeholder="Ex. : octobre 2026" />
                <button type="button" onClick={() => set({ updated: thisMonth() })}
                  className="text-sm font-semibold text-ns hover:underline px-2">Mettre « {thisMonth()} »</button>
              </div>
            </Field>
            <Field label="Texte de la page *"
              hint="Une ligne vide entre deux paragraphes. « ## » en début de ligne pour un titre de section, « - » pour une liste, [texte](adresse) pour un lien. Les adresses e-mail deviennent cliquables.">
              <textarea value={page.body} onChange={e => set({ body: e.target.value })} rows={24} required className={`${inputCls} font-mono text-[13px]`} />
            </Field>
          </div>
        </Card>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isPending} className={btnPrimary}>{isPending ? 'Enregistrement…' : 'Enregistrer les deux pages'}</button>
          <a href={PAGES.find(p => p.key === tab)!.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-muted hover:text-ink">Voir la page ↗</a>
          {notice && <p role="status" className={`text-sm ${notice.ok ? 'text-ns font-medium' : 'text-red-700'}`}>{notice.text}</p>}
        </div>
      </form>
    </div>
  )
}
