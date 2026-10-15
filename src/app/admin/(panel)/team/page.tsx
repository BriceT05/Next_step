'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { TeamMemberRow } from '@/lib/supabase'
import { DOMAINS } from '@/app/data/domains'
import { addTeamMember, deleteTeamMember, seedTeam, updateTeamMember, type TeamMemberInput } from '@/app/admin/actions'
import {
  Badge, Card, DeleteButton, EditButton, EditingNotice, Empty, Field, FileUpload, Loading, PageHeader, btnGhost, btnPrimary, inputCls,
} from '@/app/admin/ui'

type Role = TeamMemberRow['role']

const ROLES: Record<Role, { label: string; hint: string; color: string }> = {
  titulaire: { label: 'Titulaire du poste', hint: 'En haut de l\'arbre (ex. : Président, Responsable du domaine).', color: '#8A6C00' },
  adjoint: { label: 'Adjoint(e)', hint: 'Sous un titulaire (ex. : Vice-présidente sous le Président).', color: '#014D40' },
  membre: { label: 'Membre', hint: 'Affiché dans la grille des membres, sous l\'arbre.', color: '#55636A' },
}

/** Sections de l'équipe : '' = bureau exécutif, sinon le slug du domaine. */
const SECTIONS = [{ value: '', label: 'Bureau exécutif', color: '#014D40' }, ...DOMAINS.map(d => ({ value: d.slug, label: d.name, color: d.color }))]
const sectionOf = (m: TeamMemberRow) => m.domain_slug ?? ''

const EMPTY = { name: '', post: '', role: 'membre' as Role, parent_id: '', section: '', photo_url: '', bio: '', quote: '', sort_order: '0' }

