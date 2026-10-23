'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { PROJECTS } from '@/app/data/projects'
import { useAdminProjects } from '@/app/admin/useAdminProjects'
import type { NewsArticle } from '@/lib/supabase'
import { articleIsAbout } from '@/lib/projects'
import { addNewsArticle, deleteNewsArticle, getAllNews, updateNewsArticle, type NewsInput } from '@/app/admin/actions'
import {
  Badge, Card, DeleteButton, EditButton, EditingNotice, Empty, Field, FileUpload, PageHeader, btnGhost, btnPrimary, inputCls,
} from '@/app/admin/ui'

const CATEGORIES = [
  { label: 'Événement', color: '#C49A00' },
  { label: 'Formation', color: '#1F6FB2' },
  { label: 'Partenariat', color: '#014D40' },
  { label: 'Actualité', color: '#55636A' },
  { label: 'Opportunité', color: '#D9822B' },
]

const today = () => new Date().toISOString().slice(0, 10)
const frDate = (iso: string) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

/** « 9 mai 2026 » → « 2026-05-09 » ; chaîne vide si la date n'est pas dans ce format. */
function isoFromFr(date: string) {
  const m = date.trim().toLowerCase().match(/^(\d{1,2})(?:er)?\s+(\S+)\s+(\d{4})$/)
  const month = m ? MONTHS.indexOf(m[2]) + 1 : 0
  return m && month ? `${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}` : ''
}

/** Environ 200 mots par minute. */
const readTime = (text: string) => `${Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 200))} min`

const EMPTY = {
  category: CATEGORIES[0].label, title: '', excerpt: '', body: '', day: today(), author: 'Équipe Next Step.sn',
  read_time: '', image_url: '', project_slug: '',
}

const formatHint = 'Une ligne vide entre deux paragraphes. « ## Mon intertitre » pour un intertitre, « - » en début de ligne pour une liste.'

