'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Partner } from '@/lib/supabase'
import { addPartner, deletePartner, updatePartner } from '@/app/admin/actions'
import {
  Card, DeleteButton, EditButton, EditingNotice, Empty, Field, FileUpload, Loading, PageHeader, btnGhost, btnPrimary, inputCls,
} from '@/app/admin/ui'

const EMPTY = { name: '', full_name: '', website: '', logo_url: '' }

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(EMPTY)
  const [resetKey, setResetKey] = useState(0)
  const [editing, setEditing] = useState<Partner | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const fetchPartners = () =>
    supabase.from('partners').select('*').order('created_at', { ascending: true })
      .then(({ data }) => setPartners(data ?? []))

  useEffect(() => { fetchPartners() }, [])

  const startEdit = (p: Partner) => {
    setEditing(p)
    setForm({ name: p.name, full_name: p.full_name ?? '', website: p.website ?? '', logo_url: p.logo_url ?? '' })
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
    const data = { name: form.name.trim(), full_name: form.full_name.trim(), logo_url: form.logo_url }
    startTransition(async () => {
      // en modification, une chaîne vide efface le site web
      if (editing) await updatePartner(editing.id, { ...data, website })
      else await addPartner({ ...data, website: website || undefined })
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

  return (
    <div>
      <PageHeader title="Partenaires"
        intro="Dès qu'un partenaire est ajouté ici, cette liste remplace celle par défaut sur l'accueil et la page Nos partenaires." />

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

      <h2 className="font-display font-semibold text-ink text-lg mb-4">
        Partenaires en ligne {partners && <span className="text-muted font-normal">({partners.length})</span>}
      </h2>

      {partners === null ? <Loading /> : partners.length === 0 ? (
        <Empty title="Aucun partenaire enregistré" text="Le site affiche pour l'instant la liste par défaut du cahier des charges." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map(p => (
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
      )}
    </div>
  )
}
