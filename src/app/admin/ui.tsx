'use client'
import { useRef, useState } from 'react'

/* Briques d'interface communes à l'espace d'administration (charte : vert #014D40, or #C49A00). */

/** Types de demandes envoyées par les formulaires du site (champ « role » de la table submissions). */
export const SUBMISSION_ROLES: Record<string, { label: string; color: string }> = {
  inscription: { label: 'Inscription à un projet', color: '#1F6FB2' },
  benevole: { label: 'Bénévole', color: '#3C8D4F' },
  partenaire: { label: 'Partenaire', color: '#8A6C00' },
  contact: { label: 'Message', color: '#55636A' },
  reve: { label: 'Mur des rêves', color: '#C2386B' },
  // anciens formulaires
  membre: { label: 'Membre', color: '#014D40' },
  participant: { label: 'Participant', color: '#55636A' },
}

/** Suivi des demandes reçues. */
export const SUBMISSION_STATUSES: Record<string, { label: string; color: string }> = {
  nouvelle: { label: 'Nouvelle', color: '#C2386B' },
  'en-cours': { label: 'En cours', color: '#D9822B' },
  traitee: { label: 'Traitée', color: '#3C8D4F' },
  archivee: { label: 'Archivée', color: '#55636A' },
}

export const roleOf = (role: string) => SUBMISSION_ROLES[role] ?? { label: role, color: '#55636A' }

export const inputCls =
  'w-full bg-white border border-pearl rounded-xl px-4 py-2.5 text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:border-ns focus:ring-2 focus:ring-ns/10 transition'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 bg-ns text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-ns-dark transition disabled:opacity-50 disabled:cursor-not-allowed'

export const btnGhost =
  'inline-flex items-center justify-center gap-2 border border-pearl bg-white text-ink px-4 py-2 rounded-xl font-medium text-sm hover:border-ns hover:text-ns transition'

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ns">{title}</h1>
        {intro && <p className="text-muted text-sm mt-1.5 max-w-2xl">{intro}</p>}
      </div>
      {children}
    </div>
  )
}

export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white border border-pearl rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}>
      {title && <h2 className="font-display font-semibold text-ink mb-5 flex items-center gap-2"><span className="w-1.5 h-5 rounded-full bg-gold" aria-hidden />{title}</h2>}
      {children}
    </section>
  )
}

export function Field({ label, hint, full, children }: { label: string; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-ink text-sm font-medium mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-muted text-xs mt-1.5">{hint}</span>}
    </label>
  )
}

export function Empty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="text-center py-14 px-6 bg-white border border-dashed border-pearl rounded-2xl">
      <p className="font-display font-semibold text-ink">{title}</p>
      {text && <p className="text-muted text-sm mt-1.5">{text}</p>}
    </div>
  )
}

export function Loading() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Chargement">
      {[0, 1, 2].map(i => <div key={i} className="h-40 rounded-2xl bg-pearl/60 animate-pulse" />)}
    </div>
  )
}

export function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color, background: `${color}14` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden />
      {children}
    </span>
  )
}

export function EditButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="text-xs font-medium text-ns border border-ns/25 bg-white px-3 py-1.5 rounded-lg hover:bg-ns/5 hover:border-ns/50 transition disabled:opacity-50">
      Modifier
    </button>
  )
}

/** Bandeau affiché au-dessus d'un formulaire en mode modification. */
export function EditingNotice({ label, onCancel }: { label: string; onCancel: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gold/10 border border-gold/30 px-4 py-3 mb-5 text-sm">
      <span className="text-ink">Tu modifies <strong>« {label} »</strong></span>
      <button type="button" onClick={onCancel} className="font-semibold text-gold-ink hover:underline">Annuler la modification</button>
    </div>
  )
}