export default function TeamAdmin() {
  const [members, setMembers] = useState<TeamMemberRow[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(EMPTY)
  const [resetKey, setResetKey] = useState(0)
  const [editing, setEditing] = useState<TeamMemberRow | null>(null)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const fetchMembers = () =>
    supabase.from('team_members').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => setMembers((data ?? []) as TeamMemberRow[]))

  useEffect(() => { fetchMembers() }, [])

  // titulaires auxquels un adjoint peut se rattacher : même section, pas lui-même
  const leads = (members ?? []).filter(m => m.role === 'titulaire' && sectionOf(m) === form.section && m.id !== editing?.id)

  const startEdit = (m: TeamMemberRow) => {
    setEditing(m)
    setError('')
    setForm({
      name: m.name, post: m.post, role: m.role, parent_id: m.parent_id ?? '', section: sectionOf(m),
      photo_url: m.photo_url ?? '', bio: m.bio ?? '', quote: m.quote ?? '', sort_order: String(m.sort_order ?? 0),
    })
    setResetKey(k => k + 1)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY)
    setResetKey(k => k + 1)
  }

  const run = (task: () => Promise<{ error?: string }>, after?: () => void) => {
    setError('')
    startTransition(async () => {
      const res = await task()
      if (res.error) { setError(res.error); return }
      after?.()
      await fetchMembers()
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const data: TeamMemberInput = {
      name: form.name.trim(),
      post: form.post.trim(),
      role: form.role,
      parent_id: form.role === 'adjoint' && form.parent_id ? form.parent_id : null,
      domain_slug: form.section || null,
      photo_url: form.photo_url,
      bio: form.bio.trim(),
      quote: form.quote.trim(),
      sort_order: Number(form.sort_order) || 0,
    }
    run(() => editing ? updateTeamMember(editing.id, data) : addTeamMember(data), cancelEdit)
  }

  const handleDelete = (id: string) =>
    run(() => deleteTeamMember(id), () => { if (editing?.id === id) cancelEdit() })

  const set = (patch: Partial<typeof EMPTY>) => setForm(f => ({ ...f, ...patch }))
  const parentName = (id: string | null) => members?.find(m => m.id === id)?.name

  return (
    <div>
      <PageHeader title="Équipe"
        intro="Les membres saisis ici s'affichent sur la page Notre équipe et sur la page de leur domaine. En tête du bureau : le président (titulaire) et la vice-présidente (adjointe rattachée au président)." />

      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">{error}</p>}

      <div ref={formRef} className="scroll-mt-24 mb-10">
      <Card title={editing ? 'Modifier un membre' : 'Ajouter un membre'} className={editing ? 'ring-2 ring-gold/40' : ''}>
        {editing && <EditingNotice label={editing.name} onCancel={cancelEdit} />}
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <Field label="Nom complet *">
            <input value={form.name} onChange={e => set({ name: e.target.value })} required
              className={inputCls} placeholder="Ex. : Awa Diop" />
          </Field>
          <Field label="Poste" hint="Laisser vide pour un simple membre.">
            <input value={form.post} onChange={e => set({ post: e.target.value })}
              className={inputCls} placeholder="Ex. : Président, Vice-présidente, Responsable Yoonal" />
          </Field>
          <Field label="Section">
            <select value={form.section} onChange={e => set({ section: e.target.value, parent_id: '' })} className={inputCls}>
              {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Rôle" hint={ROLES[form.role].hint}>
            <select value={form.role} onChange={e => set({ role: e.target.value as Role })} className={inputCls}>
              {(Object.keys(ROLES) as Role[]).map(r => <option key={r} value={r}>{ROLES[r].label}</option>)}
            </select>
          </Field>
          {form.role === 'adjoint' && (
            <Field label="Rattaché(e) à" hint={leads.length === 0 ? 'Ajoute d\'abord un titulaire dans cette section.' : undefined}>
              <select value={form.parent_id} onChange={e => set({ parent_id: e.target.value })} className={inputCls}>
                <option value="">— Choisir un titulaire —</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name}{l.post ? ` · ${l.post}` : ''}</option>)}
              </select>
            </Field>
          )}
          <Field label="Ordre d'affichage" hint="Les plus petits nombres passent en premier (le président : 1).">
            <input type="number" value={form.sort_order} onChange={e => set({ sort_order: e.target.value })}
              className={inputCls} inputMode="numeric" />
          </Field>
          <Field label="Photo" hint="Photo de face, cadrée sur le visage (format carré de préférence).">
            <FileUpload key={resetKey} folder="team" initialUrl={editing?.photo_url ?? ''}
              onUploaded={url => set({ photo_url: url })} />
          </Field>
          <Field label="Citation" hint="Facultatif : visible au dos de la carte.">
            <input value={form.quote} onChange={e => set({ quote: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Courte biographie" hint="Facultatif : visible au dos de la carte." full>
            <textarea value={form.bio} onChange={e => set({ bio: e.target.value })} rows={3} className={inputCls} />
          </Field>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={isPending || !form.name.trim()} className={btnPrimary}>
              {isPending ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Ajouter le membre'}
            </button>
            {editing && <button type="button" onClick={cancelEdit} className={btnGhost}>Annuler</button>}
          </div>
        </form>
      </Card>
      </div>

      {members === null ? <Loading /> : members.length === 0 ? (
        <div className="space-y-4">
          <Empty title="Aucun membre enregistré"
            text="Le site affiche pour l'instant l'organigramme par défaut (postes sans noms). Tu peux le recopier ici pour n'avoir plus qu'à remplir les noms et les photos." />
          <div className="text-center">
            <button type="button" disabled={isPending} onClick={() => run(seedTeam)} className={btnGhost}>
              {isPending ? 'Création…' : 'Créer l\'organigramme de départ'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {SECTIONS.map(section => {
            const list = members.filter(m => sectionOf(m) === section.value)
            if (list.length === 0) return null
            return (
              <section key={section.value}>
                <h2 className="font-display font-semibold text-ink text-lg mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: section.color }} aria-hidden />
                  {section.label} <span className="text-muted font-normal">({list.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {list.map(m => (
                    <article key={m.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col items-center text-center ${editing?.id === m.id ? 'border-gold ring-2 ring-gold/30' : 'border-pearl'}`}>
                      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-cream mb-3 flex items-center justify-center">
                        {m.photo_url
                          ? <Image src={m.photo_url} alt={m.name} fill sizes="80px" className="object-cover" />
                          : <span className="font-display text-ns font-bold text-xl">{m.name.slice(0, 2).toUpperCase()}</span>}
                      </div>
                      <p className="text-ink font-semibold text-sm">{m.name}</p>
                      {m.post && <p className="text-muted text-xs mt-0.5 leading-snug">{m.post}</p>}
                      <div className="mt-2"><Badge color={ROLES[m.role].color}>{ROLES[m.role].label}</Badge></div>
                      {m.role === 'adjoint' && (
                        <p className="text-muted text-[11px] mt-1">{parentName(m.parent_id) ? `Rattaché(e) à ${parentName(m.parent_id)}` : 'Sans titulaire : affiché parmi les membres'}</p>
                      )}
                      <div className="mt-auto pt-3 flex flex-wrap justify-center gap-2">
                        <EditButton disabled={isPending} onClick={() => startEdit(m)} />
                        <DeleteButton label={m.name} disabled={isPending} onConfirm={() => handleDelete(m.id)} />
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
