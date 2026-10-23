'use client'
import { use, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { DOMAINS } from '@/app/data/domains'
import { PROJECTS, type ProjectData } from '@/app/data/projects'
import { supabase } from '@/lib/supabase'
import type { GalleryItem } from '@/lib/supabase'
import { addGalleryItem, addGalleryItems, deleteGalleryItem, updateGalleryItem } from '@/app/admin/actions'
import { useAdminProjects } from '@/app/admin/useAdminProjects'
import {
  Badge, Card, DeleteButton, EditButton, EditingNotice, Empty, Field, FileUpload, Loading, PageHeader, btnGhost, btnPrimary, inputCls,
} from '@/app/admin/ui'

// Le tag range le média dans la galerie du projet (ou du domaine) du même nom : voir src/lib/content.ts
const GENERAL = 'Général'
// tag vide = le premier projet de la liste
const EMPTY = { label: '', sub: '', tag: '', image_url: '', video_url: '' }

/** Couleur du domaine auquel le tag rattache le média. */
function tagColor(tag: string, projects: ProjectData[]) {
  const project = projects.find(p => p.title === tag)
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

  // Projets enregistrés dans l'admin (les six projets par défaut tant qu'aucun n'a été modifié)
  const { projects: dbProjects } = useAdminProjects()
  const projects = dbProjects ?? PROJECTS
  const tag = form.tag || projects[0]?.title || GENERAL

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
    const data = { label: form.label.trim(), sub: form.sub.trim(), tag, image_url: form.image_url }
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
  const knownTags = [...projects.map(p => p.title), ...DOMAINS.map(d => d.name), GENERAL]
  const legacyTag = !knownTags.includes(tag) ? tag : null

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
              <select value={tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className={inputCls}>
                <optgroup label="Projets">
                  {projects.map(p => <option key={p.slug}>{p.title}</option>)}
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

      {!editing && (
        <div className="mb-10">
          <BulkUpload projects={projects} defaultTag={tag} onDone={fetchItems} />
        </div>
      )}

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
                <div><Badge color={tagColor(item.tag, projects)}><span className="line-clamp-1">{item.tag}</span></Badge></div>
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

/** Nom de fichier → titre lisible : « salon-kolda_2026.jpg » → « salon kolda 2026 » */
const titleFromFile = (name: string) => name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()

type BulkFile = { file: File; preview: string; state: 'waiting' | 'uploading' | 'done' | 'error'; url?: string }

/** Envoi de plusieurs photos d'un coup, rangées dans le même projet (ou domaine). */
function BulkUpload({ projects, defaultTag, onDone }: { projects: ProjectData[]; defaultTag: string; onDone: () => unknown }) {
  const [files, setFiles] = useState<BulkFile[]>([])
  const [title, setTitle] = useState('')
  const [sub, setSub] = useState('')
  const [tag, setTag] = useState(defaultTag)
  const [running, setRunning] = useState(false)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pick = (list: FileList | null) => {
    if (!list) return
    setNotice(null)
    const added = [...list].filter(f => f.type.startsWith('image/')).slice(0, 30)
      .map(file => ({ file, preview: URL.createObjectURL(file), state: 'waiting' as const }))
    setFiles(f => [...f, ...added].slice(0, 30))
  }

  const remove = (i: number) => setFiles(f => f.filter((_, k) => k !== i))

  const send = async () => {
    setRunning(true)
    setNotice(null)
    const results: BulkFile[] = [...files]
    // une par une : l'envoi reste fiable même avec une connexion lente
    for (let i = 0; i < results.length; i++) {
      if (results[i].state === 'done') continue
      results[i] = { ...results[i], state: 'uploading' }
      setFiles([...results])
      try {
        const fd = new FormData()
        fd.append('file', results[i].file)
        fd.append('folder', 'gallery')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok || !data.url) throw new Error(data.error)
        results[i] = { ...results[i], state: 'done', url: data.url }
      } catch {
        results[i] = { ...results[i], state: 'error' }
      }
      setFiles([...results])
    }

    const ok = results.filter(r => r.state === 'done' && r.url)
    const items = ok.map((r, k) => ({
      label: title.trim() ? (ok.length > 1 ? `${title.trim()} (${k + 1})` : title.trim()) : titleFromFile(r.file.name),
      sub: sub.trim(), tag, image_url: r.url!,
    }))
    const saved = items.length ? await addGalleryItems(items) : { error: undefined }
    const failed = results.length - ok.length
    if (saved.error) {
      setNotice({ ok: false, text: saved.error })
    } else {
      setNotice({
        ok: failed === 0,
        text: `${ok.length} photo${ok.length > 1 ? 's' : ''} ajoutée${ok.length > 1 ? 's' : ''}.${failed ? ` ${failed} n'ont pas pu être envoyées (fichier trop lourd ?) : réessaie-les.` : ''}`,
      })
      setFiles(results.filter(r => r.state === 'error').map(r => ({ ...r, state: 'waiting' })))
      await onDone()
    }
    setRunning(false)
  }

  return (
    <Card title="Ajouter plusieurs photos d'un coup">
      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Projet ou domaine">
          <select value={tag} onChange={e => setTag(e.target.value)} className={inputCls}>
            <optgroup label="Projets">{projects.map(p => <option key={p.slug}>{p.title}</option>)}</optgroup>
            <optgroup label="Domaines">{DOMAINS.map(d => <option key={d.slug} value={d.name}>{d.name} ({d.theme})</option>)}</optgroup>
            <option>{GENERAL}</option>
          </select>
        </Field>
        <Field label="Titre commun" hint="Numéroté automatiquement. Vide : le nom de chaque fichier.">
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="Ex. : Salon de Kolda" />
        </Field>
        <Field label="Légende commune">
          <input value={sub} onChange={e => setSub(e.target.value)} className={inputCls} placeholder="Ex. : Mars 2026" />
        </Field>
      </div>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files) }}
        className="mt-5 rounded-2xl border-2 border-dashed border-pearl bg-cream/50 p-5 text-center">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={running} className={btnGhost}>Choisir des photos</button>
        <p className="text-muted text-xs mt-2">ou glisse-les ici · 30 photos au plus par envoi</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1}
          onChange={e => { pick(e.target.files); e.target.value = '' }} />

        {files.length > 0 && (
          <ul className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-3 text-left">
            {files.map((f, i) => (
              <li key={f.preview} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-pearl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.preview} alt="" className={`w-full h-full object-cover ${f.state === 'uploading' ? 'opacity-50 animate-pulse' : ''}`} />
                {f.state === 'done' && <span className="absolute inset-x-0 bottom-0 bg-ns/90 text-white text-[10px] font-bold text-center py-0.5">Envoyée</span>}
                {f.state === 'error' && <span className="absolute inset-x-0 bottom-0 bg-red-700/90 text-white text-[10px] font-bold text-center py-0.5">Échec</span>}
                {!running && (
                  <button type="button" onClick={() => remove(i)} aria-label="Retirer cette photo"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-ink text-xs font-bold">✕</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={send} disabled={running || files.length === 0} className={btnPrimary}>
          {running ? 'Envoi en cours…' : `Envoyer ${files.length || ''} photo${files.length > 1 ? 's' : ''}`.replace('  ', ' ')}
        </button>
        {notice && <p role="status" className={`text-sm ${notice.ok ? 'text-ns font-medium' : 'text-red-700'}`}>{notice.text}</p>}
      </div>
    </Card>
  )
}
