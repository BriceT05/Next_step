'use client'
import { useEffect, useMemo, useState, useTransition } from 'react'
import type { Submission, SubmissionStatus } from '@/lib/supabase'
import { deleteSubmission, getSubmissions, updateSubmission } from '@/app/admin/actions'
import { Badge, DeleteButton, Empty, PageHeader, SUBMISSION_STATUSES, btnGhost, inputCls, roleOf } from '@/app/admin/ui'

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const statusOf = (s: Submission): SubmissionStatus => s.status ?? 'nouvelle'

/** Filtres de statut : par défaut, tout sauf les demandes archivées. */
const STATUS_FILTERS = [
  { key: 'actives', label: 'À suivre (non archivées)' },
  { key: 'nouvelle', label: 'Nouvelles' },
  { key: 'en-cours', label: 'En cours' },
  { key: 'traitee', label: 'Traitées' },
  { key: 'archivee', label: 'Archivées' },
  { key: 'toutes', label: 'Toutes' },
]

/** Fichier CSV lisible par Excel : séparateur « ; », encodage UTF-8 avec BOM pour les accents. */
function downloadCsv(rows: Submission[]) {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`
  const header = ['Date', 'Type', 'Nom', 'E-mail', 'Téléphone', 'Message', 'Statut', 'Notes']
  const lines = rows.map(s => [
    new Date(s.created_at).toLocaleString('fr-FR'),
    roleOf(s.role).label,
    s.name ?? '',
    s.email ?? '',
    s.phone ?? '',
    s.message ?? '',
    SUBMISSION_STATUSES[statusOf(s)].label,
    s.notes ?? '',
  ].map(cell).join(';'))
  const csv = '﻿' + [header.map(cell).join(';'), ...lines].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `demandes-next-step-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('actives')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const fetchSubmissions = () => getSubmissions().then(setSubmissions)

  useEffect(() => { getSubmissions().then(setSubmissions) }, [])

  const byStatus = useMemo(() => (submissions ?? []).filter(s =>
    statusFilter === 'toutes' ? true
      : statusFilter === 'actives' ? statusOf(s) !== 'archivee'
        : statusOf(s) === statusFilter), [submissions, statusFilter])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of byStatus) c[s.role] = (c[s.role] ?? 0) + 1
    return c
  }, [byStatus])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return byStatus.filter(s =>
      (filter === 'all' || s.role === filter) &&
      (!q || `${s.name} ${s.email} ${s.phone ?? ''} ${s.message ?? ''} ${s.notes ?? ''}`.toLowerCase().includes(q)))
  }, [byStatus, filter, query])

  const newCount = (submissions ?? []).filter(s => statusOf(s) === 'nouvelle').length

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteSubmission(id)
      await fetchSubmissions()
    })
  }

  /** Mise à jour affichée tout de suite, annulée si l'enregistrement échoue. */
  const handleUpdate = async (id: string, patch: { status?: SubmissionStatus; notes?: string }) => {
    setError('')
    const before = submissions
    setSubmissions(list => (list ?? []).map(s => (s.id === id ? { ...s, ...patch } : s)))
    const res = await updateSubmission(id, patch)
    if (res.error) {
      setSubmissions(before)
      setError(res.error)
      return false
    }
    return true
  }

  const tabs = [{ key: 'all', label: 'Toutes', count: byStatus.length },
    ...Object.keys(counts).map(k => ({ key: k, label: roleOf(k).label, count: counts[k] }))]

  return (
    <div>
      <PageHeader title="Demandes reçues"
        intro={`Inscriptions aux projets, bénévoles, partenaires, messages et rêves envoyés depuis les formulaires du site.${newCount ? ` ${newCount} nouvelle${newCount > 1 ? 's' : ''} à traiter.` : ''}`}>
        <button type="button" onClick={() => downloadCsv(visible)} disabled={visible.length === 0} className={btnGhost}>
          Exporter vers Excel ({visible.length})
        </button>
      </PageHeader>

      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">{error}</p>}

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-6">
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
        <div className="flex gap-3 lg:ml-auto">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filtrer par statut"
            className={`${inputCls} sm:w-56`}>
            {STATUS_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un nom, un e-mail…"
            aria-label="Rechercher" className={`${inputCls} sm:w-64`} />
        </div>
      </div>

      {submissions === null ? (
        <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-28 rounded-2xl bg-pearl/60 animate-pulse" />)}</div>
      ) : visible.length === 0 ? (
        <Empty title={submissions.length === 0 ? 'Aucune demande pour l’instant' : 'Aucun résultat'}
          text={submissions.length === 0 ? 'Les demandes envoyées depuis le site apparaîtront ici.' : 'Essaie un autre filtre ou une autre recherche.'} />
      ) : (
        <ul className="space-y-3">
          {visible.map(s => (
            <SubmissionItem key={s.id} submission={s} disabled={isPending}
              onUpdate={patch => handleUpdate(s.id, patch)} onDelete={() => handleDelete(s.id)} />
          ))}
        </ul>
      )}
    </div>
  )
}

