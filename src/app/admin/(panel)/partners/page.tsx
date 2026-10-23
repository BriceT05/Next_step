'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Partner } from '@/lib/supabase'
import { PARTNER_TYPES, PARTNERS, type PartnerType } from '@/app/data/site'
import { addPartner, deletePartner, seedPartners, updatePartner } from '@/app/admin/actions'
import {
  Card, DeleteButton, EditButton, EditingNotice, Empty, Field, FileUpload, Loading, PageHeader, btnGhost, btnPrimary, inputCls,
} from '@/app/admin/ui'

const TYPES = Object.keys(PARTNER_TYPES) as PartnerType[]
const EMPTY = { name: '', full_name: '', website: '', logo_url: '', type: 'institution' as PartnerType }
const typeOf = (p: Partner): PartnerType => (p.type && p.type in PARTNER_TYPES ? (p.type as PartnerType) : 'terrain')

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(EMPTY)
  const [resetKey, setResetKey] = useState(0)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const fetchPartners = () =>
    supabase.from('partners').select('*').order('created_at', { ascending: true })
      .then(({ data }) => setPartners(data ?? []))

  useEffect(() => { fetchPartners() }, [])

  const startEdit = (p: Partner) => {
    setEditing(p)
    setForm({ name: p.name, full_name: p.full_name ?? '', website: p.website ?? '', logo_url: p.logo_url ?? '', type: typeOf(p) })
    setResetKey(k => k + 1)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY)
    setResetKey(k => k + 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const raw = form.website.trim()
    const website = raw ? (/^https?:\/\//.test(raw) ? raw : `https://${raw}`) : ''
    const data = { name: form.name.trim(), full_name: form.full_name.trim(), logo_url: form.logo_url, type: form.type }
    setError('')
    startTransition(async () => {
      // en modification, une chaîne vide efface le site web
      const res = editing
        ? await updatePartner(editing.id, { ...data, website })
        : await addPartner({ ...data, website: website || undefined })
      if (res.error) { setError(res.error); return }
      cancelEdit()
      await fetchPartners()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deletePartner(id)
      if (editing?.id === id) cancelEdit()
      await fetchPartners()
    })
  }

  const missingDefaults = PARTNERS.filter(d => !(partners ?? []).some(p => p.name === d.name))

  const handleSeed = () => {
    setError('')
    startTransition(async () => {
      const res = await seedPartners()
      if (res.error) setError(res.error)
      await fetchPartners()
    })
  }

  return (
    <div>
      <PageHeader title="Partenaires"
        intro="Les partenaires s'affichent sur l'accueil (bandeau défilant) et sur la page Nos partenaires, rangés par type." />

      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">{error}</p>}

      {missingDefaults.length > 0 && (partners?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-xl bg-gold/10 border border-gold/30 text-ink text-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span>
            Le site n&apos;affiche que les partenaires enregistrés ici. {missingDefaults.length} partenaire{missingDefaults.length > 1 ? 's' : ''} de
            la liste de départ n&apos;y {missingDefaults.length > 1 ? 'sont' : 'est'} pas : {missingDefaults.map(p => p.name).join(', ')}.
          </span>
          <button type="button" disabled={isPending} onClick={handleSeed} className={btnGhost}>
            {isPending ? 'Ajout…' : missingDefaults.length > 1 ? 'Les ajouter' : 'L\'ajouter'}
          </button>
        </div>
      )}

      <div ref={formRef} className="scroll-mt-24 mb-10">
      <Card title={editing ? 'Modifier un partenaire' : 'Ajouter un partenaire'} className={editing ? 'ring-2 ring-gold/40' : ''}>
        {editing && <EditingNotice label={editing.name} onCancel={cancelEdit} />}
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <Field label="Nom court *">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
              className={inputCls} placeholder="Ex. : UASZ" />
          </Field>
          <Field label="Nom complet" hint="C'est ce nom qui s'affiche sur le site, s'il est renseigné.">
            <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className={inputCls} placeholder="Ex. : Université Assane Seck de Ziguinchor" />
          </Field>
          <Field label="Type *" hint="La rubrique de la page Nos partenaires.">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as PartnerType }))} className={inputCls}>
              {TYPES.map(t => <option key={t} value={t}>{PARTNER_TYPES[t]}</option>)}
            </select>
          </Field>
          <Field label="Site web">
            <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              className={inputCls} placeholder="Ex. : www.exemple.sn" inputMode="url" />
          </Field>
          <Field label="Logo" hint="PNG à fond transparent de préférence.">
            <FileUpload key={resetKey} folder="partners" contain initialUrl={editing?.logo_url ?? ''}
              onUploaded={url => setForm(f => ({ ...f, logo_url: url }))} />
          </Field>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={isPending || !form.name.trim()} className={btnPrimary}>
              {isPending ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Ajouter le partenaire'}
            </button>
            {editing && <button type="button" onClick={cancelEdit} className={btnGhost}>Annuler</button>}
          </div>
        </form>
      </Card>
      </div>

      {partners === null ? <Loading /> : partners.length === 0 ? (
        <div className="space-y-4">
          <Empty title="Aucun partenaire enregistré"
            text={`Le site affiche la liste par défaut (${PARTNERS.length} partenaires). Elle sera recopiée ici au premier ajout ; tu peux aussi la recopier tout de suite pour la modifier.`} />
          <div className="text-center">
            <button type="button" disabled={isPending} onClick={handleSeed} className={btnGhost}>
              {isPending ? 'Copie…' : 'Recopier la liste par défaut'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {TYPES.map(t => {
            const list = partners.filter(p => typeOf(p) === t)
            if (list.length === 0) return null
            return (
        <section key={t}>
        <h2 className="font-display font-semibold text-ink text-lg mb-4">
          {PARTNER_TYPES[t]} <span className="text-muted font-normal">({list.length})</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map(p => (
            <article key={p.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col items-center text-center ${editing?.id === p.id ? 'border-gold ring-2 ring-gold/30' : 'border-pearl'}`}>
              <div className="relative w-full h-20 rounded-xl bg-cream flex items-center justify-center mb-3 overflow-hidden">
                {p.logo_url
                  ? <Image src={p.logo_url} alt={p.name} fill sizes="200px" className="object-contain p-3" />
                  : <span className="font-display text-ns font-bold text-2xl">{p.name.slice(0, 2).toUpperCase()}</span>}
              </div>
              <p className="text-ink font-semibold text-sm">{p.name}</p>
              {p.full_name && <p className="text-muted text-xs mt-0.5 leading-snug line-clamp-2">{p.full_name}</p>}
              {p.website && (
                <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-ns text-xs mt-1 hover:underline break-all line-clamp-1">
                  {p.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
              <div className="mt-auto pt-3 flex flex-wrap justify-center gap-2">
                <EditButton disabled={isPending} onClick={() => startEdit(p)} />
                <DeleteButton label={p.name} disabled={isPending} onConfirm={() => handleDelete(p.id)} />
              </div>
            </article>
          ))}
        </div>
        </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