/** Bouton de suppression avec confirmation. */
export function DeleteButton({ onConfirm, label, disabled }: { onConfirm: () => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled}
      onClick={() => { if (window.confirm(`Supprimer « ${label} » ? Cette action est définitive.`)) onConfirm() }}
      className="text-xs font-medium text-red-700 border border-red-200 bg-white px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition disabled:opacity-50">
      Supprimer
    </button>
  )
}

/**
 * Envoi d'un fichier vers le stockage Supabase (/api/upload).
 * Renvoie l'URL publique via onUploaded, et affiche un aperçu local.
 */
export function FileUpload({ folder, accept = 'image/*', kind = 'image', onUploaded, contain, initialUrl = '' }: {
  folder: string
  accept?: string
  kind?: 'image' | 'video'
  onUploaded: (url: string) => void
  contain?: boolean
  /** Fichier déjà en ligne (mode modification) : affiché en aperçu et conservé si l'envoi échoue */
  initialUrl?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(initialUrl)
  const [state, setState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setState('uploading')
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Envoi impossible')
      onUploaded(data.url)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible')
      setState('error')
      setPreview(initialUrl)
      onUploaded(initialUrl)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className={`relative w-28 h-20 rounded-xl overflow-hidden border border-pearl shrink-0 flex items-center justify-center ${contain ? 'bg-white' : 'bg-cream'}`}>
          {preview ? (
            kind === 'video'
              ? <video src={preview} className="w-full h-full object-cover" muted />
              // eslint-disable-next-line @next/next/no-img-element
              : <img src={preview} alt="" className={`w-full h-full ${contain ? 'object-contain p-2' : 'object-cover'}`} />
          ) : (
            <svg className="w-7 h-7 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {state === 'uploading' && <div className="absolute inset-0 bg-white/70 animate-pulse" />}
        </div>
        <div className="min-w-0">
          <button type="button" onClick={() => ref.current?.click()} className={btnGhost}>
            {preview ? 'Changer le fichier' : kind === 'video' ? 'Choisir une vidéo' : 'Choisir une image'}
          </button>
          <p className="text-xs mt-1.5" role="status">
            {state === 'uploading' && <span className="text-muted">Envoi en cours…</span>}
            {state === 'done' && <span className="text-ns font-medium">Fichier envoyé</span>}
            {state === 'error' && <span className="text-red-700">{error}</span>}
          </p>
        </div>
      </div>
      <input ref={ref} type="file" accept={accept} onChange={onChange} className="sr-only" tabIndex={-1} />
    </div>
  )
}

/** Liste d'éléments modifiable : ajouter, supprimer, monter, descendre. */
export function ListEditor<T>({ items, onChange, newItem, addLabel, render }: {
  items: T[]
  onChange: (items: T[]) => void
  newItem: T
  addLabel: string
  render: (item: T, update: (patch: T extends object ? Partial<T> : T) => void) => React.ReactNode
}) {
  const update = (i: number, patch: unknown) =>
    onChange(items.map((it, k) => (k !== i ? it : typeof it === 'object' && it !== null ? { ...it, ...(patch as object) } : (patch as T))))
  const move = (i: number, step: number) => {
    const next = [...items]
    ;[next[i], next[i + step]] = [next[i + step], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 items-start rounded-xl bg-cream/60 border border-pearl p-3">
          <div className="flex-1 min-w-0">{render(item, patch => update(i, patch))}</div>
          <div className="flex flex-col gap-1 shrink-0">
            <SmallButton label="Monter" disabled={i === 0} onClick={() => move(i, -1)}>↑</SmallButton>
            <SmallButton label="Descendre" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</SmallButton>
            <SmallButton label="Retirer" danger onClick={() => onChange(items.filter((_, k) => k !== i))}>✕</SmallButton>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, newItem])} className={btnGhost}>+ {addLabel}</button>
    </div>
  )
}

function SmallButton({ label, onClick, disabled, danger, children }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={`w-8 h-8 rounded-lg border bg-white text-sm font-bold flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${
        danger ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-pearl text-ink hover:border-ns hover:text-ns'
      }`}>
      {children}
    </button>
  )
}
