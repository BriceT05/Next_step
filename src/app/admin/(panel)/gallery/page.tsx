'use client'
import { use, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { DOMAINS } from '@/app/data/domains'
import { PROJECTS } from '@/app/data/projects'
import { supabase } from '@/lib/supabase'
import type { GalleryItem } from '@/lib/supabase'
import { addGalleryItem, deleteGalleryItem, updateGalleryItem } from '@/app/admin/actions'
import {
  Badge, Card, DeleteButton, EditButton, EditingNotice, Empty, Field, FileUpload, Loading, PageHeader, btnGhost, btnPrimary, inputCls,
} from '@/app/admin/ui'

// Le tag range le média dans la galerie du projet (ou du domaine) du même nom : voir src/lib/content.ts
const GENERAL = 'Général'
const EMPTY = { label: '', sub: '', tag: PROJECTS[0].title, image_url: '', video_url: '' }

/** Couleur du domaine auquel le tag rattache le média. */
function tagColor(tag: string) {
  const project = PROJECTS.find(p => p.title === tag)
  const domain = DOMAINS.find(d => d.slug === project?.domainSlug || d.name === tag)
  return domain?.color ?? '#55636A'
}

export default function GalleryAdmin({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  // Préremplissage depuis la page Projets (?tag=…)
  const { tag: initialTag } = use(searchParams)
  const [items, setItems] = useState<GalleryItem[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ ...EMPTY, tag: initialTag || EMPTY.tag })
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [resetKey, setResetKey] = useState(0)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const fetchItems = () =>
    supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setItems(data ?? []))

  useEffect(() => { fetchItems() }, [])

  const switchType = (t: 'image' | 'video') => {
    setMediaType(t)
    // en modification, revenir au type d'origine restaure les fichiers déjà en ligne (affichés en aperçu)
    const original = editing && (editing.video_url ? 'video' : 'image') === t
    setForm(f => ({ ...f, image_url: original ? editing.image_url ?? '' : '', video_url: original ? editing.video_url ?? '' : '' }))
    setResetKey(k => k + 1)
  }

  const ready = form.label.trim() && (mediaType === 'image' ? form.image_url : form.video_url)

  const startEdit = (item: GalleryItem) => {
    setEditing(item)
    setMediaType(item.video_url ? 'video' : 'image')
    setForm({ label: item.label, sub: item.sub ?? '', tag: item.tag, image_url: item.image_url ?? '', video_url: item.video_url ?? '' })
    setResetKey(k => k + 1)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setMediaType('image')
    setForm(f => ({ ...EMPTY, tag: f.tag }))
    setResetKey(k => k + 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready) return
    const data = { label: form.label.trim(), sub: form.sub.trim(), tag: form.tag, image_url: form.image_url }
    startTransition(async () => {
      if (editing) {
        // une chaîne vide efface la vidéo si le média repasse en photo
        await updateGalleryItem(editing.id, { ...data, video_url: mediaType === 'video' ? form.video_url : '' })
      } else {
        await addGalleryItem({ ...data, video_url: form.video_url || undefined })
      }
      cancelEdit()
      await fetchItems()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteGalleryItem(id)
      if (editing?.id === id) cancelEdit()
      await fetchItems()
    })
  }

  // un ancien tag absent des listes reste sélectionnable pendant la modification
  const knownTags = [...PROJECTS.map(p => p.title), ...DOMAINS.map(d => d.name), GENERAL]
  const legacyTag = form.tag && !knownTags.includes(form.tag) ? form.tag : null

  const usedTags = useMemo(() => [...new Set((items ?? []).map(i => i.tag))], [items])
  const visible = (items ?? []).filter(i => filter === 'all' || i.tag === filter)

  return (
    <div>
      <PageHeader title="Photos & vidéos"
        intro="Chaque média est rangé dans la galerie du projet ou du domaine choisi, et dans la page Galerie du site." />

      <div ref={formRef} className="scroll-mt-24 mb-10">
      <Card title={editing ? 'Modifier un média' : 'Ajouter un média'} className={editing ? 'ring-2 ring-gold/40' : ''}>
        {editing && <EditingNotice label={editing.label} onCancel={cancelEdit} />}
        <form onSubmit={handleSubmit}>
          <div className="inline-flex p-1 rounded-xl bg-cream border border-pearl mb-5" role="radiogroup" aria-label="Type de média">
            {(['image', 'video'] as const).map(t => (
              <button key={t} type="button" role="radio" aria-checked={mediaType === t} onClick={() => switchType(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${mediaType === t ? 'bg-white text-ns shadow-sm' : 'text-muted hover:text-ink'}`}>
                {t === 'image' ? 'Photo' : 'Vidéo'}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Titre *">
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required
                className={inputCls} placeholder="Ex. : Salon d'orientation de Ziguinchor" />
            </Field>
            <Field label="Légende" hint="Une précision courte : lieu, date, nombre de participants…">
              <input value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))}
                className={inputCls} placeholder="Ex. : Mars 2026, 400 élèves" />
            </Field>
            <Field label="Projet ou domaine" full hint="Le média apparaîtra dans la galerie de ce projet (ou de ce domaine).">
              <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className={inputCls}>
                <optgroup label="Projets">
                  {PROJECTS.map(p => <option key={p.slug}>{p.title}</option>)}
                </optgroup>
                <optgroup label="Domaines">
                  {DOMAINS.map(d => <option key={d.slug} value={d.name}>{d.name} ({d.theme})</option>)}
                </optgroup>
                <option>{GENERAL}</option>
                {legacyTag && <option>{legacyTag}</option>}
              </select>
            </Field>
            {mediaType === 'image' ? (
              <Field label="Photo *">
                <FileUpload key={`img-${resetKey}`} folder="gallery" initialUrl={editing && !editing.video_url ? editing.image_url : ''}
                  onUploaded={url => setForm(f => ({ ...f, image_url: url }))} />
              </Field>
            ) : (
              <>
                <Field label="Vidéo *" hint="Format MP4 de préférence, quelques minutes au plus.">
                  <FileUpload key={`vid-${resetKey}`} folder="gallery" kind="video" accept="video/*" initialUrl={editing?.video_url ?? ''}
                    onUploaded={url => setForm(f => ({ ...f, video_url: url }))} />
                </Field>
                <Field label="Image de couverture" hint="Affichée avant la lecture de la vidéo.">
                  <FileUpload key={`cov-${resetKey}`} folder="gallery" initialUrl={editing?.video_url ? editing.image_url : ''}
                    onUploaded={url => setForm(f => ({ ...f, image_url: url }))} />
                </Field>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button type="submit" disabled={isPending || !ready} className={btnPrimary}>
              {isPending ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Ajouter à la galerie'}
            </button>
            {editing && <button type="button" onClick={cancelEdit} className={btnGhost}>Annuler</button>}
          </div>
        </form>
      </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display font-semibold text-ink text-lg">
          Médias en ligne {items && <span className="text-muted font-normal">({visible.length})</span>}
        </h2>
        {usedTags.length > 1 && (
          <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filtrer par projet" className={`${inputCls} w-auto`}>
            <option value="all">Tous les projets</option>
            {usedTags.map(t => <option key={t}>{t}</option>)}
          </select>
        )}
      </div>

      {items === null ? <Loading /> : visible.length === 0 ? (
        <Empty title="Aucun média pour l’instant" text="Ajoute une première photo avec le formulaire ci-dessus." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map(item => (
            <article key={item.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col ${editing?.id === item.id ? 'border-gold ring-2 ring-gold/30' : 'border-pearl'}`}>
              <div className="relative aspect-[4/3] bg-cream">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.label} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                ) : item.video_url ? (
                  <video src={item.video_url} className="w-full h-full object-cover" muted preload="metadata" />
                ) : null}
                {item.video_url && (
                  <span className="absolute top-2 left-2 bg-ink/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">Vidéo</span>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div>
                  <p className="text-ink text-sm font-semibold line-clamp-2">{item.label}</p>
                  {item.sub && <p className="text-muted text-xs mt-0.5 line-clamp-1">{item.sub}</p>}
                </div>
                <div><Badge color={tagColor(item.tag)}><span className="line-clamp-1">{item.tag}</span></Badge></div>
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  <EditButton disabled={isPending} onClick={() => startEdit(item)} />
                  <DeleteButton label={item.label} disabled={isPending} onConfirm={() => handleDelete(item.id)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
