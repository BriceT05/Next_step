'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { PROJECTS } from '@/app/data/projects'
import { supabase } from '@/lib/supabase'
import type { NewsArticle } from '@/lib/supabase'
import { addNewsArticle, deleteNewsArticle, updateNewsArticle } from '@/app/admin/actions'
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

const EMPTY = { category: CATEGORIES[0].label, title: '', excerpt: '', day: today(), author: 'Équipe Next Step.sn', read_time: '3 min', image_url: '' }

/** Même règle que la page projet du site : l'article y apparaît s'il cite le nom du projet. */
const linkedProjects = (text: string) => PROJECTS.filter(p => text.toLowerCase().includes(p.title.toLowerCase()))

export default function NewsAdmin() {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(EMPTY)
  const [resetKey, setResetKey] = useState(0)
  const [editing, setEditing] = useState<NewsArticle | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const fetchArticles = () =>
    supabase.from('news_articles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setArticles(data ?? []))

  useEffect(() => { fetchArticles() }, [])

  const linked = linkedProjects(`${form.title} ${form.excerpt}`)

  const startEdit = (a: NewsArticle) => {
    setEditing(a)
    setForm({
      category: a.category, title: a.title, excerpt: a.excerpt ?? '', day: isoFromFr(a.date ?? ''),
      author: a.author ?? '', read_time: a.read_time ?? '', image_url: a.image_url ?? '',
    })
    setResetKey(k => k + 1)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ ...EMPTY, day: today() })
    setResetKey(k => k + 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const color = CATEGORIES.find(c => c.label === form.category)?.color ?? editing?.category_color ?? '#55636A'
    const data = {
      category: form.category, category_color: color, title: form.title.trim(), excerpt: form.excerpt.trim(),
      // une ancienne date dans un autre format est conservée si le champ est laissé vide
      date: form.day ? frDate(form.day) : editing?.date ?? '',
      author: form.author.trim(), read_time: form.read_time.trim(), image_url: form.image_url,
    }
    startTransition(async () => {
      if (editing) await updateNewsArticle(editing.id, data)
      else await addNewsArticle(data)
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

  return (
    <div>
      <PageHeader title="Actualités" intro="Les articles apparaissent sur la page Actualités et les trois derniers sur la page d'accueil." />

      <div ref={formRef} className="scroll-mt-24 mb-10">
      <Card title={editing ? 'Modifier un article' : 'Publier un article'} className={editing ? 'ring-2 ring-gold/40' : ''}>
        {editing && <EditingNotice label={editing.title} onCancel={cancelEdit} />}
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
          <Field label="Titre *" full>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
              className={inputCls} placeholder="Ex. : Retour sur le salon d'orientation de Kolda" />
          </Field>
          <Field label="Résumé" full hint="Deux ou trois phrases, affichées sur la carte de l'article.">
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3}
              className={`${inputCls} resize-y`} placeholder="Ce qui s'est passé, pour qui, et ce qu'on en retient…" />
          </Field>
          <div className="sm:col-span-2 -mt-2 text-xs rounded-xl px-4 py-3 bg-cream border border-pearl text-muted">
            {linked.length > 0
              ? <>Cet article s&apos;affichera aussi sur la page du projet <strong className="text-ns">{linked.map(p => p.title).join(', ')}</strong>.</>
              : <>Astuce : cite le nom d&apos;un projet (ex. « {PROJECTS[0].title} ») dans le titre ou le résumé pour que l&apos;article apparaisse sur sa page.</>}
          </div>
          <Field label="Catégorie">
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
              {CATEGORIES.map(c => <option key={c.label}>{c.label}</option>)}
              {legacyCategory && <option>{legacyCategory}</option>}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} className={inputCls} />
            {editing && !form.day && editing.date && (
              <span className="block text-muted text-xs mt-1.5">Date actuelle conservée : « {editing.date} »</span>
            )}
          </Field>
          <Field label="Auteur">
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Temps de lecture">
            <input value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))} className={inputCls} placeholder="3 min" />
          </Field>
          <Field label="Image" full>
            <FileUpload key={resetKey} folder="news" initialUrl={editing?.image_url ?? ''}
              onUploaded={url => setForm(f => ({ ...f, image_url: url }))} />
          </Field>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={isPending || !form.title.trim()} className={btnPrimary}>
              {isPending ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Publier l’article'}
            </button>
            {editing && <button type="button" onClick={cancelEdit} className={btnGhost}>Annuler</button>}
          </div>
        </form>
      </Card>
      </div>

      <h2 className="font-display font-semibold text-ink text-lg mb-4">
        Articles publiés {articles && <span className="text-muted font-normal">({articles.length})</span>}
      </h2>

      {articles === null ? (
        <div className="space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-pearl/60 animate-pulse" />)}</div>
      ) : articles.length === 0 ? (
        <Empty title="Aucun article pour l’instant" text="Publie le premier avec le formulaire ci-dessus." />
      ) : (
        <ul className="space-y-3">
          {articles.map(a => (
            <li key={a.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white border rounded-2xl p-3 sm:p-4 shadow-sm ${editing?.id === a.id ? 'border-gold ring-2 ring-gold/30' : 'border-pearl'}`}>
              <div className="relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-cream">
                {a.image_url && <Image src={a.image_url} alt="" fill sizes="112px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Badge color={CATEGORIES.find(c => c.label === a.category)?.color ?? a.category_color}>{a.category}</Badge>
                <p className="text-ink font-semibold text-sm mt-1.5 line-clamp-1">{a.title}</p>
                <p className="text-muted text-xs mt-0.5">{[a.date, a.author].filter(Boolean).join(' · ')}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-auto">
                <EditButton disabled={isPending} onClick={() => startEdit(a)} />
                <DeleteButton label={a.title} disabled={isPending} onConfirm={() => handleDelete(a.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