function SubmissionItem({ submission: s, disabled, onUpdate, onDelete }: {
  submission: Submission
  disabled: boolean
  onUpdate: (patch: { status?: SubmissionStatus; notes?: string }) => Promise<boolean>
  onDelete: () => void
}) {
  const role = roleOf(s.role)
  const status = statusOf(s)
  const phone = s.phone?.replace(/\D/g, '')
  const [notes, setNotes] = useState(s.notes ?? '')
  const [notesOpen, setNotesOpen] = useState(Boolean(s.notes))
  const [saving, setSaving] = useState(false)
  const notesChanged = notes !== (s.notes ?? '')

  const saveNotes = async () => {
    setSaving(true)
    await onUpdate({ notes })
    setSaving(false)
  }

  return (
    <li className={`bg-white border border-pearl rounded-2xl p-5 shadow-sm border-l-4 ${status === 'archivee' ? 'opacity-70' : ''}`}
      style={{ borderLeftColor: role.color }}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            <Badge color={role.color}>{role.label}</Badge>
            {status === 'nouvelle' && <Badge color={SUBMISSION_STATUSES.nouvelle.color}>Nouvelle</Badge>}
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

          {notesOpen ? (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-muted mb-1" htmlFor={`notes-${s.id}`}>Notes internes (jamais visibles sur le site)</label>
              <textarea id={`notes-${s.id}`} value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className={inputCls} placeholder="Ex. : rappelé le 24/10, attend la date du forum" />
              {notesChanged && (
                <button type="button" onClick={saveNotes} disabled={saving}
                  className="mt-2 text-xs font-semibold text-white bg-ns px-3 py-1.5 rounded-lg hover:bg-ns-dark disabled:opacity-50">
                  {saving ? 'Enregistrement…' : 'Enregistrer la note'}
                </button>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => setNotesOpen(true)} className="mt-3 text-xs font-semibold text-ns hover:underline">
              + Ajouter une note
            </button>
          )}
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0 sm:w-36">
          <select value={status} onChange={e => onUpdate({ status: e.target.value as SubmissionStatus })} disabled={disabled}
            aria-label="Statut de la demande"
            className="text-xs font-semibold border rounded-lg px-2 py-1.5 bg-white"
            style={{ color: SUBMISSION_STATUSES[status].color, borderColor: `${SUBMISSION_STATUSES[status].color}66` }}>
            {Object.entries(SUBMISSION_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {phone && (
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${s.name}, merci pour ta demande « ${role.label} » envoyée à Next Step.sn.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium text-[#128C7E] border border-[#25D366]/40 bg-white px-3 py-1.5 rounded-lg hover:bg-[#25D366]/10 transition text-center">
              WhatsApp
            </a>
          )}
          <DeleteButton label={s.name || role.label} disabled={disabled} onConfirm={onDelete} />
        </div>
      </div>
    </li>
  )
}
