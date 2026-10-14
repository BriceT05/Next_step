'use client'
import { useEffect, useMemo, useState, useTransition } from 'react'
import type { Submission } from '@/lib/supabase'
import { deleteSubmission, getSubmissions } from '@/app/admin/actions'
import { Badge, DeleteButton, Empty, PageHeader, inputCls, roleOf } from '@/app/admin/ui'

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const fetchSubmissions = () => getSubmissions().then(setSubmissions)

  useEffect(() => { fetchSubmissions() }, [])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of submissions ?? []) c[s.role] = (c[s.role] ?? 0) + 1
    return c
  }, [submissions])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (submissions ?? []).filter(s =>
      (filter === 'all' || s.role === filter) &&
      (!q || `${s.name} ${s.email} ${s.phone ?? ''} ${s.message ?? ''}`.toLowerCase().includes(q)))
  }, [submissions, filter, query])

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteSubmission(id)
      await fetchSubmissions()
    })
  }

  const tabs = [{ key: 'all', label: 'Toutes', count: submissions?.length ?? 0 },
    ...Object.keys(counts).map(k => ({ key: k, label: roleOf(k).label, count: counts[k] }))]

  return (
    <div>
      <PageHeader title="Demandes reçues"
        intro="Inscriptions aux projets, bénévoles, partenaires, messages et rêves envoyés depuis les formulaires du site." />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1" role="tablist" aria-label="Filtrer par type">
          {tabs.map(t => (
            <button key={t.key} type="button" role="tab" aria-selected={filter === t.key} onClick={() => setFilter(t.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                filter === t.key ? 'bg-ns text-white border-ns' : 'bg-white text-ink border-pearl hover:border-ns'
              }`}>
              {t.label} <span className={filter === t.key ? 'text-white/70' : 'text-muted'}>{t.count}</span>
            </button>
          ))}
        </div>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un nom, un e-mail…"
          aria-label="Rechercher" className={`${inputCls} sm:max-w-xs sm:ml-auto`} />
      </div>

      {submissions === null ? (
        <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-28 rounded-2xl bg-pearl/60 animate-pulse" />)}</div>
      ) : visible.length === 0 ? (
        <Empty title={submissions.length === 0 ? 'Aucune demande pour l’instant' : 'Aucun résultat'}
          text={submissions.length === 0 ? 'Les demandes envoyées depuis le site apparaîtront ici.' : 'Essaie un autre filtre ou une autre recherche.'} />
      ) : (
        <ul className="space-y-3">
          {visible.map(s => {
            const role = roleOf(s.role)
            const phone = s.phone?.replace(/\D/g, '')
            return (
              <li key={s.id} className="bg-white border border-pearl rounded-2xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: role.color }}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                      <Badge color={role.color}>{role.label}</Badge>
                      <span className="text-muted text-xs">{fmt(s.created_at)}</span>
                    </div>
                    <p className="font-display font-semibold text-ink">{s.name || 'Sans nom'}</p>
                    {(s.email || s.phone) && (
                      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-sm">
                        {s.email && <a href={`mailto:${s.email}`} className="text-ns hover:underline break-all">{s.email}</a>}
                        {s.phone && <a href={`tel:${s.phone}`} className="text-muted hover:text-ink">{s.phone}</a>}
                      </div>
                    )}
                    {s.message && (
                      <p className="text-ink/80 text-sm mt-3 leading-relaxed whitespace-pre-line bg-cream rounded-xl px-4 py-3">
                        {s.message}
                      </p>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {phone && (
                      <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${s.name}, merci pour ta demande « ${role.label} » envoyée à Next Step.sn.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs font-medium text-[#128C7E] border border-[#25D366]/40 bg-white px-3 py-1.5 rounded-lg hover:bg-[#25D366]/10 transition text-center">
                        WhatsApp
                      </a>
                    )}
                    <DeleteButton label={s.name || role.label} disabled={isPending} onConfirm={() => handleDelete(s.id)} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