export default function NewsAdmin() {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(EMPTY)
  const [resetKey, setResetKey] = useState(0)
  const [editing, setEditing] = useState<NewsArticle | null>(null)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)
  const projects = useAdminProjects().projects ?? PROJECTS

  const fetchArticles = () => getAllNews().then(setArticles)

  useEffect(() => { getAllNews().then(setArticles) }, [])

  const set = (patch: Partial<typeof EMPTY>) => setForm(f => ({ ...f, ...patch }))

  const startEdit = (a: NewsArticle) => {
    setEditing(a)
    setError('')
    // un ancien article sans projet lié : on propose le projet qu'il cite
    const guessed = a.project_slug ?? projects.find(p => articleIsAbout(a, p))?.slug ?? ''
    setForm({
      category: a.category, title: a.title, excerpt: a.excerpt ?? '', body: a.body ?? '', day: isoFromFr(a.date ?? ''),
      author: a.author ?? '', read_time: a.read_time ?? '', image_url: a.image_url ?? '', project_slug: guessed,
    })
    setResetKey(k => k + 1)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ ...EMPTY, day: today() })
    setResetKey(k => k + 1)
  }

  const submit = (published: boolean) => {
    if (!form.title.trim()) return
    const color = CATEGORIES.find(c => c.label === form.category)?.color ?? editing?.category_color ?? '#55636A'
    const data: NewsInput = {
      category: form.category, category_color: color, title: form.title.trim(), excerpt: form.excerpt.trim(), body: form.body.trim(),
      // une ancienne date dans un autre format est conservée si le champ est laissé vide
      date: form.day ? frDate(form.day) : editing?.date ?? '',
      author: form.author.trim(), read_time: form.read_time.trim() || readTime(`${form.excerpt} ${form.body}`),
      image_url: form.image_url, published, project_slug: form.project_slug || null,
    }
    setError('')
    startTransition(async () => {
      const res = editing ? await updateNewsArticle(editing.id, data) : await addNewsArticle(data)
      if (res.error) { setError(res.error); return }
      cancelEdit()
      await fetchArticles()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNewsArticle(id)
      if (editing?.id === id) cancelEdit()
      await fetchArticles()
    })
  }

  const legacyCategory = CATEGORIES.some(c => c.label === form.category) ? null : form.category
  const editingPublished = editing ? editing.published !== false : false
  const drafts = (articles ?? []).filter(a => a.published === false).length

  return (
    <div>
      <PageHeader title="Actualités"
        intro="Les articles publiés apparaissent sur la page Actualités, les trois derniers sur l'accueil, et sur la page du projet lié. Les brouillons restent invisibles sur le site." />

      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">{error}</p>}

      <div ref={formRef} className="scroll-mt-24 mb-10">
      <Card title={editing ? 'Modifier un article' : 'Écrire un article'} className={editing ? 'ring-2 ring-gold/40' : ''}>
        {editing && <EditingNotice label={editing.title} onCancel={cancelEdit} />}
        <form onSubmit={e => { e.preventDefault(); submit(true) }} className="grid sm:grid-cols-2 gap-5">
          <Field label="Titre *" full>
            <input value={form.title} onChange={e => set({ title: e.target.value })} required
              className={inputCls} placeholder="Ex. : Retour sur le salon d'orientation de Kolda" />
          </Field>
          <Field label="Résumé" full hint="Deux ou trois phrases : affichées sur la carte de l'article et en chapeau en haut de l'article.">
            <textarea value={form.excerpt} onChange={e => set({ excerpt: e.target.value })} rows={3}
              className={`${inputCls} resize-y`} placeholder="Ce qui s'est passé, pour qui, et ce qu'on en retient…" />
          </Field>
          <Field label="Texte de l'article" full hint={formatHint}>
            <textarea value={form.body} onChange={e => set({ body: e.target.value })} rows={14}
              className={`${inputCls} resize-y`} placeholder="Raconte l'événement en détail : le contexte, le déroulé, les témoignages, la suite…" />
          </Field>
          <Field label="Projet lié" hint="L'article s'affichera aussi sur la page de ce projet.">
            <select value={form.project_slug} onChange={e => set({ project_slug: e.target.value })} className={inputCls}>
              <option value="">— Aucun projet —</option>
              {projects.map(p => <option key={p.slug} value={p.slug}>{p.title}</option>)}
            </select>
          </Field>
          <Field label="Catégorie">
            <select value={form.category} onChange={e => set({ category: e.target.value })} className={inputCls}>
              {CATEGORIES.map(c => <option key={c.label}>{c.label}</option>)}
              {legacyCategory && <option>{legacyCategory}</option>}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" value={form.day} onChange={e => set({ day: e.target.value })} className={inputCls} />
            {editing && !form.day && editing.date && (
              <span className="block text-muted text-xs mt-1.5">Date actuelle conservée : « {editing.date} »</span>
            )}
          </Field>
          <Field label="Auteur">
            <input value={form.author} onChange={e => set({ author: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Temps de lecture" hint="Calculé tout seul si tu le laisses vide.">
            <input value={form.read_time} onChange={e => set({ read_time: e.target.value })} className={inputCls}
              placeholder={readTime(`${form.excerpt} ${form.body}`)} />
          </Field>
          <Field label="Image" full>
            <FileUpload key={resetKey} folder="news" initialUrl={editing?.image_url ?? ''}
              onUploaded={url => set({ image_url: url })} />
          </Field>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={isPending || !form.title.trim()} className={btnPrimary}>
              {isPending ? 'Enregistrement…' : editingPublished ? 'Enregistrer' : 'Publier'}
            </button>
            <button type="button" disabled={isPending || !form.title.trim()} onClick={() => submit(false)} className={btnGhost}>
              {editingPublished ? 'Retirer du site (brouillon)' : 'Enregistrer en brouillon'}
            </button>
            {editing && <button type="button" onClick={cancelEdit} className="text-sm font-semibold text-muted hover:text-ink">Annuler</button>}
          </div>
        </form>
      </Card>
      </div>

      <h2 className="font-display font-semibold text-ink text-lg mb-4">
        Articles {articles && <span className="text-muted font-normal">({articles.length}{drafts ? `, dont ${drafts} brouillon${drafts > 1 ? 's' : ''}` : ''})</span>}
      </h2>

      {articles === null ? (
        <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-pearl/60 animate-pulse" />)}</div>
      ) : articles.length === 0 ? (
        <Empty title="Aucun article pour l’instant" text="Écris le premier avec le formulaire ci-dessus." />
      ) : (
        <ul className="space-y-3">
          {articles.map(a => {
            const draft = a.published === false
            const project = projects.find(p => articleIsAbout(a, p))
            return (
              <li key={a.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white border rounded-2xl p-3 sm:p-4 shadow-sm ${editing?.id === a.id ? 'border-gold ring-2 ring-gold/30' : 'border-pearl'} ${draft ? 'border-dashed' : ''}`}>
                <div className={`relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-cream ${draft ? 'opacity-60' : ''}`}>
                  {a.image_url && <Image src={a.image_url} alt="" fill sizes="112px" className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5">
                    {draft && <Badge color="#8A6C00">Brouillon</Badge>}
                    <Badge color={CATEGORIES.find(c => c.label === a.category)?.color ?? a.category_color}>{a.category}</Badge>
                  </div>
                  <p className="text-ink font-semibold text-sm mt-1.5 line-clamp-1">{a.title}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {[a.date, a.author, project && `Projet : ${project.title}`, !a.body && 'sans texte complet'].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0 ml-auto">
                  {!draft && (
                    <a href={`/actualites/${a.id}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium text-muted border border-pearl bg-white px-3 py-1.5 rounded-lg hover:text-ink">Voir ↗</a>
                  )}
                  <EditButton disabled={isPending} onClick={() => startEdit(a)} />
                  <DeleteButton label={a.title} disabled={isPending} onConfirm={() => handleDelete(a.id)} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
